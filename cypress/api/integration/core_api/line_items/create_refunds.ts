/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { refundAPI } from "../../../api_support/refund";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

TestFilters(["smoke", "regression", "refund"], () => {
  describe("Validate refunds line_item", () => {
    let accountID;
    let productID;
    let customerID;
    let response;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    it("should be able to create account", async () => {
      response = await promisify(accountAPI.createNewAccount(productID, customerID, "", "account.json"));
      accountID = response.body.account_id;
    });

    it("should be able to create the refund line item ", async () => {
      const refundJson = await promisify(cy.fixture(Cypress.env("templateFolderPath").concat("/refund/refund.json")));
      refundAPI.createRefund(refundJson, accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.line_item_summary.principal_cents).to.eq(-20);
      });
    });
  });
});
