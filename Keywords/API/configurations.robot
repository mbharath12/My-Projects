*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Validate Application Configuration Response
    [Arguments]    ${applications_code}    ${response_status}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    ${count}    Get Length    ${applications_code}
    FOR    ${index}    IN RANGE    ${count}
        ${get_response}    Send Request    Get    /api/v1/configurations/application/${applications_code}[${index}]    ${api_header}
        ${status}    Run Keyword And Return Status    Validate Response Status Code    ${get_response}    ${response_status}
        Run Keyword If    ${status}==False    Fail    /api/v1/configurations/application/${applications_code}[${index}] - is not getting vaild status code
        Run Keyword If    '${response_status}'=='500'    Continue For Loop
        ${status}    Run Keyword And Return Status    Validate Response Body    ${get_response.content}    ${application_configuration_${application_api_codes}[${index}]_key_values}
        Run Keyword If    ${status}==False    Fail    /api/v1/configurations/application/${applications_code}[${index}] - is not getting vaild Response
    END

Validate Application Logging Configuration Response
    [Arguments]    ${applications_code}    ${response_status}
    &{api_header}    Create Dictionary    encapture_session_token=${session_token}    User-Agent=""
    ${count}    Get Length    ${applications_code}
    FOR    ${index}    IN RANGE    ${count}
        ${get_response}    Send Request    Get    /api/v1/configurations/application/${applications_code}[${index}]/Logging    ${api_header}
        ${status}    Run Keyword And Return Status    Validate Response Status Code    ${get_response}    ${response_status}
        Run Keyword If    ${status}==False    Fail    /api/v1/configurations/application/${applications_code}[${index}]/Logging - is not getting vaild Response
    END
