/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { rollTimeAPI } from "../../api_support/rollTime";
import accountJSON from "../../../resources/testdata/account/account_promo_details_with_different_products.json";
import promisify from "cypress-promise";
import { dateHelper } from "../../api_support/date_helpers";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered
//PP2271-PP2271B - Verify promo_purchase_window_exclusive_end is based on promo_purchase_window_len for Revolving,charge card,mixed rate products
//PP2273-PP2273C - Verify promo_exclusive_end is based on promo_len for installment, Revolving,charge card,mixed rate products
//PP2275-PP2275C - Verify promo_len is identical to the Product level promo_len for all products
//PP2276 - Verify post_promo_inclusive_start date is identical to the account effective date for Installment accounts without promo period
//PP2277-PP2277C - Verify post_promo_inclusive_start date is next date after promo period end date for accounts having a promo period for all products
//PP2278-PP2278C - Verify post_promo_exclusive_end is based on post_promo_len for all products
//PP2279 - Verify post_promo_exclusive_end is based on the post_promo_len at account level when Product set up is overridden
//PP2280 - Verify post_promo_impl_interest_rate_percent is identical to post promo interest rate set up at product level
//PP2281 - Verify post_promo_impl_interest_rate_percent is identical to the post promo interest rate set up at account level
//PP2282 - Verify post promo_len is identical to post promo_len provided at Product level
//PP2283 - Verify promo_len is identical to promo_len provided at Product level in Product duration information
//PP2284 - Verify promo_purchase_window_len is identical to the set up at product level in Product duration information
//PP2285 - Verify "Key" indicates the Name of the External Party
//PP2286 - Verify "Value" indicates the External Account ID
//PP2287-PP2287C - Verify statement_min_pay_cents displays the minimum payment due for each cycle for all product types
//PP2288-PP2288C - Verify min_pay_due_at displays the minimum payment due date for each cycle for all product types
//PP2289-PP2289C - Verify min_pay_due_cents fields are displayed for all Cycle dates for all product types

TestFilters(["getSpecificAccount", "regression"], () => {
  //Validate promo and post promo policies in get specific account response - with different products
  describe("Validate promo and post promo policies in get specific account response - with different products", () => {
    let accountID;
    let productID;
    let customerID;
    let response;
    let productLevelInterestRate;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("Customer ID : " + customerID);
    });

    accountJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.cycle_interval,
          promo_len: parseInt(data.promo_len),
          post_promo_len: parseInt(data.post_promo_len),
          promo_purchase_window_len: parseInt(data.promo_purchase_window_len),
          promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
          promo_min_pay_type: data.promo_min_pay_type,
          promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_json_file, productPayload));
        productID = response.body.product_id;
        cy.log("new product created : " + productID);
        productLevelInterestRate = response.body.post_promotional_policies.post_promo_default_interest_rate_percent;
        cy.log(productLevelInterestRate);
      });

      //Create a new account
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          initial_principal_cents: parseInt(data.initial_principal_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_only_promo.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      it(`should have validate get specific account response - '${data.tc_name}'`, async () => {
        //Validate the get specific account response
        const response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);

        //Verify promo_overview in get specific account
        if (data.product_type.toLowerCase() === "Installement") {
          expect(
            response.body.account_product.promo_overview.promo_purchase_window_exclusive_end,
            "verify promo_purchase_window_exclusive_end in get specific account response"
          ).to.include(data.promo_purchase_window_exclusive_end.slice(0, 10));
        }
        expect(
          response.body.account_product.promo_overview.promo_exclusive_end,
          "verify promo_exclusive_end in get specific account response"
        ).to.include(data.promo_exclusive_end.slice(0, 10));
        expect(
          response.body.account_product.promo_overview.promo_len,
          "verify promo_len in get specific account response"
        ).to.eq(parseInt(data.promo_len));
        //verify post_promo_overview in account response
        expect(
          response.body.account_product.post_promo_overview.post_promo_inclusive_start,
          "verify post_promo_inclusive_start in get specific account response"
        ).to.include(data.post_promo_inclusive_start.slice(0, 10));
        if (data.product_type.toLowerCase() !== "chargecard") {
          expect(
            response.body.account_product.post_promo_overview.post_promo_exclusive_end,
            "verify post_promo_exclusive_end in get specific account response"
          ).to.include(data.post_promo_exclusive_end.slice(0, 10));
          expect(
            response.body.account_product.post_promo_overview.post_promo_len,
            "verify post_promo_len in get specific account response"
          ).to.eq(parseInt(data.post_promo_len));
        }
        expect(
          response.body.account_product.post_promo_overview.post_promo_impl_interest_rate_percent,
          "verify post_promo_impl_interest_rate_percent in get specific account response"
        ).to.eq(productLevelInterestRate);
        //verify product_duration_information in account response
        expect(
          response.body.account_product.product_duration_information.promo_len,
          "verify promo_len in get specific account response"
        ).to.eq(parseInt(data.promo_len));
        expect(
          response.body.account_product.product_duration_information.promo_purchase_window_len,
          "verify promo_purchase_window_len in get specific account response"
        ).to.eq(parseInt(data.promo_purchase_window_len));
        //verify external_fields in account response
        expect(
          response.body.external_fields[0].key,
          "verify external_fields key in get specific account response"
        ).to.eq(data.key);
        expect(
          response.body.external_fields[0].value,
          "verify external_fields value in get specific account response"
        ).to.eq(data.value);

        //verify min_pay_due_cents in account response
        expect(
          response.body.min_pay_due_cents.statement_min_pay_cents,
          "verify statement_min_pay_cents in get specific account response"
        ).to.eq(parseInt(data.statement_min_pay_cents));
        expect(
          response.body.min_pay_due_cents.min_pay_due_at,
          "verify min_pay_due_at in get specific account response"
        ).to.include(data.min_pay_due_at.slice(0, 10));
      });

      //Roll time forward to min_pay_due_at date to get first statement min pay.
      it(`verify first statement min_pay_due_cents in account response - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.min_pay_due_at, 5);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        //verify min_pay_due_cents in account response for first statement
        expect(
          response.body.min_pay_due_cents.statement_min_pay_cents,
          "verify statement_min_pay_cents in get specific account response"
        ).to.eq(parseInt(data.statement1_min_pay_cents));
        expect(
          response.body.min_pay_due_cents.min_pay_due_at,
          "verify min_pay_due_at in get specific account response"
        ).to.include(data.min_pay_due_at.slice(0, 10));
      });

      //Roll time forward to min_pay_due_at date to get second statement min pay.
      it(`verify second statement min_pay_due_cents in account response - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.statement2_min_pay_due_at, 5);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        //verify min_pay_due_cents in account response for second statement
        expect(
          response.body.min_pay_due_cents.statement_min_pay_cents,
          "verify statement_min_pay_cents in get specific account response"
        ).to.eq(parseInt(data.statement2_min_pay_cents));
        expect(
          response.body.min_pay_due_cents.min_pay_due_at,
          "verify min_pay_due_at in get specific account response"
        ).to.include(data.statement2_min_pay_due_at.slice(0, 10));
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "initial_principal_cents" | "origination_fee_cents"
>;
type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "promo_len"
  | "post_promo_len"
  | "promo_purchase_window_len"
  | "promo_min_pay_percent"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
>;
