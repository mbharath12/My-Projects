/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { statementsAPI } from "../../../api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import statementJSON from "../../../../resources/testdata/statement/statements_manual_fee_payment.json";
import statementTransactionJSON from "../../../../resources/testdata/statement/statements_manual_fee_payment_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "../../../api_support/constants";
import { lineItemsAPI } from "../../../api_support/lineItems";

//Test Scripts
//PP2733 - statement with manual fee and verify balances
//PP2733A - Manual fee for two cycle and check the statements
//PP2733B - Manual fee and payment in same cycle
//PP2733C - Manual fee and payment in second cycle
//PP2733D - Manual fee and payment in next cycle
//PP2733E - Manual fee for two cycles and payment in second cycle
//PP2733F - Manual fee payment of partial principle in same cycle
//PP2733G - Manual fee payment of partial principle in next cycle
//PP2733H - Manual fee and full payment for same cycle
//PP2733I - Manual fee and full payment for next cycle

TestFilters(["regression", "systemOfRecords", "statements", "payments", "manualFee"], () => {
  describe("Statement verifications with manual fee and payment", function () {
    let accountID;
    let productID;
    let customerID;
    let response;
    let validationTransactionJSON;

    before(async () => {
      authAPI.getDefaultUserAccessToken();

      productAPI
        .createProductWith1monthCycleInterval("product_installment.json", true, true)
        .then((productResponse) => {
          productID = productResponse.body.product_id;
        });

      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    statementJSON.forEach((data) => {
      validationTransactionJSON = statementTransactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create account and assign customer - '${data.tc_name}'`, () => {
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Update product, customer and origination fee in account JSON
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principle_in_cents),
            origination_fee_cents: 0,
            late_fee_cents: 0,
            monthly_fee_cents: 0,
            annual_fee_cents: 0,
            first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });
      });

      describe(`should have to validate statements balance and line items- '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          switch (results.tc_name) {
            case "payment":
              it(`should be able to create a payment - '${results.tc_name}'`, async () => {
                await promisify(
                  paymentAPI.paymentForAccount(
                    accountID,
                    "payment.json",
                    results.transaction_amount,
                    results.effective_at
                  )
                );
              });
              break;
            case "manual_fee":
              it(`should be able to create a manual fee - '${results.tc_name}'`, async () => {
                await promisify(
                  lineItemsAPI.manualFeeForAccount(
                    accountID,
                    "manual_fees.json",
                    results.transaction_amount,
                    results.effective_at
                  )
                );
              });
              break;
            case "balances for first statement":
              //Calling roll time forward to update statement details
              it(`should have to wait for account roll time forward till third cycle - '${results.tc_name}'`, () => {
                //Roll time forward to generate statement lineItem
                const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(
                  CycleTypeConstants.cycle_interval_1month.toLowerCase(),
                  3
                );
                const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                rollTimeAPI.rollAccountForward(accountID, rollForwardDate).then((response) => {
                  expect(response.status).to.eq(200);
                });
              });

              it(`should have to validate statement balance for first cycle - '${results.tc_name}'`, () => {
                const balanceSummary: StmtBalanceSummaryPick = {
                  charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                  loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                  fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                  total_balance_cents: parseInt(results.stmt_total_balance_cents),
                };
                statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 0, balanceSummary);
              });

              //Check manual fee, payment line items in statements
              it(`should able to see manual fee and payment line items in first statement - '${results.tc_name}'`, async () => {
                const stmtResponseList = await promisify(statementsAPI.getStatementByAccount(accountID));
                const chargeStatementID = statementValidator.getStatementIDByNumber(stmtResponseList, 0);
                //Get statement details for given statement id
                response = await promisify(statementsAPI.getStatementByStmtId(accountID, chargeStatementID));
                //Check charge line item is displayed in the statement
                type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
                const chargeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "CHARGE",
                  original_amount_cents: parseInt(data.initial_principle_in_cents),
                };
                lineItemValidator.validateStatementLineItem(response, chargeLineItem);

                //Check manual fee line item is displayed in the statement
                const originationFeeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "MANUAL_FEE",
                  original_amount_cents: parseInt(results.lineitem1_amount),
                };
                lineItemValidator.validateStatementLineItem(response, originationFeeLineItem);
                if (parseInt(results.lineitem2_amount) !== 0) {
                  const paymentLineItem: StmtLineItem = {
                    status: "VALID",
                    type: "PAYMENT",
                    original_amount_cents: parseInt(results.lineitem2_amount) * -1,
                  };
                  lineItemValidator.validateStatementLineItem(response, paymentLineItem);
                }
              });
              break;
            case "balances for second statement":
              it(`should have to validate statement balance for second cycle - '${results.tc_name}'`, () => {
                type StmtBalanceSummaryPick = Pick<
                  StatementBalanceSummary,
                  "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
                >;
                const balanceSummary: StmtBalanceSummaryPick = {
                  charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                  loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                  fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                  total_balance_cents: parseInt(results.stmt_total_balance_cents),
                };
                statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 1, balanceSummary);
              });

              //Check manual fee, payment and payment reversal line items in statements
              it(`should able to see manual fee and payment line items in second statement - '${results.tc_name}'`, async () => {
                const stmtResponseList = await promisify(statementsAPI.getStatementByAccount(accountID));
                const chargeStatementID = statementValidator.getStatementIDByNumber(stmtResponseList, 1);
                //Get statement details for given statement id
                response = await promisify(statementsAPI.getStatementByStmtId(accountID, chargeStatementID));
                //Check charge line item is displayed in the statement
                type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
                //Check manual fee line item is displayed in the statement
                if (parseInt(results.lineitem1_amount) !== 0) {
                  const originationFeeLineItem: StmtLineItem = {
                    status: "VALID",
                    type: "MANUAL_FEE",
                    original_amount_cents: parseInt(results.lineitem1_amount),
                  };
                  lineItemValidator.validateStatementLineItem(response, originationFeeLineItem);
                }
                if (parseInt(results.lineitem2_amount) !== 0) {
                  const paymentLineItem: StmtLineItem = {
                    status: "VALID",
                    type: "PAYMENT",
                    original_amount_cents: parseInt(results.lineitem2_amount) * -1,
                  };
                  lineItemValidator.validateStatementLineItem(response, paymentLineItem);
                }
              });
              break;
          }
        });
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
    | "origination_fee_cents"
    | "late_fee_cents"
    | "monthly_fee_cents"
    | "annual_fee_cents"
    | "payment_reversal_fee_cents"
    | "promo_impl_interest_rate_percent"
    | "first_cycle_interval"
  >;

  type StmtBalanceSummaryPick = Pick<
    StatementBalanceSummary,
    "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
  >;
});
