*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Select Batch Operation Type From Tool Bar in Review
    [Arguments]    ${tool_bar_menu_option}    ${window_status}=True
    Run Keyword If    '${tool_bar_menu_option}'=='Get_Next_Available_Batch'    Click Item    name:Get the next available batch
    Run Keyword If    '${tool_bar_menu_option}'=='Get_Next_Available_Batch'    Return From Keyword
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${EXPERT_INDEX_BATCH_TOOL_BAR_MENU}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Batch Option ${tool_bar_menu_option} not found in the options list ${EXPERT_INDEX_BATCH_TOOL_BAR_MENU.keys()}
    ${menu_index}    Set Variable    ${EXPERT_INDEX_BATCH_TOOL_BAR_MENU}[${tool_bar_menu_option}]
    Run Keyword If    '${menu_index}'=='NA'    Fail    ${tool_bar_menu_option} has no indexed field define. Please define an Index in application variables.
    sleep    3s
    WhiteLibrary.Click Toolstrip Button By Index    mainToolStrip    ${menu_index}
    Run Keyword If    '${tool_bar_menu_option}'=='Start_Scanning_With_Cur_Settings'    Return From Keyword
    Run Keyword If    '${tool_bar_menu_option}'=='Mark_Document_Rescan'    Return From Keyword
    Run Keyword If    '${tool_bar_menu_option}'=='Reject_Document'    Return From Keyword
    Run Keyword If    '${tool_bar_menu_option}'=='Import_Electronic_File' or '${tool_bar_menu_option}'=='Create_Empty_Document' or '${tool_bar_menu_option}'=='Paste'    Handle Confirmation Popup    window_open_status=${window_status}
    Run Keyword If    '${tool_bar_menu_option}'=='Suspend_Batch'    Handle Confirmation Popup    OK    ${window_status}

Open Existing Batch Window in Review
    [Arguments]    ${batch_id}
    Select Batch Operation Type From Tool Bar in Review    Open_Index_Existing_Batch
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:${batch_id}    ${MEDIUM_WAIT}
    Run Keyword If    ${status}==False    Fail    ${batch_id} is not Found in Load window
    WhiteLibrary.Double Click Item    name:${batch_id}
    Verify Application Window is Displayed    ${APPLICATION_ENCAPTURE_REVIEW}

Get the Next Available Batch
    [Arguments]    ${batch_code}    ${verify_window}=True    ${checkbox_status}=False
    Select Batch Operation Type From Tool Bar in Review    Get_Next_Available_Batch
    Switch to Window    1
    Run Keyword If    ${checkbox_status}==False    Click Item    automaticallyGetNextBatchCheckBox
    Select batch content type in Review    ${batch_code}
    Click Item    name:OK
    Switch to Window    0
    Run Keyword If    ${verify_window}    Verify Application Window is Displayed    ${APPLICATION_ENCAPTURE_REVIEW}

Validate when there are no Batches for Content Type in Review
    ${bstatus}    Run Keyword And Return Status    Get the Next Available Batch    ${batchcontent}[Description]    False
    Run Keyword If    ${bstatus}==False    Log    The batch "${batchcontent}[Description]" is not available with Index Step

Validate error message when there are no Batches for Content Type in Review
    Switch to Window    1
    ${errormessage}    WhiteLibrary.Get Text From Textbox    name:RichEdit Control
    Should Be Equal    ${errormessage.strip()}    There are no batches available in the Index queue.
    Click Item    name:OK
    Switch to Window    0

Reject the Document in Review
    [Arguments]    ${document_name}    ${reject_reason}
    Select Batch Operation Type From Tool Bar in Review    Reject_Document
    Switch to Window    1
    Select Document Rejection Note    ${reject_reason}
    Click Item    ${button.window.wizard.ok}
    Switch to Window    0

Mark the Document for rescan in Review
    [Arguments]    ${document_name}    ${rescan_reason}
    Get Existing Application    ${APPLICATION_ENCAPTURE_REVIEW}
    Click Document Treeview
    Press Keyboard Key By Pywinauto    VK_UP
    Press Keyboard Key By Pywinauto    VK_UP
    Press Keyboard Key By Pywinauto    VK_UP
    Comment    Select Document in the Tree View    ${document_name}
    Select Batch Operation Type From Tool Bar in Review    Mark_Document_Rescan
    Switch to Window    1
    Select Document Replacement Note    ${rescan_reason}
    Click Item    ${button.window.wizard.ok}
    Switch to Window    0

Validate Suspended Rescan batch should be available in existing batches
    [Arguments]    ${batch_id}
    Select Batch Operation Type From Tool Bar in Review    Open_Index_Existing_Batch
    Switch to Window    1
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:${batch_id}    ${MEDIUM_WAIT}
    Run Keyword If    ${status}==False    Fail    ${batch_id} is not Found in Load window
    Click Item    cancelButton
    Switch to Window    0

Validate Custom fields should be hidden for a Batch Content
    [Arguments]    ${admin_custom_fields_data}
    @{index_fields_keys}    Get Matches    ${admin_custom_fields_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${admin_custom_fields_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${custom_field_name}    Set Variable    ${name_and_value}[0]
        ${index_step_settings}    Set Variable    ${name_and_value}[2]
        ${index_step_settings_status}    String.Split String    ${index_step_settings}    :
        ${index_step_display_status}    Set Variable    ${index_step_settings_status}[1]
        Run Keyword If    '${index_step_display_status}' != 'Hidden'    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:${custom_field_name}:    500ms
        Run Keyword If    ${status}==True    Fail    ${custom_field_name} Batch Index data is Visible
    END

Validate Custom fields should be hidden for a Document class
    [Arguments]    ${document_index_values}
    @{index_fields_keys}    Get Matches    ${document_index_values}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    Press Keyboard Key By Pywinauto    VK_UP
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${document_index_values}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${custom_field_name}    Set Variable    ${name_and_value}[0]
        ${index_step_settings}    Set Variable    ${name_and_value}[2]
        ${index_step_settings_status}    String.Split String    ${index_step_settings}    :
        ${index_step_display_status}    Set Variable    ${index_step_settings_status}[1]
        Run Keyword If    '${index_step_display_status}' != 'Hidden'    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Item Exists    name:${custom_field_name}:    500ms
        Run Keyword If    ${status}==True    Fail    ${custom_field_name}[0] Document Index Data is Visible
    END

Select batch content type in Review
    [Arguments]    ${batch_code}
    Get Existing Application    Get Next Batch
    Select Dropdown Values    batchContentTypeComboBox    ${batch_code} - ${APPLICATION_REVIEW}

Select Document Rejection Note
    [Arguments]    ${reject_reason}
    Get Existing Application    Document Rejection Note
    sleep    2s
    Select Dropdown Values    cbReasonCode    ${reject_reason}

Select Document Replacement Note
    [Arguments]    ${rescan_reason}
    Get Existing Application    Document Replacement Note
    sleep    2s
    Select Dropdown Values    cbReasonCode    ${rescan_reason}

Complete the Batch Process in Review
    [Arguments]    ${hidden_status}=False
    Run Keyword If    ${hidden_status}==True    Select Batch Operation Type From Tool Bar in Review For Hidden Icons    Complete_Batch
    Run Keyword If    ${hidden_status}==False    Select Batch Operation Type From Tool Bar in Review    Complete_Batch
    Handle Confirmation Popup
    Switch to Window    0

Select Batch Operation Type From Tool Bar in Review For Hidden Icons
    [Arguments]    ${tool_bar_menu_option}    ${is_index_based}=True
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Batch Option ${tool_bar_menu_option} not found in the options list &{EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS.keys()}
    ${menu_index}    Set Variable    &{EXPERT_INDEX_BATCH_TOOL_BAR_MENU_FOR_HIDDEN_ICONS}[${tool_bar_menu_option}]
    Run Keyword If    '${menu_index}'=='NA'    Fail    ${tool_bar_menu_option} has no indexed field define. Please define an Index in application variables.
    Run Keyword If    ${is_index_based}==True    WhiteLibrary.Click Toolstrip Button By Index    mainToolStrip    ${menu_index}
    ...    ELSE    Click Item    ${tool_bar_menu_option}
    [Teardown]

Delete the Batch Process in Review
    [Arguments]    ${hidden_status}=False
    Run Keyword If    ${hidden_status}==True    Select Batch Operation Type From Tool Bar in Review For Hidden Icons    Delete_Batch
    Run Keyword If    ${hidden_status}==False    Select Batch Operation Type From Tool Bar in Review    Delete_Batch
    Handle Confirmation Popup
    Switch to Window    0

Verify Review Home Page
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    ${label.window.expertcapture.tobegin}    ${LONG_WAIT}
    Run Keyword If    ${status}==False    Fail    To begin, click a button above or choose an option below label is not visible after waiting 20s

Validate Batch Should be Completed in Review
    Verify Review Home Page

Validate Batch Should be Suspended in Review
    Verify Review Home Page

Validate Batch Should be Deleted in Review
    Verify Review Home Page

Release the Batch Process in Review
    [Arguments]    ${hidden_status}=False
    Select Batch Operation Type From Tool Bar in Review    Release_Batch
    Handle Confirmation Popup
    Switch to Window    0

Validate Release Batch Confirmation Dialog is Visible
    [Arguments]    ${window_displayed}=True
    Select Batch Operation Type From Tool Bar in Review    Release_Batch
    Validate Window is displayed    window_open_status=${window_displayed}
    Verify Review Home Page

Validate Show Batch Released Successfully Dialog is Visible
    [Arguments]    ${window_displayed}=True
    Select Batch Operation Type From Tool Bar in Review    Release_Batch
    Handle Confirmation Popup
    Switch to Window    0
    Run Keyword If    ${window_displayed}==True    Validate Successful message dailog is visible

Validate Revert batch
    Select Batch Operation Type From Tool Bar in Review    Revert_Batch
    Handle Confirmation Popup

Validate Can't Undo operation
    ${status}    Run Keyword And Return Status    Select Batch Operation Type From Tool Bar in Review    Undo
    Run Keyword If    ${status}==True    Fail    Can't Undo feature should not be in enable mode.
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    ${status}    Run Keyword And Return Status    Select Batch Operation Type From Tool Bar in Review    Undo
    Run Keyword If    ${status}==False    Fail    Can't Undo feature should not be in Disable mode after uploading document.

Validate low confidence
    ${status}    Run Keyword And Return Status    Select Batch Operation Type From Tool Bar in Review    Confirm_Low_Confidence
    Run Keyword If    ${status}==False    Return From Keyword
    Run Keyword If    ${status}==True    Fail
