*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Launch Application
    [Arguments]    ${url}    ${Browser_Name}
    ${session}    Run Keyword And Return Status    Get Session Id
    Run Keyword If    ${session}==True    Go To    ${url}
    ...    ELSE    Launch Browser    ${Browser_Name}    ${url}
    Maximize Browser Window

Login to Application
    [Arguments]    ${username}    ${password}
    Launch Browser    ${url}    ${Browser_Name}
    Enter Login Details    ${username}    ${password}
    SeleniumLibrary.Wait Until Element Is Visible    ${Home.menu.home}    ${MEDIUM_WAIT}

Enter Login Details
    [Arguments]    ${username}    ${password}
    SeleniumLibrary.Wait Until Element Is Visible    ${Login.txt.username}    ${LONG_WAIT}
    SeleniumLibrary.Input Text    ${Login.txt.username}    ${username}
    SeleniumLibrary.Input Text    ${Login.txt.password}    ${password}
    SeleniumLibrary.Click Element    ${Login.btn.login}

Launch Browser
    [Arguments]    ${Browser_Name}    ${url}
    Run Keyword If    '${Browser_Name}'=='Chrome' or '${Browser_Name}'=='chrome' or '${Browser_Name}'=='gc'    Open Chrome Browser    ${url}
    Run Keyword If    '${Browser_Name}'=='Firefox' or '${Browser_Name}'=='firefox' or '${Browser_Name}'=='ff'    Open Browser    ${url}    Firefox

Read TestData From Excel
    [Arguments]    ${testcaseid}    ${sheet_name}
    [Documentation]    Read TestData from excel file for required data.
    ...
    ...    Example:
    ...    Read TestData From Excel TC_01 SheetName
    ${test_data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${testcaseid}    ${sheet_name}
    Set Global Variable    ${test_data}
    [Return]    ${test_data}

Select Entity
    SeleniumLibrary.Wait Until Element Is Visible    ${Home.menu.home}    ${Medium_Wait}    Page is not dispalyed
    SeleniumLibrary.Mouse Over    ${Home.menu.home}
    SeleniumLibrary.Click Element    ${Home.menu.selectentity}
    SeleniumLibrary.Wait Until Element Is Visible    ${common.btn.create}
    SeleniumLibrary.Click Element    ${common.btn.create}
    SeleniumLibrary.Wait Until Element Is Visible    ${common.btn.save}

Set Browser Position
    Run Keyword If    '${Browser_Name}'=='Chrome' or '${Browser_Name}'=='chrome' or '${Browser_Name}'=='gc'    Set Window Position    0    5
    Run Keyword If    '${Browser_Name}'=='Firefox' or '${Browser_Name}'=='firefox' or '${Browser_Name}'=='ff'    Set Window Position    1006    6
    Set Window Size    959    1047

Update Dynamic Value
    [Arguments]    ${locator}    ${value}
    [Documentation]    It replace the string where ever you want.
    ...
    ...    Example:
    ...    mobile_common.Update Dynamic Value locator replace_string
    ${xpath}=    Replace String    ${locator}    replaceText    ${value}
    [Return]    ${xpath}

Update Dynamic Values
    [Arguments]    ${locator}    ${value1}    ${value2}
    ${locator}=    Replace String    ${locator}    replaceText1    ${value1}
    ${xpath}=    Replace String    ${locator}    replaceText2    ${value2}
    [Return]    ${xpath}

Take Screenshot
    SeleniumLibrary.Capture Page Screenshot

Fail And Take Screenshot
    [Arguments]    ${error_message}
    Take Screenshot
    Fail    ${error_message}

Enter text and press tab
    [Arguments]    ${locator}    ${value}
    SeleniumLibrary.Press Keys    ${locator}    ${value}
    SeleniumLibrary.Press Keys    ${locator}    TAB

Close Browser
    Run Keyword And Ignore Error    SeleniumLibrary.Close All Browsers

Wait For Element To Be Displayed
    [Arguments]    ${locator_name}    ${locator}    ${wait_time}
    Log    Waiting for ${locator_name}element visiblility
    ${status}    Run Keyword And Return Status    SeleniumLibrary.Wait Until Element Is Visible    ${locator}    ${wait_time}    ${locator_name} element is not visible after waiting ${wait_time} sec
    Log    The ${locator_name} element is visible
    [Return]    ${status}

Click On Element JS
    [Arguments]    ${locator_name}    ${locator}    ${wait}    ${click_by}=JS
    Comment    Click on ${locator_name}
    Log    Verifying the element ${locator_name} visibility
    Wait For Element To Be Displayed    ${locator_name}    ${locator}    ${wait}
    Log    Verifying the element ${locator_name} focus
    SeleniumLibrary.Set Focus To Element    ${locator}
    Wait Until Element Clickable    ${locator}
    Log    Click on element ${locator_name}
    Run Keyword If    '${click_by}'=='JS' or '${BROWSERNAME}'=='firefox'    Javascript Click    ${locator}
    ...    ELSE    SeleniumLibrary.Click Element    ${locator}
    Log    Clicked on ${locator_name}

Validate Element is Deleted
    [Arguments]    ${element_name}    ${wait_time}
    ${web.label.name.new}    common.Update Dynamic Value    ${web.label.name}    ${element_name}
    Wait Until Element Is Not Visible    ${web.label.name.new}    ${wait_time}
    Log    ${element_name} - is not available in the screen as expected.

Select Drop Down Option by Input Text
    [Arguments]    ${arrow_locator}    ${value_locator}    ${textbox_locator}    ${text_to_input}    ${wait_time}
    SeleniumLibrary.Scroll Element Into View    ${arrow_locator}
    SeleniumLibrary.Set Focus To Element    ${arrow_locator}
    CustomLibrary.Javascript Click    ${arrow_locator}
    Wait For Spinner To Disappear
    Send Text To Textfield    ${textbox_locator}    ${wait_time}    ${text_to_input}
    Wait Until Time    1
    Wait For Spinner To Disappear
    Wait Until Time    2
    SeleniumLibrary.Scroll Element Into View    ${value_locator}
    SeleniumLibrary.Set Focus To Element    ${value_locator}
    SeleniumLibrary.Click Element    ${value_locator}
    Wait For Spinner To Disappear
    Take Screenshot

Send Text To Textfield
    [Arguments]    ${locator}    ${wait}    ${value}
    Comment    Should wait until text box is visible
    ${status}    Wait For Element To Be Displayed    ${value}    ${locator}    ${wait}
    Run Keyword If    '${status}'=='False'    common.Fail And Take Screenshot    ${locator} - locator is not displayed after wait ${wait} sec.
    Comment    Wait Until Element Is Enabled    ${locator}    ${wait}
    Log    Waited until text box is visible
    Comment    Clear text
    Wait For Spinner To Disappear
    Set Focus To Element    ${locator}
    Clear Element Text    ${locator}
    Log    Cleared text ${locator}
    Wait For Spinner To Disappear
    Comment    Enter text
    SeleniumLibrary.Input Text    ${locator}    ${value}
    Log    Entered text ${value}
    Take Screenshot

Get Element Atrribute
    [Arguments]    ${locator}    ${attribute_name}
    Wait For Spinner To Disappear
    ${returnvalue}    SeleniumLibrary.Get Element Attribute    ${locator}    ${attribute_name}
    Log    ${returnvalue}
    [Return]    ${returnvalue}
