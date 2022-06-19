*** Settings ***
Resource          ../Global/super.robot

*** Keywords ***
Create Classification Model
    [Arguments]    ${classification_model_name}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Put    /api/v1/administration/classification-models/${classification_model_name}    ${header}
    ${classification_model_id_created}    Set Variable    True
    Set Global Variable    ${classification_model_id_created}
    [Return]    ${response}

Delete Classification Model
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Delete    /api/v1/administration/classification-models/${classification_model_id}    ${header}
    [Return]    ${response}

Get Workbench Models
    [Arguments]    ${model}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    &{param_data}    Create Dictionary    classificationModelId=
    ${response}    Send Request    Get    /api/v1/administration/${model}    ${header}    ${param_data}
    [Return]    ${response}

Get Classification Model Id and Check Out Time
    ${response}    Run Keyword If    ${classification_model_id_created}==False    Create Classification Model    Model_01
    Run Keyword If    ${classification_model_id_created}==False    Validate Response Status Code    ${response}    200
    ${response}    Get Workbench Models    classification-models
    Validate Response Status Code    ${response}    200
    ${classification_id}    To Json    ${response.content}
    ${classification_model_id}    Get Value From Json    ${classification_id}    [0].id
    ${classification_model_checkout_time}    Get Value From Json    ${classification_id}    [0].checkoutTime
    ${classification_model_checkout_time}    Remove String    ${classification_model_checkout_time}    '
    Set Global Variable    ${classification_model_id}
    Set Global Variable    ${classification_model_checkout_time}

Rename Classification Model
    [Arguments]    ${update_model_name}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${replace_data}    Create Dictionary    MODEL_ID=${classification_model_id}    MODEL_NAME=${update_model_name}    MODEL_CHECK_OUT_TIME=${classification_model_checkout_time}
    ${request_data}    Read Request Template File    ${EXECDIR}\\TestData\\API_TEMPLATES\\Work_Bench\\Update Classification Model.txt    ${replace_data}    String
    ${response}    Send Request    Post    /api/v1/administration/classification-models/${classification_model_id}    ${header}    body=${request_data}
    [Return]    ${response}

Checkin Classification Model
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/administration/classification-models/${classification_model_id}/checkin    ${header}
    [Return]    ${response}

Checkout Classification Model
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Post    /api/v1/administration/classification-models/${classification_model_id}/checkout    ${header}
    [Return]    ${response}

Create Zone Template
    [Arguments]    ${zone_template_id}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${replace_data}    Create Dictionary    ZONE_TEMPLATE_NAME=${zone_template_id}    ALTERNATE_ID=${alternate_zonetemplate_id}
    ${request_data}    Read Request Template File    ${EXECDIR}\\TestData\\API_TEMPLATES\\Work_Bench\\Create Zone Template.txt    ${replace_data}    String
    ${response}    Send Request    Put    /api/v1/administration/zone-templates    ${header}    body=${request_data}
    ${classification_model_id_created}    Set Variable    True
    Set Global Variable    ${classification_model_id_created}
    [Return]    ${response}

Delete Zone Template
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${response}    Send Request    Delete    /api/v1/administration/zone-templates/${alternate_zonetemplate_id}    ${header}
    [Return]    ${response}

Get Zone Template Id
    ${response}    Run Keyword If    ${classification_model_id_created}==False    Create Zone Template    Zone_Template_01
    Run Keyword If    ${classification_model_id_created}==False    Validate Response Status Code    ${response}    200
    ${response}    Get Workbench Models    zone-templates
    Validate Response Status Code    ${response}    200
    ${zone_id}    To Json    ${response.content}
    ${zone_template_id}    Get Value From Json    ${zone_id}    [0].id
    Set Global Variable    ${zone_template_id}

Rename Zone Template
    [Arguments]    ${update_zone_name}
    &{header}    Create Dictionary    encapture_session_token=${session_token}    Content-Type=application/json    User-Agent=""
    ${replace_data}    Create Dictionary    ZONE_TEMPLATE_NAME=${update_zone_name}    MODEL_ID=${zone_template_id}
    ${request_data}    Read Request Template File    ${EXECDIR}\\TestData\\API_TEMPLATES\\Work_Bench\\Update Zone Template.txt    ${replace_data}    String
    ${response}    Send Request    Post    /api/v1/administration/zone-templates/${zone_template_id}    ${header}    body=${request_data}
    [Return]    ${response}
