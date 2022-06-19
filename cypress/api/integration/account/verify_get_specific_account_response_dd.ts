/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import accountJSON from "../../../resources/testdata/account/account_details_with_different_products.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered
//PP2255 Verify account id in get specific account response for installment product
//PP2255A-C Verify account id in get specific account response for Revolving,charge card,mixed rate products
//PP2256 Verify account created date in get specific account response for installment products
//PP2256A-C Verify account created date in get specific account response for Revolving,charge card,mixed rate products
//PP2257 Verify account effective date in get specific account response for installment products
//PP2257A-C Verify account effective date in get specific account response for Revolving,charge card,mixed rate products
//PP2258 Verify account external id in get specific account response for installment products
//PP2258A-C Verify account external id in get specific account response for Revolving,charge card,mixed rate products
//PP2259 Verify account status in account response for installment product
//PP2259A-C Verify account status in account response for Revolving,charge card,mixed rate product
//PP2260 Verify account sub status to be null in get specific account response for installment product
//PP2260A-C Verify account sub status to be null in get specific account response for Revolving,charge card,mixed rate product
//PP2261 Verify account status in get specific account response for installment products
//PP2261A-C Verify account status in get specific account response for Revolving,charge card,mixed rate products
//PP2265 Verify account product id and external product id in get specific account response for installment products
//PP2265A-C Verify account product id and external product id in get specific account response for Revolving,charge card,mixed rate products
//PP2266 Verify Product overview section details in get specific account response for installment products
//PP2266A-C Verify Product overview section details in get specific account response for Revolving,charge card,mixed rate products
//PP2267 Verify product life cycle fields details in get specific account response for installment products
//PP2267A-C Verify product life cycle fields details in get specific account response for Revolving,charge card,mixed rate products
//PP2270 Verify promo_purchase_window_inclusive_start date is identical to account effective date
//PP2270A-C Verify promo_purchase_window_inclusive_start date is identical to account effective date for Revolving,charge card,mixed rate products
//PP2272 Verify promo_inclusive_start date is identical to account effective date
//PP2272A-C Verify promo_inclusive_start date is identical to account effective
//date for Revolving,charge card,mixed rate products
//PP2274 Verify promo_impl_interest_rate_percent is identical to promo interest rate set up at the account level during account creation
//PP2274A-C Verify promo_impl_interest_rate_percent is identical to promo
// interest rate set up at the account level during account creation for Revolving,charge card,mixed rate products

TestFilters(["getSpecificAccount", "regression"], () => {
  //Validate get specific account response - with different products
  describe("Validate get specific account response - with different products", () => {
    let accountID;
    let productID;
    let accountResponse;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    accountJSON.forEach((data) => {
      //create product
      it(`should have create product - '${data.tc_name}'`, async () => {
        productID = await promisify(productAPI.createNewProduct(data.product_json_file));
        cy.log("new product created : " + productID);
      });
      //Create a new account
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: data.account_effective_at,
          initial_principal_cents: parseInt(data.initial_principal_cents),
        };
        //Create account and assign to customer
        accountResponse = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(accountResponse.status).to.eq(200);
        accountID = accountResponse.body.account_id;
        cy.log("new account created : " + accountID);
        expect(accountResponse.body.account_overview.account_status).to.eq(data.account_status);
      });

      it(`should have validate get specific account response`, async () => {
        //Validate the get specific account response
        const currentDate = dateHelper.addDays(0, 0);
        const response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(
          response.body.account_overview.account_status,
          "verify account status in get specific account response"
        ).to.eq(data.account_status);
        expect(response.body.account_id, "verify account id in get specific account response").to.eq(accountID);
        expect(response.body.external_account_id, "verify account external id in get specific account response").to.eq(
          accountResponse.body.external_account_id
        );
        expect(response.body.effective_at, "verify account effective date in get specific account response").to.include(
          data.account_effective_at.slice(0, 10)
        );
        expect(response.body.created_at, "verify account created date in get specific account response").to.include(
          currentDate.slice(0, 10)
        );
        expect(response.body.account_product.product_id, "verify product id in get specific account response").to.eq(
          productID);
        expect(
          response.body.account_product.external_product_id,
          "verify product id in get specific account response"
        ).to.eq(accountResponse.body.account_product.external_product_id);
        expect(
          response.body.account_overview.account_status_subtype,
          "verify account sub stats in get specific account response"
        ).to.be.empty;
        //Verify product_overview section in get specific account section
        expect(
          response.body.account_product.product_overview.product_name,
          "verify product name in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.product_name);
        expect(
          response.body.account_product.product_overview.product_color,
          "verify product color in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.product_color);
        expect(
          response.body.account_product.product_overview.product_short_description,
          "verify product short description in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.product_short_description);
        expect(
          response.body.account_product.product_overview.product_long_description,
          "verify product long in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.product_long_description);
        expect(
          response.body.account_product.product_overview.product_type,
          "verify product type in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.product_type);
        expect(
          response.body.account_product.product_overview.close_of_business_time,
          "verify close business time in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.close_of_business_time);
        expect(
          response.body.account_product.product_overview.product_time_zone,
          "verify product time zone in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_overview.product_time_zone);
        //Verify product_lifecycle section in get specific account section
        expect(
          response.body.account_product.product_lifecycle.late_fee_impl_cents,
          "verify late fee cents in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.late_fee_impl_cents);
        expect(
          response.body.account_product.product_lifecycle.late_fee_cap_percent,
          "verify late fee cap percent in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.late_fee_cap_percent);
        expect(
          response.body.account_product.product_lifecycle.payment_reversal_fee_impl_cents,
          "verify payment reversal fee in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.payment_reversal_fee_impl_cents);
        expect(
          response.body.account_product.product_lifecycle.payment_reversal_fee_cap_percent,
          "verify payment reversal cap percent in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.payment_reversal_fee_cap_percent);
        expect(
          response.body.account_product.product_lifecycle.origination_fee_impl_cents,
          "verify origination fee cents in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.origination_fee_impl_cents);
        expect(
          response.body.account_product.product_lifecycle.annual_fee_impl_cents,
          "verify annual fee cents in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.annual_fee_impl_cents);
        expect(
          response.body.account_product.product_lifecycle.monthly_fee_impl_cents,
          "verify monthly fee cents in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.monthly_fee_impl_cents);
        expect(
          response.body.account_product.product_lifecycle.loan_end_date,
          "verify loan end date in get specific account response"
        ).to.eq(accountResponse.body.account_product.product_lifecycle.loan_end_date);
        //Verify promo_overview in get specific account
        expect(
          response.body.account_product.promo_overview.promo_purchase_window_inclusive_start,
          "verify promo purchase window inclusive start in get specific account response"
        ).to.include(data.account_effective_at.slice(0, 10));
        expect(
          response.body.account_product.promo_overview.promo_inclusive_start,
          "verify promo inclusive start in get specific account response"
        ).to.include(data.account_effective_at.slice(0, 10));
        expect(
          response.body.account_product.promo_overview.promo_impl_interest_rate_percent,
          "verify promo interest rate in get specific account response"
        ).to.eq(accountResponse.body.account_product.promo_overview.promo_impl_interest_rate_percent);
      });
    });
  });
});

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "initial_principal_cents" | "effective_at">;
