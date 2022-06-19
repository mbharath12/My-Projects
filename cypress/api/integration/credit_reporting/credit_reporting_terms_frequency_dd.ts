/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { ProductPayload, productAPI } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { creditReportingAPI } from "../../api_support/credit_reporting";
import { StatementBalanceSummary, statementValidator } from "../../api_validation/statements_validator";
import { creditReportValidator } from "../../api_validation/credit_reporting_validator";
import creditReportJSON from "../../../resources/testdata/creditreporting/credit_reporting_terms_frequency.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//pp1405 - Verify credit report terms frequency is W for 7 days cycle interval
//and statements and credit reports are generated in cycle intervals
//pp1406 - Verify credit report terms frequency is Y for 14 days cycle interval
//and statements and credit reports are generated in cycle intervals
//pp1407 - Verify credit report terms frequency is M for 21 days cycle interval
//and statements and credit reports are generated in cycle intervals
//pp1408 - Verify credit report terms frequency is M for 30 days cycle interval
//and statements and credit reports are generated in cycle intervals
//pp1409 - Verify credit report terms frequency is M for 1 month cycle interval
//and statements and credit reports are generated in cycle intervals
//pp1409A - Verify credit report terms frequency is Q for 3 months cycle interval
//pp1409B - Verify credit report terms frequency is S for 6 months cycle interval
//pp1409C - Verify credit report terms frequency is Y for 1 year cycle interval

TestFilters(["creditReporting", "termsFrequency", "regression"], () => {
  //Validate credit report terms frequency with different cycle intervals
  describe("Validate terms frequency and cycle interval for credit reporting ", function () {
    let accountID;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    //Iterate each product and account
    creditReportJSON.forEach((data) => {
      it(`Should have create a product - '${data.tc_name}'`, async () => {
        //Create product JSON
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.first_cycle_interval,
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct("payment_product.json", productPayload));
        expect(response.status).to.eq(200);
        Cypress.env("product_id", response.body.product_id);
      });

      it(`Should have create a account - '${data.tc_name}'`, async () => {
        //Create account JSON
        const accountPayload: CreateAccount = {
          product_id: Cypress.env("product_id"),
          customer_id: Cypress.env("customer_id"),
          effective_at: data.account_effective_at,
          first_cycle_interval: data.first_cycle_interval,
          initial_principal_cents: parseInt(data.initial_principle_in_cents),
        };
        //Update payload and create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        Cypress.env("account_id", response.body.account_id);
      });

      //Calling roll time forward to generate 2 statements
      it(`Should be able to roll time forward generate 2 statements - '${data.tc_name}'`, async () => {
        accountID = Cypress.env("account_id");
        const moveDate = parseInt(data.cycle_interval) * 2;
        const endDate = dateHelper.getRollDate(moveDate);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Get credit report for account and verify each credit report terms frequency with cycle interval
      it(`Should terms frequency in credit report - '${data.tc_name}'`,  () => {
        //Get credit report id
        creditReportValidator.getCreditReportIDByNumber(accountID, 0).then((creditReportId) => {
          //Get specific credit report details for account
          creditReportingAPI.getMetro2CreditReport(accountID, creditReportId).then((creditReportResponse) => {
            expect(creditReportResponse.status).to.eq(200);
            //Verify terms frequency for credit report
            expect(creditReportResponse.body.terms_frequency, "Verify terms frequency for credit report").to.eq(
              data.terms_frequency
            );
          });
        });
      });

      if (data.check_cycle_interval.toLowerCase() === "true") {
        it(`Should credit reports and statements are generated with cycle interval - '${data.tc_name}'`, () => {
          //Verify cycle_inclusive_start and cycle_exclusive_end dates for credit report
          creditReportValidator.validateCreditReportCycleInterval(
            accountID,
            0,
            data.cycle1_inclusive_start,
            data.cycle1_exclusive_end
          );
          creditReportValidator.validateCreditReportCycleInterval(
            accountID,
            1,
            data.cycle2_inclusive_start,
            data.cycle2_exclusive_end
          );
          // Verify cycle_inclusive_start and cycle_exclusive_end dates for
          // statements
          const statementCycle1: CreateStatementCycle = {
            account_id: parseInt(accountID),
            statement_number: 0,
            cycle_inclusive_start: data.cycle1_inclusive_start,
            cycle_exclusive_end: data.cycle1_exclusive_end,
          };
          statementValidator.validateStatementCycleInterval(statementCycle1);

          const statementCycle2: CreateStatementCycle = {
            account_id: parseInt(accountID),
            statement_number: 1,
            cycle_inclusive_start: data.cycle2_inclusive_start,
            cycle_exclusive_end: data.cycle2_exclusive_end,
          };
          statementValidator.validateStatementCycleInterval(statementCycle2);
        });
      }
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "first_cycle_interval" | "initial_principal_cents"
>;

type CreateProduct = Pick<ProductPayload, "cycle_interval" | "cycle_due_interval" | "first_cycle_interval">;

type CreateStatementCycle = Pick<
  StatementBalanceSummary,
  "statement_number" | "account_id" | "cycle_inclusive_start" | "cycle_exclusive_end"
>;
