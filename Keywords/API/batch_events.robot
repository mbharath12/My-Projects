*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Content Acquisition Complete
    [Arguments]    ${batchId}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/batch-events/${batchId}/content-acquisition-complete    ${header}
    [Return]    ${response}

Before Complete
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${response}    Send Request    Post    /api/v1/batch-events/${batchId}/before-complete    ${header}    ${params}
    [Return]    ${response}

Before Suspend
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${response}    Send Request    Post    /api/v1/batch-events/${batchId}/before-suspend    ${header}    ${params}
    [Return]    ${response}

Before Delete
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    isAutoIndexing=False
    ${response}    Send Request    Post    /api/v1/batch-events/${batchId}/before-delete    ${header}    ${params}
    [Return]    ${response}

Reject Batch in Expert Index
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    loginId=application/json    threadId=1    applicationCode=${application_code}    rejectReasonCode=Invalid    rejectNote=""
    ${response}    Send Request    Post    /api/v1/workflows/batches/${batchId}/reject    ${header}    ${params}
    Validate Response Status Code    ${response}    200

Release Batch
    [Arguments]    ${batchId}    ${application_code}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{params}    Create Dictionary    applicationCode=${application_code}    workflowLoginId=${ADMIN_USER_ID}    workflowStatus=New
    ${response}    Send Request    Post    /api/v1/workflows/batches/${batchId}/release    ${header}    ${params}
    [Return]    ${response}
