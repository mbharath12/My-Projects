import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { rollTimeAPI } from "../../api_support/rollTime";
import accountStatusJSON from "../../../resources/testdata/account/account_config_with_cycle_interval.json";
import { StatementBalanceSummary, statementValidator } from "../../api_validation/statements_validator";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
//Test Scripts
//pp1278 - Verify first cycle interval can be set at account level and this drives interval for first cycle in the account - installment product
//pp1279 - Verify first cycle interval is same as product check the first cycle interval is same as other cycle intervals - installment product
//pp1280 - Verify first cycle interval is set to 0 check this drives interval for first cycle in the account - installment product
//pp1280A - Verify first cycle interval can be set at account level and this drives interval for first cycle in the account for Revolving product
//pp1280B - Verify first cycle interval is same as product check the first cycle interval is same as other cycle intervals for Revolving product
//pp1280C - Verify first cycle interval is set to 0 check this drives interval for first cycle in the account for Revolving product
//pp1280D to pp1280H - Verify first cycle interval when cycle interval 7 days, 14 days, 21days , 30 days, 1 month and first cycle date less than Cycle interval
//pp1280I to pp1280M - Verify first cycle interval with 7 days, 14 days, 21days, 30 days, 1 month and First cycle date more than cycle interval

TestFilters(["accountSummary", "config", "cycleInterval", "regression"], () => {
  //Validate account config with first cycle interval
  describe("Validate account config - first cycle interval ", function () {
    let accountID;
    let productID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    accountStatusJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //Update product payload
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.product_first_cycle_interval,
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_type, productPayload));
        productID = response.body.product_id;
        cy.log("new installment product created : " + productID);
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer, account effective date and first_cycle_interval details in account JSON file
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: data.account_effective_at,
          first_cycle_interval: data.account_first_cycle_interval,
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      //Calling roll time forward to get the first statement for account
      it(`should be able to roll time forward to get statements - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 65);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have to validate first statement cycle start date and end date - '${data.tc_name}'`, () => {
        const statementCycle: CreateStatementCycle = {
          account_id: accountID,
          statement_number: 0,
          cycle_inclusive_start: data.stmt1_cycle_start_dt.slice(0, 10),
          cycle_exclusive_end: data.stmt1_cycle_end_dt.slice(0, 10),
        };
        statementValidator.validateStatementCycleInterval(statementCycle);
      });

      it(`should have to validate second statement cycle start date and end date - '${data.tc_name}'`, () => {
        const statementCycle: CreateStatementCycle = {
          account_id: accountID,
          statement_number: 1,
          cycle_inclusive_start: data.stmt2_cycle_start_dt.slice(0, 10),
          cycle_exclusive_end: data.stmt2_cycle_end_dt.slice(0, 10),
        };
        statementValidator.validateStatementCycleInterval(statementCycle);
      });
    });
  });
});
type CreateProduct = Pick<ProductPayload, "cycle_interval" | "cycle_due_interval" | "first_cycle_interval">;
type CreateStatementCycle = Pick<
  StatementBalanceSummary,
  "statement_number" | "account_id" | "cycle_inclusive_start" | "cycle_exclusive_end"
>;
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at" | "first_cycle_interval">;
