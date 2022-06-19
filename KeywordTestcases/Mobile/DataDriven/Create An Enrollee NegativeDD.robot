*** Settings ***
Test Template     Create An Enrollee Negative
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=EnrolleeCreationNegative
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}

*** Keywords ***
Create An Enrollee Negative
    [Arguments]    ${testdata}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${login_data}=    Read TestData From Excel    ${testdata}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${testdata}    Enrollee
    mobile_enrollee.Create Enrollee    ${enrollee_data}    False
    Comment    validate toastmsg    error msg
    mobile_common.Verify same page is displayed    Add Enrollee
    comment    Login to Web Application
    Comment    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]    ${login_data}[Org]
    Comment    comment    Search enrollee
    Comment    web_enrollee.Search and Wait for enrollee to display    ${enrollee_data}[FirstName]    ${enrollee_data}[PrimaryId]    No
    Comment    comment    web_enrollee.Verify enrollee details
    Comment    web_enrollee.Validate enrollee details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]    ${enrollee_data}[RiskLevel]
