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
import processorJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_payment_none.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//pp913 - REPAY - autopay should not be triggered for default payment processor method is set to none
//pp913A - Debit - autopay should not be triggered for default payment processor method is set to none
//pp950 - Dwolla - autopay should not be triggered for default payment processor method is set to none
//pp987 - Modern treasury - autopay should not be triggered for default payment processor method is set to none
//pp1024 - Checkout - autopay should not be triggered for default payment processor method is set to none

TestFilters(["regression", "paymentProcessor"], () => {
  //Validate payment processor - default payment processor method is set to none
  describe("Validate payment processing - default payment parameter is none ", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let response;
    const autoEnabled = false;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    // Update payment processor at organization level - repay, dwolla, checkout,
    // modern treasury
    it("should be able to configure organization with payment processor credentials ", () => {
      const configs = new Map([
        ["REPAY", "repay_configs"],
        ["CHECKOUT", "checkout_configs"],
        ["DWOLLA", "dwolla_configs"],
        ["MODERN_TREASURY", "modern_treasury_configs"],
      ]);
      configs.forEach((value: string, key: string) => {
        const filename = "credentials/".concat(value);
        const configJSON = Constants.templateFixtureFilePath.concat("/", filename);
        cy.fixture(configJSON).then((processorJson) => {
          organizationAPI.updatePaymentProcessorConfigs(processorJson).then((response) => {
            paymentProcessorValidator.validatePaymentProcessConfigResponse(response, key);
          });
        });
      });
    });

    //Create a new revolving installment product
    it("should be able to create a new revolving installment product", async () => {
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    processorJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          autopay_enabled: autoEnabled,
          default_payment_processor_method: "NONE",
        };
        //Create an account with payment processor
        const response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        cy.log("due date" + minPayDueAt);

        //Validate accountPaymentProcessor details
        const accountPaymentProcessor: AccountPaymentProcessor = {
          auto_enabled: autoEnabled,
          default_payment_processor_method: "NONE",
          payment_processor_name: data.check_processor_name,
          validate_processor_token: true,
          payment_processor_method: data.check_payment_process_method,
        };
        paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
      });

      //Roll time forward to get first statement min pay.
      it(`should be able to roll time forward on account to get statement min pay - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 35);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        statementMinPay = response.body.min_pay_due_cents.statement_min_pay_cents;
        cy.log("Statement Min pay: " + statementMinPay);
      });

      //Roll time forward to 1 day from min pay due date.
      it(`should be able to roll time forward on account - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(minPayDueAt, 1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });
      //Check payment line item is not available when default payment parameter is set to none
      it(`should have to validate payment line item is not available in accounts  - ${data.tc_name}`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        const checkLineItem = lineItemValidator.checkLineItem(response, "");
        expect(checkLineItem, "validate auto pay call when default payment parameter is set to none").to.false;
      });
    });
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
