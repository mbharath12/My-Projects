/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { dateHelper } from "../../api_support/date_helpers";
import { authAPI } from "../../api_support/auth";
import { chargeAPI, ChargePayload } from "../../api_support/charge";
import { statementsAPI } from "../../api_support/statements";
import { statementValidator } from "../../api_validation/statements_validator";
import lineItemProcessingJSON from "../../../resources/testdata/product/default_attributes_product_account.json";
import transactionsJSON from "../../../resources/testdata/product/default_attributes_validation.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1225 - PP1226 - Verify Promo len specified at Product level is applied when it can be/not overridden at Account level
//PP1227,PP1227A,PP1227B - Verify the Post Promotion attributes are applied after the Promotion period ends with Promo min pay type PERCENT_INTEREST/AM/NONE
//PP1228,PP1229 - Verify Promo Min pay type and Percentage determines the minimum due calculation for each cycle in Revolving account at product level/account level
//PP1230 - PP1234 -Verify Minimum payment due for each cycle in Revolving account when Promo Min pay type is Percent Principal/Percent Interest/None and Promo Min Pay Percentage is 100%/50%/5%
//PP1235 - PP1237 - verify promo_purchase_window_len at Product level determines charge creation
//PP1238,PP1239,PP1239A-Verify promo_interest_deferred parameter will defer interest on the account

TestFilters(["regression", "product", "defaultattributes"], () => {
  describe("Validation of line items on various products", function () {
    let accountID;
    let productID;
    let productJSONFile;
    let customerID;
    let response;
    let accountTransactionJSON;
    let cycleStatementID;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("new customer created successfully: " + customerID);
      });
    });

    //iterate each product and account
    lineItemProcessingJSON.forEach((data) => {
      accountTransactionJSON = transactionsJSON.filter((results) => results.tc_name === data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          productJSONFile = data.exp_product_file_name;

          //Update Cycle_interval,Cycle_due,Promo policies
          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            promo_len: parseInt(data.product_promo_len),
            promo_min_pay_type: data.product_promo_min_pay_type,
            promo_purchase_window_len: parseInt(data.product_promo_purchase_window_len),
            promo_interest_deferred: data.product_promo_interest_deferred,
            promo_min_pay_percent: parseInt(data.product_promo_min_pay_percent),
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            post_promo_len: parseInt(data.post_promo_len),
            post_promo_min_pay_type: data.post_promo_min_pay_type,
            post_promo_default_interest_rate_percent: parseInt(data.post_promo_default_interest_rate_percent),
            first_cycle_interval_del: "first_cycle_interval",
          };

          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
          cy.log("new product created successfully: " + productID);
        });

        it(`should have create account'`, async () => {
          //create account JSON
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
            promo_len: parseInt(data.account_promo_len),
            promo_min_pay_type: data.account_promo_min_pay_type,
            promo_purchase_window_len: parseInt(data.account_promo_purchase_window_len),
            promo_min_pay_percent: parseInt(data.account_promo_min_pay_percent),
            promo_interest_deferred: data.account_promo_interest_deferred,
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_charge.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });
      });

      describe(`should have to create charge and validate - '${data.tc_name}'`, () => {
        accountTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            case "rolltime":
              it(`should have to wait for account roll time forward to make sure statement is processed - '${data.tc_name}'`, async () => {
                const endDate = dateHelper.getAccountEffectiveAt(results.roll_date);
                const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
                expect(response.status).to.eq(200);
              });
              break;

            case "promoExpiryDt":
              it(`should be able to validate promo expiry date`, async () => {
                response = await promisify(statementsAPI.getStatementByAccount(accountID));
                expect(response.status).to.eq(200);
                cycleStatementID = statementValidator.getStatementIDByNumber(response, 0);
              });
              it(`should be able to validate promo expiry date`, async () => {
                response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
                expect(response.status).to.eq(200);
                expect(
                  response.body.account_overview.promo_exclusive_end.slice(0, 10),
                  "Check the promo expiry date"
                ).eq(results.exp_promo_expiry_date.slice(0, 10));
              });

              break;

            case "firstDueDt":
              it(`should be able to validate first due date`, async () => {
                response = await promisify(statementsAPI.getStatementByAccount(accountID));
                expect(response.status).to.eq(200);
                expect(
                  response.body[0].min_pay_due.min_pay_due_at.slice(0, 10),
                  "Check first due date for the cycle"
                ).eq(results.exp_first_due_at.slice(0, 10));
              });
              break;

            case "firstMinPayCents":
              it(`should be able to validate first min pay cents`, async () => {
                response = await promisify(statementsAPI.getStatementByAccount(accountID));
                expect(response.status).to.eq(200);
                expect(
                  String(response.body[0].min_pay_due.min_pay_cents),
                  "Verify a Minimum Pay Cents for cycle"
                ).to.includes(String(results.exp_first_min_pay_cents));
              });
              break;

            case "purchaseWindowDt":
              it(`should be able to get the statement `, async () => {
                response = await promisify(statementsAPI.getStatementByAccount(accountID));
                expect(response.status).to.eq(200);
                cycleStatementID = statementValidator.getStatementIDByNumber(response, 0);
              });
              it(`should be able to validate promo puchase window end date`, async () => {
                response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
                expect(response.status).to.eq(200);
                expect(
                  response.body.account_overview.promo_purchase_window_exclusive_end.slice(0, 10),
                  "Check the promo expiry date"
                ).eq(results.exp_promo_purchase_window_exclusive_end.slice(0, 10));
              });

              break;

            case "amSchedule":
              it(`should be able to validate first due date in AM Schedule`, async () => {
                let amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
                expect(amResponse.status, "verify the response is successful").eq(200);
                expect(
                  amResponse.body[0].min_pay_due_at.slice(0, 10),
                  "Check first due date in Amortization schedule"
                ).eq(results.exp_first_due_at.slice(0, 10));
              });
              break;

            case "deferredInt":
              it(`should be able to get the statement`, async () => {
                response = await promisify(statementsAPI.getStatementByAccount(accountID));
                expect(response.status).to.eq(200);
                cycleStatementID = statementValidator.getStatementIDByNumber(response, 0);
              });
              it(`should be able to validate deferred interest`, async () => {
                response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
                expect(response.status).to.eq(200);
                expect(response.body.balance_summary.deferred_interest_balance_cents, "Check the deferred interest").eq(
                  parseInt(results.am_interest_balance_cents)
                );
              });
              break;
            //Create Charge transaction
            case "charge":
              it(`should be able to create create charge'`, async () => {
                const ChargePayload: CreateCharge = {
                  effective_at: results.effective_at,
                  original_amount_cents: results.original_amount_cents,
                };
                response = await promisify(
                  chargeAPI.chargeForNegativeAccount(accountID, "create_charge.json", ChargePayload, results.exp_status)
                );
              });
              break;
          }
        });
      });
    });

    type CreateProduct = Pick<
      ProductPayload,
      | "cycle_interval"
      | "cycle_due_interval"
      | "promo_len"
      | "promo_min_pay_type"
      | "promo_purchase_window_len"
      | "promo_interest_deferred"
      | "promo_default_interest_rate_percent"
      | "promo_min_pay_percent"
      | "delinquent_on_n_consecutive_late_fees"
      | "charge_off_on_n_consecutive_late_fees"
      | "post_promo_len"
      | "post_promo_min_pay_type"
      | "post_promo_default_interest_rate_percent"
      | "first_cycle_interval_del"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "promo_len"
      | "promo_min_pay_type"
      | "promo_purchase_window_len"
      | "promo_min_pay_percent"
      | "promo_interest_deferred"
      | "promo_impl_interest_rate_percent"
    >;

    type CreateCharge = Pick<ChargePayload, "effective_at" | "original_amount_cents">;
  });
});
