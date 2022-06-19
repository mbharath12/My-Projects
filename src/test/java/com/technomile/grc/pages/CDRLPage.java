package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import com.technomile.grc.utils.CommonUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;

public class CDRLPage extends BasePage {

    private static Logger logger = LoggerFactory.getLogger(CDRLPage.class);

    private By frameCDRLPage = By.id("WebResource_CDRL");
    private By btnLookUpRecordsCancel = By.id("lookupDialogCancelBtnFooter");
    private By btnLookUpRecordsAdd = By.id("lookupDialogSaveBtn");
    private By ckbCategoryTM = By.id("TM");
    private By ckbCategoryTDP = By.id("TDP");

    private By btnNewCdrl = By.xpath("//input[@value='New CDRL']");
    private By btnGrowthSearch = By.xpath("//button[@ng-click='OpenLookupOpportunity()']");
    private By txtLookOpportunity = By.xpath("//input[@data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_textInputBox_with_filter_new']");
    private By btnOpportunitySearch = By.xpath("//button[@data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_search']");
    private By lblNoRecords = By.xpath("//label[contains(@id,'_No_Records_Text')]");
    private By lblLookUpRecord = By.xpath("//span[@class='pa-ho ']");
    private By dropdownCDRL = By.xpath("//select[@ng-model='SelectedCdRlName']");
    private By txtGrownopportunity = By.xpath("//input[@ng-model='OpportunityTitle']");
    private By btnCreateCDRL = By.xpath("//input[@value='Create CDRL']");
    private By btnUploadCdrl = By.xpath("//input[@value='Upload CDRL']");
    private By lblCDRLStatus = By.xpath("//div[contains(@id,'headerControlsList')]");
    private By txtDepartmentManager = By.xpath("//input[contains(@data-id,'clm_departmentmanager')]");
    private By btnSave = By.xpath("//button[@data-id='clm_cdrl|NoRelationship|Form|Mscrm.Form.clm_cdrl.Save']");
    private By btnSendApproval = By.xpath("//button[@data-id='clm_cdrl|NoRelationship|Form|clm.clm_cdrl.SendForApproval.Button']");
    private By lblDeptManager = By.xpath("//div[@data-id='clm_departmentmanager.fieldControl-LookupResultsPopup_clm_departmentmanager_infoContainer']");

    private String sCDRLName = "//h1[@title='%s']";
    private String tblApprovalStatus = "//table[@class='table table-striped FixedHeadertable table-striped-bg approvalStatusTbl']//tr";

    public CDRLPage(WebDriver driver) {
        super(driver);
        logger.info("Loading CDRL page...");
        scriptAction.waitUntilElementIsVisible(
                frameCDRLPage
                , ApplicationConstants.MEDIUM_TIMEOUT
                , "CDRL is not displayed");
    }

    //Click on NewCDRL button in Create CDRL page
    public CDRLPage clickOnNewCDRL() {
        scriptAction.switchToFrame(frameCDRLPage);
        scriptAction.waitUntilElementIsVisible(btnNewCdrl, ApplicationConstants.MEDIUM_TIMEOUT, "New CDRL button is not visible for Contract");
        scriptAction.clickElement(btnNewCdrl);
        logger.debug("New CDRL button is clicked");
        return this;
    }

    //Create new CDRL request
    public CDRLPage createNewCDRLRequest(String sGrowthOpportunity) {
        scriptAction.waitUntilElementIsVisible(txtGrownopportunity, ApplicationConstants.MEDIUM_TIMEOUT, "Create/Edit CDRL panel is not visible");
        scriptAction.inputText(txtGrownopportunity,sGrowthOpportunity);
        scriptAction.clickElement(ckbCategoryTM);
        scriptAction.clickElement(ckbCategoryTDP);
        scriptAction.clickElement(btnCreateCDRL);
        logger.info("Creating CDRL request");
        return this;
    }

    //Search  opportunity records for grown search
    public CDRLPage searchLookUpRecords(String sOpportunity) {
        scriptAction.waitUntilElementIsVisible(txtLookOpportunity, ApplicationConstants.MEDIUM_TIMEOUT, "Look Opportunity textbox is not visible for Contract");
        scriptAction.inputText(txtLookOpportunity, sOpportunity);
        scriptAction.clickElement(btnOpportunitySearch);
        logger.info(String.format("%s Searched for grown opportunity record",sOpportunity));
        return this;
    }

    //get  the error message if Opportunity is not available
    public void validateLookUpRecordsIsDisplayed() {
        boolean bStatus = scriptAction.isElementVisible(lblLookUpRecord, ApplicationConstants.MEDIUM_TIMEOUT);
        if (!bStatus) {
            String sErrorMsg = scriptAction.getText(lblNoRecords);
            scriptAction.clickElement(btnLookUpRecordsCancel);
            Assert.fail(String.format("Grow Opportunity search failed : %s", sErrorMsg));
        }
    }

    //Get the New CDRL number
    public String getCDRLNumber(){
        int irow = scriptAction.getMatchingXpathCount(By.xpath(tblApprovalStatus));
        String sCDRLNoRow = String.format(tblApprovalStatus + "[%s]/td[1]", irow);
        String sCDRLno = scriptAction.getText(By.xpath(sCDRLNoRow));
        return sCDRLno;
    }

    //Get created CDRl status
    private String getCDRLStatus(){
        int irow = scriptAction.getMatchingXpathCount(By.xpath(tblApprovalStatus));
        String sCDRLActionRow = String.format(tblApprovalStatus + "[%s]/td[3]", irow);
        String sCDRLAction = scriptAction.getText(By.xpath(sCDRLActionRow));
        return sCDRLAction;
    }

    //Validate created CDRL request status for the CDRL
    public void verifyCDRLnumberisGenerated() {
        String sCDRLno = getCDRLNumber();
        if (sCDRLno == null)
            Assert.fail("CDRL is not created for the Contract");
    }

    //Validate created CDRL request status for creation
    private void validateCDRLStatus(String sCDRLStatus) {
        String sCDRLAction = getCDRLStatus();
        if (!sCDRLAction.equalsIgnoreCase(sCDRLStatus))
            Assert.fail("CDRL status should be " + sCDRLStatus + " but Current Status is:" + sCDRLAction);
    }

    //Verify CDRL status on submit page
    private void validateCDRLSubmitStatus(String sCDRLStatus) {
        String sCDRLAction = scriptAction.getText(lblCDRLStatus);
        if (!sCDRLAction.contains(sCDRLStatus))
            Assert.fail("CDRL status should be " + sCDRLStatus + "Current Status:" + sCDRLAction);
    }

    //Open CDRL information page by clicking CDRL number
    public CDRLPage openCDRLInformation() {
        int irow = scriptAction.getMatchingXpathCount(By.xpath(tblApprovalStatus));
        scriptAction.clickElement(By.xpath(String.format(tblApprovalStatus + "[%s]/td[1]", irow)));
        CommonUtil.waitUntilTime(ApplicationConstants.SHORT_TIMEOUT);
        scriptAction.switchToNewWindow();
        logger.info("New CDRL request window is opened..");
        return this;
    }

    //Validate the CDRL submit status in CDRL information page
    public void valiadteCDRlSubmitStatus(String status) {
        String sCDRLno = getCDRLNumber();
        scriptAction.waitUntilElementIsVisible(By.xpath(String.format(sCDRLName, sCDRLno)), ApplicationConstants.MEDIUM_TIMEOUT, String.format("%S CDRL information page is not opened", sCDRLno));
        validateCDRLSubmitStatus(status);
        logger.debug("CDRl request submit status");
    }

    //Process the CDRL flow by entering the deparment manager and save the CDRL flow
    public CDRLPage processCDRLWithManagerDetails(String sDeptManager) {
        scriptAction.waitUntilElementIsVisible(txtDepartmentManager,ApplicationConstants.MEDIUM_TIMEOUT, String.format("Department Manager is not visible CDRL General"));
        scriptAction.inputText(txtDepartmentManager, sDeptManager);
        scriptAction.waitUntilElementIsVisible(lblDeptManager, ApplicationConstants.MEDIUM_TIMEOUT, String.format("%S Department Manager is not visible in search for CDRL", sDeptManager));
        scriptAction.clickElement(lblDeptManager);
        scriptAction.clickElement(btnSave);
        logger.debug("Added CDRL DepartManager and save CDRL");
        return this;
    }

    //send CDRL request for approval
    public CDRLPage sendForApproval() {
        scriptAction.clickElement(btnSendApproval);
        scriptAction.waitForAlert(ApplicationConstants.SHORT_TIMEOUT);
        scriptAction.acceptAlert();
        logger.info("CDRL is submitted for approval");
        return this;
    }
}
