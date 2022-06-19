from robot.libraries.BuiltIn import BuiltIn
from selenium import webdriver
from pywinauto import Desktop, Application
from pywinauto.keyboard import send_keys
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

class BatchMonitor(object):

        def __init__(self):
                pass
            
        def attach_batch_monitor_app(self):
            try:
                expert_capture_app = Application(backend='uia').connect(title_re='Encapture Monitor')
                capture_win = expert_capture_app.top_window()
                capture_win.set_focus()
                return capture_win
            except Exception as e:
                print (e)
                return None
            
        def select_value_from_combobox_in_search_view(self,combo_index,combo_value):
            try:
                 expert_window = self.attach_batch_monitor_app()
                 (expert_window.child_window(auto_id='SearchControl').descendants(control_type="ComboBox"))[int(combo_index)].type_keys("%{DOWN}")
                 white = BuiltIn().get_library_instance('WhiteLibrary')
                 white.click_item("name:"+combo_value)
            except Exception as e:
                print (e)
                return None

        def enter_text_in_search_view(self,field_index,field_value):
            try:
                 expert_window = self.attach_batch_monitor_app()
                 (expert_window.child_window(auto_id='SearchControl').descendants(control_type="Edit"))[int(field_index)].click_input()
                 send_keys(field_value)
            except Exception as e:
                print (e)
                return None
