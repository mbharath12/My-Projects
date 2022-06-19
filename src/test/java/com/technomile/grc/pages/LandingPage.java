package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LandingPage extends BasePage {

    private static Logger logger = LoggerFactory.getLogger(LandingPage.class);

    private String applicationName = "//div[text()='%s']";
    private By viewProducts = By.id("ApplicationShell");
    private By frameLandingPage = By.id("AppLandingPage");
    private By lblCompliance = By.xpath("//span[@data-id='appBreadCrumbText' and text()='Compliance']");

    public LandingPage(WebDriver driver) {
        super(driver);
        logger.info("loading Landing page..");
        scriptAction.waitUntilElementIsVisible(
                viewProducts
                , ApplicationConstants.MEDIUM_TIMEOUT
                , "After login, landing page is not displayed");
    }

    public boolean selectApplication(String sApplicationName) {
        scriptAction.waitForFrameAndSwitch(frameLandingPage, ApplicationConstants.MEDIUM_TIMEOUT);
        scriptAction.waitUntilElementIsVisible(
                By.xpath(String.format(applicationName, sApplicationName))
                , ApplicationConstants.MEDIUM_TIMEOUT
                , String.format("%s is not displayed/invalid application name", sApplicationName));

        scriptAction.clickElement(By.xpath(String.format(applicationName, sApplicationName)));
        logger.info(String.format("%s application is selected..", sApplicationName));
        return true;
    }

    public ComplianceMainPage selectCompliance() {
        selectApplication("Compliance");
        scriptAction.waitUntilElementIsVisible(lblCompliance, ApplicationConstants.MEDIUM_TIMEOUT, "Compliance page is not displayed");
        return new ComplianceMainPage(driver);
    }
}
