*** Settings ***
Test Setup        Take Screenshots On Failure    False
Test Teardown     Run Keywords    Quit and Restart Capture Applications
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-01 Import an Electronic Document then Create Batch with Batch Index and Document Class Index Fields
    [Documentation]    Import an Electronic document and fill Batch index values and Document index values and Complete the batch.
    [Setup]    Read Created Test Data    Data_01
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-02 Import an Electronic Document and Populate Batch Index and Document Class Index Fields then Suspend the Batch
    [Documentation]    Import an Electronic document and fill all Batch index values and fill all Document index values and Suspend the batch.
    [Setup]    Read Created Test Data    Data_02
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-03 Import an Electronic Document and Populate Batch Index and Document Class Index Fields then Delete the Batch
    [Documentation]    Import an Electronic document and fill all Batch index values and fill all Document index values and Delete the batch.
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-04 Open an existing Suspended Batch and validate the existing Batch Index and Document Class Index details then Complete Batch with Batch Index and Document Class Index Fields
    [Documentation]    Import an Electronic document and fill all Batch index values and fill all Document index values and Suspend the batch, Than open the suspended batch and Complete the batch.
    [Setup]    Read Created Test Data    Data_04
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended
    Comment    In Expert Capture, Open an Existing Batch
    Open an Existing Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Suspended Batch Common Index Values
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Verify Completed Batch is not available in Load Window
    Validate Deleted or Completed Batch should not be displayed in Existing Batch Window    ${batchcontent}[Description]    ${APPLICATION_EXPERT_CAPTURE}

TC-05 Open an existing Suspended Batch then Delete the Batch
    [Documentation]    Import an Electronic document and fill all Batch index values and fill all Document index values and Suspend the batch, Than open the suspended batch and Delete the batch.
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended
    Comment    In Expert Capture, Open an Existing Batch
    Open an Existing Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validate Deleted Batch is not available in Load Window
    Validate Deleted or Completed Batch should not be displayed in Existing Batch Window    ${batchcontent}[Description]    ${APPLICATION_EXPERT_CAPTURE}

TC-06 Create an Empty Document and add Scanned Image then create Batch with Batch Index and Document Class Index fields
    [Documentation]    Create an Empty Document and upload an image into that created empty document and fill all the batch index values and document index values and Complete the batch.
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Empty Documnet button to Create Empty Document in Expert Capture
    Create an Empty Document    ${APPLICATION_EXPERT_CAPTURE}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Upload ScanImage and Assign Document Index values for Uploaded Images
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-07 Validate new Batch should be created after submitting existing Batch when Automatically create a new Batch after finishing work on the current Batch option is enabled
    [Documentation]    Import Electronic document and fill all batch index values and document index values then Complete the current batch content type, then the Batch should automatically create a new batch, When we Enable "New Batch should be created after submitting existing Batch when Automatically create a new Batch after finishing work on the current Batch" option.
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Select Automatically create a new batch after finishing work on the current batch
    Select Batch Operation Type From Tool Bar    Automatic_New_Batch_Creation
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate Automatically create a new batch after finishing work on the current batch
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Un Select Automatically create a new batch button
    Select Batch Operation Type From Tool Bar    Automatic_New_Batch_Creation
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process

TC-08 Validate previous document fields should be copied to the new imported document when "Copy custom fields from the Previous Document" is selected
    [Documentation]    Import two Electronic documents and the first electronic document is having Document index values and the second electronic document is going to copy the Document index values from first electronic document by doing "Copy custom fields from the Previous Document" is selected and Complete the batch.
    [Setup]    Read Created Test Data    Data_02
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Import Electronic -documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Import Electronic -document
    Import Electronic File in Expert Capture    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Copy custom fields from previous document
    Select Batch Operation Type From Tool Bar    Copy_Custom_Fields_From_Prev_Doc
    Comment    Validate Custom Index Values with the previous Document Custom Index Values
    Validate Custom Index Values with the previous Document Custom Index Values    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-09 Import two Electronic documents then Merge the documents into single document of Document Class
    [Documentation]    Import two Electronic documents and merge those uploaded two electronic documents into Single document and fill the document index values and Complete the batch.
    [Setup]    Read Created Test Data    Data_12
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Import Electronic Documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Merge the documents into single document of Document Class
    Merge Document with Previous Document
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-10 Import a document then Split the document into multiple documents of different Document Classes
    [Documentation]    Import multipage Electronic document and Split the uploaded document into two documents and fill the document index values for two electronic documents and Complete the batch.
    [Setup]    Read Created Test Data    Data_07
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Import Electronic document in Expert Capture
    Import Electronic File in Expert Capture    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Assign Document Index values for Uploaded Documents
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost
    Comment    Split the document into multiple documents of Different Document Classes
    Split the document into multiple documents
    Comment    Assign Document Index values for Split Document
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['2']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-11 Validate - Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch
    [Documentation]    The selected batch content type should Complete the batch process with loose pages.
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-12 Validate - Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Suspend the batch
    [Documentation]    The selected batch content type should Suspend the batch process with loose pages.
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-13 Validate - Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Delete the batch
    [Documentation]    The selected batch content type should Delete the batch process with loose pages.
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Deleted

TC-14 Validate - Disable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch
    [Documentation]    The selected batch content type should not Complete the batch process with loose pages, and it should display error message.
    [Setup]    Read Created Test Data    Data_06
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate Batch Should Not Complete With Allow Loose Pages
    Validate Batch Should Not Complete With Allow Loose Pages
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-15 Validate - Disable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Suspend the batch
    [Documentation]    The selected batch content type should not Suspend the batch process with loose pages, and it should display error message.
    [Setup]    Read Created Test Data    Data_06
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-16 Validate - Disable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Delete the batch
    [Documentation]    The selected batch content type should not Delete the batch process with loose pages, and it should display error message.
    [Setup]    Read Created Test Data    Data_06
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-17 Validate - Disable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Complete the batch
    [Documentation]    Import Password Protected document and Enter the password then fill all document index values and Complete the batch when "Allow batches to be completed with Password Protected PDF documents" checkbox in Disable.
    [Setup]    Read Created Test Data    Data_09
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    pasword_protect_doc=Yes    doc_password=EncaptureQA
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-18 Validate - Disable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Suspend the batch
    [Documentation]    Import Password Protected document and Enter the password then fill all document index values and Suspend the batch when "Allow batches to be completed with Password Protected PDF documents" checkbox in Disable.
    [Setup]    Read Created Test Data    Data_09
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    pasword_protect_doc=Yes    doc_password=EncaptureQA
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-19 Validate - Disable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Delete the batch
    [Documentation]    Import Password Protected document and Enter the password then fill all document index values and Delete the batch when "Allow batches to be completed with Password Protected PDF documents" checkbox in Disable.
    [Setup]    Read Created Test Data    Data_09
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    pasword_protect_doc=Yes    doc_password=EncaptureQA
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Deleted

TC-20 Validate - Enable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Complete the batch
    [Documentation]    Import Password Protected document and Enter the password then fill all document index values and Complete the batch when "Allow batches to be completed with Password Protected PDF documents" checkbox in Enabled.
    [Setup]    Read Created Test Data    Data_10
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    pasword_protect_doc=Yes
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-21 Validate - Enable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Suspend the batch
    [Documentation]    Import Password Protected document and Enter the password then fill all document index values and Suspend the batch when "Allow batches to be completed with Password Protected PDF documents" checkbox in Enabled.
    [Setup]    Read Created Test Data    Data_10
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    pasword_protect_doc=Yes
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-22 Validate - Enable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Delete the batch
    [Documentation]    Import Password Protected document and Enter the password then fill all document index values and Delete the batch when "Allow batches to be completed with Password Protected PDF documents" checkbox in Enabled.
    [Setup]    Read Created Test Data    Data_10
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    pasword_protect_doc=Yes
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Deleted

TC-23 Validate Persist batch content type functionality in Expert Capture when "Persist batch content type between batches" checkbox in "Module Control Settings" is Enabled
    [Documentation]    Validate Persist batch content type functionality in Expert Capture when "Persist batch content type between batches" checkbox in "Module Control Settings" is Enabled.
    [Setup]    Read Created Test Data    Data_08
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Validate batch description
    Validate Persist batch in Expert Capture    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-24 Validate Persist batch content type functionality in Expert Capture when "Persist batch content type between batches" checkbox in "Module Control Settings" is Disabled
    [Documentation]    Validate Persist batch content type functionality in Expert Capture when "Persist batch content type between batches" checkbox in "Module Control Settings" is Disable.
    [Setup]    Read Created Test Data    Data_11
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Validate batch description
    Validate batch content type is not Persist in Expert Capture    ${batchcontent}[Description]

TC-25 Validate Show complete batch confirmation dialog in Expert Capture when "Show complete batch confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_15
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process and Validate Show Complete batch confirmation window
    Validate Complete batch confirmation dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    True

TC-26 Validate Show complete batch confirmation dialog in Expert Capture when "Show complete batch confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_16
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process and Validate Show Complete batch confirmation window
    Validate Complete batch confirmation dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    False

TC-27 Validate Show delete batch confirmation dialog in Expert Capture when "Show delete batch confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_15
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show delete confirmation dialog
    Validate Delete batch confirmation dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    True

TC-28 Validate Show delete batch confirmation dialog in Expert Capture when "Show delete batch confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_16
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show delete confirmation dialog
    Validate Delete batch confirmation dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    False

TC-29 Validate Show batch Deleted successfully dialog in Expert Capture when "Show batch Deleted successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_15
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch deleted successfully dialog
    Validate Batch Deleted Successful dialog is visible    False

TC-30 Validate Show batch Deleted successfully dialog in Expert Capture when "Show batch Deleted successfully dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_17
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch deleted successfully dialog
    Validate Batch Deleted Successful dialog is visible    True

TC-31 Validate cutting and pasting of batch item in Expert Capture when "Enable cutting and pasting of batch items" checkbox in "Module Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_18
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Cut and Paste operation on batch items
    Validate Cut and Paste operation on batch items    ${APPLICATION_EXPERT_CAPTURE}    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-32 Validate cutting and pasting of batch item in Expert Capture when "Enable cutting and pasting of batch items" checkbox in "Module Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_29
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Cut and Paste operation on batch items
    Validate Cut and Paste operation on batch items    ${APPLICATION_EXPERT_CAPTURE}    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process    True
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-33 Validate Copying and Pasting of Batch Items in Expert Capture When "Enable Copying and Pasting of Batch Items " checkbox in "Module Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Copy and Paste Actions on Batch Items
    Validate Copy and Paste Actions on Batch Items    ${APPLICATION_EXPERT_CAPTURE}    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-34 Validate Copying and Pasting of Batch Items in Expert Capture When "Enable Copying and Pasting of Batch Items " checkbox in "Module Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_14
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Copy and Paste Actions on Batch Items
    Validate Copy and Paste Actions on Batch Items    ${APPLICATION_EXPERT_CAPTURE}    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process    True
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-35 Validate Show batch suspended successfully dialog in Expert Capture when "Show batch suspended successfully dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_13
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Suspend Batch button to Suspend the Batch Process and Validate Show Batch Suspended Successfully Dialog
    Validate show Batch Suspended successfully dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    True

TC-36 Validate Show batch suspended successfully dialog in Expert Capture when "Show batch suspended successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Suspend Batch button to Suspend the Batch Process and Validate Show Batch Suspended Successfully Dialog
    Validate show Batch Suspended successfully dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    False

TC-37 Validate Show batch completed successfully dialog in Expert Capture when "Show batch completed successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch deleted successfully dialog
    Validate show batch Completed successfully dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    False

TC-38 Validate Show batch completed successfully dialog in Expert Capture when "Show batch completed successfully dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch deleted successfully dialog
    Validate show batch Completed successfully dialog is visible    ${APPLICATION_EXPERT_CAPTURE}    True

TC-39 Open an existing suspended batch and Import an electronic document and complete the batch
    [Setup]    Read Created Test Data    Data_04
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended
    Comment    In Expert Capture, Open an Existing Batch
    Open an Existing Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Suspended Batch Common Index Values
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Verify Completed Batch is not available in Load Window
    Validate Deleted or Completed Batch should not be displayed in Existing Batch Window    ${batchcontent}[Description]    ${APPLICATION_EXPERT_CAPTURE}

TC-40 Validate - Enable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Complete the batch
    [Setup]    Read Created Test Data    Data_28
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-41 Validate - Enable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Suspend the batch
    [Setup]    Read Created Test Data    Data_28
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-42 Validate - Enable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Delete the batch
    [Setup]    Read Created Test Data    Data_28
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-43 Validate - Disable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Complete the batch
    [Setup]    Read Created Test Data    Data_12
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate Batch should not Complete with unclassified documents
    Validate Batch should not Complete with unclassified documents
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-44 Validate - Disable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings"without filling the document class and Suspend the batch
    [Setup]    Read Created Test Data    Data_12
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended

TC-45 Validate - Disable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" withoug filling the document class and Delete the batch
    [Setup]    Read Created Test Data    Data_12
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-46 Open an existing suspended batch and Import an electronic document and Delete the batch
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Suspend Batch button to Suspend the Batch Process
    Suspend the Batch Process
    Comment    Validating Batch Process is Suspended.
    Validate Batch Should be Suspended
    Comment    In Expert Capture, Open an Existing Batch
    Open an Existing Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Suspended Batch Common Index Values
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_EXPERT_CAPTURE}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-47 Scan Image file and validate "Mark page as best available" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Validate "Mark Page As Best Available" Functionality
    Validate "Mark Page As Best Available" Functionality
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-48 Validate dragging and dropping of batch items in Expert Capture when "Enable dragging and dropping of batch items" checkbox in "Module Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_18
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate drag and drop document pages
    Validate drag and drop document pages    Expert Capture    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-49 Validate dragging and dropping of batch items in Expert Capture when "Enable dragging and dropping of batch items" checkbox in "Module Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_31
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate drag and drop document pages
    Validate drag and drop document pages    ${APPLICATION_EXPERT_CAPTURE}    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-50 Upload the multiple PDF documents with multiple pages and validate "Previous document in batch" functionality
    [Setup]    Read Created Test Data    Data_18
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate "Previous document" Icon status in Tool Bar Menu
    Validate "Previous document" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-51 Upload the multiple PDF documents with multiple pages and validate "Next document in batch" functionality
    [Setup]    Read Created Test Data    Data_18
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate "Next document" Icon status in Tool Bar Menu
    Validate "Next document" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-52 Upload the multiple PDF documents with multiple pages and validate "Next error" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Validate Next error and complete the batch
    Validate Next error and complete the batch

TC-53 Upload the multiple PDF documents with multiple pages and validate "Previous page" functionality
    [Setup]    Read Created Test Data    Data_04
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate "Previous page" Icon status in Tool Bar Menu
    Validate "Previous page" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-54 Upload the multiple PDF documents with multiple pages and validate "Next page" functionality
    [Setup]    Read Created Test Data    Data_04
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate "Next page" Icon status in Tool Bar Menu
    Validate "Next page" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-55 Upload the Image file and validate "Rotate Pages 180 degrees" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Rotate Page 180 degree button and validate Rotate Page 180 degree functionality
    Validate "Rotate Pages 180 degrees" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-56 Upload the Image file and validate "Rotate Pages 90 degrees to the left" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Rotate Page 90 degree left button and validate Rotate Page 90 degree left functionality
    Validate "Rotate Page 90 Degree to the Left" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-57 Upload the Image file and validate "Rotate Pages 90 degrees to the right" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Rotate Page 90 degree Right button and validate Rotate Page 90 degree Right functionality
    Validate "Rotate Page 90 Degree to the Right" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-58 Upload the Image file and validate "Zoom in" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Zoom In button and validate Zoom In functionality
    Validate "Zoom In" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-59 Upload the Image file and validate "Zoom out" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Zoom out button and validate Zoom out functionality
    Validate "Zoom Out" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-60 Upload the Image file and validate "Zoom to selection" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Zoom to Selection and validate Zoom to Selection functionality
    Validate "Zoom to selection" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-61 Validate In-progress batches when "Time out batch disposition action" is selected with "Leave in progress" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_04
    Set Time out In Session Management    2
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_EXPERT_CAPTURE}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Capture In Process

TC-62 Validate In-progress batches when "Time out batch disposition action" is selected with "Suspend" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_06
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_EXPERT_CAPTURE}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Suspended batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Suspended batch staus as "Captured Suspended" in Batch Monitor
    Validate suspended batch status in Batch Monitor    ${batchcontent}[Description]    Capture Suspended

TC-63 Validate In-progress batches when "Time out batch disposition action" is selected with "Delete" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_07
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_EXPERT_CAPTURE}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Delete Queued

TC-64 Validate Insert Pages Functionality in Expert Capture when "Show insert/append selection dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Inserted Pages when "Show insert/append selection dialog" is Enabled
    Validate Inserted Pages Functionality
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-65 Validate Append Pages Functionality in Expert Capture when "Show insert/append selection dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Append Pages when "Show insert/append selection dialog" is Enabled
    Validate Append Pages Functionality
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-66 Validate Insert Pages Functionality in Expert Capture when "Show insert/append selection dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_08
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Inserted Pages when "Show insert/append selection dialog" is Disabled
    Validate Inserted Pages Functionality    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-67 Validate Append Pages Functionality in Expert Capture when "Show insert/append selection dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_08
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Append Pages when "Show insert/append selection dialog" is Disabled
    Validate Append Pages Functionality    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-68 Validate Show assemble batch confirmation dialog in Expert Capture when "Show assemble batch confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Show assemble batch confirmation dialog
    Validate Show assemble batch confirmation dialog    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-69 Validate Show assemble batch confirmation dialog in Expert Capture when "Show assemble batch confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_08
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate Show assemble batch confirmation dialog
    Validate Show assemble batch confirmation dialog    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-70 Validate Show reorder batch items confirmation dialog in Expert Capture when "Show recorder batch items confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_31
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Show reorder batch items confirmation dialog
    Validate Show reorder batch items confirmation dialog    ${APPLICATION_EXPERT_CAPTURE}    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted
    [Teardown]    Close All Application Windows

TC-71 Validate Show reorder batch items confirmation dialog in Expert Capture when "Show recorder batch items confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_30
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]
    Comment    Validate Show reorder batch items confirmation dialog
    Validate Show reorder batch items confirmation dialog    ${APPLICATION_EXPERT_CAPTURE}    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-72 Upload the Image File and validate "Change Zoom Level" functionality
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Click on Change Zoom Level button and Validate Change Zoom Level functionality
    Validate "Change Zoom Level" Icon status in Tool Bar Menu
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-73 Validate Show delete batch item confirmation dialog in Expert Capture when "Show delete batch item confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_05
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate delete batch item confirmation dialog for Scaned Image Files
    Validate delete batch item confirmation dialog for Scanned Image Files    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-74 Validate Show delete batch item confirmation dialog in Expert Capture when "Show delete batch item confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_08
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Validate delete batch item confirmation dialog for Scaned Image Files
    Validate delete batch item confirmation dialog for Scanned Image Files    False
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-75 Validate visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_11
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    comment    Complete the Batch Process
    Complete the Batch Process
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-76 Validate visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_11
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    comment    Complete the Batch Process
    Complete the Batch Process
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-77 Validate visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_11
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    comment    Complete the Batch Process
    Complete the Batch Process
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-78 Validate visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate visible missing required custom fields
    Validate visible missing required custom fields
    comment    Complete the Batch Process
    Complete the Batch Process
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-79 Validate visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate visible missing required custom fields
    Validate visible missing required custom fields
    comment    Complete the Batch Process
    Complete the Batch Process
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-80 Validate visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_03
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate visible missing required custom fields
    Validate visible missing required custom fields
    comment    Complete the Batch Process
    Complete the Batch Process
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-81 Validate non-visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_32
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-82 Validate non-visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_34
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-83 Validate non-visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_36
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-84 Validate non-visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_33
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-85 Validate non-visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_35
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Index Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-86 Validate non-visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_37
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-87 Validate Visible Required Batch Custom Field when "Clipboard Enabled" checkbox is Enabled in Expert Capture
    [Setup]    Read Created Test Data    Data_54
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values with Batch content type and Scan modes as parameters
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload Electronic documents and Assign Document Index values for Uploaded Documents in Expert Capture with Document class data and Locator as parameters
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    comment    Select OCR text from Uploaded file in Expert Capture with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_EXPERT_CAPTURE}    ${BATCH_CUSTOM_FIELD}    BatchNo
    Comment    Validate Custom Field is Populated with Selected OCR text. Application window, Batch field type, BatchNo Custom Field name are given parameters
    Validate Custom Field is Populated With Selected OCR text    ${APPLICATION_EXPERT_CAPTURE}    Batch    BatchNo
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-88 Validate Visible Required Document Custom Field when "Clipboard Enabled" checkbox is Enabled in Expert Capture
    [Setup]    Read Created Test Data    Data_54
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values with Batch content type and Scan modes as parameters
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload Electronic documents and Assign Document Index values for Uploaded Documents in Expert Capture with Document class data and Locator as parameters
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    comment    Select OCR text from Uploaded file in Expert Capture with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_EXPERT_CAPTURE}    ${DOCUMENT_CUSTOM_FIELD}    BatchNo
    Comment    Validate Custom Field is Populated with Selected OCR text. Application window, Batch field type, BatchNo Custom Field name are given parameters
    Validate Custom Field is Populated With Selected OCR text    ${APPLICATION_EXPERT_CAPTURE}    Document    BatchNo
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-89 Validate Custom Filed Value Integer Type Accepts String Value in Expert Capture
    [Setup]    Read Created Test Data    Data_55
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values with Batch content type and Scan modes as parameters
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload Electronic documents and Assign Document Index values for Uploaded Documents in Expert Capture with Document class data and Locator as parameters
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    Comment    Validate Integer Custom Field in Expert Capture with Index field type, Custom Field name and Expected result as parameters
    Validate Integer Custom Field    ${APPLICATION_EXPERT_CAPTURE}    ${DOCUMENT_CUSTOM_FIELD}    PageType    Value is Invalid
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted

TC-90 Validate Non Required Batch Custom Field when "Clipboard Enabled" Checkbox is Enabled in Expert Capture
    [Setup]    Read Created Test Data    Data_59
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values with Batch content type and Scan modes as parameters
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload Electronic documents and Assign Document Index values for Uploaded Documents in Expert Capture with Document class data and Locator as parameters
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    comment    Select OCR text from Uploaded file in Expert Capture with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_EXPERT_CAPTURE}    ${BATCH_CUSTOM_FIELD}    BatchNo    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed

TC-91 Validate Visible Required Document Custom Field when "Clipboard Enabled" checkbox is Disabled in Expert Capture
    [Setup]    Read Created Test Data    Data_57
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values with Batch content type and Scan modes as parameters
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Upload Electronic documents and Assign Document Index values for Uploaded Documents in Expert Capture with Document class data and Locator as parameters
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    ${capture_wizard_content_info}[FileName]    False
    comment    Select OCR text from Uploaded file in Expert Capture with locator, Custom field name as parameters
    Select OCR text from Uploaded file    Expert Capture    ${DOCUMENT_CUSTOM_FIELD}    BatchNo
    comment    Validate Required Document Custom Fields in Expert Capture with Index field type and Custom field name as parameters
    Validate Required Document Custom Fields    Expert Capture    Document    BatchNo
    Comment    Click on Delete Batch button to Delete the Batch Process
    Delete the Batch Process
    Comment    Validating Batch Process is Deleted.
    Validate Batch Should be Deleted
