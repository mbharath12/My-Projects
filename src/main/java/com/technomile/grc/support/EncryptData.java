package com.technomile.grc.support;

import com.technomile.grc.constants.ApplicationConstants;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.Test;

public class EncryptData {
    private static Logger logger = LoggerFactory.getLogger(EncryptData.class);

    public String encryptDataValue(String value) {
        //Encrypting password
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword(ApplicationConstants.ENCRYPT_DECRYPT_KEY);
        return encryptor.encrypt(value);
    }

    //method to generate encrypted value
    @Test
	private void encryptDataValueTest(){
        String expValue = "Qualizeal@123";
		String encrypt = encryptDataValue(expValue);
		String actvalue = new DecryptData().decryptDataValue(encrypt);
        logger.info("Encrypted value: "+encrypt);
        Assert.assertEquals(expValue,actvalue);
	}
}
