from robot.libraries.BuiltIn import BuiltIn
import pywinauto
from selenium import webdriver
from pywinauto import Desktop, Application, WindowSpecification
from robot.api.deco import keyword
from pywinauto import application as pwa
from pywinauto.keyboard import send_keys
from pywinauto.controls.common_controls import _treeview_element
from jsonpath_rw_ext import parse
import json
import time
import calendar
from datetime import datetime, time, date
from datetime import datetime
from datetime import date
from time import sleep
import os
import time
import xlrd
import traceback
import pyodbc
import uuid
import requests
from PIL import Image
import sys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
                
class CustomLibrary(object):

        def __init__(self):
            self.app = None
            self.dlg = None
            pass
        
        @property
        def _sel_lib(self):
             return BuiltIn().get_library_instance('SeleniumLibrary')

        @property
        def _driver(self):
            return self._sel_lib.driver
        
        def wait_until_element_is_clickable(self,xpath,time=20):
            WebDriverWait(self._driver, int(time)).until(EC.element_to_be_clickable((By.XPATH, xpath)))

        def javascript_click_by_xpath(self,xpath):
            element = self._driver.find_element_by_xpath(xpath)
            self._driver.execute_script("arguments[0].click();", element)
            
        def open_chrome_browser(self,url,headless=True):
            selenium = BuiltIn().get_library_instance('SeleniumLibrary')
            try:
                options = webdriver.ChromeOptions()
                if headless == True:
                   options.add_argument("--headless")
                options.add_argument("disable-extensions")               
                options.add_experimental_option("excludeSwitches",["enable-automation","load-extension"])
                selenium.create_webdriver('Chrome',chrome_options=options)
                selenium.go_to(url)
                return True
            except:
                return False

        def close_all_application_windows(self):
            white = BuiltIn().get_library_instance('WhiteLibrary')
            try:
                white.attach_application_by_name("EncaptureWindowsClient")
                windows = white.get_application_windows()
                for window in windows:
                        white.attach_window(window)
                        white.close_window()
                        send_keys('%y')
                return True
            except:
                return False

        def send_file_to_encapture(self,file_path):
            try:
                folder = Desktop(backend="uia").TestData
                time.sleep(1)
                file = folder.TestData.ShellFolderView.ItemsView.get_item(file_path)
                time.sleep(1)
                file.click_input()
                file.right_click_input()
                Desktop(backend="uia").Menu.SendtoEncapture.invoke()
                return True
            except Exception as e:
                print (e)
                return False

        def arrange_pages_to_multipage_documents(self,title_name):
            try:
                encaptureApp = Application(backend='uia').connect(title_re=title_name,auto_id='CaptureWizard')
                win = encaptureApp.top_window()
                win.set_focus()
                strp = win.child_window(auto_id='pnlHostedControl')
                point = strp.child_window(title="Include Selected Pages").rectangle().mid_point()
                strp.child_window(title="Include Selected Pages").click_input()
                time.sleep(2)
                send_keys("{VK_SHIFT down}" "{RIGHT 8}" "{VK_SHIFT up}")
                time.sleep(2)
                return True
            except Exception as e:
                print (e)
                return False

        def arrange_all_pages_to_multipage_documents(self,title_name):
            try:
                encaptureApp = Application(backend='uia').connect(title_re=title_name,auto_id='CaptureWizard')
                win = encaptureApp.top_window()
                win.set_focus()
                strp = win.child_window(auto_id='pnlHostedControl')
                point = strp.child_window(title="Include Selected Pages").rectangle().mid_point()
                strp.child_window(title="Include Selected Pages").click_input()
                time.sleep(2)
                send_keys("^a")
                time.sleep(2)
                return True
            except Exception as e:
                print (e)
                return False

        def press_keyboard_key_by_pywinauto(self, key_name, press_count=1):
            try:
                for index in range(0,int(press_count)):
                    send_keys("{"+key_name+"}")
                    sleep(0.5)
                return True
            except:
                return False

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
            faker = BuiltIn().get_library_instance('FakerLibrary')
            unique_string=faker.random_number(5,True)
            unique_string=str(unique_string)
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
        
        def genarate_GUID(self):
            return str(uuid.uuid4())

        def read_file_to_binary(self,filepath) :
            return open(filepath, 'rb').read()

        def click_tool_tip_options(self,option):
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture Expert Capture',auto_id='CaptureHost')
            pywinauto.timings.Timings.app_start_timeout = 20
            capture_win = expert_capture_app.top_window()
            capture_win.set_focus()
            pywinauto.timings.Timings.after_setfocus_wait = 20
            capture_win.child_window(control_type="ToolBar").descendants()[option].click_input()
            pywinauto.timings.Timings.after_button_click_wait = 20
            time.sleep(5)

        def fill_batch_index_values(self,application,application_locator,index_name,index_value):
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture '+application,auto_id=application_locator)
            capture_win = expert_capture_app.top_window()
            capture_win.set_focus()
            pywinauto.timings.Timings.app_start_timeout = 20
            capture_win.child_window(auto_id='tlpBatchFields').child_window(title=index_name, control_type="Text").parent().descendants(control_type="Edit")[0].type_keys(index_value)
            pywinauto.timings.Timings.after_editsetedittext_wait = '20'
            time.sleep(2)

        def fill_document_index_values(self,application,application_locator,index_name,index_value):
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture '+application,auto_id=application_locator)
            capture_win = expert_capture_app.top_window()
            capture_win.set_focus()
            pywinauto.timings.Timings.app_start_timeout = 20
            capture_win.child_window(auto_id='tlpDocumentFields').child_window(title=index_name, control_type="Text").parent().descendants(control_type="Edit")[0].type_keys(index_value)
            pywinauto.timings.Timings.after_editsetedittext_wait = '20'
            time.sleep(2)
                
        def capture_image(self,application,file_name):
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture '+application)
            capture_win = expert_capture_app.window(title_re='Encapture '+application)
            capture_win.set_focus()
            img=capture_win.child_window(auto_id="imageViewerLayout").capture_as_image()
            img.save('Imagecapture/'+file_name+'.png')
                
        def compare_capture_images(self,actual_image_path,expected_file_path):
            actual_image = Image.open(actual_image_path+'.png')
            expected_image = Image.open(expected_file_path+'.png')
            if list(actual_image.getdata()) == list(expected_image.getdata()):
                    print ("Identical")
                    return False
            else:
                print ("Different")
                return True
               
        def select_listbox_values(self,listbox_locator,listbox_value):
            encapture_orchestrator = Application(backend='uia').connect(auto_id='ConfigurationControlForm')
            orchestrator_win = encapture_orchestrator.window(auto_id="ConfigurationControlForm")
            orchestrator_win.draw_outline()
            combo_box = orchestrator_win.child_window(auto_id=listbox_locator,control_type="ComboBox")
            combo_box.click_input()
            time.sleep(2)
            list_items = Desktop(backend="uia").Listbox
            list_items.child_window(title=listbox_value, control_type="ListItem").click_input()
            self.app = None
            
        @keyword
        def GetExistingApplication(self, titleRegex):
            """Given a regex that indicates the window's title text, set the window as the current context."""
            # Reset the dialog and application contexts. We're selecting a new application, so niether of these are valid anymore.
            self.dlg = None
            self.app = None
            # TODO: need to put a sleep/wait loop here, right now it just fails if the window doesn't already exist.
            self.app = pwa.Application().connect(title_re=titleRegex)
            self.dlg = self.app.window(title_re=titleRegex)
            self.dlg.draw_outline()
            
        @keyword
        def startApplication(self, startCommand):
            """ Given a command, execute it and return the identifier for the window it started."""
            # Reset the dialog and application contexts. We're selecting a new application, so niether of these are valid anymore.
            self.dlg = None
            self.app = None
            try:
                self.app = pwa.Application().start(startCommand)
            except pwa.AppStartError:
                   print("could not start the application \"" + startCommand + '"')
            raise


        @keyword
        def GetDialogFromRegex(self, regex):
            """Given a regex, set the dialog who's title matches (in the current application) to the current context. """
            # TODO: make sure an app is selected first. Raise an error if not.
            if self.app:
               try:
                   self.dlg = self.app.window(title_re=regex)
                   self.dlg.draw_outline()
               except:
                    print('could not find the application matching "' + regex + '"')
            else:
               print('No application currently selected. Searching for an application matching "' + regex + '"')
            try:
                self.app = pwa.Application().connect(title_re=regex)
            except:
                print("Could not find application matching \"" + regex + '" while searching for a dialog. No ''application was previously selected.')
                raise
            print("Found an application matching \"" + regex + '". Set this application to the current context.')
            print('Searching for a matching dialog ("' + regex + '")')
            try:
                self.dlg = self.app[regex]
                self.dlg.draw_outline()
            except:
                print('dialog not found matching "' + regex + '"')
                raise
        
        @keyword
        def login_to_client(self):
            self.dlg.child_window(auto_id='userIdBox').type_keys('stungala')
            pywinauto.timings.Timings.after_editsetedittext_wait = '20'
            self.dlg.child_window(auto_id='passwordBox').type_keys('EncaptureQA1')
            pywinauto.timings.Timings.after_editsetedittext_wait = '20'
            self.dlg.child_window(auto_id='saveButton').click_input()
            pywinauto.timings.Timings.after_button_click_wait = '20'

        @keyword
        def Populate_Batch_Values(self,bct_name,scan_mode):
           time.sleep(5)
           self.dlg.child_window(auto_id='contentTypeCombo').select(bct_name)
           pywinauto.timings.Timings.after_listboxselect_wait = 20
           time.sleep(5)
           self.dlg.child_window(auto_id='scanModeCombo').select(scan_mode)
           pywinauto.timings.Timings.after_listboxselect_wait = 20

        @keyword
        def select_documentclass(self,document_name):
            time.sleep(5)
            self.dlg.child_window(auto_id='docClassCombo').select(document_name)
            pywinauto.timings.Timings.after_listboxselect_wait = 20

        @keyword
        def click_document_treeview(self):
            time.sleep(5)
            self.dlg.child_window(auto_id="treeView").click_input()
            pywinauto.timings.Timings.after_click_wait = 20

        @keyword
        def select_dropdown_values(self,dropdown_locator,dropdown_value):
            time.sleep(5)
            self.dlg.child_window(auto_id=dropdown_locator).select(dropdown_value)
            pywinauto.timings.Timings.after_listboxselect_wait = 20
                 
        @keyword
        def drag_and_drop_a_document(self):
            time.sleep(3)
            pywinauto.mouse.press(button='left', coords=(109, 220))
            time.sleep(3)
            pywinauto.mouse.move(coords=(101, 230))
            time.sleep(3)
            pywinauto.mouse.release(button='left', coords=(101, 230))

        @keyword
        def drag_and_drop_of_page(self):
            time.sleep(3)
            pywinauto.mouse.press(button='left', coords=(93,200))
            time.sleep(3)
            pywinauto.mouse.move(coords=(88,216))
            time.sleep(3)
            pywinauto.mouse.release(button='left', coords=(88,216))

        @keyword
        def clear_text_box(self,application,customfield_locator):
            time.sleep(1)
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture '+application)
            pywinauto.timings.Timings.app_start_timeout = 20
            capture_win = expert_capture_app.top_window()
            capture_win.set_focus()
            pywinauto.timings.Timings.after_setfocus_wait = 20
            capture_win.child_window(auto_id=customfield_locator).descendants(control_type="Edit")[0].type_keys('^a{BACKSPACE}')
            pywinauto.timings.Timings.after_click_wait = '20'

        def parse_json_response(self,jsonresponse,key):
            value = json.dumps(jsonresponse[key])
            return value
    
        def parse_array_json_response(self,json_array_response,index,key):
            request_lib = BuiltIn().get_library_instance('RequestsLibrary')
            json_array = request_lib.to_json(json_array_response)
            array_value = json_array[int(index)]
            value = self.parse_json_response(array_value,key)
            return value
          
        def parse_nested_json_response(self,jsonresponse,nestedjsonkey,key):
            value = json.dumps(jsonresponse[nestedjsonkey][key])
            return value
            
        def get_value_from_json(self, json_response, json_path):
            json_path_expr = parse(json_path)
            get_array_value= [match.value for match in json_path_expr.find(json_response)]
            get_value= str(get_array_value)[1:-1]
            return get_value
        
        @keyword
        def do_select_text_from_uploaded_file(self,startX,startY,endX,endY):
            time.sleep(3)
            pywinauto.mouse.press(button='right', coords=(startX,startY))
            time.sleep(3) 
            pywinauto.mouse.move(coords=(endX,endY))
            time.sleep(3)
            pywinauto.mouse.release(button='right', coords=(endX,endY))
            time.sleep(3)

        @keyword
        def do_get_text_from_custom_field(self,application,index_name,custom_field_locator):
            time.sleep(3)
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture '+application)
            capture_win = expert_capture_app.top_window()
            capture_win.set_focus()
            pywinauto.timings.Timings.app_start_timeout = 20
            pywinauto.timings.Timings.after_editsetedittext_wait = '20'
            time.sleep(3)
            #get text from batch cf text box
            text = capture_win.child_window(auto_id=custom_field_locator).child_window(title=index_name, control_type="Text").parent().descendants(control_type="Edit")[0].texts()
            return text
            time.sleep(2)


        def click_on_index_values(self,application,custom_field_locator,index_name):
            expert_capture_app = Application(backend='uia').connect(title_re='Encapture '+application)
            capture_win = expert_capture_app.top_window()
            capture_win.set_focus()
            pywinauto.timings.Timings.app_start_timeout = 20
            capture_win.child_window(auto_id=custom_field_locator).child_window(title=index_name, control_type="Text").parent().descendants(control_type="Edit")[0].click_input()
            pywinauto.timings.Timings.after_editsetedittext_wait = '20'
            time.sleep(2)

        def select_database_combobox(self,listbox_locator,listbox_value):
            encapture_orchestrator = Application(backend='uia').connect(auto_id='ConfigurationControlForm')
            orchestrator_win = encapture_orchestrator.window(auto_id="ConfigurationControlForm")
            orchestrator_win.draw_outline()
            time.sleep(2)
            combo_box = orchestrator_win.child_window(auto_id=listbox_locator).click_input()
            list_items = Desktop(backend="uia").Listbox
            list_items.child_window(title=listbox_value).click_input()
            self.app = None


        def select_default_value_type_combobox(self,listbox_value):
            index = 0
            if listbox_value == "First In List":
               index = 1
            if listbox_value == "None":
               index = 2
            if listbox_value == "Specified Value":
               index = 3                    
            encapture_orchestrator = Application(backend='uia').connect(auto_id='ConfigurationControlForm')
            orchestrator_win = encapture_orchestrator.window(auto_id="ConfigurationControlForm")
            orchestrator_win.set_focus()
            combo_box = orchestrator_win.child_window(auto_id="lookupTypeComboBox").click_input()
            time.sleep(2)
            combo_box = orchestrator_win.child_window(auto_id="lookupTypeComboBox").descendants()[index].click_input()
            self.app = None

        def select_batch_disposition_type_after_timeout(self,listbox_value):
            time.sleep(2)
            self.dlg.child_window(auto_id="timeoutBatchDispositionActionComboBox").select(listbox_value)
            self.app = None

        def select_data_source_combobox_value(self,custom_field_locator,listbox_value):
            time.sleep(1)
            self.dlg.child_window(title=custom_field_locator).parent().descendants()[5].select(listbox_value)
            self.app = None

        @keyword
        def Get_admin_orchistrate__Application(self, titleRegex):
            """Given a regex that indicates the window's title text, set the window as the current context."""
            # Reset the dialog and application contexts. We're selecting a new application, so niether of these are valid anymore.
            self.dlg = None
            self.app = None
            # TODO: need to put a sleep/wait loop here, right now it just fails if the window doesn't already exist.
            self.app = pwa.Application().connect(class_name_re=titleRegex)
            self.dlg = self.app.window(class_name_re=titleRegex)
            self.dlg.draw_outline()
            self.app = None             



        def connect_to_STOP_Database(self):
              try:
                    cx_Oracle.init_oracle_client(lib_dir=r"C:\Oracle\instantclient_19_10")
                    dsn = cx_Oracle.makedsn(dbcfg.hostname, dbcfg.port, service_name=dbcfg.servicename)
                    print(dsn)
                    connection = cx_Oracle.connect(dbcfg.username, dbcfg.password, dsn, encoding=dbcfg.encoding)
                    print('connect')
                    cursor = connection.cursor()
                    query ='select ViolationDescription from A1CLIENT04_DAPI.eventread where OrganizationID=11'
                    cursor.execute(query)
                for row in cursor:
                        print (row)
                return row
                connection.close()
                #return connection
              except cx_Oracle.Error as exp:
                    print('Connect to Database:' + str(exp))
                    return None
