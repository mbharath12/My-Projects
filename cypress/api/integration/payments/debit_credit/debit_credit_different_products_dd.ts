/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { paymentAPI } from "../../../api_support/payment";
import { chargeAPI } from "../../../api_support/charge";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";
import { statementsAPI } from "../../../api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import paymentProcessingJSON from "../../../../resources/testdata/payment/debit_credit_product_account.json";
import transactionsJSON from "../../../../resources/testdata/payment/all_debit_credit_transaction.json";
import { lineItemsAPI, offsetPayload } from "../../../api_support/lineItems";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
import { AccountSummary, accountValidator } from "../../../api_validation/account_validator";

//Test Scripts
//PP2620 - PP2660 - Verify the processing of Debit offset and Credit offset for each balance bucket - Principal, Interest ,Deferred Interest and Fee,for different product types

TestFilters(
  [
    "regression",
    "installmentProduct",
    "revolvingProduct",
    "creditProduct",
    "chargeCardProduct",
    "debitoffset",
    "creditoffset",
    "statements",
    "accountsummary",
  ],
  () => {
    describe("Validate debit and credit offset allocation on various products", function () {
      let accountID;
      let productID;
      let productJSONFile;
      let customerID;
      let paymentID;
      let effectiveDate;
      let cycleStatementID;
      let stmtresponse;
      let response;
      let filtered;

      before(async () => {
        authAPI.getDefaultUserAccessToken();
        //create a customer
        customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
        cy.log("new customer created : " + customerID);
      });

      paymentProcessingJSON.forEach((data) => {
        filtered = transactionsJSON.filter((results) => results.tc_name === data.tc_name);
        describe(`should have create product and account- '${data.tc_name}'`, () => {
          it(`should have create product - '${data.tc_name}'`, async () => {
            productJSONFile = data.product_type;

            //update the Cycle_interval,Cycle_due,Promo policies
            const productPayload: CreateProduct = {
              cycle_interval: data.cycle_interval,
              cycle_due_interval: data.cycle_due_interval,
              promo_len: parseInt(data.promo_len),
              promo_min_pay_type: data.promo_min_pay_type,
              promo_interest_deferred: data.promo_interest_deferred,
              promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
              promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
              promo_apr_range_inclusive_lower: parseInt(data.promo_apr_range_inclusive_lower),
              promo_apr_range_inclusive_upper: parseInt(data.promo_apr_range_inclusive_upper),
              post_promo_default_interest_rate_percent: parseInt(data.post_promo_default_interest_rate_percent),
              first_cycle_interval_del: "first_cycle_interval",
            };

            const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
            productID = response.body.product_id;
            cy.log("new product created : " + productID);
          });

          it(`should have create account - '${data.tc_name}'`, async () => {
            let accountJSONFile = "account_only_promo.json";
            const days = parseInt(data.account_effective_dt);
            effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));

            const accountPayload: CreateAccount = {
              product_id: productID,
              customer_id: customerID,
              effective_at: effectiveDate,
              credit_limit_cents: parseInt(data.credit_limit_cents),
              initial_principal_cents: parseInt(data.initial_principal_cents),
              origination_fee_cents: parseInt(data.origination_fee_cents),
              late_fee_cents: parseInt(data.late_fee_cents),
              monthly_fee_cents: parseInt(data.monthly_fee_cents),
              annual_fee_cents: parseInt(data.Annual_fee_cents),
              payment_reversal_fee_cents: parseInt(data.payment_reversal_fee_cents),
              promo_impl_interest_rate_percent: parseInt(data.promo_int),
            };
            const response = await promisify(accountAPI.updateNCreateAccount(accountJSONFile, accountPayload));
            expect(response.status).to.eq(200);
            accountID = response.body.account_id;
            cy.log("new account created : " + accountID);
          });
        });

        describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
          filtered.forEach((results) => {
            switch (results.transaction_type) {
              case "validateLineItem":
                it(`should be able to get a line item '${results.exp_line_item_type}'`, async () => {
                  let lineResponse = await promisify(lineItemsAPI.allLineitems(accountID));
                  expect(lineResponse.status).to.eq(200);
                  const paymentLineItem: payLineItem = {
                    status: "VALID",
                    type: results.exp_line_item_type,
                    original_amount_cents: parseInt(results.original_amount_cents) * -1,
                  };
                  lineItemValidator.validateLineItem(lineResponse, paymentLineItem);
                });
                break;

              case "debitOffset":
                it(`should be able to create debit offset transaction`, () => {
                  const days = parseInt(results.effective_at);
                  effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
                  const debitoffsetPayload: CreateDebitOffset = {
                    effective_at: effectiveDate,
                    original_amount_cents: results.original_amount_cents,
                    allocation: results.allocation,
                  };
                  lineItemsAPI.updateNcreatedebitoffset(accountID, "debit_offset_allocation.json", debitoffsetPayload);
                });
                break;

              case "creditOffset":
                it(`should be able to create credit offset transaction`, () => {
                  const days = parseInt(results.effective_at);
                  effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
                  const creditoffsetPayload: CreateCreditOffset = {
                    effective_at: effectiveDate,
                    original_amount_cents: results.original_amount_cents,
                    allocation: results.allocation,
                  };
                  lineItemsAPI.updateNcreatecreditoffset(
                    accountID,
                    "credit_offset_allocation.json",
                    creditoffsetPayload
                  );
                });
                break;

              case "charge":
                it(`should be able to create create additional charge'`, () => {
                  const days = parseInt(results.effective_at);
                  effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
                  chargeAPI.chargeForAccount(
                    accountID,
                    "create_charge.json",
                    results.original_amount_cents,
                    effectiveDate
                  );
                });
                break;

              case "payment":
                it(`should be able to create a payment`, async () => {
                  const days = parseInt(results.effective_at);
                  effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
                  paymentID = await promisify(
                    paymentAPI.paymentForAccount(
                      accountID,
                      "payment.json",
                      results.original_amount_cents,
                      effectiveDate
                    )
                  );
                });
                break;

              case "paymentReversal":
                it(`should be able to create a payment reversal`, async () => {
                  const response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentID));
                  expect(response.status).to.eq(200);
                });
                break;

              case "rollTimeForward":
                it(`should do roll time forward '${results.exp_line_item_type}'`, async () => {
                  const endDate = dateHelper.getAccountEffectiveAt(results.roll_date);
                  response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
                  expect(response.status).to.eq(200);
                });
                break;

              case "getStatementID":
                it(`should be able to get the components in statement '${results.exp_line_item_type}'`, async () => {
                  cy.wait(2000);
                  response = await promisify(statementsAPI.getStatementByAccount(accountID));
                  expect(response.status).to.eq(200);
                  cycleStatementID = statementValidator.getStatementIDByNumber(
                    response,
                    parseInt(results.stmt_to_validate)
                  );
                });
                break;

              case "validateStatement":
                it(`should be able to validate the components in statement '${results.exp_line_item_type}'`, async () => {
                  stmtresponse = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
                  expect(stmtresponse.status).to.eq(200);
                  // Validate Loan Principal,fee balance ,total balance ,interest balance and charge principal are as expected
                  const balanceSummary: StmtBalanceSummaryPick = {
                    principal_balance_cents: parseInt(results.principal_balance),
                    fees_balance_cents: parseInt(results.fee_balance),
                    am_interest_balance_cents: parseInt(results.am_int_cents),
                    charges_principal_cents: parseInt(results.principal_balance),
                    interest_balance_cents: parseInt(results.int_bal_cents),
                    total_balance_cents: parseInt(results.total_balance),
                    deferred_interest_balance_cents:parseInt(results.deferred_interest_balance_cents)
                  };
                  statementValidator.validateStatementBalanceSummarybyID(
                    stmtresponse,
                    results.product_type,
                    balanceSummary
                  );
                  expect(
                    stmtresponse.body.open_to_buy.available_credit_cents,
                    "Available Credit Balance is displayed"
                  ).to.eq(parseInt(results.available_credit_cents));
                });
                break;

              case "validateAccountSummary":
                it(`should have validate account summary`, () => {
                  const accSummary: AccSummary = {
                    principal_cents: parseInt(results.principal_balance),
                    total_balance_cents: parseInt(results.total_balance),
                    fees_balance_cents: parseInt(results.fee_balance),
                  };
                  accountValidator.validateAccountSummary(accountID, accSummary);
                });
                break;
            }
          });
        });
      });
    });
  }
);
type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "promo_len"
  | "promo_min_pay_type"
  | "promo_interest_deferred"
  | "promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
  | "promo_apr_range_inclusive_lower"
  | "promo_apr_range_inclusive_upper"
  | "post_promo_default_interest_rate_percent"
  | "first_cycle_interval_del"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "initial_principal_cents"
  | "credit_limit_cents"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "payment_reversal_fee_cents"
  | "promo_impl_interest_rate_percent"
>;

type payLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;

type StmtBalanceSummaryPick = Pick<
  StatementBalanceSummary,
  | "principal_balance_cents"
  | "fees_balance_cents"
  | "am_interest_balance_cents"
  | "charges_principal_cents"
  | "interest_balance_cents"
  | "total_balance_cents"
  | "deferred_interest_balance_cents"
>;

type AccSummary = Pick<AccountSummary, "principal_cents" | "total_balance_cents" | "fees_balance_cents">;

type CreateCreditOffset = Pick<offsetPayload, "effective_at" | "original_amount_cents" | "allocation">;

type CreateDebitOffset = Pick<offsetPayload, "effective_at" | "original_amount_cents" | "allocation">;
