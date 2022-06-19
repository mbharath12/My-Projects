/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import billingCycleJSON from "../../../../resources/testdata/billingcycle/cycle_type_product_accounts_revolving.json";
import transactionJSON from "../../../../resources/testdata/billingcycle/cycle_type_transaction_revolving.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
// eslint-disable-next-line cypress/no-unnecessary-waiting

//TC2083 - Verify cycle type details in AM schedule with post promo len as 0 cycle interval 1 month cycle due interval 25 days first cycle 0 days
//TC2084 - Verify cycle type details in AM schedule with post promo len as 0 cycle interval 1 month cycle due interval 5 days first cycle 0 days
//TC2085 - Verify cycle type details in AM schedule with post promo len as 0 cycle interval 1 month cycle due interval -5 days first cycle 0 days

TestFilters(["regression", "billingCycle", "cycleType"], () => {
  let productID;
  let validationTransactionJSON;
  let accountID;
  let customerID;
  let response;
  describe("Validate billing cycle date and due date with different billing policies", function () {
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });

    //iterate each product and account
    billingCycleJSON.forEach((data) => {
      validationTransactionJSON = transactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          const productJSONFile = data.product_template_name;

          const productPayload: CreateProduct = {
            post_promo_len: parseInt(data.post_promo_len),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            delete_field_name: "first_cycle_interval",
          };
          //Update payload and create an product
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
          cy.log("created product id " + productID);
        });

        it(`should have create account`, async () => {
          //create account JSON
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            cycle_due_interval: data.cycle_due_interval,
            delete_field_name: "cycle_interval",
            cycle_due_interval_del: "delete",
            first_cycle_interval: data.first_cycle_interval,
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
          };
          //Update payload and create an account
          response = await promisify(accountAPI.updateNCreateAccount(data.account_template_name, accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);

          const moveDays = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 6);
          const rollDate = dateHelper.moveDate(data.account_effective_dt, moveDays).slice(0, 10);
          rollTimeAPI.rollAccountForward(accountID, rollDate).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });

      describe(`should have include  cycle type details - '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          it(`should have include account cycle type details  - '${results.tc_name}'`, () => {
            const cycleNumber = parseInt(results.cycle_number) - 1;
            const statementCycle: CreateStatementCycle = {
              account_id: accountID,
              statement_number: cycleNumber,
              cycle_inclusive_start: results.exp_cycle_inclusive_start,
              cycle_exclusive_end: results.exp_cycle_exclusive_end,
              min_pay_due_at: results.exp_min_pay_due_dt,
            };
            statementValidator.validateStatementCycleInterval(statementCycle);
          });
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "post_promo_len"
  | "first_cycle_interval_del"
  | "delete_field_name"
  | "cycle_interval"
  | "cycle_due_interval"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "post_promo_len"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "delete_field_name"
  | "cycle_due_interval_del"
>;

type CreateStatementCycle = Pick<
  StatementBalanceSummary,
  "statement_number" | "account_id" | "min_pay_due_at" | "cycle_inclusive_start" | "cycle_exclusive_end"
>;
