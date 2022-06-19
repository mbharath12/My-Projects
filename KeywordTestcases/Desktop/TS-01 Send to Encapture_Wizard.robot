*** Settings ***
Test Teardown     Run Keywords    Close All Application Windows
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-04 Send to Encapture a PDF file and create a Batch when few custom fields required and few are Optional
    [Setup]    Read Created Test Data    TC_04
    Comment    Select a file and Send to Encapture from context menu
    Select File And Send To Encapture    ${capture_wizard_content_info}[FileName]
    Comment    Select the created BCT
    Select Content Type    ${batchcontent}[Description]
    Comment    Enter the common Index Data fields of content
    Fill the Index Data    ${capture_wizard_content_info}
    Comment    Classifying the mulipage document based on Document Classes
    Classify the Captured Multipage Document    ${capture_wizard_document_class_info}
    Comment    Proceeding for submission without adding another document
    Proceed for Submission
    Comment    Validate the content is submitted
    Validate Captured Content is Submitted

TC-05 Send to Encapture a Text file and Create a Batch when Custom Fields are Required
    [Setup]    Read Created Test Data    TC_05
    Comment    Select a file and Send to Encapture from context menu
    Select File And Send To Encapture    ${capture_wizard_content_info}[FileName]
    Comment    Select the created BCT
    Select Content Type    ${batchcontent}[Description]
    Comment    Enter the common Index Data fields of content
    Fill the Index Data    ${capture_wizard_content_info}
    Comment    Classifying the mulipage document based on Document Classes
    Fill Common Index Data of Document Class    ${capture_wizard_document_class_info}[1]
    Comment    Proceeding for submission without adding another document
    Proceed for Submission
    Comment    Validate the content is submitted
    Validate Captured Content is Submitted

TC-06 Send to Encapture a PDF and Batch should not be created for BCT Accepting only Text files
    [Setup]    Read Created Test Data    TC_05
    Comment    Select a file and Send to Encapture from context menu
    Select File And Send To Encapture    TestDocToUpload.pdf
    Comment    Select the created BCT
    Select Content Type    ${batchcontent}[Description]
    Comment    Upload error message should be displayed
    Verify File Upload Error Message

Sample
    Read Created Test Data    TC_04
    log    ${batchcontent}[Description]
