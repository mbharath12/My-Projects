import { Constants } from "./constants";

export class Lithic {
  configureLithic(json) {
    return cy.request({
      method: "PUT",
      url: "organization/issuer_processors",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });``
  }
  createConfigureLithic(fileName: string) {
    const lithicFileName = Constants.templateFixtureFilePath.concat("/lithic/", fileName);
   return cy.fixture(lithicFileName).then((lithicJson) => {
      lithicJson.lithic_config.api_key = Cypress.env("lithic_api_key");
      cy.log(JSON.stringify(lithicJson));
        this.configureLithic(lithicJson).then((response) => {         
        return response;
        });
      });
  }
}

export const lithicAPI = new Lithic();
