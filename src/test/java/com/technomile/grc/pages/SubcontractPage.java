package com.technomile.grc.pages;
import com.technomile.grc.constants.ApplicationConstants;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

    public class SubcontractPage<sText> extends BasePage {
        private static Logger logger = LoggerFactory.getLogger(SubcontractPage.class);

        public SubcontractPage(WebDriver driver) {
            super(driver);
        }

        private By btnNew = By.xpath("//button[contains(@id, 'NewRecord')],");
        private By txtContractName = By.xpath("//input[contains(@id, 'contractvehicle')]");
       // private By txtProjectId = By.xpath("//input[contains(@id, 'costpointprojectid')]");

        public boolean clickOnNew() {
            //Check CreateSubContract button is displayed
            boolean bStatus = scriptAction.isElementPresent(btnNew);
            if (!bStatus) {
                logger.error("New button is not displayed in Subcontracts page");
                return false;
            }
            //Click on New button
            scriptAction.clickElement(btnNew);

            //wait until subcontract page is displayed
            waitForEntityPageToBeDisplayed("New Subcontract");

            return true;
        }



        {


        }


            }


