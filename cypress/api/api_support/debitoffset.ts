export class Debitoffset {
  createDebitoffset(json, accountID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/debit_offsets",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }
}
