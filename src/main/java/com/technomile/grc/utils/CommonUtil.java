package com.technomile.grc.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class CommonUtil {
    private static Logger logger = LoggerFactory.getLogger(CommonUtil.class);

    public static long getTimeStamp() {
        return System.currentTimeMillis();
    }

    public static void waitUntilTime(long iTimeInMilliSeconds) {
        try {
            Thread.sleep(iTimeInMilliSeconds);
        } catch (InterruptedException e) {
        }
    }

    public static String getHostName(){
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException e) {
            logger.warn("Host name not found for the given machine");
            return "UNKNOWN HOST";
        }
    }
}
