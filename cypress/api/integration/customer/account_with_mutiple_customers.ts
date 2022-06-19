/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { productAPI } from "../../api_support/product";
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests";

//Test cases covered -
//PP1329 Multiple Customers on an account - 2 Customers - Multiple Customer IDs linked to an Account
//PP1330 Multiple Customers on an account - 4 Customers - Multiple Customer ID's linked to an Account
//PP1331 Multiple Customers on an account - 5 Customers - Multiple Customer ID's linked to an Account
//PP1345 Create a Customer with Secondary role on an Account
//PP1309 Verify 2 customers can be associated with an account - role of one is Primary and other is Secondary
//PP1310 Verify 5 customers can be associated with an account - role of one is Primary and others Secondary

TestFilters(["customer", "regression"], () => {
  describe("Verify customer with multiple accounts with same product", function () {
    let response;
    let productID;

    //Create Access Token
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new installment product
      productID = await promisify(productAPI.createNewProduct("payment_product.json"));
      cy.log("new product created " + productID);
    });

    it("should have create multiple customers", () => {
      customerAPI.createNewCustomer("create_customer.json").then((customerID1) => {
        Cypress.env("customer_id_1", customerID1);
      })
      customerAPI.createNewCustomer("create_customer.json").then((customerID2) => {
        Cypress.env("customer_id_2", customerID2);
      })
      customerAPI.createNewCustomer("create_customer.json").then((customerID3) => {
        Cypress.env("customer_id_3", customerID3);
      })
      customerAPI.createNewCustomer("create_customer.json").then((customerID4) => {
        Cypress.env("customer_id_4", customerID4);
      })
      customerAPI.createNewCustomer("create_customer.json").then((customerID5) => {
        Cypress.env("customer_id_5", customerID5);
      })
    });

    it("should have create account and assign two customers", async () => {
      //Update product and customer in account JSON file
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: Cypress.env("customer_id_1"),
        customer_account_role: "PRIMARY",
        second_customer_id: Cypress.env("customer_id_2"),
        second_customer_account_role: "SECONDARY",
      };

      response = await promisify(accountAPI.updateNCreateAccount("account_with_two_customers.json", accountPayload));
      const accountID = response.body.account_id;
      cy.log("Account created: " + accountID);

      //check customers displayed in  account
      expect(
        response.body.customers[0].customer_id.toString(),
        "check first customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_1").toString());
      expect(
        response.body.customers[1].customer_id.toString(),
        "check second customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_2").toString());
      expect(
        response.body.customers[1].customer_account_role,
        "check second customer has Secondary role in the account"
      ).to.eq("SECONDARY");
    });
    //PP1330	Multiple Customers on an account - 4 Customers - Multiple Customer ID's linked to an Account
    it("should have create account and assign Multiple Customer ID's linked to an Account", async () => {
      //Update product and customer in account JSON file
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: Cypress.env("customer_id_1"),
        customer_account_role: "PRIMARY",
        second_customer_id: Cypress.env("customer_id_2"),
        third_customer_id: Cypress.env("customer_id_3"),
      };

      response = await promisify(accountAPI.updateNCreateAccount("account_with_three_customers.json", accountPayload));
      const accountID = response.body.account_id;
      cy.log("Account created: " + accountID);

      //check customers displayed in  account
      expect(
        response.body.customers[0].customer_id.toString(),
        "check first customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_1").toString());
      expect(
        response.body.customers[1].customer_id.toString(),
        "check second customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_2").toString());
      expect(
        response.body.customers[2].customer_id.toString(),
        "check third customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_3").toString());
    });

    it("should have create account and assign five customers", async () => {
      //Update product and customer in account JSON
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: Cypress.env("customer_id_1"),
        customer_account_role: "PRIMARY",
        second_customer_id: Cypress.env("customer_id_2"),
        third_customer_id: Cypress.env("customer_id_3"),
        fourth_customer_id: Cypress.env("customer_id_4"),
        fifth_customer_id: Cypress.env("customer_id_5"),
      };

      response = await promisify(accountAPI.updateNCreateAccount("account_with_five_customers.json", accountPayload));
      const accountID = response.body.account_id;
      cy.log("Account created: " + accountID);

      //check customers displayed in  account
      expect(
        response.body.customers[0].customer_id.toString(),
        "check first customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_1").toString());
      expect(
        response.body.customers[1].customer_id.toString(),
        "check second customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_2").toString());
      expect(
        response.body.customers[2].customer_id.toString(),
        "check third customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_3").toString());
      expect(
        response.body.customers[3].customer_id.toString(),
        "check fourth customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_4").toString());
      expect(
        response.body.customers[4].customer_id.toString(),
        "check fifth customer id is displayed in account"
      ).to.eq(Cypress.env("customer_id_5").toString());
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "customer_account_role"
  | "second_customer_id"
  | "second_customer_account_role"
  | "third_customer_id"
  | "fourth_customer_id"
  | "fifth_customer_id"
>;
