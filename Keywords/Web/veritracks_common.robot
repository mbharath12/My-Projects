*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Select Schema
    [Arguments]    ${schema}    ${org}=NA
    SeleniumLibrary.Select From List By Value    ${web.dropdown.schema}    ${schema}
    SeleniumLibrary.Click Element    ${web.button.continue}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.org.continue}    ${SHORT_WAIT}    Organization continue button is not visible after waiting for ${SHORT_WAIT} sec
    ${status}    Run Keyword And Return Status    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.org.continue}    ${MEDIUM_WAIT}    Continue button is not visible in Organizations after waiting for ${MEDIUM_WAIT} sec
    Run Keyword If    ${status}==True    veritracks_common.Select Organization    ${org}
    veritracks_common.Validate VeriTracks dashboard page

Select Organization
    [Arguments]    ${org}
    @{orgs_list}    Split String    ${org}    |
    FOR    ${org_name}    IN    @{orgs_list}
        ${web.list.org_new}    Update Dynamic Value    ${web.list.org}    ${org_name}
        ${status}    Run Keyword And Return Status    SeleniumLibrary.Wait Until Element Is Visible    ${web.list.org_new}    ${SHORT_WAIT}    ${org_name} is not displayed in organization list after waiting ${SHORT_WAIT} seconds
        Run Keyword If    ${status} == False    web_common.Fail and take screenshot    ${org} is not found in Organizations list
        SeleniumLibrary.Click Element    ${web.list.org_new}
    END
    SeleniumLibrary.Click Element    ${web.button.org.continue}

Validate VeriTracks dashboard page
    SeleniumLibrary.Wait Until Element Is Visible    ${web.images.welcome.loader}    ${LONG_WAIT}    Loading Bar is not displayed on Dashboard after waiting ${LONG_WAIT} seconds
    SeleniumLibrary.Wait Until Element Does Not Contain    ${web.images.welcome.loader}    Loading Bar is displayed on Dashboard after waiting ${LONG_WAIT} seconds    ${LONG_WAIT}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.dashboard.logout}    ${LONG_WAIT}    Logout button is not displayed on Dashboard after waiting ${LONG_WAIT} seconds
    ${status}    Run Keyword And Return Status    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.warning.accept}    ${MEDIUM_WAIT}    Accept button is not displayed on Warning pop-up after waiting ${MEDIUM_WAIT} seconds
    Run Keyword If    ${status} == True    SeleniumLibrary.Click Element    ${web.button.warning.accept}
