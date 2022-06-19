package com.technomile.grc.config;

import com.technomile.grc.constants.ApplicationConstants;
import org.aeonbits.owner.Config;

/**
 * more details to use https://dev.to/eliasnogueira/easily-manage-properties-files-in-java-with-owner-1p6k
 */

@Config.Sources({"classpath:" + ApplicationConstants.EMAIL_PROPERTY_FILE})
public interface EmailConfig extends Config {

    @Key("Approver1")
    String approver1();

    @Key("User1Name")
    String user1Name();

    @Key("User1Password")
    String user1Password();

    @Key("Approver2")
    String approver2();

    @Key("User2Name")
    String user2Name();

    @Key("User2Password")
    String user2Password();

    @Key("Approver3")
    String approver3();

    @Key("User3Name")
    String user3Name();

    @Key("User3Password")
    String user3Password();
}
