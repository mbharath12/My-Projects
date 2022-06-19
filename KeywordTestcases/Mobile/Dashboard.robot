*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C84287 Run turn by turn navigation in Dashboard-Google Maps
    [Tags]    Android_test_case_id=84287    iOS_test_case_id=78158
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_25
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${tcname}=    Set Variable    TC_25
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    comment    mobile_pursuit.Pursuit an enrollee
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Direction
    comment    Validate turn by turn navigation in dashboard - google maps
    mobile_pursuit.Validate map screen

TC02 - C84294 Send recent pursuit
    [Tags]    Android_test_case_id=84294    iOS_test_case_id=78163
    [Setup]    Read TestData From Excel    TC_04    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    ${tcname}=    Set Variable    TC_04
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Pursuit an enrollee from Caseload
    SLEEP    5s
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Pursuit
    comment    Get Serial number for assigned enrollee
    &{enrollee_device_data}=    CustomLibrary.Get Enrollee Assgined Device Serial Num    ${enrollee_data}[PrimaryId]
    comment    Get Message Id for assigned enrollee Before device operation
    &{device_msg}=    CustomLibrary.Get Message Id Before Device Operation    ${enrollee_device_data}[SERIALNUM]
    comment    mobile_pursuit.perform dashboard profile actions
    mobile_pursuit.perform dashboard profile actions    SEND    ${enrollee_data}[PrimaryId]
    ${perl_commands}=    Read TestData From Excel    TC_13    PursuitData
    comment    mobile_pursuit.Validate Pursuit from Database
    mobile_pursuit.Validate Pursuit from Database    ${enrollee_device_data}[SERIALNUM]    ${device_msg}[MSGID]    ${perl_commands}

TC03 - C84293 Delete recent pursuit
    [Tags]    Android_test_case_id=84293    iOS_test_case_id=78162
    [Setup]    Read TestData From Excel    TC_04    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    ${tcname}=    Set Variable    TC_04
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Pursuit an enrollee from Caseload
    SLEEP    5s
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Pursuit
    Comment    Validate enrollee in recent pursuits and delete
    mobile_pursuit.perform dashboard profile actions    DELETE    ${enrollee_data}[PrimaryId]
    comment    Validate Enrollee is not displayed in recent pursuit after delete operation
    mobile_pursuit.Validate deleted enrollee in recent pursuit    ${enrollee_data}[PrimaryId]
    [Teardown]    AppiumLibrary.Close All Applications

TC04 - C84295 Cancel recent pursuit
    [Tags]    Android_test_case_id=84295    iOS_test_case_id=78164
    [Setup]    Read TestData From Excel    TC_04    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    ${tcname}=    Set Variable    TC_04
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Pursuit an enrollee from Caseload
    SLEEP    5s
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Pursuit
    Comment    Validate enrollee in recent pursuits and Cancel
    mobile_pursuit.perform dashboard profile actions    CANCEL    ${enrollee_data}[PrimaryId]
    comment    Validate Enrollee is displayed in recent pursuit after cancel operation
    Validate enrollee in recent pursuits    ${enrollee_data}[PrimaryId]

TC05 - C84289 Run Pursuit in Dashboard
    [Tags]    Android_test_case_id=84289    iOS_test_case_id=78159
    [Setup]    Read TestData From Excel    TC_04    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    ${tcname}=    Set Variable    TC_04
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Pursuit an enrollee from Caseload
    SLEEP    5s
    ${perl_commands}=    Read TestData From Excel    ${tcname}    PursuitData
    comment    Get Serial number for assigned enrollee
    &{enrollee_device_data}=    CustomLibrary.Get Enrollee Assgined Device Serial Num    ${enrollee_data}[PrimaryId]
    comment    Get Message Id for assigned enrollee Before device operation
    &{device_msg}=    CustomLibrary.Get Message Id Before Device Operation    ${enrollee_device_data}[SERIALNUM]
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Pursuit
    Comment    Validate enrollee in recent pursuits and delete
    Run Keyword And Continue On Failure    mobile_pursuit.Validate enrollee in recent pursuits    ${enrollee_data}[PrimaryId]
    comment    mobile_pursuit.Validate Pursuit from Database
    mobile_pursuit.Validate Pursuit from Database    ${enrollee_device_data}[SERIALNUM]    ${device_msg}[MSGID]    ${perl_commands}
    [Teardown]    AppiumLibrary.Close All Applications

TC06 - C84286 Run profile screen in Dashboard
    [Tags]    Android_test_case_id=84286    iOS_test_case_id=78160
    [Setup]    Read TestData From Excel    TC_42    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    ${tcname}=    Set Variable    TC_42
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Pursuit an enrollee from Caseload
    sleep    5s
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Profile
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Validate Enrollee details in Mobile app
    mobile_enrollee.Validate Enrollee details    ${enrollee_data}    @{Profile_data_list}

TC07 - C85490 Check Recent Pursuit list after re-login
    [Tags]    Android_test_case_id=85490    Android_test_case_id=86000
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_42
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Validate Schema Page
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${tcname}=    Set Variable    TC_42
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Pursuit an enrollee from Caseload
    SLEEP    10s
    mobile_pursuit.Pursuit an enrollee    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    Pursuit
    sleep    3s
    mobile_common.Logout From Mobile Application
    ${tcname}=    Set Variable    TC_42
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Cancel Update Version Message
    mobile_common.Cancel Update Version Message
    Comment    Login to VeriTracks Application
    mobile_common.Enter Login Details    ${login_data}[Username]    ${login_data}[Password]
    Comment    Validate Schema Page
    mobile_common.Validate Schemas Page
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Validate pursuit section
    AppiumLibrary.Element Should Be Visible    ${images.pursuit.icon}
