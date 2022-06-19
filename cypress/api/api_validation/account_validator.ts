/* eslint-disable cypress/no-unnecessary-waiting */
import { Account } from "../api_support/account";

export class AccountValidator {
  //Verify account summary details for given account
  //ex: type AccSummary = Pick<AccountSummary, "principal_cents" | "total_balance_cents" | "total_paid_to_date_cents">;
  //const accSummary: AccSummary = {
  //   principal_cents: parseInt(data.current_principal_cents),
  //   total_balance_cents: parseInt(data.total_balance_cents),
  //   total_paid_to_date_cents: parseInt(data.total_paid_to_date_cents),
  // };
  //accountValidator.validateAccountSummary(accountID, accSummary);
  validateAccountSummary(accountID, expAccSummary) {
    const account = new Account();
    account.getAccountById(accountID).then(async (response) => {
      expect(response.status).to.eq(200);
      const responseSummary = response.body.summary;
      for (const key in expAccSummary) {
        expect(responseSummary[key], "verify " + key + " in account summary").to.eq(parseInt(expAccSummary[key]));
      }
    });
  }

  //TODO: Remove code when performance issue is fixed.
  //Account summary takes time to update
  //ex: waitForAccountBalanceUpdate(3432,50000)
  waitForAccountBalanceUpdate(accountID, amount) {
    Cypress.env("waitTime", 500);
    const account = new Account();
    for (let counter = 0; counter < 5; counter++) {
      account.getAccountById(accountID).then(async (response) => {
        expect(response.status).to.eq(200);
        if (response.body.summary.total_balance_cents == amount && Cypress.env("waitTime") != 0) {
          expect(response.body.summary.total_balance_cents, "total balance in cents after fees").to.eq(amount);
          Cypress.env("waitTime", 0);
        } else {
          cy.wait(Cypress.env("waitTime"));
        }
      });
    }
  }

  //TODO: Remove code when performance issue is fixed.
  //Account summary takes time to update
  //ex: waitForAccountBalanceUpdate(3432,50000)
  waitForAccountTotalBalanceUpdate(accountID, amount) {
    Cypress.env("waitTime", 500);
    const account = new Account();
    for (let counter = 0; counter < 5; counter++) {
      account.getAccountById(accountID).then(async (response) => {
        expect(response.status).to.eq(200);
        if (response.body.summary.total_balance_cents == amount && Cypress.env("waitTime") != 0) {
          expect(response.body.summary.total_balance_cents, "total balance amount in cents after account fees").to.eq(
            amount
          );
          Cypress.env("waitTime", 0);
        } else {
          cy.wait(Cypress.env("waitTime"));
        }
      });
    }
  }

  //Temporary code until performance issue is fixed
  //ex: waitForAccountStatusUpdate(3432,ACTIVE)
  waitForAccountStatusUpdate(accountID, status) {
    Cypress.env("waitTime", 500);
    const account = new Account();
    for (let counter = 0; counter < 5; counter++) {
      account.getAccountById(accountID).then(async (response) => {
        expect(response.status).to.eq(200);
        cy.log("status" + response.body.account_overview.account_status);
        if (response.body.account_overview.account_status == status && Cypress.env("waitTime") != 0) {
          expect(response.body.account_overview.account_status, "account status for create account").to.eq(status);
          Cypress.env("waitTime", 0);
        } else {
          cy.wait(Cypress.env("waitTime"));
        }
      });
    }
  }


  validateGetSpecificResponse(accountID, expAccountSummary) {
    const account = new Account();
    account.getAccountById(accountID).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.account_id, "verify the account id").to.eq(expAccountSummary.account_id);
      expect(response.body.account_overview.account_status, "verify the status of the account").to.eq(
        expAccountSummary.status
      );
      expect(response.body.customers[0].customer_id, "verify the customer id").to.eq(expAccountSummary.customer_id);
      expect(response.body.customers[0].customer_account_role, "verify the customer account role").to.eq(
        expAccountSummary.customer_account_role
      );
      expect(response.body.customers[0].card_details[0].state, "verify the lithic card state").to.eq(
        expAccountSummary.state
      );
      expect(response.body.customers[0].card_details[0].type, "verify the lithic card type").to.eq(
        expAccountSummary.type
      );
      expect(response.body.customers[0].card_details[0].last_four, "verify the lithic card last four").to.eq(
        expAccountSummary.last_four
      );
      expect(response.body.customers[0].card_details[0].memo, "verify the lithic card memo").to.eq(
        expAccountSummary.memo
      );
      expect(
        response.body.summary.fees_balance_cents,
        "verify the origination fees specified for the account is charged to the account"
      ).to.eq(parseInt(expAccountSummary.fees_balance_cents));
      expect(response.body.customers[0].card_details[0].token, "verify the lithic card program token").to.eq(
        expAccountSummary.token
      );
      //validate min pay cents only when the amount is positive
      if (expAccountSummary.statement_min_pay_cents !== -1) {
        expect(
          response.body.min_pay_due_cents.statement_min_pay_cents,
          "verify the min pay amount for the first cycle"
        ).to.eq(parseInt(expAccountSummary.statement_min_pay_cents));
      }
    });
  }
}
export interface AccountSummary {
  principal_cents: number;
  total_balance_cents: number;
  total_paid_to_date_cents: number;
  fees_balance_cents: number;
  interest_balance_cents: number;
  am_interest_balance_cents:number;
  total_interest_paid_to_date_cents:number;
  deferred_interest_balance_cents:number;
  account_id?: string;
  status?: string;
  customer_id?: string;
  customer_account_role?: string;
  state?: string;
  type?: string;
  last_four?: string;
  memo?: string;
  token?: string;
  statement_min_pay_cents?: number;
}
export const accountValidator = new AccountValidator();
