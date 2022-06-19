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
import processorJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_setup_new_account.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Cases covered
// PP870 - Update after account onboarding - REPAY - ACH with new source Account
// details
// PP871E - Update after account onboarding - REPAY - Debit Card with new source
// Account details
// PP993 -  Update after account onboarding - Checkout - Credit card with new Credit card details

TestFilters(["regression", "paymentProcessor", "autoPay"], () => {
  describe("Payment Processor integration update with new account details", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let response;
    let productInstallmentID;
    let productCreditID;
    const autoEnabled = true;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });
    //Update payment processor at organization level - repay, dwolla, checkout,
    // modern treasury
    it("should be able to configure organization with payment processor credentials ", () => {
      const configs = new Map([
        ["REPAY", "repay_configs"],
        ["CHECKOUT", "checkout_configs"],
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

    //Create a new revolving credit product and installment product and new customer
    it("should have create product and customer ", async () => {
      //Create installment product
      productInstallmentID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create credit product
      productCreditID = await promisify(productAPI.createNewProduct("product.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    processorJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should be able to create a new account - '${data.tc_name}'`, async () => {
        //Update account payload
        if (data.product_type.toLocaleLowerCase() == "credit") {
          productID = productCreditID;
        } else {
          productID = productInstallmentID;
        }
        //Update payload and create an account
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          autopay_enabled: autoEnabled,
        };
        //Create an account with payment processor
        const response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        validatePaymentProcessorConfigDetails(response, data);
      });

      //Update processor config after account boarding
      if (data.edit_config.length != 0) {
        it(`should be able to update with new account details after on boarding '${data.tc_name}'`, async () => {
          const accountFileName = Constants.templateFixtureFilePath.concat("/paymentprocessor/" + data.edit_config);
          cy.fixture(accountFileName).then((accountJSON) => {
            if (data.modify_field === "repay_account_number") {
              accountJSON.ach.repay_config.repay_account_number = data.modify_value;
            }
            if (data.modify_field === "repay_card_number") {
              accountJSON.debit_card.repay_config.repay_card_number = data.modify_value;
            }
            if (data.modify_field === "card_number") {
              accountJSON.credit_card.checkout_config.card_number = data.modify_value;
            }
            paymentAPI.editPaymentProcessorConfig(accountID, accountJSON).then((response) => {
          expect(response.status).to.eq(200);
          });
        });
          response = await promisify(accountAPI.getAccountById(accountID));
          minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
          validatePaymentProcessorConfigDetails(response, data);
        });
      }

      //Roll time forward to 2 day from account effective at to get first statement
      // min pay.
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

      //Get account details and check payment processing config details
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
    });

    function validatePaymentProcessorConfigDetails(response, data) {
      type AccountPaymentProcessor = Pick<
        PaymentProcessorFieldDetails,
        "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
      >;
      const accountPaymentProcessor: AccountPaymentProcessor = {
        auto_enabled: true,
        default_payment_processor_method: data.default_payment_process_method,
        payment_processor_name: data.processor_name,
        validate_processor_token: true,
      };
      paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
    }
  });
});

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at" | "autopay_enabled">;
type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
