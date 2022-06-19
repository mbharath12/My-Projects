*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Launch Browser and Navigate to URL
    [Arguments]    ${browser_name}    ${url}
    Run Keyword If    '${browser_name}'=='chrome' or '${browser_name}'=='gc' or '${browser_name}'=='Chrome'    Open Chrome Browser    ${url}    ${HEADLESS}
    ...    ELSE    Open Browser    ${browser_name}    ${url}
    Maximize Browser Window

Take Screenshot and Close Browsers
    Run Keyword If    '${TEST_STATUS}'=='PASS'    Screenshot.Take Screenshot
    Close All Browsers

Create Test Prerequisites
    [Arguments]    ${lineofbusiness}    ${testdata_filepath}
    Close All Application Windows
    Close All Browsers
    Login and Open Orchestrator Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Run Keyword If    '${CREATE_DATA_SOURCES_AND_CONNECTIONS}'=='True'    Create Database Connections
    Run Keyword If    '${CREATE_DATA_SOURCES_AND_CONNECTIONS}'=='True'    Create Data Source
    FOR    ${key}    IN    @{lineofbusiness.keys()}
        ${each_test_data_row}    Create Dictionary
        Comment    Createa a unique Line of Business and assign users
        Create Line of Business and Assign Functional Groups    ${lineofbusiness["${key}"]}
        &{batchcontent}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${testdata_filepath}    ${key}    Batch Content Types
        Set To Dictionary    ${batchcontent}    Line Of Business    ${lineofbusiness["${key}"]}[Description]
        &{doc_class_rows}    CustomLibrary.Get All Ms Excel Matching Row Values Into Dictionary Based On Key    ${testdata_filepath}    ${key}    Document Class
        Comment    create batch content types configuration
        Create Batch Content and Document Class Then Assign Custom Index Fields    ${batchcontent}    ${doc_class_rows}
        Comment    Assign Batch Processing Steps to created batch content
        Run Keyword If    '${batch_content}[Applications]'!='NA'    Configure Batch Processing Steps for BCT And Document Classes    ${batch_content}    ${doc_class_rows}
        Comment    Assign file formates to created batch content
        Assign File Formats to BCT    ${batchcontent}[Code]    ${batchcontent}[File Formats]
        Set To Dictionary    ${each_test_data_row}    Line Of Business    ${lineofbusiness["${key}"]}    Batch Content Type    ${batchcontent}    Document Classes    ${doc_class_rows}
        Collections.Set To Dictionary    ${created_test_data_values}    ${key}    ${each_test_data_row}
        Sleep    10s
    END

Import Configuration File
    [Arguments]    ${file_name}
    Close All Application Windows
    Close All Browsers
    Login and Open Orchestrator Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Navigate to Menu    SYSTEM MANAGEMENT    IMPORT/EXPORT
    Wait Until Element Is Visible    ${label.admin.importexportconfiguration}    ${LONG_WAIT}    'IMPORT/EXPORT CONFIGURATION' is not visible after waiting for ${LONG_WAIT} seconds
    File Should Exist    ${file_name}    ${file_name} File not found in TestData folder.
    Wait Until Element Is Visible    ${button.admin.importexport.choosefile}    ${LONG_WAIT}    'IMPORT/EXPORT Choose file' button is not visible after waiting for ${LONG_WAIT} seconds
    Choose File    ${button.admin.importexport.choosefile.fileupload}    ${file_name}
    Wait Until Element Is Visible    ${button.adminlogin.continue}    ${LONG_WAIT}    'IMPORT/EXPORT OK' button is not visible after waiting for ${LONG_WAIT} seconds
    Click Element    ${button.adminlogin.continue}
    Wait Until Element Is Visible    ${dropdown.admi.importexport.batchcontenttypes}    ${LONG_WAIT}    'IMPORT/EXPORT BATCH CONTENT TYPES' dropdown is not visible after waiting for ${LONG_WAIT} seconds
    Click Element    ${dropdown.admi.importexport.batchcontenttypes}
    Wait Until Element Is Visible    ${dropdown.admi.importexport.batchcontenttypes.list}    ${MEDIUM_WAIT}    'IMPORT/EXPORT BATCH CONTENT TYPES' list is not visible after waiting for ${LONG_WAIT} seconds
    Select All From List    ${dropdown.admi.importexport.batchcontenttypes.list}
    Wait Until Element Is Visible    ${button.adminlogin.continue}    ${LONG_WAIT}    'IMPORT/EXPORT OK' button is not visible after waiting for ${LONG_WAIT} seconds
    Click Element    ${button.adminlogin.continue}
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.userinterfacedelete.yes}    ${LONG_WAIT}    'IMPORT/EXPORT Continue' button is not visible after waiting for ${LONG_WAIT} seconds
    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.userinterfacedelete.yes}
    Comment    Wait Until Element Is Not Visible    //img[@src="/Encapture/Images/Spinner.gif"]    ${LONG_WAIT}
    Comment    Wait Until Element Is Visible    ${button.adminlogin.continue}    ${LONG_WAIT}
    Sleep    2m
