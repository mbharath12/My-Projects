import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import annualFeeJSON from "cypress/resources/testdata/lineitem/annual_fee.json";
import { lineItemsAPI } from "../../../api_support/lineItems";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts - Annual fees
// PP225 Annual fee validation - Automated process
// PP227 Annual fee validation - First year fee
// PP229 Annual fee validation - Attempt to apply annual fee amount over and above the credit limit
// PP230 Annual fee validation - Attempt to apply negative fee
// PP231 Annual fee validation - Attempt to apply 0 fee
// PP232 Annual fee validation - Attempt to apply 31 cents fee
// PP233 Annual fee validation - Attempt to apply USD 20 fee
// PP234 Annual fee validation - Attempt to apply USD 1000 fee

// This test suite will cover all the positive and negative test cases around
// annual fee. Product - Revolving product
TestFilters(["regression", "annualFee", "revolvingProduct"], () => {
  describe("Create a account with annual fee", function () {
    let accountID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new product
      productAPI.createNewProduct("product_revolving.json").then((newProductID) => {
        Cypress.env("product_id", newProductID);
      });
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    annualFeeJSON.forEach((data) => {
      if (data.response_status === "200") {
        it(`should be able to create account and assign customer - Annual Fee validation -'${data.tc_name}'`, async () => {
          //Update product, customer, late fee, origination fee, monthly fee, annual fee and effective_dt in account JSON file
          const days = parseInt(data.account_effective_dt);
          const effective_dt = dateHelper.addDays(days, 0);

          const accountPayload: CreateAccount = {
            product_id: Cypress.env("product_id"),
            customer_id: Cypress.env("customer_id"),
            effective_at: effective_dt,
            initial_principal_cents: parseInt(data.principle_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
          };
          //Create account and assign to customer
          response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });
        //Calling roll time forward to make sure account summary is updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          //Roll time forward to generate surcharge lineItem
          const endDate = dateHelper.getRollDate(1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });
        //Validate annual fee
        it(`should have validate annual fee details - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          if (parseInt(data.annual_fee_cents) > 0) {
            type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const annualFeeLineItem: AccLineItem = {
              status: "VALID",
              type: "YEAR_FEE",
              original_amount_cents: parseInt(data.annual_fee_cents),
            };
            lineItemValidator.validateLineItem(response, annualFeeLineItem);
          }
        });
      }
    });
  });
});

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
