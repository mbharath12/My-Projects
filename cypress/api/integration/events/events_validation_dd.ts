/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import { chargeAPI } from "../../api_support/charge";
import { paymentAPI } from "../../api_support/payment";
import { eventsAPI } from "../../api_support/events";
import { dateHelper } from "../../api_support/date_helpers";
import { lineItemsAPI } from "../../api_support/lineItems";
import { eventsValidator, EventValidationFields } from "cypress/api/api_validation/events_validator";
import eventsJSON from "../../../resources/testdata/events/events_product_accounts.json";
import transactionJSON from "../../../resources/testdata/events/events_transaction.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//PP845,PP846,PP848,PP850 - Scheduled and Processed events for Statements, Late Fee, Monthly Fee and Annual Fee
//PP851 - Scheduled and Processed events for Promotional window end Purchase window end
//PP854A and P854B Processed events for initial principal and Loan Tape
//PP855 - Account activity events -  Transactions/ Charges
//PP856 - Account activity events - Payments
//PP863 - Account activity events - back dated Charges
//PP864 - Account activity events - back dated payments
//PP859 - Account activity events- Suspend / Delinquency
//PP860 - Account activity events- Closed/Chargeoff
//PP861 - Retroactive event Processing for - Payment reversals

TestFilters(["regression", "events"], () => {
  let accountID: any;
  let productID: any;
  let eventsTransactionJSON;

  describe("Validate events related to Fee, Account Status, Payment reversal, Charges and payments with different Scheduled and Processed events", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    //iterate each product and account
    eventsJSON.forEach((data) => {
      eventsTransactionJSON = transactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          const productJSONFile = data.template_name;

          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            first_cycle_interval: data.first_cycle_interval,
            promo_len: parseInt(data.promo_len),
            promo_purchase_window_len: parseInt(data.promo_purchase_window_len),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          };
          //Update payload and create an product
          const response = await promisify(
            productAPI.updateNCreateProduct(productJSONFile, productPayload)
          );
          Cypress.env("product_id", response.body.product_id);
        });

        it(`should have create account`, async () => {
          productID = Cypress.env("product_id");
          const customerID = Cypress.env("customer_id");
          const effectiveDate = data.account_effective_dt;

          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDate,
            first_cycle_interval: data.first_cycle_interval,
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
          };
          //Update payload and create an account
          const response = await promisify(
            accountAPI.updateNCreateAccount("account_credit.json",  accountPayload)
          );
          expect(response.status).to.eq(200);
          Cypress.env("account_id", response.body.account_id);
          cy.log("new account created : " + Cypress.env("account_id"));
        });
      });

      describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
        eventsTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            //Validate events when transaction type is validation
            case "validation":
              it(`should have validate line item transaction  - '${results.tc_name}'`, async () => {
                accountID = Cypress.env("account_id");
                //get current date payment reversal
                if (results.effective_at.toLowerCase() === "current_date") {
                  results.effective_at = dateHelper.getRollDate(0);
                }
                if (results.roll_date.length !== 0) {
                  //get next day date for roll time
                  if (results.roll_date.toLowerCase() === "next_date") {
                    results.roll_date = dateHelper.getRollDate(1);
                  }
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, results.roll_date));
                  expect(response.status).to.eq(200);
                }
                //get boolean value of is_processed
                const isProcessed = results.is_processed.toLowerCase() === "true";
                const expEventsValidation: EventItem = {
                  account_id: accountID,
                  product_id: productID,
                  event_type: results.event_type,
                  event_start: results.event_start,
                  effective_at: results.effective_at,
                  is_processed: isProcessed,
                  line_item_id: results.line_item_id,
                  statement_id: results.statement_id,
                  statement_seq: parseInt(results.statement_seq),
                  retro_line_item_type: results.retro_line_item_type,
                  validation_message: results.validation_message,
                };
                const response = await promisify(eventsAPI.getEvents(accountID));
                expect(response.status).to.eq(200);
                //If event type is retro validate retro type events
                if (results.event_type === "RETRO") {
                  eventsValidator.validateRetroTypeEvent(response, expEventsValidation);
                } else {
                  eventsValidator.validateEventLineItem(response, expEventsValidation);
                }
              });
              break;

            //Create Charge transaction
            case "charge":
              it(`should be able to create charge- '${results.tc_name}'`, () => {
                accountID = Cypress.env("account_id");
                chargeAPI.chargeForAccount(
                  accountID,
                  "create_charge.json",
                  results.amount,
                  results.effective_at
                );
              });
              break;

            //Create Payment transaction
            case "payment":
              it(`should be able to create a payment- '${results.tc_name}'`, async () => {
                accountID = Cypress.env("account_id");
                const paymentID = await promisify(
                  paymentAPI.paymentForAccount(
                    accountID,
                    "payment.json",
                    results.amount,
                    results.effective_at
                  )
                );
                Cypress.env("payment_id", paymentID);
              });
              break;

            //Create Payment reversal transaction
            case "paymentreversal":
              it(`should be able to reverse payment- '${results.tc_name}'`, async () => {
                accountID = Cypress.env("account_id");
                const response = await promisify(
                  lineItemsAPI.paymentReversalLineitems(accountID, Cypress.env("payment_id"))
                );
                expect(response.status).to.eq(200);
              });
              break;

            default:
              it(`should have not transaction code - '${results.tc_name}'`, async () => {
                expect(results.transaction_type, "No transaction code:".concat(results.transaction_type)).to.eq("");
              });
          }
        });
      });
    });

    type CreateProduct = Pick<
      ProductPayload,
      | "cycle_interval"
      | "cycle_due_interval"
      | "first_cycle_interval"
      | "promo_len"
      | "promo_purchase_window_len"
      | "delinquent_on_n_consecutive_late_fees"
      | "charge_off_on_n_consecutive_late_fees"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "first_cycle_interval"
      | "origination_fee_cents"
      | "late_fee_cents"
      | "monthly_fee_cents"
      | "annual_fee_cents"
    >;

    type EventItem = Pick<
      EventValidationFields,
      | "product_id"
      | "account_id"
      | "effective_at"
      | "event_type"
      | "is_processed"
      | "event_start"
      | "line_item_id"
      | "statement_id"
      | "statement_seq"
      | "retro_line_item_type"
      | "validation_message"
    >;
  });
});
