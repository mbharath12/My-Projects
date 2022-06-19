import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import monthlyFeesJSON from "cypress/resources/testdata/lineitem/monthly_fee_boundary_values.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts - Validation of Monthly fees details
// PP204 Monthly fees validation - Automated process
// PP206 Monthly fees validation - First month fees
// PP208 Monthly fees validation - Attempt to apply monthly fees amount over and above the Credit limit
// PP209 Monthly fees validation - Attempt to apply negative fees
// PP210 Monthly fees validation - Attempt to apply 0 fees
// PP211 Monthly fees validation - Attempt to apply 31 cents fees
// PP212 Monthly fees validation - Attempt to apply USD 20 fees
// PP213 Monthly fees validation - Attempt to apply USD 1000 fees
// PP214 Monthly fees validation - Attempt to apply monthly fees more than the Credit limit
// PP207 Monthly fees validation - Automated process when due date for fees falls on a holiday

//Validating monthly fee type and monthly fee cents in account line_items
TestFilters(["regression", "monthlyFee", "boundaryValue"], () => {
  describe("Monthly fees validation - validate monthly fees reflected with different boundary values", function () {
    let accountID;
    let response;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new product
      productAPI.createNewProduct("product_revolving.json").then((newProductID) => {
        Cypress.env("product_id", newProductID);
      });
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });
    monthlyFeesJSON.forEach((data) => {
      if (data.response_status === "200") {
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          // Update product, customer, monthly fee and effective date in account
          // JSON file
          const accountPayload: CreateAccount = {
            product_id: Cypress.env("product_id"),
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
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
          const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, 7);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
          expect(response.status).to.eq(200);
        });

        //Validate monthly fees in line items
        it(`should have validate monthly fee details - '${data.tc_name}''`, async () => {
          //Validate the  monthly fee details
          if (parseInt(data.response_status) === 200 && parseInt(data.monthly_fee_cents) > 0) {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            const monthlyFeeSON = {
              status: "VALID",
              type: "MONTH_FEE",
              original_amount_cents: parseInt(data.monthly_fee_cents),
            };
            lineItemValidator.validateLineItem(response, monthlyFeeSON);
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
