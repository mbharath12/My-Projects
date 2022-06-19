// load type definitions that come with Cypress module
/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Login to the WebOS
     * @param emailID string
     * @param password string
     * @example
     *  cy.login('qa+canopy@canopyservicing.com', 'yesWeCanopy1!');
     */
    launchApplication(): Chainable<Element>;
    login(emailID: string, password: string): Chainable<Element>;
    enterLoginDetails(emailID: string, password: string): Chainable<Element>;
    clickOnSubmit(): Chainable<Element>;
    checkLoginErrorMessage(errorMmessage): Chainable<Element>;
    softAssert(actual, expected, message):Chainable<any>;
    softAssertAll():Chainable<any>;
    validateAccountSummary(accountSummaryDts: any): Chainable<any>;
    validateAccountUpcomingPaymentDts(accountUpcomingPaymentDts: any): Chainable<any>;
    validateAccountProductDts(accountProductDts: any): Chainable<any>;
    validatePaymentDts(accountPaymentDts: any): Chainable<any>;
    redirectToAccountPage(accountID: any): Chainable<any>;
    checkAccountSummaryDts(labelName: any, value: any): Chainable<any>;
    checkUpComingPaymentDts(labelName: any, value: any): Chainable<any>;
    checkProductDts(labelName: any, value: any): Chainable<any>;
    checkPaymentDts(labelName: any, value: any): Chainable<any>;
  }
}
