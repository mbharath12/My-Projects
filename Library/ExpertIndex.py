import re
from robot.libraries.BuiltIn import BuiltIn
from selenium import webdriver
from pywinauto import Desktop, Application
from pywinauto.keyboard import send_keys
from pywinauto.controls.common_controls import _treeview_element

class ExpertIndex(object):

        def __init__(self):
                pass

        def attach_expert_index_app(self):
            try:
                expert_index_app = Application(backend='uia').connect(title_re='Encapture Review',auto_id='IndexHost')
                index_win = expert_index_app.window(title='Encapture Review')
                index_win.set_focus()
                index_win.draw_outline()
                return index_win
            except Exception as e:
                print (e)
                return None
        
        def get_text_from_combo_box_by_id_in_expert_index(self, element_id):
            try:
                expert_window = self.attach_expert_index_app()
                return expert_window.child_window(auto_id=element_id).selected_text()
            except Exception as e:
                print (e)
            return None
        
        def click_tree_item_expert_index(self,locator):
            try:
                expert_window = self.attach_expert_index_app()
                item_selected=expert_window.child_window(title=locator,control_type="TreeItem").is_selected()
                if not item_selected:
                   expert_window.child_window(title=locator,control_type="TreeItem").click_input()
            except Exception as e:
                print (e)
