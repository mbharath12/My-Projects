package com.technomile.grc.testcases;

import com.technomile.grc.beans.ConfigurationDetails;
import com.technomile.grc.constants.ApplicationConstants;
import com.technomile.grc.listeners.CustomNGListener;
import com.technomile.grc.listeners.RetryAnalyzerListener;
import com.technomile.grc.reporting.ExtentManager;
import com.technomile.grc.reporting.ExtentTestManager;
import com.technomile.grc.support.BrowserFactory;
import com.technomile.grc.support.ExcelDataReader;
import com.technomile.grc.support.FilesHelper;
import com.technomile.grc.utils.ConfigurationDetailsUtil;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.ITestContext;
import org.testng.annotations.*;

import java.lang.reflect.Method;

@Listeners({CustomNGListener.class, RetryAnalyzerListener.class})
public class BaseTest extends BrowserFactory {
    private static Logger logger = LoggerFactory.getLogger(BaseTest.class);

    protected static ConfigurationDetails configurationDetails;
    protected static ExcelDataReader xlGRCFile = null;

    //execute the static block first
    static {
        configurationDetails = ConfigurationDetailsUtil.getInstance().getConfigurationDetails();
        xlGRCFile = new ExcelDataReader(configurationDetails.getTestDataFileLocation());
    }

    @BeforeSuite(alwaysRun = true)
    public void setUpSuite() {
        logger.debug("initializing logs and reports, creating directories for test runs ....");
        createDirectories();
        ExtentManager.initExtentReport(configurationDetails);
    }

    @AfterSuite(alwaysRun = true)
    public void tearDownSuite() {
        ExtentManager.getInstance().flush();
        logger.debug("in suite teardown..");
    }

    @BeforeMethod(alwaysRun = true)
    public void setUp(ITestContext iTestContext, Method method) {
        logger.info("test started: " + method.getName());
        ExtentTestManager.startTest(method.getName());

        startSession(configurationDetails.getBrowserDetails());
        getDriver().manage().window().maximize();
        iTestContext.setAttribute("driver", getDriver());
        iTestContext.setAttribute("test-name", method.getName());
    }

    @AfterMethod(alwaysRun = true)
    public void teardown(ITestContext iTestContext, Method method) {
        WebDriver driver = BrowserFactory.getDriver();
        if (driver != null) {
            closeSession();
        }
        ExtentTestManager.endTest();
        logger.info("test ended: " + method.getName());
    }

    private void createDirectories() {
        FilesHelper.createDirectory(ApplicationConstants.REPORTS_FILE_PATH);
        FilesHelper.createDirectory(ApplicationConstants.SCREENSHOTS_DIR);
    }
}