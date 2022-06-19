/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import lithicJSON from "../../../resources/testdata/lithic/lithic.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { lithicAPI } from "../../api_support/lithics";
import { AccountSummary, accountValidator } from "../../api_validation/account_validator";

// Test cases covered
//LC01 - Verify the lithic API key is generated for the Organization
//LC02 - Verify the Response for the create new account end point contains the Account Status as Active
//LC03 - LC05 - Verify the customer id,customer account role and account id request match the details on the response for the Endpoint API
//LC06 - LC07 - Verify the State of a new card can be Open,Paused
//LC08 - LC010- Verify type of card that can be created by Lithic can be Unlocked ,Merchant locked ,Single use
//LC011 - Verify last four of the card
//LC012 - LC014 - Verify memo of the unlocked , single use and merchant card
//LC015 - LC017 - Verify token of the single use ,merchant and unlocked card
//LC018 - Verify the calculated Minimum payment due for the first cycle
//LC019 - Verify the origination fees specified for the account is charged to the account
//LC020 - Verify the Spend limit for a Cardholder setup at Lithic will override the limit set up in this parameter

TestFilters(["regression", "lithic"], () => {
  let productID;
  let response;
  let customerID;
  let accountID;
  let lastFour;
  let token;

  describe("Validate the Lithic Issuer processor config at the Organization level  ", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      lithicAPI.createConfigureLithic("configure_lithic_API_key.json").then((response) => {
        expect(response.status, "verify lithic api response is successful").to.eq(200);
        expect(response.body.lithic_config.api_key, "verify API key generated for the organization in Lithic").to.eq(
          Cypress.env("lithic_api_key")
        );
      });
    });

    lithicJSON.forEach((data) => {
      it(`should be able to create product - '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
        };

        response = await promisify(productAPI.updateNCreateProduct("product_charge.json", productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
        cy.log("new product created:" + productID);
      });

      it(`should have create customer `, async () => {
        customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
        cy.log("new customer created:" + customerID);
      });

      it(`should be able to create account`, async () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          type: data.type,
          state: data.state,
          memo: data.memo,
          spend_limit: data.spend_limit,
        };

        response = await promisify(accountAPI.updateNCreateAccount("lithic_account.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        lastFour = response.body.customers[0].card_details[0].lithic.last_four;
        token = response.body.customers[0].card_details[0].lithic.token;
        cy.log("new account created : " + accountID);
        expect(
          response.body.customers[0].card_details[0].spend_limit,
          "verify the spend limit can be overridden"
        ).to.eq(parseInt(data.spend_limit));
      });

      it(`should have validate details of account provided in the Request match the details on the Response for the Endpoint API`, () => {
        const accountSummary: AccSummary = {
          account_id: accountID,
          status: data.exp_status,
          customer_id: customerID,
          customer_account_role: data.exp_customer_role,
          state: data.exp_state,
          type: data.exp_type,
          last_four: lastFour,
          memo: data.memo,
          fees_balance_cents: parseInt(data.exp_orig_fee),
          token: token,
          statement_min_pay_cents: parseInt(data.exp_min_pay_cents),
        };
        accountValidator.validateGetSpecificResponse(accountID, accountSummary);
      });
    });
  });
});
type CreateProduct = Pick<ProductPayload, "cycle_interval" | "cycle_due_interval" | "first_cycle_interval">;

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "state" | "type" | "memo" | "spend_limit">;

type AccSummary = Pick<
  AccountSummary,
  | "account_id"
  | "status"
  | "customer_account_role"
  | "customer_id"
  | "state"
  | "type"
  | "last_four"
  | "memo"
  | "fees_balance_cents"
  | "token"
  | "statement_min_pay_cents"
>;
