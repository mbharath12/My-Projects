package com.technomile.grc.support;

import com.technomile.grc.beans.EmailCredentials;
import com.technomile.grc.config.EmailConfig;
import com.technomile.grc.constants.ApprovalProcess;
import org.aeonbits.owner.ConfigFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

public class GRCUtils {
    private static Logger logger = LoggerFactory.getLogger(GRCUtils.class);

    public final DecryptData decryptData = new DecryptData();

    public String readEmailAndGetLink(String subject, String approverType, ApprovalProcess process) {
        String elementAttribute = "href";
        EmailCredentials emailCredentials = getApprover(approverType);
        //search email before 20 secs
        Date startTimeOfSearch = new Date(System.currentTimeMillis() - 20 * 1000);
        String body = MailReader.getMessageContentFromOutlook(subject, startTimeOfSearch, emailCredentials.getEmailUserName(), decryptData.decryptDataValue(emailCredentials.getEmailPassword()));
        if (body == null) {
            throw new AssertionError("Email body not found. Please check email configuration and log errors");
        }
        StringBuilder cssQuery = new StringBuilder();
        cssQuery.append(String.format("a.%s", process.getApprovalType()));
        return HTMLSourceParser.getElementAttributeFromHTMLPageSource(body, cssQuery.toString(), elementAttribute);
    }

    private EmailCredentials getApprover(String approverType) {
        EmailCredentials credentials = new EmailCredentials();
        EmailConfig emailConfig = ConfigFactory.create(EmailConfig.class);
        if (emailConfig.approver1().equalsIgnoreCase(approverType)) {
            credentials.setEmailUserName(emailConfig.user1Name());
            credentials.setEmailPassword(emailConfig.user1Password());
        } else if (emailConfig.approver2().equalsIgnoreCase(approverType)) {
            credentials.setEmailUserName(emailConfig.user2Name());
            credentials.setEmailPassword(emailConfig.user2Password());
        } else if (emailConfig.approver3().equalsIgnoreCase(approverType)) {
            credentials.setEmailUserName(emailConfig.user3Name());
            credentials.setEmailPassword(emailConfig.user3Password());
        } else {
            throw new IllegalArgumentException(String.format("Invalid approver type: %s. Please check email.properties file", approverType));
        }
        return credentials;
    }
}
