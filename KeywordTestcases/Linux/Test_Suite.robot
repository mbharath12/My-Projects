*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01- Inclusion Zone-open
    [Tags]    IZ-OPEN
    ${config_dict}    Read TestData From Excel    TC01-IZ_OPEN    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC01-IZ_OPEN    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    Clear Database tables
    Clear Database    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Open dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Open dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC02- Inclusion Zone-close
    [Tags]    IZ-CLOSE
    ${config_dict}    Read TestData From Excel    TC02-IZ_CLOSE    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC02-IZ_CLOSE    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Close dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Close dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC03- Exclusion Zone-open
    [Tags]    EZ-OPEN
    ${config_dict}    Read TestData From Excel    TC03-EZ_OPEN    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC03-EZ_OPEN    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    Clear Database tables
    Clear Database    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Open dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Open dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC04- Exclusion Zone-close
    [Tags]    EZ-CLOSE
    ${config_dict}    Read TestData From Excel    TC04-EZ_CLOSE    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC04-EZ_CLOSE    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Close dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Close dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC05- Bracelet Strap-open
    [Tags]    BS-OPEN
    ${config_dict}    Read TestData From Excel    TC05-BS_OPEN    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC05-BS_OPEN    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    Clear Database tables
    Clear Database    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Open dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Open dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC06- Bracelet Strap-close
    [Tags]    BS-CLOSE
    ${config_dict}    Read TestData From Excel    TC06-BS_CLOSE    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC06-BS_CLOSE    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Close dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Close dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC07- Device Charge-open
    [Tags]    DC-OPEN
    ${config_dict}    Read TestData From Excel    TC07-DC_OPEN    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC07-DC_OPEN    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    Clear Database tables
    Clear Database    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Open dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Open dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC08- Device Charge-close
    [Tags]    DC-CLOSE
    ${config_dict}    Read TestData From Excel    TC08-DC_CLOSE    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC08-DC_CLOSE    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Close dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Close dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC09- Low Battery-open
    [Tags]    LB-OPEN
    ${config_dict}    Read TestData From Excel    TC09-LB_OPEN    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC09-LB_OPEN    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    Clear Database tables
    Clear Database    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Open dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Open dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]

TC10- Low Battery-close
    [Tags]    LB-CLOSE
    ${config_dict}    Read TestData From Excel    TC10-LB_CLOSE    ini_file_details
    ${test_prerequisite_data}    Read TestData From Excel    TC10-LB_CLOSE    testcase_details
    Get VT_Device Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Get A1Client04 tables Expected Data    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[ct_tracked_offender_id]
    Comment    execute autoplayer for an close event
    Execute Autoplayer for an Event    ${config_dict}
    Comment    Validate VT_Device Details for Close dat file
    Validate VT_Device Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[reported_month]    ${test_prerequisite_data}[event_id]
    Comment    Validate A1_Client_Details for Close dat file
    Validate A1_Client_Details    ${test_prerequisite_data}[TCName]    ${test_prerequisite_data}[ct_device_id]    ${test_prerequisite_data}[ct_tracked_offender_id]    ${test_prerequisite_data}[reported_month]
    Comment    Add the mismatches details into excel file
    Add The Mismatch Details To Excel File    ${failure_messages}    ${test_prerequisite_data}[TCName]
