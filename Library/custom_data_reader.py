import xlrd
from DataDriver.ReaderConfig import TestCaseData  # return list of TestCaseData to DataDriver
from DataDriver.AbstractReaderClass import AbstractReaderClass  # inherit class from AbstractReaderClass
from robot.libraries.BuiltIn import BuiltIn
from datetime import date

class custom_data_reader(AbstractReaderClass):

        def _validate_the_sheet_in_ms_excel_file(self,filepath,sheetName):
            """Returns the True if the specified work sheets exist in the specifed MS Excel file else False"""
            workbook = xlrd.open_workbook(filepath)
            snames = workbook.sheet_names()
            sStatus = False        
            if sheetName==None:
                return True
            else:
                for sname in snames:
                    if sname.lower()==sheetName.lower():
                        wsname = sname
                        sStatus = True
                        break
                if sStatus==False:
                    print ("Error: The specified sheet: "+str(sheetName)+" doesn't exist in the specified file: " +str(filepath))
            return sStatus

        def get_data_from_source(self):
            """ Returns the list of objects for the flag Yes in the MS Excel file """
            filepath = BuiltIn().get_variable_value("${DATA_DRIVER_FILE_PATH}")
            workbook = xlrd.open_workbook(filepath)
            snames = workbook.sheet_names()
            all_row_dict = {}
            test_data = []
            sheetName = "config_details"      
            if self._validate_the_sheet_in_ms_excel_file(filepath,sheetName) == False:
                raise ValueError('Sheet Name is not found')
            worksheet = workbook.sheet_by_name(sheetName)
            noofrows = worksheet.nrows
            headersList = worksheet.row_values(int(0))
            for rowNo in range(1,int(noofrows)):
                each_row_dict = {}
                rowValues = worksheet.row_values(int(rowNo))
                flag_status = str(rowValues[1])
                if(flag_status == "N" or flag_status == "NONE"):
                    continue
                test_case_details = None 
                for rowIndex in range(0,len(rowValues)):
                    cell_data = rowValues[rowIndex]
                    if(str(cell_data) == "" or str(cell_data) == None):
                        continue
                    cell_data = self._get_current_date(cell_data)
                    each_row_dict[str(headersList[rowIndex])] = str(cell_data)
                test_case_details = TestCaseData(rowValues[0],each_row_dict,['tag'])
                test_data.append(test_case_details)
            return test_data

        def _get_current_date(self,testdata):
            """Returns the current date if data contains TODAY word """
            current_date = date.today()
            if testdata=="CURRENT_DATE":       
                curr_date = str(current_date.strftime("%Y-%m-%d"))
                testdata = testdata.replace("CURRENT_DATE",curr_date)
            if testdata=="CURRENT_DAY":      
                curr_day = str(current_date.day)
                testdata = testdata.replace("CURRENT_DAY",curr_day)
            if testdata=="CURRENT_MONTH":      
                curr_month = str(current_date.month)
                testdata = testdata.replace("CURRENT_MONTH",curr_month)
            if testdata=="CURRENT_YEAR":      
                curr_year = str(current_date.year)
                testdata = testdata.replace("CURRENT_YEAR",curr_year)
            return testdata
