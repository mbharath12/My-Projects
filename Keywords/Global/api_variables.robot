*** Variables ***
@{application_api_codes}    BMON    ECCLI    SCINT    EXCAP    EXIDX    MSOIN    WKBCH
${encapture_session}    encapture_session
@{invalid_application_code}    SDT
&{application_configuration_OCPTR_key_values}    code=OCPTR    packageName=Encapture Orchestrate    plugInName=Offline Capture Configuration
&{application_configuration_BMON_key_values}    code=BMON    packageName=Encapture Orchestrate    plugInName=Batch Monitor Configuration
&{application_configuration_ECCLI_key_values}    code=ECCLI    packageName=Encapture Orchestrate    plugInName=Encapture Client Configuration
&{application_configuration_SCINT_key_values}    code=SCINT    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_QCPTR_key_values}    code=QCPTR    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_EXCAP_key_values}    code=EXCAP    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_EXIDX_key_values}    code=EXIDX    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_RQSTS_key_values}    code=RQSTS    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_MSOIN_key_values}    code=MSOIN    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_PRINT_key_values}    code=PRINT    packageName=Encapture Orchestrate    plugInName=null
&{application_configuration_WKBCH_key_values}    code=WKBCH    packageName=Encapture Orchestrate    plugInName=Classification and Extraction Workbench Configuration
&{login_validcredentials_key_value}    success=true
&{login_invalidcredentials_key_value}    failureReason=The User ID and/or Password you entered are invalid.
${invalid_batch_id}    80000000-0000-0000-0000-0D0FFFFFFFFFF
&{update_batch_custom_fields}    cancelled=false
@{valid_custom_fields_list}    BatchNo
@{invalid_custom_fields_list}    SDT
${api_create_test_prerequisites}    False
@{invalid_document_custom_fields_list}    PageType
${classification_model_id_created}    False
