package com.codetantra.testscripts;

import java.io.IOException;
import java.util.Map;

import org.testng.Assert;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.MediaEntityBuilder;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.markuputils.ExtentColor;
import com.aventstack.extentreports.markuputils.MarkupHelper;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.codetantra.lib.ApplicationFunctions;
import com.codetantra.lib.CommonFunctions;
import com.codetantra.variables.Global;
import com.data.framework.lib.Messages;
import com.data.framework.lib.Utilities;

public class TS05QuickQuestionAccessinSliderPanel {
	
	public static boolean bstatus;
	ExtentHtmlReporter htmlReporter;
	ExtentReports extent;
	ExtentTest test;
	Map<Object, Object> cred = null;

	@BeforeTest
	public boolean getReport() throws IOException {
		CommonFunctions.extentReportLogoCreator(Global.confgXmlFile, Global.logo);		
		extent = CommonFunctions.loadExtentSettings(htmlReporter, extent, test, Global.propertyFile);
		test = extent.createTest("Staging Application", "<pre> Open Browser"+"</pre>");

		Map<String,String> setupDetails = Utilities.readTestData(Global.sGlobalLoginTestData, Global.sGlobalLoginTestDataSheetName, "Y");
		String url = setupDetails.get("URL");
		String browserName= setupDetails.get("Browser");
		String environment = setupDetails.get("Environment");

		//****************Open Browser*********************//
		if(browserName.equalsIgnoreCase("HeadLess Chrome")) {
			Global.driver = CommonFunctions.openChromeHeadLessBrowser(url, Global.sChromeBrowserName,environment);
			if(Global.driver == null){
				test.log(Status.INFO, MarkupHelper.createLabel("Launch Staging Application", ExtentColor.RED)).fail("Unable to launch Staging Application. "+Messages.errorMsg);
				return false;
			}
			test.log(Status.INFO, MarkupHelper.createLabel("Launch Staging Application", ExtentColor.GREEN)).pass("Staging Application is Launched successfully");
		}else {
			Global.driver = CommonFunctions.openBrowser(Global.url, Global.sChromeBrowserName,environment);
			if(Global.driver == null){
				test.log(Status.INFO, MarkupHelper.createLabel("Launch Staging Application", ExtentColor.RED)).fail("Unable to launch Staging Application. "+Messages.errorMsg);
				return false;
			}
			test.log(Status.INFO, MarkupHelper.createLabel("Launch Staging Application", ExtentColor.GREEN)).pass("Staging Application is Launched successfully");
		}

		test = extent.createTest("Login", "<pre> "+"Login in to Application"+"</pre>");
		bstatus = ApplicationFunctions.loginToApplication(setupDetails);
		if(!bstatus)
		{
			test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.RED)).fail("Unable to Login in to Application"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
			return false;
		}
		test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.GREEN)).pass("Login in to Application successfully");
		return true;

	}

	@Test
	public void Test1() throws IOException {

		test = extent.createTest("Validate Quick Access Slider", "<pre> "+"Verify Question Description"+"</pre>");
		bstatus = ApplicationFunctions.doVerifyQuestionDescriptionAndJumpToAnotherQuestionInQuickAccessSliderPanel();
		if(!bstatus) {
			test.log(Status.INFO, MarkupHelper.createLabel("Verify Question Description And Jump To Another Question In Quick Access Slider Panel", ExtentColor.RED)).fail("Unable to Verify Question Description And Jump To Another Question In Quick Access Slider Panel"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
			Assert.fail();
		}
		test.log(Status.INFO, MarkupHelper.createLabel("Verify Question Description And Jump To Another Question In Quick Access Slider Panel", ExtentColor.GREEN)).pass("successfully Verified Question Description And Jump To Another Question In Quick Access Slider Panel");
	}
	@AfterTest
	public void AfterTest(){
		extent.flush();
		CommonFunctions.closeBrowser(Global.driver);
	}
}
