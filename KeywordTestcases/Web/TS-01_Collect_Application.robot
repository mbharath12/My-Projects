*** Settings ***
Test Teardown     Run Keywords    Close Collect Application    Quit and Restart Capture Applications
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-01 Validate - Complete the batch when single electronic document is imported.
    [Setup]    Read Created Test Data    TC_01
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-02 Validate - Complete the batch when multiple electronic documents are imported.
    [Setup]    Read Created Test Data    TC_02
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Multiple Electronic Documents in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-03 Validate - Complete the batch when image document is imported.
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Image Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-04 Validate - Complete the batch when multiple image documents are imported.
    [Setup]    Read Created Test Data    TC_08
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Multiple Image Documents in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-05 Validate - Complete the batch when multiple type documents imported.
    [Setup]    Read Created Test Data    TC_09
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Multiple Type Documents in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-06 Validate - Batch status should be "Delivery Queued" in Monitor after completing a Batch when Review is not configured.
    [Setup]    Read Created Test Data    TC_01
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Completed batch status as Delivery Queued
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Delivery Queued

TC-07 Validate - Batch status should be "Review Queued" in Monitor after completing a Batch when Review is configured
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application
    Comment    Select Monitor client to capture
    Select the Client Application    ${APPLICATION_MONITOR}
    Comment    Select the Batch Content type to be opened.
    Select Batch from Recent Batch list in Batch Monitor    ${batchcontent}[Description]
    Comment    Validate Completed batch status as Delivery Queued
    Validate recent batch status in Batch Monitor    ${batchcontent}[Description]    Review Queued

TC_08 Validate - Complete the batch when single text document is imported.
    [Setup]    Read Created Test Data    TC_05
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC_09 Validate - Complete the batch when Multiple Text documents are imported.
    [Setup]    Read Created Test Data    TC_10
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-10 Validate - Complete batch when no Batch Index Fields are configured
    [Setup]    Read Created Test Data    TC_11
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC_11 Validate - Complete batch when no Documents Index Fields are configured
    [Setup]    Read Created Test Data    TC_12
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-12 Validate - Cancel the batch when electronic document is imported.
    [Setup]    Read Created Test Data    TC_01
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Cancel the Batch after document Uploaded
    Cancel the batch in Collect Application
    Comment    Validate Batch is Cancelled and navigate to Select Content Type in Collect Application
    Validate Batch is Cancelled in Collect Application

TC-13 Validate - 'Upload More Files' after completing the Batch.
    [Setup]    Read Created Test Data    TC_01
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate Upload More Files After BCT Completed in Collect Application
    Validate Upload More Files After Completing the Batch

TC_14 Validate - Delete one electronic document when multiple electronic documents are imported.
    [Setup]    Read Created Test Data    TC_02
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Delete the Uploaded document in Collect Application
    Delete the document in Collect Application    DC_001
    Comment    Validate Document is Deleted in Collect Application
    Validate Document is Deleted in Collect Application    DC_001
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC_15 Validate - Delete a page when multiple page electronic document is imported.
    [Setup]    Read Created Test Data    TC_12
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Delete the Page from Document and given page number as parameter
    Delete the Page from Document in Collect Application    1    DC_001
    Comment    Validate Page is Deleted from the Document
    Validate Page is Deleted from the Document in Collect Application
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-16 Validate - "Zoom in" for an single page Electronic Document
    [Setup]    Read Created Test Data    TC_11
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    comment    Edit the uploaded electronic document in collect application
    Edit Files in Collect Application    DC_001
    comment    Validate Zoom In Document
    Validate Zoom In Document    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\ZoomIn_in_Electronic_document
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-17 Validate - "Zoom out" for an single page Electronic Document
    [Setup]    Read Created Test Data    TC_11
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    comment    Edit the uploaded electronic document in collect application
    Edit Files in Collect Application    DC_001
    comment    Validate Zoom out Document
    Validate Zoom out Document    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\Zoom_out_Electronic_document
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-18 Validate - "Zoom in" for an image Document
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    comment    Edit the uploaded electronic document in collect application
    Edit Files in Collect Application    DC_001
    comment    Validate Zoom In Document
    Validate Zoom In Document    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\Zoom_in_image_document
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-19 Validate - "Zoom out" for an image Document
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    comment    Edit the uploaded electronic document in collect application
    Edit Files in Collect Application    DC_001
    comment    Validate Zoom out Document
    Validate Zoom out Document    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\Zoom_out_Image_Document
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-20 Validate - "Rotate Pages" for an single page Electronic Document
    [Setup]    Read Created Test Data    TC_11
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    comment    Edit the uploaded electronic document in collect application
    Edit Files in Collect Application    DC_001
    comment    Validate Rotate a Document
    Validate Rotate a Document    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\Rotate_electronic_document_image
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-21 Validate - "Rotate Pages" for an image Document
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    comment    Edit the uploaded electronic document in collect application
    Edit Files in Collect Application    DC_001
    comment    Validate Rotate a Document
    Validate Rotate a Document    ${EXECDIR}\\SikuliImages\\Collect_Expected_Images\\Rotate_image
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-22 Validate - Custom Field Value with type Integer should not Accept String Value.
    [Setup]    Read Created Test Data    TC_06
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Validate Integer Type Field should not accepts String in Collect Application
    Validate Error messages is displayed in Collect    The value supplied for field 'PageType' is invalid.

TC-23 Validate - Batch Index fields and Document Class Index fields can be edited in Upload Files Page.
    [Setup]    Read Created Test Data    TC_13
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Edit Batch Index Fields in Collect Application
    Edit Batch Fields in Collect    BatchNo    NO1111
    Comment    Edit Document Index Fields in Collect Application
    Edit Document Fields in Collect    BatchID    ID1111
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-24 Validate - Error message is displayed when single page electronic document is split.
    [Setup]    Read Created Test Data    TC_13
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Split Single Page Electronic Document into Multiple Documents
    Split the Document in Collect    DC_001    1
    Comment    Verify Error message in Collect
    Validate Error messages is displayed in Collect    Splitting this file will remove the document entitled
    Comment    Cancel Edit Files in Collect
    Cancel Edit Files in Collect
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-25 Validate - Error message is displayed when image document is split.
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Split Single Page Electronic Document into Multiple Documents
    Split the Document in Collect    DC_001    1
    Comment    Verify Error message in Collect
    Validate Error messages is displayed in Collect    Splitting this file will remove the document entitled
    Comment    Cancel Edit Files in Collect
    Cancel Edit Files in Collect
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-26 Validate - Delete one image document when multiple image documents imported.
    [Setup]    Read Created Test Data    TC_08
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Delete the Uploaded document in Collect Application
    Delete the document in Collect Application    DC_001
    Comment    Validate Document is Deleted in Collect Application
    Validate Document is Deleted in Collect Application    DC_001
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-27 Validate - Delete a page when single page of electronic document is imported.
    [Setup]    Read Created Test Data    TC_11
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Delete the Page from Document and given page number as parameter
    Delete the Page from Document in Collect Application    1    DC_001
    Comment    Validate Document is Deleted in Collect Application
    Validate Document is Deleted in Collect Application    DC_001
    Comment    Cancel the Batch after document Uploaded
    Cancel the batch in Collect Application
    Comment    Validate Batch is Cancelled and navigate to Select Content Type in Collect Application
    Validate Batch is Cancelled in Collect Application

TC-28 Validate - Delete an image when single image is imported.
    [Setup]    Read Created Test Data    TC_07
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Delete the Page from Document and given page number as parameter
    Delete the Page from Document in Collect Application    1    DC_001
    Comment    Validate Document is Deleted in Collect Application
    Validate Document is Deleted in Collect Application    DC_001
    Comment    Cancel the Batch after document Uploaded
    Cancel the batch in Collect Application
    Comment    Validate Batch is Cancelled and navigate to Select Content Type in Collect Application
    Validate Batch is Cancelled in Collect Application

TC-31 Validate - Batch and Document custom field value when "Data Source" is enabled with "Value and Permitted Values" settings.
    [Setup]    Read Created Test Data    TC_14
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Complete the Batch in Collect Application
    Validate Review Document Details and Complete The Batch in Collect    1111111111|CLS
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-32 Validate - Batch and Document multiple fields when "Data Source" are enabled with "Permitted Values and Validation Rule" settings and "Dependent Fields".
    [Setup]    Read Created Test Data    TC_16
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]    2222222222
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    False    CLS
    Comment    Complete the Batch in Collect Application
    Validate Review Document Details and Complete The Batch in Collect    Jason|Closing
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-33 Validate - Batch and Document multiple fields when "Data Source" and "Dependent Fields" are enabled with "Permitted Values and Default Value Data Source" settings.
    [Setup]    Read Created Test Data    TC_15
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]    1111111111
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    False    UW
    Comment    Validate Custom Field Should Displayed As Configured for Data Source in Collect Application
    Validate Review Document Details and Complete The Batch in Collect    1111111111|Tim|UW|Underwriting
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-34 Validate - Batch and Document custom field value when "Data Source" is enabled with "Permitted Values and Validation Rule" settings
    [Setup]    Read Created Test Data    TC_17
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]    1111111111
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    False    TR
    Comment    Validate Custom Field Should Displayed As Configured for Data Source in Collect Application
    Validate Review Document Details and Complete The Batch in Collect    1111111111|TR
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-35 Validate - Batch and Document custom field value when "Data Source" is enabled with "Value and Permitted Values" and "Dependent Fields" settings
    [Setup]    Read Created Test Data    TC_17
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]    1111111111
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]    False    TR
    Comment    Complete the Batch in Collect Application
    Validate Review Document Details and Complete The Batch in Collect    Tim|Trailing
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application

TC-37 Validate - Error message is displayed when there are no Batch Content Types Configured in Admin Portal.
    Comment    Clear Batch Content Types From Database
    DatabaseOperations.Clear Batches Testdata From Db
    Comment    Login to Encapture Application
    Login to Encapture Application    ${ADMIN_USER_ID}    ${ADMIN_USER_PASWORD}
    Comment    Select Collect Application
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Validate Error Message When No Batch Content Types are Configured
    Validate Error messages is displayed in Collect    There are no Content Types setup to work with Encapture Collect at this time. Please notify your IT representative so they can complete the setup process.

TC-45 Validate - Warning message is displayed when the saved document is Split.
    [Setup]    Read Created Test Data    TC_01
    Comment    Select Collect Application to Capture
    Select the Client Application    ${APPLICATION_COLLECT}
    Comment    Select BCT in Collect Application and Fill Index Values
    Select Batch Content Type and Fill Index Values in Collect    ${capture_wizard_content_info}    ${batchcontent}[Description]
    Comment    Upload Single Electronic Document in Collect Application
    Upload Electronic Document File in Collect Application    ${capture_wizard_document_class_info}    ${capture_wizard_content_info}[FileName]
    Comment    Split Single Page Electronic Document into Multiple Documents
    Split the Document in Collect    DC_001    1    Validate warning message
    Comment    Verify Error message in Collect
    Validate Error messages is displayed in Collect    Splitting this file will remove the document entitled
    Comment    Cancel Edit Files in Collect
    Cancel Edit Files in Collect
    Comment    Complete the Batch in Collect Application
    Complete the Batch in Collect Application
    Comment    Validate BCT Completed in Collect Application
    Validate Batch Should be Completed in Collect Application
