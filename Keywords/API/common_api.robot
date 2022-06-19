*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Read Request Template File
    [Arguments]    ${file_path}    ${replace_string}=None    ${request_body_type}=None
    ${request_data}    Get File    ${file_path}
    ${request_body_data}    Run Keyword If    ${replace_string}==None    To Json    ${request_data}
    ...    ELSE    Set Variable    ${request_data}
    Run Keyword If    ${replace_string}==None    Return From Keyword    ${request_body_data}
    FOR    ${key}    IN    @{replace_string.keys()}
        ${request_data}    Replace String    ${request_data}    ${key}    ${replace_string}[${key}]
    END
    Run Keyword If    '${request_body_type}'=='String'    Return From Keyword    ${request_data}
    ${request_body_data}    To Json    ${request_data}
    [Return]    ${request_body_data}

Send Request
    [Arguments]    ${request_type}    ${resource_uri}    ${header}=None    ${params_data}=None    ${body}=None
    ${response}    Run Keyword If    '${request_type}'=='Get'    Get Request    ${encapture_session}    ${resource_uri}    params=${params_data}    headers=${header}
    Run Keyword If    '${request_type}'=='Get'    Return From Keyword    ${response}
    ${response}    Run Keyword If    '${request_type}'=='Put'    Put Request    ${encapture_session}    ${resource_uri}    data=${body}    headers=${header}    params=${params_data}
    Run Keyword If    '${request_type}'=='Put'    Return From Keyword    ${response}
    ${response}    Run Keyword If    '${request_type}'=='Post'    Post Request    ${encapture_session}    ${resource_uri}    data=${body}    headers=${header}    params=${params_data}
    Run Keyword If    '${request_type}'=='Post'    Return From Keyword    ${response}
    ${response}    Run Keyword If    '${request_type}'=='Delete'    Delete Request    ${encapture_session}    ${resource_uri}    data=${body}    headers=${header}    params=${params_data}
    [Return]    ${response}

Validate Response Status Code
    [Arguments]    ${actual_status}    ${expected_status}
    ${actual_status}    convert to string    ${actual_status}
    Should Contain    ${actual_status}    ${expected_status}

Get Authentication Token
    [Arguments]    ${application_code}
    Create Session    ${encapture_session}    ${API_BASE_URL}    disable_warnings=1
    ${response}    Authenticate with Vaild Credentials    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Validate Response Status Code    ${response}    201
    ${session_content}    To Json    ${response.content}
    ${session_content_token}    Parse Json Response    ${session_content}    sessionToken
    ${token}    To Json    ${session_content_token}
    Set Global Variable    ${session_token}    ${token}
    Set Global Variable    ${applicationcode}    ${application_code}
    [Return]    ${session_token}

Authenticate with Vaild Credentials
    [Arguments]    ${user_name}    ${password}
    ${user_credentials}    Create Dictionary    USERNAME=${user_name}    PASSWORD=${password}
    ${body}    Read Request Template File    ${API_LOGIN_REQUEST_BODY}    ${user_credentials}
    &{header}    Create Dictionary    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Put    /api/v1/sessions    ${header}    body=${body}
    [Return]    ${response}

Validate Response Body
    [Arguments]    ${response_content}    ${validate_values}=None    ${expected_value}=None
    ${string_response_content}    Run Keyword If    '${expected_value}'!='None'    convert to string    ${response_content}
    Run Keyword If    '${expected_value}'!='None'    Should Contain    ${string_response_content}    ${expected_value}
    Run Keyword If    '${expected_value}'!='None'    Return From Keyword
    ${response_content}    To Json    ${response_content}
    ${count}    Get Length    ${validate_values}
    FOR    ${key}    IN    @{validate_values.keys()}
        ${response_value}    Parse Json Response    ${response_content}    ${key}
        Should Contain    ${response_value}    ${validate_values}[${key}]
    END

Get Batch Content Type Code
    [Arguments]    ${application_code}
    ${response}    Get Batch Content Type List    ${application_code}
    ${bct_code_response}    To Json    ${response.content}
    ${get_bct_code}    Parse Json Response    ${bct_code_response}    batchContentTypes
    ${bct_code}    Parse Array Json Response    ${get_bct_code}    0    key
    ${bct_code_convert}    To Json    ${bct_code}
    Set Global Variable    ${batchContentTypeCode}    ${bct_code_convert}

Create Batch and Get Batch ID
    [Arguments]    ${bct_code}    ${application_code}    ${work_step_code}
    ${response}    Create Batch    ${bct_code}    ${application_code}    ${work_step_code}
    ${create_batch_response}    To Json    ${response.content}
    ${get_batch_id}    Parse Nested Json Response    ${create_batch_response}    batch    id
    ${get_batch_id}    To Json    ${get_batch_id}
    Set Global Variable    ${batchId}    ${get_batch_id}

Get Batch Content Type Process Steps by process code
    [Arguments]    ${process_step_code}    ${batchContentTypeCode}
    comment    Get Batch Content Type Process Steps by process code
    &{headers}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${batch_responce}    Send Request    Get    /api/v1/batch-content-types/${batchContentTypeCode}/process-steps/${process_step_code}    ${headers}
    [Return]    ${batch_responce}

Get Process Step Application Configuration
    [Arguments]    ${processStepCode}    ${applicationCode}    ${batchContentTypeCode}
    &{headers}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${batch_responce}    Send Request    Get    /api/v1/batch-content-types/${batchContentTypeCode}/process-steps/${processStepCode}/applications/${applicationCode}    ${headers}
    [Return]    ${batch_responce}

Validate Unlocked Batch Process
    [Arguments]    ${file_path}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${body}    Read Request Template File    ${file_path}
    ${response}    Send Request    Post    /api/v1/workflows/batches/locks    ${header}    body=${body}
    [Return]    ${response}

Get Batch Content Type Process Steps
    [Arguments]    ${batchContentTypeCode}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Get    /api/v1/batch-content-types/${batchContentTypeCode}/process-steps    ${header}
    [Return]    ${response}

Validate Get Processing Step Response
    [Arguments]    ${response_content}    ${expected_value}
    ${response_content}    convert to string    ${response_content}
    Should Contain    ${response_content}    ${expected_value}

Create Test Prerequisite
    [Arguments]    ${test_case_id}
    Read Created Test Data    ${test_case_id}    ${TESTDATA_FOLDER}\\AdminPortal\\APIAdminPortalTestData.xlsx
    Create Batch and Get Batch ID    ${batchcontent}[Code]    ${applicationcode}    CAPTR
    ${transfer_id}    CustomLibrary.Genarate GUID
    Set Global Variable    ${create_transfer_job_id}    ${transfer_id}
    ${create_document_id}    CustomLibrary.Genarate GUID
    Set Global Variable    ${document_id}    ${create_document_id}
    ${create_document_transfer_id}    CustomLibrary.Genarate GUID
    Set Global Variable    ${document_page_id}    ${create_document_transfer_id}

Create Batch
    [Arguments]    ${bct_code}    ${application_code}    ${work_step_code}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{param_data}    Create Dictionary    batchContentTypeCode=${bct_code}    applicationCode=${application_code}    workflowStepCode=${work_step_code}    persistenceMode=PersistOnTimeout
    ${response}    Send Request    Post    /api/v1/batches    ${header}    ${param_data}
    [Return]    ${response}

Get Batch Content Type List
    [Arguments]    ${application_code}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    &{bct_param_data}    Create Dictionary    includeInactive=False    applicationCode=${application_code}
    ${response}    Send Request    Get    /api/v1/batch-content-types    ${header}    ${bct_param_data}
    [Return]    ${response}

Validate Batch Response Body
    [Arguments]    ${response}
    ${bstatus}    Run Keyword And Return Status    Validate Response Body    ${response.content}    expected_value=${batchId}
    Run Keyword if    ${bstatus}==True    Fail

Search Batches
    [Arguments]    ${code}    ${application_code}    ${workflow_code}
    ${replace_data}    Create Dictionary    BCTCODE=${code}    APPLICATIONCODE= ${application_code}    WORKFLOWCODE=${workflow_code}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${body}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Search Batch Request Body template.txt    ${replace_data}    String
    ${response}    Send Request    Post    /api/v1/batches/search    ${header}    body=${body}
    [Return]    ${response}

Download Batch Zip
    [Arguments]    ${batchId}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    ${response}    Send Request    Get    /api/v1/transfers/batches/${batchId}    ${api_header}
    [Return]    ${response}

Select Batch
    [Arguments]    ${batch_id}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batch-events/${batchId}/selected    ${api_header}
    [Return]    ${response}

Work Bench Test Prerequisite
    DatabaseOperations.Clear Workbench Testdata From Db
    Get Authentication Token    WKBCH
    ${alternateId_id}    CustomLibrary.Genarate GUID
    Set Global Variable    ${alternate_zonetemplate_id}    ${alternateId_id}

Get Next Batch
    [Arguments]    ${batchcontent}    ${application_code}    ${request_body_path}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{param_data}    Create Dictionary    threadId=1    applicationCode=${application_code}
    ${replace_data}    Create Dictionary    BCTCODE=${batchcontent["Code"]}
    ${request_data}    Read Request Template File    ${request_body_path}    ${replace_data}    String
    ${response}    Send Request    Post    /api/v1/workflows/batches    ${header}    ${param_data}    body=${request_data}
    [Return]    ${response}

Get Batch Content Type
    [Arguments]    ${code}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    ${response}    Send Request    Get    /api/v1/batch-content-types/${code}    ${header}
    [Return]    ${response}

Complete The Batch In Expert Capture
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

Suspend the Batch in Expert Index
    Comment    Post - Search Existing Suspended Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type List
    ${responce}    Get Batch Content Type List    EXIDX
    Validate Response Status Code    ${responce}    200
    comment    POST - Get Next Batch
    ${response}    Get Next Batch    ${batchcontent}    EXIDX    ${EXECDIR}\\TestData\\API_TEMPLATES\\Get Next Batch Request Body.txt
    Validate Response Status Code    ${response}    204
    comment    Download Batch Zip
    ${response}    Download Batch Zip    ${batchId}
    Validate Response Status Code    ${response}    200
    comment    Get BCT Process steps by process code
    ${response}    Get Batch Content Type Process Steps by process code    REVIEW    {batchcontent["Code"]}
    Validate Response Status Code    ${response}    204
    Comment    Post - Update Batch with Single Image file
    ${response}    Update Batch with Single Image file    ${batchId}    ${create_transfer_job_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeSuspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

Open Batch in Expert Index
    comment    Get Batch Content Type List
    ${response}    Get Batch Content Type List    EXIDX
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type
    ${response}    Get Batch Content Type    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type Process Steps
    ${response}    Get Batch Content Type Process Steps    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    POST - Get Next Batch
    ${response}    Get Next Batch    ${batchcontent}    EXIDX    ${EXECDIR}\\TestData\\API_TEMPLATES\\Get Next Batch Request Body.txt
    Validate Response Status Code    ${response}    204
    Comment    Get - Download BatchZip
    ${response}    Download Batch Zip    ${batchId}
    Validate Response Status Code    ${response}    200
    comment    Get BCT Process steps by process code
    ${responce}    Get Batch Content Type Process Steps by process code    REVIEW    ${batchcontent["Code"]}
    Validate Response Status Code    ${responce}    200
    Comment    Get Process Step Application Configuration
    ${responce}    Get Process Step Application Configuration    REVIEW    EXIDX    ${batchcontent["Code"]}
    Validate Response Status Code    ${responce}    200

Open suspended batch in Expert Index
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    comment    Download Batch Zip
    ${responce}    Download Batch Zip    ${batchId}
    Validate Response Status Code    ${responce}    200

Import Electronic Document and Complete Batch In Expert Capture
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

Complete The Batch In Quick Capture
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

Import Electronic Document and Complete Batch In Quick Capture
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

Complete The Batch In Send To Capture
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

Import Electronic Document and Complete Batch In Send To Capture
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

Suspend The Batch In Expert Capture
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

Delete Batch in Expert Capture
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
