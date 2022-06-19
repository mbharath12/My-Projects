*** Settings ***
Test Setup        Take Screenshots On Failure    False
Test Teardown     Run Keywords    Quit and Restart Capture Applications
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-01 Validate completed Batch is displayed in Review when “Always route batches to the Index step“ checkbox is enabled in Admin portal.
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Complete the Batch Process
    Complete the Batch Process in Review
    Comment    Verify Completed Status in Database
    Validate Batch Status in DB    ${batchcontent}[Code]    DLVRY    New

TC-02 Validate error message "There are no batches available in the index queue" in Expert Index when “Always route batches to the Index step“ checkbox is disabled for a completed Batch
    [Setup]    Read Created Test Data    Data_21
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    comment    Get Next Batch and Verify error message
    Validate when there are no Batches for Content Type in Review

TC-03 Validate Index Queued status when Release Batch is performed
    [Setup]    Read Created Test Data    Data_27
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Release the Batch Process in Review
    Release the Batch Process in Review
    Comment    Verify Release Status in SQL
    Validate Batch Status in DB    ${batchcontent}[Code]    REVIEW    New

TC-04 Reject the electronic document and then complete the Batch in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Reject the Document
    Reject the Document in Review    DC_001    Duplicate
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review

TC-05 Mark a document for rescan and then suspend the Batch in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Mark Document for Re Scan
    Mark the Document for rescan in Review    DC_001    Incomplete document or missing information
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Suspended Batch is available in Load Window
    Validate Suspended Rescan batch should be available in existing batches    ${batchcontent}[Description]
    Comment    Verify Suspend Status in Database
    Validate Batch Status in DB    ${batchcontent}[Code]    REVIEW    Suspended

TC-06 Open suspended batch in Review, Reject a document and then complete the Batch
    [Setup]    Read Created Test Data    Data_23
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    In Expert Index, Open an Existing Batch
    Open Existing Batch Window in Review    ${batchcontent}[Description]
    Comment    Select Document in the Tree View
    Select Document in the Tree View    DC_001
    Comment    Reject the Document
    Reject the Document in Review    DC_001    Duplicate
    Comment    Complete the Batch Process in Review
    Complete the Batch Process in Review
    Comment    Deleted Batch should not be displayed in Open batch window
    Validate Deleted or Completed Batch should not be displayed in Existing Batch Window    ${batchcontent}[Description]    ${APPLICATION_REVIEW}

TC-07 Add an Electronic document in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review

TC-08 Validate “Deleted Queued” status when Delete Batch is performed
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-09 Create an Empty Document and add Scanned Image in Review
    [Setup]    Read Created Test Data    Data_22
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
    Close All Application Windows
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Fill Batch System Values in Expert Index
    Populate Batch System Values    ${APPLICATION_REVIEW}    ${batchcontent}[Description]    Black & White
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_REVIEW}    ${Index_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review

TC-10 Validate Custom fields should be hidden for a Document class in Review when Custom fields are set to hidden state in Index step settings
    [Setup]    Read Created Test Data    Data_23
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Custom Fields should be hidden for Batch content when custom fields are set to hidden state
    Validate Custom fields should be hidden for a Batch Content    ${batchcontent}
    Comment    Validate Custom Fields should be hidden for Document Class when custom fields are set to hidden state
    Validate Custom fields should be hidden for a Document class    ${document_classes}[1]
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-11 Validate - Enable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Complete the batch
    [Setup]    Read Created Test Data    Data_38
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-12 Validate - Enable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Suspend the batch
    [Setup]    Read Created Test Data    Data_38
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Suspended in Review

TC-13 Validate - Enable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Delete the batch
    [Setup]    Read Created Test Data    Data_38
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-14 Validate - Disable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" without filling the document class and Complete the batch
    [Setup]    Read Created Test Data    Data_39
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate Batch should not Complete with unclassified documents
    Validate Batch should not Complete with unclassified documents
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-15 Validate - Disable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings"without filling the document class and Suspend the batch
    [Setup]    Read Created Test Data    Data_39
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Suspended in Review

TC-16 Validate - Disable "Allow batches to be completed with unclassified documents" checkbox in "Content Settings" withoug filling the document class and Delete the batch
    [Setup]    Read Created Test Data    Data_39
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-17 Validate - Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch
    [Setup]    Read Created Test Data    Data_40
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-18 Validate - Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Suspend the batch
    [Setup]    Read Created Test Data    Data_40
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Suspended in Review

TC-19 Validate - Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Delete the batch
    [Setup]    Read Created Test Data    Data_40
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-20 Validate - Disable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch
    [Setup]    Read Created Test Data    Data_41
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate Batch Should Not Complete With Allow Loose Pages
    Validate Batch Should Not Complete With Allow Loose Pages
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-21 Validate - Disable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Suspend the batch
    [Setup]    Read Created Test Data    Data_41
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Suspended in Review

TC-22 Validate - Diable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and Delete the batch
    [Setup]    Read Created Test Data    Data_41
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-23 Validate visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-24 Validate visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-25 Validate visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-26 Validate visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_43
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-27 Validate visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_43
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate Batch Index Values to Batch Content type
    Validate Batch Index Values    ${capture_wizard_content_info}
    Comment    Validate Batch Index Values for All Document Class in Expert Index
    Validate Batch Index Values for All Document Class    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    Encapture Review
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-28 Validate visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_43
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Clear the Required Custom Fields Text
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    comment    Validate "Allow batches to be completed with visible missing required custom fields"
    Validate "Allow batches to be completed with visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-29 Validate non-visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_32
    Comment    Expert Capture Flow with non-visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    Expert Capture Flow with non-visible missing required batch custom fields
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-30 Validate non-visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_34
    Comment    Expert Capture Flow with non-visible missing required Document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    Expert Capture Flow with non-visible missing required document custom fields
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-31 Validate non-visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    [Setup]    Read Created Test Data    Data_36
    Comment    Expert Capture Flow with non-visible missing required Batch and Document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Enabled
    Expert Capture Flow with non-visible missing required batch and document custom fields
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-32 Validate non-visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_44
    Comment    Expert Capture Flow with non-visible missing required batch custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    Expert Capture Flow with non-visible missing required batch custom fields
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review

TC-33 Validate non-visible missing required document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_45
    Comment    Expert Capture Flow with non-visible missing required Document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    Expert Capture Flow with non-visible missing required document custom fields
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review

TC-34 Validate non-visible missing required batch and document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    [Setup]    Read Created Test Data    Data_46
    Comment    Expert Capture Flow with non-visible missing required Batch and Document custom fields when "Allow batches to be completed with Visible missing required custom fields" checkbox in "Content Settings" is Disabled
    Expert Capture Flow with non-visible missing required batch and document custom fields
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate nonvisible required Batch custom fields
    Validate non-visible missing required custom fields    BatchNo
    Comment    Validate nonvisible required Document custom fields
    Validate non-visible missing required custom fields    BatchID
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate "Allow batches to be completed with non-visible missing required custom fields" functionality
    Validate "Allow batches to be completed with non-visible missing required custom fields"    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review

TC-35 Validate - Enable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Complete the batch
    [Setup]    Read Created Test Data    Data_49
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    pasword_protect_doc=Yes
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-36 Validate - Enable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Suspend the batch
    [Setup]    Read Created Test Data    Data_49
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    pasword_protect_doc=Yes
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Suspended in Review

TC-37 Validate - Enable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Delete the batch
    [Setup]    Read Created Test Data    Data_49
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    pasword_protect_doc=Yes
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-38 Validate - Disable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Complete the batch
    [Setup]    Read Created Test Data    Data_48
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    pasword_protect_doc=Yes    doc_password=EncaptureQA
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch Completed successfully dialog
    Validate show batch Completed successfully dialog is visible    ${APPLICATION_REVIEW}    True
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-39 Validate - Disable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Suspend the batch
    [Setup]    Read Created Test Data    Data_48
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    pasword_protect_doc=Yes    doc_password=EncaptureQA
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Suspended in Review

TC-40 Validate - Disable "Allow batches to be completed with password protected PDF documents" checkbox in "Content Settings" and Delete the batch
    [Setup]    Read Created Test Data    Data_48
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    pasword_protect_doc=Yes    doc_password=EncaptureQA
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Suspended in Review
    Validate Batch Should be Deleted in Review

TC-41 Validate Copying and Pasting of Batch Items in Review When "Enable Copying and Pasting of Batch Items " checkbox in "Module Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Copying and Pasting Of Batch Items
    Validate Copy and Paste Actions on Batch Items    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-42 Validate Copying and Pasting of Batch Items in Review When "Enable Copying and Pasting of Batch Items " checkbox in "Module Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_47
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Copying and Pasting Of Batch Items
    Validate Copy and Paste Actions on Batch Items    ${APPLICATION_REVIEW}    False
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review    True
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-43 Validate dragging and dropping of batch items in Review when "Enable dragging and dropping of batch items" checkbox in "Module Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_18
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate drag and drop of batch items
    Validate drag and drop document pages    ${APPLICATION_REVIEW}    False
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-44 Validate dragging and dropping of batch items in Review when "Enable dragging and dropping of batch items" checkbox in "Module Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_31
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate drag and drop of batch items
    Validate drag and drop document pages    ${APPLICATION_REVIEW}    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-45 Validate cutting and pasting of batch item in Review when "Enable cutting and pasting of batch items" checkbox in "Module Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_50
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Cut and Paste operation on batch items
    Validate Cut and Paste operation on batch items    ${APPLICATION_REVIEW}    False
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review    True
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-46 Validate cutting and pasting of batch item in Review when "Enable cutting and pasting of batch items" checkbox in "Module Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate Cut and Paste operation on batch items
    Validate Cut and Paste operation on batch items    ${APPLICATION_REVIEW}    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-47 Validate Show release batch confirmation dialog box in Review when "Show release batch confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_39
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Release batch confirmation dialog is Enabled
    Validate Release batch confirmation dialog is visible    True

TC-48 Validate Show release batch confirmation dialog box in Reviewx when "Show release batch confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_43
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Release batch confirmation dialog is Disabled
    Validate Release batch confirmation dialog is visible    False

TC-49 Validate Show batch released successfully dialog box in Review when "Show batch released successfully dialog"" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_47
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Show Batch Released Successfully Dialog is Enabled
    Validate Show Batch Released Successfully Dialog is Visible    True

TC-50 Validate Show batch released successfully dialog box in Review when "Show batch released successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_50
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Show Batch Released Successfully Dialog is Disabled
    Validate Show Batch Released Successfully Dialog is Visible    False

TC-51 Validate In-progress batches when "Time out batch disposition action" is selected with "Suspend" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_53
    Set Time out In Session Management    2
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_REVIEW}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Suspended batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Suspended batch staus as "Captured Suspended" in Batch Monitor
    Validate suspended batch status in Batch Monitor    ${batchcontent}[Description]    Review Suspended

TC-52 Validate In-progress batches when "Time out batch disposition action" is selected with "Leave in progress" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_04
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_REVIEW}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Review In Process

TC-53 Validate In-progress batches when "Time out batch disposition action" is selected with "Discard changes and release" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_52
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_REVIEW}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate recent batch documents count
    Validate recent batch documents count    ${batchcontent}[Description]    1

TC-54 Validate In-progress batches when "Time out batch disposition action" is selected with "Save changes and release" in "Module Control Settings"
    [Setup]    Read Created Test Data    Data_51
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate time out batch disposition action
    Validate time out batch disposition action    ${APPLICATION_REVIEW}
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate recent batch documents count
    Validate recent batch documents count    ${batchcontent}[Description]    2

TC-55 Validate Show recorder batch items confirmation dialog in Review when "Show recorder batch items confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_31
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Show reorder batch items confirmation dialog
    Validate Show reorder batch items confirmation dialog    ${APPLICATION_REVIEW}    True
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-56 Validate Show recorder batch items confirmation dialog in Review when "Show recorder batch items confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_30
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Show reorder batch items confirmation dialog
    Validate Show reorder batch items confirmation dialog    ${APPLICATION_REVIEW}    False
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-57 Validate Show delete batch confirmation dialog in Review when "Show delete batch confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_15
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show delete confirmation dialog
    Validate Delete batch confirmation dialog is visible    ${APPLICATION_REVIEW}    True

TC-58 Validate Show delete batch confirmation dialog in Review when "Show delete batch confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_13
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show delete confirmation dialog
    Validate Delete batch confirmation dialog is visible    ${APPLICATION_REVIEW}    False

TC-59 Validate Show delete batch item confirmation dialog in Review when "Show delete batch item confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_26
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Fill Batch System Values in Expert Index
    Populate Batch System Values    ${APPLICATION_REVIEW}    ${batchcontent}[Description]    Black & White
    Comment    Validate delete batch item confirmation dialog for Scaned Image Files
    Validate delete batch item confirmation dialog for Scanned Image Files    True    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-60 Validate Show delete batch item confirmation dialog in Review when "Show delete batch item confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_22
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Fill Batch System Values in Expert Index
    Populate Batch System Values    ${APPLICATION_REVIEW}    ${batchcontent}[Description]    Black & White
    Comment    Validate delete batch item confirmation dialog for Scaned Image Files
    Validate delete batch item confirmation dialog for Scanned Image Files    False    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-61 Validate Show batch Deleted successfully dialog in Review when "Show batch Deleted successfully dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_17
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch deleted successfully dialog
    Validate Batch Deleted Successful dialog is visible    True    ${APPLICATION_REVIEW}

TC-62 Validate Show batch Deleted successfully dialog in Review when "Show batch Deleted successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_04
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Batch System Values
    Validate Batch Content Type is selected    ${batchcontent}[Description]    ${APPLICATION_ENCAPTURE_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch deleted successfully dialog
    Validate Batch Deleted Successful dialog is visible    False    ${APPLICATION_REVIEW}

TC-63 Validate - Open an existing suspended batch and Import an electronic document and complete the batch
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    In Expert Index, Open an Existing Batch
    Open Existing Batch Window in Review    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Complete the Batch Process in Review
    Complete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Completed in Review

TC-64 Validate - Open an existing suspended batch and Import an electronic document and Delete the batch
    [Setup]    Read Created Test Data    Data_42
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    In Expert Index, Open an Existing Batch
    Open Existing Batch Window in Review    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Complete the Batch Process in Review
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-65 Validate Show complete batch confirmation dialog in Review when "Show complete batch confirmation dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_15
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Complete Batch button to Complete the Batch Process and Validate Show Complete confirmation dialog
    Validate Complete batch confirmation dialog is visible    ${APPLICATION_REVIEW}    True

TC-66 Validate Show complete batch confirmation dialog in Review when "Show complete batch confirmation dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_13
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Complete Batch button to Complete the Batch Process and Validate Show Complete confirmation dialog
    Validate Complete batch confirmation dialog is visible    ${APPLICATION_REVIEW}    False

TC-67 Validate Show batch completed successfully dialog in Review when "Show batch completed successfully dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_48
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch Completed successfully dialog
    Validate show batch Completed successfully dialog is visible    ${APPLICATION_REVIEW}    True

TC-68 Validate Show batch completed successfully dialog in Review when "Show batch completed successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_27
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process and Validate Show batch Completed successfully dialog
    Validate show batch Completed successfully dialog is visible    ${APPLICATION_REVIEW}    False

TC-69 Validate Show batch suspended successfully dialog in Review when "Show batch suspended successfully dialog" checkbox in "Dialog Control Settings" is Enabled
    [Setup]    Read Created Test Data    Data_13
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process and Validate Show Batch Suspended Successfully Dialog
    Validate show Batch Suspended successfully dialog is visible    ${APPLICATION_REVIEW}    True

TC-70 Validate Show batch suspended successfully dialog in Review when "Show batch suspended successfully dialog" checkbox in "Dialog Control Settings" is Disabled
    [Setup]    Read Created Test Data    Data_27
    comment    Expert Capture flow by uploading Electronic document
    Expert Capture flow by uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process and Validate Show Batch Suspended Successfully Dialog
    Validate show Batch Suspended successfully dialog is visible    ${APPLICATION_REVIEW}    False

TC-71 Validate - Open an existing suspended batch and Import an electronic document and Delete the batch
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    In Expert Index, Open an Existing Batch
    Open Existing Batch Window in Review    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Deleted Batch should not be displayed in Open batch window
    Validate Deleted or Completed Batch should not be displayed in Existing Batch Window    ${batchcontent}[Description]    ${APPLICATION_REVIEW}

TC-72 Upload the Image file and validate "Mark page as best available" functionality
    [Setup]    Read Created Test Data    Data_40
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate "Mark Page As Best Available" Functionality
    Validate "Mark Page As Best Available" Functionality    ${APPLICATION_REVIEW}
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review

TC-73 Upload the Image file and validate "Rotate Pages 180 degrees" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Rotate Page 180 degree button and validate Rotate Page 180 degree functionality
    Validate "Rotate Pages 180 degrees" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-74 Upload the Image file and validate "Rotate Pages 90 degrees to the left" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Rotate Page 90 degree left button and validate Rotate Page 90 degree left functionality
    Validate "Rotate Page 90 Degree to the Left" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-75 Upload the Image file and validate "Rotate Pages 90 degrees to the right" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Rotate Page 90 degree Right button and validate Rotate Page 90 degree Right functionality
    Validate "Rotate Page 90 Degree to the Right" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-76 Upload the Image file and validate "Zoom in" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Zoom In button and validate Zoom In functionality
    Validate "Zoom In" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-77 Upload the Image file and validate "Zoom out" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Zoom out button and validate Zoom out functionality
    Validate "Zoom Out" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-78 Upload the Image file and validate "Change zoom level" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Change Zoom Level button and Validate Change Zoom Level functionality
    Validate "Change Zoom Level" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-79 Upload the Image file and validate "Zoom to selection" functionality
    [Setup]    Read Created Test Data    Data_26
    Comment    Enable "Allow batches to be completed with loose pages" checkbox in "Content Settings" and complete the batch in Expert Capture
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Click on "Get the next Available" to Open Batch in Expert Index with BCT_DESCRIPTION
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Zoom to Selection and validate Zoom to Selection functionality
    Validate "Zoom to selection" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-80 Upload the multiple PDF documents with multiple pages and validate "Previous document in batch" functionality
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate "Previous document" Icon status in Tool Bar Menu
    Validate "Previous document" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-81 Upload the multiple PDF documents with multiple pages and validate "Previous page" functionality
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate "Previous document" Icon status in Tool Bar Menu
    Validate "Previous page" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-82 Upload the multiple PDF documents with multiple pages and validate "Next page" functionality
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate "Previous document" Icon status in Tool Bar Menu
    Validate "Next page" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-83 Upload the multiple PDF documents with multiple pages and validate "Next document in batch" functionality
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate "Previous document" Icon status in Tool Bar Menu
    Validate "Next document" Icon status in Tool Bar Menu    ${APPLICATION_REVIEW}
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-84 Upload the multiple PDF documents with multiple pages and validate "Next error" functionality
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload E-documents and Assign Document Index values for Uploaded Documents
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    Comment    Validate "Previous document" Icon status in Tool Bar Menu
    Validate Next error and complete the batch    ${APPLICATION_REVIEW}
    Comment    Validate Batch Should be Completed in Review
    Validate Batch Should be Completed in Review

TC-85 Validate "Revert batch" functionality in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    comment    Validate Revert batch
    Validate Revert batch
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-86 Validate "Release batch" functionality in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Validate Release batch in Expert Index
    Validate Release Batch Confirmation Dialog is Visible

TC-87 Validate "Can't Undo" functionality in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    comment    Validate Can't Undo operation after uploading electronic document
    Validate Can't Undo operation
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-88 Validate "Confirm low-confidence-document" functionality in Review
    [Setup]    Read Created Test Data    Data_20
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic-documents and Assign Document Index values for Uploaded Documents in Expert Index
    Upload Document and Fill Index Values for All Document Classes    ${Index_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]
    comment    Validate low confidence document in Expert Index
    Validate low confidence
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-89 Validate Visible Required Batch Custom Field when "Clipboard Enabled" checkbox is Enabled in Review
    [Setup]    Read Created Test Data    Data_54
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    comment    Select OCR text from Uploaded file in Expert Index with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}    BatchNo
    Comment    Validate Custom Field is Populated with Selected OCR text. Application window, Batch field type, BatchNo Custom Field name are given parameters
    Validate Custom Field is Populated With Selected OCR text    ${APPLICATION_REVIEW}    Batch    BatchNo
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-90 Validate Visible Required Document Custom Field when "Clipboard Enabled" checkbox is Enabled in Review
    [Setup]    Read Created Test Data    Data_54
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    comment    Select OCR text from Uploaded file in Expert Index with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_REVIEW}    ${DOCUMENT_CUSTOM_FIELD}    BatchNo
    Comment    Validate Custom Field is Populated with Selected OCR text. Application window, Batch field type, BatchNo Custom Field name are given parameters
    Validate Custom Field is Populated With Selected OCR text    ${APPLICATION_REVIEW}    Document    BatchNo
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-91 Validate Custom Filed Value Integer Type Accepts String Value in Review
    [Setup]    Read Created Test Data    Data_56
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture Flow by Uploading Image File
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Upload Electronic documents and Assign Document Index values for Uploaded Documents in Expert Index with Document class data and Locator as parameters
    Upload Document and Fill Index Values for All Document Classes    ${capture_wizard_document_class_info}    ${APPLICATION_REVIEW}    IndexHost    ${Index_wizard_content_info}[FileName]    False
    Comment    Validate Integer Custom Field in Expert Index with Index field type, Custom Field name and Expected result as parameters
    Validate Integer Custom Field    ${APPLICATION_REVIEW}    ${DOCUMENT_CUSTOM_FIELD}    PageType    Value is Invalid
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review

TC-92 Validate Visible Non Required Batch Custom Field when "Clipboard Enabled" Checkbox is Enabled in Review
    [Setup]    Read Created Test Data    Data_60
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    comment    Clear the Batch Custom Filed Text in Expert Index
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}
    comment    Select OCR text from Uploaded file in Expert Index with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_REVIEW}    ${BATCH_CUSTOM_FIELD}    BatchNo    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process in Review
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed in Review

TC-93 Validate Visible Required Document Custom Field when "Clipboard Enabled" checkbox is Disabled in Review
    [Setup]    Read Created Test Data    Data_58
    comment    Expert Capture flow by Uploading Electronic document
    Expert Capture flow by Uploading Electronic document
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    comment    Select OCR text from Uploaded file in Expert Index with locator, Custom field name as parameters
    Select OCR text from Uploaded file    ${APPLICATION_REVIEW}    ${DOCUMENT_CUSTOM_FIELD}    BatchNo
    comment    Clear the Document Custom Field Text in Expert Index
    Clear the Required Custom Fields Text    ${APPLICATION_REVIEW}    ${DOCUMENT_CUSTOM_FIELD}
    comment    Validate Required Document Custom Fields in Expert Capture with Index field type and Custom field name as parameters
    Validate Required Document Custom Fields    ${APPLICATION_REVIEW}    Document    BatchNo
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Delete the Batch Process in Review
    Comment    Validate Batch Should be Deleted in Review
    Validate Batch Should be Deleted in Review
