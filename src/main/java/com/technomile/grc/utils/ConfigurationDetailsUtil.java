package com.technomile.grc.utils;

import com.technomile.grc.beans.BrowserDetails;
import com.technomile.grc.beans.ConfigurationDetails;
import com.technomile.grc.config.ApplicationConfig;
import com.technomile.grc.support.DecryptData;
import org.aeonbits.owner.ConfigFactory;


public class ConfigurationDetailsUtil {

    private static ConfigurationDetails configurationDetails;
    private static ConfigurationDetailsUtil configurationDetailsUtil;

    public ConfigurationDetails getConfigurationDetails() {
        if (configurationDetails == null) {
            configurationDetails = getDetailsFromPropertyFile();
        }
        return configurationDetails;
    }

    public static ConfigurationDetailsUtil getInstance() {
        if (configurationDetailsUtil == null) {
            return configurationDetailsUtil = new ConfigurationDetailsUtil();
        } else {
            return configurationDetailsUtil;
        }
    }

    public ConfigurationDetails getDetailsFromPropertyFile() {
        ConfigurationDetails configurationDetails = new ConfigurationDetails();
        DecryptData decryptdata = new DecryptData();
        ApplicationConfig appConfig = ConfigFactory.create(ApplicationConfig.class);
        BrowserDetails browserDetails = new BrowserDetails();

        browserDetails.setBrowserName(appConfig.browserName());
        browserDetails.setApplicationURL(appConfig.applicationURL());

        configurationDetails.setBrowserDetails(browserDetails);
        configurationDetails.setUserName(appConfig.userName());
        configurationDetails.setPassword(decryptdata.decryptDataValue(appConfig.password()));
        configurationDetails.setTestDataFileLocation(appConfig.testDataLocation());
        return configurationDetails;
    }

}
