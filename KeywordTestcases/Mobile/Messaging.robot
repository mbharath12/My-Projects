*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C78338 Message-ID(Source)&Time Stamp
    [Tags]    Android_test_case_id=78338
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Generate Enrollink JWT Token    TC_Enrollink_02
    ${enrollee_notificationDate}    ${enrollee_updatedPayload}    POST Enrollee Send a Message to Agent    TC_Enrollink_03
    ${agent_notificationDate}    ${agent_updatedPayload}    POST Agent Send a Message to Enrollee    TC_Enrollink_04
    ${enrollee_notificationText}    Get Data From JSON    ${enrollee_updatedPayload}    notificationText
    ${agent_notificationText}    Get Data From JSON    ${agent_updatedPayload}    notificationText
    ${tcname}=    Set Variable    TC_80
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_80    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Select Chat Box of Enrollee
    mobile_enrollee.Select Chat Box of Enrollee
    Comment    Validate Enrollee Sent Message Source and Timestamp
    mobile_messaging.Validate Enrollee Sent Message Source and Timestamp    ${enrollee_notificationDate}    ${enrollee_notificationText}
    Comment    Validate Agent Sent Message Source and Timestamp
    mobile_messaging.Validate Agent Sent Message Source and Timestamp    ${enrollee_notificationDate}    ${enrollee_notificationText}

TC02 - C78350 Message-Date
    [Tags]    Android_test_case_id=78350
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Generate Enrollink JWT Token    TC_Enrollink_02
    ${notificationDate}    ${updatedPayload}    POST Enrollee Send a Message to Agent    TC_Enrollink_03
    ${tcname}=    Set Variable    TC_80
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_80    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Select Chat Box of Enrollee
    mobile_enrollee.Select Chat Box of Enrollee
    Comment    Validate Message Date
    Validate Message Date    ${notificationDate}

TC03 - C78340 Message-Checkmark icon in the channel
    [Tags]    Android_test_case_id=78340
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_87
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_87    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Select Chat Box of Enrollee
    mobile_enrollee.Select Chat Box of Enrollee
    Comment    Get Message Details
    @{message_details}    mobile_messaging.Get Message Details    ${enrollee_data}[Message]
    Comment    Validate Sent message Check Mark Icon
    mobile_messaging.Validate Sent message Check Mark Icon    ${enrollee_data}[Message]    ${message_details}[0]    ${message_details}[1]    ${enrollee_data}[Checkmark]

TC04 - C78349 Message-Pagination
    [Tags]    Android_test_case_id=78349
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_87
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    ${enrollee_data}=    Read TestData From Excel    TC_87    Enrollee
    Comment    Search Enrollee
    mobile_enrollee.Search Enrollee    ${enrollee_data}[FirstName]    ${enrollee_data}[LastName]    ${enrollee_data}[PrimaryId]    Assigned
    Comment    Select searched enrollee
    mobile_enrollee.Select searched enrollee    ${enrollee_data}[FirstName]
    Comment    Select Chat Box of Enrollee
    mobile_enrollee.Select Chat Box of Enrollee
    Comment    Validate Historical Messages
    mobile_messaging.Validate Historical Messages    ${enrollee_data}[Message]
