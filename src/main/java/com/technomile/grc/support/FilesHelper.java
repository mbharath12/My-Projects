package com.technomile.grc.support;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

public class FilesHelper {
    private static Logger logger = LoggerFactory.getLogger(FilesHelper.class);

    public static boolean createDirectory(String folderPath) {
        File testDirectory = new File(folderPath);
        if (!testDirectory.exists()) {
            try {
                testDirectory.mkdir();
                logger.debug("directory created: " + folderPath);
            } catch (Exception e) {
                logger.error(String.format("directory cannot be created: %s", folderPath), e.getCause());
                return false;
            }
        } else {
            logger.warn("directory already exists: " + folderPath);
        }
        return true;
    }
}
