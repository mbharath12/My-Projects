package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

public class LoginPage extends BasePage {
    private static Logger logger = LoggerFactory.getLogger(LoginPage.class);

    private By txtUserName = By.name("loginfmt");
    private By txtUserPassword = By.name("passwd");
    private By btnNext = By.xpath("//input[@value='Next']");
    private By btnSignIn = By.xpath("//input[@value='Sign in']");
    private By btnStaySignInYes = By.xpath("//div[normalize-space()='Stay signed in?']/following-sibling::div[2]//input[@value='Yes']");
    private By txtLoginError = By.id("passwordError");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage loginToApplication(String sUserName, String sPassword) {
        scriptAction.waitUntilElementIsVisible(txtUserName, ApplicationConstants.MEDIUM_TIMEOUT, "Username field is not displayed.");
        //enter username
        scriptAction.inputText(txtUserName, sUserName);
        scriptAction.clickElement(btnNext);
        //enter password
        scriptAction.waitUntilElementIsVisible(txtUserPassword, ApplicationConstants.MEDIUM_TIMEOUT);
        scriptAction.inputText(txtUserPassword, sPassword);
        //click login
        scriptAction.clickElement(btnSignIn);
        return this;
    }

    public void validateUserIsLoggedIn() {
        boolean loginStatus = scriptAction.isElementVisible(btnStaySignInYes, ApplicationConstants.MEDIUM_TIMEOUT);
        if (!loginStatus) {
            String errorMsg = scriptAction.getText(txtLoginError);
            Assert.fail(String.format("Login failed.Reason: %s", errorMsg));
        }
        logger.info("login to application successful..");
        //click stay sign in
        scriptAction.clickElement(btnStaySignInYes);
    }
}
