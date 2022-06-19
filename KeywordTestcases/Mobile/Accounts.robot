*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C80483 About
    [Tags]    Android_test_case_id=80483    iOS_test_case_id=77946
    [Setup]    Read TestData From Excel    TC_01    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    Sleep    5s
    mobile_common.Select Navigation Tab    Account
    comment    Click on About button
    mobile_account.Click and validate About

TC02 - C78043 Logout
    [Tags]    Android_test_case_id=78043    iOS_test_case_id=78097
    [Setup]    Read TestData From Excel    TC_02    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Logout From VeriTracks Application
    sleep    5s
    mobile_common.Logout From Mobile Application

TC03 - C78034 Agent Name
    [Tags]    Android_test_case_id=78034    iOS_test_case_id=85920
    [Setup]
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_03
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    Sleep    5s
    mobile_common.Select Navigation Tab    Account
    ${expected_agent_name}=    Read TestData From Excel    ${tcname}    Account
    comment    Get text of agentname
    ${agent_name}    mobile_account.Get text of agentname
    comment    Validating Expexted Agent Name
    mobile_account.Validate Agent name    ${expected_agent_name}[Expected Agent Name]    ${agent_name}

TC04 - C78037 Feedback-Send*Content
    [Tags]    Android_test_case_id=78037    iOS_test_case_id=77948
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_31
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Account
    comment    mobile_account.Select Feedback
    mobile_account.Select Feedback
    ${account_data}=    Read TestData From Excel    ${tcname}    Account
    comment    mobile_account.Send Feedback Message
    mobile_account.Send Feedback Message    ${account_data}[Feedback]
    comment    mobile_account.Validate feedback sending notification
    mobile_account.Validate feedback sending notification
    comment    Validate Account is displayed after send operation
    Validate Account title
    comment    mobile_account.Validate feedback received notification
    mobile_account.Validate feedback received notification

TC05 - C78038 Feedback-Send*No Content
    [Tags]    Android_test_case_id=78038    iOS_test_case_id=85921
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_31
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Account
    comment    mobile_account.Select Feedback
    mobile_account.Select Feedback
    ${account_data}=    Read TestData From Excel    ${tcname}_02    Account
    comment    mobile_account.Send Feedback Message
    mobile_account.Send Feedback Message    ${account_data}[Feedback]
    comment    mobile_account.Validate feedback error notification
    mobile_account.Validate feedback error notification
    comment    Validate Account is displayed after send operation
    Validate Account title

TC06 - C78039 Feedback-Back Arrow
    [Tags]    Android_test_case_id=78039    iOS_test_case_id=85922
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_31
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Account
    comment    mobile_account.Select Feedback
    mobile_account.Select Feedback
    ${account_data}=    Read TestData From Excel    ${tcname}    Account
    comment    mobile_account.Send Feedback Message
    mobile_account.Send Feedback Message    ${account_data}[Feedback]    Back
    comment    Validate Account is displayed after send operation
    Validate Account title
