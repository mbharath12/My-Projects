*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Enter Capture Wizard Login Details
    [Arguments]    ${user_name}    ${password}
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    Encapture - Log In
    WhiteLibrary.Input Text To Textbox    ${textbox.window.wizard.clientlogin.username}    ${user_name}
    WhiteLibrary.Input Text To Textbox    ${textbox.window.wizard.clientlogin.password}    ${password}
    WhiteLibrary.Click Item    ${button.window.wizard.clientlogin.save}
    ${bStatus}    Run Keyword And Return Status    Wait Until Element Is Visible    ${label.adminhomepage.username}    ${LONG_WAIT}
    [Return]    ${bStatus}

Verify Client Wizard is Launched
    [Arguments]    ${window_title}
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    ${actual_window_title}    Set Variable If    '${window_title}'=='Encapture'    Encapture    Encapture ${window_title}
    ${wizard_status}    Run Keyword And Return Status    Attach Window    ${actual_window_title}
    Maximize Window
    [Return]    ${wizard_status}

Validate Client Wizard is Launched
    [Arguments]    ${application_name}
    ${app_status}    Verify Client Wizard is Launched    ${application_name}
    Run Keyword If    ${app_status}==False    Fail    ${application_name} wizard failed to launch
