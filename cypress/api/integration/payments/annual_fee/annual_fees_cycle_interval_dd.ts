import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import { statementValidator } from "../../../api_validation/statements_validator";
import { statementsAPI } from "cypress/api/api_support/statements";
import annualFeeCreditJSON from "cypress/resources/testdata/lineitem/annual_fee_credit.json";
import { lineItemsAPI } from "../../../api_support/lineItems";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

// Test Scripts
// PP238 - Annual fees on Cards set up with monthly cycle interval
// PP239 - Annual fees on Cards sets up with less than 1 month cycle interval - 7 days
// PP240 - Annual fees on Cards sets up with less than 1 month cycle interval - 15 days
TestFilters(["regression", "annualFee", "cycleInterval"], () => {
  describe("Validate annual fee functionality with different cycle intervals", function () {
    let accountID;
    let productID;
    let effectiveDate;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    annualFeeCreditJSON.forEach((data) => {
      it(`should be able to create product - '${data.tc_name}'`, async () => {
        //Update cycle interval in creditProduct json file
        //Create product JSON
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_interval,
          first_cycle_interval: data.cycle_interval,
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct("product_credit.json", productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
      });

      it(`should be able to create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer, late fee, origination fee, monthly fee, annual fee and effectiveDate in account JSON file
        const days = parseInt(data.account_effective_dt);
        effectiveDate = dateHelper.addDays(days, 0);
        //Update payload and create an account
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: effectiveDate,
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          annual_fee_cents: parseInt(data.annual_fee_cents),
        };
        //Create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
      });

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward - '${data.tc_name}'`, async () => {
        //Roll time forward to generate surcharge lineItem
        const endDate = dateHelper.getRollDate(1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate annual fee line item - '${data.tc_name}'`, async () => {
        //Validate the  repayment amount
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        //Verify YEAR_FEE in line item
        type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        const yearFeeLineItem: AccLineItem = {
          status: "VALID",
          type: "YEAR_FEE",
          original_amount_cents: parseInt(data.annual_fee_cents),
        };
        lineItemValidator.validateLineItem(response, yearFeeLineItem);
      });

      //Validate annual fee statement details
      it(`should have validate annual fee statement details - '${data.tc_name}'`, () => {
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          expect(response.status).to.eq(200);
          const annualFeeStatementDate = dateHelper.getAnnualFeeStatementDate(effectiveDate);
          cy.log(annualFeeStatementDate);
          const annualFeeStatementID = statementValidator.getStatementID(response, annualFeeStatementDate);
          cy.log(annualFeeStatementID);
          statementsAPI.getStatementByStmtId(accountID, annualFeeStatementID).then((response) => {
            expect(response.status).to.eq(200);
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const yearFeeLineItem: StmtLineItem = {
              status: "VALID",
              type: "YEAR_FEE",
              original_amount_cents: parseInt(data.annual_fee_cents),
            };
            lineItemValidator.validateStatementLineItem(response, yearFeeLineItem);
          });
        });
      });
    });
  });
});

type CreateProduct = Pick<ProductPayload, "cycle_interval" | "cycle_due_interval" | "first_cycle_interval">;
type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "late_fee_cents"
  | "origination_fee_cents"
  | "monthly_fee_cents"
  | "initial_principal_cents"
  | "annual_fee_cents"
>;
