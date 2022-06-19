*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Select Batch Content Type and Fill Index Values in Collect
    [Arguments]    ${common_index_data}    ${batch}    ${datasource_value}=NA
    ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    ${label.collect.selectcontenttype}    ${SHORT_WAIT}
    Run Keyword If    '${status}'=='True'    Click Element    //div[text()='${batch}']
    Wait Until Element Is Visible    ${label.collect.contentdetails}    ${MEDIUM_WAIT}    Collect application is not Opened or Batch is not selected
    Page Should Contain Element    //div[text()='${batch}']    Selected batch is not visiblle
    Fill the Batch Index Values in Collect Application    ${common_index_data}
    Run Keyword If    '${datasource_value}'!='NA'    Select Custom Field Values in Collect Application    ${datasource_value}
    Wait Until Element Is Enabled    ${button.collect.continue}    ${MEDIUM_WAIT}    Continue button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.continue}

Fill the Batch Index Values in Collect Application
    [Arguments]    ${common_index_data}
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${common_index_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${index_count}    Get Length    ${name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    @{name_and_value}[0]    ${SHORT_WAIT}
        Run Keyword If    ${status}==False    Fail    @{name_and_value}[0] Batch Index Value is Not Visible
        SeleniumLibrary.Input Text    @{name_and_value}[0]    @{name_and_value}[1]
    END

Navigate to Upload Files page in Collect Application
    Wait Until Element Is Visible    ${label.collect.uploadfiles}    ${MEDIUM_WAIT}    Upload files page is not visible after waiting ${MEDIUM_WAIT}
    Element Should Be Disabled    ${button.collect.reviewandsubmit}
    Wait Until Element Is Visible    ${button.collect.uploadfiles.myscanner}    ${MEDIUM_WAIT}    My scanner is not visible after waiting ${MEDIUM_WAIT}

Upload Electronic Document File in Collect Application
    [Arguments]    ${doc_class_data}    ${file_names}    ${fill_doc_class}=True    ${datasource_value}=NA
    Navigate to Upload Files page in Collect Application
    @{filenames}    Split String    ${file_names}    |
    ${count}    Set Variable    ${0}
    ${filescount}    Get Length    ${filenames}
    ${click_status}    Set Variable If    '${filescount}'=='1'    False    True
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        Wait Until Page Contains Element    ${button.collect.browsefiles.upload}    ${LONG_WAIT}
        Choose File    ${button.collect.browsefiles.upload}    ${TESTDATA_FOLDER}\\${filenames}[${count}]
        Wait Until Element Is Not Visible    ${label.collect.sending}    ${LONG_WAIT}    'Sending--' is visble after waiting for ${LONG_WAIT}
        Run Keyword if    '${fill_doc_class}'=='True'    Fill Index Values for a Document Class in Collect Application    ${each_doc_class}
        Run Keyword if    '${datasource_value}'!='NA'    Select Custom Field Values in Collect Application    ${datasource_value}
        Wait Until Element Is Enabled    ${button.collect.saveasdocument}    ${MEDIUM_WAIT}    Save as Document button is not visible after waiting ${MEDIUM_WAIT}
        Click Element    ${button.collect.saveasdocument}
        Wait Until Element Is Visible    ${button.collect.uploadfiles.myscanner}    ${MEDIUM_WAIT}    Upload files page is not visible after waiting ${MEDIUM_WAIT}
        ${count}    Set Variable    ${count+1}
    END

Fill Index Values for a Document Class in Collect Application
    [Arguments]    ${common_index_data}    ${ifclickstatus}=True
    Run Keyword If    '${ifclickstatus}'=='True'    Select Document Class in Collect Application    ${common_index_data}[DocumentClass]
    @{index_fields_keys}    Get Matches    ${common_index_data}    IndexField*
    ${field_count}    Get Length    ${index_fields_keys}
    Run Keyword If    ${field_count}==0    Return From Keyword
    FOR    ${key}    IN    @{index_fields_keys}
        ${field_details}    Set Variable    ${common_index_data}[${key}]
        @{name_and_value}    String.Split String    ${field_details}    |
        ${index_count}    Get Length    ${name_and_value}
        Run Keyword If    ${index_count}!=2    Continue For Loop
        ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    @{name_and_value}[0]    ${LONG_WAIT}
        Run Keyword If    ${status}==False    Fail    @{name_and_value}[0] Document Index Value is Not Visible
        SeleniumLibrary.Input Text    @{name_and_value}[0]    @{name_and_value}[1]
    END

Select Document Class in Collect Application
    [Arguments]    ${doc_class}
    Wait Until Element Is Visible    ${dropdown.collect.selectdocument}    ${MEDIUM_WAIT}    Select document dropdown is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${dropdown.collect.selectdocument}
    Wait Until Element Is Clickable    //li[@role='option']//div[normalize-space(text())='${doc_class}']
    Click Element    //li[@role='option']//div[normalize-space(text())='${doc_class}']

Complete the Batch in Collect Application
    Wait Until Element Is Enabled    ${button.collect.reviewandsubmit}    ${LONG_WAIT}    Review & Submit button is in disabled after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.reviewandsubmit}
    Wait Until Element Is Enabled    ${button.collect.submit}
    Click Element    ${button.collect.submit}
    Wait Until Element Is Not Visible    ${label.collect.sending}    ${LONG_WAIT}    'Sending--' is visble after waiting for ${LONG_WAIT}

Validate Review Document Details and Complete The Batch in Collect
    [Arguments]    ${index_field_data}
    Wait Until Element Is Enabled    ${button.collect.reviewandsubmit}    ${LONG_WAIT}    Review & Submit button is in disabled after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.reviewandsubmit}
    Wait Until Element Is Visible    ${label.collect.reviewdocuments}    ${MEDIUM_WAIT}    Review Document Details Page is not visible after waiting ${MEDIUM_WAIT}
    @{index_field_data}    Split String    ${index_field_data}    |
    FOR    ${Index_data}    IN    @{index_field_data}
        Element Should Be Visible    //div[text()='Review Document Details']/following::*[text()='${Index_data}']
    END
    Wait Until Element Is Enabled    ${button.collect.submit}
    Click Element    ${button.collect.submit}

Validate Batch Should be Completed in Collect Application
    Wait Until Element Is Visible    ${label.collect.completesubmission}    ${MEDIUM_WAIT}    Batch is not Completed
    Click Element    ${button.collect.close}

Validate Error messages is displayed in Collect
    [Arguments]    ${expected_text}
    Wait Until Element Is Visible    //*[normalize-space(text())="${expected_text}" or contains(text(),'${expected_text}')]    ${MEDIUM_WAIT}    Expected Error Message - ${expected_text} - is not visible after waiting ${MEDIUM_WAIT}

Close Collect Application
    ${window_title}    Get Window Titles
    ${window_count}    Get Length    ${window_title}
    Run Keyword If    ${window_count}>1    SeleniumLibrary.Close Window
    Switch Window    Encapture

Edit the uploaded electronic document
    Wait Until Element Is Visible    ${button.collect.document.class.editdocumentclass}    ${LONG_WAIT}
    Click Element    ${button.collect.document.class.editdocumentclass}
    Wait Until Element Is Visible    ${label.collect.documentdetails}    ${LONG_WAIT}
    Wait Until Element Is Visible    ${button.collect.documentdetails.edit}    ${MEDIUM_WAIT}
    Click Element    ${button.collect.documentdetails.edit}
    Wait Until Element Is Visible    ${label.collect.editdocument.editfiles}    ${MEDIUM_WAIT}

Validate Zoom In Document
    [Arguments]    ${expected_file_path}
    Wait Until Element Is Visible    ${button.collect.editfiles.zoomin}    ${MEDIUM_WAIT}
    Click Element    ${button.collect.editfiles.zoomin}
    sleep    500ms
    Capture Element Screenshot    ${image.collect.uploaded.image}    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\actual.png
    Compare Capture Images    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\actual    ${expected_file_path}

Validate Zoom out Document
    [Arguments]    ${expected_file_path}
    Wait Until Element Is Visible    ${button.collect.editfiles.zoomout}    ${MEDIUM_WAIT}
    Click Element    ${button.collect.editfiles.zoomout}
    sleep    500ms
    Capture Element Screenshot    ${image.collect.uploaded.image}    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\actual.png
    Compare Capture Images    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\actual    ${expected_file_path}

Validate Upload More Files After Completing the Batch
    Wait Until Element Is Visible    ${label.collect.completesubmission}    ${MEDIUM_WAIT}    Batch is not Completed
    Click Element    ${button.collect.uploadmorefiles}
    Wait Until Element Is Visible    ${label.collect.selectcontenttype}    ${MEDIUM_WAIT}    'Select Content Type' Page is not visible after clicking on 'Upload More Files'

Cancel the batch in Collect Application
    Wait Until Element Is Visible    ${button.collect.cancel}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.cancel}
    Handle Alert    Accept

Validate Batch is Cancelled in Collect Application
    Wait Until Element Is Visible    ${label.collect.selectcontenttype}    ${MEDIUM_WAIT}    Batch is not cancelled

Delete the document in Collect Application
    [Arguments]    ${doc_name}
    Wait Until Element Is Visible    ${button.collect.uploaddocument.editdocument}    ${MEDIUM_WAIT}    Documents edit page is not visible after waiting ${MEDIUM_WAIT}
    Click Element    //div/div[text()='${doc_name}']//parent::div//following-sibling::button[1]
    Wait Until Element Is Visible    ${button.collect.editdocument.deletedocument}    ${MEDIUM_WAIT}    Delete Document button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.editdocument.deletedocument}

Validate Document is Deleted in Collect Application
    [Arguments]    ${doc_name}
    Wait Until Element Is Visible    ${button.collect.uploadfiles.myscanner}    ${MEDIUM_WAIT}    Upload files page is not visible after waiting ${MEDIUM_WAIT}
    Page Should Not Contain Element    //div/div[text()='${doc_name}']//parent::div//following-sibling::button[1]

Delete the Page from Document in Collect Application
    [Arguments]    ${page_number}    ${doc_name}
    Wait Until Element Is Visible    ${button.collect.uploaddocument.editdocument}    ${MEDIUM_WAIT}    Documents edit page is not visible after waiting ${MEDIUM_WAIT}
    Click Element    //div/div[text()='${doc_name}']//parent::div//following-sibling::button[1]
    Wait Until Element Is Visible    ${button.collect.documentdetails.edit}    ${MEDIUM_WAIT}    Edit button is not visible after waiting ${MEDIUM_WAIT}
    Wait Until Element Is Not Visible    ${label.collect.uploadfiles.undefinedpage}    ${SHORT_WAIT}    Page is still loading after waiting ${SHORT_WAIT}
    ${pagecount_beforedelete}    Get Total Page Count of a Document
    Set Test Variable    ${pagecount_beforedelete}
    Click Element    ${button.collect.editdocument.editfile}
    Select Page from the Document in Collect Application    ${page_number}
    Click Element    ${button.collect.editfiles.delete}
    Wait Until Element Is Visible    ${button.collect.editfiles.done}    ${MEDIUM_WAIT}    Done button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.editfiles.done}

Select Page from the Document in Collect Application
    [Arguments]    ${page_number}
    Wait Until Element Is Visible    //div[text()='${page_number}']/..    ${MEDIUM_WAIT}    Page is not visible after waiting ${MEDIUM_WAIT}
    Click Element    //div[text()='${page_number}']/..
    Wait Until Element Is Visible    ${button.collect.editfiles.delete}    ${MEDIUM_WAIT}    Delete is not visible after waiting ${MEDIUM_WAIT}

Validate Page is Deleted from the Document in Collect Application
    Wait Until Element Is Visible    ${label.collect.documentdetails.pagecount}    ${MEDIUM_WAIT}    Edit button is not visible after waiting ${MEDIUM_WAIT}
    Wait Until Element Is Not Visible    ${label.collect.uploadfiles.undefinedpage}    ${SHORT_WAIT}    Page is still loading after waiting ${SHORT_WAIT}
    ${pages_afterdelete}    Get Total Page Count of a Document
    ${pages_beforedelete}    Evaluate    ${pagecount_beforedelete}-1
    Should Be Equal    ${pages_beforedelete}    ${pages_afterdelete}

Get Total Page Count of a Document
    ${pagecount}    SeleniumLibrary.Get Text    ${label.collect.documentdetails.pagecount}
    ${document_pages_count}    Split String    ${pagecount}
    ${final_page_count}    Convert To Integer    ${document_pages_count[3]}
    [Return]    ${final_page_count}

Edit Batch Fields in Collect
    [Arguments]    ${batch_field}    ${batch_field_value}
    Wait Until Element Is Visible    //h6[contains(text(),'BCT')]//following::button[1]    ${LONG_WAIT}    Batch Field Edit button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    //h6[contains(text(),'BCT')]//following::button[1]
    Wait Until Element Is Visible    //input[@id='${batch_field}']    ${MEDIUM_WAIT}    ${batch_field} is not visible after waiting ${MEDIUM_WAIT}
    SeleniumLibrary.Input Text    //input[@id='${batch_field}']    ${batch_field_value}
    Wait Until Element Is Enabled    ${button.collect.continue}    ${MEDIUM_WAIT}    Continue button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.continue}
    Wait Until Element Is Visible    ${button.collect.uploadfiles.myscanner}    ${MEDIUM_WAIT}    Upload files page is not visible after waiting ${MEDIUM_WAIT}

Edit Document Fields in Collect
    [Arguments]    ${document_field}    ${document_field_value}
    Wait Until Element Is Visible    //h6[text()='Documents']//following::button[1]    ${LONG_WAIT}    Document Field Edit button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    //h6[text()='Documents']//following::button[1]
    Wait Until Element Is Visible    //input[@id='${document_field}']    ${MEDIUM_WAIT}    Document Field is not visible after waiting ${MEDIUM_WAIT}
    SeleniumLibrary.Input Text    //input[@id='${document_field}']    ${document_field_value}
    Wait Until Element Is Enabled    ${button.collect.saveasdocument}    ${MEDIUM_WAIT}    Save as Document button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.saveasdocument}
    Wait Until Element Is Visible    ${button.collect.uploadfiles.myscanner}    ${MEDIUM_WAIT}    Upload files page is not visible after waiting ${MEDIUM_WAIT}

Edit Files in Collect Application
    [Arguments]    ${doc_name}
    Wait Until Element Is Visible    ${button.collect.uploaddocument.editdocument}    ${MEDIUM_WAIT}    Documents edit page is not visible after waiting ${MEDIUM_WAIT}
    Click Element    //div/div[text()='${doc_name}']//parent::div//following-sibling::button[1]
    Wait Until Element Is Visible    ${button.collect.editdocument.editfile}    ${MEDIUM_WAIT}    Edit File button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.editdocument.editfile}

Split the Document in Collect
    [Arguments]    ${document_name}    ${page_number}    ${warning_message}=NA
    Edit Files in Collect Application    ${document_name}
    Run Keyword If    '${warning_message}'=='NA'    Select Page from the Document in Collect Application    ${page_number}
    Wait Until Element Is Visible    ${label.collect.editdocument.editfiles}    ${MEDIUM_WAIT}    Edit File(S) is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.editfiles.split}

Cancel Edit Files in Collect
    Wait Until Element Is Visible    ${button.collect.editfiles.cancel}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT}
    Click Element    ${button.collect.editfiles.cancel}

Validate Rotate a Document
    [Arguments]    ${expected_file_path}
    Wait Until Element Is Visible    ${image.collect.uploaded.image}    ${LONG_WAIT}
    Click Element    ${image.collect.uploaded.image}
    Wait Until Element Is Visible    ${button.collect.editfiles.rotatepage}    ${LONG_WAIT}
    Click Element    ${button.collect.editfiles.rotatepage}
    sleep    500ms
    Capture Element Screenshot    ${image.collect.uploaded.image}    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\actual.png
    Compare Capture Images    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\actual    ${expected_file_path}

Select Custom Field Values in Collect Application
    [Arguments]    ${value}
    Select datasource drop down value    ${value}
    ${click_status}    Run Keyword And Return Status    Element Should Be Visible    ${textbox.collect.contentdetails.textbox}
    Run Keyword If    '${click_status}'=='True'    Click Element    ${textbox.collect.contentdetails.textbox}

Select datasource drop down value
    [Arguments]    ${value}
    Wait Until Element Is Visible    ${dropdown.collect.contentdetails.dropdown}    ${MEDIUM_WAIT}
    Click Element    ${dropdown.collect.contentdetails.dropdown}
    Wait Until Element Is Visible    ${dropdown.collect.contentdetails.options.list}    ${MEDIUM_WAIT}
    Click Element    //div[text()='${value}']
