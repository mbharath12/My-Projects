from robot.libraries.BuiltIn import BuiltIn
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from robot.libraries.BuiltIn import BuiltIn
import xlrd
import xlwt
from io import BytesIO
import calendar
import time
import lxml.etree as ET
import cx_Oracle
import configparser
import pyodbc
from datetime import date

class CustomLibrary(object):

        def __init__(self):
                pass

        @property
        def _sel_lib(self):
            return BuiltIn().get_library_instance('SeleniumLibrary')

        @property
        def _driver(self):
            return self._sel_lib.driver
        
        def open_chrome_browser(self,url):
            """Return the True if Chrome browser opened """
            selenium = BuiltIn().get_library_instance('SeleniumLibrary')
            try:
                options = webdriver.ChromeOptions()
                options.add_argument("disable-extensions")
                options.add_argument('--ignore-ssl-errors=yes')
                options.add_argument('--ignore-certificate-errors')
                options.add_argument('disable-infobars')
                options.add_experimental_option('prefs', {
                    'credentials_enable_service': False,
                    'profile': {
                        'password_manager_enabled': False
                    }
                })
                options.add_experimental_option("excludeSwitches",["enable-automation","load-extension"])
                selenium.create_webdriver('Chrome',chrome_options=options)
                selenium.go_to(url)
                return True
            except:
                return False
        
        def javascript_click_by_xpath(self,xpath):
            element = self._driver.find_element_by_xpath(xpath) 
            self._driver.execute_script("arguments[0].click();", element)

        def wait_until_time(self,arg):
                time.sleep(int(arg))
            
        def get_ms_excel_row_values_into_dictionary_based_on_key(self,filepath,keyName,sheetName=None):
            """Returns the dictionary of values given row in the MS Excel file """
            workbook = xlrd.open_workbook(filepath)
            snames=workbook.sheet_names()
            dictVar={}
            if sheetName==None:
                sheetName=snames[0]      
            if self.validate_the_sheet_in_ms_excel_file(filepath,sheetName)==False:
                return dictVar
            worksheet=workbook.sheet_by_name(sheetName)
            noofrows=worksheet.nrows
            dictVar={}
            headersList=worksheet.row_values(int(0))
            for rowNo in range(1,int(noofrows)):
                rowValues=worksheet.row_values(int(rowNo))
                if str(rowValues[0])!=str(keyName):
                    continue
                for rowIndex in range(0,len(rowValues)):
                    cell_data=rowValues[rowIndex]
                    if(str(cell_data)=="" or str(cell_data)==None):
                        continue
                    cell_data = self._get_unique_test_data(cell_data)
                    cell_data = self._get_current_date(cell_data)
                
                    dictVar[str(headersList[rowIndex])]=str(cell_data)
            return dictVar

        def get_all_ms_excel_row_values_into_dictionary(self,filepath,sheetName=None):
            """Returns the dictionary of values all row in the MS Excel file """
            workbook = xlrd.open_workbook(filepath)
            snames=workbook.sheet_names()
            all_row_dict={}
            if sheetName==None:
                sheetName=snames[0]      
            if self.validate_the_sheet_in_ms_excel_file(filepath,sheetName)==False:
                return all_row_dict
            worksheet=workbook.sheet_by_name(sheetName)
            noofrows=worksheet.nrows
            headersList=worksheet.row_values(int(0))
            for rowNo in range(1,int(noofrows)):
                each_row_dict={}
                rowValues=worksheet.row_values(int(rowNo))
                for rowIndex in range(0,len(rowValues)):
                    cell_data=rowValues[rowIndex]
                    if(str(cell_data)=="" or str(cell_data)==None):
                        continue
                    cell_data = self._get_unique_test_data(cell_data)
                    cell_data = self._get_current_date(cell_data)
                    each_row_dict[str(headersList[rowIndex])]=str(cell_data)
                all_row_dict[str(rowValues[0])]=each_row_dict
            return all_row_dict

        def get_all_ms_excel_matching_row_values_into_dictionary_based_on_key(self,filepath,keyName,sheetName=None):
            """Returns the dictionary of matching row values from the MS Excel file based on key"""
            workbook = xlrd.open_workbook(filepath)
            snames=workbook.sheet_names()
            all_row_dict={}
            if sheetName==None:
                sheetName=snames[0]      
            if self.validate_the_sheet_in_ms_excel_file(filepath,sheetName)==False:
                return all_row_dict
            worksheet=workbook.sheet_by_name(sheetName)
            noofrows=worksheet.nrows
            headersList=worksheet.row_values(int(0))
            indexValue=1
            for rowNo in range(1,int(noofrows)):
                rowValues=worksheet.row_values(int(rowNo))
                if str(rowValues[0])!=str(keyName):
                    continue
                each_row_dict={}
                for rowIndex in range(0,len(rowValues)):
                    cell_data=rowValues[rowIndex]
                    if(str(cell_data)=="" or str(cell_data)==None):
                        continue
                    cell_data = self._get_unique_test_data(cell_data)
                    cell_data = self._get_current_date(cell_data)
                    each_row_dict[str(headersList[rowIndex])]=str(cell_data)
                all_row_dict[str(indexValue)]=each_row_dict
                indexValue+=1
            return all_row_dict

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
                
        def _get_unique_test_data(self,testdata):
            """Returns the unique if data contains unique word """
            ts = time.strftime("%Y%m%d_%H%M%S")
            unique_string=str(ts)
            testdata = testdata.replace("UNIQUE",unique_string)
            testdata = testdata.replace("Unique",unique_string)
            testdata = testdata.replace("unique",unique_string)
            return testdata

        def validate_the_sheet_in_ms_excel_file(self,filepath,sheetName):
            """Returns the True if the specified work sheets exist in the specifed MS Excel file else False"""
            workbook = xlrd.open_workbook(filepath)
            snames=workbook.sheet_names()
            sStatus=False        
            if sheetName==None:
                return True
            else:
                for sname in snames:
                    if sname.lower()==sheetName.lower():
                        wsname=sname
                        sStatus=True
                        break
                if sStatus==False:
                    print ("Error: The specified sheet: "+str(sheetName)+" doesn't exist in the specified file: " +str(filepath))
            return sStatus

        def wait_until_element_clickable(self,locator):
            """ An Expectation for checking that an element is either invisible or not present on the DOM."""
            if locator.startswith("//") or locator.startswith("(//"):
               WebDriverWait(self._driver, 60).until(EC.element_to_be_clickable((By.XPATH, locator)))
            else:
               WebDriverWait(self._driver, 60).until(EC.element_to_be_clickable((By.ID, locator)))               

        def _connect_to_database(self,username,password):
            """ Connect to oracle database """
            hostname = BuiltIn().get_variable_value("${db_hostname}")
            servciename = BuiltIn().get_variable_value("${db_servicename}")
            port = BuiltIn().get_variable_value("${db_port}")
            dns = hostname +":" + str(port) + "/" + servciename
            connection = cx_Oracle.connect(username, password,dns,encoding="UTF-8")
            return connection

        def _connect_to_a1client04_stop_database(self):
            """ Connect to alclient04 database using username,password """
            username = BuiltIn().get_variable_value("${db_A1Client_username}")
            password = BuiltIn().get_variable_value("${db_A1Client_password}")
            connection = self._connect_to_database(username, password)
            print('connected to a1client04 database')
            return connection

        def _connect_to_vt_device_stop_database(self):
            """ Connect to vt_device database using username,password """
            username = BuiltIn().get_variable_value("${db_VT_Device_username}")
            password = BuiltIn().get_variable_value("${db_VT_Device_password}")
            connection = self._connect_to_database(username, password)
            print('connected to vt_device database')
            return connection

        def create_config_file(self,map):
            """ Creates a new .ini file and it will add the details into the file according to the dictionary details """
            config = configparser.ConfigParser()
            config['loadtest'] = {}
            loadtest = config['loadtest']
            for key in map.keys():
                if key != "TCName":
                   loadtest[key] = map[key]
                   with open("loadtest.ini", 'w') as configfile:
                        config.write(configfile)

        def clear_the_vt_device_database(self,ct_device_id,reported_month):
            """ Clear the vt_device database tables """
            query1 = "DELETE FROM VT_DEVICE.DEVICE_TRACK WHERE CT_DEVICE_ID= "+ ct_device_id +""
            query2 = "DELETE FROM VT_DEVICE.DEVICE_CONTACT WHERE CT_DEVICE_ID= "+ ct_device_id +" and Reported_Month = "+ reported_month +""
            query3 = "DELETE FROM VT_DEVICE.DEVICE_LAST_CONTACT WHERE CT_DEVICE_ID= "+ ct_device_id +""           
            query4 = "DELETE FROM VT_DEVICE.DEVICE_EVENT WHERE CT_DEVICE_ID="+ ct_device_id +""
            connection = self._connect_to_vt_device_stop_database()
            cursor = connection.cursor()
            cursor.execute(query1)
            connection.commit()
            cursor.execute(query2)
            connection.commit()
            cursor.execute(query3)
            connection.commit()
            cursor.execute(query4)
            connection.commit()
            print('All queries are executed')
            connection.close()
  
        def clear_the_a1client04_database(self,ct_tracked_offender_id):
            """ Clear the aiclient04 database tables """
            query1 = "DELETE FROM A1CLIENT04.TO_OPEN_VIOS_CONFIRM tooc\
                        where ct_open_vios_id in (select ct_open_vios_id from A1CLIENT04.TO_OPEN_VIOS where CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +" )"
            query2 = "DELETE FROM a1client04.TO_MONITORED_EVENT_PSTEP tep\
                        where to_monitored_event_id in \
                          (select to_monitored_event_id \
                          from a1client04.TO_MONITORED_EVENT  tme\
                          inner join  A1CLIENT04.TO_OPEN_VIOS tov\
                          on tov.ct_open_vios_id=tme.ct_open_vios_id\
                          and  tov.CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +")"
            query3 = "DELETE FROM a1client04.TO_MONITORED_EVENT where ct_open_vios_id in (select ct_open_vios_id from A1CLIENT04.TO_OPEN_VIOS where CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +" )"
            query4 = "delete from a1client04.TRACKED_OFFENDER_LAST_CONTACT where CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +""
            query5 = "delete from a1client04.TRACKED_OFFENDER_SUMMARY where CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +""
            query6 = "delete from a1client04.TO_OPEN_VIOS_NOTES where ct_open_vios_id in (select ct_open_vios_id from A1CLIENT04.TO_OPEN_VIOS where CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +" )"
            query7 = "DELETE FROM a1client04.TO_OPEN_VIOS WHERE CT_TRACKED_OFFENDER_ID = "+ ct_tracked_offender_id +""
            connection = self._connect_to_a1client04_stop_database()
            cursor = connection.cursor()
            cursor.execute(query1)
            connection.commit()
            cursor.execute(query2)
            connection.commit()
            cursor.execute(query3)
            connection.commit()
            cursor.execute(query4)
            connection.commit()
            cursor.execute(query5)
            connection.commit()
            cursor.execute(query6)
            connection.commit()
            cursor.execute(query7)
            connection.commit()
            print('All queries are executed')
            connection.close()
            
        def get_processed_files_by_auto_player(self,source):
            """ Get the .dat file names """
            start = "File Name: "
            end = ".dat"
            file_names = []
            data = source.split(start)
            for value in data:
                if value != data[0]:
                   if end in value:
                      filepath = "{}{}".format(value.split(end)[0],".dat")
                      file_names.append(filepath)
            print("number of .dat files = " + str(len(file_names)))
            return file_names

        def get_details_from_database(self,query, db_name , arg=0):
            """ Get values from the database """
            time_out = BuiltIn().get_variable_value("${time_out}")
            if db_name == "VT_DEVICE":
                connection = self._connect_to_vt_device_stop_database()
            elif db_name == "A1CLIENT04":
                connection = self._connect_to_a1client04_stop_database()
            else:
                raise Exception('Given Database name not found')
            cursor = connection.cursor()
            dict_values = None
            try:
                for value in range(3):
                    cursor.execute(str(query))
                    columns = map(lambda x:x[arg], cursor.description)
                    records = cursor.fetchall()
                    if len(records) == 0:
                        time.sleep(int(time_out))
                        continue
                    row = records[-1]
                    dict_values = dict(zip(columns, row))
                    if len(records) != 0:
                        break
            except Exception as e: print(e)
            finally:
                connection.close()
                return dict_values
        
        def write_list_values_into_ms_excel_file(self,list_values,testcase_name):
            """"Writes the mismatches of expected and actual results into file """
            mismatch_folder_path =BuiltIn().get_variable_value("${RESULTS_FOLDER}")
            workbook = xlwt.Workbook()
            sheet = workbook.add_sheet('mis_match_results')
            format_styles = xlwt.easyxf('align: horiz center; borders: left thin, right thin, top thin, bottom thin;')
            color_styles = xlwt.easyxf('font:bold True;pattern: pattern solid, fore_colour yellow;align: horiz center; borders: left thin, right thin, top thin, bottom thin;')
            index=len(list_values)
            sheet.write(0, 0, 'MISMATCH_ID', color_styles)
            sheet.write(0, 1, 'TESTCASE_NAME', color_styles)
            sheet.write(0, 2, 'TABLE NAME' , color_styles)
            sheet.write(0, 3, 'MISMATCH DESCRIPTION', color_styles)
            row_num = 1
            for cell_value in range(0,index):
                sheet.write(row_num, 0, "MISMATCH:" +str(row_num), format_styles)
                cell_values = list_values[cell_value].split(",")
                sheet.write(row_num, 1, cell_values[0], format_styles)
                sheet.write(row_num, 2, cell_values[1], format_styles)
                sheet.write(row_num, 3, cell_values[2], format_styles)
                row_num = row_num+1
            file_save = BytesIO()
            timestamp = self._get_unique_test_data("Unique")
            workbook.save(mismatch_folder_path+"/"+testcase_name+"_error_mismatch_"+str(timestamp)+'.xls')
            file_save.close()

        def write_db_values_into_ms_excel_file(self,table_name,dict_values,testcase_name):
            """" Writes the data base query output dictionary values into excel file """
            workbook = xlwt.Workbook()
            sheet = workbook.add_sheet(table_name)
            date_format = xlwt.XFStyle()
            date_format.num_format_str = 'DD-MM-YYYY'
            num_format = xlwt.XFStyle()
            num_format.num_format_str = '0'
            format_styles = xlwt.easyxf('align: horiz center; borders: left thin, right thin, top thin, bottom thin;')
            color_styles = xlwt.easyxf('font:bold True;pattern: pattern solid, fore_colour yellow;align: horiz center; borders: left thin, right thin, top thin, bottom thin;')
            col_num = 1
            sheet.write(0, 0, "TCName", color_styles)
            sheet.write(1, 0, testcase_name, format_styles)
            for key in dict_values.keys():
                if "DATE" in key:
                    sheet.write(0, col_num, key, color_styles)
                    sheet.write(1, col_num, dict_values[key], date_format)
                elif "ID" in key:
                    sheet.write(0, col_num, key, color_styles)
                    sheet.write(1, col_num, dict_values[key], num_format)
                else:
                    sheet.write(0, col_num, key, color_styles)
                    sheet.write(1, col_num, dict_values[key], format_styles)
                col_num = col_num+1
            file_save = BytesIO()
            workbook.save(table_name+'.xls')
            file_save.close()
