*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Validate Device Track values with database
    [Arguments]    ${tc_name}    ${ct_device_id}
    Run Keyword If    ${exp_data_device_track}==None    Fail    VT_DEVICE.DEVICE_TRACK - Query Executed successfully but query fetched No records for Expected Data.
    ${VT_DEVICE_DEVICE_TRACK}=    Set Variable    Select ${VT_DEVICE_DEVICE_TRACK_Columns} FROM VT_DEVICE.DEVICE_TRACK WHERE CT_DEVICE_ID=${ct_device_id} and track_date = to_date('12-OCT-21 02:34:52','dd-mon-yy hh24:mi:ss')
    ${act_data}=    CustomLibrary.Get Details From Database    ${VT_DEVICE_DEVICE_TRACK}    VT_DEVICE
    Set Test Variable    @{failure_messages}
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    VT_DEVICE.DEVICE_TRACK - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_TRACK,Query Executed successfully but query fetched No records.
    ...    AND    Fail    VT_DEVICE.DEVICE_TRACK - Query Executed successfully but query fetched No records.
    Set Test Variable    ${device_contact_id}    ${act_data}[DEVICE_CONTACT_ID]
    Comment    Validate Device Track details in Database
    FOR    ${key}    IN    @{exp_data_device_track.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${exp_data_device_track}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${exp_data_device_track}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_device_track}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_device_track}[${key}]    ${act_data}[${key}]    VT_DEVICE.DEVICE_TRACK - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_TRACK,expected '${key}' is not matched with actual '${key}' ${exp_data_device_track}[${key}] != ${act_data}[${key}]
    END

Validate Device Contact values with database
    [Arguments]    ${tc_name}    ${ct_device_id}
    Run Keyword If    ${exp_data_device_contact}==None    Fail    VT_DEVICE.DEVICE_CONTACT - Query Executed successfully but query fetched No records for Expected Data.
    ${VT_DEVICE_DEVICE_CONTACT}=    Set Variable    Select ${VT_DEVICE.DEVICE_CONTACT_Columns} FROM VT_DEVICE.DEVICE_CONTACT WHERE CT_DEVICE_ID=${ct_device_id}
    ${act_data}=    CustomLibrary.Get Details From Database    ${VT_DEVICE_DEVICE_CONTACT}    VT_DEVICE
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    VT_DEVICE.DEVICE_CONTACT - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_CONTACT,Query Executed successfully but query fetched No records.
    ...    AND    Fail    VT_DEVICE.DEVICE_CONTACT - Query Executed successfully but query fetched No records.
    Set Test Variable    ${device_contact_id}    ${act_data}[DEVICE_CONTACT_ID]
    Comment    Validate Device Contact details in Database
    FOR    ${key}    IN    @{exp_data_device_contact.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${exp_data_device_contact}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${exp_data_device_contact}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_device_contact}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_device_contact}[${key}]    ${act_data}[${key}]    VT_DEVICE.DEVICE_CONTACT - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_CONTACT,expected '${key}' is not matched with actual '${key}' ${exp_data_device_contact}[${key}] != ${act_data}[${key}]
    END

Validate Device Last Contact values with database
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}
    Run Keyword If    ${exp_data_device_last_contact}==None    Fail    VT_DEVICE.DEVICE_LAST_CONTACT - Query Executed successfully but query fetched No records for Expected Data.
    ${VT_DEVICE_DEVICE_LAST_CONTACT}=    Set Variable    Select ${VT_DEVICE.DEVICE_LAST_CONTACT_Columns} FROM VT_DEVICE.DEVICE_LAST_CONTACT WHERE CT_DEVICE_ID=${ct_device_id} and Reported_Month = ${reported_month}
    ${act_data}=    CustomLibrary.Get Details From Database    ${VT_DEVICE_DEVICE_LAST_CONTACT}    VT_DEVICE
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    VT_DEVICE.DEVICE_LAST_CONTACT - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_LAST_CONTACT,Query Executed successfully but query fetched No records.
    ...    AND    Fail    VT_DEVICE.DEVICE_LAST_CONTACT - Query Executed successfully but query fetched No records.
    Comment    Validate Device Last Contact details in Database
    FOR    ${key}    IN    @{exp_data_device_last_contact.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${exp_data_device_last_contact}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${exp_data_device_last_contact}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_device_last_contact}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_device_last_contact}[${key}]    ${act_data}[${key}]    VT_DEVICE.DEVICE_LAST_CONTACT - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_LAST_CONTACT,expected '${key}' is not matched with actual '${key}' ${exp_data_device_last_contact}[${key}] != ${act_data}[${key}]
    END

Validate Device Event values with database
    [Arguments]    ${tc_name}    ${ct_device_id}    ${event_id}
    Run Keyword If    ${exp_data_device_event}==None    Fail    VT_DEVICE.DEVICE_EVENT - Query Executed successfully but query fetched No records for Expected Data.
    ${VT_DEVICE_DEVICE_EVENT}=    Set Variable    Select ${VT_DEVICE.DEVICE_EVENT_Columns} FROM VT_DEVICE.DEVICE_EVENT WHERE CT_DEVICE_ID=${ct_device_id} and Event_id = ${event_id}
    ${act_data}=    CustomLibrary.Get Details From Database    ${VT_DEVICE_DEVICE_EVENT}    VT_DEVICE
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    VT_DEVICE.DEVICE_EVENT - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_EVENT,Query Executed successfully but query fetched No records.
    ...    AND    Fail    ${tc_name},VT_DEVICE.DEVICE_EVENT,Query Executed successfully but query fetched No records.
    Comment    Validate Device Event values with database
    FOR    ${key}    IN    @{exp_data_device_event.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Split Date    ${exp_data_device_event}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE' or '${key}' =='CREATED_DATE'    Set To Dictionary    ${exp_data_device_event}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_device_event}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_device_event}[${key}]    ${act_data}[${key}]    VT_DEVICE.DEVICE_EVENT - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_EVENT,expected '${key}' is not matched with actual '${key}' ${exp_data_device_event}[${key}] != ${act_data}[${key}]
    END

Get DEVICE_TRACK table values
    [Arguments]    ${tc_name}    ${ct_device_id}
    ${VT_DEVICE_DEVICE_TRACK}=    Set Variable    Select ${VT_DEVICE_DEVICE_TRACK_Columns} FROM VT_DEVICE.DEVICE_TRACK WHERE CT_DEVICE_ID=${ct_device_id} and track_date = to_date('12-OCT-21 02:34:52','dd-mon-yy hh24:mi:ss')
    ${exp_data_device_track}=    CustomLibrary.Get Details From Database    ${VT_DEVICE_DEVICE_TRACK}    VT_DEVICE
    Set Test Variable    ${exp_data_device_track}
    Run Keyword If    ${exp_data_device_track}==None    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_TRACK,Expected DEVICE_TRACK table Query Executed successfully but query fetched No records

Get DEVICE_CONTACT table values
    [Arguments]    ${tc_name}    ${ct_device_id}
    ${VT_DEVICE.DEVICE_CONTACT}=    Set Variable    Select ${VT_DEVICE.DEVICE_CONTACT_Columns} FROM VT_DEVICE.DEVICE_CONTACT WHERE CT_DEVICE_ID=${ct_device_id}
    ${exp_data_device_contact}=    CustomLibrary.Get Details From Database    ${VT_DEVICE.DEVICE_CONTACT}    VT_DEVICE
    Set Test Variable    ${exp_data_device_contact}
    Set Test Variable    ${device_contact_id}    ${exp_data_device_contact}[DEVICE_CONTACT_ID]
    Run Keyword If    ${exp_data_device_contact}==None    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_CONTACT,Expected DEVICE_CONTACT table Query Executed successfully but query fetched No records

Get DEVICE_LAST_CONTACT table values
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}
    ${VT_DEVICE.DEVICE_LAST_CONTACT}=    Set Variable    Select ${VT_DEVICE.DEVICE_LAST_CONTACT_Columns} FROM VT_DEVICE.DEVICE_LAST_CONTACT WHERE CT_DEVICE_ID=${ct_device_id} and Reported_Month = ${reported_month}
    ${exp_data_device_last_contact}=    CustomLibrary.Get Details From Database    ${VT_DEVICE.DEVICE_LAST_CONTACT}    VT_DEVICE
    Set Test Variable    ${exp_data_device_last_contact}
    Run Keyword If    ${exp_data_device_last_contact}==None    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_LAST_CONTACT,Expected DEVICE_LAST_CONTACT table Query Executed successfully but query fetched No records.

Get DEVICE_EVENT table values
    [Arguments]    ${tc_name}    ${ct_device_id}    ${event_id}
    ${VT_DEVICE.DEVICE_EVENT}=    Set Variable    Select ${VT_DEVICE.DEVICE_EVENT_Columns} FROM VT_DEVICE.DEVICE_EVENT WHERE CT_DEVICE_ID=${ct_device_id} and Event_id = ${event_id}
    ${exp_data_device_event}=    CustomLibrary.Get Details From Database    ${VT_DEVICE.DEVICE_EVENT}    VT_DEVICE
    Set Test Variable    ${exp_data_device_event}
    Run Keyword If    ${exp_data_device_event}==None    Append To List    ${failure_messages}    ${tc_name},VT_DEVICE.DEVICE_EVENT,Expected DEVICE_EVENT table Query Executed successfully but query fetched No records
