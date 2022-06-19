/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import accountJSON from "../../../resources/testdata/account/statements_minpay_details_with_diff_product.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { statementsAPI } from "cypress/api/api_support/statements";
import { statementValidator } from "cypress/api/api_validation/statements_validator";

//Test cases covered
// PP2290 Verify statement_min_pay_charges_principal_cents for additional statement min pay details
// PP2291 Verify statement_min_pay_interest_cents for additional statement min pay details
// PP2292 Verify statement_min_pay_am_interest_cents for additional statement min pay details
// PP2293 Verify statement_min_pay_deferred_cents for additional statement min pay details
// PP2294 Verify statement_min_pay_am_deferred_interest_cents for additional statement min pay details
// PP2295 Verify statement_min_pay_fees_cents for additional statement min pay details
// PP2296 Verify previous_statement_min_pay_cents for additional statement min pay details
// PP2299 Verify first_cycle_interval for cycle_type details
// PP2300 Verify late_fee_grace for cycle_type details
// PP2301 Verify Discounts details
// PP2321 Verify merchant name field retrieved - indicates a merchant name associated with the account
// PP2322 Verify lender_name field retrieved - indicates a lender name associated with the account
// PP2323 Verify Plaid Access token valid_config indicates whether Canopy has a valid Plaid access token
// PP2324 Verify plaid_account_id valid_config indicates whether Canopy has a valid Plaid account ID
// PP2303 Verify principal_cents, indicates the principal balance outstanding in the account as on the date of retrieval

TestFilters(["getSpecificAccountDetails", "regression"], () => {
  //Validate additional_statement_min_pay_details section in get specific account response - with different products
  describe("Validate additional_statement_min_pay_details in get specific account response - with different products", () => {
    let accountID;
    let productID;
    let customerID;
    let response;
    let exp_min_pay_charges_principal_cents;
    let exp_min_pay_am_interest_cents;

    let exp_previous_min_pay_cents;

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
          late_fee_grace: data.late_fee_grace,
          promo_len: parseInt(data.promo_len),
          promo_min_pay_type: data.promo_min_pay_type,
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_json_file, productPayload));
        productID = response.body.product_id;
        cy.log("new product created : " + productID);
      });

      //Create a new account
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          first_cycle_interval: data.cycle_interval,
          loan_discount_cents: data.loan_discount_cents,
          loan_discount_at: data.loan_discount_at,
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_discount.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });
      //Roll time forward to min_pay_due_at date to get first statement min pay.
      it(`verify first statement min_pay_due_cents in account response - '${data.tc_name}'`, async () => {
        //const endDate = dateHelper.getAccountEffectiveAt(data.rolltime);
        let response = await promisify(rollTimeAPI.rollAccountForward(accountID, data.rolltime));
        expect(response.status).to.eq(200);
      });
      it(`should have to validate statement line items for first cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const statementID = statementValidator.getStatementIDByNumber(response, 0);
          cy.log(statementID);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, statementID).then((response) => {
            exp_min_pay_charges_principal_cents =
              response.body.additional_min_pay_details.min_pay_charges_principal_cents;
              exp_min_pay_am_interest_cents = response.body.additional_min_pay_details.min_pay_am_interest_cents;
            exp_previous_min_pay_cents = response.body.additional_min_pay_details.previous_min_pay_cents;
          });
        });
      });
      it(`should have to validate late_fee_grace - '${data.tc_name}'`, async () => {
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.body.cycle_type.late_fee_grace, "verify late_fee_grace in get specific account response")
          .to.include(data.late_fee_grace)
          .toString();
        expect(
          response.body.discounts.prepayment_discount_config.loan_discount_cents,
          "verify loan_discount_cents in get specific account response"
        ).to.eq(parseInt(data.loan_discount_cents));
        expect(
          response.body.discounts.prepayment_discount_config.loan_discount_at,
          "verify loan_discount_at in get specific account response"
        )
          .to.eq(data.loan_discount_at)
          .toString();
        expect(
          response.body.additional_statement_min_pay_details.statement_min_pay_charges_principal_cents,
          "verify exp_min_pay_charges_principal_cents in get specific account response"
        ).to.eq(parseInt(exp_min_pay_charges_principal_cents));
        expect(
          response.body.additional_statement_min_pay_details.statement_min_pay_interest_cents,
          "verify exp_min_pay_interest_cents in get specific account response"
        ).to.eq(parseInt(data.statement_min_pay_interest_cents));
        expect(
          response.body.additional_statement_min_pay_details.statement_min_pay_deferred_cents,
          "verify exp_min_pay_deferred_cents in get specific account response"
        ).to.eq(parseInt(data.statement_min_pay_deferred_cents));
        expect(
          response.body.additional_statement_min_pay_details.statement_min_pay_am_deferred_interest_cents,
          "verify exp_min_pay_am_deferred_interest_cents in get specific account response"
        ).to.eq(parseInt(data.statement_min_pay_am_deferred_interest_cents));
        expect(
          response.body.additional_statement_min_pay_details.statement_min_pay_am_interest_cents,
          "verify exp_min_pay_am_interest_cents in get specific account response"
        ).to.eq(parseInt(exp_min_pay_am_interest_cents));
        expect(
          response.body.additional_statement_min_pay_details.statement_min_pay_fees_cents,
          "verify exp_min_pay_fees_cents in get specific account response"
        ).to.eq(parseInt(data.statement_min_pay_fees_cents));
        expect(
          response.body.additional_statement_min_pay_details.previous_statement_min_pay_cents,
          "verify exp_previous_min_pay_cents in get specific account response"
        ).to.eq(parseInt(exp_previous_min_pay_cents));
        expect(
          response.body.summary.principal_cents,
          "verify statement_min_pay_charges_principal_cents in get specific account response"
        ).to.eq(parseInt(data.statement_min_pay_charges_principal_cents));
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "first_cycle_interval"
  | "loan_discount_cents"
  | "loan_discount_at"
>;
type CreateProduct = Pick<
  ProductPayload,
  "cycle_interval" | "cycle_due_interval" | "promo_len" | "late_fee_grace" | "promo_min_pay_type"
>;
