*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Select the Client Application
    [Arguments]    ${application_name}
    Switch Window    Encapture
    Wait Until Element Is Visible    //td[text()='${application_name}']    ${LONG_WAIT}    ${application_name} is not visible after waiting for 5s.
    Click Element    //td[text()='${application_name}']
    Run Keyword If    '${application_name}'!='Orchestrate' and '${application_name}'!='Collect'    Validate Client Wizard is Launched    ${application_name}
    Run Keyword If    '${application_name}'=='Orchestrate'    Switch Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Run Keyword If    '${application_name}'=='Collect'    Switch Window    ${APPLICATION_ENCAPTURE_COLLECT}
    Run Keyword If    '${application_name}'=='Collect'    Maximize Browser Window
    sleep    5s

Verify is User Already Logged In to Capture Wizard
    ${is_already_logged_in}    Run Keyword And Return Status    Wait Until Element Is Visible    ${label.adminhomepage.username}    error=Login label is not visible after waiting for 5s
    [Return]    ${is_already_logged_in}

Go to Client Wizard Login Page
    Launch Browser and Navigate to URL    ${BROWSER}    ${ENCAPTURE_WIZARD_URL}
    Delete All Cookies
    Maximize Browser Window

Logout from Client Wizard
    Click Element    ${label.adminhomepage.username}
    Wait Until Element Is Visible    logoutMenu    ${SHORT_WAIT}
    Click Element    logoutMenu
    Wait Until Element Is Not Visible    ${label.adminhomepage.username}    ${MEDIUM_WAIT}    Logout from Client wizard failed.
