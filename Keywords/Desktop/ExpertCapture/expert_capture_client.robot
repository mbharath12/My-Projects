*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Open an Existing Batch
    [Arguments]    ${batch_id}
    Open an Existing Batch Window
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:${batch_id}    ${LONG_WAIT}
    Run Keyword If    ${status}==False    Fail    ${batch_id} is not Found in Load window
    WhiteLibrary.Double Click Item    name:${batch_id}
    Verify Application Window is Displayed    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}

Open an Existing Batch Window
    Open Existing Batch
    Switch to Window    1

Select Batch Operation Type From Tool Bar
    [Arguments]    ${tool_bar_menu_option}    ${is_index_based}=True
    Run Keyword If    '${tool_bar_menu_option}'=='Automatic_New_Batch_Creation'    Click Item    name:toolstripbutton1
    Run Keyword If    '${tool_bar_menu_option}'=='Automatic_New_Batch_Creation'    Return From Keyword
    Run Keyword If    '${tool_bar_menu_option}'=='Split_Document'    Click Item    name:Split Document
    Run Keyword If    '${tool_bar_menu_option}'=='Split_Document'    Return From Keyword
    Run Keyword If    '${tool_bar_menu_option}'=='Copy'    Click Item    name:Copy
    Run Keyword If    '${tool_bar_menu_option}'=='Copy'    Return From Keyword
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Batch Option ${tool_bar_menu_option} not found in the options list &{EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU.keys()}
    ${menu_index}    Set Variable    &{EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU}[${tool_bar_menu_option}]
    Run Keyword If    '${menu_index}'=='NA'    Fail    ${tool_bar_menu_option} has no indexed field define. Please define an Index in application variables.
    Run Keyword If    ${is_index_based}==True    WhiteLibrary.Click Toolstrip Button By Index    mainToolStrip    ${menu_index}
    ...    ELSE    Click Item    ${tool_bar_menu_option}
    Run Keyword If    '${tool_bar_menu_option}'=='Start_Scanning_With_Cur_Settings'    Return From Keyword
    Run Keyword If    '${tool_bar_menu_option}'=='Import_Electronic_File' or '${tool_bar_menu_option}'=='Create_Empty_Document' or '${tool_bar_menu_option}'=='Paste'    Handle Confirmation Popup
    [Teardown]

Import Electronic File in Expert Capture
    [Arguments]    ${application}    ${file_name}
    Upload File    Import_Electronic_File    ${application}    ${file_name}

Complete the Batch Process
    Select Batch Operation Type From Tool Bar    Complete_Batch
    Handle Confirmation Popup
    Switch to Window    0

Suspend the Batch Process
    Select Batch Operation Type From Tool Bar    Suspend_Batch
    Handle Confirmation Popup    OK
    Switch to Window    0

Delete the Batch Process
    [Arguments]    ${hidden_status}=False
    Run Keyword If    ${hidden_status}==False    Select Batch Operation Type From Tool Bar    Delete_Batch
    Run Keyword If    ${hidden_status}==True    Select Batch Operation Type From Tool Bar For Hidden Icons    Delete_Batch
    Handle Confirmation Popup
    Switch to Window    0

Validate Batch Should be Completed
    Verify Expert Capture Home Page

Verify Expert Capture Home Page
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    ${label.window.expertcapture.tobegin}    ${LONG_WAIT}
    Run Keyword If    ${status}==False    Fail    To begin, click a button above or choose an option below label is not visible after waiting 20s

Validate Batch Should be Suspended
    Verify Expert Capture Home Page

Validate Batch Should be Deleted
    Verify Expert Capture Home Page

Validate Custom Index Values with the previous Document Custom Index Values
    [Arguments]    ${capture_wizard_document_class_info}    ${file_name}
    Handle Confirmation Popup
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${file_name}    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}

Merge Document with Previous Document
    sleep    500ms
    Press Keyboard Key By Pywinauto    VK_CONTROL down} m {VK_CONTROL up
    Handle Confirmation Popup

Split the document into multiple documents
    Click Item    DocClassSelectPanel
    CustomLibrary.Press Keyboard Key By Pywinauto    VK_RIGHT
    CustomLibrary.Press Keyboard Key By Pywinauto    VK_DOWN    5
    Select Batch Operation Type From Tool Bar    Split_Document
    Handle Confirmation Popup

Validate Batch Should Not Complete With Allow Loose Pages
    [Arguments]    ${window_open_status}=True
    Switch to Window    1
    ${status}    Run Keyword And Return Status    WhiteLibrary.Window Title Should Be    Encapture
    Run Keyword If    ${status}==False    Fail    Allow Loose Pages alert not found after disable "Allow Loose Pages Checkbox"
    Click Item    ${button.window.wizard.ok}
    Run Keyword If    ${window_open_status}==True    Switch to Window    0

Handle Password Protected window
    [Arguments]    ${pdfPassword}=None    ${handle_type}=OK    ${window_open_status}=True
    Wait Until Item Exists    txtPassword    ${MEDIUM_WAIT}
    Run Keyword If    '${pdfPassword}'=='None'    Cancel Password Protected window
    Run Keyword If    '${pdfPassword}'=='None'    Sleep    5s
    Run Keyword If    '${pdfPassword}'=='None'    Cancel Password Protected window
    Run Keyword If    '${pdfPassword}'=='None'    Return From Keyword
    Switch to Window    1
    WhiteLibrary.Input Text To Textbox    txtPassword    ${pdfPassword}
    WhiteLibrary.Click Item    name:${handle_type}
    Run Keyword If    ${window_open_status}==True    Switch to Window    0

Validate batch content type is not Persist in Expert Capture
    [Arguments]    ${batchcontent_description}
    Wait Until Item Exists    ${dropdown.window.expertcapture.contenttype}    ${LONG_WAIT}
    ${bct_description}    Get Text From Combo Box By Id    ${dropdown.window.expertcapture.contenttype}
    ${status}    Run Keyword And Return Status    Should Not Be Equal As Strings    ${bct_description}    ${batchcontent_description}
    Run Keyword If    ${status}==False    ${bct_description} and ${batchcontent_description} are equal

Validate Successful message dailog is visible
    Switch to Window    1
    WhiteLibrary.Click Item    name:OK
    Switch to Window    0

Validate Cut icon in the tool bar menu
    [Arguments]    ${application}    ${cut_icon_status}=True
    ${status}    Run Keyword And Return Status    Validate Cut icon status in tool bar menu    ${application}
    Run Keyword If    '${status}'=='True' and '${cut_icon_status}'=='True'    Return From Keyword    ${cut_icon_status}
    Run Keyword If    '${status}'=='False' and '${cut_icon_status}'=='False'    Return From Keyword    ${cut_icon_status}
    Run Keyword If    '${status}'=='True' and '${cut_icon_status}'=='False'    Fail    Cut icon should not be display because Cutting and Pasting checkbox is unchecked
    Run Keyword If    '${status}'=='False' and '${cut_icon_status}'=='True'    Fail    Cut icon should be display because Cutting and Pasting checkbox is checked.
    [Return]    ${cut_icon_status}

Validate Paste icon in the toolbar menu
    [Arguments]    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Paste
    Run Keyword If    '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Paste

Validate Cut and Paste operation on batch items
    [Arguments]    ${application}    ${expected_cut_status}
    Expand Doument in tree view    ${application}    ${expected_cut_status}
    ${cut_icon_status}    Validate Cut icon in the tool bar menu    ${application}    ${expected_cut_status}
    Run Keyword If    '${cut_icon_status}'=='True'    Validate paste operation in another document    ${application}

Select Batch Operation Type From Tool Bar For Hidden Icons
    [Arguments]    ${tool_bar_menu_option}    ${is_index_based}=True
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Batch Option ${tool_bar_menu_option} not found in the options list &{EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS.keys()}
    ${menu_index}    Set Variable    &{EXPERT_CAPTURE_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}[${tool_bar_menu_option}]
    Run Keyword If    '${menu_index}'=='NA'    Fail    ${tool_bar_menu_option} has no indexed field define. Please define an Index in application variables.
    Run Keyword If    ${is_index_based}==True    WhiteLibrary.Click Toolstrip Button By Index    mainToolStrip    ${menu_index}
    ...    ELSE    Click Item    ${tool_bar_menu_option}
    [Teardown]

Expand Doument in tree view
    [Arguments]    ${application}    ${expected_cut_status}
    Run Keyword If    ${expected_cut_status}==True and '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Prev_Doc_In_Batch
    Run Keyword If    ${expected_cut_status}==False and '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar For Hidden Icons    Prev_Doc_In_Batch
    Run Keyword If    ${expected_cut_status}==True and '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Next_Page
    Run Keyword If    ${expected_cut_status}==False and '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar For Hidden Icons    Next_Page
    Run Keyword If    ${expected_cut_status}==True and '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Prev_Doc_In_Batch
    Run Keyword If    ${expected_cut_status}==False and '${application}'=='Review'    Select Batch Operation Type From Tool Bar For Hidden Icons in Review    Prev_Doc_In_Batch
    Run Keyword If    ${expected_cut_status}==True and '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Next_Page
    Run Keyword If    ${expected_cut_status}==False and '${application}'=='Review'    Select Batch Operation Type From Tool Bar For Hidden Icons in Review    Next_Page

Validate paste operation in another document
    [Arguments]    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Next_Doc_In_Batch
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Next_Doc_In_Batch
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Next_Page
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Next_Page
    ${status}    Run Keyword And Return Status    Validate Paste icon in the toolbar menu    ${application}
    Run Keyword If    ${status}==False    Fail    "Paste icon in the toolbar menu" is not Clicked
    [Teardown]

Cancel Password Protected window
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    txtPassword    ${SHORT_WAIT}
    Run Keyword If    ${status}    WhiteLibrary.Click Item    name:Cancel
    sleep    2s

Handle Next error popup
    Handle Confirmation Popup

Complete the Next error batch
    Handle Confirmation Popup

Validate Inserted Pages Functionality
    [Arguments]    ${expected_status}=True
    Scan Image files
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Run Keyword If    ${expected_status}==True    Insert Pages

Insert Pages
    Handle Insert or Append Pages Popup    Insert pages
    Capture uploaded Image    ${APPLICATION_EXPERT_CAPTURE}
    Click tree item    Page 2
    Capture Image    ${APPLICATION_EXPERT_CAPTURE}    Inserted_Page
    ${status}    Compare Capture Images    ${EXECDIR}\\Imagecapture\\Inserted_Page    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${status}==True    Fail    The page should be inserted after the selected page

Validate Append Pages Functionality
    [Arguments]    ${expected_status}=True
    Scan Image files
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Run Keyword If    ${expected_status}==True    Append Pages

Append Pages
    Handle Insert or Append Pages Popup    Append pages
    Capture uploaded Image    ${APPLICATION_EXPERT_CAPTURE}
    Click tree item    Page 3
    Capture Image    ${APPLICATION_EXPERT_CAPTURE}    Appended_Page
    ${status}    Compare Capture Images    ${EXECDIR}\\Imagecapture\\Appended_Page    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${status}==True    Fail    The page should be appended at the end of pages

Handle Insert or Append Pages Popup
    [Arguments]    ${insert_or_append_page}    ${window_open_status}=True
    Switch to Window    1
    Wait Until Item Exists    name:${insert_or_append_page}    ${LONG_WAIT}
    WhiteLibrary.Click Item    name:${insert_or_append_page}
    Wait Until Item Exists    ${button.window.wizard.ok}    ${LONG_WAIT}
    WhiteLibrary.Click Item    ${button.window.wizard.ok}
    Run Keyword If    ${window_open_status}==True    Switch to Window    0

Validate Show assemble batch confirmation dialog
    [Arguments]    ${expected_status}
    Scan Image files
    Drag And Drop Of Page
    Run Keyword If    ${expected_status}==True    Handle Confirmation Popup

Validate time out batch disposition action
    [Arguments]    ${application}
    sleep    2min
    ${status}    Run Keyword And Return Status    Verify Client Wizard is Launched    ${application}
    Run Keyword If    ${status}==True    Fail    Time out batch dispostion action is not performed after waiting 2min

Validate "Allow batches to be completed with non-visible missing required custom fields"
    [Arguments]    ${expected_status}=False
    Run Keyword If    ${expected_status}==True    Handle Confirmation Popup    OK

Validate non-visible missing required custom fields
    [Arguments]    ${non_visible_required_custom_field}
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:${non_visible_required_custom_field}    ${SHORT_WAIT}
    Run Keyword If    ${status}==True    Fail    ${non_visible_required_custom_field} Hidden Custom Field is Visible

Validate visible missing required custom fields
    ${status}    Run Keyword And Return Status    WhiteLibrary.Wait Until Item Exists    completionErrorLabel    ${LONG_WAIT}
    Run Keyword If    ${status}==False    Fail    The batch is not having Required Custom fields

Validate "Allow batches to be completed with visible missing required custom fields"
    [Arguments]    ${expected_status}=False
    Run Keyword If    ${expected_status}==True    Handle Confirmation Popup    OK

Clear the Required Custom Fields Text
    [Arguments]    ${application}    ${custom_field_locator}
    ${status}    Run Keyword And Return Status    Clear Text Box    ${application}    ${custom_field_locator}
    Run Keyword If    ${status}==False    Batch custom fields are not cleared

Select Batch Operation Type From Tool Bar For Hidden Icons in Review
    [Arguments]    ${tool_bar_menu_option}    ${is_index_based}=True
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Batch Option ${tool_bar_menu_option} not found in the options list &{EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS.keys()}
    ${menu_index}    Set Variable    &{EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}[${tool_bar_menu_option}]
    Run Keyword If    '${menu_index}'=='NA'    Fail    ${tool_bar_menu_option} has no indexed field define. Please define an Index in application variables.
    Run Keyword If    ${is_index_based}==True    WhiteLibrary.Click Toolstrip Button By Index    mainToolStrip    ${menu_index}
    ...    ELSE    Click Item    ${tool_bar_menu_option}

Validate Cut icon status in tool bar menu
    [Arguments]    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Cut
    Run Keyword If    '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Cut

Delete batch items
    [Arguments]    ${application}=Expert Capture
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Delete_Selected_Items
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Delete_Selected_Items

Get Text from Custom Fields
    [Arguments]    ${application}    ${index_field_type}    ${custom_field_name}
    ${img_text}    Run Keyword If    '${index_field_type}'=='Batch'    CustomLibrary.Do Get Text From Custom Field    ${application}    ${custom_field_name}    ${BATCH_CUSTOM_FIELD}
    ...    ELSE    CustomLibrary.Do Get Text From Custom Field    ${application}    ${custom_field_name}    ${DOCUMENT_CUSTOM_FIELD}
    ${img_text}    Convert To String    ${img_text}
    @{text_image}    String.Split String    ${img_text}    '
    ${string_in_batch_text_box}    Set Variable    ${text_image}[1]
    [Return]    ${string_in_batch_text_box}

Validate Custom Field is Populated With Selected OCR text
    [Arguments]    ${application}    ${index_field_type}    ${custom_field_name}
    ${img_text}    Get Text from Custom Fields    ${application}    ${index_field_type}    ${custom_field_name}
    Should Not Be Empty    ${img_text}

Select OCR text from Uploaded file
    [Arguments]    ${application}    ${custom_field_locator}    ${custom_field_name}    ${click_custom_field}=True
    Run Keyword If    '${click_custom_field}'=='True'    CustomLibrary.Click On Index Values    ${application}    ${custom_field_locator}    ${custom_field_name}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_To_Selection
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_To_Selection
    Select Text using OCR from the Electronic Document

Validate Integer Custom Field
    [Arguments]    ${application}    ${custom_field_locator}    ${custom_field_name}    ${expected_text}
    CustomLibrary.Click On Index Values    ${application}    ${custom_field_locator}    ${custom_field_name}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_To_Selection
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_To_Selection
    Select Text using OCR from the Electronic Document
    Sleep    2s
    WhiteLibrary.Verify Label    ${label.window.expertcapture.valueisinvalid}    ${expected_text}

Validate Required Document Custom Fields
    [Arguments]    ${application}    ${index_field_type}    ${custom_field_name}
    ${img_text}    Get Text from Custom Fields    ${application}    ${index_field_type}    ${custom_field_name}
    Run Keyword If    '${img_text}'==' '    Return From Keyword

Select Text using OCR from the Electronic Document
    SikuliLibrary.Add Image Path    ${EXECDIR}\\SikuliImages
    ${status}    Run Keyword And Return Status    SikuliLibrary.Click    OCRTextLaptop.png
    Run Keyword If    '${status}'=='False'    SikuliLibrary.Click    OCRTextDesktop.png
    ${x}    ${y}    WhiteLibrary.Get Mouse Location
    ${intX}    Convert To Integer    ${x}
    ${intY}    Convert To Integer    ${y}
    ${startX}    Evaluate    ${intX}-35
    ${startY}    Evaluate    ${intY}-15
    ${endX}    Evaluate    ${intX}+16
    ${endY}    Evaluate    ${intY}+2
    CustomLibrary.Do Select Text From Uploaded File    ${startX}    ${startY}    ${endX}    ${endY}
