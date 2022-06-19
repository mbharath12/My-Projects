/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
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
import autopayJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_multi_adv_installment.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
// pp903-pp905 - Debit card - Verify REPAY call for Revolving account with Promotion period setup
// pp940-pp942 - Dwolla - Verify Dwolla call for Revolving account with Promotion period setup
// pp977-pp979 - Modern treasury - Verify Modern treasury call for Revolving account with Promotion period setup
// pp1014-pp1016 - Checkout - Verify Checkout call for Revolving account with Promotion period setup

TestFilters(["regression", "paymentProcessor"], () => {
  //Validate payment processor - autopay with multi advance installment product
  describe("Validate payment processing - autopay with multi advance installment product", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay = 0;
    let minPayDueAt;
    let totalBalance;
    let availableCredit;
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

    //Create a new customer
    it("should have create customer ", async () => {
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    autopayJSON.forEach((data) => {
      //Create a new revolving installment product
      it("should be able to create a new revolving installment product", async () => {
        //Create product JSON
        const productPayload: CreateProduct = {
          promo_len: parseInt(data.promo_len),
          promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
          promo_min_pay_type: data.promo_min_pay_type,
        };
        //Update payload and create an product
        const response = await promisify(
          productAPI.updateNCreateProduct("product_payment_processing.json", productPayload)
        );
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
      });

      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update payload and create an account
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          autopay_enabled: autoEnabled,
          default_payment_processor_method: data.default_payment_process_method,
        };
        //Create an account with payment processor
        const response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        cy.log("due date" + minPayDueAt);
        totalBalance = response.body.summary.total_balance_cents;
        availableCredit = response.body.summary.available_credit_cents;

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

      //Get account details and check payment processing config details
      it(`should have validate payment line item in accounts  - ${data.tc_name}`, async () => {
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

      //Get account details and validate Available credit in the account is not increased and the Total balance is not reduced
      it(`should have validate total balance and available credit for pending payment - '${data.tc_name}'`, async () => {
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.summary.total_balance_cents, "verify total balance ").to.lessThan(totalBalance);
        expect(response.body.summary.available_credit_cents, "verify available credit").to.greaterThan(availableCredit);
      });
    });
  });
});

type CreateProduct = Pick<ProductPayload, "promo_len" | "promo_min_pay_type" | "promo_min_pay_percent">;
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "autopay_enabled" | "default_payment_processor_method"
>;
type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;
type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
