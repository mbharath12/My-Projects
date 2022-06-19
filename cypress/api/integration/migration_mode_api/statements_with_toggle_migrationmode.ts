/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { rollTimeAPI } from "../../api_support/rollTime";
import productsJSON from "../../../resources/testdata/product/product_migration_mode.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
import { migrationModeAPI } from "../../api_support/migrationmode";
import { statementsAPI } from "../../api_support/statements";

//Test Scripts
//PP1056 - Migration mode should be enabled before the Products and Line items migration to Canopy from other systems
//PP1057 - Migration of Product and config to Canopy mapped to the existing Legacy system
//PP1058 - Validate migration for Installment accounts with Customer and Account details as in the Legacy system
//PP1059 - Validate migration for Revolving accounts with Customer and Account details as in the Legacy system
//PP1060 - Validate migration for Multi Adv Revolving accounts with Customer and Account details as in the Legacy system
//PP1062 - Validate migration for Charge card product with Customer and Account details as in the Legacy system

TestFilters(["regression", "products", "migrationMode"], () => {
  describe("Validate all products, customers and accounts migrated to canopy system", function () {
    let accountID;
    let productID;
    let customerID;
    let response;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"))
        cy.log("Customer ID : " + customerID);
    });

    productsJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //create new product
        productID = await promisify(productAPI.createNewProduct(data.product_type));
        cy.log("new product created : " + productID);

        //Set migration mode is true for product
        response = await promisify(migrationModeAPI.setProductMigrationMode(productID, true));
        expect(response.status).to.eq(200);
        expect(response.body.description).to.eq("Successfully enabled migration mode.");
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer, account effective date details in account JSON file
        //Create account and assign to customer
        response = await promisify(
          accountAPI.createNewAccount(productID, customerID, data.account_effective_dt, "account_credit.json")
        );
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      //Roll time forward to get account statements
      it(`should have to wait for account roll time forward to get statements - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_dt, 35);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Validate statements are not generated for migration mode true
      it(`should validate statements are not generated for migration mode true  - '${data.tc_name}'`, async () => {
        //Get statements list for account
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(0);
      });

      //Set migration mode to false for product
      it(`should set migration mode to false`, async () => {
        response = await promisify(migrationModeAPI.setProductMigrationMode(productID, false));
        expect(response.status).to.eq(200);
        expect(response.body.description).to.eq("Successfully disabled migration mode.");
      });

      //Roll time forward to get account statements
      it(`should have to wait for account roll time forward to get statements - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_dt, 65);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Validate statements generation for migration mode false
      it(`should validate statements generation for migration mode false - '${data.tc_name}'`, async () => {
        //Get statements list for account
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.length).to.greaterThan(0);
      });
    });
  });
});
