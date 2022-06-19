*** Settings ***
Suite Setup       SikuliLibrary.Add Image Path    ${EXECDIR}\\SikuliImages
Test Setup        Take Screenshots On Failure    False
Test Teardown     Run Keywords    Quit and Restart Capture Applications
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-01 Fail the suspended batch in Review and then validate the batch status as "Review Failed"
    [Setup]    Read Created Test Data    Data_22
    Comment    Select Expert Capture client to capture
    Select the Client Application    ${APPLICATION_EXPERT_CAPTURE}
    Comment    In Expert Capture, To Create New Batch
    Select Batch Operation Type From Tool Bar    Create_New_Batch
    Comment    Fill Batch System Values
    Populate Batch System Values    ${APPLICATION_EXPERT_CAPTURE}    ${batchcontent}[Description]    Black & White
    Comment    Assign Batch Review Values to Batch Content type
    Fill Batch Content Index data    ${capture_wizard_content_info}
    Comment    Click on Empty Documnet button to Create Empty Document in Expert Capture
    Create an Empty Document    ${APPLICATION_EXPERT_CAPTURE}
    Comment    Click on Scan Image Button to Quick Scan Image File in Expert Capture
    Quick Scan Image File    ${APPLICATION_EXPERT_CAPTURE}    ${capture_wizard_content_info}[FileName]
    Comment    Upload ScanImage and Assign Document Index values for Uploaded Images
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    None    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Suspended batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Change the batch status as Fail
    Select Batch Operation Type From Tool Bar in Batch Monitor    Change_Status    Fail
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Review Failed

TC-02 Reset the completed batch in Review to Review step and then validate the batch status as "Review Queued"
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
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    None    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Change the batch status as Fail
    Select Batch Operation Type From Tool Bar in Batch Monitor    Change_Status    Reset
    Comment    Reset the Batch to Index step
    Reset Batch Step in Batch Monitor    Review
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Review Queued

TC-03 Reset the completed batch in Expert Capture to capture step and then validate the batch status as "Captured Queued"
    [Setup]    Read Created Test Data    Data_25
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
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Change the batch status as Fail
    Select Batch Operation Type From Tool Bar in Batch Monitor    Change_Status    Reset
    Comment    Reset the Batch to Capture step
    Reset Batch Step in Batch Monitor    Capture
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Capture Queued

TC-04 Set the batch priority to High and then validate the batch priority status in Monitor
    [Setup]    Read Created Test Data    Data_25
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
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Change the batch priority as High
    Select Batch Operation Type From Tool Bar in Batch Monitor    Change_Priority    High
    Comment    Validate batch priority in Batch Monitor
    Validate batch priority in Batch Monitor    ${batchcontent}[Description]    High

TC-05 Validate Documents details of batch in Monitor
    [Setup]    Read Created Test Data    Data_24
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
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be open document class.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Click on document class button to open documents window
    Select Batch Operation Type From Tool Bar in Batch Monitor    Document_List
    Comment    Validate document class name and page no in documents window
    Validate document details in Document Window    ${capture_wizard_document_class_info}

TC-06 Complete the batch in Review and then validate the batch status "Delivery Queued" in Monitor
    [Setup]    Read Created Test Data    Data_26
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
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    None    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Validating Batch Process is Completed.
    Validate Batch Should be Completed
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Complete Batch button to Complete the Batch Process in Expert Index
    Complete the Batch Process in Review
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Completed batch status as Delivery Queued
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Delivery Queued

TC-07 Suspend the batch in Expert Capture and then validate the batch should be displayed under Suspended Batch List with status Captured Suspended
    [Setup]    Read Created Test Data    Data_25
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
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Suspended batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Suspended batch staus as "Captured Suspended" in Batch Monitor
    Validate suspended batch status in Batch Monitor    ${batchcontent}[Description]    Capture Suspended

TC-08 Delete the batch in Review and then validate the batch status "Delete Queued " in Monitor
    [Setup]    Read Created Test Data    Data_13
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
    Comment    Upload ScanImage and Assign Document Index values for Uploaded Images
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    None    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Delete Batch button to Delete the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Delete_Batch
    Comment    Close Expert Index Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Failed batch status as Index Failed
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Delete Queued

TC-09 Open Review suspended batch in Monitor and then validate batch is opened in Review
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
    Fill Index Values for a Document Class    ${capture_wizard_document_class_info['1']}    ${APPLICATION_EXPERT_CAPTURE}    CaptureHost    None    False
    Comment    Click on Complete Batch button to Complete the Batch Process
    Complete the Batch Process
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Expert Index client to capture
    Select the Client Application    ${APPLICATION_REVIEW}
    Comment    Get the next Available Batch in Content type
    Get the Next Available Batch    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch
    Comment    Close Expert Index Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Suspended batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Click on Batch open button
    Select Batch Operation Type From Tool Bar in Batch Monitor    Open_Batch
    Comment    Verify Expert Index Window is displayed
    Validate Batch is opened in Expert Index    ${batchcontent}[Description]
    Comment    Click on Suspend Batch button to Suspend the Batch Process in Expert Index
    Select Batch Operation Type From Tool Bar in Review    Suspend_Batch    False

TC-10 Search Batch details by content type in Monitor
    [Setup]    Read Created Test Data    Data_20
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
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Click on View Batch button to Search batch deatils
    Select Batch Operation Type From Tool Bar in Batch Monitor    View_Batches
    Comment    Search batch details in batch list view table by content type
    Search batch details in Batch List View    Content Type    ${batchcontent}[Description]    User    ${ADMIN_USER_ID}
    Comment    Validate Batch details in batch list view table
    Validate batch details in Batch List View    ${batchcontent}[Description]    Review Queued

TC-11 Validate Event History details of the batch
    [Setup]    Read Created Test Data    Data_25
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
    Comment    Close Expert Capture Window Applications
    Close All Application Windows
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Click on Event Histroy button to get batch event history
    Select Batch Operation Type From Tool Bar in Batch Monitor    Event_History
    Comment    Validate Event History in Event list view table
    Validate Event History of a batch    ${EVENTS_HISTORY_EXPECTED_DATA}
