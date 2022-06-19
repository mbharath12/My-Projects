/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { statementsAPI } from "cypress/api/api_support/statements";
import { StatementBalanceSummary, statementValidator } from "cypress/api/api_validation/statements_validator";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import { chargeAPI } from "cypress/api/api_support/charge";
import statementJSON from "cypress/resources/testdata/statement/statement_make_charges_payment_at_end_of_statement.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "cypress/api/api_support/constants";

//Test Scripts
// PP636-PP639 Make Charges - Payment at the end of last statement - 5 consecutive statements with
// origination fees - charge
// PP640-PP643 Make Charges - Payment at the end of last statement - 5 consecutive statements with  no
// origination fees - charge - monthly fees
// PP644-PP648 Make Charges - Payment at the end of last statement - 5 consecutive statements with
// origination fees - charge - monthly fees
// PP649-PP652 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with no origination fee -charge - annual fees
// PP653-PP657 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with origination fee -charge - annual fees
// PP658-PP662 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with no origination fee -charge - monthly and annual fees
// PP663-PP668 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with origination fee -charge - monthly and annual fees

//5 consecutive statement validation with annual, monthly with origination fee, charges,
// and payments end of all statement
TestFilters(
  ["regression", "systemOfRecords", "statements", "payments", "charges", "originationFee", "annualFee", "monthlyFee"],
  () => {
    describe("5 consecutive statements - make charges every cycle and payment to be done after end of statement", function () {
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

          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            first_cycle_interval: data.cycle_interval,
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

        it(`should be able to create a charge to for first cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge_amount,
            data.stmt1_charge_effective_dt
          );
        });

        it(`should be able to create a charge to for second cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt2_charge_amount,
            data.stmt2_charge_effective_dt
          );
        });

        it(`should be able to create a charge to for third cycle - ${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt3_charge_amount,
            data.stmt3_charge_effective_dt
          );
        });

        it(`should be able to create a charge to for fourth cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt4_charge_amount,
            data.stmt4_charge_effective_dt
          );
        });

        it(`should be able to create a charge to for fifth cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt5_charge_amount,
            data.stmt5_charge_effective_dt
          );
        });

        //payment done in sixth statement
        it(`should be able to create a payment at end of 5 statements - '${data.tc_name}'`, () => {
          paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_dt);
        });

        //Calling roll time forward to get charge amount in statement and statement details get updated
        it(`should have to wait for account roll time forward till second cycle - '${data.tc_name}'`, async () => {
          //Roll time forward to generate statement lineItem
          const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 7);
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
              if (
                data.monthly_fee_cents !== "0" &&
                data.cycle_interval.toLowerCase() != CycleTypeConstants.cycle_interval_7days
              ) {
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
          validateStatementLineItem(data, data.stmt2_charge_amount, 1, false);
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
          validateStatementLineItem(data, data.stmt3_charge_amount, 2, true);
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
          validateStatementLineItem(data, data.stmt4_charge_amount, 3, false);
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
          validateStatementLineItem(data, data.stmt5_charge_amount, 4, false);
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
      function validateStatementLineItem(data, amount, statementIDNumber, checkAnnualFee) {
        //const statementDateForCharge = dateHelper.getStatementDate(effectiveDate,0)
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, statementIDNumber);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check monthly fee item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //check charges line item displayed in the statement
            if (checkAnnualFee === true && data.annual_fee_cents !== "0") {
              const annualFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "YEAR_FEE",
                original_amount_cents: parseInt(data.annual_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, annualFeeLineItem);
            }
            if (
              data.monthly_fee_cents !== "0" &&
              data.cycle_interval.toLowerCase() != CycleTypeConstants.cycle_interval_7days
            ) {
              const monthlyLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyLineItem);
            }
            //check charges line item displayed in the statement
            const chargeLineItem: StmtLineItem = {
              status: "VALID",
              type: "CHARGE",
              original_amount_cents: parseInt(amount),
            };
            lineItemValidator.validateStatementLineItem(response, chargeLineItem);
          });
        });
      }
    });

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "first_cycle_interval"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "origination_fee_cents"
      | "late_fee_cents"
      | "monthly_fee_cents"
      | "annual_fee_cents"
      | "payment_reversal_fee_cents"
      | "promo_impl_interest_rate_percent"
    >;
  }
);
