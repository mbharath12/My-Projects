import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { creditReportingAPI } from "../../api_support/credit_reporting";
import { creditReportValidator } from "../../api_validation/credit_reporting_validator";
import creditReportJSON from "../../../resources/testdata/creditreporting/credit_reporting_portfolio_type.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//pp1414A - Verify credit report portfolio type and account type for installment
//pp1415 - Verify credit report portfolio type and account type for credit
//pp1416 - Verify credit report portfolio type and account type for charge card
//pp1417 - Verify credit report portfolio type and account type for revolving loc
//pp1418 - Verify credit report portfolio type and account type for bnpl
//pp1419 - Verify credit report portfolio type and account type for multi advance

TestFilters(["creditReporting", " portfolioType", "accountType", "regression"], () => {
  //Validate credit report portfolio type and account type with different products
  describe("Validate portfolio type and account type for credit reporting ", function () {
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
        const productID = await promisify(productAPI.createNewProduct(data.product_type));
        Cypress.env("product_id", productID);
        cy.log(productID);
      });
      it(`Should have create a account - '${data.tc_name}'`, async () => {
        const accountPayload: CreateAccount = {
          product_id: Cypress.env("product_id"),
          customer_id: Cypress.env("customer_id"),
          effective_at: data.account_effective_at,
        };
        //Update payload and create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        Cypress.env("account_id", response.body.account_id);
      });

      //Calling roll time forward to generate credit reports
      it(`Should be able to roll time forward credit reports - '${data.tc_name}'`, async () => {
        accountID = Cypress.env("account_id");
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 35);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Get credit report for account and verify portfolio type and account type
      it(`Should able to see portfolio type and account type in credit report - '${data.tc_name}'`, () => {
        creditReportValidator.getCreditReportIDByNumber(accountID, 0).then((creditReportID) => {
          //Get specific credit report details for account
          creditReportingAPI.getMetro2CreditReport(accountID, creditReportID).then((creditReportResponse) => {
            expect(creditReportResponse.status).to.eq(200);
            //Verify portfolio type and account type for credit report
            expect(creditReportResponse.body.portfolio_type, "Verify portfolio type for credit report").to.eq(
              data.portfolio_type
            );
            expect(creditReportResponse.body.account_type, "Verify account type for credit report").to.eq(
              data.account_type
            );
          });
        });
      });
    });
  });
});
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at">;
