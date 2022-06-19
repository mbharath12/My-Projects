/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { chargeAPI } from "../../../api_support/charge";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { paymentAPI } from "../../../api_support/payment";
import { statementsAPI } from "cypress/api/api_support/statements";
import { StatementBalanceSummary, statementValidator } from "cypress/api/api_validation/statements_validator";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import statementJSON from "cypress/resources/testdata/statement/consecutive_statement_verification.json";
import { CycleTypeConstants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
// PP513-PP519 Payment at first and fourth cycle of statement - 5 consecutive statements with
// origination fees - charge
// PP520-PP524 Payment at first and fourth cycle of statement - 5 consecutive statements with  no
// origination fees - charge - monthly fees
// PP525-PP530 Payment at first and fourth cycle of statement - 5 consecutive statements with
// origination fees - charge - monthly fees
// PP531-PP535 Payment at first and fourth cycle of statement - 5 consecutive statements
// with no origination fee -charge - annual fees
// PP536-PP541 Payment at first and fourth cycle of statement - 5 consecutive statements
// with origination fee - charge - annual fees
// PP542-PP546 Payment at first and fourth cycle of statement - 5 consecutive statements
// with no origination fee -charge - monthly and annual fees
// PP547-PP552 Payment at first and fourth cycle of statement - 5 consecutive statements
// with origination fee - charge - monthly and annual fees
//5 consecutive statement validation with annual, monthly with origination fee, charges,
// and payments at first and fourth cycle of statement

TestFilters(["regression", "systemOfRecords", "statements", "payments"], () => {
  describe("5 consecutive statements - verify origination fee,charges,annual,monthly with payment ", function () {
    let accountID;
    let productID;
    let product7DaysID;
    let product1MonthID;
    let customerID;

    before(() => {
      authAPI.getDefaultUserAccessToken();

      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval with 7 days cycle in creditProduct json file
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
      it(`should have create account and assign customer - '${data.tc_name}'`, async() => {
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
          first_cycle_interval:data.cycle_interval
        };
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        accountID=response.body.account_id;
      });


      if (data.stmt1_charge_amount !== "0") {
        it(`should be able to create a charge to for first cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge_amount,
            data.stmt1_charge_effective_dt
          );
        });
      }

      if (data.payment_amount !== "0") {
        it(`should be able to create a payment at first cycle interval - '${data.tc_name}'`, () => {
          paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_dt);
        });
      }

      if (data.stmt3_charge_amount !== "0") {
        it(`should be able to create a charge to for third cycle - '${data.tc_name}'`, () => {
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt3_charge_amount,
            data.stmt3_charge_effective_dt
          );
        });
      }

      if (data.stmt4_payment_amount !== "0") {
        it(`should be able to create a payment at 4th cycle of statement - '${data.tc_name}'`, () => {
          paymentAPI.paymentForAccount(
            accountID,
            "payment.json",
            data.stmt4_payment_amount,
            data.stmt4_payment_effective_dt
          );
        });
      }

      //Calling roll time forward to get charge amount in statement and statement details get updated
      it(`should have to wait for account roll time forward till sixth cycle - '${data.tc_name}'`, () => {
        //Roll time forward to generate statement lineItem
        const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval.toLowerCase(),6)
        const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
        rollTimeAPI.rollAccountForward(accountID, rollForwardDate).then((response) => {
          expect(response.status).to.eq(200);
        });
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
            if (data.initial_principal_cents != "0") {
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
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }

            if (data.payment_amount != "0") {
              const paymentLineItem: StmtLineItem = {
                status: "VALID",
                type: "PAYMENT",
                original_amount_cents: parseInt(data.payment_amount) * -1,
              };
              lineItemValidator.validateStatementLineItem(response, paymentLineItem);
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
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 1);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }

            //Check monthly fee item is displayed in the statement
            if (
              data.annual_fee_cents !== "0" &&
              data.cycle_interval.toLowerCase() !== CycleTypeConstants.cycle_interval_7days
            ) {
              //Check monthly fee line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const annualFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "YEAR_FEE",
                original_amount_cents: parseInt(data.annual_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, annualFeeLineItem);
            }
          });
        });
      });

      it(`should have to validate statement balance for third cycle - '${data.tc_name}'`, () => {
        const balanceSummaryJSON: JSON = <JSON>(<unknown>{
          charges_principal_cents: parseInt(data.stmt3_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt3_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt3_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt3_total_balance_cents),
        });
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 2, balanceSummaryJSON);
      });

      it(`should have to validate statement line items for third cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 2);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }
            if (data.stmt3_charge_amount !== "0") {
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "CHARGE",
                original_amount_cents: parseInt(data.stmt3_charge_amount),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);
            }
          });
        });
      });


      it(`should have to validate statement balance for fourth cycle - '${data.tc_name}'`, () => {
        const balanceSummaryJSON: JSON = <JSON>(<unknown>{
          charges_principal_cents: parseInt(data.stmt4_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt4_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt4_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt4_total_balance_cents),
        });
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 3, balanceSummaryJSON);
      });

      it(`should have to validate statement line items for fourth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 3);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents != "0" && data.cycle_interval.toLowerCase() != "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }
            if (data.stmt4_payment_amount !== "0") {
              const paymentLineItem: StmtLineItem = {
                status: "VALID",
                type: "PAYMENT",
                original_amount_cents: parseInt(data.stmt4_payment_amount) * -1,
              };
              lineItemValidator.validateStatementLineItem(response, paymentLineItem);
            }
          });
        });
      });


      it(`should have to validate statement balance for fifth cycle - '${data.tc_name}'`, () => {
        const balanceSummaryJSON: JSON = <JSON>(<unknown>{
          charges_principal_cents: parseInt(data.stmt5_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt5_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt5_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt5_total_balance_cents),
        });
        cy.wait(1000);
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 4, balanceSummaryJSON);
      });

      it(`should have to validate statement line items for fifth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statementsAPI.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 3);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (
              data.monthly_fee_cents !== "0" &&
              data.cycle_interval.toLowerCase() !== CycleTypeConstants.cycle_interval_7days
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
    });
  });
});

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
