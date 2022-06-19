/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { creditReportingAPI } from "../../api_support/credit_reporting";
import { statementsAPI } from "../../api_support/statements";
import { creditReportValidator } from "../../api_validation/credit_reporting_validator";
import creditReportJSON from "../../../resources/testdata/creditreporting/credit_report_list.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//pp1384 - Verify list of all Current and Metro2 Credit reports for a specific account
//pp1385 - Verify to get a Specific Metro2 Credit report for a specific account
//pp1386 - Verify credit reports are generated on statement generation
//pp1387 - Verify a report will be generated every time a statement is recorded
//pp1388 - Verify response from metro 2 credit report for a specific account matched details on the account
//pp1389 - Verify account's historical Metro2 credit reports can be obtained from the accounts
//pp1370 - Verify account status reports in the form of Metro2 credit reports
//pp1401 - Verify Credit reports are generated to Present time after account on boarding

TestFilters(["creditReporting", "regression"], () => {
  //Validate list if all credit reports for an account
  describe("Validate credit reporting for account ", function () {
    let accountID: any;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a product
      productAPI.createNewProduct("payment_product.json").then((newProductID) => {
        Cypress.env("productId", newProductID);
      });
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    //Iterate each account
    creditReportJSON.forEach((data) => {
      it(`Should have create account- '${data.tc_name}'`, async () => {
        const productID = Cypress.env("productId");
        const customerID = Cypress.env("customer_id");
        const effectiveDate = data.account_effective_at;

        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDate,
          first_cycle_interval: data.first_cycle_interval,
          initial_principal_cents: parseInt(data.initial_principle_in_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          annual_fee_cents: parseInt(data.annual_fee_cents),
        };
        //Update payload and create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        Cypress.env("account_id", response.body.account_id);
      });

      //Calling roll time forward to generate 3 statements
      it(`Should be able to roll time forward generate 3 statements`, async () => {
        accountID = Cypress.env("account_id");
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 25);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Get credit report list verify with statements
      it(`Should verify list of all credit reports for account and cycle intervals are same for both credit report and statements `, async () => {
        //Get credit report list for account
        const creditReportResponse = await promisify(creditReportingAPI.getAllCreditReports(accountID));
        expect(creditReportResponse.status).to.eq(200);
        //Get statement list for account
        statementsAPI.createStatementList(accountID).then((statementResponse) => {
          expect(statementResponse.status).to.eq(200);
          //Verify credit report cycle intervals are same as statements cycle intervals
          creditReportValidator.validateCreditReportCycleIntervalsWithStatements(
            creditReportResponse,
            statementResponse
          );
        });
      });

      //Get first credit report for account and verify details
      it(`Should verify first metro2 credit report details for account`, async () => {
        creditReportValidator.getCreditReportIDByNumber(accountID, 0).then((newCreditID) => {
          Cypress.env("creditReportID", newCreditID);
          cy.log(newCreditID);
        });
        //Get first credit report id
        const firstCreditReportID = Cypress.env("creditReportID");
        //Get first metro2 credit report details for account
        const firstCreditReportResponse = await promisify(
          creditReportingAPI.getMetro2CreditReport(accountID, firstCreditReportID)
        );
        //Verify first credit report details
        creditReportValidator.validateMetro2CreditReportDetails(
          firstCreditReportResponse,
          data,
          data.credit1_balance,
          accountID
        );
      });

      //Get second credit report for account and verify details
      it(`Should verify second metro2 credit report details for account`, async () => {
        //Get second credit report id
        creditReportValidator.getCreditReportIDByNumber(accountID, 1).then((newCreditID) => {
          Cypress.env("creditReportID", newCreditID);
          cy.log(newCreditID);
        });

        const secondCreditReportID = Cypress.env("creditReportID");
        //Get second credit report details for account
        const secondCreditReportResponse = await promisify(
          creditReportingAPI.getMetro2CreditReport(accountID, secondCreditReportID)
        );
        //Verify second metro2 credit report details
        creditReportValidator.validateMetro2CreditReportDetails(
          secondCreditReportResponse,
          data,
          data.credit2_balance,
          accountID
        );
      });

      //Get third Metro2 credit report for account and verify details
      it(`Should verify third metro2 credit report details for account `, async () => {
        //Get third credit report id
        creditReportValidator.getCreditReportIDByNumber(accountID, 2).then((newCreditID) => {
          Cypress.env("creditReportID", newCreditID);
          cy.log(newCreditID);
        });
        const thirdCreditReportID = Cypress.env("creditReportID");
        //Get third credit report details for account
        const thirdCreditReportResponse = await promisify(
          creditReportingAPI.getMetro2CreditReport(accountID, thirdCreditReportID)
        );
        //Verify third metro2 credit report details
        creditReportValidator.validateMetro2CreditReportDetails(
          thirdCreditReportResponse,
          data,
          data.credit3_balance,
          accountID
        );
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "first_cycle_interval"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "initial_principal_cents"
>;
