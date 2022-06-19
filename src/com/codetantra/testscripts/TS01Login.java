package com.codetantra.testscripts;

import java.io.FileNotFoundException;
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

public class TS01Login {
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
		return true;
	}

	@Test(priority = 1)
	public void Test() throws IOException{

		//Read Test data from Excel file
		Map<String, Map<String, String>> mapAllDetails = Utilities.readMultipleTestData(Global.sLoginTestDataFile,"Login","Y");
		for(int index = 1;index <= mapAllDetails.size();index++){
			Map<String, String> maploginDetails = mapAllDetails.get("Row"+index);
			
			//************************* Validate Login Functionality **************************//
			if(maploginDetails.get("Login") !=null && maploginDetails.get("Login").equalsIgnoreCase("Yes")) {
				test = extent.createTest(""+maploginDetails.get("TestCaseName")+"_Login", "<pre> "+maploginDetails.get("Comments")+""+"</pre>");
				bstatus = ApplicationFunctions.loginToApplication(maploginDetails);
				if(!bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.RED)).fail("Unable to Login in to Application"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
				if(!bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.GREEN)).pass("Negative testcase-Cannot perform to Login");
					continue;
				}
				if(bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.GREEN)).pass("Login in to Application successfully");
					bstatus = ApplicationFunctions.logoutFromApplication();
					if(!bstatus){
						test.log(Status.INFO, MarkupHelper.createLabel("Logout from Application", ExtentColor.RED)).fail("Unable to Logout from Application"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
						Assert.fail(Messages.errorMsg);
					}
					test.log(Status.INFO, MarkupHelper.createLabel("Logout from Application", ExtentColor.GREEN)).pass("Successfully logged out from Application.");
					continue;
				}
				if(bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.RED)).fail("Able to Login in to Application with negative Scenario", MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					bstatus = ApplicationFunctions.logoutFromApplication();
					continue;
				}
			}
		//*********************** Validate Blocked User ****************************//
			if(maploginDetails.get("Blocked User") !=null && maploginDetails.get("Blocked User").equalsIgnoreCase("Yes")) {
				test = extent.createTest(""+maploginDetails.get("TestCaseName")+"_Blocked User", "<pre> "+maploginDetails.get("Comments")+""+"</pre>");
				bstatus = ApplicationFunctions.loginToApplication(maploginDetails);
				if(!bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Verify Blocked User", ExtentColor.RED)).fail("Blocked User are not Verified successfully"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
				if(!bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Verify Blocked User", ExtentColor.GREEN)).pass("Negative testcase-Cannot perform to Login Blocked User");
					bstatus = ApplicationFunctions.logoutFromApplication();
					continue;
				}
				if(bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Verify Blocked User", ExtentColor.GREEN)).pass("Blocked User Verified successfully");
					continue;
				}
				if(bstatus && maploginDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Verify Blocked User", ExtentColor.RED)).fail("Blocked User Able to Login  Application with negative Scenario", MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					bstatus = ApplicationFunctions.logoutFromApplication();
					continue;
				}
			}
			
			//********************* Validate Forget Password ******************************//
			if(maploginDetails.get("Forget Password")!=null && maploginDetails.get("Forget Password").equalsIgnoreCase("Yes")) {
				test = extent.createTest(""+maploginDetails.get("TestCaseName")+"_Forget Password", "<pre> "+maploginDetails.get("Comments")+""+"</pre>");
				bstatus = ApplicationFunctions.doValiadteforgotPassword();
				if(!bstatus) {
					test.log(Status.INFO, MarkupHelper.createLabel("Validate Forget Password", ExtentColor.RED)).fail("Forget Password is Not validated successfully"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
				test.log(Status.INFO, MarkupHelper.createLabel("Validate Forget Password", ExtentColor.GREEN)).pass("Forget Password is validated successfully");
				continue;
			}
		}
		//*************************** Verify no of active users logged in system ******************//
		test = extent.createTest("Active users logged in system", "<pre> "+"Active users logged in system"+"</pre>");
		Map<String, String> maploggeduser = ApplicationFunctions.doVerifyUserLoginCount();
		if(maploggeduser==null || maploggeduser.isEmpty()) {
			test.log(Status.INFO, MarkupHelper.createLabel("Active users logged in system", ExtentColor.RED)).fail("Active user are not available"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
		}
		test.log(Status.INFO, MarkupHelper.createLabel("Active users logged in system", ExtentColor.GREEN)).pass("Active user are available and please find the Top 5 list --"+maploggeduser);
	}

	@AfterTest
	public void AfterTest(){
		extent.flush();
		CommonFunctions.closeBrowser(Global.driver);
	}
}
