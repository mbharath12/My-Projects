/* eslint-disable cypress/no-async-tests */
import { productAPI } from "../../api_support/product";
import { accountAPI } from "../../api_support/account";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { customerAPI } from "../../api_support/customer";
import promisify from "cypress-promise";
import { Constants } from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered - PP1327 - Single Customer having multiple account under different Product types

TestFilters(["customer", "regression"], () => {
  //Validate account level Config - summary section in account
  describe("Customer having multiple accounts with different product types", () => {
    // let accountID;
    // let productID;
    let customerID;
    let response;
    let productCreditID;
    let productInstallmentID;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    //Create a new revolving credit product
    it("should be able to create a new revolving credit product", async () => {
      productCreditID = await promisify(productAPI.createNewProduct("product_credit.json"));
      cy.log("new credit product created : " + productCreditID);
    });

    //Create a new revolving installment product
    it("should be able to create a new revolving installment product", async () => {
      productInstallmentID = await promisify(productAPI.createNewProduct("product_credit.json"));
      cy.log("new installment product created : " + productInstallmentID);
    });

    // Create a new customer
    it("should be able to create a new customer",  () => {
      const customerFileJSON = Constants.templateFixtureFilePath.concat("/customer/create_customer.json");

      cy.fixture(customerFileJSON).then((newCustomerJSON) => {
        const customerJSON = newCustomerJSON
        customerAPI.createCustomer(customerJSON).then((response) => {
          expect(response.status).to.eq(200);
          customerID = response.body.customer_id;
          cy.log("new customer created : " + customerID);
          Cypress.env("customerID", customerID);
        })
      })

    });

    it("should have create first account and assign customer", async () => {
      //Update product and customer in account JSON file
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(accountAPI.createNewAccount(productInstallmentID,customerID,effective_at,"account_credit.json"))
      const responseAccountID = response.body.account_id;
      cy.log("first account created: " + responseAccountID);
      const responseCustomerID = response.body.customers[0].customer_id;
      expect(responseCustomerID,"check customer id is displayed for installment account").to.eq(customerID)
    });

    it("should have create second account and assign customer", async () => {
      //Update product and customer in account JSON file
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(accountAPI.createNewAccount(productCreditID,customerID,effective_at,"account_credit.json"))
      const responseAccountID = response.body.account_id;
      cy.log("second account created: " + responseAccountID);
      const responseCustomerID = response.body.customers[0].customer_id;
      expect(responseCustomerID,"check customer id is displayed for credit account").to.eq(customerID)
    });
  });
});
