*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Create Transfer Job
    [Arguments]    ${transfer_job_id}    ${batchid}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    ${get_response}    Send Request    Put    /api/v1/transfers/${transfer_job_id}/batches/${batchid}    ${api_header}
    [Return]    ${get_response}

Transfer Asynchronous
    [Arguments]    ${transfer_job_id}    ${batch_id}    ${body_request_file_path}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/octet-stream    User-Agent=""
    ${body}    CustomLibrary.Read File To Binary    ${body_request_file_path}
    ${file_path}    Set Variable    ${body_request_file_path}
    ${file_type}    Split String    ${file_path}    .
    &{params}    Create Dictionary    physicalAddress=D8FC935490C4    hostName=DESKTOP-T5BQBGJ    applicationCode=${applicationcode}    originalFileName=${document_id}.${file_type}[1]
    ${response}    Send Request    Post    /api/v1/transfers/${transfer_job_id}/batches/${batch_id}/transfer    ${api_header}    ${params}    ${body}
    [Return]    ${response}

Complete Job
    [Arguments]    ${transfer_job_id}    ${batch_id}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    &{params}    Create Dictionary    applicationCode=${applicationcode}
    ${response}    Send Request    Post    /api/v1/transfers/${transfer_job_id}/batches/${batch_id}/complete-job    ${api_header}    ${params}
    [Return]    ${response}
