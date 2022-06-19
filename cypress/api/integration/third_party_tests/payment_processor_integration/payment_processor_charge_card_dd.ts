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
import processorJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_additional_payment_charge_card.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Cases covered
//PP900 - Debit Card - Verify full payment due event and repay call created for Charge card  accounts before due date
//pP937 - Dwolla - Verify full payment due event and dwolla call created for Charge card  accounts before due date
//PP974 - Modern treasury - Verify full payment due event and modern treasury call created for Charge card  accounts before due date
//PP1011 - Checkout - Verify full payment due event and Checkout call created for Charge card  accounts before due date
//PP900A - ACH - Verify full payment due event and repay call created for Charge card  accounts before due date

TestFilters(["regression", "paymentProcessor", "chargeCard"], () => {
  //Validate Payment Processor integration with charge card
  describe("Validate Payment Processor integration with charge card", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let response;
    const autoEnabled = true;

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

    //Create a new charge card product and customer
    it("should be able to create a new charge card product and customer", async() => {
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    processorJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should be able to create a new account - '${data.tc_name}'`, async () => {
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          promo_impl_interest_rate_percent: parseInt(data.promo_impl_interest),
          autopay_enabled: autoEnabled,
        };
        //Update payload and create an account
        response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        cy.log(minPayDueAt)

        const accountPaymentProcessor: AccountPaymentProcessor = {
          auto_enabled: autoEnabled,
          default_payment_processor_method: data.default_payment_process_method,
          payment_processor_name: data.processor_name,
          validate_processor_token: true,
        };
        paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
      });

      //Roll time forward to 2 day from account effective at to get first statement
      // min pay.
      it(`should be able to roll time forward on account to get statement min pay- '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 10);
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
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "promo_impl_interest_rate_percent" | "autopay_enabled"
>;
type AccountPaymentProcessor = Pick<
PaymentProcessorFieldDetails,
"auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;

type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
