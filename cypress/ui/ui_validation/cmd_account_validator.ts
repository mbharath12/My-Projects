/* eslint-disable cypress/no-unnecessary-waiting */
import { helper } from "../ui_support/helper";

const AccountSummaryPageLabels = {
  current_balance: "Current Balance",
  open_to_buy: "Open To Buy",
  credit_limit: "Credit Limit",
  principal_balance: "Principal Balance",
  payoff_amount: "Payoff Amount",
  total_paid_to_date: "Total Paid To Date",
  interest_paid_to_date: "Interest Paid To Date",
  available_credit: "Available Credit",
};

const AccountSummaryElementLocator = {
  eleUpComingPaymentCardHeader:
    "//div[@class='ant-card-head-title' and contains(text(),'Upcoming Payment')]/../../..//div[@class='ant-spin-container']",
  elePaymentDtsCardHeader:
    "//div[@class='ant-card-head-title' and contains(text(),'Payment Details')]/../../..//div[@class='ant-spin-container']",
};
const AccountUpComingPaymentLabels = {
  due_date: "Due Date",
  total_due: "Total Due",
  current_due: "Current Due",
  fee_due: "Fees Due",
  past_due: "Past Due",
};

const AccountProductDtsLabel = {
  interest_rate: "Interest Rate",
  payoff_date: "Payoff Date",
  promo_period_ends: "Promo Period Ends",
  late_fee: "Late Fee",
  return_check_fee: "Return Check Fee",
};

const AccountPaymentDtsLabel = {
  autopay: "Autopay",
  default_payment_processor_method: "Default Method",
  processor: "Processor",
};

//Verify Account summary statistics for different products in UI
Cypress.Commands.add("validateAccountSummary", (accountSummaryDts) => {
  if (("principal_balance" in accountSummaryDts) && (accountSummaryDts.principal_balance.length !== 0)) {
      helper.centsTODollar(accountSummaryDts.principal_balance).then((value) => {
        cy.checkAccountSummaryDts(AccountSummaryPageLabels.principal_balance, value);
      });
  }
  if (("current_balance" in accountSummaryDts)  && (accountSummaryDts.current_balance.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.current_balance).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.current_balance, value);
    });
  }
  if (("open_to_buy" in accountSummaryDts) && (accountSummaryDts.open_to_buy.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.open_to_buy).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.open_to_buy, value);
    });
  }
  if (("credit_limit" in accountSummaryDts) && (accountSummaryDts.credit_limit.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.credit_limit).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.credit_limit, value);
    });
  }
  if (("principal_balance" in accountSummaryDts) && (accountSummaryDts.principal_balance.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.principal_balance).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.principal_balance, value);
    });
  }
  if (("payoff_amount" in accountSummaryDts) && (accountSummaryDts.payoff_amount.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.payoff_amount).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.payoff_amount, value);
    });
  }
  if (("total_paid_to_date" in accountSummaryDts)  && (accountSummaryDts.total_paid_to_date.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.total_paid_to_date).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.total_paid_to_date, value);
    });
  }
  if (("interest_paid_to_date" in accountSummaryDts) && (accountSummaryDts.interest_paid_to_date.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.interest_paid_to_date).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.interest_paid_to_date, value);
    });
  }
  if (("available_credit" in accountSummaryDts)  && (accountSummaryDts.available_credit.length !== 0)) {
    helper.centsTODollar(accountSummaryDts.available_credit).then((value) => {
      cy.checkAccountSummaryDts(AccountSummaryPageLabels.available_credit, value);
    });
  }
});

//Verify Account upcoming payment details for different products in UI
Cypress.Commands.add("validateAccountUpcomingPaymentDts", (accountUpcomingPaymentDts) => {
  if ("upcoming_payment_due_date" in accountUpcomingPaymentDts) {
    helper.dateToDefaultUIFormat(accountUpcomingPaymentDts.upcoming_payment_due_date).then((value) => {
      cy.checkUpComingPaymentDts(AccountUpComingPaymentLabels.due_date, value);
    });
  }
  if ("upcoming_payment_total_due_cents" in accountUpcomingPaymentDts) {
    helper.centsTODollar(accountUpcomingPaymentDts.upcoming_payment_total_due_cents).then((value) => {
      cy.checkUpComingPaymentDts(AccountUpComingPaymentLabels.total_due, value);
    });
  }

  if ("upcoming_payment_current_due_cents" in accountUpcomingPaymentDts) {
    helper.centsTODollar(accountUpcomingPaymentDts.upcoming_payment_current_due_cents).then((value) => {
      cy.checkUpComingPaymentDts(AccountUpComingPaymentLabels.current_due, value);
    });
  }
  if ("upcoming_payment_fees_due_cents" in accountUpcomingPaymentDts) {
    helper.centsTODollar(accountUpcomingPaymentDts.upcoming_payment_fees_due_cents).then((value) => {
      cy.checkUpComingPaymentDts(AccountUpComingPaymentLabels.fee_due, value);
    });
  }
  if ("upcoming_payment_past_due_cents" in accountUpcomingPaymentDts) {
    helper.centsTODollar(accountUpcomingPaymentDts.upcoming_payment_past_due_cents).then((value) => {
      cy.checkUpComingPaymentDts(AccountUpComingPaymentLabels.past_due, value);
    });
  }
});

//Verify Account product details in account page
Cypress.Commands.add("validateAccountProductDts", (accountProductDts) => {
  if ("promo_len" in accountProductDts) {
    cy.checkProductDts("Promo Period", accountProductDts.promo_len.toString().concat(" Months"));
  }
  // if ("post_promo_len" in accountProductDts) {
  //   cy.checkProductDts("Amortization Length", accountProductDts.post_promo_len.toString().concat(" Months"));
  // }

  if ("interest_rate_percent" in accountProductDts) {
    cy.checkProductDts(
      AccountProductDtsLabel.interest_rate,
      accountProductDts.interest_rate_percent.toString().concat("%")
    );
  }
  if ("loan_end_date" in accountProductDts) {
    helper.dateToShortUIFormat(accountProductDts.loan_end_date).then((value) => {
      cy.checkProductDts(AccountProductDtsLabel.payoff_date, value);
    });
  }
  if ("promo_exclusive_end" in accountProductDts) {
    helper.dateToShortUIFormat(accountProductDts.promo_exclusive_end).then((value) => {
      cy.checkProductDts(AccountProductDtsLabel.promo_period_ends, value);
    });
  }
  if ("late_fee_cents" in accountProductDts) {
    helper.centsTODollar(accountProductDts.late_fee_cents).then((value) => {
      cy.checkProductDts(AccountProductDtsLabel.late_fee, value);
    });
  }
  if ("payment_reversal_fee_cents" in accountProductDts) {
    helper.centsTODollar(accountProductDts.payment_reversal_fee_cents).then((value) => {
      cy.checkProductDts(AccountProductDtsLabel.return_check_fee, value);
    });
  }
});

Cypress.Commands.add("validatePaymentDts", (accountPaymentDts) => {
  if ("autopay_enabled" in accountPaymentDts) {
    helper.getAutoPayUIValue(accountPaymentDts.autopay_enabled).then((value) => {
      cy.checkUpComingPaymentDts(AccountPaymentDtsLabel.autopay, value);
    });
  }
  if ("default_payment_processor_method" in accountPaymentDts) {
    cy.checkPaymentDts(
      AccountPaymentDtsLabel.default_payment_processor_method,
      accountPaymentDts.default_payment_processor_method
    );
  }
  if ("payment_processor_name" in accountPaymentDts) {
    cy.checkPaymentDts(AccountPaymentDtsLabel.processor, accountPaymentDts.payment_processor_name);
  }
});

Cypress.Commands.add("checkAccountSummaryDts", (labelName, value) => {
  const elementXpath = "//div[@class='ant-statistic-title' and text()='".concat(labelName, "']/..//span");
  cy.xpath(elementXpath).then(($ele) => {
    const actualValue = $ele.text();
      cy.softAssert(value, actualValue,  "Check value for  ".concat(labelName, " field"));
  })
});

Cypress.Commands.add("checkUpComingPaymentDts", (labelName, value) => {
  const elementXpath = "//span[text()='".concat(labelName, "']/..//span[2]");
  cy.xpath(AccountSummaryElementLocator.eleUpComingPaymentCardHeader)
    .xpath(elementXpath)
    .then(($ele) => {
      const actualValue = $ele.text();
      cy.softAssert(value, actualValue, "Check value for  ".concat(labelName, " field"));
    });
});

Cypress.Commands.add("checkProductDts", (labelName, value) => {
  const elementXpath = "//span[text()='".concat(labelName, "']/..//span[2]");
  cy.xpath(elementXpath).then(($ele) => {
    const actualValue = $ele.text();
    cy.softAssert(value, actualValue, "Check value for  ".concat(labelName, " field"));
  });
});

Cypress.Commands.add("checkPaymentDts", (labelName, value) => {
  const elementXpath = "//span[text()='".concat(labelName, "']/..//span[2]");
  cy.xpath(AccountSummaryElementLocator.elePaymentDtsCardHeader)
    .xpath(elementXpath)
    .then(($ele) => {
      const actualValue = $ele.text();
      cy.softAssert(value, actualValue, "Check value for  ".concat(labelName, " field"));
    });
});

export interface UIAccountSummary {
  current_balance?: any;
  open_to_buy?: any;
  available_credit?: any;
  credit_limit?: any;
  principal_balance?: any;
  payoff_amount?: any;
  total_paid_to_date?: any;
  interest_paid_to_date?: any;
  max_credit_limit?: any;
}
export interface UIUpcomingPayment {
  upcoming_payment_due_date?: string;
  upcoming_payment_total_due_cents?: any;
  upcoming_payment_current_due_cents?: any;
  upcoming_payment_fees_due_cents?: any;
  upcoming_payment_past_due_cents?: any;
}
export interface UIProductDts {
  promo_len?: any;
  post_promo_len?: any;
  interest_rate_percent?: string;
  loan_end_date?: string;
  promo_exclusive_end?: string;
  late_fee_cents?: any;
  payment_reversal_fee_cents?: any;
}
export interface UIPaymentDts {
  autopay_enabled?: boolean;
  default_payment_processor_method?: string;
  payment_processor_name?: string;
}
