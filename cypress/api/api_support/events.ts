export class Events {
  getEvents(accountID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/events",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
}

export const eventsAPI = new Events();
