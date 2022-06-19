/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import accountStatusJSON from "cypress/resources/testdata/account/account_status.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//pp431 - Verification of Account status for Installment product
//pp432 - Verification of Account status for CreditCard product
//pp433 - Verification of Account status for Revolving product
//pp434 - Verification of Account status is closed for Installment product
//pp435 - Verification of Account status is closed for CreditCard productF
//pp436 - Verification of Account status is closed for Revolving product
//pp1031 - Verify Account Status sub status does not get updated during grace period, after due date
//pp1032 - Verify Account Status sub status does not get updated during grace period, after due date
//pp1033 - Verify Account Status sub status gets updated to Suspended / Delinquency only after grace period expires
//pp2262 - Verify account status suspended in get specific response
//pp2264 - Verify account status closed in get specific response


TestFilters(["regression", "accountStatus"], () => {
  //Validate account status with different products and settings
  describe("Account Status Validation with different products", function () {
    let accountID;
    let productID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    accountStatusJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //Update product payload
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.first_cycle_interval,
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
          promo_min_pay_type: data.promo_min_pay_type,
          promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_json_file, productPayload));
        productID = response.body.product_id;
        cy.log("new product created : " + productID);
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        // Update product, customer and account effective date in account JSON
        const days = parseInt(data.account_effective_dt);
        const effectiveDate = dateHelper.addDays(days, 0);
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: effectiveDate,
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      //Calling roll time forward to make sure account status is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        //Roll time forward to account status is updated
        const endDate = dateHelper.getRollDate(2);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });
      it(`should have validate account status for - '${data.tc_name}'`, async () => {
        //Validate the account status
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status).to.eq(data.account_status);
      });
    });
  });
});

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at" | "first_cycle_interval">;

type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "promo_min_pay_percent"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
>;
