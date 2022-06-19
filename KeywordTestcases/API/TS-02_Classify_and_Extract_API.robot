*** Settings ***
Suite Setup       Work Bench Test Prerequisite
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-41 Create New Classification Model
    Comment    Create New Classification Model
    ${response}    Create Classification Model    Model_01
    comment    Validate Create Classification API Request Status
    Validate Response Status Code    ${response}    200

TC-42 Validate Duplicate Classification Model
    Comment    Validate Duplicate Classification Model
    ${response}    Create Classification Model    Model_01
    comment    Validate Duplicate Classification API Request Status
    Validate Response Status Code    ${response}    500

TC-43 Rename Classification Model Name
    [Setup]    Get Classification Model Id and Check Out Time
    Comment    Rename the Classification Model
    ${response}    Administration.Rename Classification Model    Model_Rename_01
    comment    Validate Rename Classification Model API Request Status
    Validate Response Status Code    ${response}    200

TC-44 Checkin Classification Model
    [Setup]    Get Classification Model Id and Check Out Time
    Comment    Checkin the Classification Model
    ${response}    Administration.Checkin Classification Model
    comment    Validate Checkin Classification Model API Request Status
    Validate Response Status Code    ${response}    200

TC-45 Checkout Classification Model
    Comment    Checkout the Classification Model
    ${response}    Administration.Checkout Classification Model
    comment    Validate Checkout Classification Model API Request Status
    Validate Response Status Code    ${response}    200

TC-46 Delete Classification Model
    Comment    Delete the Classification Model
    ${response}    Administration.Delete Classification Model
    comment    Validate Delete Classification Model API Request Status
    Validate Response Status Code    ${response}    200

TC-47 Create Zone Template
    comment    Create Zone Template
    ${response}    Create Zone Template    Zone_Template_01
    comment    Validate Create ZoneTemplate API Request Status
    Validate Response Status Code    ${response}    200

TC-48 Validate Duplicate Zone Template
    Comment    Validate Duplicate Classification Model
    ${response}    Create Zone Template    Zone_Template_01
    comment    Validate Duplicate Classification API Request Status
    Validate Response Status Code    ${response}    500

TC-49 Rename Zone Template
    [Setup]    Get Zone Template Id
    Comment    Rename the Classification Model
    ${response}    Administration.Rename Zone Template    Zone_Rename_01
    comment    Validate Rename Classification Model API Request Status
    Validate Response Status Code    ${response}    200

TC-50 Delete Zone Template
    Comment    Delete the Classification Model
    ${response}    Administration.Delete Zone Template
    comment    Validate Delete Classification Model API Request Status
    Validate Response Status Code    ${response}    200
