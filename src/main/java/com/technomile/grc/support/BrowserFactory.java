package com.technomile.grc.support;

import com.technomile.grc.beans.BrowserDetails;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class BrowserFactory {
    private static Logger logger = LoggerFactory.getLogger(BrowserFactory.class);
    private static ThreadLocal<WebDriver> webDriver = new ThreadLocal<WebDriver>();

    private static final String FIREFOX = "firefox";
    private static final String CHROME = "chrome";
    private static final String EDGE = "edge";

    public static WebDriver startSession(BrowserDetails browserDetails) {
        if (webDriver.get() == null) {
            final WebDriver driver = createBrowserInstance(browserDetails);
            webDriver.set(driver);
        }
        webDriver.get().get(browserDetails.getApplicationURL());
        return webDriver.get();
    }

    public static WebDriver getDriver() {
        return webDriver.get();
    }

    private static WebDriver createBrowserInstance(BrowserDetails browserDetails) {
        WebDriver driver = null;
        if (browserDetails.getBrowserName().equalsIgnoreCase(FIREFOX)) {
            logger.debug("launching firefox browser..");
            WebDriverManager.firefoxdriver().setup();
            driver = new FirefoxDriver();
        } else if (browserDetails.getBrowserName().equalsIgnoreCase(EDGE)) {
            logger.debug("launching edge browser..");
            WebDriverManager.edgedriver().setup();
            driver = new EdgeDriver();
        } else if (browserDetails.getBrowserName().equalsIgnoreCase(CHROME)) {
            logger.debug("launching chrome browser..");
            WebDriverManager.chromedriver().setup();
            driver = new ChromeDriver(getChromeOptions());
        } else {
            logger.error("fail to launch illegal browser name : " + browserDetails.getBrowserName());
            throw new IllegalArgumentException("Please provide valid browser name. Available browser names: firefox/chrome/edge");
        }
        logger.debug("browser launched successfully..");
        return driver;
    }

    public static void closeSession() {
        webDriver.get().quit();
        webDriver.set(null);
    }

    private static ChromeOptions getChromeOptions() {
        //to add more options based on requirement
        ChromeOptions options = new ChromeOptions();
        options.addArguments("disable-extensions");
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation", "load-extension"});
        //to add more preferences
        Map<String, Object> prefs = new HashMap<String, Object>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        options.setExperimentalOption("prefs", prefs);
        return options;
    }
}