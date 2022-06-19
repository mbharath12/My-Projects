/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import { creditReportingAPI } from "../../api_support/credit_reporting";
import { creditReportValidator } from "../../api_validation/credit_reporting_validator";
import creditReportJSON from "../../../resources/testdata/creditreporting/credit_report_account_status.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//pp1958-pp1958A - Verify account status for current account is 11 when past due date is 29 days
//pp1960-pp1960C - Verify account status is 71 when past due date is 30 to 59 days
//pp1961-pp1961C - Verify account status is 78 when past due date is 60 to 89 days
//pp1962-pp1962C - Verify account status is 80 when past due date is 90 to 119 days
//pp1963-pp1963C - Verify account status is 82 when past due date is 120 to 149 days
//pp1964-pp1964C - Verify account status is 83 when past due date is 150 to 179 days
//pp1965-pp1965A - Verify account status is 84 when past due date is 180 and more days

TestFilters(["creditReporting", "account_status", "regression"], () => {
  describe("Validate account status with past the due dates for credit report", function () {
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
      it(`Should have create product`, async () => {
        //Create product JSON
        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.chargeoff),
        };
        //Update payload and create product
        const response = await promisify(productAPI.updateNCreateProduct("product_credit.json", productPayload));
        expect(response.status).to.eq(200);
        Cypress.env("product_id", response.body.product_id);
      });
      it(`Should have create account- '${data.tc_name}'`, async () => {
        const productID = Cypress.env("product_id");
        const customerID = Cypress.env("customer_id");
        //Create account JSON
        //Update payload and create an account
        const response = await promisify(
          accountAPI.createNewAccount(productID, customerID, data.account_effective_at, "account_credit.json")
        );
        expect(response.status).to.eq(200);
        Cypress.env("account_id", response.body.account_id);
      });

      //Calling roll time forward to generate credit reports
      it(`Should be able to roll time forward generate credit reports`, async () => {
        accountID = Cypress.env("account_id");
        const response = await promisify(
          rollTimeAPI.rollAccountForward(accountID, data.roll_forward_date.slice(0, 10))
        );
        expect(response.status).to.eq(200);
      });

      it(`Should have validate account status after cycle interval - '${data.tc_name}'`, async () => {
        const response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status, "verify account status").to.eq(data.account_status);
      });
      //Get last credit report for account and verify account status details
      it(`Should verify account status details in metro2 credit report details for account`, () => {
        //Get last credit report id
        creditReportValidator.getLastCreditReportID(accountID).then((creditReportID) => {
          //Get specific credit report details for account
          creditReportingAPI.getMetro2CreditReport(accountID, creditReportID).then((creditReportResponse) => {
            expect(creditReportResponse.status).to.eq(200);
            //Verify account status and payment_rating with different account types for credit report
            expect(creditReportResponse.body.account_status, "Verify account status for credit report").to.eq(
              data.account_status_credit_report
            );
            expect(creditReportResponse.body.payment_rating, "Verify payment_rating for credit report").to.null;
          });
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  "delinquent_on_n_consecutive_late_fees" | "charge_off_on_n_consecutive_late_fees"
>;
