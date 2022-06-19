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
import { lineItemsAPI } from "cypress/api/api_support/lineItems";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import { chargeAPI } from "cypress/api/api_support/charge";
import statementJSON from "cypress/resources/testdata/statement/statement_charges_reversal.json";
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

//Statement validation with annual, monthly with origination fee, charges,
// charge reversal and payments end of all statement
TestFilters(
  ["regression", "systemOfRecords", "statements", "payments", "charges", "chargeReversal", "annualFee", "monthlyFee"],
  () => {
    describe("Statement validation - make charges, charge reversal and payments", function () {
      let accountID;
      let productID;
      let customerID;
      let response;

      before(() => {
        authAPI.getDefaultUserAccessToken();

        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
      });

      statementJSON.forEach((data) => {
        it(`should have create product - '${data.tc_name}'`, async () => {
          //Create a product - using  credit product
          const productResponse = await promisify(
            productAPI.createProductWithCycleInterval(
              "product_credit.json",
              data.cycle_interval,
              data.cycle_due_interval
            )
          );
          productID = productResponse.body.product_id;
        });

        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Update product, customer and origination fee in account JSON file

          //create account and assign to customer
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
          accountID = response.body.account_id;
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

        //There is no charge reversal api. We are use debit offset for charge reversal
        it(`should be able to charge reversal - '${data.tc_name}'`, async () => {
          lineItemsAPI.debitOffsetForAccount(
            accountID,
            "debit_offset.json",
            data.stmt2_charge_reversal_cents,
            data.stmt2_charge_reversal_effective_dt
          );
        });

        //payment done in second cycle statement
        it(`should be able to create a payment - '${data.tc_name}'`, () => {
          paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_dt);
        });

        //Calling roll time forward to get charge amount in statement and statement details get updated
        it(`should have to wait for account roll time forward till third cycle - '${data.tc_name}'`, async () => {
          //Roll time forward to generate statement lineItem
          const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 4);
          const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
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

        it(`should have to validate statement line items for first cycle - '${data.tc_name}'`, async () => {
          //const statementDateForCharge = dateHelper.getStatementDate(effectiveDate,0)
          //Get statement list for account
          const responseAccStatement = await promisify(statementsAPI.getStatementByAccount(accountID));
          const chargeStatementID = statementValidator.getStatementIDByNumber(responseAccStatement, 0);
          //Get statement details for given statement id
          const responseStatement = await promisify(statementsAPI.getStatementByStmtId(accountID, chargeStatementID));
          //Check principal charge line item is displayed in the statement
          type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          if (data.initial_principal_cents !== "0") {
            const chargeLineItem: StmtLineItem = {
              status: "VALID",
              type: "CHARGE",
              original_amount_cents: parseInt(data.initial_principal_cents),
            };
            lineItemValidator.validateStatementLineItem(responseStatement, chargeLineItem);
          }
          //Check origination line item is displayed in the statement
          if (data.origination_fee_cents !== "0") {
            const originationFeeLineItem: StmtLineItem = {
              status: "VALID",
              type: "ORIG_FEE",
              original_amount_cents: parseInt(data.origination_fee_cents),
            };
            lineItemValidator.validateStatementLineItem(responseStatement, originationFeeLineItem);
          }
          //Check monthly fee item is displayed in the statement
          if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() === CycleTypeConstants.cycle_interval_1month) {
            const monthlyFeeLineItem: StmtLineItem = {
              status: "VALID",
              type: "MONTH_FEE",
              original_amount_cents: parseInt(data.monthly_fee_cents),
            };
            lineItemValidator.validateStatementLineItem(responseStatement, monthlyFeeLineItem);
          }

          if (data.annual_fee_cents !== "0" && data.cycle_interval.toLowerCase() === CycleTypeConstants.cycle_interval_1month) {
            const annualFeeLineItem: StmtLineItem = {
              status: "VALID",
              type: "YEAR_FEE",
              original_amount_cents: parseInt(data.annual_fee_cents),
            };
            lineItemValidator.validateStatementLineItem(responseStatement, annualFeeLineItem);
          }
        });


        // Validate the statement summary after charge reversal and payment done at
        // end of second statement
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

        it(`should have to validate statement line items for second cycle - '${data.tc_name}'`, async () => {
          //Get statement list for account
          //Get statement list for account
          const responseAccStatement = await promisify(statementsAPI.getStatementByAccount(accountID));
          const chargeStatementID = statementValidator.getStatementIDByNumber(responseAccStatement, 1);

          //Get statement details for given statement id
          const responseStatement = await promisify(statementsAPI.getStatementByStmtId(accountID, chargeStatementID));
          validateStatementLineItem(data, responseStatement);
        });

        //Function specific to this test case
        function validateStatementLineItem(data, responseStatement) {
          //Check monthly fee item is displayed in the statement
          type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          //check charges line item displayed in the statement
          if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() === "1 month") {
            const monthlyLineItem: StmtLineItem = {
              status: "VALID",
              type: "MONTH_FEE",
              original_amount_cents: parseInt(data.monthly_fee_cents),
            };
            lineItemValidator.validateStatementLineItem(responseStatement, monthlyLineItem);
          }
          //check charges line item displayed in the statement
          const chargeLineItem: StmtLineItem = {
            status: "VALID",
            type: "CHARGE",
            original_amount_cents: parseInt(data.stmt2_charge_amount),
          };
          lineItemValidator.validateStatementLineItem(responseStatement, chargeLineItem);

          //check debit offset line item displayed in the statement
          const debitOffSetLineItem: StmtLineItem = {
            status: "VALID",
            type: "DEBIT_OFFSET",
            original_amount_cents: parseInt(data.stmt2_charge_reversal_cents) * -1,
          };
          lineItemValidator.validateStatementLineItem(responseStatement, debitOffSetLineItem);

          //check payment line item displayed in the statement
          const paymentSetLineItem: StmtLineItem = {
            status: "VALID",
            type: "PAYMENT",
            original_amount_cents: parseInt(data.payment_amount) * -1,
          };
          lineItemValidator.validateStatementLineItem(responseStatement, paymentSetLineItem);
        }
      });
    });
  }
);

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
  | "initial_principal_cents"
>;
