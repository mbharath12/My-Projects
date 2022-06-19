package com.technomile.grc.constants;

import java.io.File;

public class ApplicationConstants {

    public static final String AUT = "QA";   //QA, STAGING etc.
    public static final String OS = System.getProperty("os.name");

    public static final String PROJECT_WORKING_DIR = System.getProperty("user.dir");
    public static final String AUT_PROPERTY_FILE = "application.properties";
    public static final String EMAIL_PROPERTY_FILE = "email.properties";

    public static final String EXTENT_REPORT_FILE_NAME = "Test-Automaton-Report.html";
    public static String REPORTS_FILE_PATH = PROJECT_WORKING_DIR + File.separator + "reports";
    public static final String SCREENSHOTS_DIR = REPORTS_FILE_PATH + File.separator + "screenshots";

    public static final long SHORT_TIMEOUT = 5;
    public static final long MEDIUM_TIMEOUT = 20;
    public static final long LONG_TIMEOUT = 45;

    public static final String ENCRYPT_DECRYPT_KEY = "jasypt";
}
