/* eslint-disable cypress/no-async-tests */
import { authAPI } from "../../../api_support/auth";
import { customerAPI } from "../../../api_support/customer";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

TestFilters(["smoke", "regression", "customer"], () => {
  describe("Create customer", () => {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    it("should be able to create a new Customer", async () => {
      const customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("newly created customer:".concat(customerID));
    });

    xit("should be able to get all customers", () => {
      customerAPI.getAllCustomer().then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
