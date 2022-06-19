/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { statementsAPI } from "../../../api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import transactionsJSON from "../../../../resources/testdata/payment/payment_pouring_transaction.json";
import paymentProcessingJSON from "../../../../resources/testdata/payment/payment_pouring_product_account.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { lineItemsAPI } from "../../../api_support/lineItems";

//Test Scripts
//PP146 - PP162 ,PP1155 - PP1164 -- Payment Pouring in Installment loan,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP147- Payment Pouring in Credit card,where as Payment allocation to different Balance buckets based on the Product Config parameters by knocking off full fee
//PP148- Payment Pouring in Revolving LOC,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP149- Payment Pouring in Credit card,where as Payment allocation to different Balance buckets based on the Product Config parameters by knocking off partial fee
//PP150- Payment Pouring Charge Card,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP146A-Payment Pouring  in Installment loan,where as Payment allocation to different Balance buckets based on the Product Config parameters by providing full payment.
//PP159- Payment Pouring in CreditCard,where in partial Payment increases the Available limit
//PP159A-Payment Pouring in CreditCard,where in full Payment increases the Available limit
//PP160- Payment Pouring in Charge Card,where in Payment increases the Available limit
//PP161- Payment Pouring Reversal in Installment Loan- Payment re-allocation to different Balance buckets based on the Product Config parameters
//PP162- Payment Pouring Reversal in Revolving Product,where in Payment re-allocation to different Balance buckets based on the Product Config parameters
//PP1155- Payment Pouring in Installment loan with 14D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1156- Payment Pouring in Installment loan  with 14D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1157-Payment Pouring in Credit/Revolving  with 14D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1158-Payment Pouring in Revolving with 14D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1159-Payment Pouring in charge with 14D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1160-Payment Pouring in installment with 30D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1161-Payment Pouring in Revolving with 30D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1162-Payment Pouring in Charge with 30D cycle interval,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1163-Payment Pouring in Installment from the Account Effective date,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1164-Payment Pouring in Charge from the Account Effective date,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1350 - PP1354 Payment Pouring in Installment loan with the Cycle_Interval of 7 days,where as Payment allocation to different Balance buckets based on the payment amount
//PP1355 - PP1356 Payment Pouring in Credit card with the Cycle_Interval of 7 days,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1357 - PP1358 Payment Pouring in Revolving card with the Cycle_Interval of 7 days,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1359 - PP1361 Payment Pouring in Credit/Charge card with the Cycle_Interval of 7 days,where as Payment allocation to different Balance buckets based on the Product Config parameters
//PP1362 - PP1367 Payment Pouring in Installment loan with the Cycle_Interval of 14 days,where as Payment allocation to different Balance buckets based on the payment amount
//PP1368 - PP1370 Payment Pouring in credit card with the Cycle_Interval of 14 days,where as Payment allocation to different Balance buckets based on the payment amount
//PP1371 - PP1374 Payment Pouring in Revolving card with the Cycle_Interval of 14 days,where as Payment allocation to different Balance buckets
//PP1375 - PP1378 Payment Pouring in charge card with the Cycle_Interval of 14 days,where as Payment allocation to different Balance buckets

TestFilters(
  [
    "regression",
    "paymentPouring",
    "cycleInterval",
    "installmentProduct",
    "revolvingProduct",
    "creditProduct",
    "chargeCardProduct",
  ],
  () => {
    describe("payment pouring behaviour on various products", function () {
      let accountID;
      let productID;
      let productJSONFile;
      let customerID;
      let effectiveDate;
      let paymentID;
      let response;
      let accEffectiveAt;
      let accountTransactionJSON;
      let cycleStatementID;
      let stmtresponse;

      before(async () => {
        authAPI.getDefaultUserAccessToken();
        customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
        cy.log("new customer created : " + customerID);
      });

      paymentProcessingJSON.forEach((data) => {
        accountTransactionJSON = transactionsJSON.filter((results) => results.tc_name === data.tc_name);
        describe(`should have create product and account- '${data.tc_name}'`, () => {
          it(`should have create product - '${data.tc_name}'`, async () => {
            productJSONFile = data.exp_product_file;

            const productPayload: CreateProduct = {
              cycle_interval: data.cycle_interval,
              cycle_due_interval: data.cycle_due_interval,
              promo_len: parseInt(data.promo_len),
              promo_min_pay_type: data.promo_min_pay_type,
              promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
              promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
              delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
              charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
              first_cycle_interval_del: "first_cycle_interval",
            };
            const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
            productID = response.body.product_id;
            cy.log("new product created successfully: " + response.body.product_id);
          });

          it(`should have create account`, async () => {
            effectiveDate = dateHelper.getAccountEffectiveAt(data.account_effective_dt);

            const accountPayload: CreateAccount = {
              product_id: productID,
              customer_id: customerID,
              effective_at: effectiveDate,
              initial_principal_cents: parseInt(data.initial_principal_cents),
              origination_fee_cents: parseInt(data.origination_fee_cents),
              late_fee_cents: parseInt(data.late_fee_cents),
              monthly_fee_cents: parseInt(data.monthly_fee_cents),
              annual_fee_cents: parseInt(data.Annual_fee_cents),
              promo_impl_interest_rate_percent: parseInt(data.promo_int),
            };
            response = await promisify(accountAPI.updateNCreateAccount("account_only_promo.json", accountPayload));
            expect(response.status).to.eq(200);
            accountID = response.body.account_id;
            cy.log("new account created : " + accountID);
            accEffectiveAt = response.body.effective_at;
            cy.log("account effective date:" + accEffectiveAt);
          });

          describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
            accountTransactionJSON.forEach((results) => {
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

                case "payment":
                  it(`should be able to create a payment`, async () => {
                    effectiveDate = dateHelper.getAccountEffectiveAt(results.effective_at);
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
                    const balanceSummary: StmtBalanceSummaryPick = {
                      principal_balance_cents: parseInt(results.principal_balance),
                      fees_balance_cents: parseInt(results.fee_balance),
                      am_interest_balance_cents: parseInt(results.am_int_cents),
                      charges_principal_cents: parseInt(results.principal_balance),
                      interest_balance_cents: parseInt(results.int_bal_cents),
                      total_balance_cents: parseInt(results.total_balance),
                    };
                    statementValidator.validateStatementBalanceSummarybyID(
                      stmtresponse,
                      results.product_type,
                      balanceSummary
                    );
                  });
                  break;
              }
            });
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
  | "promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "delete_field_name"
  | "first_cycle_interval_del"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "credit_limit_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "payment_reversal_fee_cents"
  | "initial_principal_cents"
  | "origination_fee_cents"
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
