package com.codetantra.testscripts;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
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

public class TS15ValidateStatisticsQuestionInMember {
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

	@Test
	public void test() throws IOException{
		Map<String, Map<String, String>> mapAllDetails = Utilities.readMultipleTestData(Global.sLoginTestDataFile,"Questions Lock","Y");
		for(int index = 1;index <= mapAllDetails.size();index++){
			Map<String, String> mapquestionsDetails = mapAllDetails.get("Row"+index);
			if(mapquestionsDetails.get("Functionality") !=null && mapquestionsDetails.get("Functionality").equalsIgnoreCase("Statistics  In Member")) {

				test = extent.createTest(""+mapquestionsDetails.get("TestCaseName")+""+mapquestionsDetails.get("Functionality")+"_"+mapquestionsDetails.get("Question Type")+"", "<pre> "+"Validate "+mapquestionsDetails.get("Functionality")+" -"+mapquestionsDetails.get("Question Type")+""+"</pre>");

				Map<String,String> setupDetails = new HashMap<String, String>();
				setupDetails.put("User Name", mapquestionsDetails.get("User Name"));
				setupDetails.put("Password", mapquestionsDetails.get("Password"));

				//************ Validate Login Functionality *****************//

				bstatus = ApplicationFunctions.loginToApplication(setupDetails);
				if(!bstatus) {
					test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.RED)).fail("Unable to Login in to Application"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;
				}
				test.log(Status.INFO, MarkupHelper.createLabel("Login in to Application", ExtentColor.GREEN)).pass("Login in to Application Successfully");
				
				String courseName=mapquestionsDetails.get("Course Name");
				String unitName=mapquestionsDetails.get("Unit Name");

				bstatus = ApplicationFunctions.donavigatetosubunitquestion(courseName,unitName);
				if(!bstatus) {
					test.log(Status.INFO, MarkupHelper.createLabel("Navigate to subunit course page", ExtentColor.RED)).fail(" Unabale to Navigate to subunit course page"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					continue;

				}
				test.log(Status.INFO, MarkupHelper.createLabel("Navigate to subunit  course page", ExtentColor.GREEN)).pass("Able to Navigate to subunit  course page");
				
				Map<String,String>mapstatistiscdata = new HashMap<String, String>();
				
				mapstatistiscdata= ApplicationFunctions.doValidatequestionStatisticsInMember(mapquestionsDetails);
				if(mapstatistiscdata==null || mapstatistiscdata.isEmpty()) {
					bstatus= false;
				}
				if(!bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate "+mapquestionsDetails.get("Functionality")+" Question Types", ExtentColor.RED)).fail("Unable to validate Question "+mapquestionsDetails.get("Functionality")+"--"+Messages.errorMsg, MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
					Global.driver.navigate().refresh();
					continue;
				}
				if(!bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate "+mapquestionsDetails.get("Functionality")+" Question Types", ExtentColor.GREEN)).pass("Negative testcase-Cannot perform to Validate"+mapquestionsDetails.get("Functionality")+" "+mapquestionsDetails.get("Question Type")+"");
					continue;
				}
				if(bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Pass")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate "+mapquestionsDetails.get("Functionality")+" Question Types", ExtentColor.GREEN)).pass("Question "+mapquestionsDetails.get("Functionality")+" are validated  successfully and Statistics Report are -"+mapstatistiscdata+"");
					continue;
				}
				if(bstatus && mapquestionsDetails.get("ExpectedResults").equalsIgnoreCase("Fail")){
					test.log(Status.INFO, MarkupHelper.createLabel("Validate "+mapquestionsDetails.get("Functionality")+" Question Types", ExtentColor.RED)).fail("Able to validated "+mapquestionsDetails.get("Functionality")+" "+mapquestionsDetails.get("Question Type")+" with negative Scenario", MediaEntityBuilder.createScreenCaptureFromPath(CommonFunctions.takeScreenShot(Global.driver)).build());
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
