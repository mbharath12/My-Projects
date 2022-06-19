/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { productAPI } from "../../api_support/product";
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests";
import { dateHelper } from "../../api_support/date_helpers";
import { DefaultValues } from "cypress/api/api_support/constants";

//Test Cases Covered
//PP1334 - Get all Accounts for all Customers are retrieved
//PP1343 - Customer defaulted to Primary role on the account when there is only one customer on the account
//PP1344 - On same account they can be two primary customers

TestFilters(["regression", "customer"], () => {
  describe("verify get information on a specific Line item for a specific account- response", function () {
    let response;
    let accountID;
    let productID;
    let customerId1;
    let customerId2;

    //create Access Token
    before( () => {
      authAPI.getDefaultUserAccessToken();
      //create a new installment product
      productAPI.createNewProduct("payment_product.json").then((newProductID) => {
        productID=newProductID
      })
      //create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerId1=newCustomerID
      })
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerId2=newCustomerID
      })
    });

    it("should have create an account and assign customer", async () => {
      //Update product in account JSON file
      const accountEffectiveAt = dateHelper.addDays(-5, 0);
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: customerId1,
        customer_account_role: "delete",
        effective_at: accountEffectiveAt,
      };
      response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
      accountID = response.body.account_id;
    });

    //PP1343 - Customer defaulted to Primary role on the account when there is only one customer on the account
    it("should get specific account details", async () => {
      response = await promisify(accountAPI.getAccountById(accountID));
      expect(response.status).to.eq(200);
      const customerAccountRole = response.body.customers[0].customer_account_role;
      expect(customerAccountRole, "check default customer role is PRIMARY").to.eq("PRIMARY");
    });

    //PP1334-Get all Accounts for all Customers are retrieved
    it("should get all accounts for all customers are retrieved", async () => {
      response = await promisify(customerAPI.getAllCustomer());
      expect(response.status).to.eq(200);
      const actAccountCount = response.body.results.length;
      const expAccountCount = DefaultValues.customerLimit;
      expect(actAccountCount, "Check all accounts for customers are displayed ").to.eq(expAccountCount);
    });

    //PP1344 - On the Same account there can be two Primary customers
    //Create a second customer and assign to same account-
    it("should be able to create a account and assign two customer", async () => {
      const accountEffectiveAt = dateHelper.addDays(-5, 0);
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: customerId1,
        customer_account_role: "delete",
        effective_at: accountEffectiveAt,
        second_customer_id: customerId2,
        second_customer_account_role: "delete",
      };
      response = await promisify(accountAPI.updateNCreateAccount("account_with_two_customers.json", accountPayload));
      accountID = response.body.account_id;
    });

    it("should get specific account details for which there can be two Primary customers", async () => {
      const getResponse = await promisify(accountAPI.getAccountById(accountID));
      expect(getResponse.status).to.eq(200);
      const customer1AccountRole = getResponse.body.customers[0].customer_account_role;
      expect(customer1AccountRole,"check the default customer role is Primary for first customer").to.eq("PRIMARY")
      const customer2AccountRole = getResponse.body.customers[1].customer_account_role;
      expect(customer2AccountRole,"check the default customer role is Primary for second customer").to.eq("PRIMARY")
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "effective_at"
  | "customer_id"
  | "customer_account_role"
  | "second_customer_id"
  | "second_customer_account_role"
>;
