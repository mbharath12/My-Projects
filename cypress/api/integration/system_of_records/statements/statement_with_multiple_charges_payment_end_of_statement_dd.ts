/* eslint-disable cypress/no-unnecessary-waiting */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { chargeAPI } from "../../../api_support/charge";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { statementsAPI } from "../../../api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import statementJSON from "cypress/resources/testdata/statement/statement_multiple_charges_payment_at_the_end_of_last_statement.json";
import TestFilters from "../../../../support/filter_tests.js";
import { CycleTypeConstants } from "cypress/api/api_support/constants";
import promisify from "cypress-promise";

//Test Scripts
// PP677-PP680 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements with
// origination fees - charges
// PP681-PP684 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements with  no
// origination fees - charge - monthly fees
// PP685-PP689 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements with
// origination fees - charge - monthly fees
// PP690-PP693 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements
// with no origination fee -charge - annual fees
// PP694-PP698 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements
// with origination fee -charge - annual fees
// PP699-PP703 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements
// with no origination fee - charge - monthly and annual fees
// PP704-PP709 Multiple charges through statements and payment at the end of
// last statement - 5 consecutive statements
// with origination fee - charge - monthly and annual fees

//5 consecutive statement validation with annual, monthly with origination fee, charges,
// and payments end of all statement
TestFilters(
  ["regression", "systemOfRecords", "statements", "payments", "charges", "originationFee", "annualFee", "monthlyFee"],
  () => {
    describe("Statements validation - multiple charges and payment to be done after end of statement", function () {
      let accountID;
      let productID;
      let product7DaysID;
      let product1MonthID;
      let customerID;

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
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Updating product id based on cycle interval
          if (data.cycle_interval.toLowerCase() === CycleTypeConstants.cycle_interval_7days) {
            productID = product7DaysID;
          } else {
            productID = product1MonthID;
          }

          //create account and assign to customer
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            first_cycle_interval: data.cycle_interval,
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          accountID = response.body.account_id;
        });

        it(`should be able to create a charge1 to for first cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge1_amount,
            data.stmt1_charge1_effective_dt
          );
        });

        it(`should be able to create a charge2 to for first cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge2_amount,
            data.stmt1_charge2_effective_dt
          );
        });

        it(`should be able to create a charge1 to for second cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt2_charge1_amount,
            data.stmt2_charge1_effective_dt
          );
        });

        it(`should be able to create a charge2 to for second cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt2_charge2_amount,
            data.stmt2_charge2_effective_dt
          );
        });

        it(`should be able to create a charge1 to for third cycle - ${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt3_charge1_amount,
            data.stmt3_charge1_effective_dt
          );
        });

        it(`should be able to create a charge2 to for third cycle - ${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt3_charge2_amount,
            data.stmt3_charge2_effective_dt
          );
        });

        it(`should be able to create a charge1 to for fourth cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt4_charge1_amount,
            data.stmt4_charge1_effective_dt
          );
        });

        it(`should be able to create a charge2 to for fourth cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt4_charge2_amount,
            data.stmt4_charge2_effective_dt
          );
        });

        it(`should be able to create a charge1 to for fifth cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt5_charge1_amount,
            data.stmt5_charge1_effective_dt
          );
        });

        it(`should be able to create a charge2 to for fifth cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt5_charge2_amount,
            data.stmt5_charge2_effective_dt
          );
        });

        //payment done in sixth statement
        it(`should be able to create a payment at end of 5 statements - '${data.tc_name}'`, () => {
          paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_dt);
        });

        //Calling roll time forward to get charge amount in statement and statement details get updated
        it(`should have to wait for account roll time forward till seventh cycle - '${data.tc_name}'`, async () => {
          //Roll time forward to generate statement lineItem
          const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval.toLowerCase(), 8);
          const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
          expect(response.status).to.eq(200);
        });

        it(`should have to validate statement balance for first cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
          >;
          const balanceSummary: StmtBalanceSummaryPick = {
            charges_principal_cents: parseInt(data.stmt1_charges_principal_cents),
            loans_principal_cents: parseInt(data.stmt1_loans_principal_cents),
            fees_balance_cents: parseInt(data.stmt1_fees_balance_cents),
            total_balance_cents: parseInt(data.stmt1_total_balance_cents),
          };
          statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 0, balanceSummary);
        });

        it(`should have to validate statement line items for first cycle - '${data.tc_name}'`, () => {
          //const statementDateForCharge = dateHelper.getStatementDate(effectiveDate,0)
          //Get statement list for account
          statementsAPI.getStatementByAccount(accountID).then((response) => {
            const chargeStatementID = statementValidator.getStatementIDByNumber(response, 0);
            //Get statement details for given statement id
            statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
              //Check principal charge line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              if (data.initial_principal_cents !== "0") {
                const chargeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "CHARGE",
                  original_amount_cents: parseInt(data.initial_principal_cents),
                };
                lineItemValidator.validateStatementLineItem(response, chargeLineItem);
              }
              //Check origination line item is displayed in the statement
              if (data.origination_fee_cents !== "0") {
                const originationFeeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "ORIG_FEE",
                  original_amount_cents: parseInt(data.origination_fee_cents),
                };
                lineItemValidator.validateStatementLineItem(response, originationFeeLineItem);
              }
              //Check monthly fee item is displayed in the statement
              if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== CycleTypeConstants.cycle_interval_7days) {
                const monthlyFeeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "MONTH_FEE",
                  original_amount_cents: parseInt(data.monthly_fee_cents),
                };
                lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
              }
            });
          });
        });

        it(`should have to validate statement balance for second cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
          >;
          const balanceSummary: StmtBalanceSummaryPick = {
            charges_principal_cents: parseInt(data.stmt2_charges_principal_cents),
            loans_principal_cents: parseInt(data.stmt2_loans_principal_cents),
            fees_balance_cents: parseInt(data.stmt2_fees_balance_cents),
            total_balance_cents: parseInt(data.stmt2_total_balance_cents),
          };
          statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 1, balanceSummary);
        });

        it(`should have to validate statement line items for second cycle - '${data.tc_name}'`, () => {
          //Get statement list for account
          const chargeAmount1 = data.stmt2_charge1_amount;
          const chargeAmount2 = data.stmt2_charge2_amount;
          const chargeDate1 = data.stmt2_charge1_effective_dt.slice(0, 10);
          const chargeDate2 = data.stmt2_charge2_effective_dt.slice(0, 10);
          validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 1);
        });

        it(`should have to validate statement balance for third cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
          >;
          const balanceSummary: StmtBalanceSummaryPick = {
            charges_principal_cents: parseInt(data.stmt3_charges_principal_cents),
            loans_principal_cents: parseInt(data.stmt3_loans_principal_cents),
            fees_balance_cents: parseInt(data.stmt3_fees_balance_cents),
            total_balance_cents: parseInt(data.stmt3_total_balance_cents),
          };
          statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 2, balanceSummary);
        });

        it(`should have to validate statement line items for third cycle - '${data.tc_name}'`, () => {
          //Get statement list for account
          const chargeAmount1 = data.stmt3_charge1_amount;
          const chargeAmount2 = data.stmt3_charge2_amount;
          const chargeDate1 = data.stmt3_charge1_effective_dt.slice(0, 10);
          const chargeDate2 = data.stmt3_charge2_effective_dt.slice(0, 10);
          validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 2);

          //validate year_fee line item in statement
          //Get statement list for account
          statementsAPI.getStatementByAccount(accountID).then((response) => {
            const chargeStatementID = statementValidator.getStatementIDByNumber(response, 2);
            //Get statement details for given statement id
            statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
              //Check year fee item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              if (data.annual_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== CycleTypeConstants.cycle_interval_7days) {
                const yearLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "YEAR_FEE",
                  original_amount_cents: parseInt(data.annual_fee_cents),
                };
                lineItemValidator.validateStatementLineItem(response, yearLineItem);
              }
            });
          });
        });

        it(`should have to validate statement balance for fourth cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
          >;
          const balanceSummary: StmtBalanceSummaryPick = {
            charges_principal_cents: parseInt(data.stmt4_charges_principal_cents),
            loans_principal_cents: parseInt(data.stmt4_loans_principal_cents),
            fees_balance_cents: parseInt(data.stmt4_fees_balance_cents),
            total_balance_cents: parseInt(data.stmt4_total_balance_cents),
          };
          statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 3, balanceSummary);
        });

        it(`should have to validate statement line items for fourth cycle - '${data.tc_name}'`, () => {
          //Get statement list for account
          const chargeAmount1 = data.stmt4_charge1_amount;
          const chargeAmount2 = data.stmt4_charge2_amount;
          const chargeDate1 = data.stmt4_charge1_effective_dt.slice(0, 10);
          const chargeDate2 = data.stmt4_charge2_effective_dt.slice(0, 10);
          validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 3);
        });

        it(`should have to validate statement balance for fifth cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
          >;
          const balanceSummary: StmtBalanceSummaryPick = {
            charges_principal_cents: parseInt(data.stmt5_charges_principal_cents),
            loans_principal_cents: parseInt(data.stmt5_loans_principal_cents),
            fees_balance_cents: parseInt(data.stmt5_fees_balance_cents),
            total_balance_cents: parseInt(data.stmt5_total_balance_cents),
          };
          statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 4, balanceSummary);
        });

        it(`should have to validate statement line items for fifth cycle - '${data.tc_name}'`, () => {
          //Get statement list for account
          const chargeAmount1 = data.stmt5_charge1_amount;
          const chargeAmount2 = data.stmt5_charge2_amount;
          const chargeDate1 = data.stmt5_charge1_effective_dt.slice(0, 10);
          const chargeDate2 = data.stmt5_charge2_effective_dt.slice(0, 10);
          validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 4);
        });


        // Validate the statement summary after the payment is done at end of 5
        // consecutive statements
        it(`should have to validate statement balance for sixth cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
          >;
          const balanceSummary: StmtBalanceSummaryPick = {
            charges_principal_cents: parseInt(data.stmt6_charges_principal_cents),
            loans_principal_cents: parseInt(data.stmt6_loans_principal_cents),
            fees_balance_cents: parseInt(data.stmt6_fees_balance_cents),
            total_balance_cents: parseInt(data.stmt6_total_balance_cents),
          };
          statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 5, balanceSummary);
        });

        //check payment line item in fifth statement
        it(`should have to validate payment line item in statement for sixth cycle - '${data.tc_name}'`, () => {
          //Get statement list for account
          statementsAPI.getStatementByAccount(accountID).then((response) => {
            const chargeStatementID = statementValidator.getStatementIDByNumber(response, 5);
            //Get statement details for given statement id
            statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const paymentLineItem: StmtLineItem = {
                status: "VALID",
                type: "PAYMENT",
                original_amount_cents: parseInt(data.payment_amount) * -1,
              };
              lineItemValidator.validateStatementLineItem(response, paymentLineItem);
            });
          });
        });
      });

      //Function specific to this test case
      function validateStatementLineItem(
        data,
        charge1Amount,
        charge1Date,
        charge2Amount,
        charge2Date,
        statementIDNumber
      ) {
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, statementIDNumber);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check monthly fee item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== CycleTypeConstants.cycle_interval_7days) {
              const monthlyLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyLineItem);
            }
            //check charges line item displayed in the statement
            type StmtLineItemForCharge = Pick<LineItem, "status" | "type" | "original_amount_cents" | "effective_at">;
            const charge1LineItem: StmtLineItemForCharge = {
              status: "VALID",
              type: "CHARGE",
              original_amount_cents: parseInt(charge1Amount),
              effective_at: charge1Date,
            };
            lineItemValidator.validateStatementLineItemWithEffectiveDate(response, charge1LineItem);

            //check charge line item displayed in the statement
            const charge2LineItem: StmtLineItemForCharge = {
              status: "VALID",
              type: "CHARGE",
              original_amount_cents: parseInt(charge2Amount),
              effective_at: charge2Date,
            };
            lineItemValidator.validateStatementLineItemWithEffectiveDate(response, charge2LineItem);
          });
        });
      }

      type CreateAccount = Pick<
        AccountPayload,
        | "product_id"
        | "customer_id"
        | "effective_at"
        | "first_cycle_interval"
        | "origination_fee_cents"
        | "late_fee_cents"
        | "monthly_fee_cents"
        | "annual_fee_cents"
        | "cycle_due_interval_del"
        | "initial_principal_cents"
      >;
    });
  }
);
