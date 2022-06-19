import { migrationModeAPI } from "../../api_support/migrationmode";
import { authAPI } from "../../api_support/auth";
import TestFilters from "../../../support/filter_tests.js";

TestFilters(["smoke", "regression", "migrationMode"], () => {
  describe("Set migration mode", () => {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    // Hitting authentication issue here,
    xit("should be able to call migration mode ", () => {
      cy.fixture(Cypress.env("templateFolderPath").concat("/migrationmode/migration_mode.json")).then((json) => {
        migrationModeAPI.setmigrationmode(json, "1503").then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
});
