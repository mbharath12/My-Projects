*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C84478 Events > Click Confirm Button
    [Tags]    Android_test_case_id=84478    iOS_test_case_id=78204
    [Setup]    Read TestData From Excel    TC_03    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select an Open Event
    @{data}    mobile_events.Select an Open Event    ${test_prerequisite_data}[Org]
    Comment    Confirm an Event
    mobile_events.Confirm an Event
    Comment    Validate Event Confirmed
    mobile_events.Validate Event Confirmed    ${data}[0]
    Comment    Login to Veritrack Web Application
    Comment    web_common.Login to Web Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]    ${test_prerequisite_data}[Schema]    ${test_prerequisite_data}[Org]
    Comment    Comment    Select Tab in Veritrack Web application
    Comment    web_common.Select Navigation Menu    Events
    Comment    Comment    Search Event in Veritrack Web application
    Comment    web_events.Search Event    ${data}[2], ${data}[3]
    Comment    Comment    Validate Event in Veritrack Web Application
    Comment    web_events.Validate Event Confirmed    ${data}[1]    ${data}[2], ${data}[3]
    [Teardown]    AppiumLibrary.Close All Applications

TC02 - C84480 Events > Close a master tamper event
    [Tags]    Android_test_case_id=84480    iOS_test_case_id=78137
    [Setup]
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_77
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Prerequisite for Confirmed Master Tamper Events
    ${event}    mobile_events.Prerequisite for Confirmed Master Tamper Events    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]
    ${tcname}=    Set Variable    TC_77
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Events Tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select a Master Tamper Event
    mobile_events.Select an Event    ${event}[VIOLATIONDESCRIPTION]    ${event}[OFFENDER_LAST_NAME],${event}[OFFENDER_FIRST_NAME]
    Comment    Confirm an Event
    mobile_events.Confirm an Event
    Comment    Validate Event Confirmed
    mobile_events.Validate Event Confirmed    ${data}[0]
    Comment    Close Master Tamper Event
    mobile_events.Close an Event
    Comment    Validate Event is Closed
    mobile_events.ValidateEvent is Closed    ${event}[ID]
    Comment    Close Master Tamper Event
    mobile_events.Close an Event
    Comment    Validate Event is Closed
    mobile_events.ValidateEvent is Closed    ${event}[ID]
    Comment    Login to Web Application
    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]    ${login_data}[Org]
    Comment    Select Tab in Veritrack Web application
    web_common.Select Navigation Menu    Enrollee
    Comment    Search Event in Veritrack Web application
    web_enrollee.Search Enrollee    ${event}[OFFENDER_LAST_NAME], ${event}[OFFENDER_FIRST_NAME]    ${event}[PRIMARY_ID]    Yes
    Comment    Select Searched Enrollee
    web_enrollee.Select Searched Enrollee    ${event}[OFFENDER_LAST_NAME], ${event}[OFFENDER_FIRST_NAME]
    Comment    Select Enrollee's Events Tab
    web_enrollee.Select Enrollee's Navigation Tab    EnrolleeEvents
    Comment    Find Enrollee Events
    web_enrollee.Find Enrollee Events    No    Yes    Both    Strap Tamper Events
    Comment    Validate Enrollee Closed Strap Tamper Event
    web_enrollee.Validate Enrollee Closed Event    ${event}[ID]

TC03 - C84481 Events > Close a master tamper event - No permission to close
    [Tags]    Android_test_case_id=84481    iOS_test_case_id=78289
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_79
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Prerequisite for Confirmed Master Tamper Events
    ${event}    mobile_events.Prerequisite for Confirmed Master Tamper Events    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]
    ${tcname}=    Set Variable    TC_79
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Events Tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select a Master Tamper Event
    mobile_events.Select an Event    ${event}[VIOLATIONDESCRIPTION]    ${event}[OFFENDER_LAST_NAME],${event}[OFFENDER_FIRST_NAME]
    Comment    Confirm an Event
    mobile_events.Confirm an Event

TC04 - C84475 Events > Details-View Profile Screen
    [Tags]    Android_test_case_id=84475    iOS_test_case_id=78201
    [Setup]    Read TestData From Excel    TC_23    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select an Event
    mobile_events.Select First Event
    Comment    Get the event details
    ${event_details}=    mobile_events.Get the Selected event Details
    Comment    Click on Profile Icon
    mobile_enrollee.Select Profile Icon
    Comment    Get profile details
    ${profile_details}=    mobile_events.Get the event profile Details
    Comment    Click on Profile Icon
    mobile_events.Validate Details    ${profile_details}    ${event_details}

TC05 - C84476 Events > Details-Add Event Notes
    [Tags]    Android_test_case_id=84476    iOS_test_case_id=78202
    [Setup]    Read TestData From Excel    TC_23    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select an Event
    mobile_events.Select First Event
    ${enrollee_data}=    Read TestData From Excel    TC_23    Enrollee
    Comment    Add Event Notes
    mobile_events.Add Event Notes    ${enrollee_data}[EventNotes]
    Comment    Validate Event Notes
    mobile_events.Validate Event Notes    ${enrollee_data}[EventNotes]

TC06 - C84477 Events > Verify Map Screen
    [Tags]    Android_test_case_id=84477    iOS_test_case_id=78203
    [Setup]    Read TestData From Excel    TC_26    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Events
    ${event_data}=    Read TestData From Excel    TC_26    Enrollee
    Comment    Select an Event
    mobile_events.Select an Event    ${event_data}[ViolationDescription]    ${event_data}[LastName],${event_data}[FirstName]
    comment    mobile_enrollee.Validate Map screen from events
    mobile_enrollee.Validate Map screen from events

TC07 - C78098 Events Tile
    [Tags]    Android_test_case_id=78098    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_100    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Events
    Comment    Get all event name, enrollee name, deviceSerialNumber , startDateProgress from event list view
    mobile_events.Get All Events details from Events List
    Comment    mobile_events.Validate Event List Details
    mobile_events.Validate Event List Details from Database    ${test_prerequisite_data}[Org]    ${event_main_list}

TC08 - C85960 Confirm Open event with user having deny permission to close master tamper event
    [Tags]    Android_test_case_id=85960    Android_test_case_id=12345
    ${tcname}=    Set Variable    TC_79
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select an Open Event
    @{data}    mobile_events.Select an Open Event other than master tamper    ${login_data}[Org]
    Comment    Confirm an Event
    mobile_events.Confirm an Event
    Comment    Validate Event Confirmed
    mobile_events.Validate Event Confirmed    ${data}[0]
    Comment    Login to Veritrack Web Application
    Comment    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]
    Comment    Comment    Select Tab in Veritrack Web application
    Comment    web_common.Select Navigation Menu    Events
    Comment    Comment    Search Event in Veritrack Web application
    Comment    web_events.Search Event    ${data}[2], ${data}[3]
    Comment    Comment    Validate Event in Veritrack Web Application
    Comment    web_events.Validate Event Confirmed    ${data}[1]    ${data}[2], ${data}[3]

TC09 - C78180 Events > Details-View Profile Screen-Cancel
    [Tags]    Android_test_case_id=11223    iOS_test_case_id=78180
    [Setup]    Read TestData From Excel    TC_23    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Events
    Comment    Select an Event
    mobile_events.Select First Event
    Comment    Click on Profile Icon
    mobile_enrollee.Select Profile Icon
    Comment    mobile_enrollee.Cancel Enrollee Event Profile
    mobile_enrollee.Cancel Enrollee Event Profile
    Comment    Validate enrollee events page
    mobile_enrollee.Validate Enrollee Events page
