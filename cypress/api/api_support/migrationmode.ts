import { Constants } from "cypress/api/api_support/constants";

export class Migrationmode {
  setmigrationmode(json, productID) {
    return cy.request({
      method: "PUT",
      url: "products/" + productID + "/migration_mode ",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }


setProductMigrationMode(productID,migrationMode:boolean) {
  const migrationTemplateFile = Constants.templateFixtureFilePath.concat("/migrationmode/migration_mode.json");
  return cy.fixture(migrationTemplateFile).then((migrationJson) => {
    migrationJson.migration_mode = migrationMode;
  cy.log(JSON.stringify(migrationJson));
      this.setmigrationmode(migrationJson,productID).then((response) => {
          expect(response.status).to.eq(200);
        return response;
      });
    });
}
}
export const migrationModeAPI = new Migrationmode();
