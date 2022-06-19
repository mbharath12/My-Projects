/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { organizationAPI } from "../../../api_support/organization";
import { dateHelper } from "../../../api_support/date_helpers";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import {
  PaymentProcessorFieldDetails,
  paymentProcessorValidator,
} from "../../../api_validation/payment_processor_validation";
import processorJSON from "../../../../resources/testdata/paymentprocessor/authorize_net_toggle_auto_pay.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Cases covered
//PP2667 - Edit the Payment Processor config for an account Toggle Autopay from true to False
//PP2668 - Edit the Payment Processor config for an account Toggle Autopay from false to true

TestFilters(["regression", "paymentProcessor", "authorizeNet"], () => {
  //Validate payment processor - toggle autopay from true to false and false to true
  describe("Validate payment processing - toggle auto pay from true to false and false to true", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let response;
    let accountStatus;

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

    processorJSON.forEach((data) => {
      it("should be able to create a new customer", () => {
        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
        //Create a new account and set payment processor
      });
      it(`should be able to create a new account - '${data.tc_name}'`, async () => {
        //convert autoEnable value to boolean
        const autoEnable = data.autoEnabled.toLowerCase() === "true";
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          default_payment_processor_method: data.default_payment_process_method,
          autopay_enabled: autoEnable,
        };
        //Update payload and create an account
        response = await promisify(
          accountAPI.updateNCreateAccount("account_payment_processor_debit_card_authorize_net.json", accountPayload)
        );
        accountStatus = response.status;
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        cy.log(" " + minPayDueAt);
        validatePaymentProcessorConfigDetails(response, data, autoEnable);
      });

      if(accountStatus === 200){
      //Roll time forwarded to get first statement min pay updated.
      it(`should be able to roll time forward on account to get statement min pay- '${data.tc_name}'`, async () => {
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

      if (data.autoEnabled.toLowerCase() === "false") {
        //Check payment line item is not available in line items for autoEnable
        // false and default_payment_process_method is none
        it(`should have to validate payment line item is not available in accounts  - ${data.tc_name}`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          const checkLineItem = lineItemValidator.checkLineItem(response, "PAYMENT");
          expect(checkLineItem, "validate payment line item for autopay is false").to.false;
        });
      }
      if (data.autoEnabled.toLowerCase() === "true") {
        //Get account details and check payment processing config details for
        // autoEnable true
        it(`should have payment line item in accounts - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          //Statement date is one day less than min pay due date in account summary
          const paymentEffectiveAt = dateHelper.getStatementDate(minPayDueAt, -1);
          const paymentLineItem: AccLineItem = {
            status: "PENDING",
            type: "PAYMENT",
            original_amount_cents: statementMinPay * -1,
            description: "auto_pay",
            effective_at: paymentEffectiveAt,
          };
          lineItemValidator.validateAccountLineItemWithEffectiveDate(response, paymentLineItem);
        });
      }
      //Update processor config after account onboarding
      it(`should be able to config payment processor after onboarding account '${data.tc_name}'`, async () => {
        //Convert autoEnable value to boolean
        const myBoolToggle = data.toggleAutoEnabled.toLowerCase() === "true";
        const accountFileName = Constants.templateFixtureFilePath.concat("/paymentprocessor/" + data.edit_config);
        cy.fixture(accountFileName).then((accountJSON) => {
          accountJSON.autopay_enabled = myBoolToggle;
          paymentAPI.editPaymentProcessorConfig(accountID, accountJSON).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
        response = await promisify(accountAPI.getAccountById(accountID));
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        validatePaymentProcessorConfigDetails(response, data, myBoolToggle);
      });

      //Roll time forward to 2 day from account effective at to get first statement
      // min pay.
      it(`should be able to roll time forward on account to get statement min pay- '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(minPayDueAt, 20);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        statementMinPay = response.body.min_pay_due_cents.statement_min_pay_cents;
        cy.log("Statement Min pay: " + statementMinPay);
      });

      //Roll time forward to 1 day from min pay due date.
      it(`should be able to roll time forward on account - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(minPayDueAt, 31);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });
      if (data.toggleAutoEnabled.toLowerCase() === "true") {
        it(`should have payment line item in accounts - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          //Statement date is one day less than min pay due date in account summary
          const paymentEffectiveAt = dateHelper.getStatementDate(minPayDueAt, 29);
          const paymentLineItem: AccLineItem = {
            status: "PENDING",
            type: "PAYMENT",
            original_amount_cents: statementMinPay * -1,
            description: "auto_pay",
            effective_at: paymentEffectiveAt,
          };
          lineItemValidator.validateAccountLineItemWithEffectiveDate(response, paymentLineItem);
        });
      }
      if (data.toggleAutoEnabled.toLowerCase() === "false") {
        // get account details and check payment processing config details for
        // autoEnable true
        it(`should have payment line item in accounts - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);

          const lineItemCount = lineItemValidator.countLineItem(response, "PAYMENT", "auto_pay", "PENDING", 1);
          expect(lineItemCount, "one payment line is available for auto pay true to false ").to.be.true;
        });
      }
    }
    });
  });
});
function validatePaymentProcessorConfigDetails(response, data, autoEnabled) {
  const accountPaymentProcessor: AccountPaymentProcessor = {
    auto_enabled: autoEnabled,
    default_payment_processor_method: data.default_payment_process_method,
    payment_processor_name: data.processor_name,
  };
  paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
}

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "default_payment_processor_method" | "autopay_enabled"
>;
type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name"
>;
