/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { dateHelper } from "../../../api_support/date_helpers";
import { paymentAPI } from "../../../api_support/payment";
import { AMScheduleLineItem, amScheduleValidator } from "../../../api_validation/am_schedule_validator";
import interestCalcJSON from "../../../../resources/testdata/interestcalculation/interest_product_accounts.json";
import transactionJSON from "../../../../resources/testdata/interestcalculation/interest_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Cases Covered
//PP787 - Interest calculation for Installment Product with payment on time
//PP788 - Interest calculation for Installment Product with delay payment and before grace period
//PP789 - Interest calculation for Installment Product with delayed payment
//PP790 - Interest calculation for Installment Product with payment on time other fees charged paid off separately
//PP791 - Interest calculation for Installment Product with fee charges not paid
//PP792 - Interest calculation for Installment Product with Part Payments and Late fees charges
//PP794 - Interest calculation for Installment Product without payments - Suspended and Delinquent
//PP795 - Interest calculation for Installment Product without payments - Suspended and Delinquent. Subsequently cured
//PP796 - Interest calculation for Installment Product without payments - Closed/Chargeoff
//PP797 - Interest calculation for Installment Product with payment reversal
//PP798 - Interest calculation for Installment Product with back dated payments
//PP818 - Interest calculation for BNPL Product with payment on time
//PP818B - Interest calculation for BNPL Product with delay payment and before grace period
//PP1053 - Validate Payment allocation details in the Amortization Schedule installment payment
//PP1054 - Validate Payment allocation details in the Amortization Schedule full payment
//PP1055 - Validate Payment allocation details in the Amortization Schedule part payment

TestFilters(["regression", "interestCalculation", "installment"], () => {
  let productID;
  let customerID;
  let validationTransactionJSON;
  let amResponse;
  let accountID;

  describe("Validate interest calculation with installment product with different scenarios", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });

    //iterate each product and account
    interestCalcJSON.forEach((data) => {
      validationTransactionJSON = transactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create product and account - '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          const productJSONFile = "product_installment.json";
          const productPayload: CreateProduct = {
            post_promo_len: parseInt(data.post_promo_len),
            post_promo_default_interest_rate_percent: parseFloat(data.post_promo_default_interest_rate_percent),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            delete_field_name: "first_cycle_interval",
          };
          //Update payload and create an product
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
        });

        it(`should have create account`, async () => {
          //create account JSON
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
          };
          //Update payload and create an account
          let response = await promisify(accountAPI.updateNCreateAccount(data.account_template_name, accountPayload));
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);

          //Roll time forward to get AM Schedule generated
          const rollDate = dateHelper.getStatementDate(data.account_effective_dt, 1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollDate));
          expect(response.status).to.eq(200);

          //Check AM Schedule is generated
          amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
          expect(amResponse.status).to.eq(200);
          expect(amResponse.body.length, "check number of cycles in amortization schedule").to.eq(
            parseInt(data.post_promo_len)
          );
        });
      });

      describe(`should have to validate interest calculation in am schedule - '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            case "validation_AM":
              it(`should have validate AM schedule after account creation - '${results.tc_name}'`, () => {
                const cycleNumber = parseInt(results.cycle_number) - 1;
                const amScheduleLineItem: CreateAMSchedule = {
                  cycle_exclusive_end: results.due_date,
                  am_min_pay_cents: parseInt(results.min_pay_amount),
                  am_cycle_payment_cents: parseInt(results.amount_paid),
                  am_interest_cents: parseInt(results.interest),
                  am_principal_cents: parseInt(results.principal),
                  am_start_principal_balance_cents: parseInt(results.opening_balance),
                  am_end_principal_balance_cents: parseInt(results.closing_balance),
                };
                amScheduleValidator.validateLineItem(amResponse, cycleNumber, amScheduleLineItem);
              });
              break;
            case "payment":
              it(`should be able to create a payment - '${results.tc_name}'`, () => {
                // TODO: using async/await was iterating 4 time changed the code
                // to promise call
                paymentAPI
                  .paymentForAccount(accountID, "payment.json", results.amount_paid, results.effective_at)
                  .then((paymentID) => {
                    Cypress.env("payment_id", paymentID);
                  });
              });
              break;
            case "validate_AM_for_month":
              it(`should have validate AM schedule for a month - '${results.tc_name}'`, () => {
                rollTimeAPI.rollAccountForward(accountID, results.roll_date).then(() => {
                  const cycleNumber = parseInt(results.cycle_number) - 1;
                  const amScheduleLineItem: CreateAMSchedule = {
                    cycle_exclusive_end: results.due_date,
                    am_min_pay_cents: parseInt(results.min_pay_amount),
                    am_cycle_payment_cents: parseInt(results.cycle_payment),
                    am_interest_cents: parseInt(results.interest),
                    am_principal_cents: parseInt(results.principal),
                    am_start_principal_balance_cents: parseInt(results.opening_balance),
                    am_end_principal_balance_cents: parseInt(results.closing_balance),
                  };
                  amScheduleValidator.getAMScheduleListNValidateLineItem(accountID, cycleNumber, amScheduleLineItem);
                });
              });
              break;
            case "check_lineItem":
              it(`should have validate line item - '${results.tc_name}'`, () => {
                lineItemsAPI.allLineitems(accountID).then((response) => {
                  const lineItemID = lineItemsAPI.getLineItemOfAnAccount(response, results.type, results.effective_at);
                  expect(lineItemID, "check ".concat(results.type, " line item is displayed")).to.not.null;
                });
              });
              break;
          }
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "first_cycle_interval_del"
  | "delete_field_name"
  | "cycle_interval"
  | "cycle_due_interval"
  | "post_promo_len"
  | "post_promo_default_interest_rate_percent"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "initial_principal_cents"
  | "post_promo_len"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "delete_field_name"
  | "cycle_due_interval_del"
>;

type CreateAMSchedule = Pick<
  AMScheduleLineItem,
  | "cycle_exclusive_end"
  | "am_min_pay_cents"
  | "am_cycle_payment_cents"
  | "am_interest_cents"
  | "am_principal_cents"
  | "am_start_principal_balance_cents"
  | "am_end_principal_balance_cents"
  | "paid_on_time"
>;
