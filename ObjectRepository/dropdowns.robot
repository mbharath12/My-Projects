*** Variables ***
${dropdown.admin.batchcontenttype.lineofbusiness}    cboLineOfBusinessId
${dropdown.admin.batchcontenttype.batchpriority}    cboWorkItemPriority
${dropdown.admin.batchcontenttype.encryptionalgorithm}    cboEncryptionAlgorithmId
${dropdown.admin.batchcontenttype.allowedbatchcontentformat}    cboAllowedBatchContentFormatCode
${dropdown.admin.batchcontenttype.customfield.customfield}    cboCustomFieldID
${dropdown.admin.batchcontenttype.customfield.capture.options}    //td[contains(text(),'Capture Step')]/..//select[contains(@id,'cboInitialState')]
${dropdown.admin.batchcontenttype.customfield.index.options}    //td[contains(text(),'Index Step')]/..//select[contains(@id,'cboInitialState')]
${dropdown.admin.batchcontenttype.indexing.customfields}    //select[@id="AvailableItems"]
${dropdown.admin.datasource.createdatabasedatasource.databaseconnection}    databaseConnectionComboBox
${dropdown.admin.datasource.createdatabasedatasource.ok}    name:OK
${dropdown.admin.connections.addconnection.database}    databaseComboBox
${dropdown.admin.datasource.defaultvaluedatasource.lookuptype}    lookupTypeComboBox
${dropdown.admin.indexing.datasources.permittedvalue.datasourceconfiguration}    //select[@id='cboPermittedValuesModuleVersionConfig']
${dropdown.admin.indexing.datasources.permittedvalue.valuedatafieldname}    //select[@id='cboPermittedValuesMappedValueFieldName']
${dropdown.admin.indexing.datasources.permittedvalue.displaydatafieldname}    //select[@id='cboPermittedValuesMappedDisplayFieldName']
${dropdown.admin.indexing.datasources.value.datasourceconfiguration}    //select[@id='cboValueModuleVersionConfig']
${dropdown.admin.indexing.datasources.value.valuedatafieldname}    //select[@id='cboValueMappedValueFieldName']
${dropdown.admin.indexing.datasources.validation.datasourceconfiguration}    //select[@id='cboValidationModuleVersionConfig']
${dropdown.admin.indexing.datasources.validation.datafieldname}    //select[@id='cboValidationMappedValueFieldName']
${dropdown.admin.indexing.datasources.validation.validationrule}    //select[@id='cboValidationEvaluationType']
${dropdown.admin.indexing.datasources.validation.validationcondition}    //select[@id='cboValidationRule']
${dropdown.admin.indexing.datasources.validation.validationvalue}    //input[@id='txtValidationValue']
${dropdown.admin.indexing.datasources.ok}    //input[@onclick='updateAction()']
${dropdown.admi.importexport.batchcontenttypes}    //td[@name="tdBatchContentTypes"]
${dropdown.admi.importexport.batchcontenttypes.list}    //select[@id="batchContentTypes"]
${dropdown.collect.selectdocument}    //div[@data-baseweb='select']
${dropdown.collect.contentdetails.dropdown}    //div[@data-baseweb='select']//input[@aria-haspopup='listbox']
${dropdown.collect.contentdetails.options.list}    //div[@data-baseweb='popover']//ul[@role='listbox']
