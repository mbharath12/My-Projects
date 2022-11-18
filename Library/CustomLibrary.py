from robot.libraries.BuiltIn import BuiltIn
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pywinauto.keyboard import send_keys
from PIL import Image,ImageChops
import xlrd
import calendar
import time
import re
import configparser
import os
import names
import random as r
import string
import cryptocode
from appdirs import user_data_dir

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
            print(self.get_chrome_profile_path());
            try:                
                options = webdriver.ChromeOptions()
                options.add_argument("disable-extensions")                
                options.add_experimental_option("excludeSwitches",["enable-automation","load-extension"])
                #options.add_argument("user-data-dir=C:\\Users\\sande\\AppData\\Local\\Google\\Chrome\\User Data") #Path to your chrome profile
                #options.add_argument("user-data-dir=" + self.get_chrome_profile_path()) #Path to your chrome profile
                selenium.create_webdriver('Chrome',chrome_options=options)
                selenium.go_to(url)                
            except Exception as e:
                raise e
      

        def javascript_click_by_xpath(self,xpath):
            element = self._driver.find_element_by_xpath(xpath) 
            self._driver.execute_script("arguments[0].click();", element)    

        def wait_until_time(self,arg):
                time.sleep(int(arg))
                
        def get_chrome_profile_path(self):
                chrome_profile_path= user_data_dir('Chrome','Google') + '\\User Data'
                #chrome_profile_path = "C:/Users/Srihari/AppData/Local/Google/Chrome/user data"
                return chrome_profile_path

        
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
                    col_name = str(headersList[rowIndex])                
                    dictVar[col_name]=str(cell_data)
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
            ts = calendar.timegm(time.gmtime())
            unique_string=str(ts)
            testdata=testdata.replace("UNIQUE",unique_string)
            testdata=testdata.replace("Unique",unique_string)
            testdata=testdata.replace("unique",unique_string)
            if testdata != None and "RANDOM_EMAILID" in testdata:
                    email=self.get_email_address()
                    testdata=testdata.replace("RANDOM_EMAILID",email)
            if testdata != None and "RANDOM_PHONENUMBER" in testdata:
                    phno=self.get_phone_number()
                    testdata=testdata.replace("RANDOM_PHONENUMBER",phno)
            if testdata != None and "RANDOM_LASTNAME" in testdata:
                    lastname=self.get_rnd_last_name()
                    testdata=testdata.replace("RANDOM_LASTNAME",lastname)
            if testdata != None and "RANDOM_FIRSTNAME" in testdata:
                    firstname=self.get_rnd_first_name()
                    testdata=testdata.replace("RANDOM_FIRSTNAME",firstname)        
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

        def encrypt_string(self,message):
            """encrypt a string"""
            key = "secret"                 
            encrypted_message = cryptocode.encrypt(message, key)
            return encrypted_message

        def decrypt_string(self,message):
            """decrypt a string"""
            key = "secret"                 
            decrypted_message = cryptocode.decrypt(message, key)
            return decrypted_message

        
        def compare_images(self,expected_file_path,actual_image_path,):
            actual_image = Image.open(actual_image_path)
            expected_image = Image.open(expected_file_path)
            diff = ImageChops.difference(expected_image, actual_image)
            print(diff)
            if list(actual_image.getdata()) == list(expected_image.getdata()):
                    print ("Identical")
                    return False
            else:
                print ("Different")
                return True

        def wait_until_element_clickable(self,locator):
                """ An Expectation for checking that an element is either invisible or not present on the DOM."""
                if locator.startswith("//") or locator.startswith("(//"):
                        print("clickable before")
                        WebDriverWait(self._driver, 60).until(EC.element_to_be_clickable((By.XPATH, locator)))
                        print("clickable after")
                else:
                        WebDriverWait(self._driver, 60).until(EC.element_to_be_clickable((By.ID, locator)))

        

        def _read_ini_file(self):
            config = configparser.ConfigParser()
            workingdirectory = os.getcwd()
            config.read(workingdirectory+'\\increment_data_file.ini')
            return config

        def get_value_from_file(self,key):
            config = self._read_ini_file()
            return config.get('data', key)

        def write_value_to_file(self,key,value):
            config = self._read_ini_file()
            config.set('data',key,value)
            with open(os.getcwd()+'\\increment_data_file.ini', 'w') as configfile:
                config.write(configfile)

        def press_keyboard_key_by_pywinauto(self, key_name):
            send_keys(key_name)
        
        def get_rnd_first_name(self):
                firstname = names.get_first_name()
                print (firstname)
                return firstname

        def get_rnd_last_name(self):
                lastname = names.get_last_name()
                print (lastname)
                return lastname

        def get_phone_number(self):
                ph_no=""
                for i in range(1, 10):
                    ph_no+= str(r.randint(0, 9))
                print (ph_no)
                return ph_no

        def get_email_address(self):                
                res = ''.join(r.choice(string.ascii_letters) for x in range(10))
                res+="@test.com"
                print (res)
                return res
                
        
        
        
        
