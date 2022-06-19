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
import processorJSON from "../../../../resources/testdata/paymentprocessor/multiple_payment_processor_setup.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Cases covered
// pp1025 - 1029 Multiple payment processor configuration while on boarding
// account set default with different payment processor. Check default payment
// processor method and process name

TestFilters(["regression", "paymentProcessor", "autoPay"], () => {
  describe("Multiple Payment Processor integration while on boarding account ", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;

    const autoEnabled = true;
    const accountEffectiveAt = "2021-03-20T09:11:28+00:00";
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    // Update payment processor at organization level - repay, dwolla, checkout,
    // modern treasury
    it("should be able to configure organization with payment processor credentials ", () => {
      const configs = new Map([
        ["REPAY", "repay_configs.json"],
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

    //Create a new revolving installment product and new customer
    it("should have create product and customer ", async () => {
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    //Create an account with all payment processor configured and check the response
    it(`should be able to create a new account`, async () => {
      //Create account JSON
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: customerID,
        effective_at: accountEffectiveAt,
        autopay_enabled: autoEnabled,
      };
      //Update payload and create an account
      const response = await promisify(
        accountAPI.updateNCreateAccount("account_payment_processor_all_processors.json", accountPayload)
      );
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;

      //Validate payment processor details
      validatePaymentProcessorConfigDetails(response, "ACH", "ACH", "REPAY", "REPAY");
      validatePaymentProcessorConfigDetails(response, "ACH", "ACH", "REPAY", "DWOLLA");
      validatePaymentProcessorConfigDetails(response, "ACH", "ACH", "REPAY", "MODERN_TREASURY");
      validatePaymentProcessorConfigDetails(response, "ACH", "DEBIT_CARD", "REPAY", "REPAY");
      validatePaymentProcessorConfigDetails(response, "ACH", "CREDIT_CARD", "CHECKOUT", "CHECKOUT");
    });

    processorJSON.forEach((data) => {
      //Update default processor method and payment process name
      it(`should be able to update  default processor method and payment process name- '${data.tc_name}'`, async () => {
        const configJson = await promisify(
          cy.fixture(Constants.templateFixtureFilePath.concat("/paymentprocessor/" + data.edit_processor_config))
        );
        response = await promisify(paymentAPI.editPaymentProcessorConfig(accountID, configJson));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        validatePaymentProcessorConfigDetails(
          response,
          data.default_payment_process_method,
          data.default_payment_process_method,
          data.processor_name,
          data.processor_name
        );
      });

      // Roll time forwarded to get first statement min pay updated.
      it(`should be able to roll time forward on account to get statement min pay- '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(accountEffectiveAt, 35);
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
        //Prepare expected line item data to validate
        type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
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

    function validatePaymentProcessorConfigDetails(
      response: JSON,
      defaultPaymentProcessorMethod: string,
      checkPaymentProcessorMethod: string,
      processorName: string,
      processorConfigName: string
    ) {
      const accountPaymentProcessor: AccountPaymentProcessor = {
        auto_enabled: true,
        default_payment_processor_method: defaultPaymentProcessorMethod,
        payment_processor_method: checkPaymentProcessorMethod,
        payment_processor_name: processorName,
        processor_config_name: processorConfigName,
        validate_processor_token: true,
      };
      paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
    }
  });
});

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at" | "autopay_enabled">;
type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  | "auto_enabled"
  | "default_payment_processor_method"
  | "payment_processor_method"
  | "payment_processor_name"
  | "processor_config_name"
  | "validate_processor_token"
>;
