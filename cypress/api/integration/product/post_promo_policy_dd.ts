/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { dateHelper } from "../../api_support/date_helpers";
import { authAPI } from "../../api_support/auth";
import { statementsAPI } from "../../api_support/statements";
import { statementValidator } from "../../api_validation/statements_validator";
import lineItemProcessingJSON from "../../../resources/testdata/product/post_promo_policy.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1240-Verify promo_default_interest_rate_percent is used for interest calculations
//PP1241-Verify promo_default_interest_rate_percent is used for interest calculations during promo period and settings at Account level will override the set up in the Product level
//PP1242-Verify post_promo_len parameter defines the number of installments / dues in a Installment product and all accounts under the Product
//PP1243-Verify post_promo_len parameter defined at account level defines the number of installments / dues in a Installment product account
//PP1244,PP1245-Verify post_promo_min_pay_type - AM, defines the Current due calculation method for the post-promotional period - for Intstallment and MultiAdv loan
//PP1246-Verify post_promo_default_interest_rate_percent is the Interest rate applied for Post promotion period for all account under a product
//PP1247-Verify post_promo_default_interest_rate_percent set up at Account level overrides the interest rate set up at Product level for the  Post promotion period


TestFilters(["regression", "product", , "account", "promo", "postpromo"], () => {
  describe("Validation of post promo attributes on product and account", function () {
    let accountID;
    let productID;
    let productJSONFile;
    let customerID;
    let response;
    let stmtresponse;

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
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        if (data.product_creation.toLowerCase() === "true") {
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
              promo_apr_range_inclusive_lower: parseInt(data.promo_apr_range_inclusive_lower),
              promo_apr_range_inclusive_upper: parseInt(data.promo_apr_range_inclusive_upper),
              delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
              charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
              post_promo_len: parseInt(data.post_promo_len),
              post_promo_min_pay_type: data.post_promo_min_pay_type,
              post_promo_am_len_range_inclusive_lower: parseInt(data.post_promo_am_len_range_inclusive_lower),
              post_promo_am_len_range_inclusive_upper: parseInt(data.post_promo_am_len_range_inclusive_upper),
              post_promo_default_interest_rate_percent: parseInt(data.post_promo_default_interest_rate_percent),
              post_promo_apr_range_inclusive_lower: parseInt(data.post_promo_apr_range_inclusive_lower),
              post_promo_apr_range_inclusive_upper: parseInt(data.post_promo_apr_range_inclusive_upper),
              first_cycle_interval_del: "first_cycle_interval",
            };

            const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
            productID = response.body.product_id;
            cy.log("new product created successfully: " + productID);
          });
        }
        it(`should have create account'`, async () => {
          //create account JSON
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
            promo_impl_interest_rate_percent: parseInt(data.promo_impl_interest_rate_percent),
            post_promo_impl_interest_rate_percent: parseInt(data.post_promo_impl_interest_rate_percent),
            post_promo_impl_am_len: parseInt(data.post_promo_impl_am_len),
          };

          const response = await promisify(accountAPI.updateNCreateAccount(data.account_template_name, accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });

        it(`should have to wait for account roll time forward to make sure statement is processed - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getAccountEffectiveAt(data.roll_date);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
          expect(response.status).to.eq(200);
        });

        //Query the specific statement ID only when the loan end date parameter is empty
        if (data.exp_loan_end_date === "") {
          it(`should be able to query specific statement`, async () => {
            stmtresponse = await promisify(statementsAPI.getStatementByAccount(accountID));
            expect(stmtresponse.status).to.eq(200);
            const cycleStatementID = statementValidator.getStatementIDByNumber(stmtresponse, 1);
            stmtresponse = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
            expect(stmtresponse.status).to.eq(200);
          });
        }

        switch (data.transaction_type) {
          case "intCalcPostPromo":
            it(`should be able to validate interest based on post promo`, () => {
              expect(
                stmtresponse.body.balance_summary.am_interest_balance_cents,
                "Check the am interest balance cents when the post promo attributes mentioned"
              ).eq(parseInt(data.exp_interest_balance_cents));
            });
            break;
          case "intCalc":
            it(`should be able to validate interest based on promo`, () => {
              expect(
                stmtresponse.body.balance_summary.interest_balance_cents,
                "Check the interest balance cents when the promo attributes mentioned"
              ).eq(parseInt(data.exp_interest_balance_cents));
            });
            break;

          case "amSchedule":
            it(`should be able to validate AM Schedule`, async () => {
              let amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
              expect(amResponse.status, "verify the response is successful").eq(200);
              expect(
                amResponse.body[0].min_pay_due_at.slice(0, 10),
                "Check first due date in Amortization schedule"
              ).eq(data.min_pay_due_at.slice(0, 10));
            });
            break;

          case "getLoanEndDt":
            it(`should be able to validate loan end date`, async () => {
              response = await promisify(accountAPI.getAccountById(accountID));
              expect(response.status).to.eq(200);
              expect(
                response.body.account_product.product_lifecycle.loan_end_date.slice(0, 10),
                "Check the loan end date"
              ).eq(data.exp_loan_end_date.slice(0, 10));
            });
            break;
        }
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
      | "promo_apr_range_inclusive_lower"
      | "promo_apr_range_inclusive_upper"
      | "delinquent_on_n_consecutive_late_fees"
      | "charge_off_on_n_consecutive_late_fees"
      | "post_promo_len"
      | "post_promo_min_pay_type"
      | "post_promo_am_len_range_inclusive_lower"
      | "post_promo_am_len_range_inclusive_upper"
      | "post_promo_default_interest_rate_percent"
      | "post_promo_apr_range_inclusive_lower"
      | "post_promo_apr_range_inclusive_upper"
      | "first_cycle_interval_del"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "promo_impl_interest_rate_percent"
      | "post_promo_impl_interest_rate_percent"
      | "post_promo_impl_am_len"
    >;
  });
});
