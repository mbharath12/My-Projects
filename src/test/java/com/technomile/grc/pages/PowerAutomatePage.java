package com.technomile.grc.pages;

import com.technomile.grc.constants.ApplicationConstants;
import com.technomile.grc.constants.ApprovalProcess;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PowerAutomatePage extends BasePage {

    public PowerAutomatePage(WebDriver driver) {
        super(driver);
    }

    public void readEmailAndDoApprovalProcessForCDRL(final String approver, final String emailSubject, final ApprovalProcess action, final String comment) {
        String url = grcUtils.readEmailAndGetLink(approver, emailSubject, action);
        this.scriptAction.openNewWindowWithURL(url);
        scriptAction.waitUntilElementIsVisible(By.xpath("//label[text()='Add a comment (optional)']/../div/textarea"), ApplicationConstants.MEDIUM_TIMEOUT);
        scriptAction.clickElement(By.xpath("//label[text()='Add a comment (optional)']/../div/textarea"));
        scriptAction.clearAndInputText(By.xpath("//label[text()='Add a comment (optional)']/../div/textarea"), comment);
        scriptAction.clickElement(By.xpath("//span[text()='Cancel']"));
        scriptAction.closeCurrentWindow();
    }
}
