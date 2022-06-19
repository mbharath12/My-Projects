export class Auth {
  getAccessToken(clientId, clientSecret) {
    return cy.request({
      method: "POST",
      url: "auth/token",
      body: {
        client_id: clientId,
        client_secret: clientSecret,
      },
      failOnStatusCode: false,
    });
  }
  getDefaultUserAccessToken() {
    this.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
      Cypress.env("accessToken", "Bearer " + response.body.access_token);
      return response.body.access_token;
    });
  }

  getAPIUsers() {
    return cy.request({
      method: "GET",
      url: "api_users",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
  getAPIUserSummary() {
    return cy.request({
      method: "GET",
      url: "api_users/summary",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
}

export const authAPI = new Auth();
