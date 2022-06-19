*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Pursuit an enrollee
    [Arguments]    ${last_name}    ${first_name}    ${action}
    [Documentation]    Selects a desired Enrollee from the caseload and check the enrollee pursuit page is displayed.
    ...
    ...    Examples:
    ...    mobile_pursuit.Pursuit an enrollee${test_prerequisite_data}[Name]
    ...
    ...    mobile_pursuit.Pursuit an enrollee Kevin, Made
    AppiumLibrary.Wait Until Element Is Visible    ${images.dashboard.caseload.google_map}    ${LONG_WAIT}    Google Map is not diplayed after waiting ${LONG_WAIT} seconds
    ${enrollees_count}    AppiumLibrary.Get Matching Xpath Count    ${images.dashboard.caseload.enrollees}
    Run Keyword If    ${enrollees_count}==0    mobile_common.Fail and take screenshot    No enrollees are there to pursuit in Dashboard.
    ${flag}    Set Variable    False
    FOR    ${count}    IN RANGE    1    ${enrollees_count}+1
        ${enrollee_count}    Convert To String    ${count}
        ${google_map.enrollee}    Update Dynamic Value    ${list.google_map.enrollee.count}    ${enrollee_count}
        Comment    Wating for enrollee on Google Map Caseload
        AppiumLibrary.Wait Until Element Is Visible    ${google_map.enrollee}    ${LONG_WAIT}    Enrollee is not diplayed after waiting ${LONG_WAIT} seconds
        AppiumLibrary.Click Element    ${google_map.enrollee}
        Comment    Waiting for pursuit image of the enrollee
        AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.pursue}    ${LONG_WAIT}    Pursuit is not diplayed after waiting ${LONG_WAIT} seconds
        ${enrollee_name}    Update Dynamic Value    ${common.dynamic_xpath}    ${last_name}, ${first_name}
        ${flag}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${enrollee_name}
        Run Keyword If    '${flag}'=='True' and '${action}'=='Pursuit'    Run Keywords    Pursuit and Close the Enrollee
        ...    AND    Exit For Loop
        Run Keyword If    '${flag}'=='True' and '${action}'=='Profile'    Run Keywords    Open caseload profile
        ...    AND    Exit For Loop
        Run Keyword If    '${flag}'=='True' and '${action}'=='Direction'    Run Keywords    Perform directions action
        ...    AND    Exit For Loop
        Run Keyword If    '${flag}'=='False'    Run Keywords    Log    ${enrollee_name} is not diplayed and Go Back
        ...    AND    AppiumLibrary.Click A Point    700    2000
    END
    Run Keyword If    '${flag}'=='False'    mobile_common.Fail and take screenshot    ${enrollee_name} enrollee is not available in Caseload under Dashboard.

Validate enrollee in recent pursuits
    [Arguments]    ${enrollee_primaryid}
    [Documentation]    Selects a pursuited Enrollee from the recent pursuits and delete the enrollee.
    ...
    ...    Examples:
    ...    mobile_pursuit.Validate enrollee in recent pursuits ${test_prerequisite_data}[PrimaryId]
    ...
    ...    mobile_pursuit.Validate enrollee in recent pursuits 12-987K312
    ${list.enrollee.pursuit.primaryid}    Update Dynamic Value    ${list.enrollee.pursuit.primary_id}    ${enrollee_primaryid}
    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.pursuit.primaryid}    ${ANDROID_LONG_WAIT}    Enrollee with ${enrollee_primaryid} is not diplayed in Recent pursuits after waiting ${LONG_WAIT} seconds

Pursuit and Close the Enrollee
    [Documentation]    Pursuit an enrollee and close the enrollee.
    ...
    ...    Examples:
    ...    mobile_pursuit.Pursuit and Close the Enrollee
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.pursue}    ${LONG_WAIT}    Pursue is not diplayed after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${images.enrollee.pursue}
    Close pursuit map screen

Perform Dashboard profile actions
    [Arguments]    ${action}    ${enrollee_primaryid}
    [Documentation]    Delete a pursuited Enrollee from the recent pursuits.
    ...
    ...    Examples:
    ...
    ...    mobile_pursuit.Delete Pursuit Enrollee
    Comment    Click enrollee from Recent Pursuit
    ${list.enrollee.pursuit.primaryid}    Update Dynamic Value    ${list.enrollee.pursuit.primary_id}    ${enrollee_primaryid}
    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.pursuit.primaryid}    ${ANDROID_LONG_WAIT}    Enrollee with ${enrollee_primaryid} is not diplayed in Recent pursuits after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${list.enrollee.pursuit.primaryid}
    Comment    Select an Action - Cancel, Send, Delete
    ${button.common.action.new}    mobile_common.Update Dynamic Value    ${button.common.dashboard_action}    ${action}
    AppiumLibrary.Wait Until Element Is Visible    ${button.common.action.new}    ${LONG_WAIT}    ${action} button is not diplayed after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${button.common.action.new}
    sleep    2s
    Run Keyword If    ‘${action}’==‘SEND’ or ‘${action}’==‘Send’    Close pursuit map screen

Validate Pursuit from Database
    [Arguments]    ${serial_num}    ${msg_id}    ${pursuit_data}
    @{db_commands}    CustomLibrary.Get Commands After Device Operation    ${serial_num}    ${msg_id}
    @{exp_commands}    Split String    ${pursuit_data}[Commands]    |
    ${length}    Get Length    ${db_commands}
    Run Keyword If    '${length}'=='0'    Fail    There are no commands in the database after performing actions on device
    Run Keyword And Continue On Failure    Lists Should Be Equal    ${db_commands}    ${exp_commands}    Expected ${db_commands} perl command is not matched with actual perl which shown in database.    ignore_order=True

Validate deleted enrollee in recent pursuit
    [Arguments]    ${enrollee_primaryid}
    ${list.enrollee.pursuit.primaryid}    Update Dynamic Value    ${list.enrollee.pursuit.primary_id}    ${enrollee_primaryid}
    AppiumLibrary.Wait Until Page Does Not Contain Element    ${list.enrollee.pursuit.primaryid}    ${ANDROID_LONG_WAIT}    Enrollee with ${enrollee_primaryid} is diplayed in Recent pursuits even after performing delete operation

Perform device action from enrollee profile
    [Arguments]    ${ICON}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.${ICON}}    ${MEDIUM_WAIT}    ${icon} icon is not diplayed after waiting ${MEDIUM_WAIT}
    comment    click on ${ICON} operation
    AppiumLibrary.Click Element    ${images.enrollee.${ICON}}
    comment    click on send button
    AppiumLibrary.Tap    ${button.common.action}
    comment    Close the map window if ${ICON} is equal to pursuit
    Run Keyword If    '${ICON}'=='pursue'    mobile_pursuit.Close pursuit map screen

Add case note for an enrollee
    [Arguments]    ${case_note_text}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.add_case_notes}    ${MEDIUM_WAIT}    case notes icon is not displayed after waiting ${MEDIUM_WAIT} sec
    appiumlibrary.tap    ${images.enrollee.add_case_notes}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrolle.case_note}    ${MEDIUM_WAIT}    Case note text box is not visible after waitng${MEDIUM_WAIT} sec
    mobile_common.Input Text    ${textbox.enrolle.case_note}    ${case_note_text}
    AppiumLibrary.Element Should Be Visible    ${button.enrollee.case_note.save}    Save button is not displayed in add case note screen
    appiumlibrary.tap    ${button.enrollee.case_note.save}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.add_case_notes}    ${MEDIUM_WAIT}    case notes icon is not displayed after save the case note
    [Return]    ${case_note_text}

Validate Case Notes
    [Arguments]    ${exp_case_notetext}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.casenote_text}    ${MEDIUM_WAIT}
    ${act_case_note_text}    AppiumLibrary.Get Text    ${label.enrollee.casenote_text}
    Should Be Equal As Strings    ${exp_case_notetext}    ${act_case_note_text}

Close pursuit map screen
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee.pursue.close}    ${LONG_WAIT}    Close button is not diplayed in pursuit page after waiting ${LONG_WAIT} seconds
    sleep    2s
    AppiumLibrary.Click Element    ${button.enrollee.pursue.close}

Perform directions action
    [Documentation]    Performs Directions action for selected caseload enrollee. It will redirected to google maps after performing drirections action.
    ...
    ...    Exapmles:
    ...    mobile_pursuit.Perform directions action
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.directions}    ${MEDIUM_WAIT}    Directions icon is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Tap    ${images.enrollee.directions}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.maps.start}    ${LONG_WAIT}    Start icon is not displayed after waiting ${LONG_WAIT} seconds
    sleep    2s
    AppiumLibrary.Click Element    ${images.enrollee.maps.start}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.sound_icon}    ${LONG_WAIT}    Sound icon is not visible after waiting ${LONG_WAIT} seconds

Validate map screen
    comment    Validate Sound icon should be display
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.sound_icon}    ${LONG_WAIT}    Sound icon is not visible after waiting ${LONG_WAIT} seconds

Cancel the action from enrolleed profile
    [Arguments]    ${ICON}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.${ICON}}    ${LONG_WAIT}    ${icon} icon is not diplayed after waiting ${MEDIUM_WAIT}
    comment    click on ${ICON} operation
    sleep    3s
    AppiumLibrary.Click Element    ${images.enrollee.${ICON}}
    AppiumLibrary.Click Element    ${button.common.cancel_action}
    AppiumLibrary.Wait Until Element Is Visible    ${images.enrollee.${ICON}}    ${MEDIUM_WAIT}    ${icon} icon is not diplayed after waiting ${MEDIUM_WAIT}
