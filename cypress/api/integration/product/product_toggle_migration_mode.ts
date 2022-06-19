import { productAPI, ProductPayload } from "../../api_support/product";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { dateHelper } from "../../api_support/date_helpers";
import { authAPI } from "../../api_support/auth";
import { rollTimeAPI } from "../../api_support/rollTime";
import { statementsAPI } from "../../api_support/statements";
import productJSON from "../../../resources/testdata/product/product_toggle_migration.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1248 - Verify statements are not generating for migration mode true
//PP1249 - Verify statements are generating for migration mode false

TestFilters(["regression", "product", "migrationMode"], () => {
  describe("Validate statements are generated if migration mode is true and false", function () {
    let accountID;
    let productID;
    let customerID;
    let response;
    let migrationMode;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("new customer created successfully: " + customerID);
      });
    });

    //Iterate each product and account
    productJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //Convert migration_mode value to boolean
        migrationMode = data.migration_mode.toLowerCase() === "true";
        //Create product
        const productPayload: CreateProduct = {
          migration_mode: migrationMode,
        };
        const response = await promisify(productAPI.updateNCreateProduct("product_migration.json", productPayload));
        cy.log("new product created successfully: " + response.body.product_id);
        productID = response.body.product_id;
      });

      it(`should have create account - '${data.tc_name}'`, async () => {
        //Create account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_dt,
        };
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
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

      //Validate statements generation for migration mode true and false
      it(`should validate statements generation for migration mode true and false - '${data.tc_name}'`, async () => {
        //Get statements list for account
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        //Validation of no charge and no origination fee
        if (migrationMode === true) {
          expect(response.body.length).to.eq(0);
        } else {
          expect(response.body.length).to.greaterThan(0);
        }
      });
    });
  });
  type CreateProduct = Pick<ProductPayload, "migration_mode">;

  type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at">;
});
