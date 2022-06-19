*** Variables ***
${label.adminhomepage.username}    //a[@id='loginIdLabel' and not(text()='Login')]
${label.adminhomepage.logout}    //a[@onclick='toLogout()']
${label.wizard.loginpage.login}    loginIdItem
${label.window.wizard.browsefile}    lnkBrowse
${label.window.wizard.commonIndexdata}    name:Common Index Data
${label.window.wizard.contentsubmissiom}    name:Content Submission
${label.window.wizard.submitupload.complete}    name:Complete
${label.window.wizard.multipagecontent}    name:Multipage Content Options
${label.window.wizard.documentclassification}    name:Document Classification
${label.window.wizard.addanotherdocument}    name:Add Another Document?
${label.window.wizard.typeofcontent}    name:Content Classification
${label.window.wizard.documentassembly}    name:Document Assembly
${label.admin.lineofbusiness.add}    //td[text()='LINE OF BUSINESS - ADD']
${label.admin.batchcontenttype}    //td[text()='BATCH CONTENT TYPES']
${label.admin.add.batchcontenttype.add}    //td[normalize-space(text())='BATCH CONTENT TYPE - ADD']
${label.admin.lineofbusiness}    //td[text()='LINES OF BUSINESS']
${label.admin.batchcontent.customfields}    //td[text()='CUSTOM FIELDS']
${label.admin.batchcontenttype.addcustom}    //td[text()='BATCH CONTENT TYPE - ADD \ CUSTOM FIELD']
${label.admin.batchcontent.documentclass}    //td[text()='DOCUMENT CLASSES']
${label.admin.batchcontenttype.documentclass.add}    //td[text()='DOCUMENT CLASS - ADD']
${label.admin.add.assignfunctiongroups}    //td[text()='LINE OF BUSINESS - ASSIGN FUNCTION GROUPS']
${label.admin.batchcontenttype.scanmodes}    //td[text()='BATCH CONTENT TYPE - ASSIGN SCAN MODES']
${label.admin.batchcontent.fileformats}    //td[normalize-space(text())='Available Electronic Document File Formats']
${label.admin.batchcontent.documentclass.add}    //td[text()='DOCUMENT CLASS - ADD CUSTOM FIELD']
${label.admin.page.information}    //td[contains(text(),'Page')]
${label.admin.batchcontent.batchprocessingsteps}    //td[contains(text(),'BATCH PROCESSING STEPS FOR BATCH CONTENT TYPE')]
${label.admin.batchcontent.batchprocessingsteps.userinterfacestep}    //td[text()='USER INTERFACE STEP - ADD']
${label.admin.batchcontent.batchprocessingsteps.batchprocessing}    //td[text()='BATCH PROCESSING STEPS']
${label.admin.batchcontent.batchprocessingsteps.capture}    //a[text()='Capture']
${label.admin.batchcontent.batchprocessingsteps.index}    //a[text()='Review']
${label.admin.batchcontent.batchprocessingsteps.capture.update}    //td[text()='CAPTURE STEP - UPDATE']
${label.admin.batchcontent.indexing.indexingconfiguration}    //td[text()='INDEXING CONFIGURATION']
${label.admin.batchcontent.batchprocessingsteps.capture.expertcapture}    //a[text()='Expert Capture']
${label.admin.batchcontent.batchprocessingsteps.userinterfacestep.update}    //td[text()='USER INTERFACE STEP - UPDATE']
${label.wizard.orchestrator.orchestratortext}    //td[@class='siteTDHeader']
${label.admin.connections.adddatabaseconnection.testconnection.testconnectionsucceed}    name:RichEdit Control
${label.admin.indexing.datasources.batchcontenttypefields}    //td[text()='BATCH CONTENT TYPE FIELD DATA SOURCE CONFIGURATION']
${label.admin.indexing.dependentfields.dependentfieldslist}    //td[contains(text(),'DEPENDENT FIELD - LIST FOR FIELD')]
${label.admin.importexportconfiguration}    //td[text()='IMPORT/EXPORT CONFIGURATION']
${label.collect.selectcontenttype}    //h6[text()='Select Content Type']
${label.collect.contentdetails}    //h6[text()='Content Details']
${label.collect.uploadfiles}    //h6[text()='Upload Files']
${label.collect.completesubmission}    //div[text()='Submission Complete!']
${label.collect.help}    //div[text()='Help']
${label.collect.batchwarningmessage}    //div[contains(text(),'There are no Content Types setup')]
${label.collect.fieldtypes.alert}    //div[@role='alert']
${label.collect.sending}    //div[contains(text(),'Sending')]
${label.collect.documentdetails}    //h6[text()='Document Details']
${label.collect.editdocument.editfiles}    //h6[text()='Edit File(s)']
${label.collect.uploaddocument.documentcode}    //h6[text()='Documents']//following::button[1]//parent::div
${label.collect.editdocument.editfiles}    //h6[text()='Edit File(s)']
${label.collect.documentdetails}    //h6[text()='Document Details']
${label.collect.documentdetails.pagecount}    //section[@data-baseweb='card']//div[2]//button[2]//following::span
${label.collect.uploadfiles.undefinedpage}    //*[contains(text(),'undefined')]
${label.collect.reviewdocuments}    //div[text()='Review Document Details']
