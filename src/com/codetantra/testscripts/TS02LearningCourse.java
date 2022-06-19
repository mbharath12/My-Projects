package com.codetantra.testscripts;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;

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

public class TS02LearningCourse {
	public static boolean bstatus;
	ExtentHtmlReporter htmlReporter;
	ExtentReports extent;
	ExtentTest test;
	Map<Object, Object> cred = null;

	@BeforeTest
	public boolean setUP() throws FileNotFoundException, IOException{

		// Extent  Report logo creation and Load setting
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

		//************ Validate Login Functionality *****************//
		test = extent.createTest("Login", "<pre> "+"Login in to Application"+"</pre>");
		bstatus = ApplicationFunctions.loginToApplication(setupDetails);
		if(!bstatus) {
			test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.RED)).fail("Unable to Login in to Application"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
			return false;
		}
		test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.GREEN)).pass("Login in to Application successfully");
		return true;
	}

	@Test
	public void Test() throws IOException{

		//**********Validate Expired Courses***********//
		test = extent.createTest("Expired Courses", "<pre> "+"Validate Expired Courses"+"</pre>");
		bstatus = ApplicationFunctions.doValidateExpiredCourses();
		if(!bstatus) {
			test.log(Status.INFO, MarkupHelper.createLabel("Validate Expired Courses", ExtentColor.RED)).fail("Expired Courses are Not verified successfully"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());

		}
		test.log(Status.INFO, MarkupHelper.createLabel("Validate Expired Courses", ExtentColor.GREEN)).pass("Expired Courses are verified successfully");

		//***********Verify Course Title  and description *****************//
		test = extent.createTest("Course Title_Description", "<pre> "+"Verify Course Title and description "+"</pre>");
		bstatus = ApplicationFunctions.doVerifyCourseTitleandDes();
		if(!bstatus) {
			test.log(Status.INFO, MarkupHelper.createLabel("Verify Course Title and description", ExtentColor.RED)).fail("Verify Course Title and description Not verified successfully"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());

		}
		test.log(Status.INFO, MarkupHelper.createLabel("Verify Course Title and description", ExtentColor.GREEN)).pass("Verify Course Title and description are verified successfully");
		
		//**************** Validate Course Status Progress Bar *********************//
		test = extent.createTest("Course Status Progress Bar", "<pre> "+"Validate Course Status Progress Bar"+"</pre>");
		Map<String, String>mapstatusbar = ApplicationFunctions.VerifyCoursestatusProgressbar();
		if(!bstatus) {
			test.log(Status.INFO, MarkupHelper.createLabel("Validate Course Status Progress Bar", ExtentColor.RED)).fail("Verify Course Title and description Not verified successfully"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());

		}
		test.log(Status.INFO, MarkupHelper.createLabel("Validate Course Status Progress Bar", ExtentColor.GREEN)).pass("Verify Course Title and description are verified successfully"+mapstatusbar);
	}

	@AfterTest
	public void AfterTest(){
		extent.flush();
		CommonFunctions.closeBrowser(Global.driver);
	}
}
