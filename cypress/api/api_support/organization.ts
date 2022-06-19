export class Organization {
  getOrganization() {
    return cy.request({
      method: "GET",
      url: "organization",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
  updateLithicCredentials(JSON) {
    return cy.request({
      method: "PUT",
      url: "organization/issuer_processors",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON,
      failOnStatusCode: false,
    });
  }
  updatePaymentProcessorConfigs(JSON) {
    return cy.request({
      method: "PUT",
      url: "organization/payment_processors",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: JSON,
      failOnStatusCode: false,
    });
  }
}
export const organizationAPI = new Organization();
