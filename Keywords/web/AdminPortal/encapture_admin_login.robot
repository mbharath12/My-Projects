*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Enter Encapture Login Details
    [Arguments]    ${user_name}    ${password}
    Reload Page
    Wait Until Element Is Visible    ${textbox.adminlogin.userid}    ${LONG_WAIT}    User Id is not visible after waiting for 20s
    SeleniumLibrary.Input Text    ${textbox.adminlogin.userid}    ${user_name}
    SeleniumLibrary.Input Text    ${textbox.adminlogin.password}    ${password}
    SeleniumLibrary.Click Button    ${button.adminlogin.continue}
    ${bStatus}    Run Keyword And Return Status    Wait Until Element Is Visible    ${label.adminhomepage.username}    ${LONG_WAIT}    Encapture Admin Home Page is not visible after waiting for 20s
    [Return]    ${bStatus}

Login and Open Orchestrator Application
    [Arguments]    ${admin_name}    ${admin_password}
    Login to Encapture Application    ${admin_name}    ${admin_password}
    Select the Client Application    ${ENCAPTURE_ADMIN}

Login to Encapture Application
    [Arguments]    ${username}    ${password}
    Launch Browser and Navigate to URL    ${BROWSER}    ${ENCAPTURE_ADMIN_URL}
    ${login_status}    Enter Encapture Login Details    ${username}    ${password}
    Run Keyword If    ${login_status}==False    Fail    Admin not able to login to the application
