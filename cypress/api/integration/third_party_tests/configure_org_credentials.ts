import { Organization } from "../../api_support/organization";
import { Auth } from "../../api_support/auth";

describe("Configure organization credentials", () => {
  const organization = new Organization();

  before(() => {
    const auth = new Auth();
    auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
      Cypress.env("accessToken", "Bearer " + response.body.access_token);
    });
  });
  // on QA we dont have Lithic sandbox access
  xit("should be able to update Lithic credentials", () => {
    cy.fixture(Cypress.env("templateFolderPath").concat("credentials/lithic.json")).then((JSON) => {
      organization.updateLithicCredentials(JSON).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
