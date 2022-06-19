import { productAPI } from "../../api_support/product";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { authAPI } from "../../api_support/auth";
import { customerAPI } from "../../api_support/customer";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered
//pp1305 - verify plaid_access_token generated for account Plaid Config
//pp1306 - verify plaid_account_id generated for account Plaid Config
//pp1307 - verify check_balance_enabled generated for account Plaid Config

TestFilters(["accountSummary", "plaidConfig", "regression"], () => {
  //Validate account level Config with plaid config
  describe("Validate account level Config - summary section in account", () => {
    let response;

    //for updating account plaid config
    const plaid_access_token = Cypress.env("PLAID_TOKEN");
    const plaid_account_id = Cypress.env("PLAID_ACCOUNT_ID");
    const check_balance_enabled = true;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("payment_product.json").then((newProductID) => {
        Cypress.env("product_id", newProductID);
      });
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    //Create a new account
    it(`should have create account and assign customer`, async () => {
      //Update product, customer, and plaid config for account
      const accountPayload: CreateAccount = {
        product_id: Cypress.env("product_id"),
        customer_id: Cypress.env("customer_id"),
        plaid_access_token: plaid_access_token,
        plaid_account_id: plaid_account_id,
        check_balance_enabled: check_balance_enabled,
      };

      //Update payload and create an account
      response = await promisify(accountAPI.updateNCreateAccount("account_discount", accountPayload));
      expect(response.status).to.eq(200);

      //Verify account plaid config is true for an account
      expect(response.body.plaid_config.plaid_access_token.valid_config, "verify account plaid_access_token").to.be
        .true;
      expect(response.body.plaid_config.plaid_account_id.valid_config, "verify account plaid_account_id").to.be.true;
      expect(response.body.plaid_config.check_balance_enabled, "verify account plaid config check_balance_enabled").to
        .be.true;
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "plaid_access_token" | "plaid_account_id" | "check_balance_enabled"
>;
