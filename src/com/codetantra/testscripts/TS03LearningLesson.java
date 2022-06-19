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

public class TS03LearningLesson {
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
	public void test() throws IOException{
		Map<String, Map<String, String>> mapAllDetails = Utilities.readMultipleTestData(Global.sLoginTestDataFile,"QuestionsTypes","Y");
		for(int index = 1;index <= mapAllDetails.size();index++){
			Map<String, String> mapquestionsDetails = mapAllDetails.get("Row"+index);
			
			//**************** Verify Lesson Status Bar *******************//
			if(mapquestionsDetails.get("Functionality") !=null && mapquestionsDetails.get("Functionality").equalsIgnoreCase("Lesson Status Bar")) {
				test = extent.createTest(""+mapquestionsDetails.get("TestCaseName")+"_Lesson Status Bar", "<pre> "+"Validate Lesson Status Bar"+"</pre>");
				
				
				Map<String,String>maplessonStatus = ApplicationFunctions.doVerifyLessonStatusbar(mapquestionsDetails);
				if(maplessonStatus==null) {
					bstatus = false;
				}
				if(!bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Status Bar", ExtentColor.RED)).fail("Unable to Verify  Lesson Status Bar"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
				if(!bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Status Bar", ExtentColor.GREEN)).pass("Negative testcase-Cannot perform to Verify Lesson Status Bar--"+maplessonStatus);
					continue;
				}
				if(bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Status Bar", ExtentColor.GREEN)).pass("Lesson Status Bar is verifed validated  successfully--"+maplessonStatus);
					continue;
				}
				if(bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Status Bar", ExtentColor.RED)).fail("Able to validate Lesson Status Bar with negative Scenario--"+maplessonStatus, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
			}
			
			//********************* Verify Sequential Lesson or  Random Lesson ************** //
			if(mapquestionsDetails.get("Functionality") !=null && mapquestionsDetails.get("Functionality").equalsIgnoreCase("Lesson Type")) {
				test = extent.createTest(""+mapquestionsDetails.get("TestCaseName")+"_Lesson Type", "<pre> "+"Validate Lesson Type"+"</pre>");
				
				Map<String,String>maplessonStatus =ApplicationFunctions.doValidateLessonType(mapquestionsDetails);
				if(maplessonStatus==null) {
					bstatus = false;
				}
				if(!bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Type", ExtentColor.RED)).fail("Unable to Verify  Lesson Type"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
				if(!bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Type", ExtentColor.GREEN)).pass("Negative testcase-Cannot perform to Verify Lesson Typer--"+maplessonStatus);
					continue;
				}
				if(bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Type", ExtentColor.GREEN)).pass("Lesson Type is verifed validated  successfully--"+maplessonStatus);
					continue;
				}
				if(bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Lesson Type", ExtentColor.RED)).fail("Able to validate Lesson Type with negative Scenario--"+maplessonStatus, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
			}
		}
	}

	@AfterTest
	public void AfterTest(){
		extent.flush();
		CommonFunctions.closeBrowser(Global.driver);
	}
}
