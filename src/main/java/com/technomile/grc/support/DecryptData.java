package com.technomile.grc.support;

import com.technomile.grc.constants.ApplicationConstants;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DecryptData {
	private static Logger logger = LoggerFactory.getLogger(DecryptData.class);

	public String decryptDataValue(String sValue) {
		StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
		// This is a Password_key set which was set while encrypting and same key is used while decrypting password
		encryptor.setPassword(ApplicationConstants.ENCRYPT_DECRYPT_KEY);
		return encryptor.decrypt(sValue);
     }
}
