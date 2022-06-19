package com.technomile.grc.pages;

import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ComplianceMainPage extends BasePage {
    private static Logger logger = LoggerFactory.getLogger(ComplianceMainPage.class);

    public ComplianceMainPage(WebDriver driver) {
        super(driver);
        logger.info("Loading Compliance Main page...");
    }

    public ContractsMainPage selectContracts() {
        selectSiteEntity("Contracts", "Contracts");
        return new ContractsMainPage(driver);
    }
}
