import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { statementsAPI } from "../../api_support/statements";
import { statementValidator } from "../../api_validation/statements_validator";
import { rollTimeAPI } from "../../api_support/rollTime";
import accountJSON from "../../../resources/testdata/account/account_config_promo.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";

//Test Scripts
//pp1297 - verify promo_impl_interest_rate_percent applied for the account
//pp1298 - Verify promo_impl_interest_rate_percent at account level overrides product level
//pp1299 - Verify post_promo_impl_interest_rate_percent interest rate is applied to the account
//pp1300 - Verify post promo interest rate set up at account level overrides product level
//pp1301 - Verify Post Promo len determines number of installments
//pp1302 - Verify Post Promo len specified at account level overrides at product level
//pp1303 - Verify Associated Entities merchant name associated with the account
//pp1304 - Verify Associated Entities lender name associated with the account
//pp1319 - Verify the details of account provided in the request matches with response
//pp1320 - Verify Response for the create new account contains Account Status as Active
//pp1321 - Verify Response for the create new account contains calculated Loan end date
//pp1322 - Verify Response for the create new account contains calculated Minimum payment due for the first cycle

TestFilters(["accountSummary", "config", "promo", "regression"], () => {
  //Validate account config with promo and post promo settings
  describe("Validate account config with promo and post promo settings", function () {
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

    accountJSON.forEach((data) => {
      //Create a new revolving installment product
      it("should be able to create a new revolving installment product", async () => {
        //Update post promo length and interest rate for installment in the product
        const productPayload: CreateProduct = {
          post_promo_default_interest_rate_percent: parseInt(data.productPostPromoImplInterest),
          promo_default_interest_rate_percent: parseInt(data.productPromoImplInterest),
          post_promo_len: parseInt(data.productPostPromoLen),
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          promo_len: parseInt(data.productPromoLen),
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_type, productPayload));
        productID = response.body.product_id;
        cy.log("new product created : " + productID);
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          post_promo_impl_interest_rate_percent: parseInt(data.post_promo_impl_interest_rate_percent),
          initial_principal_cents: parseInt(data.initial_principle_in_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          effective_at: data.account_effective_at,
          promo_impl_interest_rate_percent: parseInt(data.promo_impl_interest_rate_percent),
          post_promo_len: parseInt(data.post_promo_len),
          merchant_name: data.merchant_name,
          lender_name: data.lender_name,
          first_cycle_interval: data.cycle_interval
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);

        //Verify account promo and post promo details in response
        expect(
          response.body.account_product.promo_overview.promo_impl_interest_rate_percent,
          "verify promo overview interest rate in account"
        ).to.eq(parseInt(data.promo_impl_interest_rate_percent));
        expect(
          response.body.account_product.post_promo_overview.post_promo_impl_interest_rate_percent,
          "verify post promo interest rate in account"
        ).to.eq(parseInt(data.post_promo_impl_interest_rate_percent));
        expect(
          response.body.account_product.post_promo_overview.post_promo_len,
          "verify post promo length in account"
        ).to.eq(parseInt(data.post_promo_len));

        expect(response.body.account_overview.account_status, "verify account status").to.eq("ACTIVE");
        expect(
          response.body.associated_entities.lender_name,
          "verify lender_name in account associated entities"
        ).to.eq(data.lender_name);
        expect(
          response.body.associated_entities.merchant_name,
          "verify merchant_name in account associated entities"
        ).to.eq(data.merchant_name);
        cy.log(response.body.account_product.product_lifecycle.loan_end_date);
        cy.log(response.body.min_pay_due_cents.min_pay_due_at);
        expect(
          response.body.account_product.product_lifecycle.loan_end_date,
          "verify loan end date is calculated for an account"
        ).to.include(data.loan_end_date.slice(0, 10));
        expect(
          response.body.min_pay_due_cents.min_pay_due_at,
          "verify min_pay_due_at is calculated for an account"
        ).to.include(data.min_pay_due_at.slice(0, 10));
      });

      //Calling roll time forward to get the payment line item
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 3);
        const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_at, forwardDate);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
        expect(response.status).to.eq(200);
      });

      //Verify interest rate is applied for account based on promo and post promo
      // interest rates
      it(`should have to validate total balance for statement1 - '${data.tc_name}'`, async () => {
        //Get statement list for account
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        const Statement1ID = statementValidator.getStatementIDByNumber(response, 0);
        //Get statement details for given statement id
        statementsAPI.getStatementByStmtId(accountID, Statement1ID).then((response) => {
          expect(response.body.balance_summary.total_balance_cents, "verify statement1 total balance").to.eq(
            parseInt(data.stmt1_total_balance_cents)
          );
        });
      });

      it(`should have to validate total balance for statement2 - '${data.tc_name}'`, async () => {
        //Get statement list for account
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        const Statement2ID = statementValidator.getStatementIDByNumber(response, 1);
        //Get statement details for given statement id
        statementsAPI.getStatementByStmtId(accountID, Statement2ID).then((response) => {
          expect(response.body.balance_summary.total_balance_cents, "verify statement2 total balance").to.eq(
            parseInt(data.stmt2_total_balance_cents)
          );
        });
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "initial_principal_cents"
  | "origination_fee_cents"
  | "promo_impl_interest_rate_percent"
  | "post_promo_impl_interest_rate_percent"
  | "post_promo_len"
  | "merchant_name"
  | "lender_name"
  | "monthly_fee_cents"
  | "late_fee_cents"
  | "effective_at"
  | "first_cycle_interval"
>;

type CreateProduct = Pick<
  ProductPayload,
  "post_promo_default_interest_rate_percent" | "promo_default_interest_rate_percent" | "post_promo_len" | "cycle_interval" |"cycle_due_interval"| "promo_len"
>;
