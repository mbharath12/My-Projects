*** Settings ***
Test Template     Perform Device Operation from Profile
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=DeviceOperation
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}

*** Keywords ***
Perform Device Operation from Profile
    [Arguments]    ${test_case_name}    ${login_enrollee_td}    ${operation_td}    ${device_operation}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${login_data}=    Read TestData From Excel    ${login_enrollee_td}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${login_enrollee_td}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    &{enrollee_device_data}=    CustomLibrary.Get Enrollee Assgined Device Serial Num    ${enrollee_data}[PrimaryId]
    comment    Get Message Id for assigned enrollee Before device operation
    &{device_msg}=    CustomLibrary.Get Message Id Before Device Operation    ${enrollee_device_data}[SERIALNUM]
    Perform device action from enrollee profile    ${device_operation}
    ${perl_commands}=    Read TestData From Excel    ${operation_td}    PursuitData
    comment    mobile_pursuit.Validate Pursuit from Database
    mobile_pursuit.Validate Pursuit from Database    ${enrollee_device_data}[SERIALNUM]    ${device_msg}[MSGID]    ${perl_commands}
