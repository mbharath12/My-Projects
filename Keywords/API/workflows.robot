*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Complete Batch
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    &{params}    Create Dictionary    loginId=application/json
    ${response}    Send Request    Post    /api/v1/workflows/batches/${batch_Id}/complete    ${api_header}    ${params}
    [Return]    ${response}

Suspend Batch
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    &{params}    Create Dictionary    loginId=application/json
    ${response}    Send Request    Post    /api/v1/workflows/batches/${batch_Id}/suspend    ${api_header}    ${params}
    [Return]    ${response}

Delete Batch
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    ${response}    Send Request    Delete    /api/v1/batches/${batch_Id}    ${api_header}
    [Return]    ${response}
