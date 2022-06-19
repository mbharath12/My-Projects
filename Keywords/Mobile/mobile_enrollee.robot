*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Create Enrollee
    [Arguments]    ${enrollee_add_details}    ${validate_save_enrollee}=True
    [Documentation]    Keyword creates an enrollee by using Firstname,Lastname,PrimaryId,Organization,Risklevel and Timezone. And check the Enrollee page after save the Enrollee.
    ...
    ...    Exapmles:
    ...    mobile_enrollee.Create Enrollee \ \ \ ${enrollee_data}
    ...
    ...
    ...    &{dict} = Create Dictionary FirstName=fname_Unique LastName=lname_Unique PrimaryId=12345 Oraganization=STOPLLC Timezone=A1CLIENT04 RiskLevel=LevelOne
    ...
    ...    mobile_enrollee.Create Enrollee \ \ \ ${dict}
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    mobile_enrollee.Enter Enrollee Details    ${enrollee_add_details}[FirstName]    ${enrollee_add_details}[LastName]    ${enrollee_add_details}[PrimaryId]
    Run Keyword If    '${enrollee_add_details}[Organization]'!='NA'    mobile_enrollee.Select Organzation for an Enrollee    ${enrollee_add_details}[Organization]
    Run Keyword If    '${enrollee_add_details}[TimeZone]'!='NA'    mobile_enrollee.Select Time Zone for an Enrollee    ${enrollee_add_details}[TimeZone]
    Run Keyword If    '${enrollee_add_details}[RiskLevel]'!='NA'    mobile_enrollee.Select Risk Level for an Enrollee    ${enrollee_add_details}[RiskLevel]
    Run Keyword If    '${enrollee_add_details}[DeviceName]'!='NA'    Assign a Device to an Enrollee    ${enrollee_add_details}[DeviceName]    False
    Comment    Save the enrollee
    AppiumLibrary.Element Should Be Enabled    ${button.addenrolle.save}
    sleep    2s
    AppiumLibrary.Tap    ${button.addenrolle.save}
    Comment    Don't check the enrollee is saved
    Return From Keyword If    ${validate_save_enrollee}==False
    Comment    Check the enrollee is saved
    sleep    3s
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee}    ${LONG_WAIT}    Not redirected to Enrollees Page after save an enrollee
    sleep    7s

Select Time Zone for an Enrollee
    [Arguments]    ${timezone_value}
    [Documentation]    Selects TimeZone value and checks the Enrollee page is displayed.
    ...
    ...    Examples:
    ...    mobile_enrollee.Select Time Zone for an Enrollee ${enrollee_add_details}[TimeZone]
    ...
    ...    mobile_enrollee.Select Time Zone for an Enrollee US/Mountain
    Comment    Check TimeZone select button is display
    AppiumLibrary.Tap    ${button.enrollee.timezone.select}
    Comment    Wait for Organisation list to be displayed
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Time Zones list is not displayed afer clicking select Time Zone button
    ${list.enrollee.timezone.new}    mobile_common.Update Dynamic Value    ${list.enrollee.timezone}    ${timezone_value}
    AppiumLibrary.Element Should Be Visible    ${list.enrollee.timezone.new}    ${timezone_value} is not displayed under the list of Time Zones
    AppiumLibrary.Tap    ${list.enrollee.timezone.new}
    sleep    3s
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.first_name}    ${LONG_WAIT}    Not redirected to Add Enrollee page after selecting Time Zone ${timezone_value}

Select Risk Level for an Enrollee
    [Arguments]    ${risklevel_value}
    [Documentation]    Selects RiskLevel value and check the Enrollee page is displayed.
    ...
    ...    Examples:
    ...    mobile_enrollee.Select Risk Level for an Enrollee ${enrollee_add_details}[RiskLevel]
    ...
    ...    mobile_enrollee.Select Risk Level for an Enrollee Level One
    Comment    Check RiskLevel select button is display
    AppiumLibrary.Tap    ${button.enrollee.risk_level.select}
    Comment    Wait for Organisation list to be displayed
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Risk Level list is not displayed afer clicking select Risk Level button
    ${list.enrollee.risklevel.new}    mobile_common.Update Dynamic Value    ${list.enrollee.risklevel}    ${risklevel_value}
    AppiumLibrary.Element Should Be Visible    ${list.enrollee.risklevel.new}    ${risklevel_value} is not displayed under the list of Risk Level
    AppiumLibrary.Tap    ${list.enrollee.risklevel.new}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.first_name}    ${LONG_WAIT}    Not redirected to Add Enrollee page after selecting Risk Level ${risklevel_value}

Validate Enrollee details
    [Arguments]    ${validate_data}    @{testdata_list}
    [Documentation]    Keyword validate created enrollee details by using Firstname,Lastname,PrimaryId,Organization,RiskLevel,TimeZone. And check the details page is displayed.
    ...
    ...
    ...    Exapmle:
    ...    mobile_enrollee.Validate Enrollee details ${enrollee_data}
    ...
    ...    &{dict} = Create Dictionary FirstName=fname_Unique LastName=lname_Unique PrimaryId=12345 Oraganization=STOPLLC Timezone=A1CLIENT04 RiskLevel=LevelOne
    ...
    ...    mobile_enrollee.Validate Enrollee details ${dict}
    Run Keyword If    '${PLATFORM_NAME}'=='iOS'    AppiumLibrary.Tap    ${list.first_enrolle}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Select searched enrollee with fullname    ${validate_data}
    FOR    ${key}    IN    @{testdata_list}
        ${list.enrollee.profiledts.new}    mobile_common.Update Dynamic Value    ${list.enrollee.profiledts}    ${validate_data}[${key}]
        Run Keyword And Continue On Failure    AppiumLibrary.Element Should Be Visible    ${list.enrollee.profiledts.new}    Enrollee details are not displayed in search results. Validating ${validate_data}[${key}] details. ${key} is not displayed as exepceted. Expected to display: ${validate_data}[${key}]
    END

Upload Profile photo
    [Documentation]    Keyword Uplaods Profile photo and check an enrollee page is displayed.
    AppiumLibrary.Wait Until Element Is Visible    ${image.enrollee.profilephoto}    ${LONG_WAIT}
    AppiumLibrary.Tap    ${image.enrollee.profilephoto}
    AppiumLibrary.Wait Until Element Is Visible    ${image.enrollee.profilephoto.captureimage}    ${LONG_WAIT}
    AppiumLibrary.Tap    ${image.enrollee.profilephoto.captureimage}
    AppiumLibrary.Wait Until Element Is Visible    ${image.enrolee.profilephoto.capture.okimage}    ${LONG_WAIT}
    AppiumLibrary.Tap    ${image.enrolee.profilephoto.capture.okimage}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.addenrollee}    ${LONG_WAIT}    Add Enrollee page is not displayed after upload profile photo.

Click Add Enrollee Button
    [Documentation]    keyword is used to click an Add enrollee Button and check Enrollees page.
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee.add}    ${LONG_WAIT}
    AppiumLibrary.Tap    ${button.enrollee.add}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.addenrollee}    ${LONG_WAIT}    Not redirected to Add Enrollee Page after click on add enrollee button

Enter Enrollee Details
    [Arguments]    ${first_name}    ${last_name}    ${primary_id}
    [Documentation]    Keyword used to Enter Enrollee Details as FirstName, LastName and PrimaryId into text fields.
    ...
    ...    Example:
    ...    &{dict} = Create Dictionary FirstName=fname_Unique LastName=lname_Unique PrimaryId=12345
    ...
    ...    mobile_enrollee.Create Enrollee ${dict}[FirstName] ${dict}[LastName] ${dict}[PrimaryId]
    Comment    Check first name control is displayed
    Run Keyword If    '${first_name}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.first_name}    ${first_name}
    Run Keyword If    '${last_name}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.last_name}    ${last_name}
    Run Keyword If    '${primary_id}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.primary_id}    ${primary_id}

Select Organzation for an Enrollee
    [Arguments]    ${organization_value}
    [Documentation]    This Keyword Selects Organization value and check the Enrollee page.
    ...
    ...    Examples:
    ...    mobile_enrollee.Select Organzation for an Enrollee \ \ \ ${enrollee_add_details}[Organization]
    ...
    ...    mobile_enrollee.Select Organzation for an Enrollee STOPLLC
    Comment    Check Organizations select button is display
    AppiumLibrary.Tap    ${button.enrollee.org.select}
    Comment    Wait for Organizations list to be displayed
    Sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Organizations list is not displayed afer clicking select organization button
    ${list.enrollee.org.new}    mobile_common.Update Dynamic Value    ${list.enrollee.org}    ${organization_value}
    AppiumLibrary.Element Should Be Visible    ${list.enrollee.org.new}    ${organization_value} is not displayed under the list of Organizations
    AppiumLibrary.Tap    ${list.enrollee.org.new}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.first_name}    ${LONG_WAIT}    Not redirected to Add Enrollee page after selecting organization ${organization_value}

Search Enrollee
    [Arguments]    ${first_name}=NA    ${last_name}=NA    ${primary_id}=NA    ${device}=Both
    [Documentation]    This keyword used to Search for an Enrollee using Firstname, Lastname, and PrimaryId and check the Enrollee page is displayed.
    ...
    ...    Examples:
    ...    &{dict} = Create Dictionary FirstName=fname_Unique LastName=lname_Unique PrimaryId=12345
    ...    mobile_enrollee.Create Enrollee ${dict}[FirstName] ${dict}[LastName] ${dict}[PrimaryId]
    ...
    ...    Search with First Name and Both : mobile_enrollee.Search Enrollee ${dict}[FirstName]
    ...    Search with Last Name and Assigned : mobile_enrollee.Search Enrollee NA ${dict}[LastName] NA Assigned
    ...    Search with PrimaryID and Both :mobile_enrollee.Search Enrollee NA NA ${dict}[PrimaryId]
    ...    Search with First Name,LastName, PrimaryID and Both : mobile_enrollee.Search Enrollee ${dict}[FirstName] ${dict}[LastName] ${dict}[PrimaryId]
    sleep    2s
    AppiumLibrary.Element Should Be Visible    ${label.enrollee}    Enrollees page is not displayed after waiting for ${LONG_WAIT}
    AppiumLibrary.Tap    ${button.enrollees.searchicon}
    sleep    10s
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.search.first_name}    ${LONG_WAIT}    firstname textbox is not displayed after clicking on search icon
    Clear Enrollee Search Fields
    Run Keyword If    '${first_name}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.search.first_name}    ${first_name}
    Run Keyword If    '${last_name}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.search.last_name}    ${last_name}
    Run Keyword If    '${primary_id}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.search.primary_id}    ${primary_id}
    sleep    2s
    AppiumLibrary.Click Element    ${button.enrollee.${device}}
    AppiumLibrary.Tap    ${button.searchicon.searchbutton}
    sleep    2s
    ${label.pagetitle.new}    mobile_common.Update Dynamic Value    ${label.pagetitle}    Enrollee
    AppiumLibrary.Wait Until Element Is Visible    ${label.pagetitle.new}    ${LONG_WAIT}    Enrollee Page is not displayed after click on search icon in Enrollees page

Clear Enrollee Search Fields
    [Documentation]    Clear First Name, Last Name and Primary ID text fields before entering search data
    ...
    ...    Usage:
    ...    mobile_enrollee.Clear Enrollee Search Fields
    AppiumLibrary.Clear Text    ${textbox.enrollee.search.first_name}
    AppiumLibrary.Clear Text    ${textbox.enrollee.search.last_name}
    AppiumLibrary.Clear Text    ${textbox.enrollee.search.primary_id}

Navigate to Edit Enrollee page
    [Arguments]    ${first_name}    ${last_name}    ${primary_id}    ${search_type}
    [Documentation]    It's Navigate to Unassigned enrollee details page to do edit the enrollee
    ...
    ...    Examples:
    ...    mobile_enrollee.Navigate to Edit Enrollee page ${enrollee_data}[FirstName] ${enrollee_data}[LastName] ${enrollee_data}[PrimaryId] Unassigned
    ...
    ...
    ...    mobile_enrollee.Navigate to Edit Enrollee page Steve Johnson 124633 Unassigned
    mobile_common.Select Navigation Tab    Enrollee
    comment    Search created Enrollee
    mobile_enrollee.Search Enrollee    ${first_name}    ${last_name}    ${primary_id}    ${search_type}
    mobile_enrollee.Select searched enrollee    ${first_name}
    mobile_enrollee.Click on edit button

Assign a Device to an Enrollee
    [Arguments]    ${enrollee_data}    ${update_enrollee}=True
    [Documentation]    It assigns a device to an enrollee.
    ...
    ...    Examples:
    ...    mobile_enrollee.Assign a Device to an Enrollee ${enrollee_data}[DeviceName]
    ...
    ...    mobile_enrollee.Assign a Device to an Enrollee 12-23435
    ...    mobile_enrollee.Assign a Device to an Enrollee \ BLUtagv7
    ...
    ...    mobile_enrollee.Assign a Device to an Enrollee \ BLUtagv8
    comment    Click on Device Assignment
    AppiumLibrary.Tap    ${button.editenrolle.device_assignment}
    AppiumLibrary.Wait Until Element Is Visible    ${label.assign_device.selected_device}    ${LONG_WAIT}    Selected Device label is not visible after waiting ${SHORT_WAIT} seconds
    ${device_pattern}    mobile_enrollee.Get device pattern    ${enrollee_data}
    ${list.assign_device.new}    mobile_common.Update Dynamic Value    ${list.assign_device}    ${device_pattern}
    Swipe Down To Element    ${list.assign_device.new}    10
    AppiumLibrary.Wait Until Element Is Visible    ${list.assign_device.new}    ${SHORT_WAIT}    BLUtag devices are not displayed after waiting ${SHORT_WAIT}
    sleep    5s
    AppiumLibrary.Click Element    ${list.assign_device.new}
    sleep    5s
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.dashboard.enrollees.assigned_count}
    ...    ELSE    Get Label Text    ${label.dashboard.enrollees.assigned_count}
    ${device_text}    set variable    ${text}
    AppiumLibrary.Element Should Be Visible    ${button.editenrollee.set}    Set button is not displayed in Device Assignment page after waiting ${SHORT_WAIT}
    AppiumLibrary.Tap    ${button.editenrollee.set}
    sleep    5s
    Run Keyword If    '${update_enrollee}'=='True'    mobile_enrollee.Update enrollee
    [Return]    ${device_text}

Validate assign device
    [Arguments]    ${device_text}
    [Documentation]    It takes assigned device text as an argument and validate the device assigned.
    ...
    ...    Examples:
    ...    mobile_enrollee.Validate assign device ${assigned_device_text}
    ...
    ...    mobile_enrollee.Validate assign device 12-43455
    AppiumLibrary.Wait Until Element Is Visible    ${label.assigned_device}    ${SHORT_WAIT}
    Run Keyword And Continue On Failure    AppiumLibrary.Element Text Should Be    ${label.assigned_device}    ${device_text}

Click on edit button
    [Documentation]    It clicks on edit button in unassigned enrollee profile page.
    ...
    ...    Examples:
    ...    mobile_enrollee.Click on edit button
    sleep    5s
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee.edit}    ${MEDIUM_WAIT}
    AppiumLibrary.Tap    ${button.enrollee.edit}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.editenrollee}    ${MEDIUM_WAIT}    Edit Enrollee page is not displayed after clicking on edit button in profile section.

Update enrollee
    [Documentation]    Keyword uses to update an enrollee and checks the Profile is displayed.
    ...
    ...    Examples:
    ...    mobile_enrollee.Update the Assigned device
    sleep    1s
    AppiumLibrary.Wait Until Element Is Visible    ${button.editenrollee.update}    ${LONG_WAIT}    Update button is not displayed in Edit Enrollee page after waiting ${LONG_WAIT}
    AppiumLibrary.Tap    ${button.editenrollee.update}
    sleep    5s
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${LONG_WAIT}    Profile is not displayed in Profile page after waiting ${LONG_WAIT}

Get device pattern
    [Arguments]    ${device_name}
    [Documentation]    It returns the device pattern to add device to an enrollee.
    ...
    ...    Examples:
    ...    &{dict} DeviceName = BLUtagv7 DeviceName=BLUtagv8
    ...
    ...    mobile_enrollee.Get device pattern ${dict}
    ...
    ...    mobile_enrollee.Get device pattern ${dict}[DeviceName]
    Run Keyword If    '${device_name}'=='BLUtagv7'    Return From Keyword    12-
    Run Keyword If    '${device_name}'=='BLUtagv8'    Return From Keyword    22-
    Run Keyword If    '${device_name}'!='BLUtagv7' and '${device_name}'!='BLUtagv8'    Return From Keyword    ${device_name}-
    [Return]    ${device_pattern}

Validate Enrollee details in database
    [Arguments]    ${exp_data}
    Comment    Get Enrollee details from database for given primary id
    Log    ${exp_data}[PrimaryId]
    &{act_data}=    CustomLibrary.Get Enrollee Details from Database    ${exp_data}[PrimaryId]
    Comment    Validate enrollee First Name details
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[FirstName]    ${act_data}[FIRSTNAME]    Enrollee First Name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[LastName]    ${act_data}[LASTNAME]    Enrollee Last Name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[PrimaryId]    ${act_data}[PRIMARYID]    Enrollee Primary ID details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[Organization]    ${act_data}[ORGANIZATION]    Enrollee Organization details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[RiskLevel]    ${act_data}[RISKLEVEL]    Enrollee Risk Level details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[TimeZone]    ${act_data}[TIMEZONE]    Enrollee Time Zone details doesn't match.

Validate Assigned Device in database
    [Arguments]    ${device_text}    ${enrollee_primary_id}
    Comment    Get Enrollee details from database for given primary id
    &{act_data}=    CustomLibrary.Get Enrollee Assigned Device Details From Database    ${enrollee_primary_id}
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${device_text}    ${act_data}[ASSIGNEDDEVICE]    Enrollee Assigned device details doesn't match.

Select searched enrollee
    [Arguments]    ${enrollee_data}
    ${list.enrollee.profiledts.new}    mobile_common.Update Dynamic Value    ${list.enrollee.profiledts}    ${enrollee_data}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.profiledts.new}    ${LONG_WAIT}    Name of an Enrollee is not displayed
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    AppiumLibrary.Tap    ${list.enrollee.profiledts.new}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘iOS’    AppiumLibrary.Tap    ${list.first_element}

Unassign An Enrollee
    [Arguments]    ${unassign_reason}    ${device_pattern}
    [Documentation]    It unassigns a device from an enrollee with a reason. It takes unassign reason and device pattern as arguments.
    ...
    ...    Examples:
    ...    mobile_enrollee.Unassign an Enrollee Court Order \ ${device_pattern}
    ...
    ...    mobile_enrollee.Unassign an Enrollee Medical \ ${device_pattern}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    select unassign reason android    ${device_pattern}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘iOS’    AppiumLibrary.Tap    ${list.first_element}
    AppiumLibrary.Click Element    ${button.enollee.profile.unassign}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Unassign a reason in android    ${unassign_reason}
    AppiumLibrary.Click Element    ${button.enollee.profile.reason.unassign}
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${MEDIUM_WAIT}    Profile of Enrollee is not visible after waiting ${MEDIUM_WAIT}
    [Return]    ${enrollee_details}

Get Enrollee Details to Unassign
    [Arguments]    ${device_pattern}
    [Documentation]    Gets the details from the enrollee profile. Takes device patter as argment
    ...
    ...    Examples:
    ...    mobile_enrollee.Get Enrollee details to Unassign 22-
    ...
    ...    mobile_enrollee.Get Enrollee details to Unassign 12-
    ${list.enollee.device_id.new}    Update Dynamic Value    ${list.enollee.device_id}    ${device_pattern}
    ${device_name}=    AppiumLibrary.Get text    ${list.enollee.device_id.new}
    ${list.enollee.enrollee_name.new}    Update Dynamic Value    ${list.enollee.enrollee_name}    ${device_pattern}
    ${enrolleename}=    AppiumLibrary.Get text    ${list.enollee.enrollee_name.new}
    ${list.enollee.primary_id.new}    Update Dynamic Value    ${list.enollee.primary_id}    ${device_pattern}
    ${primaryid}=    AppiumLibrary.Get text    ${list.enollee.primary_id.new}
    ${enrollee_data}    Create Dictionary    DEVICENAME=${device_name}    ENROLLEENAME=${enrolleename}    PRIMARYID=${primaryid}
    [Return]    ${enrollee_data}

Validate Chat History Page
    [Documentation]    Keyword validate chat history page title.
    ...
    ...
    ...    Exapmle:
    ...    mobile_enrollee.Validate Chat History Page
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.chat}    ${MEDIUM_WAIT}    Chat icon is not visible
    AppiumLibrary.Click Element    ${button.enollee.profile.chat}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.profile.chats.messaging}    ${MEDIUM_WAIT}    Messaging label is not visible.

Enter Message in Chats Textfield
    [Arguments]    ${Input_text}
    mobile_common.Input Text    ${textbox.enrolle.profile.chat}    ${Input_text}
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.chat.send}    ${MEDIUM_WAIT}    Send button is not visible.
    AppiumLibrary.Tap    ${button.enollee.profile.chat.send}
    AppiumLibrary.Page Should Not Contain Element    ${button.enollee.profile.chat.send}

Select Profile Icon
    AppiumLibrary.Wait Until Element Is Visible    ${button.events.detail.profile}    ${MEDIUM_WAIT}    Profile icon is not visible
    AppiumLibrary.Click Element    ${button.events.detail.profile}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.editenrollee}    ${MEDIUM_WAIT}    Profile page is not visible

Validate Unassigned Enrollee
    Comment    validate enrolle is unassigned
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.assign}    ${LONG_WAIT}    Assign button is not visible after waiting ${LONG_WAIT}

Select Map in profile details
    AppiumLibrary.Wait Until Element Is Visible    ${label.profile.map}    ${SHORT_WAIT}    MAP tab is not displayed after waiting ${SHORT_WAIT} seconds
    AppiumLibrary.Click Element    ${label.profile.map}
    AppiumLibrary.Wait Until Element Is Visible    ${images.directions_icon}    ${MEDIUM_WAIT}    Directions icon is not displayed after waiting ${MEDIUM_WAIT} seconds
    sleep    2s
    AppiumLibrary.Click Element    ${images.directions_icon}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.maps.start}    ${LONG_WAIT}    Start icon is not displayed after waiting ${LONG_WAIT} seconds. Please see the screen shot.
    AppiumLibrary.Tap    ${images.enrollee.maps.start}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.sound_icon}    ${LONG_WAIT}    Sound icon is not visible after waiting ${LONG_WAIT} seconds

Open caseload profile
    AppiumLibrary.Wait Until Element Is Visible    ${images.dashboard.profile}    ${LONG_WAIT}    Pursue is not diplayed after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${images.dashboard.profile}

Validate Map screen
    AppiumLibrary.Wait Until Element Is Visible    ${label.profile.map}    ${SHORT_WAIT}    MAP tab is not displayed after waiting ${SHORT_WAIT} seconds
    sleep    3s
    AppiumLibrary.Click Element    ${label.profile.map}
    AppiumLibrary.Wait Until Element Is Visible    ${list.locations.list}    ${LONG_WAIT}
    ${count}    Get Matching Xpath Count    ${list.map.location_icon}
    ${images.map.location_icon.new}    Update Dynamic Value    ${images.map.location_icon}    ${count}
    AppiumLibrary.Click Element    ${images.map.location_icon.new}
    AppiumLibrary.Page Should Contain Element    ${images.map.toast_message}    Toast message is not displayed after waiting ${SHORT_WAIT} sec

Validate Map screen from events
    AppiumLibrary.Wait Until Element Is Visible    ${label.profile.map}    ${SHORT_WAIT}    MAP tab is not displayed after waiting ${SHORT_WAIT} seconds
    sleep    2s
    AppiumLibrary.Click Element    ${label.profile.map}
    AppiumLibrary.Wait Until Element Is Visible    ${images.map.events.location_icon}    ${LONG_WAIT}
    AppiumLibrary.Click Element    ${images.map.events.location_icon}
    AppiumLibrary.Page Should Contain Element    ${images.map.toast_message}    Toast message is not displayed after waiting ${SHORT_WAIT} sec

Vaidate Organizations list
    [Arguments]    ${test_data_orgs}
    Comment    Check Organizations select button is display
    AppiumLibrary.Tap    ${button.enrollee.org.select}
    Comment    Wait for Organizations list to be displayed
    Sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Organizations list is not displayed afer clicking select organization button
    ${organizations}    Get Matching Xpath Count    ${list.add_enrollee.organizations}
    FOR    ${org_number}    IN RANGE    1    ${organizations}+1
        ${org_number}    Convert To String    ${org_number}
        ${label.create_enrollee.organization.new}    Update Dynamic Value    ${label.create_enrollee.organization}    ${org_number}
        ${org_name}    AppiumLibrary.Get Text    ${label.create_enrollee.organization.new}
        Run Keyword And Continue On Failure    Should Contain    ${test_data_orgs}    ${org_name}    ${org_name} is not displayed in the organization list
    END
    AppiumLibrary.Wait Until Element Is Visible    ${button.schemas.cancel}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.schemas.cancel}

Validate Unassigned Devices
    [Arguments]    ${org}
    comment    Click on Device Assignment
    AppiumLibrary.Tap    ${button.editenrolle.device_assignment}
    AppiumLibrary.Wait Until Element Is Visible    ${label.assign_device.selected_device}    ${LONG_WAIT}    Selected Device label is not visible after waiting ${SHORT_WAIT} seconds
    sleep    5s
    @{devices_main_list}    Create List
    Set Global Variable    ${devices_main_list}
    ${db_unassigned_count}    CustomLibrary.Get Unassigned Devices From Database    ${org}
    FOR    ${device_id}    IN RANGE    1    4
        ${devices_count}    Get Last value from list    ${list.add_enrollee.unassigned_devices}    ${label.create_enrollee.device}
        ${last_text_before_scroll}    Set variable    ${text}
        Get text from the app list    ${devices_count}    ${db_unassigned_count}    ${label.create_enrollee.device}    ${devices_main_list}
        AppiumExtendedLibrary.swipe down    1
        ${devices_count}    Get Last value from list    ${list.add_enrollee.unassigned_devices}    ${label.create_enrollee.device}
        ${last_text_after_scroll}    Set variable    ${text}
        Run Keyword If    ‘${last_text_before_scroll}’==‘${last_text_after_scroll}’    Exit For Loop
    END
    log    ${devices_main_list}
    ${status}    CustomLibrary.Nested List Compare    ${devices_main_list}    ${db_unassigned_count}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Unassigned list details in Mobile app does not match with database list
    ...    ELSE    Log    Unassigned List details in Mobile app match with database list

Validate Time Zone List
    Comment    Check TimeZone select button is display
    AppiumLibrary.Tap    ${button.enrollee.timezone.select}
    Comment    Wait for Organisation list to be displayed
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Time Zones list is not displayed afer clicking select Time Zone button
    @{time_zone_main_list}    Create List
    Set Global Variable    ${time_zone_main_list}
    ${time_zone_values_db}    CustomLibrary.Get Time Zone List From Database
    FOR    ${device_id}    IN RANGE    1    2
        ${time_zones_count}    Get Last value from list    ${list.add_enrollee.time_zone}    ${label.create_enrollee.time_zone}
        Get text from the app list    ${time_zones_count}    ${time_zone_values_db}    ${label.create_enrollee.time_zone}    ${time_zone_main_list}
        AppiumExtendedLibrary.Swipe Down    4
        Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Last value from list    ${list.add_enrollee.time_zone}    ${label.create_enrollee.time_zone}
        Run Keyword If    '${device_id}'=='2'    Exit For Loop
    END
    log    ${time_zone_main_list}
    ${status}    CustomLibrary.Nested List Compare    ${time_zone_main_list}    ${time_zone_values_db}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Time Zone list details in Mobile app does not match with database list
    ...    ELSE    Log    Time Zone List details in Mobile app match with database list

Get text from the app list
    [Arguments]    ${list_count}    ${db_values}    ${locator}    ${main_list}
    FOR    ${list_count_value}    IN RANGE    1    ${list_count}+1
        ${list_count_value}    Convert To String    ${list_count_value}
        ${locator_new}    Update Dynamic Value    ${locator}    ${list_count_value}
        Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${locator_new}
        ...    ELSE    Get Label Text    ${locator_new}
        log    ${text}
        Append To List    ${main_list}    ${text}
    END

Click on Unassign button
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.unassign}    ${MEDIUM_WAIT}    Unassign button is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.enollee.profile.unassign}
    AppiumLibrary.Wait Until Element Is Visible    ${spinner.enrollee.profile.reason.unassign}    ${LONG_WAIT}    Drop down is not visible after waiting ${LONG_WAIT}

Update a Reason to unassign
    [Arguments]    ${reason}
    AppiumLibrary.Click Element    ${spinner.enrollee.profile.reason.unassign}
    ${list.enollee.profile.unassigned_reason.new}    Update Dynamic Value    ${list.enollee.profile.unassigned_reason}    ${reason}
    AppiumExtendedLibrary.Swipe Down To Element    ${list.enollee.profile.unassigned_reason.new}    7
    AppiumLibrary.Click Element    ${list.enollee.profile.unassigned_reason.new}
    ${reason_text}    AppiumLibrary.Get Text    ${spinner.enrollee.profile.reason.unassign}
    [Return]    ${reason_text}

Validate Device Change Reason
    [Arguments]    ${reason_actual_text}    ${reason_expected_text}
    Should Be Equal As Strings    ${reason_actual_text}    ${reason_expected_text}
    AppiumLibrary.Wait Until Element Is Visible    ${button.schemas.cancel}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.schemas.cancel}

Get Last value from list
    [Arguments]    ${locator1}    ${locator2}
    ${xpath_count}    Get Matching Xpath Count    ${locator1}
    ${xpath_count}    Convert To String    ${xpath_count}
    ${locator_new}    Update Dynamic Value    ${locator2}    ${xpath_count}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${locator_new}
    ...    ELSE    Get Label Text    ${locator_new}
    [Return]    ${xpath_count}

Navigate to Previous Page
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee_profile.back_arrow}    ${SHORT_WAIT}    Back Arrow button is not visible.
    AppiumLibrary.Click Element    ${button.enrollee_profile.back_arrow}

Validate Sent Message in Chat Box
    [Arguments]    ${Message}
    ${images.enrollee.profile.chat.new}    Update Dynamic Value    ${images.enrollee.profile.chat}    ${Message}
    Run Keyword And Continue On Failure    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.profile.chat.new}    ${SHORT_WAIT}    Message is not displayed in chat box.

Edit Text Message in Textfield
    [Arguments]    ${Input_text}
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.chat}    ${MEDIUM_WAIT}    Chat button is not visible.
    AppiumLibrary.Click Element    ${button.enollee.profile.chat}
    sleep    2s
    mobile_common.Input Text    ${textbox.enrolle.profile.chat}    ${Input_text}
    AppiumLibrary.Clear Text    ${textbox.enrolle.profile.chat}
    AppiumLibrary.Element Should Not Contain Text    ${textbox.enrolle.profile.chat}    ${Input_text}

Validate Sent Message in Database
    [Arguments]    ${primary_id}    ${message}
    @{database_message}    CustomLibrary.Get Sent Message Details From Database    ${primary_id}    ${message}
    Should Not Be Empty    ${database_message}    Enrollee didnot recieved message sent by agent.
    Should Be Equal As Strings    ${database_message}[0]    ${message}    Sent message is not matching with updated database message
    [Return]    ${message}

Send Message to Enrollee
    [Arguments]    ${Input_text}
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.chat}    ${MEDIUM_WAIT}    Chat button is not visible.
    AppiumLibrary.Click Element    ${button.enollee.profile.chat}
    sleep    2s
    mobile_common.Input Text    ${textbox.enrolle.profile.chat}    ${Input_text}
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.chat.send}    ${MEDIUM_WAIT}    Send button is not visible.
    AppiumLibrary.Tap    ${button.enollee.profile.chat.send}

Get the details from Enrollee editor page
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.first_name}    ${MEDIUM_WAIT}    ${textbox.enrollee.first_name} is not visible after waiting ${MEDIUM_WAIT} seconds
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${textbox.enrollee.first_name}
    ...    ELSE    Get Label Text    ${textbox.enrollee.first_name}
    ${enrollee_editpage_firstname}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${textbox.enrollee.last_name}
    ...    ELSE    Get Label Text    ${textbox.enrollee.last_name}
    ${enrollee_editpage_lastname}=    Set Variable    ${text}
    ${enrollee_editpage_fullname}=    setvariable    ${enrollee_editpage_lastname}, ${enrollee_editpage_firstname}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${textbox.enrollee.primary_id}
    ...    ELSE    Get Label Text    ${textbox.enrollee.primary_id}
    ${enrollee_editpage_primaryid}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${button.enrollee.org.select}
    ...    ELSE    Get Label Text    ${button.enrollee.org.select}
    ${enrollee_editpage_organization}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${button.enrollee.timezone.select}
    ...    ELSE    Get Label Text    ${button.enrollee.timezone.select}
    ${enrollee_editpage_timezone}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${button.enrollee.risk_level.select}
    ...    ELSE    Get Label Text    ${button.enrollee.risk_level.select}
    ${enrollee_editpage_risklevel}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${button.editenrolle.device_assignment}
    ...    ELSE    Get Label Text    ${button.editenrolle.device_assignment}
    ${enrollee_editpage_deviceassignment}=    Set Variable    ${text}
    ${enrollee_Editorpage_data}    Create Dictionary    FIRSTNAME=${enrollee_editpage_firstname}    LASTNAME=${enrollee_editpage_lastname}    PRIMARYID=${enrollee_editpage_primaryid}    ORGANIZATIONNAME=${enrollee_editpage_organization}    TIMEZONE=${enrollee_editpage_timezone}    RISKLEVEL=${enrollee_editpage_risklevel}    DEVICE_STATUS=${enrollee_editpage_deviceassignment}    FULLNAME=${enrollee_editpage_fullname}
    [Return]    ${enrollee_Editorpage_data}

Get enrollee profile details
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${MEDIUM_WAIT}    PROFILE lable is not visible after waiting ${MEDIUM_WAIT} seconds
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_Name}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_Name}
    ${enrollee_fullname}=    Set Variable    ${text}
    @{orgslist}=    Split String    ${enrollee_fullname}    ,
    ${enrollee_firstname}=    Get From list    ${orgslist}    1
    Comment    ${enrollee_firstname}=    RemoveString    ${firstname}
    ${enrollee_lastname}=    Get From list    ${orgslist}    0
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_primaryid}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_primaryid}
    ${enrollee_primaryid}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_organization}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_organization}
    ${enrollee_organization}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_timezone}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_timezone}
    ${enrollee_timezone}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_risklevel}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_risklevel}
    ${enrollee_risklevel}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_deviceid}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_deviceid}
    ${enrollee_deviceid}=    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label.enrollee.profile_contactdate}
    ...    ELSE    Get Label Text    ${label.enrollee.profile_contactdate}
    ${enrollee_contactdate}=    Set Variable    ${text}
    ${enrollee_Profilepage_data}    Create Dictionary    FIRSTNAME=${enrollee_firstname}    LASTNAME=${enrollee_lastname}    PRIMARYID=${enrollee_primaryid}    ORGANIZATIONNAME=${enrollee_organization}    TIMEZONE=${enrollee_timezone}    RISKLEVEL=${enrollee_risklevel}    DEVICE_ID=${enrollee_deviceid}    CONTACT_DATE=${enrollee_contactdate}    FULLNAME=${enrollee_fullname}
    [Return]    ${enrollee_Profilepage_data}

Validate enrollee editor page details
    [Arguments]    ${act_data}    ${exp_data}
    Comment    Validate enrollee details
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[FULLNAME]    ${act_data}[FULLNAME]    Fullname details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[PRIMARYID]    ${act_data}[PRIMARYID]    Primaryid details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[TIMEZONE]    ${act_data}[TIMEZONE]    Timezone details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[RISKLEVEL]    ${act_data}[RISKLEVEL]    Risklevel details doesn't match.

Validate Case Notes
    [Arguments]    ${PrimaryId}    ${Organization}
    Comment    Wait for Organisation list to be displayed
    sleep    20s
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.casenotes_block}    ${MEDIUM_WAIT}    Casenotes list is not displayed
    @{casenote_list}    Create List
    Set Global Variable    ${casenote_list}
    ${casenote_values_db}    CustomLibrary.get_enrollee_casenotes_details_from_database    ${PrimaryId}    ${Organization}
    FOR    ${device_id}    IN RANGE    1    4
        sleep    10s
        ${count}    Get Matching Xpath Count    ${label.enrollee.casenotes_block}
        Log    ${count}
        ${casenotes_count}    Get Last element of casenotes list    ${label.enrollee.casenotes_block}    ${label.enrollee.casenote_text1}
        ${value1}    Set Variable    ${casenote_value}
        ${text}    Get app values of casenotes list    ${casenotes_count}    ${casenote_values_db}    ${label.enrollee.casenote_text1}    ${casenote_list}
        AppiumExtendedLibrary.swipe down    4
        ${devices_count}    Get Last element of casenotes list    ${label.enrollee.casenotes_block}    ${label.enrollee.casenote_text1}
        ${value2}    Set Variable    ${casenote_value}
        Run Keyword If    '${value1}'=='${value2}'    Exit For Loop
    END
    log    ${casenote_list}
    ${status}    CustomLibrary.Nested List Compare    ${casenote_list}    ${casenote_values_db}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    fail    Casenotes list details in Mobile app does not match with database list
    ...    ELSE    Log    Casenotes List details in Mobile app match with database list

Validate Enrollee timezone and timestamp
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${MEDIUM_WAIT}    PROFILE lable is not visible after waiting ${MEDIUM_WAIT} seconds
    ${timezone1}    Set Variable    US/Central
    ${timezone2}    Set Variable    US/Pacific
    Comment    Get contact details from profilepage before editing
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label_enrollee_profilepage_contactdate}
    ...    ELSE    Get Label Text    ${label_enrollee_profilepage_contactdate}
    ${enrollee_contactdate}    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label_enrollee_profilepage_timezone}
    ...    ELSE    Get Label Text    ${label_enrollee_profilepage_timezone}
    ${enrollee_timezone}    Set Variable    ${text}
    ${current_timezone}    Set Variable    ${enrollee_timezone}
    ${current_contactdate}    Set Variable    ${enrollee_contactdate}
    ${modified_timezone}=    Set Variable If    '${current_timezone}'=='${timezone1}'    ${timezone2}    ${timezone1}
    Comment    Click on edit button
    mobile_enrollee.Click on edit button
    Comment    mobile_enrollee.Select Time Zone for an Enrollee
    mobile_enrollee.Select timezone for edit enrollee    ${modified_timezone}
    Comment    Get contact details from profilepage after editing
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label_enrollee_profilepage_contactdate}
    ...    ELSE    Get Label Text    ${label_enrollee_profilepage_contactdate}
    ${modified_contactdate}    Set Variable    ${text}
    Run Keyword If    ‘${PLATFORM_NAME}’==‘Android’    Get Static Text    ${label_enrollee_profilepage_timezone}
    ...    ELSE    Get Label Text    ${label_enrollee_profilepage_timezone}
    ${modified_timezone}    Set Variable    ${text}
    ${current_contactdate_obj}=    mobile_common.Get Date Time In Given TimeZone    ${current_contactdate}    ${current_timezone}    ${modified_timezone}
    ${modified_contactdate_obj}    mobile_common.Get Date Object For Given String    ${modified_contactdate}
    Should Be Equal As Strings    ${current_contactdate_obj}    ${modified_contactdate_obj}    Date and Time stamp is different after updating the TimeZone

Select timezone for edit enrollee
    [Arguments]    ${timezone_value}
    Comment    Check TimeZone select button is display
    AppiumLibrary.Tap    ${button.enrollee.timezone.select}
    Comment    Wait for Organisation list to be displayed
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Time Zones list is not displayed afer clicking select Time Zone button
    ${list.enrollee.timezone.new}    mobile_common.Update Dynamic Value    ${list.edit_enrollee.timezone}    ${timezone_value}
    AppiumLibrary.Element Should Be Visible    ${list.enrollee.timezone.new}    ${timezone_value} is not displayed under the list of Time Zones
    AppiumLibrary.Tap    ${list.enrollee.timezone.new}
    AppiumLibrary.Wait Until Element Is Visible    ${button.editenrollee.update}
    AppiumLibrary.Tap    ${button.editenrollee.update}
    sleep    3s
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${MEDIUM_WAIT}    PROFILE lable is not visible after waiting ${MEDIUM_WAIT} seconds

Select Navigation Tab in Profile of Enrollee
    [Arguments]    ${tab}
    ${label.profile.tab.new}    Update Dynamic Value    ${label.profile.tab}    ${tab}
    AppiumLibrary.Wait Until Element Is Visible    ${label.profile.tab.new}    ${SHORT_WAIT}    Selected tab is not displayed
    sleep    3s
    AppiumLibrary.Click Element    ${label.profile.tab.new}

Select Confirmed Event
    [Arguments]    ${violation_description}
    Sleep    3s
    ${list.enrollee.events.new}    Update Dynamic Value    ${list.enrollee.events}    ${violation_description}
    AppiumExtendedLibrary.Swipe Down To Element    ${list.enrollee.events.new}    7
    ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.enrollee.events.new}
    Run Keyword If    '${status}'=='True'    AppiumLibrary.Click Element    ${list.enrollee.events.new}
    ...    ELSE    Log    Master Tamper event is not visibe

Select an Open Event of an Enrollee
    [Arguments]    ${org}    ${primary_ID}
    [Documentation]    Selects Open Event from the desired Organization. And checks the selected Open Event Details page is \ displayed. After selecting returns the ID of the selected Open Event.
    ...
    ...    Examples:
    ...    ${ID} mobile_events.Select an Open Event
    ...    1453546 mobile_events.Select an Open Event
    @{open_event_data}    CustomLibrary.get open event details for enrollee    ${org}    ${primary_ID}
    Should Not Be Empty    ${open_event_data}    No Open Events are present in the Organization.
    FOR    ${data}    IN    @{open_event_data}
        ${violation_description}    Set Variable    ${data}[0]
        ${fname}    Set Variable    ${data}[1]
        ${lname}    Set Variable    ${data}[2]
        ${enrollee}    Set Variable    ${lname},${fname}
        ${ID}    Set Variable    ${data}[3]
        ${list.enrollee.events.new}    Update Dynamic Value    ${list.enrollee.events}    ${violation_description}
        Sleep    2s
        AppiumExtendedLibrary.Swipe Down To Element    ${list.enrollee.events.new}    7
        ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.enrollee.events.new}
        Run Keyword If    '${status}'=='True'    AppiumLibrary.Click Element    ${list.enrollee.events.new}
        Exit For Loop If    '${status}'=='True'
        AppiumExtendedLibrary.Swipe Up To Element    ${list.enrollee.events.new}    7
        Log    Event with violationdescription=${violation_description}, firstname=${fname}, lastname=${lname} details is not available in selected Organization.
    END
    AppiumLibrary.Wait Until Element Is Visible    ${label.event.detail}    ${MEDIUM_WAIT}    Selected Event Details page is not displayed.
    Run Keyword If    '${status}'=='False'    mobile_common.Fail and take screenshot    There are no Open Events for enrollee in the selected Organizations.
    [Return]    ${ID}

Cancel Create Enrollee
    [Arguments]    ${enrollee_add_details}
    Comment    Select Enrollee Tab
    mobile_common.Select Navigation Tab    Enrollee
    Comment    Click on Add Enrolle icon and wait for add enrollee page to be displayed
    mobile_enrollee.Click Add Enrollee Button
    mobile_enrollee.Enter Enrollee Details    ${enrollee_add_details}[FirstName]    ${enrollee_add_details}[LastName]    ${enrollee_add_details}[PrimaryId]
    mobile_enrollee.Select Organzation for an Enrollee    ${enrollee_add_details}[Organization]
    mobile_enrollee.Select Time Zone for an Enrollee    ${enrollee_add_details}[TimeZone]
    mobile_enrollee.Select Risk Level for an Enrollee    ${enrollee_add_details}[RiskLevel]
    Comment    Cancel the enrollee
    AppiumLibrary.Element Should Be Enabled    ${button.addenrolle.cancel}
    sleep    2s
    AppiumLibrary.Tap    ${button.addenrolle.cancel}
    Comment    Check the enrollee is Cancelled
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee}    ${LONG_WAIT}    Not redirected to Enrollees Page after save an enrollee

Close Assign Enrollee
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.select}    ${LONG_WAIT}    Enrollee is not visible after waiting ${LONG_WAIT}
    AppiumLibrary.Click Element    ${label.enrollee.select}
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.assign}    ${SHORT_WAIT}    Assign button is is not visible after waiting ${SHORT_WAIT}
    AppiumLibrary.Click Element    ${button.enollee.profile.assign}
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee.close}    ${SHORT_WAIT}    Close button is not visible after waiting ${SHORT_WAIT}
    AppiumLibrary.Click Element    ${button.enrollee.close}
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${SHORT_WAIT}    Profile label is not displayed after waiting ${SHORT_WAIT}

Validate Cancelled Enrollee
    [Arguments]    ${first_name}
    ${list.enrollee.profiledts.new}    mobile_common.Update Dynamic Value    ${list.enrollee.profiledts}    ${first_name}
    AppiumLibrary.Page Should Not Contain Element    ${list.enrollee.profiledts.new}    Firstname of an Enrollee is displayed

Validate RiskLevel list
    [Arguments]    ${org}
    Comment    Check TimeZone select button is display
    AppiumLibrary.Tap    ${button.enrollee.risk_level.select}
    Comment    Wait for Organisation list to be displayed
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.addenrollee.list_values}    ${MEDIUM_WAIT}    Time Zones list is not displayed afer clicking select Time Zone button
    @{risk_level_main_list}    Create List
    Set Global Variable    ${risk_level_main_list}
    ${risk_level_values_db}    CustomLibrary.Get Risk Level List From Database    ${org}
    FOR    ${risk_level_id}    IN RANGE    1    4
        ${value}    ${risk_level_count}    Get Last value from list    ${list.add_enrollee.time_zone}    ${label.create_enrollee.time_zone}
        ${text}    Get text from the app list    ${risk_level_count}    ${risk_level_values_db}    ${label.create_enrollee.time_zone}    ${risk_level_main_list}
        ${value2}    ${risk_level_count}    Get Last value from list    ${list.add_enrollee.time_zone}    ${label.create_enrollee.time_zone}
        Run Keyword If    '${value}'=='${value2}'    Exit For Loop
    END
    log    ${risk_level_main_list}
    ${status}    CustomLibrary.Nested List Compare    ${risk_level_main_list}    ${risk_level_values_db}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Risk Level list details in Mobile app does not match with database list
    ...    ELSE    Log    Risk Level List details in Mobile app match with database list
    AppiumLibrary.Wait Until Element Is Visible    ${button.schemas.cancel}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.schemas.cancel}

Get All Events List of Enrollee
    Sleep    2s
    ${events_main_list}    Create List
    @{EmptyList}    Create List
    Set Global Variable    ${events_main_list}    ${EmptyList}
    FOR    ${key}    IN RANGE    1    20
        Sleep    2s
        ${events_count}    Get Matching Xpath Count    ${list.enrollee.events.count}
        Log    ${events_count}
        Get Events of Enrollee from Events List    ${events_count}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}
        Log    ${events_main_list}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Get Events of Enrollee from Events List
    [Arguments]    ${events_count}
    FOR    ${value}    IN RANGE    1    ${events_count}+1
        ${value}    Convert To String    ${value}
        ${list.enrollee.events_name.new}    Update Dynamic Value    ${list.enrollee.events_name}    ${value}
        ${eventname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.events_name.new}
        Run Keyword If    '${eventname_status}'=='True'    mobile_enrollee.Get Event Name Text    ${list.enrollee.events_name.new}
        log    ${event_name}
        @{event_list}    Create List    ${event_name}
        Comment    Log    @{event_list}
        Comment    Run Keyword If    '${fullname_status}'=='True' and '${primaryid_status}'=='True' and '${organization_status}'=='True'    Append To List    ${enrollee_details_list}
        Run Keyword If    '${eventname_status}'=='True'    Append To List    ${events_main_list}    ${event_list}
        Log    ${event_list}
        Comment    Run Keyword If    '${eventname_status}'=='True'    @{event_list}    Append To List    ${event_name}
        Comment    Run Keyword If    '${fullname_status}'=='False' and '${primaryid_status}'=='False' and '${organization_status}'=='True'    Append To List    ${enrollee_details_list}    ${organization_status}
    END

Get Event Name Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${event_name}    ${value}
    Log    ${event_name}

Get All Enrollee Events List and Validate
    [Arguments]    ${organization}    ${primary_Id}
    Comment    Get all events violation description from events list view
    Get All Events List of Enrollee
    Comment    Get all enrollee first name, lastname, primaryid, organization from database for given list of organisation
    ${db_enrollee_events_list}    CustomLibrary.get events violation description for enrollee    ${organization}    ${primary_Id}
    Comment    Verify the enrollee list dispayed in Mobile app matches with database details
    Validate Enrollee Events List    ${events_main_list}    ${db_enrollee_events_list}

Validate Enrollee Events List
    [Arguments]    ${app_enrollee_list}    ${db_enrollee_list}
    ${status}=    CustomLibrary.Nested List Compare    ${app_enrollee_list}    ${db_enrollee_list}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Enrollee Events List details in Mobile app does not match with database list
    ...    ELSE    Log    Enrollee Events List details in Mobile app match with database list

Prerequisite for Enrollee Events
    [Arguments]    ${org}    ${primary_ID}
    ${event}    CustomLibrary.get events violation description for enrollee    ${org}    ${primary_ID}
    Run Keyword If    ${event}==None    Fail    No events are present for this enrollee in the selected organization

Select Chat Box of Enrollee
    AppiumLibrary.Wait Until Element Is Visible    ${button.enollee.profile.chat}    ${MEDIUM_WAIT}    Chat button is not visible.
    AppiumLibrary.Click Element    ${button.enollee.profile.chat}

Select an Event
    [Arguments]    ${violation_description}
    Sleep    3s
    ${list.enrollee.events.new}    Update Dynamic Value    ${list.enrollee.events}    ${violation_description}
    AppiumExtendedLibrary.Swipe Down To Element    ${list.enrollee.events.new}    7
    ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.enrollee.events.new}
    Run Keyword If    '${status}'=='True'    AppiumLibrary.Click Element    ${list.enrollee.events.new}
    ...    ELSE    Log    Expected event is not visibe

Edit enrollee details
    [Arguments]    ${enrollee_add_details}
    Comment    mobile_enrollee.Clear edit enrollee fields
    mobile_enrollee.Clear edit enrollee fields
    Comment    Enter text into edit enrollee fields
    mobile_common.Input Text    ${textbox.enrollee.first_name}    ${enrollee_add_details}[FirstName]
    mobile_common.Input Text    ${textbox.enrollee.last_name}    ${enrollee_add_details}[LastName]
    mobile_enrollee.Select Time Zone for an Enrollee    ${enrollee_add_details}[TimeZone]
    mobile_enrollee.Select Risk Level for an Enrollee    ${enrollee_add_details}[RiskLevel]
    Run Keyword If    '${enrollee_add_details}[DeviceName]'!='NA'    Assign a Device to an Enrollee    ${enrollee_add_details}[DeviceName]

Clear edit enrollee fields
    AppiumLibrary.Clear Text    ${textbox.enrollee.first_name}
    AppiumLibrary.Clear Text    ${textbox.enrollee.last_name}

Validate enable status
    ${Status_risklevel}=    Get control enable status    ${enrolle.editenrolle.risklevel}
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${Status_risklevel}    false    Enrollee risklevel status doesn't match.
    ${Status_device_assignment}=    Get control enable status    ${enrolle.editenrolle.deviceassignment}
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${Status_device_assignment}    false    Enrollee device assignment status doesn't match.
    ${enrollee_status}    Create Dictionary    RISKLEVEL=${Status_risklevel}    DEVICEASSIGNMENT=${Status_device_assignment}
    log    ${enrollee_status}

Validate control enable status after selecting organization
    ${Status_risklevel}=    Get control enable status    ${enrolle.editenrolle.risklevel}
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${Status_risklevel}    true    Enrollee risklevel status doesn't match.
    ${Status_device_assignment}=    Get control enable status    ${enrolle.editenrolle.deviceassignment}
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${Status_device_assignment}    true    Enrollee device assignment status doesn't match.
    ${enrollee_status}    Create Dictionary    RISKLEVEL=${Status_risklevel}    DEVICEASSIGNMENT=${Status_device_assignment}
    log    ${enrollee_status}

Get Label Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Element Attribute    ${locator}    label
    Set Global Variable    ${text}    ${value}
    Log    ${text}

Get Static Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${text}    ${value}
    Log    ${text}

Cancel Unassign device and validate
    [Arguments]    ${ICON}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.${ICON}}    ${MEDIUM_WAIT}    ${icon} icon is not diplayed after waiting ${MEDIUM_WAIT}
    comment    click on ${ICON} operation
    AppiumLibrary.Click Element    ${images.enrollee.${ICON}}
    AppiumLibrary.Wait Until Element Is Visible    ${button.device.unassign.cancel_action}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.device.unassign.cancel_action}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.${ICON}}    ${MEDIUM_WAIT}    ${icon} icon is not diplayed after waiting ${MEDIUM_WAIT}

Cancel Search Enrollee and Validate
    [Arguments]    ${first_name}=NA    ${last_name}=NA    ${primary_id}=NA    ${device}=Both
    sleep    2s
    AppiumLibrary.Element Should Be Visible    ${label.enrollee}    Enrollees page is not displayed after waiting for ${LONG_WAIT}
    AppiumLibrary.Tap    ${button.enrollees.searchicon}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.search.first_name}    ${LONG_WAIT}    firstname textbox is not displayed after clicking on search icon
    Clear Enrollee Search Fields
    Run Keyword If    '${first_name}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.search.first_name}    ${first_name}
    Run Keyword If    '${last_name}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.search.last_name}    ${last_name}
    Run Keyword If    '${primary_id}'!='NA'    mobile_common.Input Text    ${textbox.enrollee.search.primary_id}    ${primary_id}
    sleep    2s
    AppiumLibrary.Click Element    ${button.enrollee.${device}}
    AppiumLibrary.Click Element    ${button.enrollee.search.cancel}
    sleep    2s
    ${label.pagetitle.new}    mobile_common.Update Dynamic Value    ${label.pagetitle}    Enrollee
    AppiumLibrary.Wait Until Element Is Visible    ${label.pagetitle.new}    ${LONG_WAIT}    Enrollee Page is not displayed after click on search icon in Enrollees page
Select back arrow in enrollee profile page
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee_profile.back_arrow}
    AppiumLibrary.Click Element    ${button.enrollee_profile.back_arrow}

Select searched enrollee with fullname
    [Arguments]    ${validate_data}
    ${list.enrollee.profiledts.new}    mobile_common.Update Dynamic Value    ${list.enrollee.profiledts}    ${validate_data}[FirstName]
    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.profiledts.new}    ${LONG_WAIT}    Firstname of an Enrollee is not displayed
    sleep    10s
    AppiumLibrary.Tap    ${list.enrollee.profiledts.new}
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${SHORT_WAIT}

Validate navigated page
    [Arguments]    ${tab_name}
    ${label.pagetitle.new} =    Update Dynamic Value    ${label.pagetitle}    ${tab_name}
    AppiumLibrary.Wait Until Element Is Visible    ${label.pagetitle.new}    ${MEDIUM_WAIT}    Not redirected to ${tab_name} page.

Validate ORI and Primary ID cannot be updated
    AppiumLibrary.Click Element    ${textbox.enrollee.primary_id}
    ${primaryid_status}=    AppiumLibrary.Is Keyboard Shown
    Run Keyword And Continue On Failure    Run Keyword If    ‘${primaryid_status}’==‘False’    Log    Primaryid can not be updated
    AppiumLibrary.Tap    ${button.enrollee.org.select}
    ${organisation_status}=    AppiumLibrary.Element Should Be Visible    ${list.addenrollee.list_values}
    Run Keyword And Continue On Failure    Run Keyword If    ‘${organisation_status}’==‘False’    Log    Organisation can not be updated

Cancel Enrollee Event Profile
    AppiumLibrary.Click Element    ${button.enrollee.event.profile.cancel}

Validate Enrollee events page
    Comment    Validate events page
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee.events}    ${MEDIUM_WAIT}    Events page is not visible

select unassign reason android
    [Arguments]    ${device_pattern}
    ${list.enollee.device_id.new}    Update Dynamic Value    ${list.enollee.device_id}    ${device_pattern}
    AppiumExtendedLibrary.Swipe Down To Element To Unassign Device    ${list.enollee.device_id.new}    7
    AppiumLibrary.Wait Until Element Is Visible    ${list.enollee.device_id.new}    ${SHORT_WAIT}    Expected device assigned enrollees are not present.
    AppiumLibrary.Click Element    ${list.enollee.device_id.new}
    AppiumLibrary.Wait Until Element Is Visible    ${label.search_enrollee.profile}    ${MEDIUM_WAIT}    Profile of Enrollee is not visible
    ${enrollee_details}    Get Enrollee Details to Unassign    ${device_pattern}

Unassign a reason in android
    [Arguments]    ${unassign_reason}
    AppiumLibrary.Wait Until Element Is Visible    ${spinner.enrollee.profile.reason.unassign}    ${LONG_WAIT}    Drop down is not visible after waiting ${LONG_WAIT}
    AppiumLibrary.Click Element    ${spinner.enrollee.profile.reason.unassign}
    ${list.enollee.profile.unassigned_reason.new}    ‘${PLATFORM_NAME}’==‘Android’    Update Dynamic Value    ${list.enollee.profile.unassigned_reason}    ${unassign_reason}
    AppiumExtendedLibrary.Swipe Down To Element To Unassign Device    ${list.enollee.profile.unassigned_reason.new}    7
    AppiumLibrary.Click Element    ${list.enollee.profile.unassigned_reason.new}
    
Get case note text
    [Arguments]    ${locator_new}    ${main_list}
    ${value}    AppiumLibrary.Get Text    ${locator_new}
    log    ${value}
    Append To List    ${main_list}    ${value}

Get last case note text
    [Arguments]    ${locator2}    ${xpath_count}
    ${xpath_count}    Evaluate    ${xpath_count}-1
    ${xpath_count}    Convert To String    ${xpath_count}
    ${locator_new}    Update Dynamic Value    ${locator2}    ${xpath_count}
    ${value}    AppiumLibrary.Get Text    ${locator_new}
    Set Test Variable    ${casenote_value}    ${value}
    log    ${casenote_value}

Get last value
    [Arguments]    ${locator_new}
    ${value}    AppiumLibrary.Get Text    ${locator_new}
    Set Test Variable    ${casenote_value}    ${value}
    log    ${casenote_value}

Get Last element of casenotes list
    [Arguments]    ${locator1}    ${locator2}
    ${xpath_count}    Get Matching Xpath Count    ${locator1}
    ${xpath_count}    Convert To String    ${xpath_count}
    ${locator_new}    Update Dynamic Value    ${locator2}    ${xpath_count}
    ${status}=    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${locator_new}
    Run Keyword If    '${status}'=='True'    Get last value    ${locator_new}
    ...    ELSE    mobile_enrollee.Get last case note text    ${locator2}    ${xpath_count}
    [Return]    ${xpath_count}

Get app values of casenotes list
    [Arguments]    ${list_count}    ${db_values}    ${locator}    ${main_list}
    FOR    ${list_count_value}    IN RANGE    1    ${list_count}+1
        ${list_count_value}    Convert To String    ${list_count_value}
        ${locator_new}    Update Dynamic Value    ${locator}    ${list_count_value}
        ${status}=    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${locator_new}
        Run Keyword If    '${status}'=='True'    mobile_enrollee.Get case note text    ${locator_new}    ${main_list}
        ...    ELSE    Continue For Loop
    END
