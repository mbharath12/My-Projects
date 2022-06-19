*** Settings ***
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
Create API Testcases Prerequisites data
    [Setup]    Clear Admin Database
    Comment    Restart the Client services
    Restart Encapture Wizard Services    False
    ${bct_custom_fields_list}    Create Dictionary
    Set Global Variable    ${bct_custom_fields_list}
    &{lineofbusiness}    CustomLibrary.Get All Ms Excel Row Values Into Dictionary    ${TESTDATA_FOLDER}\\AdminPortal\\APIAdminPortalTestData.xlsx    Line Of Business
    FOR    ${index}    IN RANGE    10
        Clear Admin Database
        ${created_test_data_values}    Create Dictionary
        Set Global Variable    ${created_test_data_values}
        ${is_prerequisites_created}    Run Keyword And Return Status    Create Test Prerequisites    ${lineofbusiness}    ${TESTDATA_FOLDER}\\AdminPortal\\APIAdminPortalTestData.xlsx
        Run Keyword If    '${is_prerequisites_created}'=='True'    Exit For Loop
    END
    Run Keyword If    '${is_prerequisites_created}'=='False'    Fail    Test Prerequisites not Created
    Comment    Restart the services after creating the data
    Restart Encapture Wizard Services
    Set Global Variable    ${is_prerequisites_created}
    Close All Browsers

Import API Test Prerequisites Data
    Comment    Clear Encapture Orchestrate Database
    Clear Admin Database
    Comment    Import the Test data
    ${is_prerequisites_created}    Run Keyword And Return Status    Import Configuration File    ${IMPORT_API_TESTDATA}
    Set Global Variable    ${is_prerequisites_created}
    Close All Browsers
    Run Keyword If    '${is_prerequisites_created}'=='False'    Fail
    Comment    Restart the services after creating the data
    Restart Encapture Wizard Services
