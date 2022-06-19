package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

import java.util.Map;

public class ContractsMainPage extends BasePage {
    private static Logger logger = LoggerFactory.getLogger(ContractsMainPage.class);

    private By btnCreateContract = By.xpath("//button[contains(@id,'CreateContract')]");

    //Create Contract dialog window
    private By lblQuickCreateContract = By.xpath("//h1[text()='Quick Create Contract']");
    private By btnQuickCreateContract = By.xpath("//input[@class='btn btn-info createcdrlbtn']");
    private By btnSearchOpportunity = By.xpath("//button[@ng-click='OpenLookupOpportunity()']/i");
    private By btnSearchPrimaryOrgName = By.xpath("//button[@ng-click='OpenLookupAccounts()']/i");
    private By txtContractName = By.xpath("//div[text()='Contract Name']/following-sibling::input[@type='text']");
    private By txtContractNumber = By.xpath("//div[text()='Contract Number']/following-sibling::input[@type='text']");
    private By frameContractQC = By.name("clm_contractqc.html");
    private By txtSearchOpportunity = By.xpath("//input[@placeholder='Search Opportunity...']");
    private By lblContractTitle = By.xpath("//h1[@id='formHeaderTitle_11']");
    private By btnYes = By.id("okButtonText");
    private By btnMoreSymbol = By.xpath("//span[contains(@class,'symbolFont More-symbol')]");

    private String lblMenuItem = "//ul[@aria-label='Contract Form']/li[@title='%s']";
    private String lblMoreMenuItems = "//li[@title='%1$s' and text()='%1$s']";

    public ContractsMainPage(WebDriver driver) {
        super(driver);
        logger.info("loading Contracts->Clauses page...");
    }

    private ContractsMainPage clickCreateContracts() {
        //Check CreateContract button is displayed
        scriptAction.waitUntilElementIsVisible(btnCreateContract, ApplicationConstants.MEDIUM_TIMEOUT, "Create Contract button is not displayed in Contracts page");
        //Click on Create Contracts button
        scriptAction.clickElement(btnCreateContract);
        //Wait until Create Contract page is displayed
        scriptAction.waitUntilElementIsVisible(lblQuickCreateContract, ApplicationConstants.MEDIUM_TIMEOUT, "Create Contracts page is not displayed");

        return this;
    }

    public ContractsMainPage quickCreateContract(Map<String, String> objContract) {
        clickCreateContracts();
        scriptAction.switchToFrame(frameContractQC);
        //Check Create Contract button is displayed in Quick Create Contracts dialog
        scriptAction.waitUntilElementIsVisible(btnQuickCreateContract, ApplicationConstants.MEDIUM_TIMEOUT, "Create Button is not displayed.");

        //Click on Search Opportunity button and look up for opportunity
        if (objContract.containsKey("OpportunityName")) {
            scriptAction.clickElement(btnSearchOpportunity);
            logger.debug("Search Opportunity click");
            lookUpRecords(objContract.get("OpportunityName"));
            scriptAction.switchToFrame(frameContractQC);
        }

        //Enter Contract Name
        if (objContract.containsKey("ContractName")) {
            scriptAction.inputText(txtContractName, objContract.get("ContractName"));
        }

        //Click on Search Primary Organization Name button and look up for opportunity
        if (objContract.containsKey("PrimaryOrganizationName")) {
            scriptAction.clickElement(btnSearchPrimaryOrgName);
            logger.debug("Search Primary Organization Name click");
            lookUpRecords(objContract.get("PrimaryOrganizationName"));
            scriptAction.switchToFrame(frameContractQC);
        }

        //Enter Contract Number
        if (objContract.containsKey("ContractNumber")) {
            scriptAction.inputText(txtContractNumber, objContract.get("ContractNumber"));
        }

        //Click on  Create Contract button
        scriptAction.clickElement(btnQuickCreateContract);
        return this;
    }

    public void validateContractIsCreated(String contractName) {
        scriptAction.waitUntilElementIsInVisible(btnQuickCreateContract, ApplicationConstants.MEDIUM_TIMEOUT);
        boolean contractCreationStatus = scriptAction.isElementVisible(By.xpath("//span[@id='dialogMessageText' and text()='Contract Created !!!']"), ApplicationConstants.MEDIUM_TIMEOUT);
        if (!contractCreationStatus) {
            //Need to check for error message, But application doesn't display any error message
            //get text if error message is displayed and append to assertion for reason
            Assert.fail("Failed to create contract. Reason: ");
        }

        scriptAction.switchToDefault();
        scriptAction.waitUntilElementIsVisible(btnYes, ApplicationConstants.MEDIUM_TIMEOUT, "Yes button is not displayed.");
        scriptAction.clickElement(btnYes);
        waitForPageToBeDisplayed(contractName);
    }

    public void editContract(String sContractName) {
        filterBy("Contract Vehicle Name", sContractName);
        editTableRecord(sContractName);
    }

    //click on contract more action button
    private void clickOnMoreActionsTab() {
        scriptAction.waitUntilElementIsVisible(btnMoreSymbol, ApplicationConstants.MEDIUM_TIMEOUT, "More actions button is not visible for Contract");
        scriptAction.clickElement(btnMoreSymbol);
        logger.debug("Clicked on More actions button in contract page");
    }

    //click on contract more actions items
    private void selectMoreMenuItem(String sMenuItem) {
        scriptAction.waitUntilElementIsVisible(By.xpath(String.format(lblMoreMenuItems, sMenuItem)), ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s is not displayed in Contract page", sMenuItem));
        scriptAction.clickElement(By.xpath(String.format(lblMoreMenuItems, sMenuItem)));
        logger.debug(String.format("%s Menu item is clicked in contract more action tab", sMenuItem));
    }

    //click on contract more actions items
    public void selectContractMenu(String sMenuItem) {
        boolean bStatus = scriptAction.isElementVisible(By.xpath(String.format(lblMenuItem, sMenuItem)));
        if (bStatus)
            scriptAction.clickElement(By.xpath(String.format(lblMenuItem, sMenuItem)));
        else {
            clickOnMoreActionsTab();
            selectMoreMenuItem(sMenuItem);
        }
        logger.info(String.format("%s Contract menu item is selected", sMenuItem));
    }

    //click on contract more actions items
    public ContractsClausesPage selectClauses() {
        selectContractMenu("Clauses");
        return new ContractsClausesPage(driver);
    }
}
