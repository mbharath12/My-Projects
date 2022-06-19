import { accountAPI } from "../api_support/account";

export class AMScheduleValidator {
  // Get AM Schedule for given account and validate AM Schedule details for
  // given month
  //const amScheduleLineItem: CreateAMSchedule = {
  //   cycle_exclusive_end: results.due_date,
  //  am_min_pay_cents: parseInt(results.min_pay_amount)}
  //ex: getAMScheduleListNValidateLineItem("312456",2,amScheduleLineItem)
  getAMScheduleListNValidateLineItem(accountID, cycleNumber, expAMScheduleLineItem) {
    accountAPI.getAmortizationSchedule(accountID).then((response) => {
      this.validateLineItem(response, cycleNumber, expAMScheduleLineItem);
    });
  }

  //Validate AM schedule details for given month
  //ex: validateLineItem(response, 0, expAMScheduleLineItem)
  validateLineItem(amResponse, cycleNumber, expAMScheduleLineItem) {
    if (amResponse.body.length) {
      expect(
        amResponse.body.length,
        "check am schedule is displayed for this cycle-".concat(cycleNumber + 1)
      ).to.not.lessThan(cycleNumber + 1);
    }
    const lineItem = amResponse.body[cycleNumber];
    if ("cycle_exclusive_end" in expAMScheduleLineItem) {
      expect(lineItem.cycle_exclusive_end, "Verify due date").to.include(expAMScheduleLineItem.cycle_exclusive_end);
    }

    if ("am_cycle_payment_cents" in expAMScheduleLineItem) {
      expect(lineItem.am_cycle_payment_cents, "Verify amount paid").to.eq(expAMScheduleLineItem.am_cycle_payment_cents);
    }

    if ("am_start_principal_balance_cents" in expAMScheduleLineItem) {
      expect(lineItem.am_start_principal_balance_cents, "Verify Opening balance").to.eq(
        expAMScheduleLineItem.am_start_principal_balance_cents
      );
    }

    if ("am_min_pay_cents" in expAMScheduleLineItem) {
      expect(lineItem.am_min_pay_cents, "Verify min pay amount").to.eq(expAMScheduleLineItem.am_min_pay_cents);
    }

    if ("am_principal_cents" in expAMScheduleLineItem) {
      expect(lineItem.am_principal_cents, "Verify principal paid").to.eq(expAMScheduleLineItem.am_principal_cents);
    }

    if ("am_interest_cents" in expAMScheduleLineItem) {
      expect(lineItem.am_interest_cents, "Verify interest paid").to.eq(expAMScheduleLineItem.am_interest_cents);
    }

    if ("am_end_principal_balance_cents" in expAMScheduleLineItem) {
      expect(lineItem.am_end_principal_balance_cents, "Verify Closing balance").to.eq(
        expAMScheduleLineItem.am_end_principal_balance_cents
      );
    }

    if ("paid_on_time" in expAMScheduleLineItem) {
      //expect(lineItem.paid_on_time,"Verify Closing balance").to.be.
      cy.log(lineItem.paid_on_time);
      cy.log(expAMScheduleLineItem.paid_on_time);
    }
  }
}

export const amScheduleValidator = new AMScheduleValidator();

export interface AMScheduleLineItem {
  line_item_id?: number;
  cycle_exclusive_end?: string;
  min_pay_due_at?: number;
  am_min_pay_cents?: number;
  am_cycle_payment_cents?: number;
  am_interest_cents?: number;
  am_principal_cents?: number;
  am_start_total_balance_cents?: number;
  am_end_total_balance_cents?: number;
  am_start_principal_balance_cents?: number;
  am_end_principal_balance_cents?: number;
  paid_on_time?: boolean;
}
