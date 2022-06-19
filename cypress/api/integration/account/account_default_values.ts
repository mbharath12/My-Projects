import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import promisify from "cypress-promise";
import accountDefaultJSON from "../../../resources/testdata/account/default_values_account.json";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered
//API_095 - Validate default value for effective_at
//API_099 - Validate default value for external_product_id
//API_100 - Validate default value for external_fields
//API_106 - Validate default value for ach payment_processor_name
//API_108 - Validate default value for ach repay_config
//API_117 - Validate default value for dwolla_config
//API_119 - Validate default value for modern_treasury_config
//API_128 - Validate default value for debit_card payment_processor_name
//API_130 - Validate default value for debit_card repay_config
//API_139 - Validate default value for credit_card payment_processor_name
//API_140 - Validate default value for credit_card repay_config
//API_151 - Validate default value for autopay_enabled
//API_155 - Validate default value for default_payment_processor_method
//API_161 - Validate default value for first_cycle_interval
//API_166 - Validate default value for late_fee_grace
//API_169 - Validate default value for loan_discount_cents
//API_173 - Validate default value for loan_discount_at
//API_175 - Validate default value for credit_limit_cents
//API_177 - Validate default value for max_approved_credit_limit_cents
//API_178 - Validate default value for late_fee_cents
//API_180 - Validate default value for payment_reversal_fee_cents
//API_181 - Validate default value for origination_fee_cents
//API_182 - Validate default value for annual_fee_cents
//API_183 - Validate default value for monthly_fee_cents
//API_184 - Validate default value for initial_principal_cents
//API_188 - Validate default value for late_fee_cap_percent
//API_191 - Validate default value for payment_reversal_fee_cap_percent
//API_193 - Validate default value for promo overview
//API_194 - Validate default value for promo_impl_interest_rate_percent
//API_195 - Validate default value for post_promo_len
//API_196 - Validate default value for post_promo_impl_interest_rate_percent
//API_207 - Validate default value for customer_account_role
//API_208 - Validate default value for customer_account_external_id

TestFilters(["regression", "account", "defaultFieldValidation"], () => {
  describe("Validate default values while creating account ", function () {
    let response;
    let expectedDefaultFieldValue;

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

    it(`should have create account`, async () => {
      const productID = Cypress.env("product_id");
      const customerID = Cypress.env("customer_id");
      //Create account JSON
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: customerID,
      };
      //Update payload and create an account
      response = await promisify(accountAPI.updateNCreateAccount("account_mandatory_fields.json", accountPayload));
      expect(response.status).to.eq(200);
      Cypress.env("account_id", response.body.account_id);
    });
    accountDefaultJSON.forEach((data) => {
      it(`should have to validate default value - '${data.tc_name}'`, () => {
        const jsonPath = data.field_path;
        let actualDefaultFieldValue = eval("response.body." + jsonPath);

        // Converting response value to string as the test data from JSON is in
        // string format. Don't convert if the value is null
        if (actualDefaultFieldValue !== null) {
          actualDefaultFieldValue = actualDefaultFieldValue.toString().toLowerCase();
        }
        //If test data has current date, get current date
        expectedDefaultFieldValue = data.field_value.toLowerCase();
        if (data.field_value.toLowerCase() === "current_date") {
          expectedDefaultFieldValue = dateHelper.getRollDate(0);
        }
        //Validate default value
        if (expectedDefaultFieldValue === "null") {
          expect(actualDefaultFieldValue, "check default value of ".concat(data.field_name)).to.be.null;
        } else {
          expect(actualDefaultFieldValue, "check default value of ".concat(data.field_name)).to.include(
            expectedDefaultFieldValue
          );
        }
      });
    });
  });
});
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id">;
