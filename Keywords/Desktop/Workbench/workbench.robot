*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Select Workbench Operation Type From Tool Bar
    [Arguments]    ${tool_bar_menu_option}
    ${status}    Run Keyword And Return Status    Dictionary Should Contain Key    ${WORKBENCH_TOOL_BAR_MENU}    ${tool_bar_menu_option}
    Run Keyword If    ${status} != True    Fail    Workbench Option ${tool_bar_menu_option} not found in the options list ${WORKBENCH_TOOL_BAR_MENU.keys()}
    ${menu_index}    Set Variable    ${WORKBENCH_TOOL_BAR_MENU}[${tool_bar_menu_option}]
    WhiteLibrary.Click Toolstrip Button By Index    toolStrip    ${menu_index}

Create New Classification Model
    [Arguments]    ${new_model_name}
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    ${textbox.window.workbench.classification.add.modelname }    ${SHORT_WAIT}
    Input Text To Textbox    ${textbox.window.workbench.classification.add.modelname }    ${new_model_name}
    WhiteLibrary.Click Item    ${button.window.workbench.add.ok}
    Save Classification Model
    WhiteLibrary.Close Window
    Switch to Window    0

Create New Zone Templates
    [Arguments]    ${new_zone_name}    ${file_name}
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    ${textbox.window.workbench.zonetemplate.add.templatename}    ${LONG_WAIT}
    WhiteLibrary.Click Item    ${textbox.window.workbench.zonetemplate.add.templatename}
    Input Text To Textbox    ${textbox.window.workbench.zonetemplate.add.templatename}    ${new_zone_name}
    WhiteLibrary.Click Item    ${button.window.workbench.add.ok}
    Upload Template Image File    ${file_name}
    WhiteLibrary.Attach Window    Select Page Text Engine Defaults
    WhiteLibrary.Wait Until Item Exists    name:OK    ${LONG_WAIT}
    WhiteLibrary.Click Item    name:OK
    WhiteLibrary.Attach Window    Encapture Classify & Extract
    Save Zone Template Configuration
    WhiteLibrary.Close Window
    Switch to Window    0

Upload Template Image File
    [Arguments]    ${file_name}
    Switch to Window    1
    File Should Exist    ${TESTDATA_FOLDER}\\${file_name}    ${file_name} File not found in TestData folder.
    WhiteLibrary.Wait Until Item Exists    ${textbox.window.import.filename}    ${LONG_WAIT}
    WhiteLibrary.Input Text To Textbox    ${textbox.window.import.filename}    ${TESTDATA_FOLDER}\\${file_name}
    WhiteLibrary.Click Button    ${button.window.import.fileopen}

Save Zone Template Configuration
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    ${label.window.workbench.configuration.file.save}    ${SHORT_WAIT}
    sleep    3s
    Click Item    ${label.window.workbench.configuration.file.save}

Save Classification Model
    Switch to Window    1
    sleep    2s
    Hold Special Key    ALT
    WhiteLibrary.Press Keys    S
    Leave Special Key    ALT
    sleep    2s

Select Classification Model
    [Arguments]    ${classification_model_name}
    Sleep    2s
    SikuliLibrary.Click    ${classification_model_name}.PNG

Select Zone Templates
    [Arguments]    ${zone_template_name}
    SikuliLibrary.Wait Until Screen Contain    ${zone_template_name}.PNG    ${SIKULI_SHORT_WAIT}
    sleep    1s
    SikuliLibrary.Click    ${zone_template_name}.PNG

Validate Classification Model or Zone Template is displayed
    [Arguments]    ${model_or_zone_name}
    Run Keyword And Ignore Error    SikuliLibrary.Click    ZoneTemplates.PNG
    ${status}    Run Keyword And Return Status    Exists    ${model_or_zone_name}    ${SIKULI_SHORT_WAIT}
    Run Keyword If    ${status}==False    Fail    ${model_or_zone_name} is not dispalyed

Expand Classification Models
    Run Keyword If    ${workbench_classification_model_expand}==True    Return From Keyword
    sleep    1s
    Wait Until Screen Contain    Expand    ${SIKULI_SHORT_WAIT}
    SikuliLibrary.Click    Expand
    Set Global Variable    ${workbench_classification_model_expand}    True

Rename Classification Model
    [Arguments]    ${rename_model_name}
    Select Workbench Operation Type From Tool Bar    RENAME
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    ${textbox.window.workbench.classification.add.modelname }    ${SHORT_WAIT}
    ${unique_value}    FakerLibrary.Random Int    0    9999    2
    Input Text To Textbox    ${textbox.window.workbench.classification.add.modelname }    ${rename_model_name} ${unique_value}
    WhiteLibrary.Click Item    ${button.window.workbench.add.ok}
    Switch to Window    0

Rename Zone Template
    [Arguments]    ${rename_zone_name}
    Select Workbench Operation Type From Tool Bar    RENAME
    Switch to Window    1
    WhiteLibrary.Wait Until Item Exists    ${textbox.window.workbench.zonetemplate.add.templatename}    ${SHORT_WAIT}
    Input Text To Textbox    ${textbox.window.workbench.zonetemplate.add.templatename}    ${rename_zone_name}
    WhiteLibrary.Click Item    ${button.window.workbench.add.ok}
    Switch to Window    0

Validate Classification Model Checkin Status
    Wait Until Keyword Succeeds    ${LONG_WAIT}    1s    WhiteLibrary.Item Should Be Enabled    name:Checkout
    Wait Until Keyword Succeeds    ${LONG_WAIT}    1s    WhiteLibrary.Item Should Be Disabled    name:Checkin
    Wait Until Keyword Succeeds    ${LONG_WAIT}    1s    WhiteLibrary.Item Should Be Disabled    name:Undo Checkout

Validate Classification Model Checkout Status
    Wait Until Keyword Succeeds    ${SHORT_WAIT}    1s    WhiteLibrary.Item Should Be Disabled    name:Checkout
    Wait Until Keyword Succeeds    ${SHORT_WAIT}    1s    WhiteLibrary.Item Should Be Enabled    name:Checkin
    Wait Until Keyword Succeeds    ${SHORT_WAIT}    1s    WhiteLibrary.Item Should Be Enabled    name:Undo Checkout

Run Workbench Prerequisite
    SikuliLibrary.Add Image Path    ${EXECDIR}\\SikuliImages\\Workbench
    DatabaseOperations.Clear Workbench Testdata From Db

Checkin Classification Model
    [Arguments]    ${classification_model_name}
    Select Classification Model    ${classification_model_name}
    Select Workbench Operation Type From Tool Bar    CHECK_IN

Checkout Classification Model
    [Arguments]    ${classification_model_name}
    Select Classification Model    ${classification_model_name}
    Select Workbench Operation Type From Tool Bar    CHECK_OUT

Expand Zone Templates
    Run Keyword If    ${workbench_zone_template_expand}==True    Return From Keyword
    sleep    1s
    Wait Until Screen Contain    Expand    ${SIKULI_SHORT_WAIT}
    SikuliLibrary.Click    Expand
    Set Global Variable    ${workbench_zone_template_expand}    True

Delete Classification Model or Zone Template
    [Arguments]    ${model_name_or_template_name}
    Select Classification Model    ${model_name_or_template_name}
    Select Workbench Operation Type From Tool Bar    DELETE_CLASSIFICATION_MODEL
    WhiteLibrary.Wait Until Item Exists    name:Yes    ${SHORT_WAIT}
    Click Item    name:Yes
    sleep    1s

Validate Classification Model or Zone Template should not displayed
    [Arguments]    ${model_or_zone_name}
    ${status}    Run Keyword And Return Status    SikuliLibrary.Wait Until Screen Not Contain    ${model_or_zone_name}    ${SIKULI_SHORT_WAIT}
    Run Keyword If    ${status}==False    Fail    ${model_or_zone_name} is not deleted

Validate Zone Template Undo-Checkout, Checkin and Checkout Status
    WhiteLibrary.Item Should Be Disabled    name:Checkin
    WhiteLibrary.Item Should Be Disabled    name:Undo Checkout
    WhiteLibrary.Item Should Be Disabled    name:Checkout
