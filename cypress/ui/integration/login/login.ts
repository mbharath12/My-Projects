/* eslint-disable cypress/no-async-tests */
import loginJSON from "../../../resources/testdata/users/ui_invalid_login.json";
import TestFilters from "../../../support/filter_tests.js";

//Test Cases covered
//WEB_001 - Validate Error for Invalid Email
//WEB_002 - Validate Error for Invalid Password
//WEB_003 - Validate Error for unauthorized user
//WEB_004 - Validate Login with valid user

TestFilters(["smoke","regression", "login"], () => {
  describe("Validate login functionality with valid and invalid login details ", function () {
    before(() => {
      cy.launchApplication();
    });

    //iterate each login
    loginJSON.forEach((data) => {
      //Try to login with invalid credentials
      it(`should not be able to Login to the Application - ${data.tc_name}`, () => {
        //Invalid Login Details
        let emailID = data.email_id;
        let password = data.password;
        if (emailID.toLowerCase() === "getfromenv") {
          emailID = Cypress.env("webEmailID");
        }
        if (password.toLowerCase() === "getfromenv") {
          password = Cypress.env("webPassword");
        }
        cy.enterLoginDetails(emailID, password);
        cy.clickOnSubmit();
        cy.checkLoginErrorMessage(data.error_message);
      });
    });

    //Login to application with valid credentials
    it(`should be able to Login to the Application - WEB_004 - Validate Login with Valid user`, () => {
      cy.login(Cypress.env("webEmailID"), Cypress.env("webPassword"));
    });
  });
});
