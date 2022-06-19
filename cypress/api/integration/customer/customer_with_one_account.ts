/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../api_support/account";
import { productAPI } from "../../api_support/product";
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests";
import { dateHelper } from "../../api_support/date_helpers";

//Test Covered
//PP1326	Customer with one account

TestFilters(["customer", "regression"], () => {
  describe("Verify create new Customer and assign account", function () {
    let response;

    //Create Access Token
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new installment product
      const newInstallmentProductID = await promisify(productAPI.createNewProduct("payment_product.json"));
      cy.log("new product created " + newInstallmentProductID);
      Cypress.env("product_id", newInstallmentProductID);
    });
    //Create a new customer
    it("should have create a customer", async () => {
      const newCustomerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created " + newCustomerID);
      Cypress.env("customer_id", newCustomerID);
    });

    it("should have create an account and assign customer", async () => {
      //Update product in account JSON file
      const effective_at = dateHelper.addDays(0, 0);
      response = await promisify(
        accountAPI.createNewAccount(
          Cypress.env("product_id"),
          Cypress.env("customer_id"),
          effective_at,
          "account_credit.json"
        )
      );
      expect(response.status).to.eq(200);
      const responseAccountID = response.body.account_id;
      cy.log("new account created: " + responseAccountID);
      const responseCustomerID = response.body.customers[0].customer_id;
      expect(responseCustomerID.toString(), "Customer should be assigned to account").to.eq(
        Cypress.env("customer_id").toString()
      );
    });
  });
});
