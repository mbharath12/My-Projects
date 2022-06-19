package com.codetantra.lib;

import java.awt.Robot;
import java.awt.event.InputEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jdom2.CDATA;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;
import org.jdom2.output.XMLOutputter;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Point;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.UnexpectedAlertBehaviour;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.FluentWait;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.aventstack.extentreports.reporter.configuration.ChartLocation;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.codetantra.variables.Constants;
import com.codetantra.variables.Global;
import com.data.framework.lib.Alerts;
import com.data.framework.lib.Elements;
import com.data.framework.lib.Messages;
import com.data.framework.lib.UserActions;
import com.data.framework.lib.Utilities;
import com.data.framework.lib.Verify;
import com.data.framework.lib.Wait;
import com.google.common.base.Function;


public class CommonFunctions {
	private static boolean bStatus;
	//This method is used to open a required browser with given URL
	@SuppressWarnings("deprecation")
	public static WebDriver openBrowser(String sUrl,String browserName,String environment) {
		try {
			if(browserName.replaceAll(" ", "").equalsIgnoreCase("gc") || browserName.replaceAll(" ", "").equalsIgnoreCase("googlechrome") || browserName.replaceAll(" ", "").equalsIgnoreCase("chrome"))
			{
				bStatus =CommonFunctions.doVerifyFolderName(Global.actualFileDownloadPath);
				if(!bStatus) {
					Messages.errorMsg = " [ ERROR:: actualFileDownloadPath is not created ]";
				}
				
				bStatus =CommonFunctions.doVerifyFolderName(Global.extentLogsDownloadPath);
				if(!bStatus) {
					Messages.errorMsg = " [ ERROR:: Extent Logs DownloadPath is not created ]";
				}
				
				
				bStatus =CommonFunctions.doVerifyFolderName(Global.screenshotDownloadPath);
				if(!bStatus) {
					Messages.errorMsg = " [ ERROR:: Screenshot Download Path is not created ]";
				}
				
				if(Global.sChromeDriverPathconfig==null ||Global.sChromeDriverPathconfig.isEmpty()  ) {
					//Set the system property for chrome browser location
					if(environment.equalsIgnoreCase("Window")) {
						System.setProperty("webdriver.chrome.driver", Global.sChromeDriverPath);
					}else {
						System.setProperty("webdriver.chrome.driver", Global.sChromeDriverPathlinux);
					}
				}else {
					System.setProperty("webdriver.chrome.driver", Global.sChromeDriverPathconfig);
				}
				
				
				ChromeOptions options = new ChromeOptions();
				//To start Chrome maximized
				options.addArguments("--start-maximized");

				// To disable 
				options.setExperimentalOption("useAutomationExtension", false);
				//To disable infobar
				options.setExperimentalOption("excludeSwitches", Collections.singletonList("enable-automation"));

				// To disable Save your password manager
				options.addArguments("--disable-web-security");
				Map<String, Object> prefs = new HashMap<String, Object>();
				prefs.put("download.default_directory", Global.actualFileDownloadPath);
				prefs.put("profile.default_content_settings.popups", 0);
				prefs.put("credentials_enable_service", false);
				prefs.put("profile.password_manager_enabled", false);
				prefs.put("chrome.downloads.setShelfEnabled",true); 
				options.setExperimentalOption("prefs", prefs);
				Global.driver = new ChromeDriver(options);
			}
			else if(browserName.replaceAll(" ", "").equalsIgnoreCase("ff") || browserName.replaceAll(" ", "").equalsIgnoreCase("firefox") || browserName.replaceAll(" ", "").equalsIgnoreCase("mozillafirefox"))
			{
				//Set fire fox preferences
				FirefoxProfile profile = new FirefoxProfile();
				profile.setPreference("browser.download.folderList", 2);
				profile.setPreference("browser.download.manager.showWhenStarting", false);
				profile.setPreference("browser.download.dir", Global.actualFileDownloadPath);
				profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/x-gzip");
				profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
				profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/vnd.ms-excel");
				profile.setPreference("browser.helperApps.neverAsk.saveToDisk", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
				Global.driver = new FirefoxDriver();
				Global.driver.manage().window().maximize();
			}
			else if(browserName.replaceAll(" ", "").equalsIgnoreCase("ie") || browserName.replaceAll(" ", "").equalsIgnoreCase("internetexplorer"))
			{
				System.setProperty("webdriver.ie.driver", Global.sIEDriverPath);

				//set IE capabilities
				DesiredCapabilities capabilities = DesiredCapabilities.internetExplorer();
				capabilities.setCapability(CapabilityType.BROWSER_NAME, "IE");
				capabilities.setCapability(InternetExplorerDriver.
						INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS,true);
				Global.driver = new InternetExplorerDriver(capabilities);
				Global.driver.manage().window().maximize();
			}
			else
			{
				Messages.errorMsg = "[ERROR:: Please look at browser name or driver path.]";
				return null;
			}
			//Delete all cookies
			Global.driver.manage().deleteAllCookies();
			//Reload the page
			Global.driver.navigate().refresh();
			Thread.sleep(2000);
			//Enter the URL in address bar
			Global.driver.get(sUrl);
			return Global.driver;
		}
		catch (Exception e) {
			Messages.errorMsg = "[ERROR:: Exception Raised in openChromeBrowser keyword.]"+e.getMessage();
			return null;
		}
	}

	//This method is used to open Chrome Headless Browser
	public static WebDriver openChromeHeadLessBrowser(String sUrl,String browserName,String environment) {
		try {
			if(browserName.replaceAll(" ", "").equalsIgnoreCase("gc") || browserName.replaceAll(" ", "").equalsIgnoreCase("googlechrome") || browserName.replaceAll(" ", "").equalsIgnoreCase("chrome"))
			{
				bStatus =CommonFunctions.doVerifyFolderName(Global.actualFileDownloadPath);
				if(!bStatus) {
					Messages.errorMsg = " [ ERROR:: actualFileDownloadPath is not created ]";
				}
				

				bStatus =CommonFunctions.doVerifyFolderName(Global.extentLogsDownloadPath);
				if(!bStatus) {
					Messages.errorMsg = " [ ERROR:: Extent Logs DownloadPath is not created ]";
				}
				bStatus =CommonFunctions.doVerifyFolderName(Global.screenshotDownloadPath);
				if(!bStatus) {
					Messages.errorMsg = " [ ERROR:: Screenshot Download Path is not created ]";
				}
				
				
				if(Global.sChromeDriverPathconfig==null ||Global.sChromeDriverPathconfig.isEmpty()) {
					//Set the system property for chrome browser location
					if(environment.equalsIgnoreCase("Window")) {
						System.setProperty("webdriver.chrome.driver", Global.sChromeDriverPath);
					}else {
						System.setProperty("webdriver.chrome.driver", Global.sChromeDriverPathlinux);
					}
				}else {
					System.setProperty("webdriver.chrome.driver", Global.sChromeDriverPathconfig);
				}
				
				ChromeOptions options = new ChromeOptions();
				options.addArguments("headless");
				options.addArguments("--disable-gpu");
				options.addArguments("disable-infobars");
				options.addArguments("--disable-extensions");
				options.addArguments("window-size=1200x600");
				options.addArguments("--no-sandbox");
				// To disable 
				options.setExperimentalOption("useAutomationExtension", false);
				//To disable infobar
				options.setExperimentalOption("excludeSwitches", Collections.singletonList("enable-automation"));
				// To options Save your password manager
				options.addArguments("--disable-web-security");
				Map<String, Object> prefs = new HashMap<String, Object>();
				prefs.put("download.default_directory", Global.actualFileDownloadPath);
				prefs.put("profile.default_content_settings.popups", 0);
				prefs.put("credentials_enable_service", false);
				prefs.put("profile.password_manager_enabled", false);
				prefs.put("chrome.downloads.setShelfEnabled",true); 
				options.setExperimentalOption("prefs", prefs);
				Global.driver = new ChromeDriver(options);
			}
			Global.driver.manage().deleteAllCookies();
			//Reload the page
			Global.driver.navigate().refresh();
			Thread.sleep(2000);
			//Enter the URL in address bar
			Global.driver.get(sUrl);
			return Global.driver;
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}

	}

	//This method is used to set the desired capabilities for chrome
	public static DesiredCapabilities setChromeCapabilities()
	{
		try
		{
			ChromeOptions options = new ChromeOptions();
			//Add arguments to chrome options
			options.addArguments("test-type");
			options.addArguments("start-maximized");
			options.addArguments("disable-infobars");
			options.addArguments("--js-flags=--expose-gc");  
			options.addArguments("--enable-precise-memory-info");
			options.addArguments("--disable-popup-blocking");
			options.addArguments("--disable-default-apps");
			//options.addArguments("disable-extensions");
			options.addArguments("--start-maximized");
			options.addArguments("--no-sandbox");
			options.addArguments("disable-plugins");
			options.addArguments("test-type=browser");
			//options.addArguments("chrome.switches","--disable-extensions");
			//Set preferences
			Map<Object,Object> prefs = new HashMap<Object,Object>();
			prefs.put("download.default_directory", Global.actualFileDownloadPath);
			prefs.put("profile.default_content_settings.popups", 0);
			prefs.put("excludeSwitches", Arrays.asList("enable-automation"));
			prefs.put("credentials_enable_service", false);
			prefs.put("password_manager_enabled", false);

			options.setExperimentalOption("prefs", prefs);
			DesiredCapabilities capabilities = DesiredCapabilities.chrome();
			capabilities.setCapability(ChromeOptions.CAPABILITY, options);
			capabilities.setCapability(CapabilityType.UNEXPECTED_ALERT_BEHAVIOUR, UnexpectedAlertBehaviour.ACCEPT);
			return capabilities;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception raised while setting the desired capabilities for chrome.]";
			return null;
		}
	}

	//This method is used to reload the active browser page
	public static boolean reloadThePage()
	{
		try
		{
			Global.driver.navigate().refresh();
			bStatus = Verify.verifyAlertPresent(Global.driver);
			if(bStatus)
				Alerts.acceptAlert(Global.driver);
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR::Exception Raised while reloading the page.'"+e.getMessage()+".']";
			return false;
		}
	}
	//This method is used to wait for alert to be present
	public static boolean waitForAlert(WebDriver driver)
	{
		try
		{
			for(int i = 1 ;i <= 5 ; i ++)
			{

				TimeUnit.SECONDS.sleep(2);
				bStatus = Verify.verifyAlertPresent(driver);
				if(bStatus)
					return true;
			}
			Messages.errorMsg = "[ERROR::Alert is not present.]";
			return false;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR::Exception Raised while waiting for the alert.]";
			return false;
		}
	}

	//This method is used to wait for element to be invisible.
	public static boolean waitForElementInvisibility(By objLocator, int timeWait)
	{
		try
		{
			Thread.sleep(1000);
			for(int i = 1 ; i <= timeWait ; i++)
			{
				bStatus = Verify.verifyElementVisible(Global.driver, objLocator);
				if(!bStatus){
					Messages.errorMsg ="";
					return true;
				}
				Thread.sleep(1000);
			}
			Messages.errorMsg = "[ERROR:: '"+objLocator+"' is till is in visible state.]";
			return false;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised '"+e.getMessage()+".']";
			return false;
		}
	}

	public static boolean waitForElementInvisibility(WebDriver driver ,By objLocator, int timeWait)
	{
		try
		{
			Thread.sleep(1000);
			for(int i = 1 ; i <= timeWait ; i++)
			{
				bStatus = Verify.verifyElementVisible(driver, objLocator);
				if(!bStatus){
					Messages.errorMsg ="";
					return true;
				}
				Thread.sleep(1000);
			}
			Messages.errorMsg = "[ERROR:: '"+objLocator+"' is till is in visible state.]";
			return false;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised '"+e.getMessage()+".']";
			return false;
		}
	}


	public static boolean spinnerInvisible(int timeWait, By loc){
		try
		{

			Thread.sleep(1000);
			for(int i = 1 ; i <= timeWait ; i++)
			{
				bStatus = Verify.verifyElementVisible(Global.driver, loc);
				if(!bStatus){
					Messages.errorMsg ="";
					return true;
				}
				Thread.sleep(1000);
			}
			Messages.errorMsg = "[ERROR:: Spinner is till is in visible state.]";
			return false;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised '"+e.getMessage()+".']";
			return false;
		}
	}
	//This method is used to close the active browser
	public static boolean closeBrowser(WebDriver driver)
	{
		CommonFunctions.threadSleep(1);
		try
		{
			driver.close();
			Runtime.getRuntime().exec("taskkill /F /IM chromedriver.exe");
			Runtime.getRuntime().exec("taskkill /F /IM IEDriverServer.exe");
			CommonFunctions.threadSleep(5);
			return true;
		}
		catch(Exception e)
		{
			try
			{
				Runtime.getRuntime().exec("taskkill /F /IM chromedriver.exe");
				Runtime.getRuntime().exec("taskkill /F /IM IEDriverServer.exe");
				return false;
			}
			catch(Exception ex)
			{
				Messages.errorMsg = "[ERROR:: Exception raised in closeBrowser keyword '"+ex.getMessage()+".']";
				return false;
			}
		}
	}

	//This method is used to sleep the script
	public static void threadSleep(int timeWait)
	{
		try
		{
			TimeUnit.SECONDS.sleep(timeWait);
		}
		catch(Exception e)
		{
			Messages.errorMsg = "Exception Raise in threadSleep keyword.[ERROR::"+e.getMessage()+".]";
		}
	}

	//This method is used to wait until spinner to be invisible by given time
	public static boolean waitForPageLoad(By Loctator,int timeWait)
	{
		try
		{
			bStatus = CommonFunctions.waitForElementInvisibility(Loctator, timeWait);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Page Loading is not happen after waiting 120sec.]";
				return false;
			}
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in waitForSpinnerInvisibility keyword.]";
			return false;
		}
	}
	//This method is used to perform mouse over on WebElement
	public static boolean mouseOver(WebDriver driver, By objLocator)
	{
		try
		{
			Actions action = new Actions(driver);
			action.moveToElement(driver.findElement(objLocator)).build().perform();
			return true;	
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Mouse over failed on "+objLocator+".]";
			return false;
		}
	}


	//This method is used to enter text then press ENTER key.
	public static boolean enteTextAndPressEnterKeyUsingActions(WebDriver driver,By objLocator, String value)
	{
		try
		{
			Actions action = new Actions(driver);
			bStatus = Wait.waitForElementVisibility(driver, objLocator, Constants.lTimeOut);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: "+objLocator+" is not visible.]";
				return false;
			}
			driver.findElement(objLocator).clear();
			action.sendKeys(driver.findElement(objLocator), value).build().perform();
			//action.sendKeys(driver.findElement(objLocator), Keys.ENTER).build().perform();
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in enteTextAndEnterUsingActions keyword.]";
			return false;
		}
	}
	public static boolean waitForSpinnerInvisibility(int timeWait)
	{
		try
		{
			bStatus = CommonFunctions.waitForElementInvisibility(By.xpath(""),Constants.iSpinnerTime);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Spinner is still displayed.]";
				return false;
			}
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in waitForSpinnerInvisibility keyword.]";
			return false;
		}
	}

	public static boolean enterDate(WebDriver driver,By objLocator, String text){
		try{
			bStatus = Wait.waitForElementVisibility(driver, objLocator, Constants.lTimeOut);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Locator "+objLocator+" is not visible.]";
				return false;
			}
			Elements.enterText(driver, objLocator, "10");
			Elements.clearText(driver, objLocator);
			CommonFunctions.threadSleep(1);
			bStatus=Elements.enterText(driver, objLocator, text);
			if(!bStatus){
				Messages.errorMsg = "[ ERROR :: Date is Not Entered in text box]";
				return false;
			}

			return true;
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}

	public static boolean spinnerClick(WebDriver wDriver,By objLocator){
		try{
			int iValue = 0;
			while (iValue < Constants.iSpinnerTime) {
				bStatus = Elements.click(wDriver, objLocator);
				if(bStatus){
					return true;
				}

				iValue++;
				Thread.sleep(1000);
			}
			Messages.errorMsg = "[ERROR:: Spinner is still Displayed.]";


			return false;

		}
		catch(Exception e){

			return false;
		}
	}


	//This method is used to scroll to web element
	public static boolean scrollToWebElement(WebDriver driver,By objLocator)
	{
		try
		{
			WebElement element = driver.findElement(objLocator);
			if(element != null)
			{
				((JavascriptExecutor)driver).executeScript("arguments[0].scrollIntoView();", element);
				return true;
			}
			else
			{
				Messages.errorMsg = "[ERROR:: WebElement is not found in the DOM.]";
				return false;
			}
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in scrollToWebElement keyword.]";
			return false;
		}
	}

	//This method is used to scroll by co-ordinates
	public static boolean scrollBy(WebDriver driver,int startPostion, int endingPosition)
	{
		try
		{
			((JavascriptExecutor)driver).executeScript("window.scrollBy("+startPostion+","+endingPosition+")");
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in scrollBy keyword.]";
			return false;
		}
	}

	//This method is used to perform click action on web element using Javascript
	public static boolean jsClick(By MYelement){
		try {
			WebElement element = Global.driver.findElement(MYelement);
			JavascriptExecutor executor = (JavascriptExecutor)Global.driver;
			executor.executeScript("arguments[0].click();", element);
			return true;
		} catch (Exception e) {
			Messages.errorMsg = "Java Script executor failed";
			e.printStackTrace();
			return false;
		}
	}

	public static boolean scrollForColumn(String columnName){
		boolean columnFoundFlag = false;
		try{
			CommonFunctions.threadSleep(1);
			String xpath = "//div[@gridname='stp_grid']//span[text()='"+columnName+"']/../following-sibling::div[@class='iconscontainer']";
			for( ; ;){
				bStatus = UserActions.mouseOver(Global.driver, By.xpath(xpath));
				System.out.println("******************************************"+bStatus+"**************************************************");
				if(!bStatus){
					bStatus = longPress(Global.driver, By.xpath("//div[@gridname='stp_grid']//div[contains(@id,'jqxScrollBtnDownhorizontalScrollBar')]/div"));
					if(!bStatus){
						return false;
					}
					if(columnFoundFlag == true){
						break;
					}
					bStatus = Verify.verifyElementPresent(Global.driver, By.xpath("//div[@gridname='stp_grid']//div[contains(@id,'jqxScrollAreaDownhorizontalScrollBar')][contains(@style,'width: 0px;')]"));
					if(bStatus){
						columnFoundFlag = true;
					}
				}else
				{
					break;
				}
			}

			return true;
		}catch(Exception e){
			Messages.errorMsg = "[ERROR:: Exception raised in the Keyword scrollForColumn]";
			return false;
		}
	}

	public static boolean longPress(WebDriver driver, By locator){
		try{
			WebElement elementForLongPress = driver.findElement(locator);
			Actions act = new Actions(driver);
			act.clickAndHold(elementForLongPress).perform();
			Thread.sleep(2500);
			act.moveToElement(elementForLongPress).release().perform();
			return true;
		}catch(Exception e){
			Messages.errorMsg = "[ERROR:: Exception raised in the keyWord longPress]";
			return false;
		}
	}

	public static boolean searchElementInArray(Set<String> arr, String targetValue) {
		return arr.contains(targetValue);
	}

	public static List<String> readAllColumnNamesInExcel(String sFilePath){

		String sValue = null;
		List<String> allColumnNames = new ArrayList<>();
		try{
			String filename = sFilePath;
			String extension = filename.substring(filename.lastIndexOf(".") + 1, filename.length());
			if(extension.equalsIgnoreCase("xls")){
				HSSFWorkbook objWorkbook = new HSSFWorkbook(new FileInputStream(new File(sFilePath)));
				HSSFSheet objSheet = objWorkbook.getSheetAt(0);
				int iColCount = objSheet.getRow(0).getLastCellNum();

				for (int iColCounter = 0; iColCounter < iColCount; iColCounter++) {

					DataFormatter df = new DataFormatter();
					Cell cell = objSheet.getRow(0).getCell(iColCounter);
					sValue = df.formatCellValue(cell);
					sValue = sValue.trim();

					if ((!sValue.equalsIgnoreCase("Null")) && (sValue.trim().length() != 0)) {
						allColumnNames.add(sValue);
					}
				}		
				objWorkbook.close();
			}
			if(extension.equalsIgnoreCase("xlsx")){
				XSSFWorkbook objWorkbook = new XSSFWorkbook(new FileInputStream(new File(sFilePath)));
				XSSFSheet objSheet = objWorkbook.getSheetAt(0);
				int iColCount = objSheet.getRow(0).getLastCellNum();

				for (int iColCounter = 0; iColCounter < iColCount; iColCounter++) {

					DataFormatter df = new DataFormatter();
					Cell cell = objSheet.getRow(0).getCell(iColCounter);
					sValue = df.formatCellValue(cell);
					sValue = sValue.trim();

					if ((!sValue.equalsIgnoreCase("Null")) && (sValue.trim().length() != 0)) {
						allColumnNames.add(sValue);
					}
				}		
				objWorkbook.close();
			}
			return allColumnNames;
		}catch(Exception e){
			return null;
		}
	}

	public static boolean waitForFirstRowVisibity(final WebDriver driver){
		try{

			@SuppressWarnings("deprecation")
			FluentWait<WebDriver> wait = new FluentWait<WebDriver>(driver)
			.withTimeout(10, TimeUnit.SECONDS)
			.pollingEvery(1, TimeUnit.MILLISECONDS)
			.ignoring(NoSuchElementException.class);

			bStatus = wait.until(new Function<WebDriver,Boolean>() {

				public Boolean apply(WebDriver applyDriver) {
					applyDriver = driver;

					String heightInitial = Global.driver.findElement(By.xpath("//div[@id='jqxScrollAreaUpverticalScrollBarjqxlistboxDiv']")).getCssValue("height");
					bStatus = Elements.click(Global.driver, By.xpath("//div[@id='verticalScrollBarjqxlistboxDiv']//div[contains(@class,'jqx-icon-arrow-up')]"));
					if(!bStatus){
						Messages.errorMsg = "[ERROR :: Unable to Click on Scroll Up Button in Column Picker pop up window.]";
						return false;
					}

					String heightFinal = Global.driver.findElement(By.xpath("//div[@id='jqxScrollAreaUpverticalScrollBarjqxlistboxDiv']")).getCssValue("height");
					if(heightInitial.equalsIgnoreCase(heightFinal)){
						return true;
					}
					String rownum = Elements.getElementAttribute(Global.driver, By.xpath("//div[@id='listBoxContentjqxlistboxDiv']//span[contains(@class,'jqx-fill-state-pressed')]/.."), "id");
					if(rownum.equalsIgnoreCase("listitem9jqxlistboxDiv")){
						bStatus = mouseMoveMent(By.xpath("//div[@id='listBoxContentjqxlistboxDiv']//div[@id='listitem2jqxlistboxDiv']"));
						if(!bStatus){
							return false;
						}
						return true;
					}
					return null;	
				}
			}); 

			if(!bStatus){
				return false;
			}

			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}

	@SuppressWarnings("deprecation")
	public static boolean waitForRowVisbility(final WebDriver driver,final String item){
		try{

			FluentWait<WebDriver> wait = new FluentWait<WebDriver>(driver)
					.withTimeout(10, TimeUnit.SECONDS)
					.pollingEvery(1, TimeUnit.MILLISECONDS)
					.ignoring(NoSuchElementException.class);

			bStatus =  wait.until(new Function<WebDriver,Boolean>() {

				public Boolean apply(WebDriver applyDriver) {
					applyDriver = driver;

					String heightInitial = Global.driver.findElement(By.xpath("//div[@id='jqxScrollAreaUpverticalScrollBarjqxlistboxDiv']")).getCssValue("height");
					bStatus = Elements.click(Global.driver, By.xpath("//div[@id='verticalScrollBarjqxlistboxDiv']//div[contains(@class,'jqx-icon-arrow-up')]"));
					if(!bStatus){
						Messages.errorMsg = "[ERROR :: Unable to Click on Scroll Up Button in Column Picker pop up window.]";
						return false;
					}					
					String heightFinal = Global.driver.findElement(By.xpath("//div[@id='jqxScrollAreaUpverticalScrollBarjqxlistboxDiv']")).getCssValue("height");
					if(heightInitial.equalsIgnoreCase(heightFinal)){
						return true;
					}
					String rownum = Elements.getElementAttribute(Global.driver, By.xpath("//div[@id='listBoxContentjqxlistboxDiv']//span[contains(@class,'jqx-fill-state-pressed')]/.."), "id");
					if(rownum.equalsIgnoreCase("listitem9jqxlistboxDiv")){
						return true;
					}
					return null;				
				}
			}); 

			if(!bStatus){
				return false;
			}

			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}

	public static boolean mouseMoveMent( By locator){
		Robot bot;
		try{
			bot = new Robot();
			Map<String, Integer> from = getCoordinates(Global.driver, By.xpath("//div[@id='listBoxContentjqxlistboxDiv']//span[contains(@class,'jqx-fill-state-pressed')]"));

			bot.mouseMove(from.get("X")+50, from.get("Y")+11);   
			bot.delay(50);
			bot.mousePress(InputEvent.BUTTON1_MASK);
			Map<String, Integer> to = getCoordinates(Global.driver, locator);
			bot.mouseMove(to.get("X")+50, to.get("Y"));
			bot.delay(50);
			bot.mouseRelease(InputEvent.BUTTON1_MASK);
			Thread.sleep(400);
			return true;
		}catch(Exception e){

			return false;
		}

	}

	public static Map<String, Integer> getCoordinates(WebDriver driver, By locator){

		try{
			WebElement checkBox = driver.findElement(locator);
			Point coordinate = checkBox.getLocation();
			Map<String, Integer> coordinates = new HashMap<>();
			coordinates.put("X",coordinate.getX());
			coordinates.put("Y",coordinate.getY()+66);

			return coordinates;
		}catch(Exception e){
			return null;
		}
	}

	//This method is used to enter text using Actions class
	public static boolean enterTextUsingActions(WebDriver driver,By objLocator, String value)
	{
		try
		{
			Actions action = new Actions(driver);
			bStatus = Wait.waitForElementVisibility(driver, objLocator, Constants.lTimeOut);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: "+objLocator+" is not visible.]";
				return false;
			}
			driver.findElement(objLocator).clear();
			action.sendKeys(driver.findElement(objLocator), value).build().perform();
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in enterTextUsingActions keyword.Exception :: "+e.getMessage()+"]";
			return false;
		}
	}

	//This method is used to delete all files from directory
	public static boolean deleteFilesFromDir(String dirPath)
	{
		try
		{
			FileUtils.cleanDirectory(new File(dirPath));
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Inavlid directory."+dirPath+" is not found.]";
			return false;
		}
	}

	//This method is used to delete the mentioned files from directory
	public static boolean deleteFilesFromDir(String dirPath, List<String> fileNames)
	{
		String appendErrMsgs = "";
		try
		{
			for(String fileName: fileNames)
			{
				try
				{
					File file  = new File(dirPath+"/"+fileName);
					file.delete();
				}
				catch(Exception e)
				{
					appendErrMsgs = appendErrMsgs +dirPath+"/"+fileName+" is not found.\n";
				}	
			}
			Messages.errorMsg = appendErrMsgs;
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in deleteFilesFromDir keyword.]";
			return false;
		}
	}

	//This method is used to verify specified file is exist or not.
	public static boolean isFileExist(String downloadDir, String fileName) {
		boolean flag = false;
		File dir = new File(downloadDir);
		File[] dir_contents = dir.listFiles();

		for (int i = 0; i < dir_contents.length; i++) {
			if (dir_contents[i].getName().equals(fileName))
				return flag=true;
		}

		return flag;
	}

	public static boolean keyDownUsingActions()
	{
		try
		{
			Actions action = new Actions(Global.driver);
			action.sendKeys(Keys.DOWN).perform();
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in keyDown keyword.]";
			return false;
		}
	}

	public static boolean keyUpUsingActions()
	{
		try
		{
			Actions action = new Actions(Global.driver);
			action.sendKeys(Keys.UP).perform();
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in keyDown keyword.]";
			return false;
		}
	}

	public static boolean WaitUntilFileDownloded(By sLocator, int iTime){
		try {
			for (int i = 1; i <= 10; i++) {
				bStatus =  Wait.waitForElementVisibility(Global.driver, sLocator,iTime);
				if(!bStatus){
					continue;
				}
				else{
					return true;
				}
			}
			Messages.errorMsg = Messages.errorMsg+" Even after waiting "+iTime;
			return false;
		} 
		catch (Exception e) {
			return false;
		}
	}

	//This method is used to retrieve the text of web element which is present in DOM Using Java script 
	public static String getTextUsingJS(WebDriver driver,By objLocator)
	{
		try
		{
			JavascriptExecutor jse = (JavascriptExecutor)driver;
			WebElement element = driver.findElement(objLocator);
			if(element!= null)
				return jse.executeScript("return arguments[0].text", element).toString();
			else
				return null;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[Exception Raised in getTextUsingJS keyword.]";
			return null;
		}
	}

	//This method is used to retrieve the inner text of web element which is present in DOM Using Java script 
	public static String getInnerTextUsingJS(WebDriver driver,By objLocator)
	{
		try
		{
			JavascriptExecutor jse = (JavascriptExecutor)driver;
			WebElement element = driver.findElement(objLocator);
			if(element!= null)
				return jse.executeScript("return arguments[0].innerText", element).toString();
			else
				return null;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[Exception Raised in getTextUsingJS keyword.]";
			return null;
		}
	}

	public static boolean typeCharacterByChar(WebDriver driver,By objLocator, String text)
	{
		try
		{
			bStatus = Wait.waitForElementVisibility(driver, objLocator, Constants.lTimeOut);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Locator "+objLocator+" is not visible.]";
				return false;
			}
			Elements.clearText(driver, objLocator);
			for(int i = 0 ; i < text.length() ; i ++)
			{
				driver.findElement(objLocator).sendKeys(String.valueOf(text.charAt(i)));
				CommonFunctions.threadSleep(1);
			}
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in typeCharacterByChar keyword. Exception:"+e.getMessage()+"]";
			return false;
		}
	}
	//Get Date in Compassion Excel Report
	public static String getDate(Date date)
	{
		try
		{
			Map<String,String> months = new HashMap<String, String>();
			months.put("Jan","01");	months.put("Feb","02"); months.put("Mar","03"); months.put("Apr","04"); months.put("May","05");
			months.put("Jun","6"); months.put("Jul","7"); months.put("Aug","08"); months.put("Sep","09"); months.put("Oct","10");
			months.put("Nov","11"); months.put("Dec","12");
			//SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			/*Date myDate = dateFormat.parse(date);
				System.out.println(myDate);*/
			Calendar cal1 = Calendar.getInstance();
			cal1.setTime(date);
			//cal1.add(Calendar.DAY_OF_YEAR, -1);
			Date previousDate = cal1.getTime();
			System.out.println(previousDate);
			System.out.println(previousDate.toString().trim().split(" ")[2]+"/"+previousDate.toString().trim().split(" ")[1].replace(previousDate.toString().trim().split(" ")[1], months.get(previousDate.toString().trim().split(" ")[1]))+"/"+previousDate.toString().trim().split(" ")[5]);
			return previousDate.toString().trim().split(" ")[2]+"/"+previousDate.toString().trim().split(" ")[1].replace(previousDate.toString().trim().split(" ")[1], months.get(previousDate.toString().trim().split(" ")[1]))+"/"+previousDate.toString().trim().split(" ")[5];
			//return previousDate.toString().trim().split(" ")[5]+previousDate.toString().trim().split(" ")[1].replace(previousDate.toString().trim().split(" ")[1], months.get(previousDate.toString().trim().split(" ")[1]))+previousDate.toString().trim().split(" ")[2];
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[Error:: Exception Raised in getDate keyword.]";
			return null;
		}
	}
	//Get Number of sheets in Excel Files

	public static List<String> getNumberOfSheet(String sFilePath){
		try{
			FileInputStream file1 = new FileInputStream(sFilePath);
			@SuppressWarnings("resource")
			XSSFWorkbook workbook = new XSSFWorkbook(file1);

			List<String> sheetNames = new ArrayList<String>();
			for (int i=0; i<workbook.getNumberOfSheets(); i++) {
				sheetNames.add( workbook.getSheetName(i) );
			}
			return sheetNames;
		}catch(Exception e){
			return null;
		}
	}

	//This method is used to Get Merged Cell Data from Excel sheet

	public static String getMergeCellData(String sFilePath, String sSheetName){
		/*This method is used to Read Merge cell Available in First 3 Row only. To Read Complete sheet remove Outer while loop Comment */
		try{
			String data = null;
			FileInputStream file1 = new FileInputStream(sFilePath);
			@SuppressWarnings("resource")
			XSSFWorkbook workbook = new XSSFWorkbook(file1);
			XSSFSheet sheet= workbook .getSheet(sSheetName);

			//Iterate through each rows one by one
			Iterator<Row> rowIterator = sheet.iterator();

			//outer:
			//while (rowIterator.hasNext()){
			for(int k=0;k<=2;k++) {
				Row row = rowIterator.next();

				//For each row, iterate through all the columns
				Iterator<Cell> cellIterator = row.cellIterator();

				while (cellIterator.hasNext()) {
					Cell cell = cellIterator.next();

					//will iterate over the Merged cells
					for (int i = 0; i < sheet.getNumMergedRegions(); i++) {
						CellRangeAddress region = sheet.getMergedRegion(i); //Region of merged cells

						int colIndex = region.getFirstColumn(); //number of columns merged
						int rowNum = region.getFirstRow();      //number of rows merged

						//check first cell of the region
						if (rowNum == cell.getRowIndex() && colIndex == cell.getColumnIndex()) {
							data = sheet.getRow(rowNum).getCell(colIndex).getStringCellValue();
							//continue outer;
						}
					}
					//the data in merge cells is always present on the first cell. All other cells(in merged region) are considered blank
					/*
					 * if (cell.getCellType() == Cell.CELL_TYPE_BLANK || cell == null) { continue; }
					 */
				}
			}
			return data;
		}
		catch (Exception e){
			return null;
		}
	}

	public static String getMonthNumber(String month)
	{
		try
		{
			month = month.toLowerCase();
			if(month.equals("january") || month.equals("jan"))
				return "1";
			else if(month.equals("february") || month.equals("feb"))
				return "2";
			else if(month.equals("march") || month.equals("mar"))
				return "3";
			else if(month.equals("april") || month.equals("apr"))
				return "4";
			else if(month.equals("may"))
				return "5";
			else if(month.equals("june") || month.equals("jun"))
				return "6";
			else if(month.equals("july") || month.equals("jul"))
				return "7";
			else if(month.equals("august") || month.equals("aug"))
				return "8";
			else if(month.equals("september") || month.equals("sep"))
				return "9";
			else if(month.equals("october") || month.equals("oct"))
				return "10";
			else if(month.equals("november") || month.equals("nov"))
				return "11";
			else if(month.equals("december") || month.equals("dec"))
				return "12";
			else
			{
				Messages.errorMsg = "[ERROR:: Wrong month '"+month+"' has given.]";
				return null;
			}
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in getMonthNumber keyword.Exception:"+e.getMessage()+"]";
			return null;
		}
	}
	public static boolean typeCharactersIntoTextBox(By objLocator, String sText){
		try {
			Actions action = new Actions(Global.driver);
			action.sendKeys(Global.driver.findElement(objLocator),sText).build().perform();
		} 
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}	
		return true;
	}

	//This method is used to perform Mouse Right click

	public static boolean mouseRightclick(String locator){
		try{
			Actions action = new Actions(Global.driver);
			By loc = By.xpath(locator);
			WebElement rightClickElement=Global.driver.findElement(loc);
			action.contextClick(rightClickElement).build().perform();

			return true;
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}

	//This method is used to delete file in directory by partial file name

	public static boolean deleteFileUsingPartialName(String dirPath, String fileNames)
	{
		try
		{
			File directory = new File(dirPath);
			File[] files = directory.listFiles();
			for (File f : files)
			{
				if (f.getName().startsWith(fileNames))
				{
					f.delete();
				}
			}
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in deleteFilesFromDir keyword.]";
			return false;
		}
		return true;
	}

	// This method is used to scroll to bottom of the web page
	public static boolean scrollToBottomOfAPage(WebDriver driver)
	{
		try
		{
			((JavascriptExecutor)driver).executeScript("window.scrollTo(0,document.body.scrollHeight)");
			CommonFunctions.threadSleep(2);
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception raised in scollToBottomOfAPage keyword.]";
			return false;
		}
	}

	// This method is used to scroll to top of the web page
	public static boolean scrollToTopOfAPage(WebDriver driver)
	{
		try
		{
			((JavascriptExecutor)driver).executeScript("window.scrollTo(document.body.scrollHeight,0)");
			Messages.errorMsg = "[ERROR:: Exception raised in scrollToTopOfAPage keyword.]";
			return true;
		}
		catch(Exception e)
		{
			return false;
		}
	}

	//This method is used to click on scroll button
	public static boolean clickOnScrollButton(WebDriver driver,By objLocator)
	{
		try
		{
			bStatus = Verify.verifyElementVisible(driver, objLocator);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Scroll Button is not visible.]";
				return false;
			}
			bStatus = Elements.click(driver, objLocator);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Scroll button is not clicked.]";
				return false;	
			}
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in clickOnScrollButton keyword.]";
			return false;
		}
	}

	//This method is used to press Enter key
	public static boolean doPressEnter(By loc){
		try{
			bStatus= Wait.waitForElementVisibility(Global.driver, loc, Constants.fiveSeconds);
			if(!bStatus){
				Messages.errorMsg = " [ ERROR :: locator is not identified ] ";
				return false;
			}
			Global.driver.findElement(loc).sendKeys(Keys.ENTER);
			return true;
		}
		catch(Exception e){
			Messages.errorMsg = " [ ERROR :: Enter is Not Pressed ] ";
			return false;
		}
	}

	//This method is used to date picker from calendar.
	public static boolean datePickerFromCalendar(String dateToSelect,By calendarLocator)
	{
		try
		{
			Map<Integer,String> months = new HashMap<Integer, String>();		
			months.put(1, "January");	months.put(2, "February"); months.put(3, "March"); months.put(4, "April"); months.put(5, "May");
			months.put(6, "June"); months.put(7, "July"); months.put(8, "August"); months.put(9, "September"); months.put(10, "October");
			months.put(11, "November"); months.put(12, "December");

			String smonth = dateToSelect.split("/")[0].trim();
			int month;
			if(Integer.valueOf(smonth.charAt(0)) == 0)
				month = Integer.valueOf(smonth.replace("0", ""));
			else
				month = Integer.valueOf(smonth);

			String sdate = dateToSelect.split("/")[1].trim();
			int date;
			if(Integer.valueOf(sdate.charAt(1)) == 0)
				date = Integer.valueOf(sdate.replace("0", ""));
			else
				date = Integer.valueOf(sdate);
			int year = Integer.valueOf(dateToSelect.split("/")[2].trim());
			if(month > 12 || ( month > (Calendar.getInstance().get(Calendar.MONTH))+1 && year > Calendar.getInstance().get(Calendar.YEAR)))
			{
				Messages.errorMsg = "[ERROR:: Either month is exceed or year is greater than current year.]";
				return false;
			}
			By objLocator = null;
			bStatus = Verify.verifyElementVisible(Global.driver, calendarLocator);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Calendar web element is not visible.]";
				return false;
			}
			bStatus = Elements.click(Global.driver, calendarLocator);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Calendar is not clicked.]";
				return false;
			}
			objLocator = By.xpath("//div[contains(@style,'display: block') or not(contains(@style,'display: none'))]/div[@data-role = 'calendar']//div[contains(@class,'jqx-calendar-title-content')]");
			bStatus = Wait.waitForElementVisibility(Global.driver, objLocator, Constants.lTimeOut);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: After click on Calendar locator, Calendar popup is not displayed.]";
				return false;
			}
			String calendarHeaderValue = Elements.getText(Global.driver, objLocator);
			if(calendarHeaderValue == null || calendarHeaderValue.isEmpty())
			{
				Messages.errorMsg = "[ERROR:: Unable to get text from calendar header.]";
				return false;
			}
			int calendarPresentYear = Integer.valueOf(calendarHeaderValue.trim().split(" ")[1].trim());
			String calendarPresentMonth = calendarHeaderValue.trim().split(" ")[0].trim();
			By dateobjLocator = By.xpath("//div[contains(@id,'calendar') and not(contains(@style,'display: none'))]//tr[@id='calendarContent']//td[not(contains(@class,'othermonth')) and normalize-space()='"+date+"' or not(contains(@class,'jqx-calendar-cell-othermonth')) and normalize-space()='"+date+"']");
			By monthobjLocator = By.xpath("//div[contains(@id,'calendar') and not(contains(@style,'display: none'))]//tr[@id='calendarContent']//td[not(contains(@class,'jqx-fill-state-disabled')) and normalize-space()='"+months.get(month).substring(0, 3)+"' or normalize-space()='"+months.get(month).substring(0, 3)+"']");

			if(calendarPresentYear == year && calendarPresentMonth.equals(months.get(month)))
			{

				bStatus = Verify.verifyElementVisible(Global.driver, dateobjLocator);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR:: Day "+date+" is not available in present month and year.]";
					return false;
				}
				bStatus = Elements.click(Global.driver, dateobjLocator);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR:: Click on date in calendar is failed.]]";
					return false;
				}
				CommonFunctions.waitForElementInvisibility(Global.driver, dateobjLocator, Constants.lTimeOut);
				//recently added
				return true;
			}
			else
			{
				bStatus = Elements.click(Global.driver, objLocator);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR:: Click on Calendar title is failed.]";
					return false;
				}
				threadSleep(2);
				//if(calendarPresentYear == year && !calendarPresentMonth.equals(months.get(month)))
				if(calendarPresentYear == year)
				{

					bStatus = Elements.click(Global.driver, monthobjLocator);
					if(!bStatus)
					{
						Messages.errorMsg = "[ERROR:: Click on month in calendar is failed.]";
						return false;
					}
					threadSleep(2);
					bStatus = Wait.waitForElementVisibility(Global.driver, dateobjLocator, Constants.lTimeOut);
					if(!bStatus)
					{
						Messages.errorMsg = "[ERROR:: After Click on month in calendar content dates are not displayed.]";
						return false;
					}
					bStatus = Elements.click(Global.driver, dateobjLocator);
					if(!bStatus)
					{
						Messages.errorMsg = "[ERROR:: Click on date is failed.]";
						return false;
					}
					CommonFunctions.waitForElementInvisibility(Global.driver, dateobjLocator, Constants.lTimeOut);
					return true;
				}
				else
				{
					bStatus = Elements.click(Global.driver, objLocator);
					if(!bStatus)
					{
						Messages.errorMsg = "[ERROR:: Click on Calendar title is failed.]";
						return false;
					}
					threadSleep(2);
					bStatus = doSelectGivenYearBySortingRange(String.valueOf(year));
					if(!bStatus)
						return false;
					threadSleep(2);
					calendarPresentYear = Integer.valueOf(Elements.getText(Global.driver, objLocator));
					//if(calendarPresentYear == year && calendarPresentMonth.equals(months.get(month)))
					//recently added
					if(calendarPresentYear == year)
					{

						//
						bStatus = Wait.waitForElementVisibility(Global.driver, monthobjLocator, Constants.lTimeOut);
						if(!bStatus)
						{
							Messages.errorMsg = "[ERROR:: months are not displayed.]";
							return false;
						}
						bStatus = Elements.click(Global.driver, monthobjLocator);
						if(!bStatus)
						{
							Messages.errorMsg = "[ERROR:: Click on month in calendar is failed.]";
							return false;
						}
						threadSleep(2);
						bStatus = Wait.waitForElementVisibility(Global.driver, dateobjLocator, Constants.lTimeOut);
						if(!bStatus)
						{
							Messages.errorMsg = "[ERROR:: After Click on month in calendar content dates are not displayed.]";
							return false;
						}
						//
						bStatus = Verify.verifyElementVisible(Global.driver, dateobjLocator);
						if(!bStatus)
						{
							Messages.errorMsg = "[ERROR:: Day "+date+" is not available in present month and year.]";
							return false;
						}
						bStatus = Elements.click(Global.driver, dateobjLocator);
						if(!bStatus)
						{
							Messages.errorMsg = "[ERROR:: Click on date in calendar is failed.]]";
							return false;
						}
						CommonFunctions.waitForElementInvisibility(Global.driver, dateobjLocator, Constants.lTimeOut);
						//recently added
						return true;
					}
					else
					{
						Messages.errorMsg = "[ERROR:: year is not selected from the calendar.]";
						return false;
					}
				}
			}
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in datePickerFromCalendar keyword.]";
			return false;
		}
	}
	//This method is used to select a year from calendar
	public static boolean doSelectGivenYearBySortingRange(String sOnYear){
		for ( ; ; ) {
			threadSleep(2);
			String sYearsRange = Elements.getText(Global.driver, By.xpath("//div[contains(@style,'display: block') or not(contains(@style,'display: none'))]/div[@data-role = 'calendar']//div[contains(@class,'jqx-calendar-title-content')]"));
			if (sYearsRange == null || sYearsRange.equalsIgnoreCase("")) {
				Messages.errorMsg = "[ ERROR : Wasn't able to retrieve the years range from the calender]\n";
				return false;
			}
			int iYearsAppearFrom = Integer.parseInt(Arrays.asList(sYearsRange.split("-")).get(0).trim());
			int iYearsAppearTo = Integer.parseInt(Arrays.asList(sYearsRange.split("-")).get(1).trim());
			if (Integer.parseInt(sOnYear) >= iYearsAppearFrom && Integer.parseInt(sOnYear) <= iYearsAppearTo) {
				threadSleep(2);
				bStatus = Elements.click(Global.driver, By.xpath("//tr[@id='calendarContent']//td[contains(@class,'jqx-calendar-cell-decade') and normalize-space()='"+sOnYear+"']"));
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR : Wasn't able to click on the year : '"+sOnYear+"' on calender 'datepicker-years' view.]\n";
					return false;
				}
				return true;
			}
			if (iYearsAppearFrom > Integer.parseInt(sOnYear)) {
				By objLocator = By.xpath("//div[contains(@style,'display: block') or not(contains(@style,'display: none'))]/div[@data-role = 'calendar']//div[contains(@class,'jqx-calendar-title-navigation jqx-icon-arrow-left')]");
				bStatus = Verify.verifyElementVisible(Global.driver, objLocator);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR::  left arrow button is not visible.]";
					return false;
				}
				threadSleep(2);
				bStatus = Elements.click(Global.driver, objLocator);
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR : Wasn't able to click on the left arrow to go down in year range.]\n";
					return false;
				}
			}
			if (iYearsAppearTo < Integer.parseInt(sOnYear)) {
				By objLocator = By.xpath("//div[contains(@style,'display: block') or not(contains(@style,'display: none'))]/div[@data-role = 'calendar']//div[contains(@class,'jqx-calendar-title-navigation jqx-icon-arrow-right')]");
				bStatus = Verify.verifyElementVisible(Global.driver, objLocator);
				if(!bStatus)
				{
					Messages.errorMsg = "[ERROR::  Right arrow button is not visible.]";
					return false;
				}
				threadSleep(2);
				bStatus = Elements.click(Global.driver, objLocator);
				if (!bStatus) {
					Messages.errorMsg = "[ ERROR : Wasn't able to click on the right arrow to go up in year range.]\n";
					return false;
				}
			}
		}
	}

	//Creating a method getScreenshot and passing two parameters 
	//driver and screenshotName
	public static String getScreenshot(WebDriver driver, String screenshotName) throws Exception {
		//below line is just to append the date format with the screenshot name to avoid duplicate names 
		String dateName = new SimpleDateFormat("yyyyMMddhhmmss").format(new Date());
		TakesScreenshot ts = (TakesScreenshot) driver;
		File source = ts.getScreenshotAs(OutputType.FILE);
		//after execution, you could see a folder "FailedTestsScreenshots" under src folder
		String destination = System.getProperty("user.dir") + "/FailedTestsScreenshots/"+screenshotName+dateName+".png";
		File finalDestination = new File(destination);
		FileUtils.copyFile(source, finalDestination);
		//Returns the captured file path
		return destination;
	}

	public static boolean enterText(WebDriver driver, By locator, String sUserName){
		try{
			driver.findElement(locator).sendKeys(sUserName);
		}catch(Exception e){
			return false;
		}
		return true;
	}

	public static String captureScreen() throws IOException {
		TakesScreenshot screen = (TakesScreenshot) Global.driver;
		File src = screen.getScreenshotAs(OutputType.FILE);
		String dest =System.getProperty("user.dir") +"//screenshots//"+getcurrentdateandtime()+".png";
		File target = new File(dest);
		FileUtils.copyFile(src, target);
		return dest;
	}

	public static String getcurrentdateandtime(){
		String str = null;
		try{
			DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss:SSS");
			Date date = new Date();
			str= dateFormat.format(date);
			str = str.replace(" ", "").replaceAll("/", "").replaceAll(":", "");
		}
		catch(Exception e){
		}
		return str;

	}

	public static boolean enterText(By objLocator,String textValue){
		try{
			Actions action = new Actions(Global.driver);
			WebElement webl = Global.driver.findElement(objLocator);
			JavascriptExecutor js = (JavascriptExecutor)Global.driver;
			js.executeScript("arguments[0].value='"+textValue+"'", webl);
			action.sendKeys(Keys.ENTER).build().perform();
			return true;
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}

	}

	public static String takeScreenShot(WebDriver driver){
		String date= Utilities.now();
		String dateformat=date.replaceAll(":", "").replaceAll(" ", "_");

		try{
			File scrFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
			FileUtils.copyFile(scrFile, new File(Global.screenshots+"Screenshot_"+dateformat+".png"));
		}catch(Exception e){
			Messages.errorMsg = e.getMessage();
			return null;
		}
		return Global.screenshots+"Screenshot_"+dateformat+".png";
	}

	public static boolean  doVerifyFolderName(String folderName) {
		try {

			File files = new File(folderName);
			if (!files.exists()) {
				if (files.mkdirs()) {
					System.out.println("Floder directories are created!");
				} else {
					System.out.println("Failed to create Floder directories!");
					return false;
				}
			}
			return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	//This method is used to clear text which are not editable
	public static boolean doenterText(WebDriver wDriver, By objLocator, String sValue)
	{
		try {
			bStatus = Verify.verifyElementVisible(wDriver, objLocator);
			if (bStatus) {
				WebElement searchField = wDriver.findElement(objLocator);
				JavascriptExecutor js = (JavascriptExecutor)wDriver;
				js.executeScript("arguments[0].value = '';", searchField);
				searchField.sendKeys(sValue);
				return true;
			}
		}
		catch (Exception e) {
			e.printStackTrace(); }
		return false;
	}

	public static boolean senterText(WebDriver wDriver, By objLocator, String sValue)
	{
		try {
			bStatus = Verify.verifyElementVisible(wDriver, objLocator);
			if (bStatus) {
				wDriver.findElement(objLocator).sendKeys(
						new CharSequence[] { sValue });
				return true;
			}
			return false;
		}
		catch (Exception e) {
			e.printStackTrace(); }
		return false;
	}


	/***************************** Extend Report *****************************/
	public static boolean extentReportLogoCreator(String xmlFilepath, String logopath){

		File  file=new File(xmlFilepath);   
		SAXBuilder builder = new SAXBuilder();
		try {
			Document doc = builder.build(file);
			Element rootElement = doc.getRootElement();
			Element empElement = rootElement.getChild("configuration");
			Element detailElement = empElement.getChild("reportName");
			CDATA cdata=new CDATA("<img src='"+logopath+"'/>");
			detailElement.setContent(cdata);
			XMLOutputter outXML = new XMLOutputter();
			outXML.output(doc, new FileWriter(Global.confgXmlFile));
			return true;

		} catch (Exception ex)  {
			Messages.errorMsg = "[ERROR:: Exception raised while trying to create logo in Extent Report. "+ex+"]";
			return false;
		}

	}

	public static ExtentReports loadExtentSettings(ExtentHtmlReporter htmlReporter, ExtentReports extent, ExtentTest test, String propFilePath){


		String date= Utilities.now();
		String dateformat=date.replaceAll(":", "").replaceAll(" ", "_");
		htmlReporter = new ExtentHtmlReporter(Global.extentlog+"Report_"+dateformat+".html");
		File configFile = new File(Global.confgXmlFile);
		htmlReporter.loadXMLConfig(configFile);
		extent = new ExtentReports();
		extent.attachReporter(htmlReporter);

		extent.setSystemInfo("User Name", System.getProperty("user.name"));
		Set<Entry<Object, Object>> entrySet = readPropertyFile(propFilePath);

		for(Entry<Object, Object> entry:entrySet ){
			if(entry.getKey().toString().equalsIgnoreCase("Title")){
				htmlReporter.config().setDocumentTitle(entry.getValue().toString());
			}else{
				extent.setSystemInfo(entry.getKey().toString(), entry.getValue().toString());
			}

		}

		htmlReporter.config().setChartVisibilityOnOpen(true);
		htmlReporter.config().setTestViewChartLocation(ChartLocation.TOP);
		htmlReporter.config().setTheme(Theme.DARK);
		return extent;
	}

	public static Set<Entry<Object, Object>> readPropertyFile(String propFilePath){

		Properties prop = new Properties();

		try {
			prop.load(new FileInputStream(propFilePath));
			Set<Entry<Object, Object>> entrySet = prop.entrySet();
			return entrySet;
		} 
		catch (IOException ex) {
			ex.printStackTrace();
			return null;
		}
	}
	//This method is used to click on scroll button
	public static boolean clickOnTopScrollArrowbutton(WebDriver driver,By objLocator)
	{
		try
		{
			bStatus = Verify.verifyElementVisible(driver, objLocator);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Scroll Button is not visible.]";
				return false;
			}
			bStatus = Elements.click(driver, objLocator);
			if(!bStatus)
			{
				Messages.errorMsg = "[ERROR:: Scroll button is not clicked.]";
				return false;	
			}
			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in clickOnScrollButton keyword.]";
			return false;
		}
	}
	public static boolean scrollToWebElementside(WebDriver driver,By objLocator)
	{
		try
		{
			bStatus = scrollToWebElement(driver, objLocator);
			if(!bStatus) {
				return false;
			}

			JavascriptExecutor js = (JavascriptExecutor) Global.driver;
			js.executeScript("window.scrollBy(10,-250)", "");

			return true;
		}
		catch(Exception e)
		{
			Messages.errorMsg = "[ERROR:: Exception Raised in scrollToWebElement keyword.]";
			return false;
		}
	}
}

