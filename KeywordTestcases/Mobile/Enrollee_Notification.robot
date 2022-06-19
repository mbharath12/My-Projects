*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C84487 Chat notification from enrollee
    [Tags]    Android_test_case_id=84487    Android_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_101
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_101    Enrollee
    Generate Enrollink JWT Token    TC_Enrollink_02
    ${enrollee_notificationDate}    ${enrollee_updatedPayload}    POST Enrollee Send a Message to Agent    TC_Enrollink_03
    ${notificationText}    Get Data From JSON    ${enrollee_updatedPayload}    notificationText
    ${enrollee_notificationText}    Set Variable    Enrollink: ${enrollee_data}[LastName], ${enrollee_data}[FirstName]. ${notificationText}
    mobile_notification.Check Notification    ${enrollee_notificationText}
