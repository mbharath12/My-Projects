package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import com.technomile.grc.support.GRCUtils;
import com.technomile.grc.utils.CommonUtil;
import com.technomile.grc.utils.WebUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//this class should have only common web related option
public class BasePage {
    private static Logger logger = LoggerFactory.getLogger(BasePage.class);

    protected final WebUtil scriptAction;
    protected final WebDriver driver;
    protected final GRCUtils grcUtils = new GRCUtils();

    //Left Pane
    private String siteEntityName = "//div[@id='siteMapPanelBodyDiv']//li[@data-text='%s']";
    private String navigatedEntityPageName = "//div[@id='mainContent']//div[contains(@id,'ViewSelector') and contains(@aria-label,'%s')]";
    private String navigatedPageName = "//div[@id='mainContent']//h1[@title='%s' and @data-id='header_title']";


    //Filter By
    private String drpTblColumnName = "//div[@aria-label='Editable Grid']//div[@class='wj-colheaders']//div[contains(@class,'ms-StackItem headerText') and text()='%s']";
    private By btnFilterBy = By.xpath("//button[@name='Filter by']");
    private By txtFilterByValue = By.xpath("//div[@role='alertdialog' and @aria-label='Filter by']//input");
    private By btnFilterApply = By.xpath("//div[@role='alertdialog' and @aria-label='Filter by']//button[contains(@class,'submitButton') and @data-is-focusable='true']");
    private By btnFilterClear = By.xpath("//div[@role='alertdialog' and @aria-label='Filter by']//button[contains(@class,'resetButton') and @data-is-focusable='true']");


    //LookUp Records Section
    private By secLookUpRecords = By.xpath("//section[@id='lookupDialogRoot']");
    private By txtLookUpSearchBox = By.xpath("//section[@id='lookupDialogRoot']//input[@role='searchbox']");
    private String sLookUpSearchItem = "//ul[contains(@id,'LookupResultsPopup') and @role='tree']//span[text()='%s']";
    private By btnLookUpAdd = By.id("lookupDialogSaveBtn");
    private By btnLookUpCancel = By.id("lookupDialogCancelBtnFooter");

    //Transaction Status
    private By btnRefresh = By.xpath("//button[contains(@id,'refreshCommand')]");
    private String lblTransactionStatus = "//div[text()='%s']//parent::div/div[@class='pa-a pa-ac flexbox']";

    //Table
    //private String chkTableSelectRecord ="//div[@role='gridcell' and @title='%s']/..//div[@role='checkbox']";
    private String chkTableSelectRecord = "//div[@class='wj-row' and @aria-rowindex='2']/div[@data-id='cell-0-1']";
    private String lblTableRecord = "//div[@role='gridcell' and @title='%s']";
    private String lblTableSelectRecord = "//div[@class='wj-row' and @aria-rowindex='2']//div[@role='gridcell' and @title='%s']";
    private By tblSecondRow = By.xpath("//div[@class='wj-row' and @aria-rowindex='2']");

    //header layout
    private By btnEditContract = By.xpath("//button[contains(@id,'EditSelectedRecord')]");

    //common
    private String txtAutofill = "//label[text()='%s']/../../../following-sibling::div[1]//input";
    private String btnAutofillSearch = "//label[text()='%s']/../../../following-sibling::div[1]//button";
    private String drpAutofill = "//span[text()='%s']";

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.scriptAction = new WebUtil(driver);
    }

    public String takePageScreenShot() {
        return this.scriptAction.takeScreenshotAndSave();
    }

    public void selectSiteEntity(String sEntityName, String sPageName) {
        //Check the entity name is displayed in left navigation pane
        By locSiteEntity = By.xpath(String.format(siteEntityName, sEntityName));
        scriptAction.waitUntilElementIsVisible(locSiteEntity, ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s is an invalid entity name", sEntityName));
        //Scroll to element
        scriptAction.scrollToElement(locSiteEntity);
        //Click on the element
        scriptAction.clickElement(locSiteEntity);

        //Wait for selected entity page to be displayed
        waitForEntityPageToBeDisplayed(sPageName);
    }

    public void waitForEntityPageToBeDisplayed(String sPageName) {
        By locNavigatedEntityPageName = By.xpath(String.format(navigatedEntityPageName, sPageName));
        scriptAction.waitUntilElementIsVisible(locNavigatedEntityPageName, ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s page is not displayed", sPageName));
        logger.info(String.format("%s entity is selected..", sPageName));
    }

    public void waitForPageToBeDisplayed(String sPageName) {
        By locNavigatedPageName = By.xpath(String.format(navigatedPageName, sPageName));
        scriptAction.waitUntilElementIsVisible(locNavigatedPageName, ApplicationConstants.LONG_TIMEOUT, String.format("%s page is not displayed", sPageName));
    }

    public boolean waitForStatusUpdate(String sTransactionType, String sTransactionStatus) {
        By locLblStatus = By.xpath(String.format(lblTransactionStatus, sTransactionType));
        String sActStatus = "";
        scriptAction.switchToDefault();

        for (int iCounter = 0; iCounter < 10; iCounter++) {

            //Click on Refresh Button
            scriptAction.waitUntilElementIsVisible(btnRefresh, ApplicationConstants.LONG_TIMEOUT);
            scriptAction.clickElement(btnRefresh);

            //Wait for Refresh Button to be displayed
            scriptAction.waitUntilElementIsVisible(btnRefresh, ApplicationConstants.LONG_TIMEOUT);

            //Get Current Status
            sActStatus = scriptAction.getText(locLblStatus);
            if (sTransactionStatus.equals(sActStatus)) return true;

            //Wait for some time
            CommonUtil.waitUntilTime(ApplicationConstants.SHORT_TIMEOUT);
        }
        logger.error(String.format("Status as not been updated as expected. Expected %1$s and Actual %2$s", sTransactionStatus, sActStatus));
        return false;
    }

    public void selectRecordFromTable(String sRecordValue) {
        //Check the record is displayed in the table
        By locLblTableRecord = By.xpath(String.format(lblTableRecord, sRecordValue));
        scriptAction.waitUntilElementIsVisible(locLblTableRecord, ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s record is not visible in the table. Please provide valid record name", sRecordValue));
        //Select the record
        By locLblTableSelectRecord = By.xpath(String.format(lblTableSelectRecord, sRecordValue));
        scriptAction.waitUntilElementIsVisible(locLblTableSelectRecord, ApplicationConstants.MEDIUM_TIMEOUT);
        scriptAction.clickElement(locLblTableSelectRecord);

        //Check the checkbox
        By locChkTableSelectRecord = By.xpath(String.format(chkTableSelectRecord, sRecordValue));
        for (int iCounter = 0; iCounter < 10; iCounter++) {
            //Check if the row is selected
            String sAttribute = scriptAction.getAttribute(tblSecondRow, "aria-selected");
            if (sAttribute.equals("true")) break;
            try {
                scriptAction.clickElement(locChkTableSelectRecord);
            } catch (ElementClickInterceptedException e) {
            }
        }
    }

    public void lookUpRecords(String sValue) {
        scriptAction.switchToDefault();

        //Verify Look up records section is displayed
        scriptAction.waitUntilElementIsVisible(secLookUpRecords, ApplicationConstants.MEDIUM_TIMEOUT, "Look Up Records section is not displayed to search an item.");

        //Enter search value
        scriptAction.waitUntilElementIsVisible(txtLookUpSearchBox, ApplicationConstants.MEDIUM_TIMEOUT, "Look Up Records search text box is not displayed.");
        scriptAction.inputText(txtLookUpSearchBox, sValue);

        //Wait for the search item displayed
        By locLookUpSearchItem = By.xpath(String.format(sLookUpSearchItem, sValue));
        scriptAction.waitUntilElementIsVisible(locLookUpSearchItem, ApplicationConstants.MEDIUM_TIMEOUT, String.format("Search item is not displayed in LookUp Records. Item:%s", sValue));
        //Select the item
        scriptAction.waitTillClickableAndClick(locLookUpSearchItem, ApplicationConstants.MEDIUM_TIMEOUT);
        //Click on Add button
        scriptAction.clickElement(btnLookUpAdd);
    }

    public void filterBy(String sColumnName, String sFilterByValue) {
        clickOnColumnName(sColumnName);

        //Click on Filter By button
        scriptAction.clickElement(btnFilterBy);

        //wait for Filter By value text field
        scriptAction.waitUntilElementIsVisible(txtFilterByValue, ApplicationConstants.MEDIUM_TIMEOUT, "Filter By value is not displayed");
        //Enter value in Filter By value text field
        scriptAction.inputText(txtFilterByValue, sFilterByValue);
        //Click on Apply
        scriptAction.waitUntilElementIsVisible(btnFilterApply, ApplicationConstants.MEDIUM_TIMEOUT, "Apply Button is not enabled/displayed in Filter By dialog");
        scriptAction.clickElement(btnFilterApply);
    }

    private void clickOnColumnName(String sSelectColumn) {
        //wait until Column Name is displayed
        scriptAction.waitUntilElementIsVisible(By.xpath(String.format(drpTblColumnName, sSelectColumn)), ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s column name is not displayed", sSelectColumn));
        //Click on Column Name
        scriptAction.clickElement(By.xpath(String.format(drpTblColumnName, sSelectColumn)));
        //Wait until Filter By button is displayed
        scriptAction.waitUntilElementIsVisible(btnFilterBy, ApplicationConstants.MEDIUM_TIMEOUT, "Filter By button is not displayed");
        logger.info(String.format("%s column name is displayed", sSelectColumn));
    }

    public void editTableRecord(String recordName) {
        selectRecordFromTable(recordName);
        scriptAction.waitTillClickableAndClick(btnEditContract, ApplicationConstants.MEDIUM_TIMEOUT);
        waitForPageToBeDisplayed(recordName);
    }

    //Select auto fill dropdown values
    public void selectValuesFromAutoFillDropdown(String sLabelName, String sValue) {
        By inputBox = By.xpath(String.format(txtAutofill, sLabelName));
        scriptAction.waitUntilElementIsVisible(inputBox, ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s lable is not displayed. Please provide a valid label name", sLabelName));
        //click and enter dropdown value
        scriptAction.clickElement(inputBox);
        scriptAction.inputText(inputBox, sValue);
        //Clicking on search icon
        scriptAction.waitTillClickableAndClick(By.xpath(String.format(btnAutofillSearch, sLabelName)), ApplicationConstants.SHORT_TIMEOUT);
        //wait and select the value
        By drpValue = By.xpath(String.format(drpAutofill, sValue));
        scriptAction.waitUntilElementIsVisible(drpValue, ApplicationConstants.MEDIUM_TIMEOUT, String.format("%s value is invalid please provide correct value", sValue));
        scriptAction.clickElement(drpValue);
    }
}
