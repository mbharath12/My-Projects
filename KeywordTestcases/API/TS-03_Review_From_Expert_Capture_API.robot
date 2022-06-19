*** Settings ***
Suite Setup       Get Authentication Token    EXCAP
Resource          ../../Keywords/Global/super.robot

*** Test Cases ***
TC-51 Complete Batch in Expert Capture And Complete Batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Complete Batch in Expert Capture
    Complete The Batch In Expert Capture
    Comment    Open Batch in Expert Index
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeComplete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-52 Complete Batch in Expert Capture And Suspend batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Complete Batch in Expert Capture
    Complete The Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeSuspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-53 Complete Batch in Expert Capture And Delete Batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Complete Batch in Expert Capture
    Complete The Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Post - Before Delete
    ${response}    Before Delete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post - Delete Batch
    ${response}    Delete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-54 Complete Batch in Expert Capture And Complete Suspended batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Complete Batch in Expert Capture
    Complete The Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeSuspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    comment    Open suspended batch in Expert Index
    Open suspended batch in Expert Index
    Comment    Post -BeforeComplete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-55 Complete Batch in Expert Capture And Delete Suspended Batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Complete Batch in Expert Capture
    Complete The Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeSuspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    comment    Open suspended batch in Expert Index
    Open suspended batch in Expert Index
    Comment    Post -BeforeComplete
    ${response}    Before Delete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Delete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-56 Complete Batch in Expert Capture And Reject Document in Review And Then Suspend Batch
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Import Electronic Document and Complete Batch In Expert Capture
    Import Electronic Document and Complete Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Update Batch with Reject Document in Expert Index
    ${response}    Update Batch in Expert Index for Rescan and Reject Document    ${batchId}    ${document_id}    ${document_page_id}    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch with Rescan and Reject Document in Expert Index Request body Template.txt    ${batchcontent}    Duplicate
    Validate Response Status Code    ${response}    200
    Comment    Post -BeforeSuspend
    ${response}    Before Suspend
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Suspend Batch
    ${response}    Suspend Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-57 Complete Batch in Expert Capture And Rescan Document in Review And Then Complete Batch
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Import Electronic Document and Complete Batch In Expert Capture
    Import Electronic Document and Complete Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Update Batch with Reject Document in Expert Index
    ${response}    Update Batch in Expert Index for Rescan and Reject Document    ${batchId}    ${document_id}    ${document_page_id}    ${TESTDATA_FOLDER}\\API_TEMPLATES\\Update Batch with Rescan and Reject Document in Expert Index Request body Template.txt    ${batchcontent}    ImageQuality
    Validate Response Status Code    ${response}    200
    Comment    Post - Before Complete
    ${response}    Before Complete
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}
    Comment    Post -Complete Batch
    ${response}    Complete Batch
    Validate Response Status Code    ${response}    200
    Validate Response Body    ${response.content}    expected_value=${batchId}

TC-58 Complete Batch in Expert Capture And Reject batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Import Electronic Document and Complete Batch In Expert Capture
    Import Electronic Document and Complete Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    comment    Reject Batch in Expert Index
    Reject Batch in Expert Index

TC-59 Complete Batch in Expert Capture And Release Batch in Review
    [Setup]    Create Test Prerequisite    Data_07
    Comment    Complete Batch in Expert Capture
    Complete The Batch In Expert Capture
    Comment    Post - Search Batch
    ${response}    Search Batches    ${batch_content["Code"]}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Get - Open Batch
    ${response}    Open Batch    ${batchId}    EXIDX    REVIEW
    Validate Response Status Code    ${response}    200
    Comment    Validate Response Status Code    ${response}    200
    Comment    Release Batch
    ${response}    Release Batch    ${batchId}    EXIDX
    Validate Response Status Code    ${response}    200

TC-60 Suspend Batch in Expert Capture and try to opened in Review
    [Setup]    Create Test Prerequisite    Data_08
    Comment    Suspend The Batch In Expert Capture
    Suspend The Batch In Expert Capture
    comment    Get Batch Content Type List
    ${response}    Get Batch Content Type List    EXIDX
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type
    ${response}    Get Batch Content Type    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type Process Steps
    ${response}    Get Batch Content Type Process Steps    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    POST - Get Next Batch with Suspend Batch in Expert Capture
    ${response}    Get Next Batch    ${batchcontent}    EXIDX    ${EXECDIR}\\TestData\\API_TEMPLATES\\Get Next Batch Request Body.txt
    Validate Response Status Code    ${response}    204

TC-61 Delete Batch in Expert Capture and try to Opened in Review
    [Setup]    Create Test Prerequisite    Data_09
    Comment    Delete Batch in Expert Capture
    Delete Batch in Expert Capture
    comment    Get Batch Content Type List
    ${response}    Get Batch Content Type List    EXIDX
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type
    ${response}    Get Batch Content Type    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type Process Steps
    ${response}    Get Batch Content Type Process Steps    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    POST - Validate Deleted Batch in Expert Capture is available in Expert Index
    ${response}    Get Next Batch    ${batchcontent}    EXIDX    ${EXECDIR}\\TestData\\API_TEMPLATES\\Get Next Batch Request Body.txt
    Validate Response Status Code    ${response}    204

TC-62 Validate Batch in Expert Index without Assign User Interface Step
    [Setup]    Create Test Prerequisite    Data_10
    Comment    Import Electronic Document and Complete Batch In Expert Capture
    Import Electronic Document and Complete Batch In Expert Capture
    comment    Get Batch Content Type List
    ${response}    Get Batch Content Type List    EXIDX
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type
    ${response}    Get Batch Content Type    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    Get Batch Content Type Process Steps
    ${response}    Get Batch Content Type Process Steps    ${batchcontent["Code"]}
    Validate Response Status Code    ${response}    200
    comment    POST - Validate Unassigned User Interface Step Batch is available in Expert Index
    ${response}    Get Next Batch    ${batchcontent}    EXIDX    ${EXECDIR}\\TestData\\API_TEMPLATES\\Get Next Batch Request Body.txt
    Validate Response Status Code    ${response}    204
