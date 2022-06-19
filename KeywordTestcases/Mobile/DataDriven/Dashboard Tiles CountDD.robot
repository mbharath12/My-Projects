*** Settings ***
Test Template     Dashboard Tiles Count
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=Dashboard
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}

*** Keywords ***
Dashboard Tiles Count
    [Arguments]    ${login_tcname}    ${count_name}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${login_data}=    Read TestData From Excel    ${login_tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Get Dashboard Tiles Count from App and Database then Validate Dashboard Tiles Count in Dashboard
    Run Keyword If    '${count_name}'=='Enrollees_Count'    mobile_dashboard.Validate Enrollees Count in Dashboard    ${login_data}[Org]
    Run Keyword If    '${count_name}'=='Events_Count'    mobile_dashboard.Validate Events Count in Dashboard    ${login_data}[Org]
    Run Keyword If    '${count_name}'=='Inventory_Count'    mobile_dashboard.Validate Inventory Count in Dashboard    ${login_data}[Org]
