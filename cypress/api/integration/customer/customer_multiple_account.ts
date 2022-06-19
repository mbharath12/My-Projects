/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../api_support/account";
import { productAPI } from "../../api_support/product";
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests";

//Test cases covered - PP1328 - Single Customer with multiple account under with same Product
TestFilters(["customer", "regression"], () => {
  describe("Verify customer with multiple accounts with same product", function () {
    let response;
    let customerID;
    let productID;
    //Create Access Token
    before(() => {
      authAPI.getDefaultUserAccessToken();

      //Create a new installment product
      productAPI.createNewProduct("payment_product.json").then((newInstallmentProductID) => {
        productID = newInstallmentProductID;
      });

      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID.toString();
      });
    });

    it("should have create first account and assign customer", async () => {
      //Update product and customer in account JSON file
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(
        accountAPI.createNewAccount(productID, customerID, effective_at, "account_credit.json")
      );
      const accountID = response.body.account_id;
      cy.log("first account created: " + accountID);
      const accountCustomerID = response.body.customers[0].customer_id;
      //check customer id displayed in first account
      expect(accountCustomerID.toString(), "check customer id is displayed in first account").to.eq(customerID);
    });

    it("should have create second account and assign customer", async () => {
      //Update product and customer in account JSON file
      const effective_at = dateHelper.addDays(1, 0);
      response = await promisify(
        accountAPI.createNewAccount(productID, customerID, effective_at, "account_credit.json")
      );
      const accountID = response.body.account_id;
      cy.log("second account created: " + accountID);
      const accountCustomerID = response.body.customers[0].customer_id;
      //check customer id displayed in second account
      expect(accountCustomerID.toString(), "check customer id is displayed in second account").to.eq(customerID);
    });
  });
});
