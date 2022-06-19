*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Type the Command
    [Arguments]    ${command}
    sleep    2s
    write    ${command}
    ${output}    read
    [Return]    ${output}

Login to Linux Machine
    [Arguments]    ${USER_NAME}    ${PASSWORD}
    [Documentation]    Login to Linux box machine using Username and Password.
    ...
    ...    Examples: Login to Linux box machine ${USERNAME} ${PASSWORD}
    ${index}    Open Connection    ${HOST}    prompt=$    timeout=60s
    Run Keyword If    '${index}'=='0'    Fail    Connection is not established
    SSHLibrary.Login    ${USER_NAME}    ${PASSWORD}
    [Return]    ${index}

Wait Until Gateway user Prompt
    ${output}    Read Until    ${TDCC_USER_PROMPT}
    log    ${output}
    [Return]    ${output}

Copy local file to remote user folder
    [Arguments]    ${local_file_path}    ${remote_path}
    Comment    Copy local file to remote user folder
    OperatingSystem.File Should Exist    ${local_file_path}
    SSHLibrary.Put File    ${local_file_path}    ${remote_path}
    SSHLibrary.File Should Exist    ${remote_path}

Switch to auto player path
    sleep    3s
    Comment    Switch to auto player folder
    Write    cd /usr/local/tdcc/auto_player

Validate the details in command output
    [Arguments]    ${expected}
    ${output}    Read Until    ${expected}
    log    ${output}
    Should Contain    ${output}    ${expected}

Execute Backend Auto Player
    Comment    Switch to auto player path
    Switch to auto player path
    sleep    3s
    Write    ./loadtest
    ${output}    Wait Until Gateway user Prompt
    Should Contain    ${output}    All Tag Tx Threads have finished
    [Return]    ${output}

Read TestData From Excel
    [Arguments]    ${testcaseid}    ${sheet_name}
    [Documentation]    Read TestData from excel file for required data.
    ...
    ...    Example:
    ...    Read TestData From Excel TC_01 SheetName
    ${test_prerequisite_data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${testcaseid}    ${sheet_name}
    [Return]    ${test_prerequisite_data}

Clear Database
    [Arguments]    ${ct_device_id}    ${ct_tracked_offender_id}    ${reported_month}
    [Documentation]    Clear the VT_DEVICE database tables and A1Client04 database tables
    ...
    ...    Examples:
    ...    Clear database tables
    Comment    Clear the vt_device database tables
    CustomLibrary.Clear The Vt Device Database    ${ct_device_id}    ${reported_month}
    Comment    Clear the aiclient04 database tables
    CustomLibrary.Clear The A1client04 Database    ${ct_tracked_offender_id}

Logout from a user
    write    logout

Execute Autoplayer for an Event
    [Arguments]    ${test_data_dict}
    Comment    Login to Linux Machine
    Login to Linux Machine    ${USER_NAME}    ${PASSWORD}
    Comment    Create Config File
    Update Autoplayer Config File    ${test_data_dict}
    Comment    Change User to Gateway user
    Change User to Gateway user
    Comment    Execute Autoplayer Tool
    ${log}    Execute Backend Auto Player
    Comment    Copy .dat files to executed folder
    Copy dat files to executed folder    ${log}

Read Multiple Data
    [Arguments]    ${test_case_name}
    ${dict}    CustomLibrary.Get All Ms Excel Matching Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${test_case_name}    ini_file_details
    [Return]    ${dict}

Read ExpectedData from Excel
    [Arguments]    ${testcaseid}    ${sheet_name}
    ${expected_data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/ExpectedTestData.xlsx    ${testcaseid}    ${sheet_name}
    [Return]    ${expected_data}

Split Date
    [Arguments]    ${act_data}
    ${act_data}    Convert To String    ${act_data}
    @{date}    Split String    ${act_data}    ${SPACE}
    Set Test Variable    ${date}    ${date}[0]

Validate VT_Device Details
    [Arguments]    ${test_case_name}    ${ct_device_id}    ${reported_month}    ${event_id}
    Run Keyword And Continue On Failure    Validate Device Track values with database    ${test_case_name}    ${ct_device_id}
    Run Keyword And Continue On Failure    Validate Device Contact values with database    ${test_case_name}    ${ct_device_id}
    Run Keyword And Continue On Failure    Validate Device Last Contact values with database    ${test_case_name}    ${ct_device_id}    ${reported_month}
    Run Keyword And Continue On Failure    Validate Device Event values with database    ${test_case_name}    ${ct_device_id}    ${event_id}

Validate A1_Client Details
    [Arguments]    ${test_case_name}    ${ct_device_id}    ${ct_tracked_offender_id}    ${reported_month}
    Run Keyword And Continue On Failure    Validate Open Vios details with database    ${test_case_name}    ${ct_device_id}    ${ct_tracked_offender_id}
    Run Keyword And Continue On Failure    Validate Tracked Offender Last Contact details with database    ${test_case_name}    ${ct_device_id}    ${reported_month}
    Run Keyword And Continue On Failure    Validate Tracked Offender summary details with database    ${test_case_name}    ${ct_tracked_offender_id}
    Run Keyword And Continue On Failure    Validate Tracked Offender track details with database    ${test_case_name}    ${ct_device_id}    ${ct_tracked_offender_id}    ${reported_month}
    Run Keyword And Continue On Failure    Validate Tracked Offender contact details with database    ${test_case_name}    ${ct_device_id}    ${ct_tracked_offender_id}

Add The Mismatch Details To Excel File
    [Arguments]    ${failure_messages}    ${test_case_name}
    CustomLibrary.Write List Values Into Ms Excel File    ${failure_messages}    ${test_case_name}

Get VT_Device Expected Data
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}    ${event_id}
    Get DEVICE_TRACK table values    ${tc_name}    ${ct_device_id}
    Get DEVICE_CONTACT table values    ${tc_name}    ${ct_device_id}
    Get DEVICE_LAST_CONTACT table values    ${tc_name}    ${ct_device_id}    ${reported_month}
    Get DEVICE_EVENT table values    ${tc_name}    ${ct_device_id}    ${event_id}

Get A1Client04 tables Expected Data
    [Arguments]    ${tc_name}    ${ct_device_id}    ${reported_month}    ${ct_tracked_offender_id}
    Run Keyword And Continue On Failure    Get TO OPEN VIOS table values    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}
    Run Keyword And Continue On Failure    Get TRACKED_OFFENDER_LAST_CONTACT table values    ${tc_name}    ${ct_device_id}    ${reported_month}
    Run Keyword And Continue On Failure    Get TRACKED_OFFENDER_SUMMARY table values    ${tc_name}    ${ct_tracked_offender_id}
    Run Keyword And Continue On Failure    Get TRACKED_OFFENDER_TRACK table values    ${tc_name}    ${ct_device_id}    ${reported_month}    ${ct_tracked_offender_id}
    Run Keyword And Continue On Failure    Get TRACKED_OFFENDER_CONTACT table values    ${tc_name}    ${ct_device_id}    ${ct_tracked_offender_id}
