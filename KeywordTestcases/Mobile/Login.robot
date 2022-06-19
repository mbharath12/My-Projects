*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C78323 Login to VeriTracks Mobile
    [Tags]    Android_test_case_id=78323    iOS_test_case_id=78114
    [Setup]    Read TestData From Excel    TC_01    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Logout From VeriTracks Application
    mobile_common.Logout From Mobile Application
    [Teardown]    AppiumLibrary.Close All Applications

TC02 - C78288 Privacy Policy
    [Tags]    Android_test_case_id=78288    iOS_test_case_id=78115
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    mobile_common.Launch Mobile Application    ${PLATFORM_NAME}
    sleep    5s
    Run Keyword If    '${PLATFORM_NAME}'=='iOS'    mobile_common.Cancel Update Version Message
    comment    Validate Privacy Policy1
    mobile_account.Validate Privacy Policy

TC03 - C85482 - Enter Login details and Cancel Schema selection
    [Tags]    Android_test_case_id=85482    iOS_test_case_id=85824
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_25
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Cancel Selected Schema
    mobile_common.Cancel Schema Selection

TC04 - C85483 - Enter Login details and Cancel Organization selection
    [Tags]    Android_test_case_id=85483    iOS_test_case_id=85825
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_25
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Cancel Organization
    mobile_common.Cancel Organization Selection

TC05 - C78233 Login to agent mobile application - Cancel
    [Tags]    Android_test_case_id=18818    iOS_test_case_id=78233
    [Setup]    Read TestData From Excel    TC_01    Login
    comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    comment    Cancel schema selection
    mobile_common.Cancel Schema Selection
    Comment    Validate login page
    mobile_common.Validate Login page
