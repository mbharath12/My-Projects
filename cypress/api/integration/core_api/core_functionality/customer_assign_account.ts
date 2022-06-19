/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { customerAPI, CustomerPayload } from "../../../api_support/customer";
import { authAPI } from "../../../api_support/auth";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests";

//Test cases covered - PP1348 -  Verify Customer can be assigned to account using Create Customer API
//PP1308 Verify one customer should be added to the account, using the unique customer ID generated

TestFilters(["smoke", "regression", "customer"], () => {
  describe("Verify Customer can be assigned to account using Create Customer API", function () {
    let customerResponse;

    //Create Access Token
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new installment product
      const productID = await promisify(productAPI.createNewProduct("payment_product.json"));
      cy.log("new product created" + productID);
      Cypress.env("product_id", productID);
    });

    it(`should have create an account without a customer `, async () => {
      //Update product in account JSON file
      type AccountDts = Pick<AccountPayload, "product_id">;
      const accountPayLoad: AccountDts = {
        product_id: Cypress.env("product_id"),
      };
      const response = await promisify(accountAPI.updateNCreateAccount("create_account.json", accountPayLoad));
      expect(response.status).to.eq(200);
      Cypress.env("account_id", response.body.account_id);
      cy.log("new account is created : " + Cypress.env("account_id"));
    });

    //Create a new customer - first customer
    it("should be able to create a new customer", async () => {
      type CustomerDts = Pick<CustomerPayload, "account_id">;
      const customerPayLoad: CustomerDts = {
        account_id: Cypress.env("account_id"),
      };
      customerResponse = await promisify(
        customerAPI.updateNCreateCustomer("customer_assign_account.json", customerPayLoad)
      );
      Cypress.env("customer_id_1", customerResponse.body.customer_id);
    });

    //Get specific account details and validate the account ids, ssn,email,name_prefix,name_first,name_middle,name_last,name_suffix,date_of_birth,phone_number
    it("should have display customer details in account", async () => {
      const response = await promisify(accountAPI.getAccountById(Cypress.env("account_id")));
      expect(response.status).to.eq(200);

      //Verify account has assigned customer
      const expNamePrefix = customerResponse.body.name_prefix;
      const actNamePrefix = response.body.customers[0].name_prefix;
      expect(actNamePrefix).to.equals(expNamePrefix);

      const expNameFirst = customerResponse.body.name_first;
      const actNameFirst = response.body.customers[0].name_first;
      expect(actNameFirst).to.equals(expNameFirst);

      const expNameMiddle = customerResponse.body.name_middle;
      const actNameMiddle = response.body.customers[0].name_middle;
      expect(actNameMiddle).to.equals(expNameMiddle);

      const expNameLast = customerResponse.body.name_last;
      const actNameLast = response.body.customers[0].name_last;
      expect(actNameLast).to.equals(expNameLast);

      const expNameSuffix = customerResponse.body.name_suffix;
      const actNameSuffix = response.body.customers[0].name_suffix;
      expect(actNameSuffix).to.equals(expNameSuffix);

      const expPhoneNumber = customerResponse.body.phone_number;
      const actPhoneNumber = response.body.customers[0].phone_number;
      expect(actPhoneNumber).to.equals(expPhoneNumber);

      const expSSN = customerResponse.body.ssn;
      const actSSN = response.body.customers[0].ssn;
      expect(actSSN).to.equals(expSSN);

      const expDateOfBirth = customerResponse.body.date_of_birth;
      const actDateOfBirth = response.body.customers[0].date_of_birth;
      expect(actDateOfBirth).to.equals(expDateOfBirth);
    });

    //Create new second customer and add to above account
    it("should be able to create second customer", async () => {
      type CustomerDts = Pick<CustomerPayload, "account_id">;
      const customerPayLoad: CustomerDts = {
        account_id: Cypress.env("account_id"),
      };
      customerResponse = await promisify(
        customerAPI.updateNCreateCustomer("customer_assign_account.json", customerPayLoad)
      );
      Cypress.env("customer_id_2", customerResponse.body.customer_id);
    });

    //Verify multiple customers added to the same account
    it("should have multiple customers added to the same account", async () => {
      const response = await promisify(accountAPI.getAccountById(Cypress.env("account_id")));
      expect(response.status).to.eq(200);
      const responseCustomerID1 = response.body.customers[0].customer_id;
      expect(responseCustomerID1.toString(), "check customer one details are displays in account").to.equals(
        Cypress.env("customer_id_1").toString()
      );
      const responseCustomerID2 = response.body.customers[1].customer_id;
      expect(responseCustomerID2.toString(), "check customer two details are displays in account").to.equals(
        Cypress.env("customer_id_2").toString()
      );
    });
  });
});
