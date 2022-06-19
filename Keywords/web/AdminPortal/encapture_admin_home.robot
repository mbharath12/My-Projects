*** Settings ***
Resource          ../../Global/super.robot

*** Keywords ***
Logout from Encapture Admin
    Wait Until Element Is Visible    ${label.adminhomepage.username}    ${LONG_WAIT}    Encapture Admin User Name is not visible after waiting for 20s.
    Click Element    ${label.adminhomepage.username}
    Wait Until Element Is Visible    ${label.adminhomepage.logout}    ${SHORT_WAIT}    Logout button is not visible after waiting for 5s.
    Click Element    ${label.adminhomepage.logout}
    Wait Until Element Is Visible    ${button.adminlogin.continue}    ${SHORT_WAIT}    Admin application failed to Logout

Navigate to Menu
    [Arguments]    ${menu}    ${sub_menu}
    Run Keyword And Ignore Error    Unselect Frame
    Wait Until Element Is Visible    ${frame.admin.homepage}    ${LONG_WAIT}    Admin home page is not visible after waiting for ${LONG_WAIT}.
    Select Frame    ${frame.admin.homepage}
    Select Frame    ${frame.admin.homepage.menuselection}
    Wait Until Element Is Visible    //table[@id='tblAdminNav']//a[text()='${menu}']    ${LONG_WAIT}    ${menu} is not visible waiting for ${LONG_WAIT}.
    ${attribute}    Get Element Attribute    //table[@id='tblAdminNav']//a[text()='${menu}']/..    class
    Run Keyword If    '${attribute}'!='section-open'    Click Element    //table[@id='tblAdminNav']//a[text()='${menu}']
    Wait Until Element Is Visible    //table[@id='tblAdminNav']//a[text()='${menu}']/..//a[text()='${sub_menu}']    ${LONG_WAIT}    ${sub_menu} is not visble after waiting for ${LONG_WAIT}.
    Click Element    //table[@id='tblAdminNav']//a[text()='${menu}']/..//a[text()='${sub_menu}']
    Unselect Frame
    Select Main Content
