export class CreditReporting {
  getAllCreditReports(accountId) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountId + "/credit_reports/list",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  getMetro2CreditReport(accountId, creditReportId) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountId + "/credit_reports/" + creditReportId,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
}

export const creditReportingAPI = new CreditReporting();
