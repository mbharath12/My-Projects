*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Validate Open Vios details with database
    [Arguments]    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}
    Run Keyword If    ${exp_data_open_vios}==None    Fail    A1CLIENT04.TO_OPEN_VIOS - Query Executed successfully but query fetched No records for Expected Data.
    ${A1_CLIENT_TO_OPEN_VIOS}=    Set Variable    Select ${TO_OPEN_VIOS_Columns} FROM A1CLIENT04.TO_OPEN_VIOS WHERE ct_device_id=${ct_device_id} and CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id} and Open_Flag = 'Y'
    ${act_data}=    CustomLibrary.Get Details From Database    ${A1_CLIENT_TO_OPEN_VIOS}    A1CLIENT04
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    A1CLIENT04.TO_OPEN_VIOS - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TO_OPEN_VIOS,Query Executed successfully but query fetched No records.
    ...    AND    Fail    A1CLIENT04.TO_OPEN_VIOS - Query Executed successfully but query fetched No records.
    Comment    Validate A1CLIENT04.TO_OPEN_VIOS details
    FOR    ${key}    IN    @{exp_data_open_vios.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='START_DT' or '${key}' =='STOP_DT'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='START_DT' or '${key}' =='STOP_DT'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='START_DT' or '${key}' =='STOP_DT'    Split Date    ${exp_data_open_vios}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='START_DT' or '${key}' =='STOP_DT'    Set To Dictionary    ${exp_data_open_vios}    ${key}    ${date}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_open_vios}[${key}]    ${act_data}[${key}]    A1CLIENT04.TO_OPEN_VIOS - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TO_OPEN_VIOS,expected '${key}' is not matched with actual '${key}' ${exp_data_open_vios}[${key}] != ${act_data}[${key}]
    END

Validate Tracked Offender Last Contact details with database
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}
    Run Keyword If    ${exp_data_tracked_offernder_last_contact}==None    Fail    A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT - Query Executed successfully but query fetched No records for Expected Data.
    ${A1_CLIENT_TRACKED_OFFENDER_LAST_CONTACT}=    Set Variable    Select ${TRACKED_OFFENDER_LAST_CONTACT_Columns} FROM VT_DEVICE.DEVICE_LAST_CONTACT WHERE CT_DEVICE_ID=${ct_device_id} and Reported_Month = ${reported_month}
    ${act_data}=    CustomLibrary.Get Details From Database    ${A1_CLIENT_TRACKED_OFFENDER_LAST_CONTACT}    A1CLIENT04
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT,Query Executed successfully but query fetched No records.
    ...    AND    Fail    A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT - Query Executed successfully but query fetched No records.
    Set Test Variable    ${device_contact_id}    ${act_data}[DEVICE_CONTACT_ID]
    Comment    Validate A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT details
    FOR    ${key}    IN    @{exp_data_tracked_offernder_last_contact.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Split Date    ${exp_data_tracked_offernder_last_contact}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Set To Dictionary    ${exp_data_tracked_offernder_last_contact}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_tracked_offernder_last_contact}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_tracked_offernder_last_contact}[${key}]    ${act_data}[${key}]    A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT,expected '${key}' is not matched with actual '${key}' ${exp_data_tracked_offernder_last_contact}[${key}] != ${act_data}[${key}]
    END

Validate Tracked Offender summary details with database
    [Arguments]    ${tc_name}    ${ct_tracked_offender_id}
    Run Keyword If    ${exp_data_tracked_offender_sum}==None    Fail    a1client04.TRACKED_OFFENDER_SUMMARY - Query Executed successfully but query fetched No records for Expected Data.
    ${A1_CLIENT_TRACKED_OFFENDER_SUMMARY}=    Set Variable    Select ${TRACKED_OFFENDER_SUMMARY_columns} from a1client04.TRACKED_OFFENDER_SUMMARY where CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id}
    ${act_data}=    CustomLibrary.Get Details From Database    ${A1_CLIENT_TRACKED_OFFENDER_SUMMARY}    A1CLIENT04
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    a1client04.TRACKED_OFFENDER_SUMMARY - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_SUMMARY,Query Executed successfully but query fetched No records.
    ...    AND    Fail    a1client04.TRACKED_OFFENDER_SUMMARY - Query Executed successfully but query fetched No records.
    Comment    Validate a1client04.TRACKED_OFFENDER_SUMMARY details
    FOR    ${key}    IN    @{exp_data_tracked_offender_sum.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='CREATED_DATE' or '${key}' =='UPDATED_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='CREATED_DATE' or '${key}' =='UPDATED_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='CREATED_DATE' or '${key}' =='UPDATED_DATE'    Split Date    ${exp_data_tracked_offender_sum}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='CREATED_DATE' or '${key}' =='UPDATED_DATE'    Set To Dictionary    ${exp_data_tracked_offender_sum}    ${key}    ${date}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_tracked_offender_sum}[${key}]    ${act_data}[${key}]    a1client04.TRACKED_OFFENDER_SUMMARY - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_SUMMARY,expected '${key}' is not matched with actual '${key}' ${exp_data_tracked_offender_sum}[${key}] != ${act_data}[${key}]
    END

Validate Tracked Offender track details with database
    [Arguments]    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}    ${reported_month}
    Run Keyword If    ${exp_data_tracked_offernder_track_details}==None    Fail    A1CLIENT04.TRACKED_OFFENDER_TRACK - Query Executed successfully but query fetched No records for Expected Data.
    ${A1_CLIENT_TRACKED_OFFENDER_TRACK}=    Set Variable    Select ${TRACKED_OFFENDER_TRACK_Columns} FROM A1CLIENT04.TRACKED_OFFENDER_TRACK WHERE CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id} and ct_device_id=${ct_device_id} and reported_month = ${reported_month} and track_date = to_date('12-OCT-21 02:34:52','dd-mon-yy hh24:mi:ss')
    ${act_data}=    CustomLibrary.Get Details From Database    ${A1_CLIENT_TRACKED_OFFENDER_TRACK}    A1CLIENT04
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    A1CLIENT04.TRACKED_OFFENDER_TRACK - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_TRACK,Query Executed successfully but query fetched No records.
    ...    AND    Fail    A1CLIENT04.TRACKED_OFFENDER_TRACK - Query Executed successfully but query fetched No records.
    Set Test Variable    ${device_contact_id}    ${act_data}[DEVICE_CONTACT_ID]
    Comment    Validate A1CLIENT04.TRACKED_OFFENDER_TRACK details
    FOR    ${key}    IN    @{exp_data_tracked_offernder_track_details.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE'    Split Date    ${exp_data_tracked_offernder_track_details}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE'    Set To Dictionary    ${exp_data_tracked_offernder_track_details}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_tracked_offernder_track_details}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_tracked_offernder_track_details}[${key}]    ${act_data}[${key}]    A1CLIENT04.TRACKED_OFFENDER_TRACK - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_TRACK,expected '${key}' is not matched with actual '${key}' ${exp_data_tracked_offernder_track_details}[${key}] != ${act_data}[${key}]
    END

Validate Tracked Offender contact details with database
    [Arguments]    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}
    Run Keyword If    ${exp_data_tracked_offernder_contact}==None    Fail    A1CLIENT04.TRACKED_OFFENDER_CONTACT - Query Executed successfully but query fetched No records for Expected Data.
    ${A1_CLIENT_TRACKED_OFFENDER_CONTACT}=    Set Variable    Select ${TRACKED_OFFENDER_CONTACT_Columns} FROM A1CLIENT04.TRACKED_OFFENDER_CONTACT WHERE CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id} and ct_device_id=${ct_device_id} and device_contact_id = ${device_contact_id}
    ${act_data}=    CustomLibrary.Get Details From Database    ${A1_CLIENT_TRACKED_OFFENDER_CONTACT}    A1CLIENT04
    ${status}    Run Keyword And Return Status    Run Keyword If    ${act_data}==None    Fail    A1CLIENT04.TRACKED_OFFENDER_CONTACT - Query Executed successfully but query fetched No records.
    Run Keyword If    '${status}'=='False'    Run Keywords    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_CONTACT,Query Executed successfully but query fetched No records.
    ...    AND    Fail    A1CLIENT04.TRACKED_OFFENDER_CONTACT - Query Executed successfully but query fetched No records.
    Comment    Validate A1CLIENT04_TRACKED_OFFENDER_CONTACT details
    FOR    ${key}    IN    @{exp_data_tracked_offernder_contact.keys()}
        Run Keyword If    '${key}' =='TCName'    Continue For Loop
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Split Date    ${act_data}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Set To Dictionary    ${act_data}    ${key}    ${date}
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Split Date    ${exp_data_tracked_offernder_contact}[${key}]
        Run Keyword And Continue On Failure    Run Keyword If    '${key}' =='REPORTED_DATE' or '${key}' =='CONTACT_DATE'    Set To Dictionary    ${exp_data_tracked_offernder_contact}    ${key}    ${date}
        Run Keyword If    '${key}' =='DEVICE_CONTACT_ID'    Set To Dictionary    ${exp_data_tracked_offernder_contact}    ${key}    ${device_contact_id}
        ${status}    Run Keyword And Return Status    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_data_tracked_offernder_contact}[${key}]    ${act_data}[${key}]    A1CLIENT04.TRACKED_OFFENDER_CONTACT - expected ${key} is not matched with actual ${key}
        Run Keyword If    '${status}'=='False'    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_CONTACT,expected '${key}' is not matched with actual '${key}' ${exp_data_tracked_offernder_contact}[${key}] != ${act_data}[${key}]
    END

Get TO OPEN VIOS table values
    [Arguments]    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}
    ${TO_OPEN_VIOS}=    Set Variable    Select ${TO_OPEN_VIOS_Columns} FROM A1CLIENT04.TO_OPEN_VIOS WHERE ct_device_id=${ct_device_id} and CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id} and Open_Flag = 'Y'
    ${exp_data_open_vios}=    CustomLibrary.Get Details From Database    ${TO_OPEN_VIOS}    A1CLIENT04
    Set Test Variable    ${exp_data_open_vios}
    Run Keyword If    ${exp_data_open_vios}==None    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TO_OPEN_VIOS,Expected TO_OPEN_VIOS table Query Executed successfully but query fetched No records.

Get TRACKED_OFFENDER_LAST_CONTACT table values
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}
    ${TRACKED_OFFENDER_LAST_CONTACT}=    Set Variable    Select ${TRACKED_OFFENDER_LAST_CONTACT_Columns} FROM VT_DEVICE.DEVICE_LAST_CONTACT WHERE CT_DEVICE_ID=${ct_device_id} and Reported_Month = ${reported_month}
    ${exp_data_tracked_offernder_last_contact}=    CustomLibrary.Get Details From Database    ${TRACKED_OFFENDER_LAST_CONTACT}    A1CLIENT04
    Set Test Variable    ${exp_data_tracked_offernder_last_contact}
    Run Keyword If    ${exp_data_tracked_offernder_last_contact}==None    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_LAST_CONTACT,Expected TRACKED_OFFENDER_LAST_CONTACT table Query Executed successfully but query fetched No records.

Get TRACKED_OFFENDER_SUMMARY table values
    [Arguments]    ${tc_name}    ${ct_tracked_offender_id}
    ${TRACKED_OFFENDER_SUMMARY}=    Set Variable    Select ${TRACKED_OFFENDER_SUMMARY_columns} from a1client04.TRACKED_OFFENDER_SUMMARY where CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id}
    ${exp_data_tracked_offender_sum}=    CustomLibrary.Get Details From Database    ${TRACKED_OFFENDER_SUMMARY}    A1CLIENT04
    Set Test Variable    ${exp_data_tracked_offender_sum}
    Run Keyword If    ${exp_data_tracked_offender_sum}==None    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_SUMMARY,Expected TRACKED_OFFENDER_SUMMARY table Executed successfully but query fetched No records.

Get TRACKED_OFFENDER_TRACK table values
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}    ${ct_tracked_offender_id}
    ${TRACKED_OFFENDER_TRACK}=    Set Variable    Select ${TRACKED_OFFENDER_TRACK_Columns} FROM A1CLIENT04.TRACKED_OFFENDER_TRACK WHERE CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id} and ct_device_id=${ct_device_id} and reported_month = ${reported_month} and track_date = to_date('12-OCT-21 02:34:52','dd-mon-yy hh24:mi:ss')
    ${exp_data_tracked_offernder_track_details}=    CustomLibrary.Get Details From Database    ${TRACKED_OFFENDER_TRACK}    A1CLIENT04
    Set Test Variable    ${exp_data_tracked_offernder_track_details}
    Run Keyword If    ${exp_data_tracked_offernder_track_details}==None    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_TRACK,Expected TRACKED_OFFENDER_TRACK table Query Executed successfully but query fetched No records.

Get TRACKED_OFFENDER_CONTACT table values
    [Arguments]    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}
    ${TRACKED_OFFENDER_CONTACT}=    Set Variable    Select ${TRACKED_OFFENDER_CONTACT_Columns} FROM A1CLIENT04.TRACKED_OFFENDER_CONTACT WHERE CT_TRACKED_OFFENDER_ID = ${ct_tracked_offender_id} and ct_device_id=${ct_device_id} and device_contact_id = ${device_contact_id}
    ${exp_data_tracked_offernder_contact}=    CustomLibrary.Get Details From Database    ${TRACKED_OFFENDER_CONTACT}    A1CLIENT04
    Set Test Variable    ${exp_data_tracked_offernder_contact}
    Run Keyword If    ${exp_data_tracked_offernder_contact}==None    Append To List    ${failure_messages}    ${tc_name},A1CLIENT04.TRACKED_OFFENDER_CONTACT,Expected TRACKED_OFFENDER_CONTACT table Query Executed successfully but query fetched No records.
