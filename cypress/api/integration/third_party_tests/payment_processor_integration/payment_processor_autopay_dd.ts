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
import autopayJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_autopay.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";
import { eventsValidator, EventValidationFields } from "cypress/api/api_validation/events_validator";
import { eventsAPI } from "../../../api_support/events";

//Test Scripts
//pp872-pp876 - autopay with REPAY - validate due dates and payment line item and event table
//pp887-pp891 - autopay with Debit card - validate due dates and payment line item and event table
//pp920-pp924 - autopay with DWOLLA - validate due dates and payment line item and event table
//pp957-pp961 - autopay with Modern Treasury - validate due dates and payment line item and event table
//pp994-pp998 - autopay with CheckOut - validate due dates and payment lineitem and event table

TestFilters(["regression", "paymentProcessor", "autoPay", "event"], () => {
  //Validate payment processor - autopay with different organization configurations
  describe("Validate payment processing - auto pay through checkout.com payment processor", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay = 0;
    let minPayDueAt;
    let totalBalance;
    let availableCredit;
    let effectiveDate;
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

    //Create a new revolving installment product
    it("should be able to create a new revolving installment product", async () => {
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    autopayJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //If account effective_dt is back dated use dynamic or effective_dt is
        // static form test data
        effectiveDate = dateHelper.getAccountEffectiveAt(data.account_effective_at);
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDate,
          default_payment_processor_method: data.default_payment_process_method,
          autopay_enabled: autoEnabled,
        };
        //Update payload and create an account
        response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        totalBalance = response.body.summary.total_balance_cents;
        availableCredit = response.body.summary.available_credit_cents;
        //If min_pay_due_at is current date use dynamic or min_pay_at is static date form test data
        const minPayDue = dateHelper.getAccountEffectiveAt(data.min_pay_due_at);
        expect(minPayDueAt.slice(0, 10), "min pay due date").to.eq(minPayDue.slice(0, 10));

        //Validate accountPaymentProcessor details
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
        const endDate = dateHelper.getStatementDate(effectiveDate, 35);
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

      //Commenting the chunk of code as per the Canopy Team,since events are not coming in RC Env.
      if (data.check_event.toLowerCase() === "true") {
        //Commenting the chunk of code as per the Canopy Team,since events are not coming in RC Env.
        //Get event table and verify auto pay and payment_tx events
        xit(`should have validate auto pay and payment events in accounts  - ${data.tc_name}`, async () => {
          //Roll time forward to generate generate autopay event
          const endDate = dateHelper.getRollDate(2);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);

          //Statement date is one day less than min pay due date in account summary
          const autpPayEffectiveAt = dateHelper.getStatementDate(minPayDueAt, -1);
          response = await promisify(eventsAPI.getEvents(accountID));
          expect(response.status).to.eq(200);
          //Validate expected event data for auto pay

          const expEventsValidation: EventItem = {
            account_id: accountID,
            event_type: "AUTO_PAY",
            effective_at: autpPayEffectiveAt.slice(0, 10),
            is_processed: autoEnabled,
            line_item_id: "null",
            event_start: data.event_start_date,
            validation_message: "Verify payment processor auto pay event",
          };
          eventsValidator.validateEventLineItem(response, expEventsValidation);
          //Get current date for auto payment event
          const currentDate = dateHelper.getAccountEffectiveAt(0);

          const autoPaymentEvent: paymentProcessorEventItem = {
            account_id: accountID,
            event_type: "PAYMENT_TX",
            is_processed: autoEnabled,
            effective_at: currentDate.slice(0, 10),
            payment_method: data.default_payment_process_method,
            payment_processor_name: data.processor_name,
            payment_amount_cents: statementMinPay,
            payment_status: data.event_status,
            transaction_status: "PENDING",
            validation_message: "Verify payment processor payment event",
          };
          eventsValidator.validatePaymentProcessorEvent(response, autoPaymentEvent);
        });
      }
    });
  });
});

type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;

type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "default_payment_processor_method" | "autopay_enabled"
>;

type EventItem = Pick<
  EventValidationFields,
  "account_id" | "effective_at" | "event_type" | "event_start" | "is_processed" | "line_item_id" | "validation_message"
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
