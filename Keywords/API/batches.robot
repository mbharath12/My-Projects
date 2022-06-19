*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Update Batch Custom Field Values
    [Arguments]    ${custom_fields}    ${response_status_code}
    &{headers}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${custom_fields_length}    Get Length    ${custom_fields}
    FOR    ${index}    IN RANGE    0    ${custom_fields_length}
        ${batch_custom_fields}    Create Dictionary    CUSTOM FIELD=${custom_fields}[${index}]
        ${body}    Read Request Template File    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch Custom Fields Body.txt    ${batch_custom_fields}
        ${response}    Send Request    Put    /api/v1/batches/${batchId}/fields    ${headers}    ${params}    body=${body}
        ${status}    Run Keyword And Return Status    Validate Response Status Code    ${response}    ${response_status_code}
        Run Keyword If    ${status}==False    Fail    /api/v1/batches/batches/${batchId}/custom-fields- is not getting vaild status code
        Run Keyword If    '${response_status_code}'=='500'    Exit For Loop
        ${status}    Run Keyword And Return Status    Validate Response Body    ${response.content}    ${update_batch_custom_fields}
        Run Keyword If    ${status}==False    Fail    /api/v1/batches/batches/${batchId}/custom-fields- is not getting vaild Response Body
    END

Add Document
    [Arguments]    ${batch_id}    ${document_id}    ${document_page_id}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}    DOCUMENTTRANSFERGUID=${document_page_id}
    ${request_data}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Add Document Request Body Template.txt    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}/documents    ${api_header}    ${params}    body=${request_data}
    [Return]    ${response}

Select Document
    [Arguments]    ${document_id}    ${batch_id}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batch-events/${batch_id}/documents/${document_id}/selected    ${api_header}
    [Return]    ${response}

Update Document
    [Arguments]    ${batch_id}    ${document_id}    ${document_page_id}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}    DOCUMENTTRANSFERGUID=${document_page_id}
    ${request_data}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Document Request Body Template.txt    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}/documents/${document_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Update Document Custom Field
    [Arguments]    ${custom_fields}    ${document_id}    ${response_status_code}
    &{headers}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${custom_fields_length}    Get Length    ${custom_fields}
    FOR    ${index}    IN RANGE    0    ${custom_fields_length}
        ${batch_custom_fields}    Create Dictionary    CUSTOM FIELD=${custom_fields}[${index}]
        ${body}    Read Request Template File    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Document Custom Field Request body.txt    ${batch_custom_fields}
        ${response}    Send Request    Put    /api/v1/batches/batches/${batchid}/documents/${document_id}/custom-fields    ${headers}    ${params}    body=${body}
        ${status}    Run Keyword And Return Status    Validate Response Status Code    ${response}    ${response_status_code}
        Run Keyword If    ${status}==False    Fail    /api/v1/batches/batches/${batchid}/documents/${document_id}/custom-fields
        Run Keyword If    '${response_status_code}'=='500'    Exit For Loop
        ${status}    Run Keyword And Return Status    Validate Response Body    ${response.content}    ${update_batch_custom_fields}
        Run Keyword If    ${status}==False    Fail    /api/v1/batches/batches/${batchId}/custom-fields- is not getting vaild Response Body
    END

Upload Electronic Document With Multiple Pages
    [Arguments]    ${batch_id}    ${document_id}
    ${create_document_page_id1}    CustomLibrary.Genarate GUID
    ${create_document_page_id2}    CustomLibrary.Genarate GUID
    ${create_document_page_id3}    CustomLibrary.Genarate GUID
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}    PAGEGUID1=${create_document_page_id1}    PAGEGUID2=${create_document_page_id2}    PAGEGUID3=${create_document_page_id3}
    ${request_data}    Read Request Template File    ${API_UPLOAD_ELECTRONIC_DOCUMENT_WITH_MULTIPLE_PAGES}    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}/documents/${document_id}    ${api_header}    ${params}    body=${request_data}
    [Return]    ${response}

Add Multiple Electronic Documents
    [Arguments]    ${batchcontent}
    ${update_batch_request}    Create Dictionary    BATCHGUID=${batchId}    BCTCODE=${batchcontent["Code"]}    BCTDESCRIPTION=${batchcontent["Description"]}
    FOR    ${document_count}    IN RANGE    1    5
        ${multiple_transfer_id}    CustomLibrary.Genarate GUID
        ${multiple_document_id}    CustomLibrary.Genarate GUID
        ${multiple_document_page_id}    CustomLibrary.Genarate GUID
        ${response}    Add Document    ${batchId}    ${multiple_document_id}    ${multiple_document_page_id}
        Validate Response Status Code    ${response}    200
        Validate Response Body    ${response.content}    expected_value=${multiple_document_id}
        Comment    Put - Create Transfer
        ${response}    Create Transfer Job    ${multiple_transfer_id}    ${batchId}
        Validate Response Status Code    ${response}    201
        Comment    Post- Document Selected
        ${response}    Select Document    ${multiple_document_id}    ${batchId}
        Validate Response Status Code    ${response}    200
        Comment    Post - Update Document
        ${response}    Update Document    ${batchId}    ${multiple_document_id}    ${multiple_document_page_id}
        Validate Response Status Code    ${response}    200
        Validate Response Body    ${response.content}    expected_value=${multiple_document_id}
        Comment    Post - Transfer Asynchronous
        ${response}    Transfer Asynchronous    ${multiple_transfer_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestDocAPIToUpload.pdf
        Validate Response Status Code    ${response}    200
        Comment    Post- Complete Job
        ${response}    Complete Job    ${multiple_transfer_id}    ${batchId}
        Validate Response Status Code    ${response}    200
        Set To Dictionary    ${update_batch_request}    DOCUMENTGUID${document_count}=${multiple_document_id}    DOCUMENTPAGEGUID${document_count}=${multiple_document_page_id}
        ${update_batch_request_data}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch with Multiple Document Request Body Template.txt    ${update_batch_request}    String
    END
    Set Global Variable    ${update_batch_request_data}

Update Batch
    [Arguments]    ${batch_id}    ${document_id}    ${document_page_id}    ${request_body_path}    ${batchcontent}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}    BATCHGUID=${batch_id}    DOCUMENTPAGEGUID=${document_page_id}    BCTCODE=${batchcontent["Code"]}    BCTDESCRIPTION=${batchcontent["Description"]}
    ${request_data}    Read Request Template File    ${request_body_path}    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Open Batch
    [Arguments]    ${batch_id}    ${application_code}    ${work_step_code}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    &{param_data}    Create Dictionary    applicationCode=${application_code}    workflowStepCode=${work_step_code}    persistenceMode=0
    ${response}    Send Request    Get    /api/v1/batches/${batch_id}    ${header}    ${param_data}
    [Return]    ${response}

Update Batch with Multiple Document
    [Arguments]    ${request_data}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/batches/${batch_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Upload Multiple Image Files
    [Arguments]    ${batchcontent}
    ${update_batch_request}    Create Dictionary    BATCHGUID=${batchId}    BCTCODE=${batchcontent["Code"]}    BCTDESCRIPTION=${batchcontent["Description"]}
    FOR    ${image_count}    IN RANGE    1    4
        ${multiple_transfer_id}    CustomLibrary.Genarate GUID
        Comment    Put - Create Transfer
        ${response}    Create Transfer Job    ${multiple_transfer_id}    ${batchId}
        Validate Response Status Code    ${response}    201
        Comment    Post - Update Batch with multiple image files
        ${response}    Update Batch with Single Image file    ${batchId}    ${multiple_transfer_id}    ${batchcontent}    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Batch with Single Image Request body template.txt
        Validate Response Status Code    ${response}    200
        Comment    Post - Transfer Asynchronous
        ${response}    Transfer Asynchronous    ${multiple_transfer_id}    ${batchId}    ${TESTDATA_FOLDER}\\TestImageToUpload.png
        Validate Response Status Code    ${response}    200
        Comment    Post- Complete Job
        ${response}    Complete Job    ${multiple_transfer_id}    ${batchId}
        Validate Response Status Code    ${response}    200
        Set To Dictionary    ${update_batch_request}    IMGTRANSFERID${image_count}=${multiple_transfer_id}
        ${update_batch_request_data}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch with multiple images Request body template.txt    ${update_batch_request}    String
    END
    Set Global Variable    ${update_batch_request_data}

Update Batch with Multiple Image Files
    [Arguments]    ${request_data}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/batches/${batch_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Update Batch with Single Image file
    [Arguments]    ${batch_id}    ${image_transfer_id}    ${batchcontent}    ${request_body_path}
    ${replace_data}    Create Dictionary    BATCHGUID=${batch_id}    IMGTRANSFERID=${image_transfer_id}    BCTCODE=${batchcontent["Code"]}    BCTDESCRIPTION=${batchcontent["Description"]}
    ${request_data}    Read Request Template File    ${request_body_path}    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Update Batch Custom Field Values With Invalid DataTypes
    [Arguments]    ${custom_fields}    ${response_status_code}
    &{headers}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${custom_fields_length}    Get Length    ${custom_fields}
    FOR    ${index}    IN RANGE    0    ${custom_fields_length}
        ${batch_custom_fields}    Create Dictionary    CUSTOM FIELD=${custom_fields}[${index}]    CUSTOMFIELD DATATYPE=SDT
        ${body}    Read Request Template File    ${EXECDIR}\\TestData\\API_TEMPLATES\\Update Invalid Batch Custom Fields Body.txt    ${batch_custom_fields}
        ${response}    Send Request    Put    /api/v1/batches/${batchId}/fields    ${headers}    ${params}    body=${body}
        ${status}    Run Keyword And Return Status    Validate Response Status Code    ${response}    ${response_status_code}
        Run Keyword If    ${status}==False    Fail    /api/v1/batches/${batchId}/fields API is not getting vaild status code
        Run Keyword If    '${response_status_code}'=='500' or '${response_status_code}'=='400'    Exit For Loop
        ${status}    Run Keyword And Return Status    Validate Response Body    ${response.content}    ${update_batch_custom_fields}
        Run Keyword If    ${status}==False    Fail    /api/v1/batches/batches/${batchId}/custom-fields API is not getting vaild Response Body
    END

Update Batch in Expert Index for Rescan and Reject Document
    [Arguments]    ${batch_id}    ${document_id}    ${document_page_id}    ${request_body_path}    ${batchcontent}    ${reject_reason_code}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}    BATCHGUID=${batch_id}    DOCUMENTPAGEGUID=${document_page_id}    BCTCODE=${batchcontent["Code"]}    BCTDESCRIPTION=${batchcontent["Description"]}    REJECTREASONCODE=${reject_reason_code}
    ${request_data}    Read Request Template File    ${request_body_path}    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Add Document for Text File
    [Arguments]    ${batch_id}    ${document_id}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}
    ${request_data}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Add Document For Text File Request Body Template.txt    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}/documents    ${api_header}    ${params}    body=${request_data}
    [Return]    ${response}

Update Document For Text File
    [Arguments]    ${batch_id}    ${document_id}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}
    ${request_data}    Read Request Template File    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Document For Text File Request Body Template.txt    ${replace_data}    String
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}/documents/${document_id}    ${api_header}    body=${request_data}
    [Return]    ${response}

Update Batch For Text File
    [Arguments]    ${batch_id}    ${document_id}    ${request_body_path}    ${batchcontent}
    ${replace_data}    Create Dictionary    DOCUMENTGUID=${document_id}    BATCHGUID=${batch_id}    BCTCODE=${batchcontent["Code"]}    BCTDESCRIPTION=${batchcontent["Description"]}
    ${request_data}    Read Request Template File    ${request_body_path}    ${replace_data}    String
    log    ${request_data}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batches/${batch_id}    ${api_header}    body=${request_data}
    [Return]    ${response}
