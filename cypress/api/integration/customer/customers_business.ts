/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../api_support/account";
import { productAPI } from "../../api_support/product";
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { Constants } from "../../api_support/constants";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests";

//Test cases covered -
//PP1333-Business customers for Project finance -Revolving Line of Credit
//PP1332-Business customers for Project finance -Multi Advance Installment loans
//PP1346-Business accounts - Entity linked to Stakeholders - on the account

TestFilters(["customer", "regression"], () => {
  describe("Verify Business customers for Project finance - Revolving Line of Credit & Multi Advance Instalment loans", function () {
    let response;
    let customerID;
    let customerExpectedJSON;

    //Create Access Token
    before(() => {
      authAPI.getDefaultUserAccessToken();

      //Create a new business customer
      customerAPI.createNewCustomer("business_customer.json").then((newCustomerID) => {
        customerID = newCustomerID.toString();
      });

      cy.fixture(Constants.templateFixtureFilePath.concat("/customer/business_customer.json")).then((customerJSON) => {
        customerExpectedJSON = customerJSON;
      });

      //Create a new revolving product
      productAPI.createNewProduct("product_charge.json").then((newInstallmentProductID) => {
        Cypress.env("revolving_product_id", newInstallmentProductID);
      });

      //Create a new mixed rate installment product
      productAPI.createNewProduct("mixed_rate_installment_product.json").then((newInstallmentProductID) => {
        Cypress.env("mixed_rate_installment_product_id", newInstallmentProductID);
      });
      //Create a new installment product
      productAPI.createNewProduct("payment_product.json").then((newInstallmentProductID) => {
        Cypress.env("installment_payment_product_id", newInstallmentProductID);
      });
    });

    //Create revolving account and assign to business customer
    it("should have create an revolving account and assign to business customer", async () => {
      //Update product and customer in account JSON file
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(
        accountAPI.createNewAccount(
          Cypress.env("revolving_product_id"),
          customerID,
          effective_at,
          "account_credit.json"
        )
      );
      cy.log("Revolving account created : " + response.body.account_id);
      //Verify customer business details in  account
      accountAPI.verifyBusinessCustomerDetailsInAccount(customerExpectedJSON, response, customerID.toString());
    });

    //Create a Multi Advance Installment account and assign to  business customer
    it("should be able to create Multi Advance Installment account and assign to business customer", async () => {
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(
        accountAPI.createNewAccount(
          Cypress.env("mixed_rate_installment_product_id"),
          customerID,
          effective_at,
          "account_credit.json"
        )
      );
      cy.log("Multi Advance Installment account created : " + response.body.account_id);

      //Verify customer business details in  account
      accountAPI.verifyBusinessCustomerDetailsInAccount(customerExpectedJSON, response, customerID.toString());
    });

    //Create a Installment account and assign to business customer
    it("should be able to create Installment account and assign to business customer", async () => {
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(
        accountAPI.createNewAccount(
          Cypress.env("installment_payment_product_id"),
          customerID,
          effective_at,
          "account_charge.json"
        )
      );
      cy.log("Installment account created : " + response.body.account_id);

      //Verify customer business details in account
      accountAPI.verifyBusinessCustomerDetailsInAccount(customerExpectedJSON, response, customerID.toString());
    });
  });
});
