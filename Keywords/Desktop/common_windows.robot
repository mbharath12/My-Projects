*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Close Encapture Application
    Run Keyword And Ignore Error    Attach Application By Name    EncaptureWindowsClient
    Run Keyword And Ignore Error    WhiteLibrary.Close Application

Select File And Send To Encapture
    [Arguments]    ${fileName}
    File Should Exist    ${TESTDATA_FOLDER}\\${fileName}    File not found in TestData folder.
    Process.Start Process    explorer.exe    ${TESTDATA_FOLDER}
    Send File To Encapture    ${fileName}
    Verify Client Wizard is Launched    Encapture

Verify File Upload Error Message
    ${error_status}    Run Keyword And Return Status    Wait Until Item Exists    name:RichEdit Control    ${MEDIUM_WAIT}
    Return From Keyword If    ${error_status}==False    Fail    Error Message was not displayed on selecting text file for BCT accepting only text file
    ${error_msg}    Get Bulk Text From Textbox    name:RichEdit Control
    Log    ${error_msg}
    ${error_status}    Run Keyword And Return Status    Should Contain    ${error_msg}    file type is invalid
    Press Keyboard Key By Pywinauto    ENTER
    Run Keyword If    ${error_status}==False    Fail    Error Message was not displayed on selecting text file for BCT accepting only text file

Restart Encapture Wizard Services
    [Arguments]    ${time_out}=True
    Close Encapture Application
    Start Process    C:\\Program Files\\Imagine Solutions Encapture Client\\EncaptureClient.exe    alias=app
    Run Keyword If    '${time_out}'=='True'    sleep    15s

Handle Confirmation Popup
    [Arguments]    ${handle_type}=Yes    ${window_open_status}=True
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    name:${handle_type}    ${LONG_WAIT}
    Click Item    name:${handle_type}
    Run Keyword If    ${window_open_status}==True    Switch to Window    0

Switch to Window
    [Arguments]    ${window_name}
    @{windows}    Wait Until Keyword Succeeds    ${SHORT_WAIT}    ${SHORT_WAIT}    Get Application Windows
    Run Keyword If    ${window_name}==0    Attach Window    ${windows}[0]
    Run Keyword If    ${window_name}==0    Return From Keyword
    FOR    ${index}    IN RANGE    1    20
        @{windows}    Get Application Windows
        ${window_size}    Get Length    ${windows}
        Run Keyword If    ${window_size}<2    Sleep    1s
        ...    ELSE    Exit For Loop
        Run Keyword If    ${window_size}<2    Continue For Loop
    END
    Attach Window    ${windows}[1]

Verify Application Window is Displayed
    [Arguments]    ${application_name}
    Attach Window    ${application_name}
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    ${dropdown.window.expertcapture.contenttype}    ${LONG_WAIT}
    Run Keyword If    ${status}==False    Fail    ${application_name} Window is not visible for 30 sec

Validate Combobox Value
    [Arguments]    ${combox_id}    ${expected_text}    ${application_window_name}
    ${actual_text}    Run Keyword If    '${application_window_name}'=='Encapture Expert Capture'    Get Text From Combo Box By Id    ${combox_id}
    Run Keyword If    '${actual_text}' !='None'    Should Be Equal    ${actual_text}    ${expected_text}    msg=Actual Combobox value- ${actual_text} is not match with expected value -${expected_text}
    Run Keyword If    '${application_window_name}'=='Encapture Expert Capture'    Return From Keyword
    ${actual_text}    Run Keyword If    '${application_window_name}'=='Encapture Review'    Get Text From Combo Box By Id In Expert Index    ${combox_id}
    Should Be Equal    ${actual_text}    ${expected_text}    msg=Actual Combobox value- ${actual_text} is not match with expected value -${expected_text}

Validate Batch Index Values
    [Arguments]    ${common_index_data}
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${common_index_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${index_count}    Get Length    ${name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:@{name_and_value}[0]    ${SHORT_WAIT}
        Run Keyword If    ${status}==False    Fail    @{name_and_value}[0] Batch Index Value is Not Visible
    END

Validate Batch Index Values for All Document Class
    [Arguments]    ${doc_class_data}    ${file_names}    ${application_window_name}
    @{filenames}    Split String    ${file_names}    |
    ${count}    Set Variable    ${0}
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        Validate Batch Index Values for Document Class    ${each_doc_class}    ${application_window_name}
        ${count}    Set Variable    ${count+1}
    END

Validate Batch Content Type is selected
    [Arguments]    ${batch_id}    ${application_window_name}
    Verify Application Window is Displayed    ${application_window_name}
    Validate Combobox Value    ${dropdown.window.expertcapture.contenttype}    ${batch_id}    ${application_window_name}

Validate Batch Index Values for Document Class
    [Arguments]    ${common_index_data}    ${application_window_name}
    Validate Combobox Value    ${dropdown.window.expertcapture.documentclass}    ${common_index_data}[DocumentClass]    ${application_window_name}
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword

Select Document in the Tree View
    [Arguments]    ${document_name}
    Get Existing Application    ${APPLICATION_ENCAPTURE_REVIEW}
    Select Dropdown Values    documentClassFilter    DC_001
    Click Document Treeview
    Press Keyboard Key By Pywinauto    VK_DOWN

Validate Deleted or Completed Batch should not be displayed in Existing Batch Window
    [Arguments]    ${batch_id}    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Open Existing Batch
    Run Keyword If    '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Open_Index_Existing_Batch
    Switch to Window    1
    ${status}    Run Keyword And Return Status    WhiteLibrary.Wait Until Item Does Not Exist    name:${batch_id}    ${SHORT_WAIT}
    Click Item    cancelButton
    Run Keyword If    ${status}==False    Fail    ${batch_id} Suspended batch is Found in Load window after Complete
    Switch to Window    0

Fill Batch Content Index data
    [Arguments]    ${common_index_data}    ${application}=${APPLICATION_EXPERT_CAPTURE}    ${locator}=CaptureHost
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${common_index_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${index_count}    Get Length    ${name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:@{name_and_value}[0]    ${SHORT_WAIT}
        Run Keyword If    ${status}==False    Fail    @{name_and_value}[0] Batch Index Value is Not Visible
        CustomLibrary.Fill Batch Index Values    ${application}    ${locator}    @{name_and_value}[0]    @{name_and_value}[1]
    END

Fill Index Values for a Document Class
    [Arguments]    ${common_index_data}    ${application}    ${application_locator}    ${doc_password}=None    ${ifclickstatus}=True
    Get Existing Application    Encapture ${application}
    Run Keyword If    '${ifclickstatus}'=='True'    Select Documentclass    ${common_index_data}[DocumentClass]
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${common_index_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${index_count}    Get Length    ${name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:@{name_and_value}[0]    ${LONG_WAIT}
        Run Keyword If    ${status}==False    Fail    @{name_and_value}[0] Document Index Value is Not Visible
        ${staus}    Run Keyword And Return Status    Wait Until Item Exists    txtPassword    ${SHORT_WAIT}
        Run Keyword If    '${staus}'=='True' and '${doc_password}'=='None'    Cancel Password Protected window
        CustomLibrary.Fill Document Index Values    ${application}    ${application_locator}    @{name_and_value}[0]    @{name_and_value}[1]
    END
    Sleep    2s

Upload Document and Fill Index Values for All Document Classes
    [Arguments]    ${doc_class_data}    ${application}    ${locator}    ${file_names}    ${fill_doc_class}=True    ${pasword_protect_doc}=No    ${doc_password}=None
    @{filenames}    Split String    ${file_names}    |
    ${count}    Set Variable    ${0}
    ${filescount}    Get Length    ${filenames}
    ${click_status}    Set Variable If    '${filescount}'=='1'    False    True
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        Import Electronic File in Expert Capture    ${application}    ${filenames}[${count}]
        Run Keyword If    '${pasword_protect_doc}' !='No'    Handle Password Protected window    ${doc_password}
        Wait Until Item Exists    ${dropdown.window.expertcapture.documentclass}    ${LONG_WAIT}
        Run Keyword if    '${fill_doc_class}'=='True'    Fill Index Values for a Document Class    ${each_doc_class}    ${application}    ${locator}    None    ${click_status}
        ${count}    Set Variable    ${count+1}
    END

Create an Empty Document
    [Arguments]    ${application}
    Upload File    Create_Empty_Document    ${application}    None

Upload File
    [Arguments]    ${operation_type}    ${application}=Expert Capture    ${file_name}=None
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    ${operation_type}
    Run Keyword If    '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    ${operation_type}
    Run Keyword If    '${file_name}'=='None'    Return From Keyword
    Switch to Window    1
    File Should Exist    ${TESTDATA_FOLDER}\\${file_name}    ${file_name} File not found in TestData folder.
    WhiteLibrary.Input Text To Textbox    ${textbox.window.import.filename}    ${TESTDATA_FOLDER}\\${file_name}
    Comment    WhiteLibrary.Click Button    ${button.window.import.fileopen}
    sleep    1s
    Press Keyboard Key By Pywinauto    ENTER
    Switch to Window    0

Quick Scan Image File
    [Arguments]    ${application}    ${file_name}
    Upload File    Start_Scanning_With_Cur_Settings    ${application}    ${file_name}

Select dropdown Menu In Toolbar
    [Arguments]    ${drop_down_image_name}    ${drop_down_value}
    SikuliLibrary.Click    ${drop_down_image_name}.PNG
    Run Keyword If    '${drop_down_value}'=='Fail'    WhiteLibrary.Click Menu Button    name:${drop_down_value}    10    10
    ...    ELSE    WhiteLibrary.Click Menu Button    name:${drop_down_value}
    Run Keyword If    '${drop_down_value}'=='Fail'    Handle Confirmation Popup    Yes

Quit and Restart Capture Applications
    ${status}    Run Keyword And Return Status    WhiteLibrary.Get Window Title
    Run Keyword If    '${status}'=='False'    Return From Keyword
    @{windows}    Get Application Windows
    ${window_size}    Get Length    ${windows}
    Run Keyword If    ${window_size}>=1    Restart Encapture Wizard Services
    ...    ELSE    CustomLibrary.Close All Application Windows

Start Client Application
    Start Process    C:\\Program Files\\Imagine Solutions Encapture Client\\EncaptureClientLauncher.exe    alias=app

Validate Persist batch in Expert Capture
    [Arguments]    ${batchcontent_description}
    Wait Until Item Exists    ${dropdown.window.expertcapture.contenttype}    ${LONG_WAIT}
    ${bct_description}    Get Text From Combo Box By Id    ${dropdown.window.expertcapture.contenttype}
    ${status}    Run Keyword And Return Status    Should Be Equal As Strings    ${bct_description}    ${batchcontent_description}
    Run Keyword If    ${status}==False    ${bct_description} and ${batchcontent_description} are not equal

Validate dailog box
    [Arguments]    ${window_display_stsus}=True
    Select Batch Operation Type From Tool Bar    Complete_Batch
    ${status}    Run Keyword And Return Status    Window Title Should Be    Encapture    ${MEDIUM_WAIT}
    Run Keyword If    ${status}==True and ${window_display_stsus}==True    Handle Confirmation Popup
    Run Keyword If    ${status}==True and ${window_display_stsus}==True    Switch to Window    0
    Run Keyword If    ${status}==False and ${window_display_stsus}==False    Pass Execution
    Run Keyword If    ${status}==True and ${window_display_stsus}==False    Fail

Populate Batch System Values
    [Arguments]    ${application}    ${batch_content_type}    ${scan_mode}
    Get Existing Application    Encapture ${application}
    Populate Batch Values    ${batch_content_type}    ${scan_mode}

Validate Copy Icon Status in Tool Bar Menu
    [Arguments]    ${application}    ${expected_status}=True
    ${actual_status}    Run Keyword And Return Status    WhiteLibrary.Item Should Be Enabled    name:Copy
    Run Keyword If    ${actual_status}==True and ${expected_status}==True and '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Copy
    Run Keyword If    ${actual_status}==True and ${expected_status}==True and '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Copy
    Run Keyword If    ${actual_status}==False and ${expected_status}==True    Fail    "Copying and Pasting of Batch Items" check box is Enabled But Copy Icon is not Enabled
    Run Keyword If    ${actual_status}==True and ${expected_status}==False    Fail    "Copying and Pasting of Batch Items" check box is Disabled But Copy Icon is Enabled
    Run Keyword If    ${actual_status}==False and ${expected_status}==False    Log    "Copying and Pasting of Batch Items" check box is Disabled
    [Return]    ${actual_status}

Validate Paste Icon status in Tool Bar Menu
    [Arguments]    ${actual_status}    ${application}
    Run Keyword If    ${actual_status}==True and '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Paste
    Run Keyword If    ${actual_status}==True and '${application}'=='Review'    Select Batch Operation Type From Tool Bar in Review    Paste

Validate Copy and Paste Actions on Batch Items
    [Arguments]    ${application}    ${expected_status}=True
    ${status}    Validate Copy Icon status in Tool Bar Menu    ${application}    ${expected_status}
    Run Keyword If    ${status}==True    Validate Paste Icon status in Tool Bar Menu    ${status}    ${application}

Validate Batch should not Complete with unclassified documents
    [Arguments]    ${window_open_status}=True
    Switch to Window    1
    ${status}    Run Keyword And Return Status    WhiteLibrary.Window Title Should Be    Encapture
    Run Keyword If    ${status}==False    Fail    Alert not found after disable "Allow batches to be completed with Unclassified Document" Checkbox
    Click Item    ${button.window.wizard.ok}
    Run Keyword If    ${window_open_status}==True    Switch to Window    0

Validate drag and drop document pages
    [Arguments]    ${application}    ${expected_status}=False
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Prev_Doc_In_Batch
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Next_Page
    Drag And Drop A Document
    Run Keyword If    ${expected_status}==True    Handle Confirmation Popup

Validate Show reorder batch items confirmation dialog
    [Arguments]    ${application}    ${expected_status}=True
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Prev_Doc_In_Batch
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Next_Page
    Drag And Drop A Document
    Run Keyword If    ${expected_status}==True    Handle Confirmation Popup

Validate "Mark Page As Best Available" Functionality
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Mark_Page_As_Best_Available
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Mark_Page_As_Best_Available
    Capture Image    ${application}    mark_page_as_best_available
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\mark_page_as_best_available    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Mark Page As Best Available button is not clicked

Validate "Previous document" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    ${status}    Run Keyword And Return Status    Perform Toolbar menu Icon Operation    Prev_Doc_In_Batch    ${application}
    Run Keyword If    ${status}==False    Fail    Prev_Doc_In_Batch icon is not Clicked

Get text of an item
    [Arguments]    ${document_name}
    ${items}    WhiteLibrary.Get Item    name:${document_name}
    ${document_details}    Convert To String    ${items}
    ${list}    Split String    ${document_details}    ,
    ${document_details}    Set Variable    ${list}[1]
    ${list}    Split String    ${document_details}    :
    ${document}    Set Variable    ${list}[1]
    [Return]    ${document}

Validate "Next document" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Perform Toolbar menu Icon Operation    Prev_Doc_In_Batch    ${application}
    ${status}    Run Keyword And Return Status    Perform Toolbar menu Icon Operation    Next_Doc_In_Batch    ${application}
    Run Keyword If    ${status}==False    Fail    Next Document Icon is not Clicked

Validate "Previous page" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Comment    Expand the Uploded Document using Next Button
    Perform Toolbar menu Icon Operation    Next_Page    ${application}
    comment    Go to second page in electronic document
    Perform Toolbar menu Icon Operation    Next_Page    ${application}
    ${status}    Run Keyword And Return Status    Perform Toolbar menu Icon Operation    Previous_Page    ${application}
    Run Keyword If    ${status}==False    Fail    Previous_Page icon is not clicked

Validate "Next page" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    ${status}    Run Keyword And Return Status    Perform Toolbar menu Icon Operation    Next_Page    ${application}
    Run Keyword If    ${status}==False    Fail    Next_Page is not clicked

Navigate to Next Page of document
    Select Batch Operation Type From Tool Bar    Next_Page

Validate "Rotate Pages 180 degrees" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Rotate_Page_180_Degrees
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Rotate_Page_180_Degrees
    Capture Image    ${application}    Rotate_page_180_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\Rotate_page_180_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Rotate Page 180 Degrees button is not clicked

Capture uploaded Image
    [Arguments]    ${application}
    Create Directory    Imagecapture
    Empty Directory    Imagecapture
    Capture Image    ${application}    Uploaded_capture_img

Validate "Rotate Page 90 Degree to the Left" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Rotate_Page_90_Degree_To_Left
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Rotate_Page_90_Degree_To_Left
    Capture Image    ${application}    Rotate_page_90_left_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\Rotate_page_90_left_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Rotate Page 90 Degree To Left button is not clicked

Validate "Rotate Page 90 Degree to the Right" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Rotate_Page_90_Degree_To_Right
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Rotate_Page_90_Degree_To_Right
    Capture Image    ${application}    Rotate_page_90_right_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\Rotate_page_90_right_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Rotate Page 90 Degree To Right button is not clicked

Validate "Zoom in" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_In
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_In
    Capture Image    ${application}    zoom_in_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\zoom_in_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Zoom In button is not clicked

Validate "Zoom out" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_Out
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_Out
    Capture Image    ${application}    zoom_out_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\zoom_out_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Zoom out button is not clicked

Validate "Zoom to" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_To_Selection
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_To_Selection
    Capture Image    ${application}    zoom_to_selection_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\zoom_to_selection_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Zoom To Selection button is not clicked

Validate "Change Zoom Level" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Capture uploaded Image    ${application}
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_Level
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_Level
    Click Item    name:50%
    Capture Image    ${application}    zoom_level_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\zoom_level_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Change Zoom Level button is not clicked

Validate "Zoom to selection" Icon status in Tool Bar Menu
    [Arguments]    ${application}=Expert Capture
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Zoom_To_Selection
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Zoom_To_Selection
    Capture Image    ${application}    zoom_to_selection_img
    ${staus}    Run Keyword And Return Status    Compare Capture Images    ${EXECDIR}\\Imagecapture\\zoom_to_selection_img    ${EXECDIR}\\Imagecapture\\Uploaded_capture_img
    Run Keyword If    ${staus}==False    Fail    Zoom To Selection button is not clicked

Validate Window is displayed
    [Arguments]    ${handle_type}=Yes    ${window_open_status}=True
    ${status}    Run Keyword And Return Status    WhiteLibrary.Wait Until Item Exists    name:${handle_type}    ${SHORT_WAIT}
    Run Keyword If    ${status}==True and ${window_open_status}==True    Handle Confirmation Popup
    Run Keyword If    ${status}==True and ${window_open_status}==True    Switch to Window    0
    Run Keyword If    ${status}==True and ${window_open_status}==False    Fail    Window is displayed even checkbox is disabled
    Run Keyword If    ${status}==False and ${window_open_status}==False    Pass Execution    Show complete batch confirmation dialog box checkbox is disabled so dialog should not display

Expert Capture Flow by Uploading Image File
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Complete the Batch Process
    Validate Batch Should be Completed
    Close All Application Windows

Expert Capture flow by Uploading Electronic document
    [Arguments]    ${fill_batch_index_values}=True    ${upload_document}=True
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Run Keyword If    '${fill_batch_index_values}'=='True'    Fill Batch Content Index data    ${capture_wizard_content_info}
    Run Keyword If    '${upload_document}'=='True'    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Complete the Batch Process
    Validate Batch Should be Completed
    Close All Application Windows

Expert Capture Flow with non-visible missing required batch custom fields
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Validate non-visible missing required custom fields    BatchNo
    Complete the Batch Process
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Validate Batch Should be Completed
    Close All Application Windows

Expert Capture Flow with non-visible missing required document custom fields
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Validate non-visible missing required custom fields    BatchID
    Complete the Batch Process
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Validate Batch Should be Completed
    Close All Application Windows

Expert Capture Flow with non-visible missing required batch and document custom fields
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Validate non-visible missing required custom fields    BatchNo
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Validate non-visible missing required custom fields    BatchID
    Complete the Batch Process
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Validate Batch Should be Completed
    Close All Application Windows

Validate delete batch item confirmation dialog for Scanned Image Files
    [Arguments]    ${expected_status}=True    ${application}=Expert Capture
    Scan Image files    ${application}
    ${status}    Run Keyword And Return Status    Delete batch items    ${application}
    Run Keyword If    ${status}==False    Fail    "Batch items are not Deleted"
    Run Keyword If    ${expected_status}==True    Handle Confirmation Popup

Scan Image files
    [Arguments]    ${application}=Expert Capture
    Run Keyword If    '${application}'=='Expert Capture'    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    ...    ELSE    Quick Scan Image File    ${APPLICATION_REVIEW}    ${Index_wizard_content_info}[FileName]
    Run Keyword If    '${application}'=='Review'    Handle Insert or Append Pages Popup    Insert pages
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Rotate_Page_90_Degree_To_Left
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Rotate_Page_90_Degree_To_Left
    Run Keyword If    '${application}'=='Expert Capture'    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    ...    ELSE    Quick Scan Image File    ${APPLICATION_REVIEW}    ${Index_wizard_content_info}[FileName]
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Rotate_Page_180_Degrees
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Rotate_Page_180_Degrees
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Previous_Page
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Previous_Page

Validate Batch Deleted Successful dialog is visible
    [Arguments]    ${window_displayed}=True    ${application}=Expert Capture
    Run Keyword If    '${application}'=='Expert Capture'    Delete the Batch Process
    ...    ELSE    Delete the Batch Process in Review
    Run Keyword If    ${window_displayed}==True    Validate Successful message dailog is visible
    Run Keyword If    '${application}'=='Expert Capture'    Verify Expert Capture Home Page
    ...    ELSE    Verify Review Home Page

Perform Toolbar menu Icon Operation
    [Arguments]    ${action_item}    ${application}=Expert Capture
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    ${action_item}
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    ${action_item}

Validate Complete batch confirmation dialog is visible
    [Arguments]    ${application}=Expert Capture    ${window_displayed}=True
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Complete_Batch
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Complete_Batch
    Validate Window is displayed    window_open_status=${window_displayed}
    Run Keyword If    '${application}'=='Expert Capture'    Verify Expert Capture Home Page
    ...    ELSE    Verify Review Home Page

Validate Delete batch confirmation dialog is visible
    [Arguments]    ${application}=Expert Capture    ${window_displayed}=True
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Delete_Batch
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Delete_Batch
    Validate Window is displayed    window_open_status=${window_displayed}
    Run Keyword If    '${application}'=='Expert Capture'    Verify Expert Capture Home Page
    ...    ELSE    Verify Review Home Page

Validate show batch Completed successfully dialog is visible
    [Arguments]    ${application}=Expert Capture    ${window_displayed}=True
    Run Keyword If    '${application}'=='Expert Capture'    Select Batch Operation Type From Tool Bar    Complete_Batch
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Complete_Batch
    Handle Confirmation Popup
    Switch to Window    0
    Run Keyword If    ${window_displayed}==True    Validate Successful message dailog is visible
    Run Keyword If    '${application}'=='Expert Capture'    Verify Expert Capture Home Page
    ...    ELSE    Verify Review Home Page

Validate show Batch Suspended successfully dialog is visible
    [Arguments]    ${application}=Expert Capture    ${window_displayed}=True
    Run Keyword If    '${application}'=='Expert Capture'    Suspend the Batch Process
    ...    ELSE    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Run Keyword If    ${window_displayed}==True    Validate Successful message dailog is visible
    Run Keyword If    '${application}'=='Expert Capture'    Verify Expert Capture Home Page
    ...    ELSE    Verify Review Home Page

Validate Next error and complete the batch
    [Arguments]    ${application}=Expert Capture
    Perform Toolbar menu Icon Operation    Next_Error    ${application}
    Handle Next error popup
    Complete the Next error batch
    Run Keyword If    '${application}'=='Expert Capture'    Validate Successful message dailog is visible

Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule
    [Arguments]    ${application}    ${index_field_type}    ${custom_field_name}    ${expected_value}=${EMPTY}    ${handle_status}=True
    Wait Until Item Exists    treeView    ${LONG_WAIT}
    Click Item    treeView
    Run Keyword If    '${handle_status}'=='True'    Handle Confirmation Popup    OK
    ${customfield_text}    Get Text from Custom Fields    ${application}    ${index_field_type}    ${custom_field_name}
    Run Keyword If    '${customfield_text}'!='${expected_value}'    Fail    "${custom_field_name}" value should accept value as configured in Data sources and Dependent Fields only

Validate Data Source combo box
    [Arguments]    ${custom_filed_type}    ${validation_value}    ${application}=${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Wait Until Item Exists    treeView    ${LONG_WAIT}
    Click Item    treeView
    Get Existing Application    ${application}
    select_data_source_combobox_value    ${custom_filed_type}    ${validation_value}
