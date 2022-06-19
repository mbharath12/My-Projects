*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Select Content Type
    [Arguments]    ${content_type}
    sleep    2s
    Wait Until Item Exists    ${label.window.wizard.typeofcontent}    ${LONG_WAIT}
    ${status}    Run Keyword And Return Status    Click Item    name:${content_type}
    Return From Keyword If    ${status}==False    False
    Click Item    ${button.window.wizard.next}
    Return From Keyword    True

Scan or Browse the File System for Content
    [Arguments]    ${file_name}
    Wait Until Item Exists    ${label.window.wizard.browsefile}    ${LONG_WAIT}
    Click Item    ${label.window.wizard.browsefile}
    WhiteLibrary.Input Text To Textbox    ${textbox.window.wizard.filesystem.filename}    ${TESTDATA_FOLDER}\\${file_name}
    WhiteLibrary.Click Button    ${button.window.wizard.filesystem.open}
    ${status}    Run Keyword And Return Status    Verify Label    name:${file_name}    ${file_name}
    Run Keyword If    ${status}==False    Return From Keyword
    Click Item    ${button.window.wizard.next}
    [Return]    ${status}

Fill the Index Data
    [Arguments]    ${batch_content_info}
    @{index_fields_keys}    Get Matches    ${batch_content_info}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${batch_content_info}[${key}]
        @{field_name_and_value}    Split String    ${field_details}    |
        ${index_count}    Get Length    ${field_name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        Input Text To Textbox    @{field_name_and_value}[0]_TextBox    @{field_name_and_value}[1]
        Sleep    300ms
    END
    Click Item    ${button.window.wizard.next}

Select To Add Another Document
    [Arguments]    ${skip_add_doc}=Skip
    Wait Until Item Exists    ${label.window.wizard.addanotherdocument}    ${SHORT_WAIT}
    Run Keyword If    '${skip_add_doc}'=='Skip'    Click Item    ${button.window.wizard.next}

Close Encapture on Submission
    [Arguments]    ${operation_type}
    Wait Until Item Exists    ${label.window.wizard.contentsubmissiom}    ${LONG_WAIT}
    Run Keyword If    '${operation_type}'=='Yes'    WhiteLibrary.Toggle Check Box    ${radiobutton.window.wizard.closeoncomplete}

Handle the Pages of this Multipage Document
    [Arguments]    ${handle_type}=One
    Wait Until Item Exists    ${label.window.wizard.multipagecontent}    ${LONG_WAIT}
    Run Keyword If    '${handle_type}'=='One'    Click Item    ${button.window.wizard.next}
    Run Keyword If    '${handle_type}'=='One'    Return From Keyword
    WhiteLibrary.Select Radio Button    name:Assemble the pages into multiple documents
    Click Item    ${button.window.wizard.next}
    Assemble Pages to Multiple Document

Select the Class Type of the Document
    [Arguments]    ${doc_class}
    ${pageStatus}    Run Keyword And Return Status    Wait Until Item Exists    ${label.window.wizard.documentclassification}    ${SHORT_WAIT}
    Run Keyword If    ${pageStatus}==False    Return From Keyword
    WhiteLibrary.Select Radio Button    name:${doc_class}
    Click Item    ${button.window.wizard.next}

Assemble Pages to Multiple Document
    Wait Until Item Exists    name:Include Selected Pages    30s
    ${window_title}    Get Window Title
    Arrange Pages To Multipage Documents    ${window_title}
    WhiteLibrary.Click Button    name:Include Selected Pages
    Click Item    btnNext
    Sleep    3s
    Arrange All Pages To Multipage Documents    ${window_title}
    WhiteLibrary.Item Should Be Enabled    name:Include Selected Pages
    WhiteLibrary.Click Button    name:Include Selected Pages
    Click Item    btnNext

Select Content Type and Upload the Content
    [Arguments]    ${classification_type}    ${content_source}
    ${content_status}    Select Content Type    ${classification_type}
    Run Keyword If    ${content_status}==False    Fail    ${classification_type} batch not found
    ${content_status}    Scan or Browse the File System for Content    ${content_source}
    Run Keyword If    ${content_status}==False    Fail    Unable to upload file. Please verify fila path
    [Return]    ${content_status}

Classify the Captured Multipage Document
    [Arguments]    ${doc_classes_info}
    ${document_classes_count}    Get Length    ${doc_classes_info}
    Run Keyword If    ${document_classes_count}==0    Log    No document classes were selected for this BCT
    Run Keyword If    ${document_classes_count}==0    Return From Keyword
    Run Keyword If    ${document_classes_count}==1    Handle the Pages of this Multipage Document
    ...    ELSE    Handle the Pages of this Multipage Document    Many
    FOR    ${key}    IN    @{doc_classes_info.keys()}
        ${each_document_class_details}    Set Variable    ${doc_classes_info}[${key}]
        Select the Class Type of the Document    ${each_document_class_details}[DocumentClass]
        Fill Common Index Data of Document Class    ${each_document_class_details}
    END

Proceed for Submission
    Run Keyword And Ignore Error    Select To Add Another Document    Skip
    Close Encapture on Submission    Yes
    Click Item    ${button.window.wizard.next}

Validate Captured Content is Submitted
    ${upload_status}    Run Keyword And Return Status    Wait Until Item Exists    ${label.window.wizard.submitupload.complete}    ${LONG_WAIT}
    Run Keyword If    ${upload_status}==False    Fail    File submission failed. Complete window not displayed
    Click Item    ${button.window.wizard.submittoupload.cancel}
    ${app_status}    Run Keyword And Return Status    Get Window Title
    Run Keyword If    ${app_status}==True    Fail    Application did not got closed after file submission.

Fill Common Index Data of Document Class
    [Arguments]    ${common_index_data}
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    Wait Until Item Exists    name:Document Index Data    ${MEDIUM_WAIT}
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${common_index_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${index_count}    Get Length    ${name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        Input Text To Textbox    @{name_and_value}[0]_TextBox    @{name_and_value}[1]
    END
    Click Item    ${button.window.wizard.next}
