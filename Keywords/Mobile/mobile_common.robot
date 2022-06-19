*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Launch Mobile Application
    [Arguments]    ${platform_name}
    [Documentation]    Launch Application in Android and iOS platforms.
    ...
    ...    Examples:
    ...    mobile_common.Launch Mobile Application ${PLATFORM_NAME}
    ...    mobile_common.Launch Mobile Application Android/ios
    FOR    ${key}    IN RANGE    1    2
        Run Keyword If    '${platform_name}'=='Android'    AppiumLibrary.Open Application    ${APPIUM_SERVER_URL}    platformName=Android    platformVersion=${ANDROID_PLATFORM_VERSION}    deviceName=${ANDROID_DEVICE_NAME}    app=${ANDROID_APP}    automationName=${ANDROID_AUTOMATION_NAME}    noReset=${ANDROID_NO_RESET_APP}    autoAcceptAlerts=True    autoGrantPermissions=True    newCommandTimeout=${NEW_COMMAND_TIMEOUT}
        Run Keyword If    '${platform_name}'=='iOS'    AppiumLibrary.Open Application    ${APPIUM_SERVER_URL}    platformName=iOS    platformVersion=${IOS_PLATFORM_VERSION}    deviceName=${IOS_DEVICE_NAME}    app=${IOS_APP}    udid=${UDID}    bundleId=${BUNDLE_ID}    automationName=${IOS_AUTOMATION_NAME}    noReset=False    autoAcceptAlerts=False    autoDismissAlerts=True
        Run Keyword If    '${platform_name}'!='iOS' and '${platform_name}'!='Android'    Fail    Platform Name used '${platform_name}'. Please provide valid Platform Name.
        Set Appium Timeout    15s
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Page Contains Element    ${textbox.login.username}    ${MEDIUM_WAIT}    Username is not visible after waitng ${MEDIUM_WAIT} seconds
        Run Keyword If    '${status}'=='False'    Continue For Loop
    END
    Run Keyword If    '${status}'=='False'    mobile_common.Fail and take screenshot

Input Text
    [Arguments]    ${locator}    ${data}
    [Documentation]    Enters Text into textbox, and Hide the android keyboard.
    ...
    ...    Example:
    ...    mobile_common.Input Text locator text
    Run Keyword If    '${data}'!='NA'    AppiumLibrary.Input Text    ${locator}    ${data}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    AppiumLibrary.Hide Keyboard
    Run Keyword If    '${PLATFORM_NAME}'=='iOS' and '${Username}'!='NA'    AppiumLibrary.Click Element    //XCUIElementTypeButton[@name='Return']

Read TestData From Excel
    [Arguments]    ${testcaseid}    ${sheet_name}
    [Documentation]    Read TestData from excel file for required data.
    ...
    ...    Example:
    ...    Read TestData From Excel TC_01 SheetName
    ${test_prerequisite_data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${testcaseid}    ${sheet_name}
    Set Global Variable    ${test_prerequisite_data}
    [Return]    ${test_prerequisite_data}

Generate Random Email
    ${random_number}    FakerLibrary.Random Number    9    True
    ${email}    Set Variable    Test_${random_number}@mailinator.com
    [Return]    ${email}

Fail and take screenshot
    [Arguments]    ${message}
    AppiumLibrary.Capture Page Screenshot
    Fail    ${message}

Update Dynamic Value
    [Arguments]    ${locator}    ${value}
    [Documentation]    It replace the string where ever you want.
    ...
    ...    Example:
    ...    mobile_common.Update Dynamic Value locator replace_string
    ${xpath}=    Replace String    ${locator}    replaceText    ${value}
    [Return]    ${xpath}

Update Dynamic Values
    [Arguments]    ${locator}    ${value1}    ${value2}
    ${locator}=    Replace String    ${locator}    replaceText1    ${value1}
    ${xpath}=    Replace String    ${locator}    replaceText2    ${value2}
    [Return]    ${xpath}

Login to Mobile Application
    [Arguments]    ${Username}    ${Password}
    [Documentation]    Login to Android Mobile Application. Enter username and password and check the schemas page is displayed. If this login keyword fails it returns Fail status by giving error message.
    ...
    ...    Examples:
    ...    android_common.Login to Mobile Application ${test_prerequisite_data}[Username] ${test_prerequisite_data}[Password]
    ...
    ...    android_common.Login to Mobile Application AMA1 Stop2021@
    mobile_common.Launch Mobile Application    ${PLATFORM_NAME}
    mobile_common.Cancel Update Version Message
    Comment    Commented below code as iOS related OR is not added
    Comment    AppiumLibrary.Wait Until Element Is Visible    ${images.welcome.logo}    ${LONG_WAIT}    VeriTracks Logo is not displayed after waiting ${LONG_WAIT} seconds
    mobile_common.Enter Login Details    ${Username}    ${Password}
    ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.schemas_title}    ${LONG_WAIT}    Schemas screen is not displayed after waiting ${LONG_WAIT} seconds
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    Unable to login to STOP application with valid credentials ${Username} and ${Password}

Select Schema
    [Arguments]    ${schema}
    [Documentation]    Selects a desired Schema from the application while login. And check the Organization page is displayed.
    ...
    ...    Examples:
    ...    android_common.Select Schema ${test_prerequisite_data}[Schema]
    ...
    ...    android_common.Select Schema A1CLIENT04
    ${list.schema.new}    Update Dynamic Value    ${list.schema}    ${schema}
    ${status}    Run Keyword And Return Status    AppiumExtendedLibrary.Swipe Down To Element    ${list.schema.new}    5
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    ${schema} is not found in Schemas list
    AppiumLibrary.Click Element    ${list.schema.new}
    AppiumLibrary.Wait Until Element Is Visible    ${button.common.select}    ${LONG_WAIT}    Select button is not visible after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${button.common.select}
    AppiumLibrary.Wait Until Element Is Visible    ${label.org_title}    ${LONG_WAIT}    Organizations screen is not displayed after waiting ${LONG_WAIT} seconds

Select Organization
    [Arguments]    ${org}
    [Documentation]    Selects a desired Organization from the application while login. And check the Dashboard title is displayed.
    ...
    ...    Examples:
    ...    android_common.Select Organization ${test_prerequisite_data}[Org]
    ...    android_common.Select Organization STOPLLC
    @{orgs_list}    Split String    ${org}    |
    FOR    ${org_name}    IN    @{orgs_list}
        Run Keyword If    '${PLATFORM_NAME}'=='iOS'    Select organization in iOS    ${org_name}
        ${list.enrollee.org.new}    Update Dynamic Value    ${list.enrollee.org}    ${org_name}
        sleep    2s
        AppiumExtendedLibrary.Swipe Down To Element    ${list.enrollee.org.new}    3
        ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.enrollee.org.new}
        Run Keyword If    ${status} == True    AppiumLibrary.Click Element    ${list.enrollee.org.new}
        AppiumExtendedLibrary.Swipe Up    3
    END
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    ${org} is not found in Organizations list
    AppiumLibrary.Click Element    ${button.org.select}
    AppiumLibrary.Wait Until Element Is Visible    ${label.dashboard_title}    ${LONG_WAIT}    Dashboard screen is not displayed after waiting ${LONG_WAIT} seconds

Logout From Mobile Application
    [Documentation]    Do Logout from the Application. And check the Logo of the application.
    ...
    ...    Examples:
    ...    android_common.Logout From Mobile Application
    mobile_common.Select Navigation Tab    Account
    AppiumLibrary.Wait Until Element Is Visible    ${button.account.logout}    ${LONG_WAIT}    Logout button is not displayed after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${button.account.logout}
    AppiumLibrary.Wait Until Element Is Visible    ${images.welcome.logo}    ${LONG_WAIT}    VeriTracks Logo is not displayed after waiting ${LONG_WAIT} seconds

Select Navigation Tab
    [Arguments]    ${tab_name}
    [Documentation]    This keyword do navigate one to another tab. And check the selected tabname page title is displayed.
    ...
    ...    Examples:
    ...    android_common.Select Navigation Tab Events
    AppiumLibrary.Click Element    ${button.${tab_name}}
    Comment    Update Page title place holder variable at runtime
    ${label.pagetitle.new} =    Update Dynamic Value    ${label.pagetitle}    ${tab_name}
    AppiumLibrary.Wait Until Element Is Visible    ${label.pagetitle.new}    ${MEDIUM_WAIT}    Not redirected to ${tab_name} page.

Cancel Update Version Message
    ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${button.common.cancel}    ${LONG_WAIT}    Veritrack App Version Update message box is not displayed after waiting ${LONG_WAIT} seconds
    Run Keyword If    ${status} == True    AppiumLibrary.Click Element    ${button.common.cancel}

Enter Login Details
    [Arguments]    ${Username}    ${Password}
    mobile_common.Input Text    ${textbox.login.username}    ${Username}
    sleep    1s
    mobile_common.Input Text    ${textbox.login.password}    ${Password}
    sleep    1s
    AppiumLibrary.Click Element    ${button.signin}

Verify page Should be navigated
    [Arguments]    ${pageTitle}
    ${label.common.pagetitle.new}    Update Dynamic Value    ${label.common.pagetitle}    ${pageTitle}
    AppiumLibrary.Wait Until Element Is Visible    ${label.common.pagetitle.new}    ${LONG_WAIT}    Expected page is not displayed \

Cancel Schema Selection
    AppiumLibrary.Click Element    ${button.schemas.cancel}
    AppiumLibrary.Wait Until Element Is Visible    ${label.welcome.text}    ${SHORT_WAIT}    Welcome text is not visible

Cancel Organization Selection
    AppiumLibrary.Wait Until Element Is Visible    ${button.org.cancel}    ${SHORT_WAIT}    Cancel button is not visible.
    AppiumLibrary.Click Element    ${button.org.cancel}
    AppiumLibrary.Wait Until Element Is Visible    ${label.schemas_title}    ${SHORT_WAIT}    Schemas page is not visible.

Validate Schemas Page
    ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.schemas_title}    ${LONG_WAIT}
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    Unable to login to STOP application with valid credentials ${Username} and ${Password}

Click and Wait for Element
    [Arguments]    ${click_locator}    ${wait_locator}    ${error_msg1}=None    ${error_msg2}=None
    FOR    ${key}    IN RANGE    1    2
        AppiumLibrary.Wait Until Element Is Visible    ${click_locator}    ${LONG_WAIT}    ${error_msg1}
        AppiumLibrary.Tap    ${click_locator}
        ${wait_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${wait_locator}    ${SHORT_WAIT}    ${error_msg2}
        Run Keyword If    '${wait_status}'=='False'    Continue For Loop
    END
    Run Keyword If    '${wait_status}'=='False'    mobile_common.Fail and take screenshot

Verify same page is displayed
    [Arguments]    ${pageTitle}
    sleep    5s
    ${label.common.pagetitle.new}    Update Dynamic Value    ${label.common.pagetitle}    ${pageTitle}
    AppiumLibrary.Wait Until Element Is Visible    ${label.common.pagetitle.new}    ${LONG_WAIT}    Not in same page

Validate toast message
    [Arguments]    ${error message}
    AppiumLibrary.Page Should Contain Text    ${error message}    ${error message} is not visible.

Get Date Object For Given String
    [Arguments]    ${date_time_str}
    ${date_time_obj}=    CustomLibrary.Convert String To DateObj    ${date_time_str}
    [Return]    ${date_time_obj}

Set Tag for test case id
    Log    ${TEST TAGS}
    Comment    Get the test case id based on platform
    ${test_id}=    CustomLibrary.get_test_case_id
    Comment    Remove existing test case id tag
    Remove Tags    Android*    iOS*    test_case*
    Comment    Add the test case id based on platform
    Set Tags    test_case_id=${test_id}
    Log    ${TEST TAGS}

Set Tag for Data Driven test case id
    [Arguments]    ${Android_test_case_id}    ${iOS_test_case_id}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Set Tags    test_case_id=${Android_test_case_id}
    ...    ELSE    Set Tags    test_case_id=${iOS_test_case_id}

Get control enable status
    [Arguments]    ${locator}
    ${status_name}=    AppiumLibrary.Get Element Attribute    ${locator}    content-desc
    @{statuslist}=    Split String    ${status_name}    ,
    ${status}=    Get From list    ${statuslist}    1
    ${status}=    Remove String    ${status}    ${SPACE}
    [Return]    ${status}

Validate SignIn Error
    Run Keyword If    ‘${PLATFORM_NAME}'==‘Android’    AppiumLibrary.Wait Until Element Is Visible    ${label.login.sign_in_error_alert_title}    ${SHORT_WAIT}    Sign in Error Alert is not displayed
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    AppiumLibrary.Element Text Should Be    ${label.login.sign_in_error_alert.message}    Sorry, your username or password is incorrect.Please try again and be careful not to lock your account.    Sign in Error message is not displayed.
    Run Keyword If    ‘${PLATFORM_NAME}’==‘iOS’    AppiumLibrary.Page Should Contain Element    ${label.login.sign_in_error_alert.message}    Sign in Error Alert is not displayed

Validate Login page
    AppiumLibrary.Wait Until Element Is Visible    ${button.signin}    ${LONG_WAIT}    Login page is not displayed after waiting ${LONG_WAIT} seconds

Select organization in iOS
    [Arguments]    ${org_name}
    ${org_name}    Set Variable If    '${org_name}'=='STOPLLC' or '${org_name}'=='AUTOTEST'    ${org_name} parent
    Set Global Variable    ${org_name}    ${org_name}
