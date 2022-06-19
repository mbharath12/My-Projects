package com.technomile.grc.listeners;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

import java.util.concurrent.atomic.AtomicInteger;

public class RetryAnalyzer implements IRetryAnalyzer {

    private static Logger logger = LoggerFactory.getLogger(RetryAnalyzer.class);
    private final int MAX_RETRY_COUNT = 0;
    private AtomicInteger count = new AtomicInteger(MAX_RETRY_COUNT);

    public synchronized boolean isRetryAvailable() {
        return (count.intValue() > 0);
    }

    @Override
    public synchronized boolean retry(ITestResult result) {
        boolean retry = false;
        if (isRetryAvailable()) {
            logger.info("Going to retry test case: " + result.getMethod() + ", " + (MAX_RETRY_COUNT - count.intValue() + 1) + " out of " + MAX_RETRY_COUNT);
            retry = true;
            count.decrementAndGet();
        }
        return retry;
    }
}
