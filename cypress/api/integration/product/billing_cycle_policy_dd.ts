/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import billingCycleJSON from "../../../resources/testdata/product/billing_policy_cycle_interval.json";
import TestFilters from "../../../support/filter_tests.js";
import { dateHelper } from "../../api_support/date_helpers";
import { StatementBalanceSummary, statementValidator } from "../../api_validation/statements_validator";
import promisify from "cypress-promise";

//PP1191 -PP1193 - Verify account statement is generated based on the Cycle interval specified - 7/30/1 month
//PP1194 - Verify account statement is generated based on the Cycle interval specified at account level.
//PP1195 - Verify the due dates on the AM schedule for the installments accounts
//PP1196 - Verify if positive the first due date is Cycle date plus the number of the cycle due interval days
//PP1197 - Verify if negative the Second due date is Cycle date minus the number of the cycle due interval days is the first due date
//PP1198 - Verify Cycle Due interval cannot be set up greater than the Cycle interval
//PP1200 - Verify the First Cycle interval should determine the Cycle date for the First cycle from the Origination date
//PP1201 - Verify the impact of First Cycle interval  parameter set up to 0
//PP1202 - Verify the impact of First Cycle interval  parameter if not set up
//PP1203 - Verify First cycle interval set up at Account level overrides this parameter setup at Product level


TestFilters(["regression", "billingCycle", "statements", "cycleInterval"], () => {
  let productID;
  let customerID;
  let accountID;
  let response;

  describe("Validate billing policy  with different cycle intervals ", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("new customer created successfully: " + customerID);
      });
    });

    //iterate each product and account
    billingCycleJSON.forEach((data) => {
      describe(`should have create product and account -'${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          const productJSONFile = data.product_template_name;

          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            first_cycle_interval: data.first_cycle_interval,
            doNot_check_response_status:false,
          };
          //Update payload and create an product
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          if (parseInt(data.exp_status) === 400) {
            expect(response.status,"cycle due interval should not be more than cycle interval").to.eq(parseInt(data.exp_status));
            }
          productID = response.body.product_id;
          cy.log("new product created successfully: " + response.body.product_id);
        });

        //create account
      if (parseInt(data.exp_status) !== 400)
        it(`should have create account`, async () => {
          const accountFileName = data.account_template_name;
          // create account Json
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            cycle_interval: parseInt(data.acc_cycle_interval),
            first_cycle_interval: data.acc_first_cycle_interval,
          };
          response = await promisify(accountAPI.updateNCreateAccount(accountFileName, accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });

        it(`should have to wait for account roll time forward  to make sure statement is processed - '${data.tc_name}'`, async () => {
          if (data.roll_date.length !== 0) {
            const endDate = dateHelper.getAccountEffectiveAt(data.roll_date);
            const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
            expect(response.status).to.eq(200);
          }
        });

        switch (data.transaction_type) {
          case "statement":
            it(`should have validate the cycle interval details -'${data.tc_name}'`, () => {
             if (parseInt(data.cycle_number_1) === 0) {
                const statementCycle: CreateStatementCycle = {
                  account_id: parseInt(accountID),
                  statement_number: parseInt(data.cycle_number_1),
                  cycle_inclusive_start: data.exp_cycle_inclusive_start_1,
                  cycle_exclusive_end: data.exp_cycle_exclusive_end_1,
                };
                statementValidator.validateStatementCycleInterval(statementCycle);
              }
              if (parseInt(data.cycle_number_2) === 1) {
                const statementCycle: CreateStatementCycle = {
                  account_id: parseInt(accountID),
                  statement_number: parseInt(data.cycle_number_2),
                  cycle_inclusive_start: data.exp_cycle_inclusive_start_2,
                  cycle_exclusive_end: data.exp_cycle_exclusive_end_2,
                };
                statementValidator.validateStatementCycleInterval(statementCycle);
              }
            });
            break;

          case "AM_schedule":
            it(`Should have the valid due date '${data.tc_name}'`, async () => {
              let amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
              expect(amResponse.status, "verify the response is successful").eq(200);
              expect(amResponse.body[0].min_pay_due_at.slice(0,10), "Check first due date in Amortization schedule").eq(
                data.min_pay_due_at.slice(0,10)
              );
            });
            break;
        }
      });
    });
  });
});

type CreateProduct = Pick<ProductPayload, "first_cycle_interval" | "cycle_interval" | "cycle_due_interval" | "doNot_check_response_status">;
type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "initial_principal_cents"
  | "credit_limit_cents"
  | "first_cycle_interval"
  | "cycle_due_interval"
  | "cycle_interval"
>;
type CreateStatementCycle = Pick<
  StatementBalanceSummary,
  "statement_number" | "account_id" | "cycle_inclusive_start" | "cycle_exclusive_end"
>;
