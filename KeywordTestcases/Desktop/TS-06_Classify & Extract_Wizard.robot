*** Settings ***
Suite Setup       Run Workbench Prerequisite
Test Setup        Take Screenshots On Failure    False
Test Teardown     Run Keywords    Quit and Restart Capture Applications    Close All Browsers
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-38-39 Create New Classification Model and Rename
    [Setup]    Read Workbench Test Data    TC_38
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    Click on New Classification model button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_CLASSIFICATION_MODEL
    Comment    Create New Classification Model in work bench
    Create New Classification Model    ${workbench_model_info}[Model Name]
    Expand Classification Models
    Comment    Validating New Classification Model is Created or not.
    Validate Classification Model or Zone Template is displayed    ${workbench_model_info}[Model Name]
    Comment    Select Classification Model in work bench
    Select Classification Model    ${workbench_model_info}[Model Name]
    Comment    Rename Classification model as Model_Rename
    workbench.Rename Classification Model    Model_Rename
    Comment    Validating Classification Model is updated
    Validate Classification Model or Zone Template is displayed    Model_Rename

TC-40 Delete Classification Model
    [Setup]    Read Workbench Test Data    TC_40
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    Click on New Classification model button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_CLASSIFICATION_MODEL
    Comment    Create New Classification Model in work bench
    Create New Classification Model    ${workbench_model_info}[Model Name]
    comment    Exapnd Classification model
    Expand Classification Models
    comment    Select and Delete Classification model in work bench
    Delete Classification Model or Zone Template    ${workbench_model_info}[Model Name]
    comment    Validate Classification Model or Zone Template should not displayed
    Validate Classification Model or Zone Template should not displayed    ${workbench_model_info}[Model Name]

TC-41-42-47 Create New Zone Template and Rename
    [Setup]    Read Workbench Test Data    TC_41
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    Click on Zone Templates
    Select Zone Templates    ZoneTemplates
    Comment    Click on New Classification model button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_ZONE_TEMPLATE
    Comment    Create New Classification Model in work bench
    Create New Zone Templates    ${workbench_zone_info}[Template Name]    ${workbench_zone_info}[File Name]
    Comment    Expand Zone Template
    Expand Zone Templates
    Comment    Validating New Zone is Created or not.
    Validate Classification Model or Zone Template is displayed    ${workbench_zone_info}[Template Name]
    Comment    Select Zone Template in work bench
    Select Classification Model    ${workbench_zone_info}[Template Name]
    Comment    Rename Zone Template as Zone_Rename
    workbench.Rename Zone Template    Zone_Rename
    Comment    Validate Zone is Updated
    Validate Classification Model or Zone Template is displayed    Zone_Rename
    Comment    Validate Undo-Checkout, Checkin and Checkout are not enabled for Zone Template
    Validate Zone Template Undo-Checkout, Checkin and Checkout Status

TC-43 Delete Zone Template
    [Setup]    Read Workbench Test Data    TC_43
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    select Zone Template in Tool Bar
    Select Zone Templates    ZoneTemplates
    comment    Click on New Zone Template button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_ZONE_TEMPLATE
    Comment    Create New Classification Model in work bench
    Create New Zone Templates    ${workbench_zone_info}[Template Name]    ${workbench_zone_info}[File Name]
    comment    Expand Zone Template
    Expand Zone Templates
    comment    Select Zone Template and delete in work bench
    Delete Classification Model or Zone Template    ${workbench_zone_info}[Template Name]
    comment    Validate Classification Model or Zone Template should not displayed
    Validate Classification Model or Zone Template should not displayed    ${workbench_zone_info}[Template Name]

TC-44 Select checked in Classification Model and then Checkout
    [Setup]    Read Workbench Test Data    TC_44
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    Click on New Classification model button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_CLASSIFICATION_MODEL
    Comment    Create New Classification Model in work bench
    Create New Classification Model    ${workbench_model_info}[Model Name]
    Comment    Expand Classification Model
    Expand Classification Models
    Comment    Checkin Classification Model
    workbench.Checkin Classification Model    ${workbench_model_info}[Model Name]
    Comment    Validate Classification Model Checkin status
    Validate Classification Model Checkin Status
    Comment    Click on Checkout Button in Tool Bar
    Select Workbench Operation Type From Tool Bar    CHECK_OUT
    Comment    Validate Classification Model Check-out status
    Validate Classification Model Checkout Status

TC-45 Select checked out Classification Model and then Checkin
    [Setup]    Read Workbench Test Data    TC_45
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    Click on New Classification model button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_CLASSIFICATION_MODEL
    Comment    Create New Classification Model in work bench
    Create New Classification Model    ${workbench_model_info}[Model Name]
    Comment    Expand Classification Model
    Expand Classification Models
    Comment    Select Classification Model in work bench
    Select Classification Model    ${workbench_model_info}[Model Name]
    Comment    Validate Classification Model Check-out status
    Validate Classification Model Checkout Status
    Comment    Click on Checkin Button in Tool Bar
    Select Workbench Operation Type From Tool Bar    CHECK_IN
    Comment    Validate Classification Model Checkin status
    Validate Classification Model Checkin Status

TC-46 Select checked out Classification Model and then Undo Checkout
    [Setup]    Read Workbench Test Data    TC_46
    Comment    Open Encapture Application URL QA01 and Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Workbench client to capture
    Select the Client Application    ${APPLICATION_CLASSIFY_AND_EXTRACT}
    Comment    Click on New Classification model button in Tool Bar
    Select Workbench Operation Type From Tool Bar    NEW_CLASSIFICATION_MODEL
    Comment    Create New Classification Model in work bench
    Create New Classification Model    ${workbench_model_info}[Model Name]
    Comment    Expand Classification Model
    Expand Classification Models
    Comment    Click on Check-in Button in Tool Bar
    workbench.Checkin Classification Model    ${workbench_model_info}[Model Name]
    Comment    Click on Check-out Button in Tool Bar
    Select Workbench Operation Type From Tool Bar    CHECK_OUT
    Comment    Click on Undo Check-out Button in Tool Bar
    Select Workbench Operation Type From Tool Bar    UNDO_CHECK_OUT
    Comment    "Validate Classification Model Checkin" After Classification Model Undo Check-out
    Validate Classification Model Checkin Status
