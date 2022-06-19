export class Statements {
  createStatementList(accountID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/statements/list",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  newstatement(accountID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/statements/list",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  getStatementByAccount(accountID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/statements/list",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  getStatementByStmtId(accountID, statementID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/statements/" + statementID,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
}

export const statementsAPI = new Statements();
