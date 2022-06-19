import { creditReportingAPI } from "../api_support/credit_reporting";
export class CreditReportingValidator {
  //get creditReporting id from creditReporting list for given account.
  //this creditReporting id will be used to get the creditReporting details
  //ex: const credit_report_id = CreditReportingValidator.getCreditReportingByNumber(17564,1)
  getCreditReportIDByNumber(accountID, creditReportCycleNumber) {
    return creditReportingAPI.getAllCreditReports(accountID).then((response) => {
    const len = response.body.results.length;
    if (len === 0) throw new Error("credit report not found");
    return response.body.results[creditReportCycleNumber].credit_report_id;
  });
}

//get last creditReporting id from creditReporting list for given account.
getLastCreditReportID(accountID) {
  return creditReportingAPI.getAllCreditReports(accountID).then((response) => {
  const len = response.body.results.length;
  if (len === 0) throw new Error("credit report not found");
  return response.body.results[len-1].credit_report_id;
});
}

  //Validate credit reporting list is same as statements
  //ex: validateCreditReportCycleIntervalsWithStatements(creditReportResponse,statementResponse)
  validateCreditReportCycleIntervalsWithStatements(creditReportJSON, statementJSON) {
    const creditReportLen = creditReportJSON.body.results.length;
    const statementLen = statementJSON.body.length;
    if (creditReportLen !== statementLen) throw new Error("credit reporting list is not matches with statements list");
    for (let counter = 0; counter < statementLen; counter++) {
      const curCreditReportItem = creditReportJSON.body.results[counter];
      const curStatementItem = statementJSON.body[counter];
      expect(
        curStatementItem.cycle_summary.cycle_exclusive_end,
        "Verify cycle_exclusive_end date is same in both credit report and statement "
      ).to.includes(curCreditReportItem.cycle_summary.cycle_exclusive_end.slice(0,10));
      expect(
        curStatementItem.cycle_summary.cycle_inclusive_start,
        "Verify cycle_inclusive_start date is same in both  credit report and statement "
      ).to.includes(curCreditReportItem.cycle_summary.cycle_inclusive_start.slice(0,10));
      expect(curCreditReportItem.credit_report_id, "Verify credit_report_id is not null").to.not.null;
    }
  }

  //Validate specific credit reporting metro2 details for account
  //ex: validateCreditReportMetro2Details(creditReportResponse,expCreditReportDetails)
  validateCreditReportMetro2Details(response, expCreditReportDetails) {
    //verify specific metro2 credit report details
    expect(response.body.date_opened, "Verify metro2 credit report opened date for account").to.includes(
      expCreditReportDetails.account_effective_at
    );
    expect(response.body.activity_date, "Verify metro2 credit report activity_date").to.includes(
      expCreditReportDetails.account_effective_at
    );
    expect(response.body.highest_credit, "Verify metro2 credit report highest_credit").to.eq(
      parseInt(expCreditReportDetails.initial_principal_cents)
    );
    expect(response.body.current_balance, "Verify metro2 credit report current_balance").to.eq(
      parseInt(expCreditReportDetails.credit_balance)
    );
    expect(response.body.account_status, "Verify metro2 credit report account status").to.eq(
      expCreditReportDetails.account_status
    );
    expect(response.body.account_type, "Verify metro2 credit report account_type").to.eq(expCreditReportDetails.account_type);
    expect(response.body.consumer_account_number, "Verify metro2 credit report consumer_account_number").to.eq(
      expCreditReportDetails.account_id
    );
  }

   validateMetro2CreditReportDetails(creditReportResponse, creditReportDetails, creditBalance, accountID) {
    const metro2CardDetails: creditReportFieldDetails = {
      account_effective_at: creditReportDetails.account_effective_at.slice(0, 10),
      credit_balance: parseInt(creditBalance),
      account_status: creditReportDetails.account_status,
      account_type: creditReportDetails.account_type,
      account_id: accountID,
      initial_principal_cents: parseInt(creditReportDetails.initial_principle_in_cents),
    };
    creditReportValidator.validateCreditReportMetro2Details(creditReportResponse, metro2CardDetails);
  }

  //Validate credit report cycle interval start date and end date
  //ex: validateCreditReportCycleInterval("88199", "1", "2021-11-01T02:18:27-08:00", "2021-11-10T02:18:27-08:00")
  validateCreditReportCycleInterval(
    accountID: String,
    creditReportCycleNumber,
    creditReportInclusiveDt: String,
    creditReportEndDt: String
  ) {
    creditReportingAPI.getAllCreditReports(accountID).then((response) => {
      const creditReportLen = response.body.results.length;
      if (creditReportLen === 0) throw new Error("No credit report found for account");
      const curCreditReportItem = response.body.results[creditReportCycleNumber];
      expect(
        curCreditReportItem.cycle_summary.cycle_inclusive_start,
        "Verify credit report cycle_inclusive_start"
      ).to.include(creditReportInclusiveDt);
      expect(
        curCreditReportItem.cycle_summary.cycle_exclusive_end,
        "Verify credit report cycle_exclusive_end"
      ).to.include(creditReportEndDt);
    });
  }
}

export interface creditReportFieldDetails {
  account_effective_at?: string;
  credit_balance?: number;
  account_status?: string;
  account_type?: string;
  account_id?: number;
  initial_principal_cents?: number;
}
export const creditReportValidator = new CreditReportingValidator();
