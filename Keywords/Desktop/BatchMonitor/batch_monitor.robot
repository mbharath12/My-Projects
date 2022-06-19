*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Select Batch Operation Type From Tool Bar in Batch Monitor
    [Arguments]    ${tool_bar_menu_option}    ${select_menu}=None
    Run Keyword If    '${tool_bar_menu_option}'=='Document_List'    WhiteLibrary.Click Button    name:documentListButton
    Run Keyword If    '${tool_bar_menu_option}'=='Document_List'    Return From Keyword
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${BATCH_MONITOR_TOOL_BAR_MENU}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Batch Option ${tool_bar_menu_option} not found in the options list ${BATCH_MONITOR_TOOL_BAR_MENU.keys()}
    ${menu_index}    Set Variable    ${BATCH_MONITOR_TOOL_BAR_MENU}[${tool_bar_menu_option}]
    Run Keyword If    '${tool_bar_menu_option}'=='Change_Priority' or '${tool_bar_menu_option}'=='Change_Status'    Select dropdown Menu In Toolbar    ${menu_index}    ${select_menu}
    Run Keyword If    '${tool_bar_menu_option}'=='Change_Priority' or '${tool_bar_menu_option}'=='Change_Status'    Return From Keyword
    WhiteLibrary.Click Toolstrip Button By Index    mainToolStrip    ${menu_index}

Validate Batch is opened in Expert Index
    [Arguments]    ${batch_id}
    Switch to Window    1
    WhiteLibrary.Close Window
    Switch to Window    0
    Verify Application Window is Displayed    ${APPLICATION_ENCAPTURE_REVIEW}
    Validate Combobox Value    ${dropdown.window.expertcapture.contenttype}    ${batch_id}    ${APPLICATION_ENCAPTURE_REVIEW}

Select Batch from Suspended batch list in Batch Monitor
    [Arguments]    ${batch_content_type}
    Select Listview Row    suspendedBatchListView    Content Type    ${batch_content_type}

Select Batch from Recent Batch list in Batch Monitor
    [Arguments]    ${batch_content_type}
    Select Listview Row    recentBatchListView    Content Type    ${batch_content_type}

Get Recent Batch Details From Batch Monitor Table
    [Arguments]    ${batch_content_type}
    Select Listview Row    recentBatchListView    Content Type    ${batch_content_type}
    @{details}    Get Listview Row Text    recentBatchListView    Content Type    ${batch_content_type}
    &{batch_table_values}    Create Dictionary
    ${batchlength}    Get Length    ${details}
    Set To Dictionary    ${batch_table_values}    Locator    @{details}[0]    Content Type    @{details}[1]    Status    @{details}[2]    Owner    @{details}[5]    Pages    @{details}[${batchlength-3}]    Documents    @{details}[${batchlength-2}]    Priority    @{details}[${batchlength-1}]
    [Return]    ${batch_table_values}

Validate recent batch status in Batch Monitor
    [Arguments]    ${batch_content_type}    ${expected_status}
    ${batch_details}    Get Recent Batch Details From Batch Monitor Table    ${batch_content_type}
    Should Contain    ${batch_details}[Status]    ${expected_status}

Reset Batch Step in Batch Monitor
    [Arguments]    ${new_step}
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    newStepComboBox    ${MEDIUM_WAIT}
    Reset batch status in Batch Monitor    ${new_step}
    WhiteLibrary.Click Item    oKButton
    Switch to Window    0

Validate batch priority in Batch Monitor
    [Arguments]    ${batch_content_type}    ${expected_status}
    ${batch_details}    Get Recent Batch Details From Batch Monitor Table    ${batch_content_type}
    Should Contain    ${batch_details}[Priority]    ${expected_status}

Get Suspended Batch Details From Batch Monitor Table
    [Arguments]    ${batch_content_type}
    Select Listview Row    suspendedBatchListView    Content Type    ${batch_content_type}
    @{details}    Get Listview Row Text    suspendedBatchListView    Content Type    ${batch_content_type}
    &{batch_table_values}    Create Dictionary
    Set To Dictionary    ${batch_table_values}    Locator    @{details}[0]    Content Type    @{details}[1]    Status    @{details}[2]    Owner    @{details}[5]
    [Return]    ${batch_table_values}

Validate suspended batch status in Batch Monitor
    [Arguments]    ${batch_content_type}    ${expected_status}
    ${batch_details}    Get Suspended Batch Details From Batch Monitor Table    ${batch_content_type}
    Should Contain    ${batch_details}[Status]    ${expected_status}

Get document details from Documents window
    [Arguments]    ${document_class}
    Select Listview Row    documentListView    Document Class    ${document_class}
    @{details}    Get Listview Row Text    documentListView    Document Class    ${document_class}
    &{document_class_values}    Create Dictionary
    Set To Dictionary    ${document_class_values}    Document Class    @{details}[1]    Pages    @{details}[2]
    [Return]    ${document_class_values}

Validate document details in Document Window
    [Arguments]    ${doc_class_data}
    Switch to Window    1
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        ${document_class_values}    Get document details from Documents window    ${each_doc_class}[DocumentClass]
        Should Contain    ${document_class_values}[Pages]    ${each_doc_class}[Pages]
    END
    Click Item    closeButton
    Switch to Window    0

Search batch details in Batch List View
    [Arguments]    ${combo_box_name}    ${combo_box_value}    ${text_box_name}    ${text_box_values}
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${SEARCH _ACTIVITY_SELECT_COMBO_BOX}    ${combo_box_name}
    Run Keyword If    ${status} != True    Fail    ${combo_box_name} is not found in the options list ${SEARCH_ACTIVITY_SELECT_COMBO_BOX.keys()}
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${SEARCH_ACTIVITY_EDIT_TEXT_BOX}    ${text_box_name}
    Run Keyword If    ${status} != True    Fail    ${text_box_name} is not found in the options list ${SEARCH_ACTIVITY_EDIT_TEXT_BOX.keys()}
    WhiteLibrary.Wait Until Item Exists    contentLabel    ${MEDIUM_WAIT}
    Select Batch Operation Type From Tool Bar in Batch Monitor    Rest_Search_Criteria
    Select Value From Combobox In Search View    ${SEARCH_ACTIVITY_SELECT_COMBO_BOX}[${combo_box_name}]    ${combo_box_value}
    Enter Text In Search View    ${SEARCH_ACTIVITY_EDIT_TEXT_BOX}[${text_box_name}]    ${text_box_values}
    Select Batch Operation Type From Tool Bar in Batch Monitor    Search_Button

Get batch details from Batch List Search View
    [Arguments]    ${batch_content_type}
    Select Listview Row    batchListView    Content Type    ${batch_content_type}
    @{details}    Get Listview Row Text    batchListView    Content Type    ${batch_content_type}
    &{batch_list_table_values}    Create Dictionary
    Set To Dictionary    ${batch_list_table_values}    Locator    @{details}[0]    Content Type    @{details}[1]    Status    @{details}[2]
    [Return]    ${batch_list_table_values}

Validate batch details in Batch List View
    [Arguments]    ${batch_content_type}    ${expected_status}
    ${batch_details}    Get batch details from Batch List Search View    ${batch_content_type}
    Should Contain    ${batch_details}[Status]    ${expected_status}

Validate Event History of a batch
    [Arguments]    ${expected_events}
    Switch to Window    1
    ${events_length}    Get Length    ${expected_events}
    FOR    ${event_list_row}    IN RANGE    ${events_length}
        ${event_history_row}    Get Listview Row Text By Index    eventListView    ${event_list_row}
        ${step_and_event}    Split String    ${expected_events}[${event_list_row}]    |
        Should Be Equal    ${event_history_row}[0]    ${step_and_event}[0]
        Should Be Equal    ${event_history_row}[1]    ${step_and_event}[1]
    END
    Click Item    name:Close
    Switch to Window    0

Reset batch status in Batch Monitor
    [Arguments]    ${new_step}
    Get Existing Application    Reset Batch Step
    Select Dropdown Values    newStepComboBox    ${new_step}

Validate recent batch documents count
    [Arguments]    ${batch_content_type}    ${expected_doc_count}
    ${batch_details}    Get Recent Batch Details From Batch Monitor Table    ${batch_content_type}
    Should Contain    ${batch_details}[Documents]    ${expected_doc_count}
