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
import manualPayJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_manual_pay.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";
import { eventsValidator, EventValidationFields } from "cypress/api/api_validation/events_validator";
import { eventsAPI } from "../../../api_support/events";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Scripts
//pp883 - manual pay with REPAY - SOR create an event
//pp884 - manual pay with REPAY - validate manual payment line item is pending
//pp886 - manual pay with REPAY - verify available credit and total balance is reduced for payment pending status
//pp883 - manual pay with Debit Card - SOR create an event
//pp884A - manual pay with Debit Card - validate manual payment line item is pending status in line item and event table
//pp886A - manual pay with Debit Card - verify available credit and total balance is reduced for payment pending status
//pp931 - manual pay with Dwolla - SOR create an event
//pp932 - manual pay with Dwolla - validate manual payment line item is pending status
//pp934 - manual pay with Dwolla - verify available credit and total balance is  reduced for payment pending status
//pp968 - manual pay with Modern treasury - SOR create an event
//pp969 - manual pay with Modern treasury - validate manual payment line item is pending status
//pp971 - manual pay with Modern treasury -  verify available credit and total balance is  reduced for payment pending status
//pp1005 - manual pay with Checkout - SOR create an event
//pp1006 - manual pay with Checkout - validate manual payment line item is pending status
//pp1006 - manual pay with Checkout - verify available credit and total balance is  reduced for payment pending status

TestFilters(["regression", "paymentProcessor", "manualPay"], () => {
  //Validate payment processor - manual pay with different payment processor
  describe("Validate payment processor - manual pay through all available payment processor", () => {
    let accountID;
    let productID;
    let customerID;
    let totalBalance;
    let availableCredit;
    let paymentAmt;
    let response;
    const autoEnabled = false;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    //Update payment processor at organization level - repay, dwolla, checkout,
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

    //Create a new revolving installment product
    it("should be able to create a new revolving installment product", async () => {
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    manualPayJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          default_payment_processor_method: data.default_payment_process_method,
          autopay_enabled: autoEnabled,
        };
        //Update payload and create an account
        response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
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
      });

      //Check payment line item is not available in line items for manual pay
      it(`should have to validate payment line item is not available in accounts  - ${data.tc_name}`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        const checkLineItem = lineItemValidator.checkLineItem(response, "PAYMENT");
        expect(checkLineItem, "validate payment line item for manual pay before payment").to.false;
      });

      it(`should have create a payment - '${data.tc_name}'`, () => {
        //Update payment amount and payment effective dt
        paymentAmt = Math.floor(Math.random() * 1000);
        cy.log("amount " + paymentAmt);
        paymentAPI.paymentForAccount(accountID, "create_payment.json", paymentAmt, data.payment_effective_dt);
      });

      //Roll time forward to 2 day from account effective at to get first statement
      // min pay
      it(`should be able to roll time forward on account to get statement min pay - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 35);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Get account details and check payment processing config details
      it(`should have validate payment line item in accounts  - ${data.tc_name}`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);

        const paymentLineItem: AccLineItem = {
          status: "PENDING",
          type: "PAYMENT",
          original_amount_cents: paymentAmt * -1,
        };
        lineItemValidator.validateLineItem(response, paymentLineItem);
      });

      //Get account details and validate Available credit in the account is not increased and the Total balance is not reduced
      it(`should have validate total balance and available credit for pending payment - '${data.tc_name}'`, async () => {
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.summary.total_balance_cents, "verify total balance ").to.lessThan(totalBalance);
        expect(response.body.summary.available_credit_cents, "verify available credit").to.greaterThan(availableCredit);
      });

      //Get event table and verify auto pay and payment_tx events
      it(`should have validate payment event in accounts  - ${data.tc_name}`, async () => {
        //Roll time forward to generate payment_tx event
        const endDate = dateHelper.getRollDate(3);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);

        //Get events for account
        response = await promisify(eventsAPI.getEvents(accountID));
        expect(response.status).to.eq(200);

        const event = eventsValidator.checkEventType(response, "AUTO_PAY");
        expect(event, "validate auto pay event is not available for manual pay").to.false;
        const currentDate = dateHelper.getAccountEffectiveAt(0);

        const paymentProcessorEvent: paymentProcessorEventItem = {
          account_id: accountID,
          event_type: "PAYMENT_TX",
          is_processed: true,
          effective_at: currentDate.slice(0, 10),
          payment_method: data.default_payment_process_method,
          payment_processor_name: data.processor_name,
          payment_amount_cents: paymentAmt,
          payment_status: data.event_status,
          transaction_status: "PENDING",
        };
        eventsValidator.validatePaymentProcessorEvent(response, paymentProcessorEvent);
      });
    });
  });
});

type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "default_payment_processor_method" | "autopay_enabled"
>;
type paymentProcessorEventItem = Pick<
  EventValidationFields,
  | "account_id"
  | "effective_at"
  | "event_type"
  | "is_processed"
  | "validation_message"
  | "payment_method"
  | "payment_processor_name"
  | "payment_amount_cents"
  | "payment_status"
  | "transaction_status"
>;
type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
