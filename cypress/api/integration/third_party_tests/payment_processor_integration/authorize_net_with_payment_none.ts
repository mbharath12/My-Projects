/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { organizationAPI } from "../../../api_support/organization";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemValidator } from "../../../api_validation/line_item_validator";
import {
  PaymentProcessorFieldDetails,
  paymentProcessorValidator,
} from "../../../api_validation/payment_processor_validation";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//PP2669 - Verify If the default_payment_processor_method is set to "NONE", then Autopay should not be triggered

TestFilters(["regression", "paymentProcessor", "authorizeNet"], () => {
  //Validate authorize.net payment processor - default payment processor method is set to none
  describe("Validate payment processing - default payment parameter is none ", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let response;
    let accountStatus;
    const account_effective_at = "2021-11-20T09:11:28+00:00";
    const autoEnabled = false;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //configure authorize.net
      const filename = "credentials/authorize_net_configs.json";
      const configJSON = Constants.templateFixtureFilePath.concat("/", filename);
      cy.fixture(configJSON).then((processorJson) => {
        processorJson.merchant_name = Cypress.env("MERCHANT_NAME");
        processorJson.transaction_key = Cypress.env("TRANSACTION_KEY");
        organizationAPI.updatePaymentProcessorConfigs(processorJson).then((response) => {
          paymentProcessorValidator.validatePaymentProcessConfigResponse(response, "AUTHORIZE_NET");
        });
      });
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
    });

    //Create a new account and set payment processor
    it(`should have create account and assign customer `, async () => {
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: customerID,
        effective_at: account_effective_at,
        autopay_enabled: autoEnabled,
        default_payment_processor_method: "NONE",
      };
      //Create an account with payment processor
      const response = await promisify(
        accountAPI.updateNCreateAccount("account_payment_processor_debit_card_authorize_net.json", accountPayload)
      );
      accountStatus = response.status;
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      cy.log("new account created : " + accountID);
      minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
      cy.log("due date" + minPayDueAt);

      //Validate accountPaymentProcessor details
      const accountPaymentProcessor: AccountPaymentProcessor = {
        auto_enabled: autoEnabled,
        default_payment_processor_method: "NONE",
        payment_processor_name: "AUTHORIZE_NET",
        payment_processor_method: "DEBIT_CARD",
      };
      paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
    });
    if(accountStatus === 200){
    //Roll time forward to get first statement min pay.
    it(`should be able to roll time forward on account to get statement min pay `, async () => {
      const endDate = dateHelper.getStatementDate(account_effective_at, 35);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
      response = await promisify(accountAPI.getAccountById(accountID));
      statementMinPay = response.body.min_pay_due_cents.statement_min_pay_cents;
      cy.log("Statement Min pay: " + statementMinPay);
    });

    //Roll time forward to 1 day from min pay due date.
    it(`should be able to roll time forward on account `, async () => {
      const endDate = dateHelper.getStatementDate(minPayDueAt, 1);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });
    //Check payment line item is not available when default payment parameter is set to none
    it(`should have to validate payment line item is not available in accounts `, async () => {
      response = await promisify(lineItemsAPI.allLineitems(accountID));
      expect(response.status).to.eq(200);
      const checkLineItem = lineItemValidator.checkLineItem(response, "");
      expect(checkLineItem, "validate auto pay call when default payment parameter is set to none").to.false;
    });
  }
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "autopay_enabled" | "default_payment_processor_method"
>;
type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  | "auto_enabled"
  | "default_payment_processor_method"
  | "payment_processor_name"
  | "validate_processor_token"
  | "payment_processor_method"
>;
