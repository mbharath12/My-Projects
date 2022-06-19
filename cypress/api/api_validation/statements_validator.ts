import { Statements } from "../api_support/statements";
import { LineItem, LineItemValidator } from "./line_item_validator";

export class StatementValidator {
  //get statement id from statement line item for given account.
  //this statement id will be used to get the statement details
  //ex: const statementID = statementValidator.getStatementID(response,"2021-08-31")
  getStatementID(responseJSON, cycle_inclusive_start) {
    const len = responseJSON.body.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = responseJSON.body[counter];
      const cycleStart = curItem.cycle_summary.cycle_inclusive_start.toString();
      if (cycleStart.includes(cycle_inclusive_start)) {
        return curItem.statement_id;
      }
    }
    throw new Error("statement not found");
  }

  //get statement id from statement line item for given account.
  //this statement id will be used to get the statement details
  //ex: const statementID = statementValidator.getStatementID(response,"2021-08-31")
  getStatementIDByNumber(responseJSON, statementNumber) {
    responseJSON.body[statementNumber].statement_id;
    const len = responseJSON.body.length;
    if (len == 0) throw new Error("statement not found");
    return responseJSON.body[statementNumber].statement_id;
  }

  //Validate statement balance summary for given statement number
  //ex: validateStatementBalanceForGivenStatementNumber("5456",1,expBalanceSummary)
  //validates balance summary for second cycle statement
  validateStatementBalanceForGivenStatementNumber(accountID, statementNumber, expBalanceSummary) {
    const statement = new Statements();
    statement.getStatementByAccount(accountID).then((response) => {
      const chargeStatementID = this.getStatementIDByNumber(response, statementNumber);
      statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
        //validate given statement balance summary
        this.validateStatementBalanceSummary(response, expBalanceSummary);
      });
    });
  }

  //Validate statement balance summary for statement response
  //ex: validateStatementBalanceSummary(response,expBalanceSummary)
  validateStatementBalanceSummary(response, expBalanceSummary) {
    const resBalanceSummary = response.body.balance_summary;
    expect(resBalanceSummary.loans_principal_cents, "verify loan principal").to.eq(
      expBalanceSummary.loans_principal_cents
    );
    expect(resBalanceSummary.fees_balance_cents, "verify fee balance").to.eq(expBalanceSummary.fees_balance_cents);
    expect(resBalanceSummary.total_balance_cents, "verify total balance").to.eq(expBalanceSummary.total_balance_cents);
    expect(resBalanceSummary.charges_principal_cents, "verify charge principal").to.eq(
      expBalanceSummary.charges_principal_cents
    );
  }
  //Validate statement balance summary for statement response
  //ex: validateStatementBalanceSummarybyID(response,prodType,expBalanceSummary)

  validateStatementBalanceSummarybyID(response, prodType, expBalanceSummary) {
    if (prodType.toLowerCase() === "installment") {
      //In Installment Product, AM schedule should come into consideration
      expect(response.body.balance_summary.am_interest_balance_cents, "am Interest Balance is displayed").to.eq(
        parseInt(expBalanceSummary.am_interest_balance_cents)
      );
      if (expBalanceSummary.loans_principal_cents) {
        expect(response.body.balance_summary.loans_principal_cents, "loans_principal_cents is displayed").to.eq(
          parseInt(expBalanceSummary.loans_principal_cents)
        );
      }
    } else {
      //For Credit ,Charge cards ,No AM comes into picture
      expect(response.body.balance_summary.interest_balance_cents, "Interest Balance is displayed").to.eq(
        parseInt(expBalanceSummary.interest_balance_cents)
      );
      expect(response.body.balance_summary.charges_principal_cents, "charge principal is displayed").to.eq(
        parseInt(expBalanceSummary.charges_principal_cents)
      );
    }
    expect(response.body.balance_summary.total_balance_cents, "Total Balance is displayed").to.eq(
      parseInt(expBalanceSummary.total_balance_cents)
    );
    expect(response.body.balance_summary.fees_balance_cents, "Fees Balance  is displayed").to.eq(
      parseInt(expBalanceSummary.fees_balance_cents)
    );
    if (expBalanceSummary.principal_balance_cents) {
      expect(response.body.balance_summary.principal_balance_cents, "Principal Balance is displayed").to.eq(
        parseInt(expBalanceSummary.principal_balance_cents)
      );
    }
    if (expBalanceSummary.deferred_interest_balance_cents) {
      expect(response.body.balance_summary.deferred_interest_balance_cents, "Deferred Balance is displayed").to.eq(
        parseInt(expBalanceSummary.deferred_interest_balance_cents)
      );
    }
  }
  // Function for statement validation for multiple charges with migration mode.
  validateStatementLineItem(
    data,
    charge1Amount,
    charge1Date,
    charge2Amount,
    charge2Date,
    statementIDNumber,
    accountID
  ) {
    //Get statement list for account
    const statement = new Statements();
    const lineItemValidator = new LineItemValidator();
    statement.getStatementByAccount(accountID).then((response) => {
      const chargeStatementID = statementValidator.getStatementIDByNumber(response, statementIDNumber);
      //Get statement details for given statement id
      statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
        //Check monthly fee item is displayed in the statement
        type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        if (data.monthly_fee_cents != "0" && data.cycle_interval.toLowerCase() != "7 days") {
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
  //Validate account statement cycle interval start date, end date, min pay due at
  //ex: validateStatementCycleInterval("88199", "3427648", "2021-11-01T02:18:27-08:00", "2021-11-10T02:18:27-08:00")
  validateStatementCycleInterval(expStatementCycleDts) {
    const statement = new Statements();
    statement.getStatementByAccount(expStatementCycleDts.account_id).then((response) => {
      const statementID = this.getStatementIDByNumber(response, expStatementCycleDts.statement_number);
      statement.getStatementByStmtId(expStatementCycleDts.account_id, statementID).then((response) => {
        if ("min_pay_due_at" in expStatementCycleDts) {
          expect(response.body.min_pay_due.min_pay_due_at, "verify statement min_pay_due_at").to.include(
            expStatementCycleDts.min_pay_due_at
          );
        }
        if ("cycle_inclusive_start" in expStatementCycleDts) {
          expect(
            response.body.cycle_summary.cycle_inclusive_start,
            "verify statement cycle_inclusive_start"
          ).to.include(expStatementCycleDts.cycle_inclusive_start);
        }
        if ("cycle_exclusive_end" in expStatementCycleDts) {
          expect(response.body.cycle_summary.cycle_exclusive_end, "verify statement cycle_exclusive_end").to.include(
            expStatementCycleDts.cycle_exclusive_end
          );
        }
      });
    });
  }
}

export interface StatementBalanceSummary {
  loans_principal_cents?: number;
  fees_balance_cents?: number;
  total_balance_cents?: number;
  charges_principal_cents?: number;
  am_interest_balance_cents?: number;
  interest_balance_cents?: number;
  min_pay_due_at?: string;
  cycle_inclusive_start?: string;
  cycle_exclusive_end?: string;
  account_id?: number;
  statement_number?: number;
  principal_balance_cents?: number;
  deferred_interest_balance_cents?: number;
}
export const statementValidator = new StatementValidator();
