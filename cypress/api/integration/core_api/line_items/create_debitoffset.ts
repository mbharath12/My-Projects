/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { customerAPI } from "../../../api_support/customer";
import { lineItemsAPI } from "../../../api_support/lineItems";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";

TestFilters(["smoke", "regression", "debitOffSet"], () => {
  describe("create Debit offset Tests", () => {
    let accountID;
    let productID;
    let customerID;
    const debitOffset = Math.floor(Math.random() * 500);

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID =newProductID
      })
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    it("should be able to create account", async () => {
      const effectiveAt = dateHelper.addDays(-5, 0);
      const response = await promisify(accountAPI.createNewAccount(productID, customerID, effectiveAt, "account.json"));
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      Cypress.env("origination_fees", response.body.account_product.product_lifecycle.origination_fee_impl_cents);
      cy.log("new account created : " + accountID);
    });

    it("should be able to create the debit offset line item ", () => {
      const effectiveAt = dateHelper.addDays(-3, 0);
      lineItemsAPI.debitOffsetForAccount(accountID, "debit_offset.json", debitOffset, effectiveAt);
    });

    it("should be able to verify debit offset is present in account", async () => {
      const response = await promisify(accountAPI.getAccountById(accountID));
      expect(response.status).to.eq(200);
      const expectedAmount =  -1 * (debitOffset-Cypress.env("origination_fees"))
      expect(response.body.summary.total_balance_cents).to.eq(expectedAmount);
    });
  });
});
