*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Select Device from Inventory
    [Arguments]    ${device_status}    ${device_org}
    ${label.inventory.device.new}    Update Dynamic Values    ${label.inventory.device}    ${device_status}    ${device_org}
    AppiumExtendedLibrary.Swipe Down To Element    ${label.inventory.device.new}    5
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device.new}    ${MEDIUM_WAIT}    Device with expected details is not visible.
    AppiumExtendedLibrary.Swipe Down To Element    ${label.inventory.device.new}
    AppiumLibrary.Click Element    ${label.inventory.device.new}
    AppiumLibrary.Wait Until Element Is Visible    ${button.inventory.unassigned.edit}    ${MEDIUM_WAIT}    Edit button is not visible.

Navigate to Edit Inventory Device Details
    AppiumLibrary.Click Element    ${button.inventory.unassigned.edit}
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.unassigned.edit_device}    ${MEDIUM_WAIT}    Edit device page is not displayed

Update Device Details
    [Arguments]    ${update_value}
    ${label.inventory.unassigned.edit_detail.new}    Update Dynamic Value    ${label.inventory.unassigned.edit_detail}    ${update_value}
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.unassigned.edit_detail.new}    ${MEDIUM_WAIT}    Expected Device Status is not visible
    AppiumLibrary.Click Element    ${label.inventory.unassigned.edit_detail.new}
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.unassigned.edit_device}    ${MEDIUM_WAIT}    Edit device page is not displayed
    AppiumLibrary.Wait Until Element Is Visible    ${button.inventory.edit.details.save}    ${MEDIUM_WAIT}    Save button is not visible
    AppiumLibrary.Click Element    ${button.inventory.edit.details.save}
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.unassigned.edit_device}    ${MEDIUM_WAIT}    Device details page is not visible

Validate Inventory Device Details
    [Arguments]    ${device_detail}
    ${label.inventory.unassigned.details.new}    Update Dynamic Value    ${label.inventory.unassigned.details}    ${device_detail}
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.unassigned.details.new}    ${LONG_WAIT}    Device details is not updated

Select an assigned device
    [Arguments]    ${device_type}
    ${list.inventory.device.new}    mobile_common.Update Dynamic Value    ${list.inventory.device}    ${device_type}
    Swipe Down To Element    ${list.inventory.device.new}    5
    AppiumLibrary.Wait Until Element Is Visible    ${list.inventory.device.new}    ${LONG_WAIT}    There are no Assigned devices are available to select
    sleep    5s
    AppiumLibrary.Click Element    ${list.inventory.device.new}

Perform device action from inventory
    [Arguments]    ${ICON}
    AppiumLibrary.Wait Until Element Is Visible    ${images.inventory.${ICON}}    ${MEDIUM_WAIT}    ${icon} icon is not diplayed after waiting ${MEDIUM_WAIT}
    comment    click on ${ICON} operation
    AppiumLibrary.Click Element    ${images.inventory.${ICON}}
    AppiumLibrary.Wait Until Element Is Visible    ${button.common.action}    ${LONG_WAIT}    Send button is not diplayed after waiting ${LONG_WAIT} seconds
    comment    click on send button
    AppiumLibrary.Click Element    ${button.common.action}

Get Device Id
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device_id}    ${MEDIUM_WAIT}    device id is not visible after waiting ${MEDIUM_WAIT}
    ${deviceId}    AppiumLibrary.Get Text    ${label.inventory.device_id}
    [Return]    ${deviceId}

Cancel the update changes
    AppiumLibrary.Wait Until Element Is Visible    ${button.schemas.cancel}    ${MEDIUM_WAIT}    Cancel button is not displayed after witing ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.schemas.cancel}
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.unassigned.edit_device}    ${MEDIUM_WAIT}    Edit device page is not displayed
    AppiumLibrary.Wait Until Element Is Visible    ${button.schemas.cancel}    ${MEDIUM_WAIT}    Cancel button is not displayed after witing ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.schemas.cancel}

Validate Inventory Devices
    [Arguments]    ${validate_data}
    @{devices_list}    Split String    ${validate_data}    |
    FOR    ${device_name}    IN    @{devices_list}
        ${list.device.new}    Update Dynamic Value    ${list.enrollee.org}    ${device_name}
        ${status}    Run Keyword And Return Status    AppiumExtendedLibrary.Swipe Down To Element    ${list.device.new}    5
        Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    ${org} is not found in Organizations list
        sleep    2s
        Run Keyword And Continue On Failure    AppiumLibrary.Wait Until Element Is Visible    ${list.device.new}    ${MEDIUM_WAIT}    ${device_name} is not displayed after waiting ${MEDIUM_WAIT} seconds
    END

Select Edit Organization
    [Arguments]    ${edit_org_name}
    ${button.inventory.edit.org.new}    Update Dynamic Value    ${button.inventory.edit_org}    ${edit_org_name}
    AppiumLibrary.Wait Until Element Is Visible    ${button.inventory.edit.org.new}    ${MEDIUM_WAIT}    Edit Organization is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.inventory.edit.org.new}
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.inventory.edit.list}    ${LONG_WAIT}    Edit Organizations list is not visible after waiting ${MEDIUM_WAIT} seconds

Select Edit Device Status
    [Arguments]    ${edit_device_status}
    ${button.inventory.edit_device_status.new}    Update Dynamic Value    ${button.inventory.edit_device_status}    ${edit_device_status}
    AppiumLibrary.Wait Until Element Is Visible    ${button.inventory.edit_device_status.new}    ${MEDIUM_WAIT}    Edit Device Status is not visible after waiting ${MEDIUM_WAIT} seconds
    AppiumLibrary.Click Element    ${button.inventory.edit_device_status.new}
    sleep    2s
    AppiumLibrary.Wait Until Element Is Visible    ${list.inventory.edit.list}    ${LONG_WAIT}    Edit Device Statused list is not visible after waiting ${MEDIUM_WAIT} seconds

Select Device with Status
    [Arguments]    ${device_pattern}    ${device_status}
    ${label.inventory.device.new}    Update Dynamic Values    ${label.inventory.device_num}    ${device_pattern}    ${device_status}
    sleep    3s
    AppiumExtendedLibrary.Swipe Down To Element    ${label.inventory.device.new}    5
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device.new}    ${MEDIUM_WAIT}    Device with expected details is not visible.
    AppiumExtendedLibrary.Swipe Down To Element    ${label.inventory.device.new}
    AppiumLibrary.Click Element    ${label.inventory.device.new}

Validate Toast Message
    Comment    AppiumLibrary.Wait Until Element Is Visible    ${images.inventory.locate}    ${MEDIUM_WAIT}    locate icon is not diplayed after waiting ${MEDIUM_WAIT}
    AppiumLibrary.Wait Until Element Is Visible    ${image.inventory.trackpoint}    ${MEDIUM_WAIT}    trackpoint icon is not diplayed after waiting ${MEDIUM_WAIT}
    AppiumLibrary.Click Element    ${image.inventory.trackpoint}
    sleep    310ms
    Comment    AppiumLibrary.Get Matching Xpath Count    ${images.map.toast_message}
    AppiumLibrary.Page Should Contain Element    ${images.map.toast_message}
    Comment    AppiumLibrary.Get Text    ${images.map.toast_message}

Select a device
    [Arguments]    ${device_type}
    ${list.inventory.device.new}    mobile_common.Update Dynamic Value    ${list.inventory.device}    ${device_type}
    Swipe Down To Element    ${list.inventory.device.new}    5
    AppiumLibrary.Wait Until Element Is Visible    ${list.inventory.device.new}    ${LONG_WAIT}    There are no Assigned devices are available to select
    sleep    5s
    AppiumLibrary.Click Element    ${list.inventory.device.new}

Get the Selected Device Details
    sleep    3s
    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.selectedDevice_device_id}    ${MEDIUM_WAIT}    ${label.inventory.selectedDevice_device_id} is not visible after waiting ${MEDIUM_WAIT} seconds
    ${inventory_device_serialnumber}=    AppiumLibrary.Get Text    ${label.inventory.selectedDevice_device_id}
    ${inventory_device_productname}=    AppiumLibrary.Get Text    ${label.inventory.selectedDevice_device_name}
    ${inventory_device_organization}=    AppiumLibrary.Get Text    ${label.inventory.selectedDevice_device_organization}
    ${inventory_device_contactdate}=    AppiumLibrary.Get Text    ${label.inventory.selectedDevice_device_location}
    ${inventory_device_reportdate}=    AppiumLibrary.Get Text    ${label.inventory.selectedDevice_device_phoneNo}
    ${inventory_device_status}=    AppiumLibrary.Get Text    ${label.inventory.selectedDevice_device_Assignment}
    ${inventory_Device_data}    Create Dictionary    DEVICE_SERIALNUMER=${inventory_device_serialnumber}    DEVICE_PRODUCTNAME=${inventory_device_productname}    DEVICE_ORGANIZATIONNAME=${inventory_device_organization}    DEVICE_CONTACTDATE=${inventory_device_contactdate}    DEVICE_REPORTEDDATE=${inventory_device_reportdate}    DEVICE_STATUS=${inventory_device_status}
    [Return]    ${inventory_Device_data}

Validate Device Assignment Details
    [Arguments]    ${act_data}    ${device_id}
    Comment    Get Enrollee details from database for given fullname
    Log    ${act_data}
    &{exp_data}=    CustomLibrary.get_inventory_device_details_from_database    ${device_id}
    Comment    Validate enrollee First Name details
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[ORI_TXT]    ${act_data}[DEVICE_ORGANIZATIONNAME]    Organization Name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[DEVICE_STATUS_TXT]    ${act_data}[DEVICE_STATUS]    Device status details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[PRODUCT_NAME]    ${act_data}[DEVICE_PRODUCTNAME]    Device name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[SERIALNUMBER]    ${act_data}[DEVICE_SERIALNUMER]    Device id details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[CONTACT_DATE]    ${act_data}[DEVICE_CONTACTDATE]    Device location details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data}[REPORTED_DATE]    ${act_data}[DEVICE_REPORTEDDATE]    Device phone number details doesn't match.

Get all inventory details from inventory list and Validate
    [Arguments]    ${org}
    Sleep    2s
    @{inventory_main_list}    Create List
    Set Global Variable    ${inventory_main_list}
    ${inventory_values_db}    CustomLibrary.Get Inventory Details From Database    ${org}
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        ${enrollees_count}    Convert To String    ${enrollees_count}
        ${label.inventory.device_number.new}    Update Dynamic Value    ${label.inventory.device_number}    ${enrollees_count}
        ${device_text1}    AppiumLibrary.Get Text    ${label.inventory.device_number.new}
        Get Inventory details from list    ${enrollees_count}
        AppiumExtendedLibrary.swipe down    1
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.list.no_more_elements}    ${SHORT_WAIT}
        Log    ${device_main_list}
        Exit For Loop If    ${status}==True
    END
    log    ${time_zone_main_list}
    ${status}    CustomLibrary.Nested List Compare    ${inventory_main_list}    ${inventory_values_db}
    Run Keyword And Continue On Failure    Run Keyword If    '${status}'=='False'    Log    Inventory details list in Mobile app does not matched with database list
    ...    ELSE    Log    Inventory details List in Mobile app matched with database list

Get Inventory details from list
    [Arguments]    ${inventory_count}
    FOR    ${value}    IN RANGE    1    ${inventory_count}+1
        ${value}    Convert To String    ${value}
        Comment    Get text for device id
        ${label.inventory.device_number.new}    Update Dynamic Value    ${label.inventory.device_number}    ${value}
        ${device_id_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device_number.new}    ${SHORT_WAIT}
        Run Keyword If    '${device_id_status}'=='True'    Get Inventory Device Text    ${label.inventory.device_number.new}
        Comment    Get text for Product Name
        ${label.inventory.device_productname.new}    Update Dynamic Value    ${label.inventory.device_productname}    ${value}
        ${product_name_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device_productname.new}    ${SHORT_WAIT}
        Run Keyword If    '${product_name_status}'=='True'    Get Inventory Device Product Name    ${label.inventory.device_productname.new}
        Comment    Get text for organization
        ${label.inventory.organization.new}    Update Dynamic Value    ${label.inventory.organization}    ${value}
        ${org_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.organization.new}    ${SHORT_WAIT}
        Run Keyword If    '${org_status}'=='True'    Get Inventory Device Organization Text    ${label.inventory.organization.new}
        Comment    Get text for contact date
        ${label.inventory.device_contactdate.new}    Update Dynamic Value    ${label.inventory.device_contactdate}    ${value}
        ${contactdate_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device_contactdate.new}    ${SHORT_WAIT}
        Run Keyword If    '${contactdate_status}'=='True'    Get Inventory Contact Date    ${label.inventory.device_contactdate.new}
        Comment    Get text for reported date
        ${label.inventory.device_reported_date.new}    Update Dynamic Value    ${label.inventory.device_reported_date}    ${value}
        ${reporteddate_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device_reported_date.new}    ${SHORT_WAIT}
        Run Keyword If    '${reporteddate_status}'=='True'    Get Inventory Reported Date    ${label.inventory.device_reported_date.new}
        Comment    Get text for device status
        ${label.inventory.device_status.new}    Update Dynamic Value    ${label.inventory.device_status}    ${value}
        ${device_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.inventory.device_status.new}    ${SHORT_WAIT}
        Run Keyword If    '${device_status}'=='True'    Get Inventory Device Status    ${label.inventory.device_status.new}
        @{inventory_device_details_list}    Create List    ${device_id}    ${product_name}    ${organization}    ${contact_date}    ${reported_date}    ${deviceid_status}
        Log    ${inventory_device_details_list}
        Run Keyword If    '${device_id_status}'=='True' and '${product_name_status}'=='True' and '${org_status}'=='True' and '${contactdate_status}'=='True' and '${reporteddate_status}'=='True' and '${device_status}'=='True'    Append To List    ${inventory_main_list}    ${inventory_device_details_list}
    END
