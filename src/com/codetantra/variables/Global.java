package com.codetantra.variables;


import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.WebDriver;



public class Global {
	
	
	public static WebDriver driver;
	
	public static String executeDirectory = System.getProperty("user.dir");
	public static String sFirefoxBrowserName = "ff";
	public static String sChromeBrowserName = "gc";
	public static String sIEBrowserName = "ie";
	public static String sChromeDriverPathconfig ="";
	//Url
	public static String url ="https://staging.codetantra.com/login.jsp";
	//driver paths
	
	public static String sIEDriverPath = executeDirectory+"Drivers/IEDriverServer.exe";
	
	
	public static String sChromeDriverPath = executeDirectory+"/Drivers/chromedriver.exe";
	public static String sChromeDriverPathlinux= executeDirectory+"/Drivers/chromedriver";
	
	public static String actualFileDownloadPath = executeDirectory+"/FileDownload";
	public static String extentLogsDownloadPath = executeDirectory+"/ExtentLogs";
	public static String screenshotDownloadPath = executeDirectory+"/screenshots";

	//Test Data
	public static String sLoginTestDataFile = executeDirectory+"/TestData/CT_TestData.xlsx";
	public static String sGlobalLoginTestData = executeDirectory+"/TestData/GlobalTestData.xlsx";

	public static String sGlobalLoginTestDataSheetName = "Setup Details";
	//Report 
	public static boolean logInStatus = true;
	
	public static boolean  testfailed = false;
	public static List<String> wantToFail = null;
	public static List<String> scenarioID = null;
	public static List<String> suiteStatus = new ArrayList<>();
	public static List<List<String>> listofScenerios = new ArrayList<>();
	public static List<List<String>> listofScenerioids = new ArrayList<>();
	public static int testIndex = 0;
	public static int suiteIndex = 0;
	public static boolean suitStop = false;
	public static boolean testAbort = false;
	public static String testName = "";
	//public static String propertyFile = executeDirectory+"\\config.properties";
	public static String propertyFile = executeDirectory+"/ExtentConfig.properties";
	public static String confgXmlFile = executeDirectory+"/extent-config.xml";
	public static String logo =  executeDirectory+"/CT_logo.jpg";
	public static String extentlog =  executeDirectory+"/ExtentLogs/";
	public static String screenshots =  executeDirectory+"/screenshots/";
	

}
