/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api/api_support/account";
import { customerAPI } from "../../../api/api_support/customer";
import { productAPI, ProductPayload } from "../../../api/api_support/product";
import { authAPI } from "../../../api/api_support/auth";
import { rollTimeAPI } from "../../../api/api_support/rollTime";
import { paymentAPI } from "cypress/api/api_support/payment";
import configJSON from "../../../resources/testdata/account/ui_account_summary_stats.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
import { UIAccountSummary } from "cypress/ui/ui_validation/cmd_account_validator";

//Test Scripts
//WEB_115 - Validate Account balance details for an account under Installment Product/BNPL product
//WEB_116 - Validate Account balance details for an account under Revolving LOC Product
//WEB_117 - Validate Credit Limit field; if set up at Product level; no account level set up
//WEB_118 - Validate Credit Limit field; when set up at account level overrides the set up at Product level
//WEB_119 - Validate Account balance details for an account under Multi Advance Product (with promo and post promo)- during Promo period
//WEB_120 - Validate Account balance details for an account under Multi Advance Product (with promo and post promo)- after Promo period


TestFilters(["regression", "accountSummaryStatistics"], () => {
  describe("Validate account summary statistics with different product types", function () {
    let accountID;
    let customerID;
    let productID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });

    configJSON.forEach((data) => {
      it(`should have create product - ${data.tc_name}`, async () => {
        //Update payload and create an product
        const productPayload: CreateProduct = {
          promo_len: parseInt(data.promo_len),
          default_credit_limit_cents: data.default_credit_limit_cents,
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_template_name, productPayload));
        productID = response.body.product_id;
      });

      it(`should have create account and assign customer - ${data.tc_name}`, async () => {
        //Update product, customer and account effective date in account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          initial_principal_cents: parseInt(data.initial_principal_cents),
          credit_limit_cents: parseInt(data.account_credit_limit),
          origination_fee_cents: parseInt(data.origination_fee),
          monthly_fee_cents: parseInt(data.monthly_fee),
          annual_fee_cents: parseInt(data.annual_fee),
          late_fee_cents: parseInt(data.late_fee_cents),
        };

        response = await promisify(accountAPI.updateNCreateAccount(data.account_template_name, accountPayload));
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      it(`should have create payment - ${data.tc_name}`, () => {
        paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_at);
      });

      //Calling roll time forward to get the payment line item
      it(`should have to wait for account roll time forward  - ${data.tc_name}`, async () => {
        const rollDate = data.roll_forward_date.slice(0, 10);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollDate));
        expect(response.status).to.eq(200);
      });

      it(`should have to  Login to WebOS and validate account summary statistics - ${data.tc_name}`, function () {
        //TODO: Need to look at option to login once in before block.
        cy.login(Cypress.env("webEmailID"), Cypress.env("webPassword"));
        cy.redirectToAccountPage(accountID);
        const expectedAccountSummary: AccountSummary = {
          current_balance: data.exp_current_balance,
          open_to_buy: data.exp_open_to_buy,
          credit_limit: data.exp_credit_limit,
          principal_balance: data.exp_principal_balance,
          payoff_amount: data.exp_payoff_amount,
          total_paid_to_date: data.exp_total_paid_to_date,
          interest_paid_to_date: data.exp_interest_paid_to_date,
          max_credit_limit: data.exp_max_credit_limit,
          available_credit: data.exp_available_credit,
        };
        cy.validateAccountSummary(expectedAccountSummary);
        cy.softAssertAll();
      });
    });
  });

  type CreateAccount = Pick<
    AccountPayload,
    | "product_id"
    | "customer_id"
    | "effective_at"
    | "initial_principal_cents"
    | "credit_limit_cents"
    | "late_fee_cents"
    | "annual_fee_cents"
    | "monthly_fee_cents"
    | "origination_fee_cents"
  >;
  type CreateProduct = Pick<ProductPayload, "promo_len" | "default_credit_limit_cents">;
  type AccountSummary = Pick<
    UIAccountSummary,
    | "current_balance"
    | "open_to_buy"
    | "credit_limit"
    | "principal_balance"
    | "payoff_amount"
    | "total_paid_to_date"
    | "interest_paid_to_date"
    | "max_credit_limit"
    | "available_credit"
  >;
});
