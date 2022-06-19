import { Auth } from "../../api_support/auth";
import { Statements } from "../../api_support/statements";
import { Rolltime } from "../../api_support/rollTime";
import { Migrationmode } from "../../api_support/migrationmode";
import TestFilters from "../../../support/filter_tests.js";

TestFilters(["artis", "loanTape", "regression"], () => {
  describe("Get loan tape for", () => {
    const statement = new Statements();
    const rollTime = new Rolltime();
    const migrationmode = new Migrationmode();
    const effective_at = "2021-04-13 19:47:00+00";
    const accountID = 1850;

    // Because this data is available in QA DB and currently we are running this
    // code in RC its failing

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });
    });

    xit("should be able to call migration mode ", () => {
      cy.fixture(Cypress.env("templateFolderPath").concat("/migrationmode/migration_mode.json")).then((json) => {
        migrationmode.setmigrationmode(json, "1556").then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    xit("should be able to patch time forward to generate monthly fees", () => {
      // roll time forward to current date
      const datesToMove = 162;
      const endDate = new Date(effective_at);
      endDate.setDate(endDate.getDate() + datesToMove);
      cy.log("here : " + endDate.toISOString());

      cy.log(endDate.toISOString().slice(0, 10));
      const exclusive_end = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusive_end);
      cy.log("start: " + effective_at);

      rollTime.rollAccountForward(accountID, exclusive_end).then((response) => {
        expect(response.status).to.eq(200);
      });

      statement.getStatementByAccount(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(7);
        expect(response.body[0].account_id).to.eq(accountID.toString());
      });

      xit("should be able to verify statement generation  ", () => {
        statement.getStatementByAccount(accountID).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.length).to.eq(7);
          expect(response.body[0].account_id).to.eq(accountID.toString());
        });
      });
    });

    xit("should be able to run query on QA DB to get results   ", () => {
      //cy.exec('node cypress/queryRunner.js')
    });
    //cy.exec('node cypress/queryRunner.js')
  });
});
