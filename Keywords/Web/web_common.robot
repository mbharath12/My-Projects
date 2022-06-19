*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Launch web Application
    [Arguments]    ${url}    ${browser_name}
    ${session}    Run Keyword And Return Status    Get Session Id
    Run Keyword If    ${session}==True    Go To    ${url}
    ...    ELSE    Launch Browser    ${browser_name}    ${url}
    Maximize Browser Window

Test prerequisites
    [Arguments]    ${testcaseid}
    ${test_prerequisite_data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${testcaseid}    Web
    Set Global Variable    ${test_prerequisite_data}

Launch Browser
    [Arguments]    ${browser_name}    ${url}
    Run Keyword If    '${browser_name}'=='Chrome' or '${browser_name}'=='chrome' or '${browser_name}'=='gc'    Open Chrome Browser    ${url}
    Run Keyword If    '${browser_name}'=='Firefox' or '${browser_name}'=='firefox' or '${browser_name}'=='ff'    Open Browser    ${url}    Firefox

Fail and take screenshot
    [Arguments]    ${message}
    Capture Page Screenshot
    Fail    ${message}

Login to Web Application
    [Arguments]    ${username}    ${password}    ${schema}    ${org}=NO
    [Documentation]    Description:
    ...
    ...    ->This keyword is used to Login to Application
    ...
    ...    ->Param - 01:${username} stores selected username_name
    ...
    ...    ->Param - 02:${password} stores selected password
     web_common.Launch web Application    ${URL}    ${BROWSER_NAME}
     web_common.Enter Login details    ${username}    ${password}
    veritracks_common.Select Schema    ${schema}    ${org}

Logout from Application
    [Documentation]    Description:
    ...
    ...    ->This keyword is used to Logout from Application
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.dashboard.logout}    ${LONG_WAIT}    Logout link is not visible after waiting ${LONG_WAIT} sec
    SeleniumLibrary.Click Element    ${web.button.dashboard.logout}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.textbox.login.username}    ${LONG_WAIT}    Login Page is not visible after waiting ${LONG_WAIT} sec

Enter Login details
    [Arguments]    ${username}    ${password}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.textbox.login.username}    ${MEDIUM_WAIT}    Username textbox is not visible after waiting ${MEDIUM_WAIT} sec
    SeleniumLibrary.Input Text    ${web.textbox.login.username}    ${username}
    SeleniumLibrary.Input Text    ${web.textbox.login.password}    ${password}
    SeleniumLibrary.Click Element    ${web.button.signin}
    ${status}    Run Keyword And Return Status    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.continue}    ${MEDIUM_WAIT}    Continue button is not visible after waiting for ${MEDIUM_WAIT} sec
    Run Keyword If    ${status}==False    web_common.Fail and take screenshot    Login failed with username: ${username} and password: ${password}

Select Navigation Menu
    [Arguments]    ${tab_name}
    [Documentation]    This keyword do navigate one to another menu.
    ...
    ...    Examples:
    ...    web_common.Select Navigation Menu \ Events
    ${web.button.dashboard.tabs.new}    Update Dynamic Value    ${web.button.dashboard.tabs}    ${tab_name}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.dashboard.tabs.new}    ${LONG_WAIT}    ${tab_name} Tab is not visible after waiting ${LONG_WAIT}
    SeleniumLibrary.Click Element    ${web.button.dashboard.tabs.new}
