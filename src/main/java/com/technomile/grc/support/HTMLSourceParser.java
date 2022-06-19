package com.technomile.grc.support;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.jsoup.select.Selector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HTMLSourceParser {
    private static Logger logger = LoggerFactory.getLogger(HTMLSourceParser.class);

    public static String getElementAttributeFromHTMLPageSource(String htmlPageSource, String cssQuery, String attr) {
        Document doc = Jsoup.parse(htmlPageSource);
        Elements elements = doc.select(cssQuery);
        if (elements.size() == 0) {
            throw new Selector.SelectorParseException("Invalid Selector. Please provide valid css query to find elements");
        }
        String value = elements.get(0).attr(attr);
        logger.debug(String.format("for %s attribute value found: %s", attr, value));
        return value;
    }
}
