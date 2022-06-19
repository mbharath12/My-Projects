export class Rolltime {
  rollAccountForward(accountID, exclusive_end) {
    return cy.request({
      method: "PATCH",
      url: "admin/roll/account?account_id=" + accountID + "&exclusive_end=" + exclusive_end,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
}

export const rollTimeAPI = new Rolltime()
