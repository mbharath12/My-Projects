/* eslint-disable cypress/no-unnecessary-waiting */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { chargeAPI } from "../../../api_support/charge";
import statementJSON from "../../../../resources/testdata/statement/statement_make_partial_payments.json";
import statementTransactionJSON from "../../../../resources/testdata/statement/statement_make_partial_payments_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { paymentAPI } from "../../../api_support/payment";
import { CycleTypeConstants } from "../../../api_support/constants";
import { statementsAPI } from "../../../api_support/statements";
import { statementValidator, StatementBalanceSummary } from "../../../api_validation/statements_validator";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";

//Test Scripts
//PP554-PP557 partial payments through statements - 5 consecutive statements with origination fees - charges
//PP558-PP561 partial payments through statements - 5 consecutive statements
// with no origination fees - charge - monthly fees
//PP562-PP567 partial payments through statements - 5 consecutive statements with
// origination fees - charge - monthly fees
//PP568-PP571 partial payments through statements - 5 consecutive statements
// with no origination fee - charge - annual fees
//PP572-PP577 partial payments through statements - 5 consecutive statements
// with origination fee - charge - annual fees
//PP578-PP585 partial payments through statements - 5 consecutive statements
// with no origination fee - charge - monthly and annual fees
//PP586-PP594 partial payments through statements - 5 consecutive statements
// with origination fee - charge - monthly and annual fees

//5 consecutive statement validation with annual, monthly with origination fee, charges,
//and partial payments through statement

TestFilters(
  [
    "regression",
    "systemOfRecords",
    "statements",
    "partialPayments",
    "charges",
    "originationFee",
    "annualFee",
    "monthlyFee",
  ],
  () => {
    describe("5 consecutive statements - keep making partial payments through statements", function () {
      let accountID;
      let productID;
      let product7DaysID;
      let product1MonthID;
      let customerID;
      let validationTransactionJSON;

      before(() => {
        authAPI.getDefaultUserAccessToken();
        //Create a product - using  credit product
        productAPI.createProductWith7daysCycleInterval("product_credit.json", true, true).then((productResponse) => {
          product7DaysID = productResponse.body.product_id;
        });

        productAPI.createProductWith1monthCycleInterval("product_credit.json", true, true).then((productResponse) => {
          product1MonthID = productResponse.body.product_id;
        });

        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
      });

      statementJSON.forEach((data) => {
        validationTransactionJSON = statementTransactionJSON.filter(
          (results) => results.account_tc_id === data.tc_name
        );
        describe(`should have create account and assign customer - '${data.tc_name}'`, () => {
          it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
            //Updating product id based on cycle interval
            if (data.cycle_interval.toLowerCase() === CycleTypeConstants.cycle_interval_7days) {
              productID = product7DaysID;
            } else {
              productID = product1MonthID;
            }
            const accountPayload: CreateAccount = {
              product_id: productID,
              customer_id: customerID,
              effective_at: data.account_effective_dt,
              initial_principal_cents: parseInt(data.initial_principal_cents),
              origination_fee_cents: parseInt(data.origination_fee_cents),
              late_fee_cents: parseInt(data.late_fee_cents),
              monthly_fee_cents: parseInt(data.monthly_fee_cents),
              annual_fee_cents: parseInt(data.annual_fee_cents),
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
                it(`should be able to create a payment - '${results.tc_name}'`, async () => {
                  await promisify(
                    paymentAPI.paymentForAccount(accountID, "payment.json", results.amount_paid, results.effective_at)
                  );
                });
                break;
              case "charge":
                it(`should be able to create a charge - '${results.tc_name}'`, async () => {
                  await promisify(
                    chargeAPI.chargeForAccount(
                      accountID,
                      "create_charge.json",
                      results.amount_paid,
                      results.effective_at
                    )
                  );
                });
                break;
              case "stmt1_balance_validation":
                //Calling roll time forward to get charge amount in statement and statement details get updated
                it(`should have to wait for account roll time forward till second cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(
                    data.cycle_interval.toLowerCase(),
                    2
                  );
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });

                it(`should have to validate statement balance for first cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 0, balanceSummary);
                });

                it(`should have to validate statement line items for first cycle - '${data.tc_name}'`, async () => {
                  //Get statement list for account
                  const response = await promisify(statementsAPI.getStatementByAccount(accountID));
                  const chargeStatementID = statementValidator.getStatementIDByNumber(response, 0);
                  //Get statement details for given statement id
                  const statementResponse = await promisify(
                    statementsAPI.getStatementByStmtId(accountID, chargeStatementID)
                  );
                  type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
                  if (data.initial_principal_cents !== "0") {
                    const chargeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "CHARGE",
                      original_amount_cents: parseInt(data.initial_principal_cents),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, chargeLineItem);
                  }
                  //Check origination line item is displayed in the statement
                  if (data.origination_fee_cents !== "0") {
                    const originationFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "ORIG_FEE",
                      original_amount_cents: parseInt(data.origination_fee_cents),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, originationFeeLineItem);
                  }
                  //Check monthly fee item is displayed in the statement
                  if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
                    const monthlyFeeLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "MONTH_FEE",
                      original_amount_cents: parseInt(data.monthly_fee_cents),
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, monthlyFeeLineItem);
                  }
                  if (results.amount_paid !== "0") {
                    const paymentLineItem: StmtLineItem = {
                      status: "VALID",
                      type: "PAYMENT",
                      original_amount_cents: parseInt(results.payment_amount) * -1,
                    };
                    lineItemValidator.validateStatementLineItem(statementResponse, paymentLineItem);
                  }
                });
                break;
              case "stmt2_balance_validation":
                //Calling roll time forward to get statement details updated
                it(`should have to wait for account roll time forward till third cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 3);
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });

                it(`should have to validate statement balance for second cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 1, balanceSummary);
                });

                it(`should have to validate statement line items for second cycle - '${data.tc_name}'`, () => {
                  validateStatementLineItem(data, 2, false, results.payment_amount);
                });
                break;
              case "stmt3_balance_validation":
                //Calling roll time forward to get statement details updated
                it(`should have to wait for account roll time forward till fourth cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 4);
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });
                it(`should have to validate statement balance for third cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 2, balanceSummary);
                });

                it(`should have to validate statement line items for third cycle - '${data.tc_name}'`, () => {
                  validateStatementLineItem(data, 3, true, results.payment_amount);
                });
                break;
              case "stmt4_balance_validation":
                //Calling roll time forward to get statement details updated
                it(`should have to wait for account roll time forward till fifth cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 5);
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });
                it(`should have to validate statement balance for fourth cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 3, balanceSummary);
                });

                it(`should have to validate statement line items for fourth cycle - '${data.tc_name}'`, () => {
                  validateStatementLineItem(data, 4, false, results.payment_amount);
                });
                break;
              case "stmt5_balance_validation":
                //Calling roll time forward to get statement details updated
                it(`should have to wait for account roll time forward till sixth cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 6);
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });
                it(`should have to validate statement balance for fifth cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 4, balanceSummary);
                });

                it(`should have to validate statement line items for fifth cycle - '${data.tc_name}'`, () => {
                  validateStatementLineItem(data, 4, false, results.payment_amount);
                });
                break;
              case "stmt6_balance_validation":
                //Calling roll time forward to get statement details updated
                it(`should have to wait for account roll time forward till seventh cycle - '${data.tc_name}'`, async () => {
                  //Roll time forward to generate statement lineItem
                  const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 7);
                  const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                  expect(response.status).to.eq(200);
                });
                it(`should have to validate statement balance for sixth cycle - '${data.tc_name}'`, () => {
                  const balanceSummary: StmtBalanceSummaryPick = {
                    charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                    loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                    fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                    total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  };
                  statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 5, balanceSummary);
                });
                break;
            }
          });
        });
      });

      //Function specific to this test case
      function validateStatementLineItem(data, statementIDNumber, checkAnnualFee, amount_paid) {
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, statementIDNumber);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check monthly fee item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyLineItem);
            }
            //check charges line item displayed in the statement
            if (checkAnnualFee === true && data.annual_fee_cents !== "0") {
              const annualFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "YEAR_FEE",
                original_amount_cents: parseInt(data.annual_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, annualFeeLineItem);
            }
            const paymentLineItem: StmtLineItem = {
              status: "VALID",
              type: "PAYMENT",
              original_amount_cents: parseInt(amount_paid) * -1,
            };
            lineItemValidator.validateStatementLineItem(response, paymentLineItem);
          });
        });
      }
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
>;
type StmtBalanceSummaryPick = Pick<
  StatementBalanceSummary,
  "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
>;
