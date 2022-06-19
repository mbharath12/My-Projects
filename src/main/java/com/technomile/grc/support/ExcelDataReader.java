package com.technomile.grc.support;

import com.technomile.grc.utils.CommonUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ExcelDataReader {
    private static Logger logger = LoggerFactory.getLogger(ExcelDataReader.class);

    private XSSFWorkbook workbook = null;
    private Row headingHeaderRow;

    public ExcelDataReader(String filepath) {
        FileInputStream fileInputStream = null;
        try {
            filepath = System.getProperty("user.dir") + File.separator + filepath;
            fileInputStream = new FileInputStream(new File(filepath));
            // Create Workbook instance holding reference to .xlsx file
            workbook = new XSSFWorkbook(fileInputStream);
        } catch (final Exception e) {
            logger.error("Error in configuration Details Util for testdata file path " + e.getMessage());
        } finally {
            try {
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
            } catch (final IOException e) {
                logger.error("Error in Closing the fileInputStream " + e.getStackTrace());
            }
        }
    }

    public Map<String, String> getExcelRowValuesIntoMapBasedOnKey(final String sheetType, final String sTestCaseName) {
        Map<String, String> testDataMap = new HashMap<String, String>();
        XSSFSheet sheet = workbook.getSheet(sheetType);
        headingHeaderRow = sheet.getRow(0);
        int colCount = headingHeaderRow.getLastCellNum();
        boolean isTestcaseNameFound = false;
        for (int currentRowId = 1; currentRowId <= sheet.getLastRowNum(); currentRowId++) {
            Row row = sheet.getRow(currentRowId);
            String actTestcaseName = row.getCell(0).getStringCellValue();
            if (!sTestCaseName.equalsIgnoreCase(actTestcaseName)) {
                continue;
            }
            for (int iCounter = 0; iCounter < colCount; iCounter++) {
                String colHeader = headingHeaderRow.getCell(iCounter).getStringCellValue();
                String colValue = getCellData(row.getCell(iCounter));
                if(colValue == null){
                    continue;
                }
                testDataMap.put(colHeader, colValue);
            }
            isTestcaseNameFound = true;
            break;
        }
        if (!isTestcaseNameFound) {
            String errMsg = String.format("%s is an invalid testcase name", sTestCaseName);
            logger.error(errMsg);
            throw new IllegalArgumentException(errMsg);
        }
        logger.info(String.format("read data for testcase: %s",sTestCaseName));
        return testDataMap;
    }

    public Map<String, Map<String, String>> getExcelMultipleRowValuesIntoMapBasedOnKey(final String sheetType, final String sTestCaseName) {
        Map<String, Map<String, String>> testDataMap = new HashMap<String, Map<String, String>>();
        XSSFSheet sheet = workbook.getSheet(sheetType);
        String previousTestCaseName = "";
        int iRowNo = 1;
        headingHeaderRow = sheet.getRow(0);
        int colCount = headingHeaderRow.getLastCellNum();
        boolean isTestcaseNameFound = false;

        for (int currentRowId = 1; currentRowId <= sheet.getLastRowNum(); currentRowId++) {
            Map<String, String> rowData = new HashMap<String, String>();
            Row row = sheet.getRow(currentRowId);

            String actTestcaseName = row.getCell(0).getStringCellValue();

            if ((previousTestCaseName.length () != 0) && (actTestcaseName != previousTestCaseName)) {
                break;
            }
            if (!sTestCaseName.equalsIgnoreCase(actTestcaseName)) {
                continue;
            }
            previousTestCaseName = actTestcaseName;
            for (int iCounter = 0; iCounter < colCount; iCounter++) {
                String colHeader = headingHeaderRow.getCell(iCounter).getStringCellValue();
                String colValue = getCellData(row.getCell(iCounter));
                if(colValue == null){
                    continue;
                }
                rowData.put(colHeader, colValue);
            }
            isTestcaseNameFound = true;
            testDataMap.put("Row"+ iRowNo,rowData);
            iRowNo++;
        }
        if (!isTestcaseNameFound) {
            String errMsg = String.format("%s is an invalid testcase name", sTestCaseName);
            logger.error(errMsg);
            throw new IllegalArgumentException(errMsg);
        }
        logger.info(String.format("read data for testcase: %s",sTestCaseName));
        return testDataMap;
    }


    private static String getCellData(final Cell columnValue) {
        String cellValue = null;
        if (columnValue != null) {
            if (columnValue.getCellType() == CellType.NUMERIC) {
                cellValue = String.valueOf((long) columnValue.getNumericCellValue());
            }
            if (columnValue.getCellType() == CellType.STRING) {
                //write logic to get unique values
                cellValue = columnValue.getStringCellValue();
            }
            cellValue = getUniqueValue(cellValue);
        }
        return cellValue;
    }

    private static String getUniqueValue(String sValue) {
        String uniqueID = String.valueOf(CommonUtil.getTimeStamp());
        sValue = sValue.replace("Unique", uniqueID);
        sValue = sValue.replace("UNIQUE", uniqueID);
        sValue = sValue.replace("unique", uniqueID);
        return sValue;
    }
}
