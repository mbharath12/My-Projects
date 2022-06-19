// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { URLConstants, UITimeOuts, UIEndPoints } from "../../ui_support/constants";

const eleEmailID = "#email";
const elePassword = "#password";
const eleSingIn = "button[type='submit']";

Cypress.Commands.add("login", (emailID: string, password: string) => {
  cy.visit(Cypress.env("webBaseUrl").concat(URLConstants.login));
  cy.get(eleEmailID).clear().type(emailID);

  //cy.get(elePassword).clear().type(password);
  cy.get(elePassword).clear().type(password);

  cy.get(eleSingIn).click();
  cy.url({ timeout: UITimeOuts.homePage }).should("contain", UIEndPoints.homePage);
});
Cypress.Commands.add("launchApplication", () => {
  cy.visit(Cypress.env("webBaseUrl").concat(URLConstants.login));
});

Cypress.Commands.add("enterLoginDetails", (emailID: string, password: string) => {
  cy.get(eleEmailID).clear().type(emailID);
  cy.get(elePassword).clear().type(password);
});

Cypress.Commands.add("clickOnSubmit", () => {
  cy.get(eleSingIn).click();
});

Cypress.Commands.add("checkLoginErrorMessage", (errorMessage) => {
  const errorXpath = "//div[text()='" + errorMessage + "']";
  cy.xpath(errorXpath).should("have.text", errorMessage);
});
