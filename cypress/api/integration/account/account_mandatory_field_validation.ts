import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";

//Test cases covered
//API_097 - create account without product_id
//API_206 - create account without customer_id

TestFilters(["regression", "account", "mandatoryFieldValidation"], () => {
  describe("Validate create account without entering mandatory field", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new product
      productAPI.createNewProduct("payment_product.json").then((newProductID) => {
        Cypress.env("product_id", newProductID);
      });
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    it(`should not able to create account without product_id field`, async () => {
      //Update payload and create an account
      const accountPayload: CreateAccount = {
        customer_id: Cypress.env("customer_id"),
        delete_field_name: "product_id",
        doNot_check_response_status: true,
      };
      const response = await promisify(
        accountAPI.updateNCreateAccount("mandatory_field_validation.json", accountPayload)
      );
      //Check status and error message when mandatory key is not in payload
      expect(response.status, "check response code when mandatory key is not in payload").to.eq(404);
      expect(response.body.error.message, "check response error message").to.eq(
        "No product found with the provided product_id or external_product_id."
      );
    });
    it(`should not able to create account without customer_id field`, async () => {
      //Update payload and create an account
      const accountPayload: CreateAccount = {
        product_id: Cypress.env("product_id"),
        customer_id: 0,
        doNot_check_response_status: true,
      };
      const response = await promisify(
        accountAPI.updateNCreateAccount("mandatory_field_validation.json", accountPayload)
      );
      //Check status and error message when mandatory key is not in payload
      expect(response.status, "check response code when mandatory key is not in payload").to.eq(400);
      expect(response.body.error.message, "check response error message").to.eq("Event object failed validation");
      expect(response.body.error.details.length, "check detailed error message is displayed").to.not.eq(0);
      expect(response.body.error.details[0].message, "check detailed error message").to.eq(
        "must have required property customer_id"
      );
    });
  });
});
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "delete_field_name" | "doNot_check_response_status"
>;
