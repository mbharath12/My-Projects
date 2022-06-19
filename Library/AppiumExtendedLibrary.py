import subprocess
import platform
from appium.webdriver.appium_service import AppiumService
from appium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from robot.libraries.BuiltIn import BuiltIn
from time import sleep
import time

class AppiumExtendedLibrary(object):
        
        def __init__(self):   
            pass
        
        @property
        def _appium_lib(self):
            return BuiltIn().get_library_instance('AppiumLibrary')

        @property
        def _driver(self):
            return self._appium_lib._current_application()

        def start_appium_server(self):
            service = AppiumService()
            service.start()

        def get_co_ordinates(self) :
                bounds = self._driver.find_element_by_xpath('//android.widget.ScrollView').get_attribute('bounds')
                replace_string = bounds.replace("][" , ",")
                print(replace_string)
                remove_string = replace_string.strip("[]")
                print(remove_string)
                list = []
                split_string = remove_string.split(",")
                x_co_ordinate = int(split_string[0])
                print(x_co_ordinate)
                y_co_ordinate = int(split_string[1])
                print(y_co_ordinate)
                xy_co_ordinate = int(split_string[2])
                print(xy_co_ordinate)
                yx_co_ordinate = int(split_string[3])
                print(yx_co_ordinate)
                x = eval("x_co_ordinate + 300")
                y = eval("y_co_ordinate + 900")
                xy = eval("xy_co_ordinate - 700")
                yx = eval("yx_co_ordinate - 1600")
                return x,y,xy,yx
        
        def stop_appium_server(self) :
            try:
                platform_name = platform.system()
                if platform_name == 'Windows' :
                   args = ['taskkill' , '/f' , '/IM' , 'node.exe']
                elif platform_name == 'darwin' :
                     args = ['killall' , 'node']
                subprocess.Popen(args=args)                
                return True
            except Exception as e:
                print (e)    
                return False
        
        def swipe_down_to_element(self,locator,swipe_count=2): 
            element_status = False
            list = []
            for count in range(swipe_count):
                element_status = self.is_element_visible(locator)
                if not element_status:
                   list = self.get_co_ordinates()
                   self._appium_lib.swipe(list[0], list[1], list[2], list[3])
                   time.sleep(1)
                   if count == swipe_count-1:
                      return self.is_element_visible(locator)
                else:
                   break   
            return element_status
        
        def swipe_up_to_element(self,locator,swipe_count=2): 
            element_status = False
            for count in range(swipe_count):
                element_status = self.is_element_visible(locator)
                if not element_status: 
                   self._appium_lib.swipe(700, 700, 700, 2050)
                   if count == swipe_count-1:
                      return self.is_element_visible(locator)
                else:
                   break   
            return element_status

        def swipe_up(self,swipe_count=2): 
            element_status = False
            for count in range(swipe_count): 
                   self._appium_lib.swipe(500, 440, 500, 1360)
                   time.sleep(1)
            return None

        def swipe_down(self,swipe_count=1): 
            element_status = False
            list = []
            for count in range(swipe_count):
                   list = self.get_co_ordinates()
                   self._appium_lib.swipe(list[0], list[1], list[2], list[3])
                   time.sleep(1)
            return None        
        
        def is_element_visible(self, locator):
            try:
               self._appium_lib.element_should_be_visible(locator)
               return True
            except Exception as e:
               print(e)
               return False
        
        def scroll_down_in_ios_app(self,locator):
            for count in range(10):
                status = self._driver.find_element_by_ios_predicate(locator).is_displayed
                if not status:
                    self._driver.execute_script("mobile: scroll", {"direction": "down"})
                    time.sleep(1)
                else:
                    break

        def click_image(self, pathofimage):
            el = self._driver.find_element_by_image(pathofimage)
            el.click()

        def wait_until_element_clickable(self,locator):
            """ An Expectation for checking that an element is either invisible or not present on the DOM."""
            if locator.startswith("//") or locator.startswith("(//"):
               WebDriverWait(self._driver, 60).until(EC.element_to_be_clickable((By.XPATH, locator)))
            else:
               WebDriverWait(self._driver, 60).until(EC.element_to_be_clickable((By.ID, locator)))

        def swipe_down_to_element_to_unassign_device(self,locator,swipe_count=2): 
            element_status = False
            for count in range(swipe_count):
                element_status = self.is_element_visible(locator)
                if not element_status: 
                   self._appium_lib.swipe(700, 2050, 700, 700)
                   if count == swipe_count-1:
                      return self.is_element_visible(locator)
                else:
                   break   
            return element_status
