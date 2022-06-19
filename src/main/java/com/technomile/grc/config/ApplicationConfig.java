package com.technomile.grc.config;

import com.technomile.grc.constants.ApplicationConstants;
import org.aeonbits.owner.Config;

/**
 * more details to use https://dev.to/eliasnogueira/easily-manage-properties-files-in-java-with-owner-1p6k
 */

@Config.Sources({"classpath:" + ApplicationConstants.AUT_PROPERTY_FILE})
public interface ApplicationConfig extends Config {

    @Key("BrowserName")
    String browserName();

    @Key("ApplicationURL")
    String applicationURL();

    @Key("UserName")
    String userName();

    @Key("Password")
    String password();

    @Key("TestDataFileLocation")
    String testDataLocation();
}
