*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C85485 Login with blank username and password
    [Tags]    Android_test_case_id=85485    iOS_test_case_id=77958
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_06
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Launch Mobile Application    ${PLATFORM_NAME}
    mobile_common.Cancel Update Version Message
    mobile_common.Enter Login Details    ${login_data}[Username]    ${login_data}[Password]
    Comment    Check Sign in Error is displayed
    AppiumLibrary.Wait Until Element Is Visible    ${label.login.sign_in_error_alert_title}    ${MEDIUM_WAIT}    Sign in Error Alert is not displayed
    AppiumLibrary.Element Text Should Be    ${label.login.sign_in_error_alert.message}    Sorry, your username or password is incorrect.Please try again and be careful not to lock your account.    Sign in Error message is not displayed.

TC02 - C85486 Login with invalid username and valid password
    [Tags]    Android_test_case_id=85486    iOS_test_case_id=78101
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_07
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Launch Mobile Application    ${PLATFORM_NAME}
    mobile_common.Cancel Update Version Message
    mobile_common.Enter Login Details    ${login_data}[Username]    ${login_data}[Password]
    Comment    Check Sign in Error is displayed
    mobile_common.Validate SignIn Error

TC03 - C78103 Create an enrollee with existing primary ID
    [Tags]    Android_test_case_id=78103    iOS_test_case_id=78103
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_08
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}_01    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    mobile_enrollee.Create Enrollee    ${enrollee_data}
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Validate Enrollee details in Mobile app
    mobile_enrollee.Validate Enrollee details    ${enrollee_data}    @{testdata_list}
    Comment    Click Back button from enrolleprofile page
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee_profile.back_arrow}    ${SHORT_WAIT}    Enrollee back arrow button is not visible.
    AppiumLibrary.Click Element    ${button.enrollee_profile.back_arrow}
    ${enrollee_data_second}=    Read TestData From Excel    ${tcname}_02    Enrollee
    Set To Dictionary    ${enrollee_data_second}    PrimaryId=${enrollee_data}[PrimaryId]
    mobile_enrollee.Create Enrollee    ${enrollee_data_second}    False
    Comment    Check error message is displayed
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.addenrollee}    ${MEDIUM_WAIT}    Page is navigated from Add enrollee page.

TC04 - C85487 Login to agent mobile application with valid username and invalid password
    [Tags]    Android_test_case_id=85487    iOS_test_case_id=78102
    [Setup]    Read TestData From Excel    TC_104    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_104
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Launch Mobile Application    ${PLATFORM_NAME}
    mobile_common.Cancel Update Version Message
    mobile_common.Enter Login Details    ${login_data}[Username]    ${login_data}[Password]
    Comment    Check Sign in Error is displayed
    mobile_common.Validate SignIn Error
