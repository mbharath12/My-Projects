/* eslint-disable cypress/no-async-tests */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { productAPI } from "../../../api_support/product";
import { accountAPI } from "../../../api_support/account";
import { authAPI } from "../../../api_support/auth";
//import OutputSchema from "../../../validation/json_schema";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { customerAPI } from "../../../api_support/customer";

TestFilters(["smoke", "regression", "accounts"], () => {
  describe("create account related tests", () => {
    let accountID;
    let customerID;
    let productID;

    before(async() => {
      authAPI.getDefaultUserAccessToken();
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
      productID = await promisify(productAPI.createNewProduct("product.json"));
    });

    it("can create a new account", async () => {
      const response = await promisify(accountAPI.createNewAccount(productID, customerID, "", "account.json"));
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      cy.log("new account created : " + accountID);
      //TODO: Check schema validation
      //OutputSchema.post_accounts(response.body);
    });
  });
});
