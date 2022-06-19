/* eslint-disable cypress/no-async-tests */
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import TestFilters from "../../../support/filter_tests";
import promisify from "cypress-promise";

//Test cases covered - PP1339 - New Customer creation
TestFilters(["customer", "regression"], () => {
  describe("Verify create a new Customer", function () {
    //Create Access Token
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });
    //Create a new customer
    it("should be able to create a new customer", async () => {
      const customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      Cypress.env("customerId", customerID);
      cy.log("new customer is created : " + customerID);
    });
  });
});
