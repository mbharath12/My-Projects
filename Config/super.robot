*** Settings ***
Library           SeleniumLibrary    run_on_failure=SeleniumLibrary.CapturePageScreenshot
Library           FakerLibrary
Library           String
Library           Collections
Library           Screenshot
Library           DateTime
Library           ../Library/CustomLibrary.py
Library           SSHLibrary
Library           OperatingSystem
Resource          common_variables.robot
Resource          db_variables.robot
Resource          linux_variables.robot
Resource          ../Keywords/Linux/common.robot
Resource          ../Keywords/Linux/gateway_user.robot
Resource          ../Keywords/Linux/VT_Device.robot
Resource          ../Keywords/Linux/A1_Client.robot
