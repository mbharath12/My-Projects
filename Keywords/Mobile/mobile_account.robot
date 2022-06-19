*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Change Account Organization
    [Arguments]    ${change_org_data}
    Comment    Select Account Tab
    mobile_common.Select Navigation Tab    Account
    comment    Click on Change Organization
    mobile_account.Click on Change Organization
    Comment    Deselect Organizations
    mobile_account.Deselect Organizations    ${change_org_data}[DeselectOrg]
    comment    Select Organizations
    mobile_account.Select Organizations    ${change_org_data}[SelectOrg]
    mobile_account.Perform Update or Cancel operation    ${change_org_data}[Update]

Deselect Organizations
    [Arguments]    ${deselect_ori_data}
    Run Keyword If    '${deselect_ori_data}'!='NA'    Change Organization    ${deselect_ori_data}

Change Organization
    [Arguments]    ${org}
    [Documentation]    Selects or Unselects the given list of organization
    @{orgs_list}    Split String    ${org}    |
    FOR    ${org_name}    IN    @{orgs_list}
        ${list.enrollee.org.new}    Update Dynamic Value    ${list.enrollee.org}    ${org_name}
        sleep    2s
        AppiumExtendedLibrary.Swipe Down To Element    ${list.enrollee.org.new}    3
        ${status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${list.enrollee.org.new}
        Run Keyword If    ${status} == True    AppiumLibrary.Click Element    ${list.enrollee.org.new}
        AppiumExtendedLibrary.Swipe Up    3
    END
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    ${org} is not found in Organizations list

Click on Change Organization
    AppiumLibrary.Wait Until Element Is Visible    ${button.account.change_ori}    ${MEDIUM_WAIT}    Change Organization is not visible after waitng ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.account.change_ori}

Get All Enrollee details from Enrollee List and Validate
    [Arguments]    ${account_organization}
    Comment    Select Enrollees Tab
    mobile_common.Select Navigation Tab    Enrollees
    Comment    Get all enrollee first name, lastname, primaryid, organization from enrollee list view
    mobile_account.Get All Enrollee details from Enrollee List
    Comment    Get all enrollee first name, lastname, primaryid, organization from database for given list of organisation
    ${db_enrollee_list}    CustomLibrary.Get All Enrollee Details From Database    ${account_organization}
    Comment    Verify the enrollee list dispayed in Mobile app matches with database details
    mobile_account.Validate Enrollee List Details    ${enrollee_main_list}    ${db_enrollee_list}

Get All Enrollee details from Enrollee List
    Sleep    2s
    @{enrollee_main_list}    Create List
    @{EmptyList}    Create List
    Set Global Variable    ${enrollee_main_list}    ${EmptyList}
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        Get an Enrollee details from Enrollee List    ${enrollees_count}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_list.no_more_elements}
        Log    ${enrollee_main_list}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Get an Enrollee details from Enrollee List
    [Arguments]    ${enrollees_count}
    FOR    ${value}    IN RANGE    1    ${enrollees_count}+1
        ${value}    Convert To String    ${value}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}    1s
        Run Keyword If    '${fullname_status}'=='True'    Get Enrollee FullName Text    ${list.enrollee.fullname.new}
        ${list.enrollee.primary_id.new}    Update Dynamic Value    ${list.enrollee.primary_id}    ${value}
        ${primaryid_status}    Run Keyword And Return Status    AppiumLibrary.Page Should Contain Element    ${list.enrollee.primary_id.new}
        Run Keyword If    '${primaryid_status}'=='True'    Get Enrollee PrimaryId Text    ${list.enrollee.primary_id.new}
        ${list.enrollee.organization.new}    Update Dynamic Value    ${list.enrollee.organization}    ${value}
        ${organization_status}    Run Keyword And Return Status    AppiumLibrary.Page Should Contain Element    ${list.enrollee.organization.new}
        Run Keyword If    '${organization_status}'=='True'    Get Enrollee Organization Text    ${list.enrollee.organization.new}
        log    ${full_name}
        @{enrollee_details_list}    Create List    ${full_name}    ${primary_id}    ${organization}
        Log    ${enrollee_details_list}
        Comment    Run Keyword If    '${fullname_status}'=='True' and '${primaryid_status}'=='True' and '${organization_status}'=='True'    Append To List    ${enrollee_details_list}
        Run Keyword If    '${fullname_status}'=='True' and '${primaryid_status}'=='True' and '${organization_status}'=='True'    Append To List    ${enrollee_main_list}    ${enrollee_details_list}
        Comment    Run Keyword If    '${fullname_status}'=='False' and '${primaryid_status}'=='False' and '${organization_status}'=='True'    Append To List    ${enrollee_details_list}    ${organization_status}
    END

Validate Enrollee List Details
    [Arguments]    ${app_enrollee_list}    ${db_enrollee_list}
    ${status}=    CustomLibrary.Nested List Compare    ${app_enrollee_list}    ${db_enrollee_list}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Enrollee List details in Mobile app does not match with database list
    ...    ELSE    Log    Enrollee List details in Mobile app match with database list

Get Enrollee FullName Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${full_name}    ${value}
    Log    ${full_name}

Get Enrollee PrimaryId Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${primary_id}    ${value}
    log    ${primary_id}

Get Enrollee Organization Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${organization}    ${value}
    log    ${organization}

Cancel change account organization
    AppiumLibrary.Wait Until Element Is Visible    ${button.schemas.cancel}    ${MEDIUM_WAIT}    Cancel button is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.schemas.cancel}
    AppiumLibrary.Wait Until Element Is Visible    ${button.account.change_ori}    ${MEDIUM_WAIT}    Change Organization is not visible after waitng ${MEDIUM_WAIT} seconds
    mobile_common.Select Navigation Tab    Dashboard

Update Account Organization
    comment    Click on update button
    AppiumLibrary.Wait Until Element Is Visible    ${button.editenrollee.update}    ${MEDIUM_WAIT}    Update button is not visible after waitng ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.editenrollee.update}
    sleep    5s
    Comment    Verify the page is navigated to Dashboard after update
    ${dashboard_page_status}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${label.dashboard_title}    ${LONG_WAIT}
    Run Keyword And Continue On Failure    AppiumLibrary.Element Should Be Visible    ${label.dashboard_title}    ${LONG_WAIT}
    Run Keyword If    '${dashboard_page_status}'=='False'    mobile_common.Select Navigation Tab    Dashboard

Select Organizations
    [Arguments]    ${select_ori_data}
    Run Keyword If    '${select_ori_data}'!='NA'    Change Organization    ${select_ori_data}

Perform Update or Cancel operation
    [Arguments]    ${update}
    Comment    Cancel/Update the Organization
    Log    '${update}'=='True'
    Run Keyword If    '${update}'=='True'    mobile_account.Update Account Organization
    ...    ELSE    mobile_account.Cancel change account organization
    Comment    Run Keyword If    '${Change_ori_data}[Cancel]'=='True'    mobile_account.Cancel the Organization    ${Change_ori_data}
    ...    ELSE    mobile_account.Update the Organization    ${Change_ori_data}

Get All Device details from Inventory List and Validate
    [Arguments]    ${account_organization}
    Comment    Select Account Tab
    mobile_common.Select Navigation Tab    Account
    Comment    Get all device name and organization from Inventory list view
    mobile_account.Get All Device details from Inventory List
    Comment    Get all device name and organization from database for given organization list
    ${db_device_list}=    CustomLibrary.Get All Inventory Details From Database    ${account_organization}
    Comment    Verify the enrollee list dispayed in Mobile app matches with database details
    mobile_account.Validate Device List Details    ${device_main_list}    ${db_device_list}

Get All Device details from Inventory List
    Sleep    2s
    @{EmptyList}    Create List
    @{device_main_list}    Create List
    Set Global Variable    ${device_main_list}    ${EmptyList}
    FOR    ${value}    IN RANGE    1    30
        sleep    5s
        ${device_count}    Get Matching Xpath Count    ${list.inventory.devices}
        Log    ${device_count}
        Get An Inventory Device Details    ${device_count}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.list.no_more_elements}    ${SHORT_WAIT}
        Log    ${device_main_list}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    3
    END

Get Inventory Device Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${device_id}    ${value}
    Log    ${device_id}

Get Inventory Device Organization Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${organization}    ${value}
    Log    ${organization}

Get An Inventory Device Details
    [Arguments]    ${device_count}
    FOR    ${value}    IN RANGE    1    ${device_count}+1
        ${value}    Convert To String    ${value}
        ${list.inventory.device_id.new}    Update Dynamic Value    ${list.inventory.device_id}    ${value}
        ${device_id_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.inventory.device_id.new}    1s
        Run Keyword If    '${device_id_status}'=='True'    Get Inventory Device Text    ${list.inventory.device_id.new}
        ${list.inventory.device_organization.new}    Update Dynamic Value    ${list.inventory.device_organization}    ${value}
        ${device_organization}    Run Keyword And Return Status    AppiumLibrary.Page Should Contain Element    ${list.inventory.device_organization.new}
        Run Keyword If    '${device_organization}'=='True'    Get Inventory Device Organization Text    ${list.inventory.device_organization.new}
        log    ${device_id}
        @{device_details_list}    Create List    ${device_id}    ${organization}
        Log    ${device_main_list}
        Run Keyword If    '${device_id_status}'=='True' and '${device_organization}'=='True'    Append To List    ${device_main_list}    ${device_details_list}
    END

Validate Device List Details
    [Arguments]    ${app_device_list}    ${db_device_list}
    ${status}=    CustomLibrary.Nested List Compare    ${app_device_list}    ${db_device_list}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Device List details in Mobile app does not match with database list
    ...    ELSE    Log    Device List details in Mobile app match with database list

Get text of agentname
    [Documentation]    Get text of Agent name,last name
    AppiumLibrary.Wait Until Element Is Visible    ${label.account.agentname}    ${LONG_WAIT}    Agent name,last name is not visible after waiting ${LONG_WAIT} seconds
    ${agent_name}    AppiumLibrary.Get Text    ${label.account.agentname}
    [Return]    ${agent_name}

Validate Agent name
    [Arguments]    ${expected_agent_name}    ${agent_name}
    Should Be Equal As Strings    ${expected_agent_name}    ${agent_name}    ${expected_agent_name} agent name is not matched with ${agent_name} \ agent name
    Comment    ${source}    AppiumLibrary.Get Source
    Comment    log    ${source}
    Comment    AppiumLibrary.Page Should Contain Element    ${expected_agent_name}    ${expected_agent_name} agent name is not matched with ${agent_name} \ agent name

Click and validate About
    [Documentation]    Click on About button it should show VeriTracks app information
    AppiumLibrary.Wait Until Element Is Visible    ${button.account.about}    ${LONG_WAIT}    About button is not visible after ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${button.account.about}
    AppiumLibrary.Wait Until Element Is Visible    ${label.account.Veritracks}    ${LONG_WAIT}    VeriTracks label is not visible after waiting${LONG_WAIT} seconds

Select Feedback
    AppiumLibrary.Wait Until Element Is Visible    ${lable.account.Feedback}    ${MEDIUM_WAIT}    Feedback is not visible after waiting ${MEDIUM_WAIT}.
    AppiumLibrary.Click Element    ${lable.account.Feedback}

Validate Account title
    AppiumLibrary.Wait Until Element Is Visible    ${lable.account.Account}    ${MEDIUM_WAIT}    Account is not visible after waiting ${MEDIUM_WAIT}.

Validate feedback sending notification
    AppiumLibrary.Page Should Contain Text    ${images.account.feedback_sending_message}    Sending Feedback.. feedback notification is visible.

Validate feedback received notification
    AppiumLibrary.Page Should Contain Text    ${images.account.feedback_received_message}    "Feedback received" feedback notification is visible.

Validate feedback error notification
    AppiumLibrary.Page Should Contain Text    ${images.account.feedback_error_message}    "This field is required" feedback notification is visible.

Send Feedback Message
    [Arguments]    ${feedback text}    ${action}=NA
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.account.Please_enter_Feedback}    ${MEDIUM_WAIT}    Please_enter_Feedback is not visible after waiting ${MEDIUM_WAIT}.
    AppiumLibrary.Click Element    ${textbox.account.Please_enter_Feedback}
    mobile_common.Input Text    ${textbox.account.Please_enter_Feedback}    ${feedback text}
    Comment    AppiumLibrary.Wait Until Element Is Visible    ${button.account.send}    ${MEDIUM_WAIT}    Please_enter_Feedback is not visible after waiting ${MEDIUM_WAIT}.
    Run Keyword If    '${action}' != 'NA'    mobile_account.Navigate to Previous Page
    ...    ELSE    AppiumLibrary.Click Element    ${button.account.send}

Update Map Settings
    [Arguments]    ${map_setting_text}
    ${button.account.map_settings.new}    Update Dynamic Value    ${button.account.map_settings}    ${map_setting_text}
    AppiumLibrary.Wait Until Element Is Visible    ${button.account.map_settings.new}    ${SHORT_WAIT}    ${map_setting_text} map setting button is not visible after waiting ${SHORT_WAIT} seconds
    AppiumLibrary.Click Element    ${button.account.map_settings.new}

Validate Map Type
    [Arguments]    ${map_type}
    AppiumLibrary.Wait Until Element Is Visible    ${images.maptype}    ${LONG_WAIT}
    Run Keyword And Ignore Error    AppiumLibrary.Element Attribute Should Match    ${images.maptype}    content-desc    ${map_type}    ${map_type} map screen is not visible

Get Inventory Device Product Name
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${product_name}    ${value}
    Log    ${product_name}

Get Inventory Contact Date
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${contact_date}    ${value}
    Log    ${contact_date}

Get Inventory Reported Date
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${reported_date}    ${value}
    Log    ${reported_date}

Get Inventory Device Status
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${deviceid_status}    ${value}
    Log    ${deviceid_status}

Navigate to Previous Page
    AppiumLibrary.Wait Until Element Is Visible    ${button.enrollee_profile.back_arrow}    ${SHORT_WAIT}    Back Arrow button is not visible.
    AppiumLibrary.Click Element    ${button.enrollee_profile.back_arrow}

Validate Privacy Policy
    AppiumLibrary.Wait Until Element Is Visible    ${buttton.signin.Privacy Policy}    ${LONG_WAIT}    Privacy Policy button is not visible after waiting ${LONG_WAIT} seconds
    AppiumLibrary.Click Element    ${buttton.signin.Privacy Policy}
    AppiumLibrary.Wait Until Element Is Visible    ${label.sigin.Privacy Policy.Privacy and Data Processing Policy}    ${LONG_WAIT}    Privacy and Data Processing Policy label is not visible after waiting ${LONG_WAIT} seconds
