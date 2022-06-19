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
import processorJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_toggle_auto_pay.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Cases covered
// PP911-PP912 Additional Part payments with Debit card - Edit the Payment
// Processor config for an account - toggle autopay from true to false and false
// to true
// PP948-PP949 Additional Part payments with Dwolla - Edit the Payment
// Processor config for an account - toggle autopay from true to false and false
// to true
// PP985-PP986 Additional Part payments with Modern treasury - Edit the Payment
// Processor config for an account - toggle autopay from true to false and false
// to true
// PP1022-PP1023 Additional Part payments with Checkout - Edit the Payment
// Processor config for an account - toggle autopay from true to false and false
// to true

TestFilters(["regression", "paymentProcessor"], () => {
  //Validate payment processor - toggle autopay from true to false and false to true
  describe("Validate payment processing - toggle auto pay from true to false and false to true", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let response;

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
      it(`should be able to create a new account - '${data.tc_name}'`, async () => {
        //convert autoEnable value to boolean
        const myBool = data.autoEnabled.toLowerCase() === "true";
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          default_payment_processor_method: data.default_payment_process_method,
          autopay_enabled: myBool,
        };
        //Update payload and create an account
        response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        cy.log(" " + minPayDueAt);
        validatePaymentProcessorConfigDetails(response, data, myBool);
      });

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

          const lineItemCount = lineItemValidator.countLineItem(response,"PAYMENT","auto_pay","PENDING",1);
          expect(lineItemCount,"one payment line is available for auto pay true to false ").to.be.true;
        });
      }
    });
  });
});
    function validatePaymentProcessorConfigDetails(response, data, autoEnabled) {
      const accountPaymentProcessor: AccountPaymentProcessor = {
        auto_enabled: autoEnabled,
        default_payment_processor_method: data.default_payment_process_method,
        payment_processor_name: data.processor_name,
        validate_processor_token: autoEnabled,
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
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;
