package com.technomile.grc.testcases;

import com.aventstack.extentreports.MediaEntityBuilder;
import com.technomile.grc.pages.LandingPage;
import com.technomile.grc.pages.LoginPage;

import com.technomile.grc.reporting.ExtentTestManager;
import org.testng.Assert;
import org.testng.annotations.Test;

public class RegressionTests extends BaseTest {

    @Test(description = "Validate login with valid credentials")
    public void validateLogin() {

        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.loginToApplication(configurationDetails.getUserName(), configurationDetails.getPassword())
                .validateUserIsLoggedIn();
        ExtentTestManager.getTest().pass("Logged in to application");

        //select compliance application
        LandingPage landingPage = new LandingPage(getDriver());
        landingPage.selectCompliance();
        ExtentTestManager.getTest().pass("Compliance Product is selected");
    }

    @Test
    public void validateLoginWithDifferntPassword() {
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.loginToApplication(configurationDetails.getUserName(), "Invalid password")
                .validateUserIsLoggedIn();
        ExtentTestManager.getTest().pass("Logged in to application");

        //select compliance application
        LandingPage landingPage = new LandingPage(getDriver());
        landingPage.selectCompliance();
        ExtentTestManager.getTest().pass("Compliance Product is selected");
    }

    @Test
    public void extentExampleTest() {
        ExtentTestManager.getTest().assignCategory("POC test");
        ExtentTestManager.getTest().pass("Compliance Product is selected");
        ExtentTestManager.getTest().fail("test is failed");
        ExtentTestManager.getTest().skip("test is skiped");
        //ExtentTestManager.getTest().pass("taking screenshot", MediaEntityBuilder.createScreenCaptureFromPath("").build());
        Assert.fail("failing this test");
    }
}
