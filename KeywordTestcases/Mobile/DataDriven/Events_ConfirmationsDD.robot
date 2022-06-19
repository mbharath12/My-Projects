*** Settings ***
Test Template     Events Confirmation
Library           DataDriver    ../../../Testdata/DataDriver.xlsx    sheet_name=EventsActions
Resource          ../../../Config/super.robot

*** Test Cases ***
${test_case_name}

*** Keywords ***
Events Confirmation
    [Arguments]    ${login_tcname}    ${violation_description}    ${Android_test_case_id}    ${iOS_test_case_id}
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for Data Driven test case id    ${Android_test_case_id}    ${iOS_test_case_id}
    ${login_data}=    Read TestData From Excel    ${login_tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Events
    ${events}=    Read TestData From Excel    ${login_tcname}    Events
    Comment    Select an Open Event
    @{data}    mobile_events.Select an Open Event    ${login_data}[Org]    ${violation_description}
    Comment    Confirm an Event
    mobile_events.Confirm an Event
    Comment    Validate Event Confirmed
    mobile_events.Validate Event Confirmed    ${data}[0]
    Comment    Login to Veritrack Web Application
    Comment    web_common.Login to Web Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]    ${test_prerequisite_data}[Schema]
    Comment    Comment    Select Tab in Veritrack Web application
    Comment    web_common.Select Navigation Menu    Events
    Comment    Comment    Search Event in Veritrack Web application
    Comment    web_events.Search Event    ${data}[2], ${data}[3]
    Comment    Comment    Validate Event in Veritrack Web Application
    Comment    web_events.Validate Event Confirmed    ${data}[1]    ${data}[2], ${data}[3]
