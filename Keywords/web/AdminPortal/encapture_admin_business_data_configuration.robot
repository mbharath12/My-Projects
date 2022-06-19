*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Create Line of Business
    [Arguments]    ${lineofbusiness}
    Wait Until Element Is Enabled    ${button.admin.lineofbusiness.addlineofbusiness}    ${LONG_WAIT}
    Wait Until Element Is Visible    ${button.admin.lineofbusiness.addlineofbusiness}    ${LONG_WAIT}    Add Line of Business button is not visible after waiting for ${LONG_WAIT}
    Click Element    ${button.admin.lineofbusiness.addlineofbusiness}
    Wait Until Element Is Visible    ${label.admin.lineofbusiness.add}    ${LONG_WAIT}    LINE OF BUSINESS - ADD is not visible after waiting for ${LONG_WAIT}
    SeleniumLibrary.Input Text    ${textbox.admin.lineofbusiness.add.code}    ${lineofbusiness["Code"]}
    SeleniumLibrary.Input Text    ${textbox.admin.lineofbusiness.add.description}    ${lineofbusiness["Description"]}
    Click Element    ${button.admin.batchcontenttype.add.ok}
    Wait Until Element Is Visible    ${label.admin.lineofbusiness}    ${LONG_WAIT}    LINE OF BUSINESS - LIST is not visible after waiting for ${LONG_WAIT}
    ${page_count}    Get LOB or BCT Page Count
    FOR    ${count}    IN RANGE    0    ${page_count}
        ${bStatus}    Run Keyword And Return Status    Wait Until Element Is Visible    //td[normalize-space()='${lineofbusiness["Code"]}']    ${LONG_WAIT}
        Run Keyword If    ${bStatus}==True    Exit For Loop
        Run Keyword If    ${bStatus}==False and ${count}==${page_count-1}    Fail    ${lineofbusiness["Code"]} - Line of Business is not created
        Navigate to Next page
    END

Assign Functional Groups
    [Arguments]    ${code}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'assignFunctionGroups') ]    ${LONG_WAIT}    LINE OF BUSINESS - LIST is not visible after waiting for 5s
    Click Element    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'assignFunctionGroups') ]
    Wait Until Element Is Visible    ${label.admin.add.assignfunctiongroups}    ${LONG_WAIT}
    Click Element    ${button.admin.lineofbusiness.addfunctional.all}
    Click Element    ${button.admin.lineofbusiness.addfunctional.ok}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'assignFunctionGroups') and contains(text(),'Assigned')]    ${LONG_WAIT}    error=Functional Groups are not assigned to ${code}

Create Line of Business and Assign Functional Groups
    [Arguments]    ${lineofbusiness}
    Navigate to Menu    BUSINESS DATA CONFIGURATION    LINES OF BUSINESS
    ${length}    Get Length    ${lineofbusiness}
    Run Keyword If    ${length}==0    Fail    Test data is not available, please check the test data file.
    Create Line of Business    ${lineofbusiness}
    Run Keyword If    '${lineofbusiness["Function Groups"]}'=='Yes'    Assign Functional Groups    ${lineofbusiness["Code"]}

Create Batch Content Type
    [Arguments]    ${batchcontent}
    Wait Until Element Is Enabled    ${button.admin.batchcontenttype.addbatchcontenttype}    ${LONG_WAIT}
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.addbatchcontenttype}    ${LONG_WAIT}    BATCH CONTENT TYPE - LIST is not visible after waiting for 10s
    Click Element    ${button.admin.batchcontenttype.addbatchcontenttype}
    Wait Until Element Is Visible    ${label.admin.add.batchcontenttype.add}    ${LONG_WAIT}    BATCH CONTENT TYPE - ADD is not visible after waiting for 10s
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.add.code}    ${batchcontent["Code"]}
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.add.description}    ${batchcontent["Description"]}
    Select From List By Label    ${dropdown.admin.batchcontenttype.lineofbusiness}    ${batchcontent["Line Of Business"]}
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.add.maximumfilesize}    ${batchcontent["Electronic Document Maximum File Size"]}
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.add.documentcount}    ${batchcontent["Maximum Allowed Document Count"]}
    Click Element    ${button.admin.batchcontenttype.add.ok}
    Wait Until Element Is Visible    ${label.admin.batchcontenttype}    ${LONG_WAIT}    BATCH CONTENT TYPES is not visible after waiting for 10s
    ${page_count}    Get LOB or BCT Page Count
    FOR    ${count}    IN RANGE    0    ${page_count}
        ${bStatus}    Run Keyword And Return Status    Wait Until Element Is Visible    //td[normalize-space()='${batchcontent["Code"]}']    ${LONG_WAIT}
        Run Keyword If    ${bStatus}==True    Exit For Loop
        Run Keyword If    ${bStatus}==False and ${count}==${page_count-1}    Fail    ${batchcontent["Code"]} Batch Content is not created
        Navigate to Next page
    END

Assign Custom Index Fields to Document Class
    [Arguments]    ${doc_class_custom_fields_data}
    Wait Until Element Is Visible    //a[text()='${doc_class_custom_fields_data}[Description]']//following::a[text()='Assign Custom Fields']    ${MEDIUM_WAIT}    ${doc_class_custom_fields_data}[Description]'] assined custom fields option is not visible after waiting for 10s
    Click Element    //a[text()='${doc_class_custom_fields_data}[Description]']//following::a[text()='Assign Custom Fields']    \    ${doc_class_custom_fields_data}[Description]
    @{keys}    Get Dictionary Keys    ${doc_class_custom_fields_data}
    @{index}    Get Matches    ${keys}    IndexField*
    FOR    ${key}    IN    @{index}
        ${indexfield}    Set Variable    ${doc_class_custom_fields_data["${key}"]}
        @{splitindex}    Split String    ${indexfield}    |
        ${indexfieldslen}    Get Length    ${splitindex}
        Run Keyword If    '${indexfieldslen}'!='3'    Fail    Please set Capture Step Settings and Index Step Settings in the test data file.
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${capture_step_settings}    Set Variable    ${splitindex}[1]
        ${index_step_settings}    Set Variable    ${splitindex}[2]
        Assign Custom Index Fields    ${custom_field_name}
    END
    Click Element    ${button.adminlogin.continue}

Assign Scan Modes
    [Arguments]    ${code}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'assignScanModeTypes') ]    ${LONG_WAIT}
    Click Element    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'assignScanModeTypes') ]
    Wait Until Element Is Visible    ${label.admin.batchcontenttype.scanmodes}    ${LONG_WAIT}    BATCH CONTENT TYPE - ASSIGN SCAN MODES is not visible after waiting for 10s
    Click Element    ${button.admin.lineofbusiness.addfunctional.all}
    Click Element    ${button.admin.lineofbusiness.addfunctional.ok}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'assignScanModeTypes')and contains(text(),'Assigned')]    ${LONG_WAIT}    error= Scan Modes are not Assigned - ${code}

Assign File Formats to BCT
    [Arguments]    ${code}    ${file_formats}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'manageFileFormats') ]    ${LONG_WAIT}
    Click Element    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'manageFileFormats') ]
    Wait Until Element Is Visible    ${label.admin.batchcontent.fileformats}    ${LONG_WAIT}    Available Electronic Document File Formats are not visible after waiting for 5s
    Run Keyword If    '${file_formats}'=='All'    Click Element    ${button.admin.lineofbusiness.addfunctional.all}
    ...    ELSE    Select Individual File Format    ${file_formats}
    Click Element    ${button.admin.lineofbusiness.addfunctional.ok}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'manageFileFormats')and contains(text(),'Assigned')]    ${LONG_WAIT}    error= File Formats are not assigned- ${code}

Create Batch Content and Document Class Then Assign Custom Index Fields
    [Arguments]    ${batch_content}    ${doc_class_rows}
    Navigate to Menu    BUSINESS DATA CONFIGURATION    BATCH CONTENT TYPES
    Create Batch Content Type    ${batch_content}
    Wait Until Element Is Visible    ${label.admin.batchcontenttype}    ${LONG_WAIT}    BATCH CONTENT TYPE - LIST is not visible after waiting for 10s
    Click Element    //td[normalize-space()='${batchcontent}[Code]']/following-sibling::td/a[contains(@onclick,'assignFields') ]
    Wait Until Element Is Visible    //td[contains(text(),'FIELDS CONFIGURATION FOR BATCH CONTENT TYPE')]    ${LONG_WAIT}    FIELDS CONFIGURATION FOR BATCH CONTENT TYPE is not visible after waiting for 10s
    Click Element    //a[contains(@onclick,"assignFields")]
    @{index}    Get Matches    ${batch_content}    IndexField*
    @{list_of_bct}    Create List
    Assign Custom Index Fields    ${batch_content}    @{index}
    Enable Data Sources and Dependent Fields to Fields    ${batch_content}
    Create Document Class And Assign Doc Class Custom Fields    ${batchcontent}[Code]    ${doc_class_rows}
    Assign Scan Modes    ${batch_content["Code"]}
    Set To Dictionary    ${bct_custom_fields_list}    ${batchcontent}[Test Case Reference Id]=${list_of_bct}

Select Main Content
    Select Frame    ${frame.admin.homepage}
    Wait Until Element Is Visible    ${frame.admin.adminpage.content}    ${LONG_WAIT}
    Select Frame    ${frame.admin.adminpage.content}

Select Individual File Format
    [Arguments]    ${file_formats}
    @{splitfileformats}    Split String    ${file_formats}    |
    FOR    ${fileformat}    IN    @{splitfileformats}
        Click Element    //option[text()='${fileformat}']
        Click Element    ${button.admin.batchcontenttype.selectindividualfile}
    END

Create Document Class
    [Arguments]    ${document_code}    ${description}    ${document_label}
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.indexing.adddocumentclass}    ${LONG_WAIT}
    Click Element    ${button.admin.batchcontenttype.indexing.adddocumentclass}
    Wait Until Element Is Visible    ${label.admin.batchcontenttype.documentclass.add}    ${LONG_WAIT}    DOCUMENT CLASS - ADD is not visible after waiting for 5s
    SeleniumLibrary.Input Text    ${textbox.admin.lineofbusiness.add.code}    ${document_code}
    SeleniumLibrary.Input Text    ${textbox.admin.lineofbusiness.add.description}    ${description}
    SeleniumLibrary.Input Text    ${textbox.batchcontenttype.documentclass.documentlabel}    ${document_label}
    Click Element    ${button.admin.batchcontenttype.add.ok}
    Wait Until Element Is Visible    //td[normalize-space()='${description}']    ${LONG_WAIT}    Error -Document Class ${description} is not created sucessfully

Assign Custom Index Fields
    [Arguments]    ${custom_fields_data}    @{index}
    FOR    ${key}    IN    @{index}
        ${indexfield}    Set Variable    ${custom_fields_data["${key}"]}
        @{splitindex}    Split String    ${indexfield}    |
        ${indexfieldslen}    Get Length    ${splitindex}
        Run Keyword If    '${indexfieldslen}'!='3'    Fail    Please set Capture Step Settings and Index Step Settings in the test data file.
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${capture_step_settings}    Set Variable    ${splitindex}[1]
        ${index_step_settings}    Set Variable    ${splitindex}[2]
        Wait Until Element Is Visible    ${dropdown.admin.batchcontenttype.indexing.customfields}    ${LONG_WAIT}
        Sleep    1s
        SeleniumLibrary.Double Click Element    //option[text()='${custom_field_name}']
    END
    Wait Until Element Is Visible    ${button.admin.lineofbusiness.addfunctional.ok}    ${LONG_WAIT}
    Click Element    ${button.admin.lineofbusiness.addfunctional.ok}
    ${status}    Run Keyword And Return Status    Wait Until Element Is Not Visible    ${button.admin.lineofbusiness.addfunctional.ok}    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Click Element    ${button.admin.lineofbusiness.addfunctional.ok}

Create Document Class And Assign Doc Class Custom Fields
    [Arguments]    ${BCTCode}    ${doc_class_data}
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        Create Document Class    ${each_doc_class}[Code]    ${each_doc_class}[Description]    ${each_doc_class}[Document Label Format]
        Wait Until Element Is Visible    //a[text()='${each_doc_class}[Description]']//following::a[text()='Assign Fields']    ${LONG_WAIT}    ${each_doc_class}[Description] assined custom fields option is not visible after waiting for 10s
        Click Element    //a[text()='${each_doc_class}[Description]']//following::a[text()='Assign Fields']
        @{keys}    Get Dictionary Keys    ${each_doc_class}
        @{index}    Get Matches    ${keys}    IndexField*
        Assign Custom Index Fields    ${each_doc_class}    @{index}
        Enable Data Sources and Dependent Fields to Fields    ${each_doc_class}
    END
    Wait Until Element Is Visible    ${button.admin.customfield.back}    ${LONG_WAIT}
    Click Element    ${button.admin.customfield.back}
    ${status}    Run Keyword And Return Status    Wait Until Element Is Not Visible    ${button.admin.customfield.back}    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Click Element    ${button.admin.customfield.back}

Navigate to Next page
    Wait Until Element Is Visible    ${button.admin.next}    ${LONG_WAIT}    Next button is not displayed
    Click Element    ${button.admin.next}

Get LOB or BCT Page Count
    Wait Until Element Is Visible    ${label.admin.page.information}    ${LONG_WAIT}    Pege information Label is not visible after waiting for 5 seconds
    ${admin_page_information}    SeleniumLibrary.Get Text    ${label.admin.page.information}
    @{page_information_split}    Split String    ${admin_page_information}
    ${page_count}    Set Variable    ${page_information_split}[3]
    ${page_count}    Convert To Integer    ${page_count}
    [Return]    ${page_count}

Add User Interface Step
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep}    ${LONG_WAIT}
    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.userinterfacestep}    ${MEDIUM_WAIT}    error = USER INTERFACE STEP - ADD Page is not visible after waiting for 10s
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.batchprocessingsteps.adduserinterfacestep.stepcode}    Index
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.batchprocessingsteps.adduserinterfacestep.name}    Index
    SeleniumLibrary.Input Text    ${textbox.admin.batchcontenttype.batchprocessingsteps.adduserinterfacestep.shortname}    Index

Handle Encapture Administration Window
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${LONG_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    WhiteLibrary.Wait Until Item Exists    okButton    ${LONG_WAIT}
    WhiteLibrary.Click Button    okButton
    sleep    1s

Configure Applications in Capture Step
    [Arguments]    ${batch_content}
    Wait Until Element Is Visible    ${checkbox.admin.batchcontent.batchprocessingsteps.capture.expertcapture}    ${LONG_WAIT}
    Run Keyword If    '${batch_content}[Applications]'=='CAPTURE'    Unselect Checkbox    ${checkbox.admin.batchcontent.batchprocessingsteps.capture.expertcapture}
    Run Keyword If    '${batch_content}[Applications]'!='CAPTURE'    Add Applications in Capture Step    ${batch_content["Applications"]}
    Run Keyword If    '${batch_content}[Applications]'!='CAPTURE'    Configure settings for Expert Capture in Capture Step    ${batch_content}

Navigate to Batch Content Page from Batch Processing step
    [Arguments]    ${code}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.batchprocessing}    ${LONG_WAIT}    BATCH PROCESSING STEPS is not visible after waiting for 10s
    Wait Until Element Is Visible    cancelButton    ${LONG_WAIT}
    SeleniumLibrary.Click Element    cancelButton
    Sleep    2s
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'setProcessSteps')]    ${LONG_WAIT}    BATCH CONTENT TYPE - LIST is not visible after waiting for 10s

Navigate to Batch Processing steps page
    [Arguments]    ${code}
    Wait Until Element Is Visible    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'setProcessSteps')]    ${LONG_WAIT}    BATCH CONTENT TYPE - LIST is not visible after waiting for 10s
    Click Element    //td[normalize-space()='${code}']/following-sibling::td/a[contains(@onclick,'setProcessSteps')]
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.batchprocessing}    ${LONG_WAIT}    BATCH PROCESSING STEPS is not visible after waiting for 10s

Configure Capture Steps
    [Arguments]    ${batch_content}    ${doc_class_data}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.capture}    ${LONG_WAIT}
    Click Element    ${label.admin.batchcontent.batchprocessingsteps.capture}
    Configure Applications in Capture Step    ${batch_content}
    Configure Multiple Custom Fields Properties For BCT In Capture Step    ${batch_content}
    Configure Multiple Custom Fields Properties For Document Classes In Capture Step    ${doc_class_data}    ${batch_content}

Assign Custom Index Fields to BCT
    [Arguments]    ${code}    ${custom_field}
    Wait Until Element Is Visible    //td[contains(text(),'INDEXING CONFIGURATION FOR BATCH CONTENT TYPE')]    ${MEDIUM_WAIT}    INDEXING CONFIGURATION FOR BATCH CONTENT TYPE is not visible after waiting for 10s
    Click Element    //a[contains(@onclick,"assignCustomFields")]
    Wait Until Element Is Visible    //td[text()='BATCH CONTENT TYPE - ASSIGN CUSTOM FIELDS']    ${MEDIUM_WAIT}    BATCH CONTENT TYPE - ASSIGN CUSTOM FIELDS is not visible after waiting for 10s
    Assign Custom Index Fields    ${custom_field}
    Click Element    ${button.adminlogin.continue}

Configure Batch Processing Steps for BCT And Document Classes
    [Arguments]    ${batch_content}    ${doc_class_data}
    Navigate to Batch Processing steps page    ${batchcontent}[Code]
    Run Keyword If    '${batch_content}[Applications]'!='NONE'    Configure Capture Steps    ${batch_content}    ${doc_class_data}
    Navigate from Capture Step to Batch Processing Step
    Run Keyword If    '${batch_content}[Add User Interface Step]'=='NA'    Delete User Interface Step
    Run Keyword If    '${batch_content}[Add User Interface Step]'=='Yes'    Edit Conditions For Index
    Run Keyword If    '${batch_content}[Add User Interface Step]'=='Yes'    Add Custom Fields in User Interface Step    ${batch_content}    ${doc_class_data}
    Sleep    20ms
    Navigate to Batch Content Page from Batch Processing step    ${batchcontent}[Code]

Navigate from Capture Step to Batch Processing Step
    ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.batchprocessing}
    Run Keyword If    ${status}==True    Return From Keyword
    Sleep    500ms
    Wait Until Page Contains Element    ${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}    ${LONG_WAIT}    "OK" button is not visible after waiting 45 seconds
    SeleniumLibrary.Click Button    ${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.capture}    ${LONG_WAIT}    "Capture" link in Batch processin step is not visible after waiting 45 seconds

Configure Multiple Custom Fields Properties For Document Classes In Capture Step
    [Arguments]    ${doc_class_data}    ${batch_content}
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        Configure Custom Fields Properties For Document Class In Capture Step    ${each_doc_class}    ${batch_content}
    END

Configure Multiple Custom Fields Properties For BCT In Capture Step
    [Arguments]    ${batch_content}
    @{index}    Get Matches    ${batch_content}    IndexField*
    Run Keyword If    @{index}==0    Return From Keyword
    FOR    ${key}    IN    @{index}
        ${indexfield}    Set Variable    ${batch_content["${key}"]}
        @{splitindex}    Split String    ${indexfield}    |
        ${indexfieldslen}    Get Length    ${splitindex}
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${capture_step_settings}    Set Variable    ${splitindex}[1]
        ${description}    Set Variable    Batch
        Set Custom Fields Properties For BCT and Document Classes in Capture Step    ${description}    ${custom_field_name}    ${capture_step_settings}
    END

Configure Multiple Custom Fields Properties For BCT In Index Step
    [Arguments]    ${batch_content}
    @{index}    Get Matches    ${batch_content}    IndexField*
    Run Keyword If    @{index}==0    Navigate from Capture Step to Batch Processing Step    ${batch_content}
    FOR    ${key}    IN    @{index}
        ${indexfield}    Set Variable    ${batch_content["${key}"]}
        @{splitindex}    Split String    ${indexfield}    |
        ${indexfieldslen}    Get Length    ${splitindex}
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${capture_user_interface_step}    Set Variable    ${splitindex}[2]
        ${description}    Set Variable    Batch
        Set Custom Fields Properties For BCT and Document Classes in Index Step    ${description}    ${custom_field_name}    ${capture_user_interface_step}
    END

Configure Multiple Custom Fields Properties For Document Classes In Index Step
    [Arguments]    ${doc_class_data}    ${batch_content}
    FOR    ${key}    IN    @{doc_class_data.keys()}
        &{each_doc_class}    Set Variable    ${doc_class_data['${key}']}
        Configure Custom Fields Properties For Document Class In Index Step    ${each_doc_class}    ${batch_content}
    END

Configure Custom Fields Properties For Document Class In Index Step
    [Arguments]    ${each_doc_class}    ${batch_content}
    @{index}    Get Matches    ${each_doc_class}    IndexField*
    FOR    ${key}    IN    @{index}
        ${indexfield}    Set Variable    ${each_doc_class["${key}"]}
        @{splitindex}    Split String    ${indexfield}    |
        ${indexfieldslen}    Get Length    ${splitindex}
        ${description}    Set Variable    ${each_doc_class["Description"]}
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${capture_user_interface_step}    Set Variable    ${splitindex}[2]
        Set Custom Fields Properties For BCT and Document Classes in Index Step    ${description}    ${custom_field_name}    ${capture_user_interface_step}
        Run Keyword If    '${batch_content}[Disable Clipboard]'!='NA'    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    Select From List By Label    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[5]//select    ${batch_content}[Disable Clipboard]
    END

Navigate to Batch Processing Step From Capture Step
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.capture.update}    ${LONG_WAIT}
    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    SeleniumLibrary.Click Button    ${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}

Navigate to Batch Processing Step From User Interface Step
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep.ok}    ${LONG_WAIT}
    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    SeleniumLibrary.Click Button    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep.ok}

Configure Index Step Custom Fields
    [Arguments]    ${batch_content}    ${doc_class_data}
    Configure Multiple Custom Fields Properties For BCT In Index Step    ${batch_content}
    Configure Multiple Custom Fields Properties For Document Classes In Index Step    ${doc_class_data}
    Wait Until Element Is Visible    //input[@name='settingsButton']    ${SHORT_WAIT}
    Click Element    //input[@name='settingsButton']
    Handle Encapture Administration Window
    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep.ok}

Set Custom Fields Properties For BCT and Document Classes in Capture Step
    [Arguments]    ${description}    ${custom_field_name}    ${capture_step_settings}
    @{settings}    Split String    ${capture_step_settings}    :
    ${settings_count}    Get Length    ${settings}
    Run Keyword If    ${settings_count}!=3    Fail    Please configure Capture Settings properly. Settings should be seprated by colon in test data file.
    Run Keyword If    '${settings}[0]'=='Optional'    Wait Until Keyword Succeeds    ${MEDIUM_WAIT}    300ms    Unselect Checkbox    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[2]//input
    Run Keyword If    '${settings}[1]'=='Hidden'    Wait Until Keyword Succeeds    ${MEDIUM_WAIT}    300ms    Unselect Checkbox    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[3]//input
    Run Keyword If    '${settings}[2]'=='Disabled'    Wait Until Keyword Succeeds    ${MEDIUM_WAIT}    300ms    Unselect Checkbox    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[4]//input

Set Custom Fields Properties For BCT and Document Classes in Index Step
    [Arguments]    ${description}    ${custom_field_name}    ${capture_user_interface_step}
    @{settings}    Split String    ${capture_user_interface_step}    :
    ${settings_count}    Get Length    ${settings}
    Run Keyword If    ${settings_count}!=3    Fail    Please configure Document Class properly. Document Class should be seprated by colon in test data file.
    Run Keyword If    '${settings}[0]'=='Optional'    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    Select From List By Label    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[2]//select    ${settings}[0]
    Run Keyword If    '${settings}[1]'=='Hidden'    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    Select From List By Label    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[3]//select    ${settings}[1]
    Run Keyword If    '${settings}[2]'=='Disabled'    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    Select From List By Label    (//td[normalize-space(.)='${description}']//parent::tr/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[4]//select    ${settings}[2]

Configure Custom Fields Properties For Document Class In Capture Step
    [Arguments]    ${each_doc_class}    ${batch_content}
    @{index}    Get Matches    ${each_doc_class}    IndexField*
    FOR    ${key}    IN    @{index}
        ${indexfield}    Set Variable    ${each_doc_class["${key}"]}
        @{splitindex}    Split String    ${indexfield}    |
        ${indexfieldslen}    Get Length    ${splitindex}
        ${description}    Set Variable    ${each_doc_class["Description"]}
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${capture_step_settings}    Set Variable    ${splitindex}[1]
        Set Custom Fields Properties For BCT and Document Classes in Capture Step    ${description}    ${custom_field_name}    ${capture_step_settings}
        Run Keyword If    '${batch_content}[Disable Clipboard]'!='NA'    Wait Until Keyword Succeeds    ${SHORT_WAIT}    300ms    Unselect Checkbox    (//td[normalize-space(.)='${description}']/following::tr//td[normalize-space(.)='${custom_field_name}'])[1]//following-sibling::td[5]//input
    END

Delete User Interface Step
    Wait Until Element Is Visible    ${image.admin.batchcontent.batchprocessingsteps.userinterfacestep.delete}    ${LONG_WAIT}
    Click Element    ${image.admin.batchcontent.batchprocessingsteps.userinterfacestep.delete}
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.userinterfacedelete.yes}    ${LONG_WAIT}
    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.userinterfacedelete.yes}

Add Applications in Capture Step
    [Arguments]    ${capture_applications}
    @{capture_applications}    Split String    ${capture_applications}    |
    ${capture_applications_count}    Get Length    ${capture_applications}
    FOR    ${application_count_index}    IN RANGE    ${capture_applications_count}
        ${application_name}    Set variable    ${capture_applications}[${application_count_index}]
        Run Keyword If    '${application_name}'!='NA'    Configure Applications in Capture Batch Processing Step    ${application_name}
    END

Edit Conditions For Index
    Wait Until Element Is Visible    //a[contains(text(),'Edit Condition')]    ${LONG_WAIT}
    Click Element    //a[contains(text(),'Edit Condition')]
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    Rule Configuration
    FOR    ${delete_icon_count}    IN RANGE    1    8
        WhiteLibrary.Wait Until Item Exists    deleteButton    ${LONG_WAIT}
        WhiteLibrary.Click Item    deleteButton
    END
    WhiteLibrary.Wait Until Item Exists    okButton    ${LONG_WAIT}
    WhiteLibrary.Click Item    okButton

Allow Loose Pages in User Interface Step
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep}    ${LONG_WAIT}
    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.adduserinterfacestep}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.userinterfacestep}    ${MEDIUM_WAIT}    error = USER INTERFACE STEP - ADD Page is not visible after waiting for 10s

Add Content Settings
    [Arguments]    ${content_settings}
    @{content_settings}    Split String    ${content_settings}    |
    ${content_settings_count}    Get Length    ${content_settings}
    Run Keyword If    '${content_settings}[0]'!='NA'    WhiteLibrary.Click Item    allowUnclassifiedDocumentsCheckBox
    Run Keyword If    '${content_settings}[1]'=='NA'    WhiteLibrary.Click Item    AllowLoosePagesCheckBox
    Run Keyword If    '${content_settings}[2]'!='NA'    WhiteLibrary.Click Item    allowPasswordProtectedPDFsCheckBox

Configure settings for Expert Capture in Capture Step
    [Arguments]    ${batch_content}
    SeleniumLibrary.Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.capture.expertcapture}    ${LONG_WAIT}    Expert Capture link is not visible after waiting for 20 seconds
    SeleniumLibrary.Click Element    ${label.admin.batchcontent.batchprocessingsteps.capture.expertcapture}
    Comment    Get Existing Application    Encapture Orchestrator
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Run Keyword If    '${batch_content}[Enable checkboxes]'!='NONE'    Enable capture settings checkboxes    ${batch_content["Enable checkboxes"]}
    Run Keyword If    '${batch_content}[Disable checkboxes]'!='NONE'    Disable capture settings checkboxes    ${batch_content["Disable checkboxes"]}
    Run Keyword If    '${batch_content}[Timeout Batch disposition action]'!='NONE'    Select Timeout Batch disposition action    ${batch_content["Timeout Batch disposition action"]}
    WhiteLibrary.Wait Until Item Exists    ${button.window.batchprocessstep.capture.ok}    ${LONG_WAIT}
    WhiteLibrary.Click Item    ${button.window.batchprocessstep.capture.ok}

Enable capture settings checkboxes
    [Arguments]    ${enable_checkboxes}
    @{enable_capture_settings}    Split String    ${enable_checkboxes}    |
    ${enable_capture_settings_count}    Get Length    ${enable_capture_settings}
    FOR    ${check_box_name}    IN RANGE    ${enable_capture_settings_count}
        ${status}    Run Keyword And Return Status    WhiteLibrary.Verify Check Box    name:${enable_capture_settings}[${check_box_name}]    True
        Run Keyword If    ${status}==False    WhiteLibrary.Click Item    name:${enable_capture_settings}[${check_box_name}]
    END

Disable capture settings checkboxes
    [Arguments]    ${disable_checkboxes}
    @{disable_capture_settings}    Split String    ${disable_checkboxes}    |
    ${disable_capture_settings_count}    Get Length    ${disable_capture_settings}
    FOR    ${check_box_name}    IN RANGE    ${disable_capture_settings_count}
        ${status}    Run Keyword And Return Status    WhiteLibrary.Verify Check Box    name:${disable_capture_settings}[${check_box_name}]    False
        Run Keyword If    ${status}==True    WhiteLibrary.Click Item    name:${disable_capture_settings}[${check_box_name}]
    END

Add Custom Fields in User Interface Step
    [Arguments]    ${batch_content}    ${doc_class_data}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.batchprocessing}    ${LONG_WAIT}    'BATCH PROCESSING STEPS' is not visible after waiting for ${LONG_WAIT}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.index}    ${LONG_WAIT}    error = Index is not visible after waiting for ${LONG_WAIT}
    Click Element    ${label.admin.batchcontent.batchprocessingsteps.index}
    Wait Until Element Is Visible    ${label.admin.batchcontent.batchprocessingsteps.userinterfacestep.update}    ${LONG_WAIT}    error = USER INTERFACE STEP - UPDATE Page is not visible after waiting for ${LONG_WAIT}
    Configure Multiple Custom Fields Properties For BCT In Index Step    ${batch_content}
    Configure Multiple Custom Fields Properties For Document Classes In Index Step    ${doc_class_data}    ${batch_content}
    Add Application Settings in User Interface Step    ${batch_content}
    SeleniumLibrary.Wait Until Page Contains Element    ${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}    ${LONG_WAIT}    "OK" button os not visible after waiting for ${LONG_WAIT}
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}    ${LONG_WAIT}    error = USER INTERFACE STEP - UPDATE button is not visible after waiting for ${LONG_WAIT}
    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.updatecapture.ok}

Add Application Settings in User Interface Step
    [Arguments]    ${batch_content}
    Wait Until Element Is Visible    //input[@id='settingsButton']    ${MEDIUM_WAIT}
    Click Element    //input[@id='settingsButton']
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Run Keyword If    '${batch_content}[Enable checkboxes in Expert Index]'!='NONE'    Enable capture settings checkboxes    ${batch_content["Enable checkboxes in Expert Index"]}
    Run Keyword If    '${batch_content}[Disable checkboxes in Expert Index]'!='NONE'    Disable capture settings checkboxes    ${batch_content["Disable checkboxes in Expert Index"]}
    Run Keyword If    '${batch_content}[Timeout Batch disposition action]'!='NONE'    Select Timeout Batch disposition action    ${batch_content["Timeout Batch disposition action"]}
    WhiteLibrary.Wait Until Item Exists    ${button.window.batchprocessstep.capture.ok}    ${MEDIUM_WAIT}
    WhiteLibrary.Click Item    ${button.window.batchprocessstep.capture.ok}

Create Default Value Data Source
    [Arguments]    ${datasourcestring}
    Wait Until Element Is Visible    ${button.admin.add.defaultvaluedatasource}    ${LONG_WAIT}    Add Default Value Data Source is not visible after waiting ${LONG_WAIT}
    Click Element    ${button.admin.add.defaultvaluedatasource}
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Input Text To Textbox    ${textbox.admin.connections.addconnection.databasename}    ${datasourcestring}[Default Value Name]
    ${default values}    Set Variable    ${datasourcestring}[Default Values]
    @{splitvalues}    Split String    ${default values}    ;
    ${defaultvalue_count}    Get Length    ${splitvalues}
    FOR    ${values}    IN RANGE    ${defaultvalue_count}
        @{splitvalues_permittedvalues}    Split String    ${splitvalues}[${values}]    :
        Click Item    ${button.admin.datasource.adddatabasedatasource.add}
        Switch to Window    1
        Run Keyword If    '${splitvalues_permittedvalues}[0]'!='NA'    Input Text To Textbox    ${textbox.admin.datasource.defaultvaluedatadatasource.value}    ${splitvalues_permittedvalues}[1]
        Click Item    ${button.window.wizard.ok}
        sleep    1s
        Switch to Window    0
    END
    Click Item    ${button.window.wizard.ok}
    ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    //a[text()='${datasourcestring}[Default Value Name]']    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Fail    Created " Default Value Data Source name" is not visible

Create Database Data Source
    [Arguments]    ${databasedatasourcestring}
    Wait Until Element Is Visible    ${button.admin.datasource.adddatabasedatasource}    ${LONG_WAIT}    Add Database Data Source is not visible after waiting ${LONG_WAIT}
    Click Element    ${button.admin.datasource.adddatabasedatasource}
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Run Keyword If    '${databasedatasourcestring}[Data Base Name]'!='NA'    Input Text To Textbox    ${textbox.admin.datasource.createdatabasedatasource.name}    ${databasedatasourcestring}[Data Base Name]
    Run Keyword If    '${databasedatasourcestring}[Data Base Connection]'!='NA'    Select Database Combobox    databaseConnectionComboBox    ${databasedatasourcestring}[Data Base Connection]
    Run Keyword If    "${databasedatasourcestring}[SQL Query]"!="NA"    Input Text To Textbox    ${textbox.admin.datasource.createdatabasedatasource.sqlstatement}    ${databasedatasourcestring}[SQL Query]
    Add Datasource Mapping Values    ${databasedatasourcestring}[Data Source Mapping]
    Click Item    ${dropdown.admin.datasource.createdatabasedatasource.ok}
    ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    //a[text()='${databasedatasourcestring}[Data Base Name]']    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Fail    Created " Database Data Source name" is not visible

Enter Data Source Mapping Value
    [Arguments]    ${data_source_value}
    @{splitdata}    Split String    ${data_source_value}    :
    ${column}    Set Variable    ${splitdata}[0]
    ${data_field_name}    Set Variable    ${splitdata}[1]
    Wait Until Keyword Succeeds    20sec    2sec    Click Item    ${button.admin.datasource.createdatabasedatasource.adddatasourcemapping}
    Switch to Window    1
    Input Text To Textbox    ${textbox.admin.datasource.createdatabasedatasource.column}    ${column}
    Input Text To Textbox    ${textbox.admin.datasource.createdatabasedatasource.datafieldname}    ${data_field_name}
    Click Item    ${dropdown.admin.datasource.createdatabasedatasource.ok}
    Switch to Window    0

Add Datasource Mapping Values
    [Arguments]    ${datasource_mapping_values}
    @{splitvalues}    Split String    ${datasource_mapping_values}    ;
    FOR    ${value}    IN    @{splitvalues}
        Run Keyword If    '${value}'!='NA'    Enter Data Source Mapping Value    ${value}
    END

Create Data Source
    Navigate to Menu    BUSINESS DATA CONFIGURATION    DATA SOURCES
    ${datasource}    CustomLibrary.Get All Ms Excel Row Values Into Dictionary    ${DATA_CONFIGURATION_TESTDATA}    Data Source
    ${datasource_count}    Get Length    ${datasource}
    Run Keyword If    ${datasource_count}==0    Fail    In "Data Source" sheet there is no rows available
    FOR    ${key}    IN    @{datasource.keys()}
        ${data_source}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${DATA_CONFIGURATION_TESTDATA}    ${key}    Data Source
        Run Keyword If    '${datasource}[Permitted Value Name]'!='NA'    Create Permitted Value Data Source    ${data_source}
        Run Keyword If    '${datasource}[Default Value Name]'!='NA'    Create Default Value Data Source    ${data_source}
        Run Keyword If    '${datasource}[Data Base Name]'!='NA'    Create Database Data Source    ${data_source}
    END

Create Database Connections
    Navigate to Menu    BUSINESS DATA CONFIGURATION    CONNECTIONS
    ${dataconnection}    CustomLibrary.Get All Ms Excel Row Values Into Dictionary    ${DATA_CONFIGURATION_TESTDATA}    Data Connection
    ${row_count}    Get Length    ${dataconnection}
    Run Keyword If    ${row_count}==0    Fail    In "Data Connection" sheet there is no rows available
    FOR    ${key}    IN    @{dataconnection.keys()}
        ${connectiondata}    Set Variable    ${dataconnection["${key}"]}
        Create Database Connection    ${connectiondata}
        Switch to Window    2
        ${status}    Run Keyword And Return Status    Wait Until Item Exists    ${label.admin.connections.adddatabaseconnection.testconnection.testconnectionsucceed}    ${LONG_WAIT}
        Run Keyword If    '${status}'=='False'    Fail    Entered incorrect "Connection String" database details
        Click Item    ${button.window.wizard.ok}
        Switch to Window    0
        Click Item    ${button.window.wizard.ok}
        ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    //a[text()='${connectiondata}[Data Connection Name]']    ${LONG_WAIT}
        Run Keyword If    '${status}'=='False'    Fail    Created "Data Base Connection name" is not visible
    END

Create Permitted Value Data Source
    [Arguments]    ${datasource}
    Wait Until Element Is Visible    ${button.admin.add.permittedvaluedatasource}    ${LONG_WAIT}
    Click Element    ${button.admin.add.permittedvaluedatasource}
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Input Text To Textbox    ${textbox.admin.permittedvaluedatasource.name}    ${datasource}[Permitted Value Name]
    ${permitted_values}    Set Variable    ${datasource}[Permitted Values]
    @{split_permitted_values}    Split String    ${permitted_values}    ;
    ${permitted_value_len}    Get Length    ${split_permitted_values}
    FOR    ${index}    IN RANGE    ${permitted_value_len}
        @{splitvalues}    Split String    ${split_permitted_values}[${index}]    :
        WhiteLibrary.Wait Until Item Exists    ${buton.admin.permittedvaluedatasource.addpermittedvalue}    ${LONG_WAIT}
        Click Item    ${buton.admin.permittedvaluedatasource.addpermittedvalue}
        Switch to Window    1
        Input Text To Textbox    ${textbox.admin.permittedvaluedatasource.value}    ${splitvalues}[0]
        Input Text To Textbox    ${textbox.admin.permittedvaluedatasource.displayname}    ${splitvalues}[1]
        Click Item    ${button.window.wizard.ok}
        Switch to Window    0
    END
    Click Item    ${button.window.wizard.ok}
    ${status}    Run Keyword And Return Status    Wait Until Element Is Visible    //a[text()='${datasource}[Permitted Value Name]']    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Fail    Created " Permitted Data Source name" is not visible

Assign Permitted Values to Fields
    [Arguments]    ${values}
    @{splitvalues}    Split String    ${values}    :
    Wait Until Element Is Visible    ${dropdown.admin.indexing.datasources.permittedvalue.datasourceconfiguration}    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.permittedvalue.datasourceconfiguration}    ${splitvalues}[0]
    Wait Until Element Is Visible    //select[@id='cboPermittedValuesMappedValueFieldName']//option[text()='${splitvalues}[1]']    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.permittedvalue.valuedatafieldname}    ${splitvalues}[1]
    Wait Until Element Is Visible    //select[@id='cboPermittedValuesMappedDisplayFieldName']//option[text()='${splitvalues}[2]']    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.permittedvalue.displaydatafieldname}    ${splitvalues}[2]

Assign Value to Fields
    [Arguments]    ${values}
    @{splitvalues}    Split String    ${values}    :
    Wait Until Element Is Visible    ${dropdown.admin.indexing.datasources.value.datasourceconfiguration}    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.value.datasourceconfiguration}    ${splitvalues}[0]
    Wait Until Element Is Visible    //select[@id='cboValueMappedValueFieldName']//option[text()='${splitvalues}[1]']    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.value.valuedatafieldname}    ${splitvalues}[1]

Assign Validation to Fields
    [Arguments]    ${values}
    @{splitvalues}    Split String    ${values}    :
    Wait Until Element Is Visible    ${dropdown.admin.indexing.datasources.validation.datasourceconfiguration}    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.validation.datasourceconfiguration}    ${splitvalues}[0]
    Wait Until Element Is Visible    //select[@id='cboValidationMappedValueFieldName']//option[text()='${splitvalues}[1]']    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.validation.datafieldname}    ${splitvalues}[1]
    Wait Until Element Is Visible    //select[@id='cboValidationEvaluationType']//option[text()='${splitvalues}[2]']    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.validation.validationrule}    ${splitvalues}[2]
    SeleniumLibrary.Select From List By Label    ${dropdown.admin.indexing.datasources.validation.validationcondition}    ${splitvalues}[3]
    Run Keyword If    '${splitvalues}[4]'!='NA'    SeleniumLibrary.Input Text    ${dropdown.admin.indexing.datasources.validation.validationvalue}    ${splitvalues}[4]

Enable Data Sources to Fields
    [Arguments]    ${datasource_field_data}    @{datasource}
    FOR    ${key}    IN    @{datasource}
        ${datasourcefield}    Set Variable    ${datasource_field_data["${key}"]}
        @{splitindex}    Split String    ${datasourcefield}    |
        ${datasourcefieldslen}    Get Length    ${splitindex}
        Run Keyword If    '${datasourcefieldslen}'!='4'    Fail    Please set Permitted Value, Value and Validation Settings in the test data file.
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${permitted_values}    Set Variable    ${splitindex}[1]
        ${values}    Set Variable    ${splitindex}[2]
        ${validation_values}    Set Variable    ${splitindex}[3]
        Wait Until Page Contains Element    //td[normalize-space()='${custom_field_name}']/following-sibling::td/a[contains(@onclick,'setDataSources')]    ${LONG_WAIT}    "${custom_field_name}" data source is not visible after waiting for ${LONG_WAIT}
        Click Element    //td[normalize-space()='${custom_field_name}']/following-sibling::td/a[contains(@onclick,'setDataSources')]
        Run Keyword If    '${permitted_values}'!='NA'    Assign Permitted Values to Fields    ${permitted_values}
        Run Keyword If    '${values}'!='NA'    Assign Value to Fields    ${values}
        Run Keyword If    '${validation_values}'!='NA'    Assign Validation to Fields    ${validation_values}
        Wait Until Element Is Visible    ${dropdown.admin.indexing.datasources.ok}    ${LONG_WAIT}
        Click Element    ${dropdown.admin.indexing.datasources.ok}
    END

Enable Dependent Fields to Fields
    [Arguments]    ${dependent_field_data}    @{dependent}
    FOR    ${key}    IN    @{dependent}
        ${dependentfield}    Set Variable    ${dependent_field_data["${key}"]}
        @{splitindex}    Split String    ${dependentfield}    |
        ${dependentfieldslen}    Get Length    ${splitindex}
        Run Keyword If    '${dependentfieldslen}'!='4'    Fail    Please set Dependent Field, Permitted Value and Value Settings in the test data file.
        ${custom_field_name}    Set Variable    ${splitindex}[0]
        ${dependentfield_value}    Set Variable    ${splitindex}[1]
        ${dependent_permitted_values}    Set Variable    ${splitindex}[2]
        ${dependent_value}    Set Variable    ${splitindex}[3]
        Run Keyword If    '${dependentfield_value}'!='NA'    Assign Dependent Fields    ${dependentfield_value}    ${dependent_permitted_values}    ${dependent_value}    ${custom_field_name}
    END

Validate Database Connection with Valid Data
    [Arguments]    ${connectiondata}
    Switch to Window    2
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    ${label.admin.connections.adddatabaseconnection.testconnection.testconnectionsucceed}    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Fail    Entered incorrect "Connection String" database details
    Click Item    ${button.window.wizard.ok}
    Switch to Window    0
    Click Item    ${button.window.wizard.ok}
    SeleniumLibrary.Wait Until Element Is Visible    //a[text()='${connectiondata}[Data Connection Name]']    ${LONG_WAIT}    Created database connection is not visible after waiting ${LONG_WAIT}

Validate Database Connection with Invalid Data
    [Arguments]    ${connectiondata}
    Switch to Window    2
    ${status}    Run Keyword And Return Status    Wait Until Item Exists    ${button.admin.dataconnections.showdetails}    ${LONG_WAIT}
    Run Keyword If    '${status}'=='False'    Fail    Database connection created with given data
    Click Item    ${button.window.wizard.ok}
    Switch to Window    0
    Click Item    ${button.window.wizard.ok}
    SeleniumLibrary.Wait Until Element Is Visible    //a[text()='${connectiondata}[Data Connection Name]']    ${LONG_WAIT}    Created database connection is not visible after waiting ${LONG_WAIT}

Create Database Connection
    [Arguments]    ${connectiondata}
    Wait Until Element Is Visible    ${button.admin.connections.adddatabaseconnection}    ${LONG_WAIT}
    Click Element    ${button.admin.connections.adddatabaseconnection}
    Wait Until Keyword Succeeds    ${LONG_WAIT}    ${MEDIUM_WAIT}    WhiteLibrary.Attach Application By Name    EncaptureWindowsClient
    Attach Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Run Keyword If    '${connectiondata}[Data Connection Name]'!='NA'    Input Text To Textbox    ${textbox.admin.connections.addconnection.databasename}    ${connectiondata}[Data Connection Name]
    Run Keyword If    '${connectiondata}[Database]'!='NA'    Select Database Combobox    ${dropdown.admin.connections.addconnection.database}    ${connectiondata}[Database]
    Run Keyword If    '${connectiondata}[Connection String]'!='NA'    Input Text To Textbox    ${textbox.admin.connections.addconnection.databaseconnectionstring}    ${connectiondata}[Connection String]
    Wait Until Item Exists    ${checkbox.admin.connections.adddatabaseconnections.databaseerrormsginfo}    ${LONG_WAIT}
    Click Item    ${button.admin.connections.adddatabaseconnections.testconnection}

Set Time out In Session Management
    [Arguments]    ${time_out}
    Select the Client Application    ${ENCAPTURE_ADMIN}
    Select Window    ${APPLICATION_ENCAPTURE_ORCHESTRATE}
    Wait Until Element Is Visible    ${label.wizard.orchestrator.orchestratortext}    ${LONG_WAIT}
    Navigate to Menu    SYSTEM MANAGEMENT    SESSION MANAGEMENT
    Wait Until Element Is Visible    ${button.admin.sessionmanagement.sessiontimeoutsettings}    ${LONG_WAIT}
    SeleniumLibrary.Click Element    ${button.admin.sessionmanagement.sessiontimeoutsettings}
    Wait Until Element Is Visible    ${button.admin.sessionmanagement.sessiontimeoutsettings.applicationsessiontimeoutminutes}    ${LONG_WAIT}
    SeleniumLibrary.Input Text    ${button.admin.sessionmanagement.sessiontimeoutsettings.applicationsessiontimeoutminutes}    ${time_out}
    Wait Until Element Is Visible    ${button.admin.lineofbusiness.addfunctional.ok}    ${LONG_WAIT}
    SeleniumLibrary.Click Element    ${button.admin.lineofbusiness.addfunctional.ok}
    SeleniumLibrary.Close Window
    Select Window    Encapture

Select Timeout Batch disposition action
    [Arguments]    ${timeout_batch_value}
    CustomLibrary.Get Admin Orchistrate Application    ${ORCHESTRATOR_TIME_OUT_WINDOW_CLASS_NAME}
    CustomLibrary.Select Batch Disposition Type After Timeout    ${timeout_batch_value}

Close Orchestrator Application Window
    SeleniumLibrary.Close Window
    Switch Window    Encapture

Assign Dependent Fields
    [Arguments]    ${dependentfield_value}    ${dependent_permitted_values}    ${dependent_value}    ${custom_field_name}
    Wait Until Page Contains Element    //td[normalize-space()='${custom_field_name}']/following-sibling::td/a[contains(@onclick,'setDependentFields')]    ${LONG_WAIT}    "${custom_field_name}" dependent field is not visible after waiting for ${LONG_WAIT}
    Click Element    //td[normalize-space()='${custom_field_name}']/following-sibling::td/a[contains(@onclick,'setDependentFields')]
    Wait Until Element Is Visible    ${label.admin.indexing.dependentfields.dependentfieldslist}    ${LONG_WAIT}
    SeleniumLibrary.Click Button    ${button.admin.dependentfields.addfields}
    Wait Until Element Is Visible    ${button.admin.add.defaultvaluedatasource.addfields.field}    ${LONG_WAIT}
    SeleniumLibrary.Select From List By Label    ${button.admin.add.defaultvaluedatasource.addfields.field}    ${dependentfield_value}
    Run Keyword If    '${dependent_permitted_values}'!='NA'    Assign Permitted Values to Fields    ${dependent_permitted_values}
    Run Keyword If    '${dependent_value}'!='NA'    Assign Value to Fields    ${dependent_value}
    Wait Until Element Is Visible    ${button.admin.add.defaultvaluedatasource.addfields.ok}
    Click Element    ${button.admin.add.defaultvaluedatasource.addfields.ok}
    Wait Until Element Is Visible    ${button.admin.batchcontenttype.bacthprocessingsteps.back}
    Click Element    ${button.admin.batchcontenttype.bacthprocessingsteps.back}

Enable Data Sources and Dependent Fields to Fields
    [Arguments]    ${custom_fields_data}
    @{datasource}    Get Matches    ${custom_fields_data}    DataSourceField*
    Enable Data Sources to Fields    ${custom_fields_data}    @{datasource}
    @{dependent}    Get Matches    ${custom_fields_data}    DependentField*
    Enable Dependent Fields to Fields    ${custom_fields_data}    @{dependent}

Configure Applications in Capture Batch Processing Step
    [Arguments]    ${application_name}
    Run Keyword If    '${application_name}'=='Collect'    Configure Collect Application
    Run Keyword If    '${application_name}'=='Collect'    Return From Keyword
    ${application_locator}    Set Variable If    '${application_name}'!='NA'    //a[text()='${application_name}']//preceding-sibling::input[1]
    Wait Until Page Contains Element    ${application_locator}    ${LONG_WAIT}
    Select Checkbox    ${application_locator}
    Handle Encapture Administration Window

Configure Collect Application
    Wait Until Page Contains Element    ${checkbox.admin.batchcontent.batchprocessingsteps.collect}    ${LONG_WAIT}
    Select Checkbox    ${checkbox.admin.batchcontent.batchprocessingsteps.collect}
