*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C85515 Verify Enrollee details displayed in Profile page
    [Tags]    Android_test_case_id=85515    iOS_test_case_id=85659
    [Setup]    Read TestData From Excel    TC_28    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_28    Enrollee
    Comment    Search enrollee
    mobile_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    \    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Validate Enrollee details
    mobile_enrollee.Validate Enrollee details    ${enrollee_data}    @{Profile_data_list}

TC02 - C84315 Profile > Map > Verify turn by turn navigation-Google Maps
    [Tags]    Android_test_case_id=84315    iOS_test_case_id=78139
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_26
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_26    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    search for an enrollee
    mobile_enrollee.Search Enrollee    NA    ${enrollee_data}[LastName]    NA    Assigned
    comment    mobile_enrollee.Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[LastName]
    comment    Select Map in profile details
    mobile_enrollee.Select Map in profile details
    comment    Validate turn by turn navigation in dashboard - google maps
    mobile_pursuit.Validate map screen

TC03 - C84322 Verify that Agent is able to see Chat history of the group
    [Tags]    Android_test_case_id=84322    iOS_test_case_id=78690
    [Setup]    Read TestData From Excel    TC_27    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_27    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee
    ${enrollee_data}[FirstName]
    Comment    Validate Chat History Page of an enrollee
    mobile_enrollee.Validate Chat History Page

TC04 - C84330 Assign Enrollee on Blutag v7 Device
    [Tags]    Android_test_case_id=84330    iOS_test_case_id=80563
    ${tcname}=    Set Variable    TC_05
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    mobile_enrollee.Create Enrollee    ${enrollee_data}
    comment    Navigate to Edit Enrollee page
    Navigate to Edit Enrollee page    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Unassigned
    ${device_id}=    Read TestData From Excel    ${tcname}_02    Enrollee
    comment    Assign a Device to an Enrollee
    ${assigned_device_text}    mobile_enrollee.Assign a Device to an Enrollee    ${device_id}[DeviceName]
    comment    Validate assign device in mobile app
    mobile_enrollee.Validate assign device    ${assigned_device_text}
    comment    Validate assigned device details of an enrollee in database
    mobile_enrollee.Validate Assigned Device in database    ${assigned_device_text}    ${enrollee_data}[PrimaryId]
    comment    Login to Web Application
    Comment    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]    ${login_data}[Org]
    Comment    comment    Search enrollee
    Comment    web_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[PrimaryId]    Yes
    Comment    comment    Validate Assign device in Web Application
    Comment    web_enrollee.Validate Assign device    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    ${assigned_device_text}

TC05 - C84334 Assign Enrollee on Blutag v8 Device
    [Tags]    Android_test_case_id=84334    iOS_test_case_id=78119
    [Setup]    Read TestData From Excel    TC_20    Login
    ${tcname}=    Set Variable    TC_24
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    mobile_common.Select Navigation Tab    Enrollee
    mobile_enrollee.Create Enrollee    ${enrollee_data}
    comment    Navigate to Edit Enrollee page
    Navigate to Edit Enrollee page    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Unassigned
    ${device_id}=    Read TestData From Excel    ${tcname}_02    Enrollee
    comment    Assign a Device to an Enrollee
    ${assigned_device_text}    mobile_enrollee.Assign a Device to an Enrollee    ${device_id}[DeviceName]
    comment    Validate assign device in mobile app
    mobile_enrollee.Validate assign device    ${assigned_device_text}
    comment    Validate assigned device details of an enrollee in database
    mobile_enrollee.Validate Assigned Device in database    ${assigned_device_text}    ${enrollee_data}[PrimaryId]
    comment    Login to Web Application
    Comment    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]    ${login_data}[Org]
    Comment    comment    Search enrollee
    Comment    web_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[PrimaryId]    Yes
    Comment    comment    Validate Assign device in Web Application
    Comment    web_enrollee.Validate Assign device    ${enrollee_data}[LastName]    ${enrollee_data}[FirstName]    ${assigned_device_text}

TC06 - C84307 Profile > Add Case Notes
    [Tags]    Android_test_case_id=84307    iOS_test_case_id=78130
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_15
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    ${casenote_text}    Add case note for an enrollee    ${enrollee_data}[CaseNote]
    comment    Validate Case Notes
    mobile_pursuit.Validate Case Notes    ${casenote_text}

TC07 - C84336 Unassign Enrollee from a Blutag v8
    [Tags]    Android_test_case_id=84336    iOS_test_case_id=80566
    [Setup]    Read TestData From Excel    TC_21    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Assigned Enrollees
    mobile_enrollee.Search Enrollee    fname    \    \    Assigned
    ${enrollee_data}=    Read TestData From Excel    TC_21    Enrollee
    Comment    Get device pattern from Blutag device name
    ${device_pattern}    Get device pattern    ${enrollee_data}[DeviceName]
    Comment    Unassign an enrollee and validate enrollee is unassigned.
    ${enrollee_details}    mobile_enrollee.Unassign An Enrollee    Court Order    ${device_pattern}
    Comment    Validate Unassigned Enrollee
    mobile_enrollee.Validate Unassigned Enrollee
    Comment    ${test_prerequisite_data}=    Read TestData From Excel    TC_21    Login
    Comment    Comment    Login to Web Application
    Comment    web_common.Login to Web Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]    ${test_prerequisite_data}[Schema]    ${test_prerequisite_data}[Org]
    Comment    Comment    Select Tab in Veritrack Web application
    Comment    web_common.Select Navigation Menu    Enrollee
    Comment    Comment    Search Event in Veritrack Web application
    Comment    web_enrollee.Search Enrollee    ${enrollee_details}[ENROLLEENAME]    ${enrollee_details}[PRIMARYID]    No
    Comment    Comment    Validate Unassigned Enrollee
    Comment    web_enrollee.Validate Unassigned Enrollee    ${enrollee_details}[ENROLLEENAME]    ${enrollee_details}[PRIMARYID]
    [Teardown]    AppiumLibrary.Close All Applications

TC08 - C84296 Create a new enrollee
    [Tags]    Android_test_case_id=84296    iOS_test_case_id=78117
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_02
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    mobile_enrollee.Create Enrollee    ${enrollee_data}
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Validate Enrollee details in Mobile app
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    mobile_enrollee.Validate Enrollee details    ${enrollee_data}    @{testdata_list}
    Comment    Validate Enrollee details in database
    mobile_enrollee.Validate Enrollee details in database    ${enrollee_data}
    comment    Login to Web Application
    Comment    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]    ${login_data}[Org]
    Comment    comment    Search enrollee
    Comment    web_enrollee.Search and Wait for enrollee to display    ${enrollee_data}[FirstName]    ${enrollee_data}[PrimaryId]    No
    Comment    comment    web_enrollee.Verify enrollee details
    Comment    web_enrollee.Validate enrollee details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]    ${enrollee_data}[RiskLevel]
    [Teardown]    AppiumLibrary.Close All Applications

TC09 - C84328 Unassign Enrollee from a Blutag v7
    [Tags]    Android_test_case_id=84328    iOS_test_case_id=78120
    [Setup]    Read TestData From Excel    TC_20    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Assigned Enrollees
    mobile_enrollee.Search Enrollee    fname    \    \    Assigned
    ${enrollee_data}=    Read TestData From Excel    TC_20    Enrollee
    Comment    Get device pattern from Blutag device name
    ${device_pattern}    Get device pattern    ${enrollee_data}[DeviceName]
    Comment    Unassign an enrollee and validate enrollee is unassigned.
    ${enrollee_details}    mobile_enrollee.Unassign An Enrollee    Court Order    ${device_pattern}
    Comment    Validate Unassigned Enrollee
    mobile_enrollee.Validate Unassigned Enrollee
    Comment    ${test_prerequisite_data}=    Read TestData From Excel    TC_20    Login
    Comment    web_common.Login to Web Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]    ${test_prerequisite_data}[Schema]    ${test_prerequisite_data}[Org]
    Comment    Comment    Select Tab in Veritrack Web application
    Comment    web_common.Select Navigation Menu    Enrollee
    Comment    Comment    Search Event in Veritrack Web application
    Comment    web_enrollee.Search Enrollee    ${enrollee_details}[ENROLLEENAME]    ${enrollee_details}[PRIMARYID]    No
    Comment    Comment    Validate Unassigned Enrollee
    Comment    web_enrollee.Validate Unassigned Enrollee    ${enrollee_details}[ENROLLEENAME]    ${enrollee_details}[PRIMARYID]

TC10 - C84308 Events > Details-View Profile Screen
    [Tags]    Android_test_case_id=84308    iOS_test_case_id=78131
    [Setup]    Read TestData From Excel    TC_22    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_22    Enrollee
    Comment    Search an Enrolee
    mobile_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    \    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Select First Event from the list
    mobile_events.Select First Event from the list
    Comment    Select Profile Icon
    mobile_enrollee.Select Profile Icon
    Comment    Validate Enrollee details
    mobile_enrollee.Validate Enrollee details    ${enrollee_data}    @{Profile_data_list}

TC11 - C84309 Events > Details-Add Event Notes
    [Tags]    Android_test_case_id=84309    iOS_test_case_id=78132
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
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_23    Enrollee
    Comment    Search enrollee
    mobile_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    \    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Select an Event
    mobile_events.Select First Event from the list
    Comment    Add Event Notes
    Add Event Notes    ${enrollee_data}[EventNotes]
    Comment    Validate Event Notes
    Validate Event Notes    ${enrollee_data}[EventNotes]

TC12 - C84310 Events > Verify Map Screen
    [Tags]    Android_test_case_id=84310    iOS_test_case_id=78133
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_26
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_26    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    search for an enrollee
    mobile_enrollee.Search Enrollee    NA    ${enrollee_data}[LastName]    NA    Assigned
    comment    mobile_enrollee.Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[LastName]
    comment    Validate Map screen
    mobile_enrollee.Validate Map screen

TC13 - C84314 Profile > Map > Verify Map Screen
    [Tags]    Android_test_case_id=84314    iOS_test_case_id=78138
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_26
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_26    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    search for an enrollee
    mobile_enrollee.Search Enrollee    NA    ${enrollee_data}[LastName]    NA    Assigned
    comment    mobile_enrollee.Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[LastName]
    comment    mobile_enrollee.Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[LastName]
    comment    navigate to events through profile
    Select First Event from the List
    comment    mobile_enrollee.Validate Map screen from events
    mobile_enrollee.Validate Map screen from events

TC14 - C84321 Verify that Agent is able to send messages to the enrollee
    [Tags]    Android_test_case_id=84321    iOS_test_case_id=78689
    [Setup]
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_23
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_23    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Send Message to Enrollee
    mobile_enrollee.Send Message to Enrollee    ${enrollee_data}[Message]
    Comment    Validate Sent Message in Chat Box
    mobile_enrollee.Validate Sent Message in Chat Box    ${enrollee_data}[Message]
    Comment    Validate Sent Message in database
    mobile_enrollee.Validate Sent Message in Database    ${enrollee_data}[PrimaryId]    ${enrollee_data}[Message]

TC15 - C84319 Verify that Agent is able to edit or delete its Chat or not
    [Tags]    Android_test_case_id=84319    iOS_test_case_id=78687
    [Setup]    Read TestData From Excel    TC_23    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_23    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Edit Text Message in Textfield
    mobile_enrollee.Edit Text Message in Textfield    Hello from agent

TC16 - C85506 Check Organization list
    [Tags]    Android_test_case_id=85506    iOS_test_case_id=85647
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_56
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    Comment    Enter Enrollee Details
    mobile_enrollee.Enter Enrollee Details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Validate Organizations list which are selected while login
    mobile_enrollee.Vaidate Organizations list    ${enrollee_data}[Organization]

TC17 - C85508 Check the Device list is displayed based on selected Organization
    [Tags]    Android_test_case_id=85508    iOS_test_case_id=85649
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
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    Comment    Enter Enrollee Details
    mobile_enrollee.Enter Enrollee Details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Select Organization for an enrollee
    mobile_enrollee.Select Organzation for an Enrollee    ${enrollee_data}[Organization]
    Comment    Validate Unassigned Devices
    mobile_enrollee.Validate Unassigned Devices    ${enrollee_data}[Organization]

TC18 - C85509 Check the Time Zone list
    [Tags]    Android_test_case_id=85509    iOS_test_case_id=85650
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
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    Comment    Enter Enrollee Details
    mobile_enrollee.Enter Enrollee Details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Select Organization for an enrollee
    mobile_enrollee.Select Organzation for an Enrollee    ${enrollee_data}[Organization]
    Comment    Validate Time Zone List from db and app
    mobile_enrollee.Validate Time Zone List

TC19 - C85516 Validate Device Change Reason while unassigning device
    [Tags]    Android_test_case_id=85516    iOS_test_case_id=85658
    [Setup]    Read TestData From Excel    TC_20    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Assigned Enrollees
    mobile_enrollee.Search Enrollee    fname    \    \    Assigned
    ${enrollee_data}=    Read TestData From Excel    TC_20    Enrollee
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Click on Unassign button
    Click on Unassign button
    Comment    Update a Reason to unassign
    ${reason_text}    Update a Reason to unassign    Medical
    Comment    Validate Device Change Reason
    mobile_enrollee.Validate Device Change Reason    ${reason_text}    Medical

TC20 - C85524 Create a new enrollee - Cancel
    [Tags]    Android_test_case_id=85524    iOS_test_case_id=85657
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_02
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    mobile_enrollee.Cancel Create Enrollee    ${enrollee_data}
    Comment    Search Enrollee
    mobile_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Validate Cancelled Enrollee
    mobile_enrollee.Validate Cancelled Enrollee    ${enrollee_data}[FirstName]

TC21 - C85526 Assign Enrollee on Blutag Device - Cancel
    [Tags]    Android_test_case_id=85526    iOS_test_case_id=85673
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_21
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Unassigned
    Comment    Close Assign Enrollee
    mobile_enrollee.Close Assign Enrollee

TC22 - C84313 Events > Close a master tamper event
    [Tags]    Android_test_case_id=84313    iOS_test_case_id=12345
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
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${event}[OFFENDER_FIRST_NAME]    ${event}[OFFENDER_LAST_NAME]    ${event}[PRIMARY_ID]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${event}[OFFENDER_LAST_NAME], ${event}[OFFENDER_FIRST_NAME]
    Comment    Select Events Tab in Profile of Enrollee
    mobile_enrollee.Select Navigation Tab in Profile of Enrollee    EVENTS
    Comment    Select a Confirmed Master Tamper Event
    mobile_enrollee.Select an Event    ${event}[VIOLATIONDESCRIPTION]
    Comment    Confirm an Event
    mobile_events.Confirm an Event
    Comment    Validate Event Confirmed
    mobile_events.Validate Event Confirmed    ${data}[0]
    Comment    Close Master Tamper Event
    mobile_events.Close an Event
    Comment    Validate Event is Closed
    mobile_events.ValidateEvent is Closed    ${event}[ID]
    Comment    Login to Web Application
    web_common.Login to Web Application    ${login_data}[Username]    ${login_data}[Password]    ${login_data}[Schema]    ${login_data}[Org]
    Comment    Select Tab in Veritrack Web application
    web_common.Select Navigation Menu    Enrollee
    Comment    Search Event in Veritrack Web application
    web_enrollee.Search Enrollee    ${enrollee_data}[LastName], ${enrollee_data}[FirstName]    ${enrollee_data}[PRIMARYID]    Yes
    Comment    Select Searched Enrollee
    web_enrollee.Select Searched Enrollee    ${enrollee_data}[LastName], ${enrollee_data}[FirstName]
    Comment    Select Enrollee's Events Tab
    web_enrollee.Select Enrollee's Navigation Tab    EnrolleeEvents
    Comment    Find Enrollee Events
    web_enrollee.Find Enrollee Events    No    Yes    Both    Strap Tamper Events
    Comment    Validate Enrollee Closed Strap Tamper Event
    web_enrollee.Validate Enrollee Closed Event    ${event}[ID]

TC23 - C84318 Events > Close a master tamper event - No permission to close
    [Tags]    Android_test_case_id=84318    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_79
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
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${event}[OFFENDER_FIRST_NAME]
    Comment    Select searched enrollee
    Select searched enrollee    ${event}[OFFENDER_LAST_NAME], ${event}[OFFENDER_FIRST_NAME]
    Comment    Select Events Tab in Profile of Enrollee
    mobile_enrollee.Select Navigation Tab in Profile of Enrollee    EVENTS
    Comment    Select a Confirmed Master Tamper Event
    mobile_enrollee.Select an Event    ${event}[VIOLATIONDESCRIPTION]
    Comment    Confirm an Event
    mobile_events.Confirm an Event

TC24 - C84311 Events > Confirm an open event
    [Tags]    Android_test_case_id=84311    iOS_test_case_id=78134
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_78
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Prerequisite for Open Events
    mobile_events.Prerequisite for Open Events    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]
    ${tcname}=    Set Variable    TC_78
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[LastName], ${enrollee_data}[FirstName]
    Comment    Select Events Tab in Profile of Enrollee
    mobile_enrollee.Select Navigation Tab in Profile of Enrollee    EVENTS
    Comment    Select an Open Event of an Enrollee
    ${ID}    mobile_enrollee.Select an Open Event of an Enrollee    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]
    Comment    Confirm an Event
    mobile_events.Confirm an Event
    Comment    Validate Event Confirmed
    mobile_events.Validate Event Confirmed    ${ID}

TC25 - C85507 Check the Risklevel list is displayed based on selected Organization
    [Tags]    Android_test_case_id=85507    iOS_test_case_id=85648
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
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    Comment    Enter Enrollee Details
    mobile_enrollee.Enter Enrollee Details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    Select Organization for an enrollee
    mobile_enrollee.Select Organzation for an Enrollee    ${enrollee_data}[Organization]
    Comment    Validate Time Zone List from db and app
    mobile_enrollee.Validate RiskLevel list    ${enrollee_data}[Organization]

TC26 - C85528 Check the Events list for selected Enrollee
    [Tags]    Android_test_case_id=85528    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_78
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Prerequisite for Open Events
    Prerequisite for Enrollee Events    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]
    ${tcname}=    Set Variable    TC_78
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[LastName], ${enrollee_data}[FirstName]
    Comment    Select Events Tab in Profile of Enrollee
    mobile_enrollee.Select Navigation Tab in Profile of Enrollee    EVENTS
    Comment    Get All Enrollee Events List and Validate
    mobile_enrollee.Get All Enrollee Events List and Validate    ${enrollee_data}[Organization]    ${enrollee_data}[PrimaryId]

TC27 - C85541 Search with Assigned
    [Tags]    Android_test_case_id=85541    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_84
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_84    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    \    Assigned
    Comment    Validate Searched Enrollees with Complete PrimaryId
    Validate Searched Enrollees Details with Assigned Status    Assigned

TC28 - C85542 Search with Unassigned
    [Tags]    Android_test_case_id=85542    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_85
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_85    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    \    Unassigned
    Comment    Validate Searched Enrollees with Complete PrimaryId
    Validate Searched Enrollees Details with Assigned Status    Unassigned

TC29 - C85543 Search with Both
    [Tags]    Android_test_case_id=85543    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_85
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_85    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee
    Comment    Validate Searched Enrollees with Both Device Assigned status
    Validate Searched Enrollees with Both Device Assigned status

TC30 - C85519-Verify Enrollee details displayed in Profile page with Case Notes
    [Tags]    Android_test_case_id=85519    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_41
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    comment    Validate Case Notes
    mobile_enrollee.Validate Case Notes    ${enrollee_data}[PrimaryId]    ${enrollee_data}[Organization]

TC31 - C85522-Check the Enrollee details are displayed in Enrollee Editor
    [Tags]    Android_test_case_id=85522    iOS_test_case_id=85669
    [Setup]    Read TestData From Excel    TC_27    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_27
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Get enrollee details from profile page
    ${enrollee_details}=    mobile_enrollee.Get enrollee profile details
    Comment    Click on edit button
    mobile_enrollee.Click on edit button
    Comment    Get enrollee details from profile page
    ${enrollee_details_from_editorpage}=    mobile_enrollee.Get the details from Enrollee editor page
    mobile_enrollee.Validate enrollee editor page details    ${enrollee_details_from_editorpage}    ${enrollee_details}

TC32 - C85527 Update Time Zone and validate the time format and time stamp is updated accordingly
    [Tags]    Android_test_case_id=85527    iOS_test_case_id=85674
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_91
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    mobile_enrollee.Validate Enrollee timezone and timestamp
    mobile_enrollee.Validate Enrollee timezone and timestamp

TC33 - C85533 Check search list not cleared after navigating back from enrollee profile page
    [Tags]    Android_test_case_id=85533    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_90
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    mobile_enrollee.Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    comment    mobile_enrollee.Select back arrow in enrollee profile page
    mobile_enrollee.Select back arrow in enrollee profile page
    Comment    Validate Enrollee list with First name contains
    mobile_enrollee_search.Validate Enrollee list with First name contains    ${enrollee_data}[FirstName]

TC34 - C84317 Editing an Enrollee Profile
    [Tags]    Android_test_case_id=84317    iOS_test_case_id=78141
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_98
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    ${enrollee_data}[PrimaryId]
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Click on edit button
    mobile_enrollee.Click on edit button
    Comment    mobile_enrollee.Edit enrollee details
    mobile_enrollee.Edit enrollee details    ${enrollee_data}
    Comment    Validate Enrollee details in Mobile app
    mobile_enrollee.Validate Enrollee details    ${enrollee_data}    @{testdata_list}
    Comment    Validate Enrollee details in database
    mobile_enrollee.Validate Enrollee details in database    ${enrollee_data}

TC35 - C85510 Check Device list and Risklevel selection is displayed until Organization is selected
    [Tags]    Android_test_case_id=85510    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_99
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    mobile_enrollee.Enter Enrollee Details    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    mobile_enrollee.Validate enable status
    mobile_enrollee.Select Organzation for an Enrollee    ${enrollee_data}[Organization]
    mobile_enrollee.Validate control enable status after selecting organization

TC36 - C85534 Search with complete first name
    [Tags]    Android_test_case_id=85534    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_92
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    mobile_enrollee.Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]
    Comment    mobile_enrollee.Validate Enrollee list contains same First name
    mobile_enrollee_search.Validate Enrollee list contains same First name    ${enrollee_data}[FirstName]

TC37 - C85535 Search with first name contains
    [Tags]    Android_test_case_id=85535    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_92
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    mobile_enrollee.Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]
    Comment    Validate Enrollee list with First name contains
    mobile_enrollee_search.Validate Enrollee list with First name contains    ${enrollee_data}[FirstName]

TC38 - C85536 Search with complete last name
    [Tags]    Android_test_case_id=85536    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_95
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    mobile_enrollee.Search Enrollee
    mobile_enrollee.Search Enrollee    \    ${enrollee_data}[LastName]
    Comment    mobile_enrollee.Validate Enrollee list contains same Last name
    mobile_enrollee_search.Validate Enrollee list contains same Last name    ${enrollee_data}[LastName]

TC39 - C85537 Search with last name contains
    [Tags]    Android_test_case_id=85537    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_95
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    mobile_enrollee.Search Enrollee
    mobile_enrollee.Search Enrollee    \    ${enrollee_data}[LastName]
    Comment    mobile_enrollee.Validate Enrollee list with Last name contains
    mobile_enrollee_search.Validate Enrollee list with Last name contains    ${enrollee_data}[LastName]

TC40 - C84298 Enrollee Search
    [Tags]    Android_test_case_id=84298    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_102
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Navigation tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    mobile_enrollee.Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]
    Comment    mobile_enrollee.Validate Enrollee list contains same First name
    mobile_enrollee_search.Validate an enrollee with first name, last name, and primaryid    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]

TC41 - C85520 Search with Assigned and First name
    [Tags]    Android_test_case_id=85520    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_86
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]
    Comment    Validate Searched Enrollees with Both Device Assigned status
    mobile_enrollee_search.Validate Searched Enrollees with Assigned and First Name Combination    ${enrollee_data}[FirstName]

TC42 - C85540 Search with First And Last Name
    [Tags]    Android_test_case_id=85540    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_83
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]
    Comment    Validate Searched Enrollees with Complete PrimaryId
    mobile_enrollee_search.Validate Searched Enrollees with First and Last name    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]

TC43 - C85538 Search_with_complete_Primaryid
    [Tags]    Android_test_case_id=85538    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_82
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    ${enrollee_data}[PrimaryId]
    Comment    Validate Searched Enrollees with Complete PrimaryId
    mobile_enrollee_search.Validate Searched Enrollees with Complete PrimaryId    ${enrollee_data}[PrimaryId]

TC44 - C85539 Search_with_Primary_ID_contains
    [Tags]    Android_test_case_id=85539    iOS_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_81
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    ${enrollee_data}[PrimaryId]
    Comment    Validate Searched Enrollees with Complete PrimaryId
    mobile_enrollee_search.Validate Searched Results with Partial PrimaryId    ${enrollee_data}[PrimaryId]

TC45 - C78148 Verify Dashboard Screen
    [Tags]    Android_test_case_id=11111    iOS_test_case_id=78148
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
    mobile_common.Select Navigation Tab    Dashboard

TC46 - C78149 - Verify Enrollees Screen
    [Tags]    Android_test_case_id=12121    iOS_test_case_id=78149
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
    mobile_common.Select Navigation Tab    Enrollee

TC47 - C78150 - Verify Events Screen
    [Tags]    Android_test_case_id=13131    iOS_test_case_id=78150
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
    mobile_common.Select Navigation Tab    Events

TC48 - C78151 - Verify Inventory Screen
    [Tags]    Android_test_case_id=14141    iOS_test_case_id=78151
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
    mobile_common.Select Navigation Tab    Inventory

TC49 - C78152 - Verify Account Screen
    [Tags]    Android_test_case_id=15151    iOS_test_case_id=78152
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
    mobile_common.Select Navigation Tab    Account

TC50 - C85670 Check Organization and Primary ID cannot be updated
    [Tags]    Android_test_case_id=16161    iOS_test_case_id=85670
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_98
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    ${enrollee_data}[PrimaryId]
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Click on edit button
    mobile_enrollee.Click on edit button
    comment    mobile_enrollee.Validate ORI and Primary ID cannot be updated
    mobile_enrollee.Validate ORI and Primary ID cannot be updated

TC51 - C78179 Profile > Events > Details-View Profile Screen-Cancel
    [Tags]    Android_test_case_id=18818    iOS_test_case_id=78179
    [Setup]    Read TestData From Excel    TC_22    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_22    Enrollee
    Comment    Search an Enrolee
    mobile_enrollee.Search enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    \    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Select First Event from the list
    mobile_events.Select First Event from the list
    Comment    Select Profile Icon
    mobile_enrollee.Select Profile Icon
    Comment    mobile_enrollee.Cancel Enrollee Event Profile
    mobile_enrollee.Cancel Enrollee Event Profile
    Comment    Validate enrollee events page
    mobile_enrollee.Validate Enrollee Events page

TC52 - C78172 Editing a Profile's Picture -Cancel
    [Tags]    iOS_test_case_id=78172    Android_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_15
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    \    \    ${enrollee_data}[PrimaryId]
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[PrimaryId]
    Comment    Click on edit button
    mobile_enrollee.Click on edit button
    comment    Select profile photo icon
    Select Profile Icon

TC53 - C78176 Profile>Click Locate Icon - Cancel
    [Tags]    iOS_test_case_id=78176    Android_test_case_id=12345
    ${login_data}=    Read TestData From Excel    TC_01    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_15    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Cancel the action from enrolleed profile    locate

TC54 - C78175 Profile>Click vibrate Icon - Cancel
    [Tags]    iOS_test_case_id=78175    Android_test_case_id=12345
    ${login_data}=    Read TestData From Excel    TC_01    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_15    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Cancel the action from enrolleed profile    vibrate

TC55 - C78177 Profile>Click buzz Icon - Cancel
    [Tags]    iOS_test_case_id=78177    Android_test_case_id=12345
    ${login_data}=    Read TestData From Excel    TC_01    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_15    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Cancel the action from enrolleed profile    buzz

TC56 - C78178 Profile>Click pursue Icon - Cancel
    [Tags]    iOS_test_case_id=78178    Android_test_case_id=12345
    ${login_data}=    Read TestData From Excel    TC_01    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    TC_15    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Cancel the action from enrolleed profile    pursue

TC57 - C78174 Unassign Enrollee from a Blutag - Cancel
    [Tags]    iOS_test_case_id=78174    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_15    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Assigned Enrollees
    mobile_enrollee.Search Enrollee    fname    \    \    Assigned
    ${enrollee_data}=    Read TestData From Excel    TC_15    Enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Get device pattern from Blutag device name
    Cancel Unassign device and validate    unassign

TC58 - C78170 Enrollee Search - Cancel
    [Tags]    iOS_test_case_id=78170    Android_test_case_id=12345
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_98
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    ${enrollee_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Search Enrollee
    Cancel Search Enrollee and Validate    \    \    ${enrollee_data}[PrimaryId]
