export class DateHelper {
  //Add or reduce days and hours from current date.
  //Used to update effective at dates while creating an account, payment etc
  //ex: account_effective_dt = addDays(-3,2) reduced three days and adds two hours
  addDays(days, hrs) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    currentDate.setHours(currentDate.getHours() + hrs);
    //return current_dt.toLocaleString('en-US', {timeZone: 'PST'})
    return currentDate.toISOString().slice(0, 19) + "+00:00";
  }

  //Add or reduce days from given date.
  // ex: effectiveDtt = moveDate("2021-02-20T09:11:28+00:00",2) adds two days
  // fom given date
  moveDate(effective_dt, daysToMove) {
    const changeDate = new Date(effective_dt);
    changeDate.setDate(changeDate.getDate() + daysToMove);
    return changeDate.toISOString().slice(0, 19) + "+00:00";
  }

  //Generating annual fee cycle_inclusive_start to read from account statement
  //ex: const annualFeeStatementDate = dateHelper.getAnnualFeeStatementDate("2020-09-07T06:05:27-05:00")
  getAnnualFeeStatementDate(accountEffectiveAt) {
    // "cycle_inclusive_start":"2020-09-07T06:05:27-05:00"
    const accountEffectiveDate = new Date(accountEffectiveAt);
    accountEffectiveDate.setDate(accountEffectiveDate.getDate() + 1);
    const day = accountEffectiveDate.getDate();
    const fullDay = day <= 9 ? "0" + day.toString() : day.toString();
    const month = 12; //december
    const year = accountEffectiveDate.getFullYear();
    return year + "-" + month + "-" + fullDay;
  }

  // get date for roll date forward api from current date add given number of
  //Prepare monthly effective date for given account effective date
  // Will use to to get the statement
  //ex: const monthlyCycleStartDate =  getMonthlyFeeStatementDate("2021-08-31T02:18:27-05:00")
  getMonthlyFeeStatementDate(accountEffectiveAt) {
    // "cycle_inclusive_start":"2021-08-31T02:18:27-05:00"
    const changeDate = new Date(accountEffectiveAt);
    const year = changeDate.getFullYear();
    let month = changeDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    month = changeDate.getMonth() + 1;
    const fullMonth = month <= 9 ? "0" + month.toString() : month.toString();
    const endOfMonth = year + "-" + fullMonth + "-" + lastDay;
    return endOfMonth;
  }

  //Prepare monthly effective date for given account effective date
  // Will use to to get the statement
  //ex: const monthlyCycleStartDate =  getStatementDate("2021-08-31T02:18:27-05:00",15)
  getStatementDate(effectiveAt, daysToMove) {
    // "cycle_inclusive_start":"2021-08-31T02:18:27-05:00"
    const statementStartDate = this.moveDate(effectiveAt, daysToMove);
    return statementStartDate.slice(0, 10);
  }
  //get statement date for given cycle number
  // will use to to get the statement
  //ex: const statementStartDate =  getStatementDateWithCycle("2021-08-31T02:18:27-05:00",7,2)
  getStatementDateWithCycle(accountEffectiveAt, cycleDuration, cycleNumber) {
    // "cycle_inclusive_start":"2021-08-31T02:18:27-05:00"
    cy.log(accountEffectiveAt);
    const daysToMove = cycleDuration * cycleNumber + 1;
    const statementStartDate = this.moveDate(accountEffectiveAt, daysToMove);
    return statementStartDate.slice(0, 7);
  }

  // get date for roll date forward api from current date add given number of
  // days
  // ex: const rollDate = getRollDate(2) adds two days from given date
  getRollDate(datesToMove) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + datesToMove);
    const exclusiveEnd = endDate.toISOString().slice(0, 10);
    return exclusiveEnd;
  }

  // get date for roll date forward api from effective date add given number of
  // days
  // ex: const rollDate = getRollDateWithEffectiveAt("2021-08-31T02:18:27-05:00",2) adds two days from given date
  getRollDateWithEffectiveAt(effectiveAt, datesToMove) {
    const exclusiveEnd = this.moveDate(effectiveAt, datesToMove).slice(0, 10);
    return exclusiveEnd;
  }

  // Generating annual fee payment date. this wil be used for annual fee payment
  // after generation
  //const paymentEffectiveDt = dateHelper.getAnnualFeePaymentEffectiveDate("2020-09-07T06:05:27-05:00")
  getAnnualFeePaymentEffectiveDate(accountEffectiveAt) {
    // "cycle_inclusive_start":"2020-09-07T06:05:27-05:00"
    const accountEffectiveDate = new Date(accountEffectiveAt);
    const day = accountEffectiveDate.getDate() + 1;
    const fullDay = day <= 9 ? "0" + day.toString() : day.toString();
    const month = "01"; //december
    const year = accountEffectiveDate.getFullYear() + 1;
    return year + "-" + month + "-" + fullDay;
  }

  //function is used to get account effective at when test data is numeric or
  //static date
  //ex: getAccountEffectiveAt("60")
  //ex: getAccountEffectiveAt("2020-09-23T02:18:27-08:00")
  getAccountEffectiveAt(effectiveAtDaysOrDate) {
    let effectiveAt = effectiveAtDaysOrDate;
    //effectiveAt when numeric value
    if (!isNaN(Number(effectiveAt))) {
      effectiveAt = this.addDays(parseInt(effectiveAt), 0);
    }
    return effectiveAt;
  }

  // Used to get the number of days to move forward for the given cycle interval
  // and cycle number
  //moveDaysForward = calculateMoveDaysForCycleInterval("7 days",3)
  calculateMoveDaysForCycleInterval(cycleInterval: string, cycleNumber: number): number {
    let intervalDays;
    cycleInterval == "1 month" ? (intervalDays = 30) : (intervalDays = parseInt(cycleInterval));
    const moveDays = intervalDays * cycleNumber + 2;
    return moveDays;
  }
}

export const dateHelper = new DateHelper()
