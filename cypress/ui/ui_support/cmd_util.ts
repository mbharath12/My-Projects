import * as assertion from "soft-assert"
import { UIEndPoints } from "../ui_support/constants";

const errors = [];
Cypress.Commands.add('softAssert', (actual, expected, message) => {
  assertion.softAssert(actual, expected, message)
  if (assertion.jsonDiffArray.length) {
    assertion.jsonDiffArray.forEach(diff => {
      const log = Cypress.log({
        name: 'assert',
        displayName: 'assert',
        message: diff.error.message
      })
       errors.push("1");
       log.error(new Error());
    })
  }
  else{
    expect(actual,message).to.eq(expected)
  }
})

Cypress.Commands.add("softAssertAll", () =>
{
  // if (errors) {
  //   errors =[]
  //   const msg = 'Failed soft assertions... check log above ↑';
  //   throw new Error(msg)
  // }
  assertion.softAssertAll();
})


Cypress.Commands.add("redirectToAccountPage", (accountID) => {
  cy.url().then((_urlValue) => cy.visit(Cypress.env("webBaseUrl").concat(UIEndPoints.accountPage, accountID)));
  cy.title().should('eq','Account Detail')
});
