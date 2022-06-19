import re
from robot.libraries.BuiltIn import BuiltIn
from selenium import webdriver
from pywinauto import Desktop, Application
from pywinauto.keyboard import send_keys
from pywinauto.controls.common_controls import _treeview_element
import time

class ExpertCapture(object):

        def __init__(self):
                pass

        def attach_expert_capture_app(self):
            try:
                expert_capture_app = Application(backend='uia').connect(title_re='Encapture Expert Capture',auto_id='CaptureHost')
                capture_win = expert_capture_app.window(title_re='Encapture Expert Capture')
                capture_win.set_focus()
                capture_win.draw_outline()
                return capture_win
            except Exception as e:
                print (e)
                return None
            
        def _select_the_batch_type_to_create(self,select_type):
            try:
                expert_window = self.attach_expert_capture_app()
                expert_window.child_window(title=select_type, control_type="Hyperlink").click_input()
            except Exception as e:
                print (e)

        def open_existing_batch(self):
            self._select_the_batch_type_to_create("Open an existing batch")

        def expand_or_collapse_uploaded_expert_capture_batch_document_tree_view(self, document_title, isExpandOp=True):
            try:
                expert_window = self.attach_expert_capture_app()
                isExpanded = expert_window.child_window(title = document_title).is_expanded()
                if not isExpanded and isExpandOp:
                   expert_window.child_window(title = document_title).expand()
                else:
                     if isExpanded and not isExpandOp:
                        expert_window.child_window(title = document_title).collapse()
            except Exception as e:
                print (e)
            
        def collapse_document_tree_view(self, document_title):
            self.expand_or_collapse_uploaded_expert_capture_batch_document_tree_view(document_title, False)

        def expand_document_tree_view(self, document_title):
            self.expand_or_collapse_uploaded_expert_capture_batch_document_tree_view(document_title, True)
                
        def get_expert_capture_batch_name(self):
            try:
                expert_window = self.attach_expert_capture_app()
                descendants = str((expert_window.child_window(auto_id='treeView').descendants())[0])
                return re.findall(r"'(.*?)'", descendants, re.DOTALL)[0]                 
            except Exception as e:
                print (e)
                return None
        
        def get_list_of_pages_in_uploaded_document(self, document_title):
            list_of_pages = []
            try:
                expert_window = self.attach_expert_capture_app()
                doc_tree_child_nodes = expert_window.child_window(title = document_title).sub_elements()                
                for node in doc_tree_child_nodes:
                    list_of_pages.append(re.findall(r"'(.*?)'", str(node), re.DOTALL)[0])
            except Exception as e:
                print (e)
            return list_of_pages
      
        def get_text_from_combo_box_by_id(self, element_id):
            try:
                expert_window = self.attach_expert_capture_app()
                return expert_window.child_window(auto_id=element_id).selected_text()
            except Exception as e:
                print (e)
            return None


  
        def validate_expand_batch_items(self,batch_item_title):
                try:
                    expert_window = self.attach_expert_capture_app()
                    status = expert_window.child_window(title = batch_item_title,control_type="TreeItem").is_expanded()
                    return status
                except Exception as e:
                        print (e)
                        return False
                
        def validate_collapse_batch_items(self,batch_item_title):
                try:
                    expert_window = self.attach_expert_capture_app()
                    status = expert_window.child_window(title = batch_item_title,control_type="TreeItem").is_collapsed()
                    return status
                except Exception as e:
                        print (e)
                        return False

        def expand_or_collapse_batch_items_in_tree_view(self, batch_item_title, isExpandOp=True):
            try:
                expert_window = self.attach_expert_capture_app()
                isExpanded = expert_window.child_window(title = batch_item_title,control_type="TreeItem").is_expanded()
                if not isExpanded and isExpandOp:
                   expert_window.child_window(title = batch_item_title).expand()
                else:
                     if isExpanded and not isExpandOp:
                        expert_window.child_window(title = batch_item_title).collapse()
            except Exception as e:
                print (e)

        def click_tree_item(self,locator):
            try:
                expert_window = self.attach_expert_capture_app()
                item_selected=expert_window.child_window(title=locator,control_type="TreeItem").is_selected()
                if not item_selected:
                   expert_window.child_window(title=locator,control_type="TreeItem").click_input()
            except Exception as e:
                print (e)
           
