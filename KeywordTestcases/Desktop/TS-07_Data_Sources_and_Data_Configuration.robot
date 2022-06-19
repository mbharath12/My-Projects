*** Settings ***
Test Setup        Take Screenshots On Failure    False
Test Teardown     Run Keywords    Quit and Restart Capture Applications
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC_01 Validate "Data Base Connection" with valid data.
    [Setup]    Read Data Connections Test Data    DC_02
    Comment    Select Encapture Orchestrator Application
    Select the Client Application    ${ENCAPTURE_ADMIN}
    Comment    Navigate to Business data configuration->Connections
    Navigate to Menu    BUSINESS DATA CONFIGURATION    CONNECTIONS
    Comment    Create Database Connection with valid details
    Create Database Connection    ${database_connections_data}
    Comment    Validate Database Connection with Valid Data
    Validate Database Connection with Valid Data    ${database_connections_data}
    [Teardown]    Close Orchestrator Application Window

TC_02 Validate "Data Base Connection" with invalid data.
    [Setup]    Read Data Connections Test Data    DC_03
    Comment    Select Encapture Orchestrator Application
    Select the Client Application    ${ENCAPTURE_ADMIN}
    Comment    Navigate to Business data configuration->Connections
    Navigate to Menu    BUSINESS DATA CONFIGURATION    CONNECTIONS
    Comment    Create Database Connection with invalid details
    Create Database Connection    ${database_connections_data}
    Comment    Create Database Connection with invalid details
    Validate Database Connection with Invalid Data    ${database_connections_data}
    [Teardown]    Close Orchestrator Application Window

TC-03 Validate - Batch custom field should accept all the values in "Data Source" except the value in "validation" rule selected with "Value is Not Equal to" in Expert Capture
    [Setup]    Read Created Test Data    DS_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111111111
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-04 Validate - Batch custom field should not accept the founded value from "validation" rule selected with "Value is Not Found" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_04
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111122222
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-05 Validate - Batch custom field should not be greater than the value from "validation" rule selected with "Value is Not Greater Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111111111
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-06 Validate - Batch custom field should not be less than the value from "validation" rule selected with "Value is Not Less Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_06
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    3333333333
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-07 Validate - Batch custom field should accept the exact value from "validation" rule selected with "Value is Equal to" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_07
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    2222222222
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-08 Validate - Batch custom field should accept all founded values from "validation" rule selected with "Value is Found" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_08
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111111111
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-09 Validate - Batch custom field should be greater than the value from "validation" rule selected with "Value is Greater Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_09
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    3333333333
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-10 Validate - Batch custom field should be less than the value from "validation" rule selected with "Value is Less Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_10
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber
    Comment    Assign Batch Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Batch Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111111111
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-11 Validate - Document custom field should accept all the values in "Data Source" except the value from "validation" rule selected with "Value is Not Equal to" in Expert Capture
    [Setup]    Read Created Test Data    DS_11
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    DocumentCategory    CLS
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-12 Validate - Document custom field should not accept the founded value from "validation" rule selected with "Value is Not Found" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_12
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    DocumentCategory    QATEAM
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-13 Validate - Document custom field should not be greater than the value from "validation" rule selected with "Value is Not Greater Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_13
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    LoanNumber
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111111111
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-14 Validate - Document custom field should not be less than value from "validation" rule selected with "Value is Not Less Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_14
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    LoanNumber
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    3333333333
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-15 Validate - Document custom field should accept the exact value from "validation" rule selected with "Value is Equal to" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_15
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    DocumentCategory    TR
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-16 Validate - Document custom field should accept all founded values from "validation" rule selected with "Value is Found"
    [Setup]    Read Created Test Data    DS_16
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    DocumentCategory    CLS
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-17 Validate - Document custom field should be greater than the value from "validation" rule selected with "Value is Greater Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_17
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    LoanNumber
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    3333333333
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-18 Validate - Document custom field should be less than the value from "validation" rule selected with "Value is Less Than" in "Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_18
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    LoanNumber
    Comment    Assign Document Custom Field Values As Configured in Data Sources and Dependent Fields
    Fill Document Index Values    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    LoanNumber    1111111111
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_19 Validate - Batch custom field value when "Data Source" is enabled with "Value" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_19
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber    1111111111    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_20 Validate - Document custom field value when "Data Source" is enabled with "Value" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_20
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory    CLS    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_21 Validate - Batch custom field value when "Data Source" is enabled with "Permitted Values" in Expert Capture
    [Setup]    Read Created Test Data    DS_21
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Data Source combo box
    Validate Data Source combo box    LoanNumber    1111111111
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_22 Validate - Document custom field value when "Data Source" is enabled with "Permitted Values" in Expert Capture
    [Setup]    Read Created Test Data    DS_22
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    DocumentCategory    Underwriting
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_23 Validate - Batch custom field when "Dependent Fields" is enabled with "Value" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_23
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BorrowerFirstName    Jason    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_24 Validate - Document custom field when "Dependent Fields" is enabled with "Value" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_24
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    BorrowerFirstName    Tim    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_25 Validate - Batch custom field when "Dependent Fields" is enabled with "Permitted Values" in Expert Capture
    [Setup]    Read Created Test Data    DS_25
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Data Source combo box
    Validate Data Source combo box    BorrowerFirstName    Tim
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_26 Validate - Document custom field when "Dependent Fields" is enabled with "Permitted Values" in Expert Capture
    [Setup]    Read Created Test Data    DS_26
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    True
    Comment    Validate Data Source combo box
    Validate Data Source combo box    BorrowerFirstName    Tim
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-27 Validate - Batch custom field when "Data Source" is enabled with "Permitted Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_27
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    BatchNo    PV1
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-28 Validate - Document custom field when "Data Source" is enabled with "Permitted Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_28
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    DocumentCategory    PV1
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-29 Validate - Batch custom field when "Dependent Fields" is enabled with "Permitted Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_29
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber    Tim    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    BorrowerFirstName    PV1
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-30 Validate - Document custom field when "Dependent Fields" is enabled with "Permitted Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_30
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory    CLS    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    DocumentType    PV1
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_31 Validate - Batch custom field when "Data Source" is enabled with "Default Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_31
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate "Default Value Data sources" configured values are reflected in Batch custom fields of Expert Capture
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BatchNo    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC_32 Validate - Document custom field when "Data Source" is enabled with "Default Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_32
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate "Default Value Data sources" configured values are reflected in Document custom fields of Expert Capture
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-33 Validate - Batch custom field when "Dependent Fields" is enabled with "Default Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_33
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BorrowerFirstName    1234    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    LoanNumber    1234    False
    Comment    Comment    Fill Document Index fields as per data source configuration in admin
    Complete the Batch Process

TC-34 Validate - Document custom field when "Dependent Fields" is enabled with "Default Value Data Source" in Expert Capture
    [Setup]    Read Created Test Data    DS_34
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentCategory    1234    False
    Comment    Assign Document Index Values to Batch Content type
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentType    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-35 Validate - Batch custom field should accept all the values in "Data Source" except the value from "validation" rule selected with "Value is Not Equal to" in Review
    [Setup]    Read Created Test Data    DS_35
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1111111111    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-36 Validate - Batch custom field should not accept the founded value from "validation" rule selected with "Value is Not Found" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_36
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1111122222    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-37 Validate - Batch custom field should not be greater than the value from "validation" rule selected with "Value is Not Greater Than" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_37
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1111111111    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-38 Validate - Batch custom field should not be less than the value from "validation" rule selected with "Value is Not Less Than" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_38
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    3333333333    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-39 Validate - Batch custom field should accept the exact value from "validation" rule selected with "Value is Equal to" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_39
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    2222222222    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-40 Validate - Batch custom field should accept all founded values from "validation" rule selected with "Value is Found" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_40
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1111111111    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-41 Validate - Batch custom field should be greater than the value from "validation" rule selected with "Value is Greater Than" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_41
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review \ client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    3333333333    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-42 Validate - Batch custom field should be less than the value from "validation" rule selected with "Value is Less Than" in "Data Source" in Review
    [Setup]    Read Created Test Data    DS_42
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1111111111    True
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC_43 Validate - Batch custom field value when "Data Source" is enabled with "Value" settings in Expert Index
    [Setup]    Read Created Test Data    DS_19
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1111111111    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_44 Validate - Document custom field value when "Data Source" is enabled with "Value" settings in Expert Index
    [Setup]    Read Created Test Data    DS_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentCategory    CLS    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_45 Validate - Batch custom field value when "Data Source" is enabled with "Permitted Values" in Expert Index
    [Setup]    Read Created Test Data    DS_62
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Data Source combo box
    Validate Data Source combo box    LoanNumber    1111111111    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC-46 Validate - Document custom field value when "Data Source" is enabled with "Permitted Values" in Expert Index
    [Setup]    Read Created Test Data    DS_22
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    DocumentCategory    Underwriting    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch
    Complete the Batch Process in Review

TC-47 Validate - Batch custom field when "Dependent Fields" is enabled with "Value" settings in Expert Index
    [Setup]    Read Created Test Data    DS_23
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BorrowerFirstName    Jason    False
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-48 Validate - Document custom field when "Dependent Fields" is enabled with "Value" settings in Expert Index
    [Setup]    Read Created Test Data    DS_24
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    BorrowerFirstName    Tim    False
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC_49 Validate - Document custom field when "Dependent Fields" is enabled with "Permitted Values" in Expert Index
    [Setup]    Read Created Test Data    DS_26
    [Timeout]
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    True
    Comment    Validate Data Source combo box
    Validate Data Source combo box    BorrowerFirstName    Tim    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_50 Validate - Document custom field when "Data Source" is enabled with "Permitted Value Data Source" in Expert Index
    [Setup]    Read Created Test Data    DS_28
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    DocumentCategory    PV1    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_51 Validate - Document custom field when "Dependent Fields" is enabled with "Permitted Value Data Source" in Expert Index
    [Setup]    Read Created Test Data    DS_28
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    DocumentCategory    PV1    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_52 Validate - Batch custom field when "Data Source" is enabled with "Default Value Data Source" in Expert Index
    [Setup]    Read Created Test Data    DS_31
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate "Default Value Data sources" configured values are reflected in Batch custom fields of Expert Capture
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BatchNo    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_53 Validate - Document custom field when "Data Source" is enabled with "Default Value Data Source" in Expert Index
    [Setup]    Read Created Test Data    DS_32
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate "Default Value Data sources" configured values are reflected in Document custom fields of Expert Capture
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentCategory    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_54 Validate - Batch custom field when "Dependent Fields" is enabled with "Default Value Data Source" in Expert Index
    [Setup]    Read Created Test Data    DS_33
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BorrowerFirstName    1234    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    LoanNumber    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC_55 Validate - Document custom field when "Dependent Fields" is enabled with "Default Value Data Source" in Expert Index
    [Setup]    Read Created Test Data    DS_34
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    True    False
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentCategory    1234    False
    Comment    Assign Document Index Values to Batch Content type
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentType    1234    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC-56 Validate - Batch and Document custom field value when "Data Source" is enabled with "Value and Permitted Values" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_51
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-57 Validate - Batch and Document custom field value when "Data Source" is enabled with "Value and Permitted Values" settings in Review
    [Setup]    Read Created Test Data    DS_52
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-58 Validate - Batch and Document multiple fields when "Data Source" and "Dependent Fields" are enabled with "Permitted Values and Validation Rule" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_59
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Data Source combo box
    Validate Data Source combo box    LoanNumber    2222222222
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BorrowerFirstName    Jason    False
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Data Source combo box
    Validate Data Source combo box    DocumentCategory    CLS
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentType    Closing    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-59 Validate - Batch and Document multiple fields when "Data Source" and "Dependent Fields" are enabled with "Permitted Values and Validation Rule" settings in Review
    [Setup]    Read Created Test Data    DS_53
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Data Source combo box
    Validate Data Source combo box    LoanNumber    2222222222    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BorrowerFirstName    Jason    False
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate Data Source combo box
    Validate Data Source combo box    DocumentCategory    CLS    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentType    Closing    False
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-60 Validate - Batch and Document multiple fields when "Data Source" and "Dependent Fields" are enabled with "Permitted Values and Default Value Data Source" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_54
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BorrowerFirstName    Tim    False
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentType    Closing    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-61 Validate - Batch and Document multiple fields when "Data Source" and "Dependent Fields" are enabled with "Permitted Values and Default Value Data Source" settings in Review
    [Setup]    Read Created Test Data    DS_54
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BorrowerFirstName    Tim    False
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentType    Closing    False
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-62 Validate - Batch and Document custom field value when "Data Source" is enabled with "Permitted Values and Validation Rule" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_55
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    LoanNumber    2222222222
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Data Source combo box
    Validate Data Source combo box    DocumentCategory    CLS
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-63 Validate - Batch and Document custom field value when "Data Source" is enabled with "Permitted Values and Validation Rule" settings in Review
    [Setup]    Read Created Test Data    DS_56
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    LoanNumber    1111111111    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate Data Source combo box
    Validate Data Source combo box    DocumentCategory    CLS    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review

TC-64 Validate - Batch and Document custom field value when "Data Source" is enabled with "Value and Permitted Values" and "Dependent Fields" settings in Expert Capture
    [Setup]    Read Created Test Data    DS_60
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate Data Source combo box
    Validate Data Source combo box    LoanNumber    2222222222
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BorrowerFirstName    Jason    False
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Data Source combo box
    Validate Data Source combo box    DocumentCategory    CLS
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentType    Closing    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-65 Validate - Batch and Document custom field value when "Data Source" is enabled with "Value and Permitted Values" settings and "Dependent Fields in Review
    [Setup]    Read Created Test Data    DS_57
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Data Source combo box
    Validate Data Source combo box    LoanNumber    2222222222    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BorrowerFirstName    Jason    False
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate Data Source combo box
    Validate Data Source combo box    DocumentCategory    CLS    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentType    Closing    False
    Comment    Complete the Batch Process
    Complete the Batch Process in Review

TC-66 Validate - Batch and Document multiple custom field values when 'Data Source' is enabled with 'Value, Permitted Values and Validation Rule' settings in Expert Capture
    [Setup]    Read Created Test Data    DS_61
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}    ${APPLICATION_EXPERT_CAPTURE}
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Batch    BorrowerFirstName    1234    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    BorrowerLastName    PV1
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_EXPERT_CAPTURE}    Document    DocumentType    1234    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    BatchNo    PV1
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process

TC-67 Validate - Batch and Document multiple custom field values when 'Data Source' is enabled with 'Value, Permitted Values and Validation Rule' settings in Review
    [Setup]    Read Created Test Data    DS_58
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document    False    False
    Comment    Select Review client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${Index_wizard_content_info}    ${APPLICATION_REVIEW}    IndexHost
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Batch    BorrowerFirstName    1234    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    BorrowerLastName    PV1    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Document Fields Should Accept Value As Configued From Data Sources Only
    Validate Custom Field Should Accept Value As Configured in Data Source Validation Rule    ${APPLICATION_REVIEW}    Document    DocumentType    1234    False
    Comment    Fill Document Index fields as per data source configuration in admin
    Validate Data Source combo box    BatchNo    PV1    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Complete the Batch Process
    Complete the Batch Process in Review
