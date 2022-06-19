import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { chargeAPI } from "../../../api_support/charge";
import statementJSON from "../../../../resources/testdata/statement/statement_create_account.json";
import statementTransactionJSON from "../../../../resources/testdata/statement/statements_create_transactions.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { paymentAPI } from "../../../api_support/payment";
import { CycleTypeConstants } from "../../../api_support/constants";
import { statementsAPI } from "../../../api_support/statements";
import { statementValidator, StatementBalanceSummary } from "../../../api_validation/statements_validator";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";

//Test Scripts
//PP2743 - Verify all transaction line items in statements for revolving account
//PP2744 - Do excess payment for an revolving account and check in statements
//PP2745 - Do excess payment for an revolving account without fees and check in statements
//PP2743A - Verify all transaction line items in statements for installment account
//PP2744A - Do excess payment for an installment account and check in statements
//PP2745A - Do excess payment for an installment account without fees and check in statements

TestFilters(
  [
    "regression",
    "systemOfRecords",
    "statements",
    "payments",
    "paymentReversal",
    "charges",
    "originationFee",
    "annualFee",
    "monthlyFee",
    "debitOffset",
    "creditOffset",
  ],
  () => {
    describe("statements - all transactions through statements", function () {
      let accountID;
      let productID;
      let paymentID;
      let customerID;
      let effectiveDate;
      let validationTransactionJSON;

      before(() => {
        authAPI.getDefaultUserAccessToken();
        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
      });

      statementJSON.forEach((data) => {
        validationTransactionJSON = statementTransactionJSON.filter(
          (results) => results.account_tc_id === data.tc_name
        );
        describe(`should have create product,account and assign customer - '${data.tc_name}'`, () => {
          //Create a product
          it(`should have create a product - '${data.tc_name}'`, () => {
            productAPI.createProductWith1monthCycleInterval(data.product_file, true, true).then((productResponse) => {
              productID = productResponse.body.product_id;
            });
          });
          //Create an account
          it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
            effectiveDate = dateHelper.addDays(parseInt(data.account_effective_dt), 0);
            const accountPayload: CreateAccount = {
              product_id: productID,
              customer_id: customerID,
              effective_at: effectiveDate,
              initial_principal_cents: parseInt(data.initial_principal_cents),
              origination_fee_cents: parseInt(data.origination_fee_cents),
              late_fee_cents: parseInt(data.late_fee_cents),
              monthly_fee_cents: parseInt(data.monthly_fee_cents),
              annual_fee_cents: parseInt(data.annual_fee_cents),
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
            switch (results.transaction_type) {
              case "payment":
                it(`should be able to create a payment - '${results.account_tc_id}'`, async () => {
                  effectiveDate = dateHelper.addDays(parseInt(results.effective_dt), 0);
                  paymentID = await promisify(
                    paymentAPI.paymentForAccount(accountID, "payment.json", results.amount_paid, effectiveDate)
                  );
                });
                break;
              case "charge":
                it(`should be able to create a charge - '${results.account_tc_id}'`, async () => {
                  effectiveDate = dateHelper.addDays(parseInt(results.effective_dt), 0);
                  await promisify(
                    chargeAPI.chargeForAccount(accountID, "create_charge.json", results.amount_paid, effectiveDate)
                  );
                });
                break;
              case "paymentReversal":
                it(`should have perform payment reversal - '${results.account_tc_id}'`, () => {
                  lineItemsAPI.paymentReversalLineitems(accountID, paymentID).then((response) => {
                    expect(response.status).to.eq(200);
                  });

                  //Roll forward by three days from current day for payment reversal
                  const endDate = dateHelper.getRollDate(3);
                  rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
                    expect(response.status).to.eq(200);
                  });
                });
                break;
              case "debitOffset":
                it(`should be able to create debit offset transaction`, () => {
                  effectiveDate = dateHelper.addDays(parseInt(results.effective_dt), 0);
                  lineItemsAPI.debitOffsetForAccount(
                    accountID,
                    "debit_offset_allocation.json",
                    results.amount_paid,
                    effectiveDate
                  );
                });
                break;

              case "creditOffset":
                it(`should be able to create credit offset transaction`, () => {
                  effectiveDate = dateHelper.addDays(parseInt(results.effective_dt), 0);
                  lineItemsAPI.creditOffsetForAccount(
                    accountID,
                    "credit_offset_allocation.json",
                    results.amount_paid,
                    effectiveDate
                  );
                });
                break;
              case "manual_fee":
                it(`should be able to create a manual fee - '${results.account_tc_id}'`, async () => {
                  effectiveDate = dateHelper.addDays(parseInt(results.effective_dt), 0);
                  await promisify(
                    lineItemsAPI.manualFeeForAccount(accountID, "manual_fees.json", results.amount_paid, effectiveDate)
                  );
                });
                break;
              case "stmt_balance_validation":
                //Calling roll time forward to get charge amount in statement and statement details get updated
                it(`should have to wait for account roll time forward till second cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(
                    CycleTypeConstants.cycle_interval_1month.toLowerCase(),
                    2
                  );
                  effectiveDate = dateHelper.addDays(parseInt(data.account_effective_dt), 0);
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(effectiveDate, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });

                it(`should have to validate statement balance for first cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 0, balanceSummary);
                });

                it(`should have to validate statement line items for first cycle - '${data.tc_name}'`, async () => {
                  //Get statement list fo r account
                  const response = await promisify(statementsAPI.getStatementByAccount(accountID));
                  const chargeStatementID = statementValidator.getStatementIDByNumber(response, 0);
                  //Get statement details for given statement id
                  const statementResponse = await promisify(
                    statementsAPI.getStatementByStmtId(accountID, chargeStatementID)
                  );
                  type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
                  const chargeLineItem: StmtLineItem = {
                    status: "VALID",
                    type: "CHARGE",
                    original_amount_cents: parseInt(data.initial_principal_cents),
                  };
                  lineItemValidator.validateStatementLineItem(statementResponse, chargeLineItem);
                  //Check origination line item is displayed in the statement
                  if (parseInt(data.origination_fee_cents) !== 0) {
                    const originationFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "ORIG_FEE",
                      original_amount_cents: parseInt(data.origination_fee_cents),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, originationFeeLineItem);
                  }
                  //Check monthly fee item is displayed in the statement
                  if (parseInt(data.monthly_fee_cents) !== 0) {
                    const monthlyFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "MONTH_FEE",
                      original_amount_cents: parseInt(data.monthly_fee_cents),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, monthlyFeeLineItem);
                  }
                  //Check payment line item
                  if (parseInt(results.payment_lineitem) !== 0) {
                    const paymentLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "PAYMENT",
                      original_amount_cents: parseInt(results.payment_lineitem) * -1,
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, paymentLineItem);
                  }
                  //Check manual fee line item is displayed in the statement
                  if (parseInt(results.manual_fee_lineitem) !== 0) {
                    const manualFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "MANUAL_FEE",
                      original_amount_cents: parseInt(results.manual_fee_lineitem),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, manualFeeLineItem);
                  }
                  //Check debit offset line item is displayed in the statement
                  if (parseInt(results.debitoffset_lineitem) !== 0) {
                    const manualFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "DEBIT_OFFSET",
                      original_amount_cents: parseInt(results.debitoffset_lineitem) * -1,
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, manualFeeLineItem);
                  }
                  //Check CREDIT_OFFSET_FEE line item is displayed in the statement
                  if (parseInt(results.creditoffset_lineitem) !== 0) {
                    const manualFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "CREDIT_OFFSET_FEE",
                      original_amount_cents: parseInt(results.creditoffset_lineitem),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, manualFeeLineItem);
                  }
                  //Check payment reversal line item is displayed in the statement
                  if (parseInt(results.payment_reversal) !== 0) {
                    const paymentReversalLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "PAYMENT_REVERSAL",
                      original_amount_cents: parseInt(results.payment_reversal),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, paymentReversalLineItem);
                  }

                  //Check payment reversal line item is displayed in the statement
                  if (parseInt(results.payment_reversal_fees) !== 0) {
                    const paymentReversalFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "PAYMENT_REVERSAL_FEE",
                      original_amount_cents: parseInt(results.payment_reversal_fees),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, paymentReversalFeeLineItem);
                  }
                });
                break;
            }
          });
        });
      });
    });
  }
);

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
  | "first_cycle_interval"
>;
type StmtBalanceSummaryPick = Pick<
  StatementBalanceSummary,
  "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
>;
