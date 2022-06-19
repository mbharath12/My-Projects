/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { organizationAPI } from "../../../api_support/organization";
import { dateHelper } from "../../../api_support/date_helpers";
import { paymentAPI } from "../../../api_support/payment";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import {
  PaymentProcessorFieldDetails,
  paymentProcessorValidator,
} from "../../../api_validation/payment_processor_validation";
import additionalPayJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_additional_part_payment.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
// pp898 - pp899 - additional part payment with Debit card - Additional part
// payment received beyond Autopay for revolving
// pp910 - pp911-  additional part payment with Debit card - Verify payment due
// event and REPAY call created for Revolving account where interest payments
// are stipulated for credit product
// pp935 - pp936 - additional part payment with Dwolla - Additional part
// payment received beyond Autopay for revolving
// pp938 - pp939-  additional part payment with Dwolla- Verify payment due
// event and REPAY call created for Revolving account where interest payments
// are stipulated for credit product
// pp972 - pp973 - additional part payment with Modern treasury - Additional part
// payment received beyond Autopay for revolving
// pp975 - pp976-  additional part payment with Modern treasury - Verify payment due
// event and REPAY call created for Revolving account where interest payments
// are stipulated for credit product
// pp1009 - pp1010 - additional part payment with Credit card - Additional part
// payment received beyond Autopay for revolving
// pp1012 - pp1013 -  additional part payment with Credit card- Verify payment due
// event and REPAY call created for Revolving account where interest payments
// are stipulated for credit product

TestFilters(["regression", "paymentProcessor", "autoPay", "revolvingProduct"], () => {
  //Validate payment processor - autopay with different organization configurations
  describe("Validate payment processing - auto pay through checkout.com payment processor", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let productInstallmentID;
    let productCreditID;
    let paymentAmount;
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

    //Create a new revolving credit product and installment product and new customer
    it("should have create product and customer ", async () => {
      //Create installment product
      productInstallmentID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create credit product
      productCreditID = await promisify(productAPI.createNewProduct("product.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    additionalPayJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
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
          default_payment_processor_method: data.default_payment_process_method,
          initial_principal_cents: parseInt(data.initial_principal_cents),
        };
        //Create an account with payment processor
        const response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
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

      it(`should have create a payment - '${data.tc_name}'`, () => {
        //Update payment amount and payment effective dt
        const debitPaymentAmount = Math.floor(Math.random() * 10000);
        if (data.default_payment_process_method.toLocaleLowerCase() == "debit_card") {
          paymentAmount = debitPaymentAmount;
        } else {
          paymentAmount = data.payment_amount;
        }
        cy.log("amount " + paymentAmount);
        paymentAPI.paymentForAccount(accountID, "create_payment.json", paymentAmount, data.payment_effective_dt);
      });

      //Roll time forward to 2 day from account effective at to get first statement
      // min pay.
      it(`should be able to roll time forward on account to get statement min pay - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 35);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Get account details and check payment processing config details
      it(`should have validate payment line item in accounts  - ${data.tc_name}`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);

        //type AccLineItem = Pick<LineItem, "status" | "type" | "effective_at" | "original_amount_cents">;
        //Statement date is one day less than min pay due date in account summary
        const paymentLineItem: AccLineItem = {
          status: "PENDING",
          type: "PAYMENT",
          original_amount_cents: parseInt(paymentAmount) * -1,
          effective_at: data.payment_effective_dt.slice(0, 10),
        };
        lineItemValidator.validateAccountLineItemWithEffectiveDate(response, paymentLineItem);
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "autopay_enabled"
  | "default_payment_processor_method"
  | "initial_principal_cents"
>;
type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;
type AccLineItem = Pick<LineItem, "status" | "type" | "effective_at" | "original_amount_cents" | "description">;
