*** Settings ***
Resource          ../../Global/super.robot

*** Test Cases ***
New
    Login to Application    ${username}    ${password}
