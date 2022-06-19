export class Notes {
createNotes(json, accountID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/notes",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
}
getAllNotes(accountID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/notes ",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  createNotesForAccount(accountID, templateFixtureFilePathName,message ) {
    const notesTemplateJSON = Cypress.env("templateFolderPath").concat("/notes/", templateFixtureFilePathName);
    return cy.fixture(notesTemplateJSON).then((notesJSON) => {
      notesJSON.message = message;
      cy.log(JSON.stringify(notesJSON))
      this.createNotes(notesJSON , accountID).then((response) => {
        expect(response.status, "notes response status").to.eq(200);
      });
    });
  }
}
export const notesAPI = new Notes();
