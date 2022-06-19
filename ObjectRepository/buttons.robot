*** Variables ***
${button.adminlogin.continue}    actionButton
${button.window.wizard.clientlogin.save}    saveButton
${button.window.wizard.filesystem.open}    name:Open
${button.window.wizard.next}    btnNext
${button.window.wizard.submittoupload.cancel}    btnCancel
${button.admin.lineofbusiness.addlineofbusiness}    //input[@onclick='addLineOfBusiness()']
${button.admin.lineofbusiness.add.ok}    //input[@onclick='addRecord()']
${button.admin.batchcontenttype.addbatchcontenttype}    addButton
${button.admin.batchcontenttype.add.ok}    //input[@onclick='addRecord()']
${button.admin.add.customfield}    //input[@onclick='addCustomField()']
${button.admin.batchcontenttype.addcustomfields.ok}    //input[@onclick='addAction()']
${button.admin.batchcontent.adddocument}    //input[@onclick='addDocumentClass()']
${button.admin.lineofbusiness.addfunctional.all}    //a[@onclick='addAllItems()']
${button.admin.lineofbusiness.addfunctional.ok}    //input[@onclick='saveAction()']
${button.admin.customfield.back}    cancelButton
${button.admin.batchcontenttype.selectindividualfile}    //a[@onclick='addSelectedItem()']
${button.admin.next}    //a[@id="aNextPage"]
${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep}    addUserInterfaceStepButton
${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep.ok}    //input[@onclick='addRecord()']
${button.admin.batchcontenttype.bacthprocessingsteps.back}    //input[@value="Back"]
${button.admin.batchcontenttype.bacthprocessingsteps.stepname.index}    //a[text()='Review']
${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}    //input[@onclick='updateRecord()']
${button.admin.batchcontenttype.bacthprocessingsteps.userinterfacedelete.yes}    //button[text()='Yes']
${button.admin.batchcontenttype.indexing.adddocumentclass}    //input[@id="addDocumentClassButton"]
${button.window.wizard.ok}    name:OK
${button.admin.datasource.createdatabasedatasource.adddatasourcemapping}    addButton
${button.admin.add.permittedvaluedatasource}    //input[normalize-space(@value)='Add Permitted Values Data Source']
${buton.admin.permittedvaluedatasource.addpermittedvalue}    Add
${button.admin.connections.adddatabaseconnections.testconnection}    testConnectionButton
${button.admin.connections.adddatabaseconnection}    //input[normalize-space(@value)='Add Database Connection']
${button.admin.datasource.adddatabasedatasource}    //input[normalize-space(@value)='Add Database Data Source']
${button.admin.datasource.adddatabasedatasource.add}    name:Add
${button.admin.add.defaultvaluedatasource}    //input[normalize-space(@value)='Add Default Value Data Source']
${button.admin.dependentfields.addfields}    //input[@name="addButton"]
${button.admin.add.defaultvaluedatasource.addfields.ok}    //input[@onclick='updateAction()']
${button.admin.add.defaultvaluedatasource.addfields.field}    //select[@name="cboFieldID"]
${button.admin.dataconnections.showdetails}    name:Show Details >>
${button.admin.sessionmanagement.sessiontimeoutsettings}    //input[@onclick='timeoutSettings()']
${button.admin.sessionmanagement.sessiontimeoutsettings.applicationsessiontimeoutminutes}    //input[@id='txtApplicationSessionTimeoutMinutes']
${button.admin.importexport.choosefile}    //td[@id="tdConfigurationFile"]
${button.admin.importexport.choosefile.fileupload}    //input[@name="configurationFile"]
${button.collect.continue}    //button[text()='Continue']
${button.collect.reviewandsubmit}    //button[text()='Review & Submit']
${button.collect.browsefiles}    //button[text()='Browse files']
${button.collect.saveasdocument}    //button[text()='Save as Document']
${button.collect.submit}    //button[text()='Submit']
${button.collect.close}    //button[text()='Close']
${button.collect.browsefiles.upload}    //input[@type="file"]
${button.collect.documentdetails.edit}    //section[@data-baseweb='card']//div[2]//button[1]
${button.collect.editfiles.zoomin}    //h6[text()='Edit File(s)']//following::button[5]
${button.collect.editfiles.zoomout}    //h6[text()='Edit File(s)']//following::button[4]
${button.collect.document.class.editdocumentclass}    //h6[text()='Documents']//following::button[1]
${button.collect.uploadmorefiles}    //button[text()='Upload More Files']
${button.collect.cancel}    //button[text()='Cancel']
${button.collect.uploadfiles.myscanner}    //button[text()='My Scanner']
${button.collect.uploaddocument.editdocument}    //h6[text()='Documents']//following::button[1]
${button.collect.editdocument.deletedocument}    //section[@data-baseweb='card']//div[2]//button[4]
${button.collect.editdocument.editfile}    //section[@data-baseweb='card']//div[2]//button[1]
${button.collect.editfiles.split}    //h6[text()='Edit File(s)']//following::button[1]
${button.collect.editfiles.delete}    //h6[text()='Edit File(s)']//following::button[3]
${button.collect.editfiles.done}    //button[text()='Done']
${button.collect.editfiles.cancel}    //button[text()='Done']//preceding-sibling::button[text()='Cancel']
${button.collect.documentdetails.edit}    //section[@data-baseweb='card']//div[2]//button[1]
${button.collect.document.class.editdocumentclass}    //h6[text()='Documents']//following::button[1]
${button.collect.editfiles.rotatepage}    //h6[text()='Edit File(s)']//following::button[2]
