from robot.libraries.BuiltIn import BuiltIn
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from robot.libraries.BuiltIn import BuiltIn
import xlrd
import calendar
import time
import lxml.etree as ET
import cx_Oracle
import pytz
import DatabaseConfig as dbcfg
import pytz
from datetime import datetime
from pytz import timezone



class CustomLibrary(object):

        def __init__(self):
                pass

        @property
        def _sel_lib(self):
            return BuiltIn().get_library_instance('SeleniumLibrary')

        @property
        def _driver(self):
            return self._sel_lib.driver
        
        """ Trim and Add single quotes for organization name in query format"""
        def _getorganisation(self,organizationnames):
            try:    
                print(organizationnames)
                org_list = organizationnames.split('|')
                org_list = [x.strip(' ') for x in org_list]
                org_names = ','.join(map(repr,org_list))
                return org_names
            except Exception as e:
                print (e)
                return None
        
        def open_chrome_browser(self,url):
            """Return the True if Chrome browser opened """
            selenium = BuiltIn().get_library_instance('SeleniumLibrary')
            try:
                options = webdriver.ChromeOptions()
                options.add_argument("disable-extensions")
                options.add_argument('--ignore-ssl-errors=yes')
                options.add_argument('--ignore-certificate-errors')
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

        def get_current_date(self):
            """ Returns the current date in the format month date year"""
            cdate = datetime.now()
            return cdate.strftime("%d/%m/%Y")

        def getTimeForTimezone(self,timeZone):
               format = "%m-%d-%Y %H:%M:%S"
               utcTime = datetime.now(timezone(timeZone))
               print(utcTime.strftime(format))
               utcTime1 = utcTime.strftime(format)
               return utcTime1

        def Retrieve_Data_From_DB(self,query,dbname,username,password):
                """ connnet to the Database"""
                try:
                        print(query)
                        connection = self.connect_to_ENROLLINK_Database()
                        print('DB Connected')
                        cursor = connection.cursor()
                        cursor.execute(query)
                        for row in cursor:
                                print (row)
                        return row
                        connection.close()
                except Exception as e:
                        return e

        def connect_to_ENROLLINK_Database(self):
            try:
                clientpath =BuiltIn().get_variable_value("${db_oracle_client_path}")   
                cx_Oracle.init_oracle_client(lib_dir=clientpath)
            except cx_Oracle.Error as exp:
                print("Oracle client")
                if not (str(exp)=="Oracle Client library has already been initialized"):
                        print ("Connection to Database:" + str(exp))
            try:    
                username =BuiltIn().get_variable_value("${db_enrollink_username}")
                password =BuiltIn().get_variable_value("${db_enrollink_password}")
                hostname =BuiltIn().get_variable_value("${db_hostname}")
                servciename =BuiltIn().get_variable_value("${db_servicename}")
                port =BuiltIn().get_variable_value("${db_port}")
                dns = hostname +":" + str(port) + "/" + servciename
                connection = cx_Oracle.connect(username, password,dns,encoding="UTF-8")
                return connection
            except cx_Oracle.Error as exp:
                print('Connect to Database:' + str(exp))
                return None                
            
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
                    cell_data=self.get_unique_test_data(cell_data)
                
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
                    cell_data=self.get_unique_test_data(cell_data)
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
                    cell_data=self.get_unique_test_data(cell_data)
                    each_row_dict[str(headersList[rowIndex])]=str(cell_data)
                all_row_dict[str(indexValue)]=each_row_dict
                indexValue+=1
            return all_row_dict

        def get_unique_test_data(self,testdata):
            """Returns the unique if data contains unique word """
            ts = time.strftime("%Y%m%d_%H%M%S")
            unique_string=str(ts)
            testdata=testdata.replace("UNIQUE",unique_string)
            testdata=testdata.replace("Unique",unique_string)
            testdata=testdata.replace("unique",unique_string)
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

        def connect_to_STOP_Database(self):
            try:
                clientpath =BuiltIn().get_variable_value("${db_oracle_client_path}")   
                cx_Oracle.init_oracle_client(lib_dir=clientpath)
            except cx_Oracle.Error as exp:
                print("Oracle client")
                if not (str(exp)=="Oracle Client library has already been initialized"):
                        print ("Connection to Database:" + str(exp))
            try:    
                username =BuiltIn().get_variable_value("${db_username}")
                password =BuiltIn().get_variable_value("${db_password}")
                hostname =BuiltIn().get_variable_value("${db_hostname}")
                servciename =BuiltIn().get_variable_value("${db_servicename}")
                port =BuiltIn().get_variable_value("${db_port}")
                dns = hostname +":" + str(port) + "/" + servciename
                connection = cx_Oracle.connect(username, password,dns,encoding="UTF-8")
                print('connect')
                return connection
            except cx_Oracle.Error as exp:
                print('Connect to Database:' + str(exp))
                return None

        def connect_to_ENROLLINK_Database(self):
            try:
                clientpath =BuiltIn().get_variable_value("${db_oracle_client_path}")   
                cx_Oracle.init_oracle_client(lib_dir=clientpath)
            except cx_Oracle.Error as exp:
                print("Oracle client")
                if not (str(exp)=="Oracle Client library has already been initialized"):
                        print ("Connection to Database:" + str(exp))
            try:    
                username =BuiltIn().get_variable_value("${db_enrollink_username}")
                password =BuiltIn().get_variable_value("${db_enrollink_password}")
                hostname =BuiltIn().get_variable_value("${db_hostname}")
                servciename =BuiltIn().get_variable_value("${db_servicename}")
                port =BuiltIn().get_variable_value("${db_port}")
                dns = hostname +":" + str(port) + "/" + servciename
                connection = cx_Oracle.connect(username, password,dns,encoding="UTF-8")
                return connection
            except cx_Oracle.Error as exp:
                print('Connect to Database:' + str(exp))
                return None

        def Retrieve_Data_From_DB(self,query,dbname,username,password):
                """ connnet to the Database"""
                try:
                        print(query)
                        connection = self.connect_to_ENROLLINK_Database()
                        print('DB Connected')
                        cursor = connection.cursor()
                        cursor.execute(query)
                        for row in cursor:
                                print (row)
                        return row
                        connection.close()
                except Exception as e:
                        return e
        
        def get_open_event_details_from_database(self,organisationname,violationdescription='all'):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organisationname)
                query=""
                if (violationdescription=='all'):
                        query = "select ViolationDescription,OFFENDER_FIRST_NAME,OFFENDER_LAST_NAME,ID from "+viewname+".eventread er\
                                Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID\
                                Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid\
                                where ori.ORI_TXT IN (" + org + ")"
                else:
                         query = "select ViolationDescription,OFFENDER_FIRST_NAME,OFFENDER_LAST_NAME,ID from "+viewname+".eventread er\
                                Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID\
                                Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid\
                                where er.ISCONFIRMED=0 and er.ISOPEN=1 and RISKLEVELID <>1 and ViolationDescription='" + violationdescription + "' and ori.ORI_TXT IN (" + org + ")"
                print('query compiled')
                print(query)
                connection = self.connect_to_STOP_Database()
                print('connected to db')
                cursor = connection.cursor()
                cursor.execute(query)
                print('query executed')
                time.sleep(4)
                records = cursor.fetchmany()
                #for row in records:
                #print (row)
                connection.close()
                return records
             
        def get_event_confirmation_status_database(self,eventid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")   
                query = "select ISCONFIRMED,ViolationDescription,OFFENDER_FIRST_NAME,OFFENDER_LAST_NAME,ID from "+viewname+".eventread er\
                       Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID\
                       Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid\
                       where ID = '" + eventid + "'"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchmany(1)
                for row in records:
                 print (row)
                connection.close()
                return row

        def get_enrollee_details_from_database(self,primaryid):
                query = "Select OFFENDER_FIRST_NAME as FirstName ,OFFENDER_LAST_NAME as LastName, DOC_NO AS PrimaryId,\
                       ori.ORI_TXT as Organization,trl.TO_RISK_LEVEL_NAME as RiskLevel,\
                       TZ.TIME_ZONE_TXT AS TimeZone from TRACKED_OFFENDER_PROFILE tp\
                       Inner Join ORI ori on ori.ct_ori_id =tp.CT_ORI_ID\
                       Inner Join TRACKED_OFFENDER_RISK_LEVEL trl on tp.TO_RISK_LEVEL_ID=trl.TO_RISK_LEVEL_ID\
                       INNER JOIN VT_COMMON.T_TIME_ZONE TZ ON tp.TIME_ZONE_CD=TZ.TIME_ZONE_CD\
                       where tp.DOC_NO = '" + primaryid + "'"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_enrollee_assigned_device_details_from_database(self,primaryid):
                query = "Select OFFENDER_FIRST_NAME as FirstName ,OFFENDER_LAST_NAME as LastName, DOC_NO AS PrimaryID,\
                        d.DEVICE_ID_NUM as AssignedDevice from TRACKED_OFFENDER_PROFILE tp\
                        Inner Join TRACKED_OFFENDER_DEVICE_LATEST tdl on tp.CT_TRACKED_OFFENDER_ID=tdl.CT_TRACKED_OFFENDER_ID\
                        Inner Join Device d on d.CT_DEVICE_ID= tdl.TRK_UNIT_ID \
                        where tp.DOC_NO = '" + primaryid + "'"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res
        
        def get_dashboard_enrollee_assigned_count(self,organizationid):
               viewname =BuiltIn().get_variable_value("${db_viewname}")
               org = self._getorganisation(organizationid)             
               query ="SELECT COUNT(*) as Count FROM "+viewname+".ENROLLEEREAD WHERE ENROLLEETYPE=1  AND ISASSIGNED=1 AND ARCHIVEFLAG='N'\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
               print(query)
               connection = self.connect_to_STOP_Database()
               cursor = connection.cursor()
               cursor.execute(query)
               columns = map(lambda x:x[0], cursor.description)
               row= cursor.fetchone()
               res = dict(zip(columns, row))               
               connection.close()
               return res

        def get_dashboard_enrollee_unassigned_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".ENROLLEEREAD WHERE ENROLLEETYPE=1 AND ISASSIGNED=0 AND ARCHIVEFLAG='N'\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_dashboard_events_openevents_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".EVENTREAD WHERE DISPLAYLEVEL=1 AND ISOPEN=1 and Deviceid IS NOT NULL\
                        AND METAEVENTID NOT IN ('397','132','75','129') and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_dashboard_events_inclusionevents_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".EVENTREAD WHERE DISPLAYLEVEL=1 AND METAEVENTID=20 and Deviceid IS NOT NULL\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_dashboard_events_exclusionevents_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".EVENTREAD WHERE DISPLAYLEVEL=1 AND METAEVENTID=10 and Deviceid IS NOT NULL\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_dashboard_events_mastertamperevents_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".EVENTREAD WHERE DISPLAYLEVEL=1 AND METAEVENTID=1003 and Deviceid IS NOT NULL\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_dashboard_inventory_shelfrate_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".ENROLLEEREAD WHERE ENROLLEETYPE=1  AND ISASSIGNED=1 AND ARCHIVEFLAG='N'\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res


        def get_dashboard_inventory_assigned_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                                                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".DEVICEREAD WHERE status=4 AND enrolleeid is not null AND productid in('103','121','141','151')\
                        and ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res
        
        def get_dashboard_inventory_unassigned_count(self,organizationid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                org = self._getorganisation(organizationid)                                                                                                             
                query ="SELECT COUNT(*) as Count FROM "+viewname+".DEVICEREAD WHERE status=5 AND productid in('103','121','141','151')\
                        and  ORGANIZATIONID IN (select ct_ori_id from ORI where ORI_TXT IN (" + org + "))"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res                 
        

        def get_enrollee_assgined_device_serial_num(self,primaryid):
                query="Select d.DEVICE_ID_NUM as AssignedDevice, d.Device_Serial_Num as SerialNum from TRACKED_OFFENDER_PROFILE tp\
                        Inner Join TRACKED_OFFENDER_DEVICE_LATEST tdl on tp.CT_TRACKED_OFFENDER_ID=tdl.CT_TRACKED_OFFENDER_ID\
                        Inner Join Device d on d.CT_DEVICE_ID= tdl.TRK_UNIT_ID\
                        where tp.DOC_NO = '" + primaryid + "'"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res                

        def get_message_id_before_device_operation(self,serialnum):
                query="SELECT Msgid FROM VT_DEVICE.VTCMDS WHERE DEVICEID='" + serialnum + "' and RowNum=1 ORDER BY MsgID DESC"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res  

        def get_commands_after_device_operation(self, serialnum,messageid):
                msgid=str(messageid)
                query="SELECT Command FROM VT_DEVICE.VTCMDS WHERE DEVICEID='" + serialnum + "' and msgid>" + msgid + " ORDER BY MsgID DESC"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchmany()
                connection.close()
                commands_list = []
                for item in records:
                        commands_list.append(item[0])
                return commands_list

        def get_serial_number_for_inventory_operation(self, deviceid):
                # msgid=str(messageid)
                query="select device_serial_num from device where device_id_num='" + deviceid + "'"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res

        def get_all_enrollee_details_from_database(self,organizationnames):                
                org_names = self._getorganisation(organizationnames)
                print(org_names)
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "select lastname || ', ' || firstname as fullname,primaryid,ORI_TXT from I1CLIENT04_DAPI.ENROLLEEREAD er Inner Join ORI ori on ori.ct_ori_id = er.organizationid\
                        where ENROLLEETYPE=1  AND ARCHIVEFLAG='N' and ori_TXT in(" + org_names + ")"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                return final_result
        
        def get_all_inventory_details_from_database(self,organizationnames):                
                org_names = self._getorganisation(organizationnames)
                print(org_names)
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "select dr.serialnumber,ori.ORI_TXT from I1CLIENT04_DAPI.DEVICEREAD dr Inner Join ORI ori on ori.ct_ori_id = dr.organizationid\
                        where producttype in(2,8) and ori_TXT in(" + org_names + ")"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                return final_result
        
        def nested_list_compare(self,app_data,db_data):
                #app_data = [['Farley, Chris', '64646545-ST', 'STOPLLC-CSC'], ['Walker (st), Johnnie', '021220RCKST', 'STOPLLC-CSC']]
                #db_data = [['Walker (st), Johnnie', '021220RCKST', 'STOPLLC-CSC'], ['lname_1616047416, fname_1616047416', '1616047416', 'STOPLLC-CSC']]
                app_db_mismatchlist = [item for item in app_data if item not in db_data]
                if (len(app_db_mismatchlist) != 0):
                        print('Mismatch: Data listed in App is not available in database. Mismatch list: ' , app_db_mismatchlist)
                else:
                        print('App Data and Database data matches. Mismatch list: ' , app_db_mismatchlist)
                        
                db_app_mismatchlist = [item for item in db_data if item not in app_data]
                if (len(db_app_mismatchlist) != 0):
                        print('Mismatch: Data available in database is not listed in App. Mismatch list: ' , db_app_mismatchlist)
                else:
                        print('Database data and App Data Mismatch list: ' ,db_app_mismatchlist)
                        
                if ((len(app_db_mismatchlist)==0) and (len(db_app_mismatchlist)==0)):
                        return True
                else:
                        return False        
             
        def get_unassigned_devices_from_database(self,organizationname):                
                org = self._getorganisation(organizationname)
                print(organizationname)
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "SELECT SERIALNUMBER FROM I1CLIENT04_DAPI.DEVICEREAD WHERE status=5 and ORGANIZATIONID = (select ct_ori_id from ORI where ORI_TXT ='" + organizationname + "') and productid in (103,121,141,151)"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                unassigned = []
                for item in records:
                        unassigned.append(item[0])
                return unassigned

        def get_time_zone_list_from_database(self):                
                #org = self._getorganisation(organizationname)
                #print(organizationname)
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "select TIME_ZONE_TXT from VT_COMMON.T_TIME_ZONE"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                unassigned = []
                for item in records:
                        unassigned.append(item[0])
                return unassigned
                
        def get_enrollee_profile_details_from_database(self,fname,lastname):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "select lastname || ', ' || firstname as fullname,primaryid,ORI_TXT as Organization,TO_RISK_LEVEL_NAME as RiskLevel,\
                        TZ.TIME_ZONE_TXT AS TimeZone, er.id as EnrolleeID from "+viewname+".ENROLLEEREAD er\
                        Inner Join ORI ori on ori.ct_ori_id = er.organizationid\
                        Inner Join TRACKED_OFFENDER_RISK_LEVEL trl on er.RISKLEVELID=trl.TO_RISK_LEVEL_ID\
                        INNER JOIN VT_COMMON.T_TIME_ZONE TZ ON er.TIMEZONECODE=TZ.TIME_ZONE_CD\
                        where firstname='"+ fname +"' and lastname='"+ lastname +"'"                
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))               
                connection.close()
                return res
        
        def get_inventory_device_details_from_database(self,serialnum):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query ="select ori_txt, serialnumber,product_name,device_status_txt,dr.id,to_char(contact_date,'MM/DD/YYYY HH:MI:SS AM') as Contact_Date,\
                        to_char(reported_date,'MM/DD/YYYY HH:MI:SS AM') as Reported_Date from "+viewname+".DEVICEREAD dr \
                        Inner Join ORI ori on ori.ct_ori_id = dr.organizationid \
                        Inner Join VT_common.t_product tp on tp.product_id = dr.productid \
                        Inner Join VT_common.t_device_status ds on ds.device_status_id=dr.status \
                        Inner Join tracked_offender_last_contact tolc on tolc.CT_DEVICE_ID=dr.id \
                        where serialnumber='" + serialnum + "'"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                columns = map(lambda x:x[0], cursor.description)
                row= cursor.fetchone()
                res = dict(zip(columns, row))
                connection.close()
                return res
                        
        def get_event_close_status_from_database(self,eventid):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "select ISOPEN,ViolationDescription,OFFENDER_FIRST_NAME,OFFENDER_LAST_NAME,ID from "+viewname+".eventread er\
                       Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID\
                       Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid\
                       where ID = '" + eventid + "'"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchmany(1)
                for row in records:
                 print (row)
                connection.close()
                return row

        def get_sent_message_details_from_database(self,enrollee_primaryid,textmessage):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "Select notification_text,notification_received_date from "+viewname+".ss_app_2_app_notification Inner Join "+viewname+".ENROLLEEREAD on destination_id=id\
                         where  notification_text = '"+textmessage+"'  and primaryid='"+enrollee_primaryid+"'"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchmany(1)
                for row in records:
                 print (row)
                connection.close()
                return row

        
        def get_enrollee_casenotes_details_from_database(self,primaryid,organizationname):
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "Select tracked_offender_note from "+viewname+".enrolleeread er\
                Inner Join Tracked_offender_note ton on ct_tracked_offender_id=id\
                Inner Join ORI ori on ori.CT_ORI_ID = er.OrganizationID\
                where primaryid='"+primaryid+"' and ori_txt='"+organizationname+"'\
                order by tracked_offender_note_dt desc"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                casenotes = []
                for item in records:
                        casenotes.append(item[0])
                return casenotes

        def check_master_tamper_event_confirmed_for_enrollee(self,organizationName,primaryID):
                viewname =BuiltIn().get_variable_value("${db_viewname}")                                                                                                                         
                query = "select ViolationDescription,OFFENDER_FIRST_NAME,OFFENDER_LAST_NAME,DOC_NO as Primary_ID,ID from "+viewname+".eventread er \
                        Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID \
                        Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid \
                        where er.ISCONFIRMED=1 and RISKLEVELID <>1 and ViolationDescription='Master Tamper' and \
                        ori.ORI_TXT ='" + organizationName +"' and DOC_NO='" + primaryID + "'"
                
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                res='None'
                try:
                        columns = map(lambda x:x[0], cursor.description)
                        row= cursor.fetchone()                        
                        res = dict(zip(columns, row))
                except Exception as e: print(e)
                finally:
                        connection.close()
                        return res

        def get_open_event_details_for_enrollee(self,organizationName,primaryID):
                viewname =BuiltIn().get_variable_value("${db_viewname}")                                                                                                                         
                query = "select ViolationDescription,OFFENDER_FIRST_NAME,OFFENDER_LAST_NAME,ID,DOC_NO as Primary_ID from "+viewname+".eventread er \
                        Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID \
                        Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid \
                        where er.ISCONFIRMED=0 and er.ISOPEN=1 and RISKLEVELID <>1 and \
                        ori.ORI_TXT ='" + organizationName +"' and DOC_NO='" + primaryID + "'"
                
                print(query)
                connection = self.connect_to_STOP_Database()
                print('connected to db')
                cursor = connection.cursor()
                cursor.execute(query)
                print('query executed')
                time.sleep(4)
                records = cursor.fetchmany()
                #for row in records:
                #print (row)
                connection.close()
                return records        
                     
        def get_test_case_id(self):
                tags = BuiltIn().get_variable_value("${TEST TAGS}")
                platform =BuiltIn().get_variable_value("${PLATFORM_NAME}")
                test_id='';
                if (platform=='Android'):
                        test_id = tags[0]
                        #test_id=test_id.replace("Android_test_case_id=","")
                else:
                        test_id = tags[1]
                strTest=test_id.split("=")
                print(strTest)
                test_id = strTest[1]
                return test_id

        def get_risk_level_list_from_database(self,organization):                
                #org = self._getorganisation(organizationname)
                #print(organizationname)
                viewname =BuiltIn().get_variable_value("${db_viewname}")
                query = "select to_risk_level_name from ori_to_risk_level orl\
                        Inner Join tracked_offender_risk_level torl on torl.to_risk_level_id=orl.to_risk_level_id\
                        Inner Join ORI ori on ori.ct_ori_id= orl.ct_ori_id\
                        where ori.ori_txt='" + organization + "'"
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                unassigned = []
                for item in records:
                        unassigned.append(item[0])
                return unassigned
                return False

        def get_inventory_details_from_database(self,organization):
                query = "select serialnumber AS DEVICE_SERIALNUMER,\
                        product_name AS DEVICE_PRODUCTNAME,\
                        ori_txt as Device_OrganizationName,\
                        to_char(contact_date,'MM/DD/YYYY HH:MI:SS AM') as Device_ContactDate,\
                        to_char(reported_date,'MM/DD/YYYY HH:MI:SS AM') as Device_ReportedDate,\
                        device_status_txt AS DEVICE_STATUS\
                        from I1CLIENT04_DAPI.DEVICEREAD dr\
                        Inner Join ORI ori on ori.ct_ori_id = dr.organizationid\
                        Inner Join VT_common.t_product tp on tp.product_id = dr.productid\
                        Inner Join VT_common.t_device_status ds on ds.device_status_id=dr.status\
                        Inner Join tracked_offender_last_contact tolc on tolc.CT_DEVICE_ID=dr.id\
                        where ori_txt in('" + organization + "')\
                        order by DEVICE_SERIALNUMER"
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                return final_result

        def get_events_violation_description_for_enrollee(self,organizationName,primaryID):
                viewname =BuiltIn().get_variable_value("${db_viewname}")                                                                                                                         
                query = "select ViolationDescription from "+viewname+".eventread er \
                        Inner Join ORI ori on ori.ct_ori_id =er.OrganizationID \
                        Inner Join TRACKED_OFFENDER_PROFILE pro ON pro.CT_Tracked_offender_id= er.enrolleeid \
                        where RISKLEVELID <>1 and \
                        ori.ORI_TXT ='" + organizationName +"' and DOC_NO='" + primaryID + "'"
                
                print(query)
                connection = self.connect_to_STOP_Database()
                cursor = connection.cursor()
                cursor.execute(query)
                records = cursor.fetchall()
                final_result = [list(i) for i in records]
                connection.close()
                return final_result
                
        def convert_string_to_dateObj2(self,date_time_str):
                date_time_obj2 = datetime.strptime(date_time_str, '%m-%d-%Y %H:%M:%S')
                return date_time_obj2        

        def convert_string_to_dateObj(self,date_time_str):
                date_time_obj = datetime.strptime(date_time_str, '%m/%d/%Y %I:%M:%S %p')
                return date_time_obj

        def convert_date_time_to_given_timezone(self,date_time_str,current_timezone,convert_timezone):
                date_time_obj = self.convert_string_to_dateObj(date_time_str)
                current_timezone = pytz.timezone(current_timezone)
                convert_timezone = pytz.timezone(convert_timezone)
                localized_timestamp = current_timezone.localize(date_time_obj)
                new_timezone_timestamp = localized_timestamp.astimezone(convert_timezone)
                new_timezone_timestamp= new_timezone_timestamp.replace(tzinfo=None)
                return new_timezone_timestamp        

        def convert_date_time_to_given_timezone2(self,date_time_str,current_timezone,convert_timezone):
                date_time_obj = self.convert_string_to_dateObj2(date_time_str)
                current_timezone = pytz.timezone(current_timezone)
                convert_timezone = pytz.timezone(convert_timezone)
                localized_timestamp = current_timezone.localize(date_time_obj)
                new_timezone_timestamp = localized_timestamp.astimezone(convert_timezone)
                new_timezone_timestamp = new_timezone_timestamp.replace(tzinfo=None)
                return new_timezone_timestamp

        def convert_date_time_format(self,date_time_str):
                #date = datetime.date_time_str
                date_time_obj1 = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M:%S')
                date_time_obj2 = date_time_obj1.strftime('%b %d %Y|%I:%M %p')
                return date_time_obj2

        def get_current_date_ymd(self):
            """ Returns the current date in the format month date year"""
            cdate = datetime.now()
            return cdate.strftime("%Y-%m-%d")


                
