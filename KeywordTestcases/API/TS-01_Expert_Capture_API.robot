*** Settings ***
Suite Setup       Get Authentication Token    EXCAP
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-01 Login to Application with valid Credentials
    comment    Login to Application with Valid Credentials
    ${response}    Authenticate with Vaild Credentials    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    201
    comment    Validate API Request Body
    Validate Response Body    ${response.content}    ${login_validcredentials_key_value}

TC-02 Login to Application with Invalid Credentials
    comment    Login to Application with InValid Credentials
    ${response}    Authenticate with Vaild Credentials    ${ADMIN_USER_ID}    123
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    200
    comment    Validate API Request Body
    Validate Response Body    ${response.content}    ${login_invalidcredentials_key_value}

TC-03 Get Application Configuration
    Comment    Validate Application Configuration Response with valid data
    Validate Application Configuration Response    ${application_api_codes}    200
    Comment    Validate Application Configuration Response with invalid data
    Validate Application Configuration Response    ${invalid_application_code}    500

TC-04 Get Application Logging Configuration
    Comment    Validate Application Configuration with Valid data
    Validate Application Logging Configuration Response    ${application_api_codes}    200

TC-05 Get Batch Content Type List
    comment    Get Batch Content type list with valid data
    ${response}    Get Batch Content Type List    EXCAP
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    200
    comment    Validate API Request Body
    Validate Response Body    ${response.content}    expected_value=batchContentTypes

TC-06 Get Batch Content Type Process Steps
    [Setup]    Get Batch Content Type Code    EXCAP
    comment    Get Batch Content Type Process Steps
    ${response}    Get Batch Content Type Process Steps    ${batchContentTypeCode}
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    200
    comment    Validate API Request Body
    Validate Get Processing Step Response    ${response.content}    ${batchContentTypeCode}

TC-07 Get Batch Content Type Process Steps by process code
    [Setup]    Get Batch Content Type Code    EXCAP
    comment    Get BCT Process steps by process code
    ${responce}    Get Batch Content Type Process Steps by process code    EXCAP    ${batchContentTypeCode}
    comment    Validate API Request Status
    Validate Response Status Code    ${responce}    204

TC-08 Post Create Batch
    [Setup]    Get Batch Content Type Code    EXCAP
    comment    Create Batch with valid data
    ${response}    Create Batch    ${batchContentTypeCode}    EXCAP    CAPTR
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    200
    comment    Validate API Request Body
    Validate Response Body    ${response.content}    expected_value=batchContentType
    comment    Create Batch with Invalid data
    ${response}    Create Batch    ${batchContentTypeCode}    EXCAPSDT    CAPTRSDT
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    500

TC-09 Get Process Step Application Configuration
    [Setup]    Get Batch Content Type Code    EXCAP
    comment    Get Process step Application Configuration
    ${responce}    Get Process Step Application Configuration    CAPTR    EXCAP    ${batchContentTypeCode}
    comment    Validate API Request Status
    Validate Response Status Code    ${responce}    200
    Validate Get Processing Step Response    ${responce.content}    xml

TC-10 Put Update Batch Custom Field Values
    [Setup]    Create Test Prerequisite    Data_01
    comment    Update Valid Batch Custom Field Values
    Update Batch Custom Field Values    ${valid_custom_fields_list}    200
    comment    Update Invalid Batch Custom Field Values
    Update Batch Custom Field Values    ${invalid_custom_fields_list}    500

TC-11 Put Create Transfer
    [Setup]    Create Test Prerequisite    Data_01
    comment    Validate Create Transfer with Valid data
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    comment    Validate Create Transfer with Invalid data
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${invalid_batch_id}
    Validate Response Status Code    ${response}    500

TC-12 Import single page Electronic Document and Complete Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post- Document Selected
    ${response}    Select Document    ${document_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Document
    ${response}    Update Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestDocAPIToUpload.pdf
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch
    ${response}    Update Batch    ${batchId}    ${document_id}    ${document_page_id}    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch With Electronic Document Request Body Template.txt    ${batchcontent}
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeComplete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-13 Import Image Electronic Document and Complete Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestImageToUpload.png
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeComplete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-14 Import single page Electronic Document and Suspend Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post- Document Selected
    ${response}    Select Document    ${document_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Document
    ${response}    Update Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestDocAPIToUpload.pdf
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch
    ${response}    Update Batch    ${batchId}    ${document_id}    ${document_page_id}    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch With Electronic Document Request Body Template.txt    ${batchcontent}
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeSuspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-15 Import Image Document and Suspend Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post - Transfer Asynchronous for image file
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestImageToUpload.png
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -Before Suspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-16 Import single page Electronic Document and Delete Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post- Document Selected
    ${response}    Select Document    ${document_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Document
    ${response}    Update Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestDocAPIToUpload.pdf
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post -Before Delete
    ${response}    Before Delete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Delete -Delete Batch
    ${response}    Delete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-17 Import Multiple Electronic Documents and Complete Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Add Multiple Documents to Batch
    Add Multiple Electronic Documents    ${batchcontent}
    Comment    Post -Before Complete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    500

TC-18 Import multiple image files and Complete Batch
    [Setup]    Create Test Prerequisite    Data_01
    comment    Add multiple Image Files to Batch
    Upload Multiple Image Files    ${batchcontent}
    Comment    Post -Before Complete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-19 Import single page Electronic Document and Complete Batch Without Batch Custom Field Values
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post- Document Selected
    ${response}    Select Document    ${document_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Document
    ${response}    Update Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestDocAPIToUpload.pdf
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch
    ${response}    Update Batch    ${batchId}    ${document_id}    ${document_page_id}    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch With Electronic Document Request Body Template.txt    ${batchcontent}
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeComplete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-20 Import Electronic Document With Multiple Pages and Complete Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post- Document Selected
    ${response}    Select Document    ${document_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Document
    ${response}    Upload Electronic Document With Multiple Pages    ${batchId}    ${document_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestDocToUpload_MultiplePages.pdf
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeComplete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    500

TC-21 Create Empty Document and Complete Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Post - Update Batch Custom Field
    Update Batch Custom Field Values    ${valid_custom_fields_list}    200
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Post- Document Selected
    ${response}    Select Document    ${document_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Document
    ${response}    Update Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Create Transfer Job
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post - Transfer Asynchronous
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestImageToUpload.png
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch
    ${response}    Update Batch    ${batchId}    ${document_id}    ${document_page_id}    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch with Empty Document Request Body Template.txt    ${batchcontent}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Before Delete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-22 Get Open Batch
    [Setup]    Create Test Prerequisite    Data_01
    comment    Open Batch with valid data
    ${response}    Open Batch    ${batchId}    EXCAP    CAPTR
    comment    Validate API Request Status
    Validate Response Status Code    ${response}    200
    comment    Validate API Request Body
    Validate Response Body    ${response.content}    expected_value=batchContentType

TC-23 Validate Batch in Expert capture without Assign Batch Processing step
    [Setup]    Read Created Test Data    Data_02
    Comment    Get Batch Content Type List in Expert Capture
    ${response}    Get Batch Content Type List    ${applicationcode}
    Comment    Validate Status Code
    Validate Response Status Code    ${response}    200
    Comment    Validate Response Body contains Unassigned BatchProcessingStep Batch
    Validate Batch Response Body    ${response}

TC-24 Validate Batch Invalid Custom Fields
    [Setup]    Create Test Prerequisite    Data_03
    Comment    Post - Add Doucumnet
    ${response}    Add Document    ${batchId}    ${document_id}    ${document_page_id}
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${document_id}
    Comment    Put - Update Batch Custom Field Values With Invalid Types
    Update Batch Custom Field Values With Invalid DataTypes    ${invalid_document_custom_fields_list}    400
        ${API_BASE_URL}

TC-25 Import Image file and Suspend the Batch and then Complete Suspended Batch
    [Setup]    Create Test Prerequisite    Data_01
    comment    Update Batch Custom Field Values
    Update Batch Custom Field Values    ${valid_custom_fields_list}    200
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post - Transfer Asynchronous for image file
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestImageToUpload.jpeg
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -Before Suspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Search Existing Suspended Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXCAP    CAPTR
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXCAP    CAPTR
    Validate Response Status Code    ${response}    200
    Comment    Get - Download BatchZip
    ${response}    Download Batch Zip    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Select Batch
    ${response}    Select Batch    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Get - Batch Content Type Process Steps by process code
    ${response}    Get Batch Content Type Process Steps by process code    CAPTR    ${batch_content["Code"]}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch with Single image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -Before Complete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-26 Import Image file and Suspend the Batch and then Delete Suspended Batch
    [Setup]    Create Test Prerequisite    Data_01
    comment    Update Batch Custom Field Values
    Update Batch Custom Field Values    ${valid_custom_fields_list}    200
    Comment    Put - Create Transfer
    ${response}    Create Transfer Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    201
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post - Transfer Asynchronous for image file
    ${response}    Transfer Asynchronous    ${create_transfer_job_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestImageToUpload.jpeg
    Validate Response Status Code    ${response}    200
    Comment    Post- Complete Job
    ${response}    Complete Job    ${create_transfer_job_id}    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -Before Suspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Search Existing Suspended Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXCAP    CAPTR
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXCAP    CAPTR
    Validate Response Status Code    ${response}    200
    Comment    Get - Download BatchZip
    ${response}    Download Batch Zip    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Select Batch
    ${response}    Select Batch    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Get - Batch Content Type Process Steps by process code
    ${response}    Get Batch Content Type Process Steps by process code    CAPTR    ${batch_content["Code"]}
    Validate Response Status Code    ${response}    200
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -Before Delete
    ${response}    Before Delete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Delete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-27 Import Electronic Document and Suspend the Batch and then Delete Suspended Batch
    [Setup]    Create Test Prerequisite    Data_01
    Comment    Suspend The Batch In Expert Capture
    ${response}    Suspend The Batch In Expert Capture
    Comment    Post - Search Suspended Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXCAP    CAPTR
    Validate Response Status Code    ${response}    200
    Comment    Open Batch
    ${response}    Open Batch    ${batchId}    EXCAP    CAPTR
    Validate Response Status Code    ${response}    200
    comment    Download Batch Zip
    ${responce}    Download Batch Zip    ${batchId}
    Validate Response Status Code    ${responce}    200
    Comment    Comment    Select Batch
    ${response}    Select Batch    ${batchId}
    Validate Response Status Code    ${response}    200
    Comment    Post - Before Delete
    ${response}    Before Delete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post- Delete Batch
    ${response}    Delete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
