package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import com.technomile.grc.utils.CommonUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class ContractsClausesPage extends BasePage {
    private static Logger logger = LoggerFactory.getLogger(ContractsMainPage.class);

    private By frameContractClause = By.id("WebResource_ClauseImplementation");
    private By btnEditClause = By.xpath("//input[@value='Edit' and @class='btn btn-primary']");
    private By rdbFARYes = By.id("rdbFarYes");
    private By rdbFARNo = By.id("rdbFarNo");
    private By btnSelectFARClauses = By.xpath("//div[@options='clm_FARclausesData']//button");
    private By drpSelect = By.xpath("//ul[@class='dropdown-menu dropdown-menu-form ng-scope']");
    private By dlgUpdateClauseDts = By.xpath("//div[@class='modal fade in' and @id='myModal']");
    private By btnSelectFlowdown = By.xpath("//div[@class='modal fade in' and @id='myModal']//div[@options='DataTypesList']//button");
    private By btnClose = By.xpath("//div[@class='modal fade in' and @id='myModal']//button[@class='btn btn-default' and text()='Close']");

    private String chkFARClauseItem = "//span[text()='%s']/preceding-sibling::input";
    private String btnEditFARClause = "//label[text()='Are There Any FAR clauses?']/../..//table//td[text()='%s']/..//span[@class='glyphicon glyphicon-pencil spaceicons']";

    public ContractsClausesPage(WebDriver driver) {
        super(driver);
        logger.info("loading Contracts->Clauses page...");
    }


    public ContractsClausesPage editClauses() {
        scriptAction.waitForFrameAndSwitch(frameContractClause, ApplicationConstants.MEDIUM_TIMEOUT);
        //wait until edit button is displayed
        scriptAction.waitUntilElementIsVisible(btnEditClause, ApplicationConstants.MEDIUM_TIMEOUT, "Edit button is not displayed after clicking on clauses tab in contract page");
        scriptAction.waitTillClickableAndClick(btnEditClause, ApplicationConstants.MEDIUM_TIMEOUT);
        //Check clauses elements are enabled
        waitForFARClauseEnabled();
        //Click on 'Yes' button for sync
        scriptAction.waitTillClickableAndClick(rdbFARYes, ApplicationConstants.MEDIUM_TIMEOUT);
        return this;
    }

    private boolean waitForFARClauseEnabled() {
        for (int iCounter = 0; iCounter < 3; iCounter++) {
            boolean bStatus = scriptAction.isAttributePresent(rdbFARYes, "disabled");
            if (!bStatus) return true;
            CommonUtil.waitUntilTime(ApplicationConstants.SHORT_TIMEOUT);
        }
        return false;
    }

    public ContractsClausesPage selectFARClauses(String arrFARClauses[]) {
        //Click on Select Clause button
        scriptAction.waitUntilElementIsVisible(btnSelectFARClauses, ApplicationConstants.MEDIUM_TIMEOUT, "Select FAR Clause button is not displayed");
        scriptAction.clickElement(btnSelectFARClauses);

        //Wait for the drop down to display
        scriptAction.waitUntilElementIsVisible(drpSelect, ApplicationConstants.SHORT_TIMEOUT);
        for (int iCounter = 0; iCounter < arrFARClauses.length; iCounter++) {
            try {
                selectFARClause(arrFARClauses[iCounter]);
            } catch (Exception e) {
            }
        }
        return this;
    }

    private ContractsClausesPage selectFARClause(String sFARClause) {
        //Check the FAR Clause is displayed
        By locChkFARClauseItem = By.xpath(String.format(chkFARClauseItem, sFARClause));
        scriptAction.scrollToElement(locChkFARClauseItem);
        scriptAction.clickElement(locChkFARClauseItem);
        return this;
    }

    public ContractsClausesPage updateClauseFlowDownDetail(String sClause, String sFlowdown) {
        //Click on respective FAR Clause edit button
        By locBtnEditFARClause = By.xpath(String.format(btnEditFARClause, sClause));
        scriptAction.clickElement(locBtnEditFARClause);

        //Wait for Update Clause Details to display
        scriptAction.waitUntilElementIsVisible(dlgUpdateClauseDts, ApplicationConstants.MEDIUM_TIMEOUT);
        //Click on Select button
        scriptAction.clickElement(btnSelectFlowdown);
        //Wait for the drop down to display
        scriptAction.waitUntilElementIsVisible(drpSelect, ApplicationConstants.SHORT_TIMEOUT);

        //scriptAction.clickElement();
        return this;
    }

    public ContractsClausesPage addFARClauses(Map<String, Map<String, String>> farClauseTestData) {
        String[] arrFARList = getFARClauseList(farClauseTestData);
        selectFARClauses(arrFARList);
        return this;
    }

    private String[] getFARClauseList(Map<String, Map<String, String>> farClauseData) {
        String arrFARList[] = new String[farClauseData.size()];
        String sFARClause = "";
        for (int iCounter = 0; iCounter < farClauseData.size(); iCounter++) {
            sFARClause = farClauseData.get("Row" + (iCounter + 1)).get("FARClause");
            arrFARList[iCounter] = sFARClause;
        }
        return arrFARList;
    }
}
