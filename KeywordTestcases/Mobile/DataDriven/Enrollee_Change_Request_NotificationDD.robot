*** Settings ***
Test Template     Enrollee Notification
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=Enrollee_Notification_ChangeReq
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}
    [Setup]

*** Keywords ***
Enrollee Notification
    [Arguments]    ${test_case_name}    ${login_tcname}    ${enrollink_tcname}    ${notification_text}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${tcname}=    Set Variable    ${login_tcname}
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Generate Enrollink JWT Token    TC_Enrollink_02
    POST Update Change Request of Enrollee    ${enrollink_tcname}
    ${enrollee_notificationText}    Replace String    ${notification_text}    LastName    ${enrollee_data}[LastName]
    ${notification_text}    Replace String    ${enrollee_notificationText}    FirstName    ${enrollee_data}[FirstName]
    mobile_notification.Check Notification    ${notification_text}
