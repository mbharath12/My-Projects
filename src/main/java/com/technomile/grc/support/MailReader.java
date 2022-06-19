package com.technomile.grc.support;

import com.technomile.grc.utils.CommonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.*;
import javax.mail.search.AndTerm;
import javax.mail.search.FlagTerm;
import javax.mail.search.SearchTerm;
import java.util.Date;
import java.util.Properties;

public class MailReader {
    private static Logger logger = LoggerFactory.getLogger(MailReader.class);

    private static final String OUTLOOK_IMAPS_HOST = "outlook.office365.com";
    private static final String OUTLOOK_SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";
    private static final String OUTLOOK_FALL_BACK = "false";
    private static final String OUTLOOK_IMAPS_PORT = "993";
    private static final String OUTLOOK_SOCKET_FACTORY_PORT = "993";
    private static final String PROTOCOL = "imaps";

    private static final String INBOX_FOLDER = "INBOX";
    private static final long WAIT_TILL_EMAIL_RECEIVED = 30;

    public static String getMessageContentFromOutlook(String subject, Date date, String userName, String password) {
        StringBuilder completeMessage = null;

        Properties props = System.getProperties();
        // Set mail Properties
        props.setProperty("mail.imaps.socketFactory.class", OUTLOOK_SSL_FACTORY);
        props.setProperty("mail.imaps.socketFactory.fallback", OUTLOOK_FALL_BACK);
        props.setProperty("mail.imaps.port", OUTLOOK_IMAPS_PORT);
        props.setProperty("mail.imaps.socketFactory.port", OUTLOOK_SOCKET_FACTORY_PORT);
        props.put("mail.imaps.host", OUTLOOK_IMAPS_HOST);

        try {
            Session session = Session.getDefaultInstance(System.getProperties(), null);
            Store store = session.getStore(PROTOCOL);

            store.connect(OUTLOOK_IMAPS_HOST, Integer.parseInt(OUTLOOK_IMAPS_PORT), userName, password);
            Folder inboxFolder = store.getFolder(INBOX_FOLDER);
            inboxFolder.open(Folder.READ_ONLY);

            Message[] messages = waitTillNewEmailIsRecieved(inboxFolder, subject, date);
            //will read only first message
            Message message = messages[0];

            completeMessage = new StringBuilder();
            Object msgContent = message.getContent();
            if (msgContent instanceof Multipart) {
                Multipart multipart = (Multipart) msgContent;
                for (int j = 0; j < multipart.getCount(); j++) {
                    BodyPart bodyPart = multipart.getBodyPart(j);
                    completeMessage.append(bodyPart.getContent().toString());
                }
            } else
                completeMessage.append(message.getContent().toString());

            if (completeMessage.length() == 0) {
                logger.warn("Content not found in the received email..");
                return null;
            }
            logger.info("email is read successfully..");
            return completeMessage.toString();
        } catch (Exception e) {
            logger.warn("Problem in reading email. Please find the exception: " + e.getMessage());
            return null;
        }
    }

    private static Message[] waitTillNewEmailIsRecieved(Folder folder, String sSubject, Date date) throws Exception {
        //create search criteria to read unread emails
        FlagTerm unSeen = new FlagTerm(new Flags(Flags.Flag.SEEN), false);

        //create search criteria get email with subject and date
        SearchTerm search = new SearchTerm() {
            @Override
            public boolean match(Message message) {
                try {
                    if (message.getSubject() != null && message.getSubject().equals(sSubject) && message.getSentDate().after(date)) {
                        return true;
                    }
                    return false;
                } catch (Exception e) {
                    return false;
                }
            }
        };
        //merge search criteria
        SearchTerm searchTerm = new AndTerm(search, unSeen);

        //wait for new unread emails
        int msgCount = 0;
        long timeCounter = 0;

        while (timeCounter < WAIT_TILL_EMAIL_RECEIVED) {
            msgCount = folder.search(searchTerm).length;
            if (msgCount > 0) break;
            CommonUtil.waitUntilTime(1000);
            timeCounter++;
            logger.debug(String.format("waiting for new email %d sec(s)", timeCounter));
        }

        if (msgCount == 0) {
            throw new Exception("No emails were found with the given search criteria after waiting (secs): " + WAIT_TILL_EMAIL_RECEIVED);
        }
        logger.debug("emails found with given search criteria: " + msgCount);
        return folder.search(searchTerm);
    }
}