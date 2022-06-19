*** Settings ***
Test Template     Change Account Organization
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=ChangeAccOrg
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}

*** Keywords ***
Change Account Organization
    [Arguments]    ${test_case_name}    ${login_tcname}    ${change_ori_tcname}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${login_data}=    Read TestData From Excel    ${login_tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    ${change_ori_tcname}=    Set Variable    TC_03
    ${change_ori_data}=    Read TestData From Excel    ${change_ori_tcname}    Change_Acc_Org
    Comment    Get Dashboard Enrollee Count from Database
    ${before_changing_org_app_enrollee_data}    Get Dashboard Enrollee Count from App
    Comment    Get Dashboard Enrollee Count from Database
    ${before_changing_org_app_events_data}    Get Dashboard Events Count from App
    Comment    Get Dashboard Enrollee Count from Database
    ${before_changing_org_app_inventory_data}    Get Dashboard Inventory Count from App
    Comment    Change Account Organization
    mobile_account.Change Account Organization    ${change_ori_data}
    Comment    Get Dashboard Tiles Count from App after changing Org then Validate Dashboard Tiles Count with before values
    mobile_dashboard.Validate Enrollee Count in Dashboard after changing Organization    ${before_changing_org_app_enrollee_data}
    mobile_dashboard.Validate Events Count in Dashboard after changing Organization    ${before_changing_org_app_events_data}
    mobile_dashboard.Validate Inventory Count in Dashboard after changing Organization    ${before_changing_org_app_inventory_data}
