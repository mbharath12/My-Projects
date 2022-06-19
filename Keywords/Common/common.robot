*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Read Created Test Data
    [Arguments]    ${test_id}    ${batchcontent_data}=${ADMIN_PORTAL_TESTDATA}
    Comment    Run Keyword If    ${is_prerequisites_created}==False    Fail    Testcase cannot be executed becuase pre-requisites are not created.
    Comment    ${test_case_test_data}    Collections.Get From Dictionary    ${created_test_data_values}    ${test_id}
    Comment    ${line_of_business}    Get From Dictionary    ${test_case_test_data}    Line Of Business
    Comment    Set Test Variable    ${line_of_business}
    Comment    Comment    ${batchcontent}    Get From Dictionary    ${test_case_test_data}    Batch Content Type
    Comment    Comment    Set Test Variable    ${batchcontent}
    Comment    ${document_classes}    Get From Dictionary    ${test_case_test_data}    Document Classes
    Comment    Set Test Variable    ${document_classes}
    &{batchcontent}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${batchcontent_data}    ${test_id}    Batch Content Types
    Set Test Variable    &{batchcontent}
    &{capture_wizard_content_info}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${CAPTURE_WIZARD_TESTDATA}    ${test_id}    Content Type Information
    Set Test Variable    &{capture_wizard_content_info}
    &{capture_wizard_document_class_info}    CustomLibrary.Get All Ms Excel Matching Row Values Into Dictionary Based On Key    ${CAPTURE_WIZARD_TESTDATA}    ${test_id}    Document Class Information
    Set Test Variable    &{capture_wizard_document_class_info}
    Comment    Read testdata for Expert Index wizard
    &{Index_wizard_content_info}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${INDEX_WIZARD_TESTDATA}    ${test_id}    Content Type Information
    Set Test Variable    &{Index_wizard_content_info}
    &{Index_wizard_document_class_info}    CustomLibrary.Get All Ms Excel Matching Row Values Into Dictionary Based On Key    ${INDEX_WIZARD_TESTDATA}    ${test_id}    Document Class Information
    Set Test Variable    &{Index_wizard_document_class_info}

Validate Batch Status in DB
    [Arguments]    ${Batchcode}    ${expected_step_code}    ${expected_step_status}
    Sleep    20s
    ${info}    Get Batch Info From Db    ${Batchcode}
    ${actual_step_code}    Set Variable    ${info}[STEP_CODE]
    ${actual_step_status}    Set Variable    ${info}[WORKFLOW_STEP_STATUS_CD]
    Should Be Equal    ${actual_step_code}    ${expected_step_code}
    Should Be Equal    ${actual_step_status}    ${expected_step_status}

Read Workbench Test Data
    [Arguments]    ${test_id}
    &{workbench_model_info}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${WORKBENCH_TESTDATA}    ${test_id}    Workbench Model Information
    Set Test Variable    &{workbench_model_info}
    &{workbench_zone_info}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${WORKBENCH_TESTDATA}    ${test_id}    Workbench Zone Information
    Set Test Variable    &{workbench_zone_info}

Clear Admin Database
    Run Keyword If    '${CLEAR_LINE_OF_BUSINESS_AND_BATCH_CONTENT_TYPE}'=='True'    DatabaseOperations.Clear Batches Testdata From Db
    Run Keyword If    '${CREATE_DATA_SOURCES_AND_CONNECTIONS}'=='True'    Clear Data Connections And Datasources From Db

Read Data Connections Test Data
    [Arguments]    ${test_id}
    ${database_connections_data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${DATA_CONFIGURATION_TESTDATA}    ${test_id}    Data Connection
    Set Test Variable    ${database_connections_data}
