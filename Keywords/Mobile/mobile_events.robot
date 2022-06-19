*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Confirm an Event
    [Documentation]    Keyword confims the Open Event..
    ...
    ...
    ...    Exapmle:
    ...    mobile_events.Confirm an Event
    AppiumLibrary.Wait Until Element Is Visible    ${label.event.detail}    ${MEDIUM_WAIT}    Event Details page is not displayed to confirm
    AppiumLibrary.Wait Until Element Is Visible    ${button.events.openevents.confirm}    ${SHORT_WAIT}    Confirm button is not displayed. Please verify if the event is already confirmed.
    AppiumLibrary.Click Element    ${button.events.openevents.confirm}
    AppiumLibrary.Wait Until Element Is Visible    ${button.events.openevents.confirm_event_alert.send}    ${MEDIUM_WAIT}    Confirm Event Alert popup is not visible after waiting ${MEDIUM_WAIT}
    AppiumLibrary.Click Element    ${button.events.openevents.confirm_event_alert.send}
    AppiumLibrary.Wait Until Element Is Visible    ${label.event.detail}    ${MEDIUM_WAIT}    Event Details are not dislpayed after confirming an event.

Validate Event Confirmed
    [Arguments]    ${SNO.ID}
    [Documentation]    Keyword validates the event is confirmed by using ID returned from Database and the text from the Details Page.
    ...
    ...
    ...    Exapmle:
    ...    mobile_events.Validate Event Confirmed ${ID}
    ...    mobile_events.Validate Event Confirmed 145367
    ${ID}    Convert To String    ${SNO.ID}
    ${closed_event_data}    CustomLibrary.Get Event Confirmation Status Database    ${ID}
    Run Keyword If    '${closed_event_data}[0]'=='1'    Log    Event with violationdescription=${closed_event_data}[1], firstname=${closed_event_data}[2], lastname=${closed_event_data}[3] details is Confirmed
    ...    ELSE    mobile_common.Fail and take screenshot    Error: \ Event with violationdescription=${closed_event_data}[1], firstname=${closed_event_data}[2], lastname=${closed_event_data}[3] details is NOT Confirmed
    AppiumLibrary.Wait Until Element Is Visible    ${label.events.openevents.event_confirmed}    ${MEDIUM_WAIT}    Error: \ Event with violationdescription=${closed_event_data}[1], firstname=${closed_event_data}[2], lastname=${closed_event_data}[3] details details is NOT Confirmed
    [Return]    ${closed_event_data}[0]

Select an Open Event
    [Arguments]    ${org}    ${violation_description}=all
    [Documentation]    Selects Open Event from the desired Organization. And checks the selected Open Event Details page is \ displayed. After selecting returns the ID of the selected Open Event.
    ...
    ...    Examples:
    ...    ${ID} mobile_events.Select an Open Event
    ...    1453546 mobile_events.Select an Open Event
    @{open_event_data}    CustomLibrary.Get Open Event Details From Database    ${org}    ${violation_description}
    Should Not Be Empty    ${open_event_data}    No Open Events are present in the Organization.
    FOR    ${data}    IN    @{open_event_data}
        ${violation_description}    Set Variable    ${data}[0]
        ${fname}    Set Variable    ${data}[1]
        ${lname}    Set Variable    ${data}[2]
        ${enrollee}    Set Variable    ${lname},${fname}
        ${ID}    Set Variable    ${data}[3]
        ${list.events.new}    Update Dynamic Values    ${list.events}    ${violation_description}    ${enrollee}
        AppiumExtendedLibrary.Swipe Down    20
        Comment    AppiumExtendedLibrary.Swipe Down To Element    ${list.events.new}    7
        ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.events.new}
        Run Keyword If    '${status}'=='True'    AppiumLibrary.Click Element    ${list.events.new}
        Exit For Loop If    '${status}'=='True'
        AppiumExtendedLibrary.Swipe Up    1
        Comment    AppiumExtendedLibrary.Swipe Up To Element    ${list.events.new}    7
        Log    Event with violationdescription=${violation_description}, firstname=${fname}, lastname=${lname} details is not available in selected Organization.
    END
    AppiumLibrary.Wait Until Element Is Visible    ${label.event.detail}    ${MEDIUM_WAIT}    Selected Event Details page is not displayed.
    Run Keyword If    '${status}'=='False'    mobile_common.Fail and take screenshot    There are no Open Events in the selected Organizations.
    [Return]    ${ID}    ${violation_description}    ${lname}    ${fname}

Add Event Notes
    [Arguments]    ${event_note}
    [Documentation]    Adds notes to an Event.
    ...
    ...    Examples:
    ...    mobile_events.Add Event Notes \ Stop123
    ...    mobile_events.Add Event Notes \ Stop1125
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.add_event_notes}    ${MEDIUM_WAIT}    Add Notes Icon not visible
    AppiumLibrary.Click Element    ${images.enrollee.add_event_notes}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.event.detail.add_event_note}    ${MEDIUM_WAIT}    Add enrollee note input textbox is not visible
    AppiumLibrary.Clear Text    ${textbox.enrollee.event.detail.add_event_note}
    AppiumLibrary.Input Text    ${textbox.enrollee.event.detail.add_event_note}    ${event_note}
    AppiumLibrary.Click Element    ${button.enrollee.event.event_note.save}
    sleep    5s
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.event.detail}    ${MEDIUM_WAIT}    Details page is not visible

Select First Event from the List
    [Documentation]    Select first event from the event list.
    ...
    ...    Examples:
    ...    mobile_events.Select First Event from the List Neil \ Cao
    ...    mobile_events.Select First Event from the List Watson Jhon
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee.events}    ${MEDIUM_WAIT}    Events page is not visible
    AppiumLibrary.Click Element    ${button.enrollee.events}
    sleep    5s
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    AppiumLibrary.Click Element    ${list.enrollee.first_event}
    ...    ELSE    AppiumLibrary.Tap    ${list.first_element}
    Comment    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.first_event}    ${LONG_WAIT}    Events are not visible
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.event.detail}    ${MEDIUM_WAIT}    Detail page is not visible

Validate Event Notes
    [Arguments]    ${event_note}
    ${label.events.events_note.new}    Update Dynamic Value    ${label.events.events_note}    ${event_note}
    AppiumLibrary.Element Should Be Visible    ${label.events.events_note.new}    Created event note is not visible

Select First Event
    AppiumLibrary.Wait Until Element Is Visible    ${lable.inventory.event}    ${MEDIUM_WAIT}    Events page is not visible
    AppiumLibrary.Click Element    ${lable.inventory.event}
    sleep    15s
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    AppiumLibrary.Click Element    ${lable.inventory.first_device}
    ...    ELSE    AppiumLibrary.Tap    ${list.first_element}
    Comment    AppiumLibrary.Wait Until Element Is Visible    ${lable.inventory.first_device}    ${LONG_WAIT}    Events are not visible
    Comment    AppiumLibrary.Click Element    ${lable.inventory.first_device}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.event.detail}    ${MEDIUM_WAIT}    Detail page is not visible

Get the Selected Event Details
    AppiumLibrary.Wait Until Element Is Visible    ${label.events.selectedEvent_firstName}    ${MEDIUM_WAIT}    ${label.events.selectedEvent_firstName} is not visible after waiting ${MEDIUM_WAIT} seconds
    ${events_device_name}=    AppiumLibrary.Get Text    ${label.events.selectedEvent_firstName}
    @{orgs_list}=    Split String    ${events_device_name}    ,
    ${events_profile_firstname}=    Get From list    ${orgs_list}    1
    ${events_profile_lastname}=    Get From list    ${orgs_list}    0
    ${events_device_name}    Create Dictionary    FIRST_NAME=${events_profile_firstname}    LAST_NAME=${events_profile_lastname}
    [Return]    ${events_device_name}

Validate Details
    [Arguments]    ${act_data}    ${enrollee_data}
    Comment    Get Enrollee details from database for given fullname
    Log    ${act_data}
    &{exp_data}=    CustomLibrary.Get Enrollee Profile Details from Database    ${enrollee_data}[FIRST_NAME]    ${enrollee_data}[LAST_NAME]
    Comment    Validate enrollee First Name details
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[FULLNAME]    ${act_data}[FULLNAME]    Enrollee Full Name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[PRIMARYID]    ${act_data}[PRIMARYID]    Enrollee Primary ID details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[ORGANIZATION]    ${act_data}[ORGANIZATION]    Enrollee Organization details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[RISKLEVEL]    ${act_data}[RISKLEVEL]    Enrollee Risk Level details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[TIMEZONE]    ${act_data}[TIMEZONE]    Enrollee Time Zone details doesn't match.

Get the event profile Details
    AppiumLibrary.Wait Until Element Is Visible    ${label.events.selectedEvent_id}    ${MEDIUM_WAIT}    ${label.events.selectedEvent_id} is not visible after waiting ${MEDIUM_WAIT} seconds
    ${enrollee_primaryid}=    AppiumLibrary.Get Text    ${label.events.selectedEvent_id}
    ${enrollee_name}=    AppiumLibrary.Get Text    ${label.events.selectedEvent_name}
    ${organization}=    AppiumLibrary.Get Text    ${label.events.selectedEvent_organization}
    ${risklevel}=    AppiumLibrary.Get Text    ${label.events.selectedEvent_risklevel}
    ${timezone}=    AppiumLibrary.Get Text    ${label.events.selectedEvent_timezone}
    ${events_profile_names}    Create Dictionary    FULLNAME=${enrollee_name}    PRIMARYID=${enrollee_primaryid}    ORGANIZATION=${organization}    RISKLEVEL=${risklevel}    TIMEZONE=${timezone}
    [Return]    ${events_profile_names}

Close an Event
    AppiumLibrary.Wait Until Element Is Visible    ${button.events.close}    ${MEDIUM_WAIT}    Close button is not visible
    AppiumLibrary.Click Element    ${button.events.close}
    AppiumLibrary.Wait Until Element Is Visible    ${button.events.close.send}    ${MEDIUM_WAIT}    Send button is not visible
    AppiumLibrary.Click Element    ${button.events.close.send}
    AppiumLibrary.Wait Until Element Is Visible    ${label.event.detail}    ${MEDIUM_WAIT}    Selected event details page is not displayed.

Validate Event is Closed
    [Arguments]    ${SNO.ID}
    ${ID}    Convert To String    ${SNO.ID}
    ${closed_event_data}    CustomLibrary.get event close status from database    ${ID}
    Run Keyword If    '${closed_event_data}[0]'=='0'    Log    Event with violationdescription=${closed_event_data}[1], firstname=${closed_event_data}[2], lastname=${closed_event_data}[3], ID=${closed_event_data}[4] \ \ details is Closed
    ...    ELSE    mobile_common.Fail and take screenshot    Error: Event with violationdescription=${closed_event_data}[1], firstname=${closed_event_data}[2], lastname=${closed_event_data}[3], ID=${closed_event_data}[4] \ details is NOT Closed

Prerequisite for Open Events
    [Arguments]    ${org}    ${primary_ID}
    @{open_event_data}    CustomLibrary.get open event details for enrollee    ${org}    ${primary_ID}
    Should Not Be Empty    ${open_event_data}    No Open Events are present in the Organization for selected enrollee.

Prerequisite for Confirmed Master Tamper Events
    [Arguments]    ${org}    ${primary_ID}
    ${event}    CustomLibrary.check master tamper event confirmed for enrollee    ${org}    ${primary_ID}
    Run Keyword If    ${event}==None    Fail    No confirmed master tamper event present in the selected Organizations.
    [Return]    ${event}

Select an Event
    [Arguments]    ${violation_description}    ${enrollee_name}
    sleep    3s
    ${list.events.new}    Update Dynamic Values    ${list.events}    ${violation_description}    ${enrollee_name}
    AppiumExtendedLibrary.Swipe Down To Element    ${list.events.new}    7
    ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.events.new}
    Run Keyword If    '${status}'=='True'    AppiumLibrary.Click Element    ${list.events.new}
    ...    ELSE    Log    Expected Master tamper event is not displayed

Select an Open Event other than master tamper
    [Arguments]    ${org}    ${violation_description}=all
    @{open_event_data}    CustomLibrary.Get Open Event Details From Database    ${org}    ${violation_description}
    Should Not Be Empty    ${open_event_data}    No Open Events are present in the Organization.
    FOR    ${data}    IN    @{open_event_data}
        ${violation_description}    Set Variable    ${data}[0]
        Continue For Loop If    '${violation_description}'=='Master Tamper'
        ${fname}    Set Variable    ${data}[1]
        ${lname}    Set Variable    ${data}[2]
        ${enrollee}    Set Variable    ${lname},${fname}
        ${ID}    Set Variable    ${data}[3]
        ${list.events.new}    Update Dynamic Values    ${list.events}    ${violation_description}    ${enrollee}
        AppiumExtendedLibrary.Swipe Down To Element    ${list.events.new}    7
        ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.events.new}
        Run Keyword If    '${status}'=='True'    AppiumLibrary.Click Element    ${list.events.new}
        Exit For Loop If    '${status}'=='True'
        AppiumExtendedLibrary.Swipe Up To Element    ${list.events.new}    7
        Log    Event with violationdescription=${violation_description}, firstname=${fname}, lastname=${lname} details is not available in selected Organization.
    END
    AppiumLibrary.Wait Until Element Is Visible    ${label.event.detail}    ${MEDIUM_WAIT}    Selected Event Details page is not displayed.
    Run Keyword If    '${status}'=='False'    mobile_common.Fail and take screenshot    There are no Open Events in the selected Organizations.
    [Return]    ${ID}    ${violation_description}    ${lname}    ${fname}

Get All Events details from Events List
    AppiumLibrary.Wait Until Element Is Visible    ${lable.inventory.event}    ${MEDIUM_WAIT}    Events page is not visible
    Sleep    5s
    @{event_main_list}    Create List
    @{EmptyList}    Create List
    Set Global Variable    ${event_main_list}    ${EmptyList}
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        Get an Event details from Event List    ${enrollees_count}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_list.no_more_elements}
        Log    ${event_main_list}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Get an Event details from Event List
    [Arguments]    ${enrollees_count}
    FOR    ${value}    IN RANGE    1    ${enrollees_count}+1
        ${value}    Convert To String    ${value}
        ${list.event.name_new}    Update Dynamic Value    ${list.event.name}    ${value}
        ${eventname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.event.name_new}    ${SHORT_WAIT}
        Run Keyword If    ${eventname_status}==True    mobile_events.Get Event Name Text    ${list.event.name_new}
        ${list.event.enrollee_name_new}    Update Dynamic Value    ${list.event.enrollee_name}    ${value}
        ${enrolleename_status}    Run Keyword And Return Status    AppiumLibrary.Page Should Contain Element    ${list.event.enrollee_name_new}
        Run Keyword If    ${enrolleename_status}==True    mobile_events.Get Event Enrollee Name Text    ${list.event.enrollee_name_new}
        ${list.event.deviceSerialNumber_new}    Update Dynamic Value    ${list.event.deviceSerialNumber}    ${value}
        ${deviceSerialNumber_status}    Run Keyword And Return Status    AppiumLibrary.Page Should Contain Element    ${list.event.deviceSerialNumber_new}
        Run Keyword If    ${deviceSerialNumber_status}==True    mobile_events.Get Event Device Serial Number Text    ${list.event.deviceSerialNumber_new}
        ${list.event.startDateProgress_new}    Update Dynamic Value    ${list.event.startDateProgress}    ${value}
        ${startDateProgress_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.event.startDateProgress_new}
        Run Keyword If    '${startDateProgress_status}'=='True'    Get Event Start Date Progress Text    ${list.event.startDateProgress_new}
        log    ${event_name}
        @{event_details_list}    Create List    ${event_name}    ${event_enrollee_name}    ${deviceSerialNumber}    ${startDateProgress}
        Log    ${event_details_list}
        Run Keyword If    '${eventname_status}'=='True' and '${enrolleename_status}'=='True' and '${deviceSerialNumber_status}'=='True' and '${startDateProgress_status}'=='True'    Append To List    ${event_main_list}    ${event_details_list}
    END

Get Event Name Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${event_name}    ${value}
    Log    ${event_name}

Get Event Enrollee Name Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${event_enrollee_name}    ${value}
    Log    ${event_enrollee_name}

Get Event Device Serial Number Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${deviceSerialNumber}    ${value}
    Log    ${deviceSerialNumber}

Get Event Start Date Progress Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${startDateProgress}    ${value}
    Log    ${startDateProgress}

Validate Event List Details from Database
    [Arguments]    ${account_organization}    ${app_enrollee_list}
    Comment    Get all event details event name, enrollee name, deviceSerialNumber , startDateProgress from event list view from database for given organization
    ${db_enrollee_list}    CustomLibrary.Get open event details from database    ${account_organization}
    ${status}=    CustomLibrary.Nested List Compare    ${app_enrollee_list}    ${db_enrollee_list}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Event List details in Mobile app does not match with database list
    ...    ELSE    Log    Event List details in Mobile app match with database list
