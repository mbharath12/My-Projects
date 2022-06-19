*** Settings ***
Test Template     Update Maptype from Account MapSetting
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=MapScreen
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}

*** Keywords ***
Update Maptype from Account MapSetting
    [Arguments]    ${login_tcname}    ${map_setting_type}    ${map_type}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${login_data}=    Read TestData From Excel    ${login_tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Account
    Comment    Click on Default Map Settings button
    mobile_account.Update Map Settings    ${map_setting_type}
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Dashboard
    Comment    Validate Default Map Screen in Caseload
    mobile_account.Validate Map Type    ${map_type}
