package com.technomile.grc.beans;

import lombok.Getter;
import lombok.Setter;

public class EmailCredentials {

    @Setter
    @Getter
    private String emailUserName;

    @Setter
    @Getter
    private String emailPassword;
}