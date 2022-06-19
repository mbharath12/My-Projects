package com.technomile.grc.testcases;

import com.technomile.grc.pages.*;
import com.technomile.grc.reporting.ExtentTestManager;
import com.technomile.grc.support.ExcelDataReader;
import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Map;

public class TC01_ClausesFlowDown extends BaseTest {

    String sContractName = "";
    Map<String, Map<String, String>> farClauseTestData;
    String sTestCaseName = "TC01";


    @Test(description = "Clauses Flow Down")
    public void clausesFlowdown() {

        //Login to Application
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.loginToApplication(configurationDetails.getUserName(), configurationDetails.getPassword())
                .validateUserIsLoggedIn();
        ExtentTestManager.getTest().pass("Logged in to application");

        //Select Compliance Application
        LandingPage landingPage = new LandingPage(getDriver());
        landingPage.selectCompliance();
        ExtentTestManager.getTest().pass("Compliance Product is selected");
        CreateSubcontract();



        //Test Data
        //xlGRCFile = new ExcelDataReader(configurationDetails.getTestDataFileLocation());

        //Create Quick Contract
        //createContract();

        //Navigate to Edit Clauses, Add FAR Clauses
        // farClauseTestData = xlGRCFile.getExcelMultipleRowValuesIntoMapBasedOnKey("FARClause", sTestCaseName);
        //addNEditFARClauses();


        //Edit FAR Clause and update Flowdown details



    }

    public void CreateSubcontract() {
        //Select Subcontracts from Site Entity
        BasePage basePage = new BasePage(getDriver());
        basePage.selectSiteEntity("Subcontracts", "Active Subcontract");

        //Subcontracts Class Object
        SubcontractPage subcontractsPage = new SubcontractPage(getDriver());
        subcontractsPage.clickOnNew();
        basePage.waitForPageToBeDisplayed( "New Subcontract");





        //contractsPage.clickOnCreateContracts();

        //Read test data for Contracts
        //Map<String, String> objContract = xlGRCFile.getExcelRowValuesIntoMapBasedOnKey("QuickCreateContract", sTestCaseName);
        // sContractName = objContract.get("ContractName");

        //Create Contract
        // contractsPage.quickCreateContract(objContract);
    }


}
