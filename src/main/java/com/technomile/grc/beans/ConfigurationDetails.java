package com.technomile.grc.beans;

import lombok.Getter;
import lombok.Setter;

public class ConfigurationDetails {

    @Setter
    @Getter
    private BrowserDetails browserDetails;

    @Setter
    @Getter
    private String userName;

    @Setter
    @Getter
    private String password;

    @Setter
    @Getter
    private String testDataFileLocation;
}
