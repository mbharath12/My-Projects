*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Validate Complete PrimaryId of Enrollees
    [Arguments]    ${primaryid_count}    ${test_pmimaryid}
    FOR    ${key}    IN RANGE    1    ${primaryid_count}+1
        ${value}    Convert To String    ${key}
        ${list.enrollee.primary_ids.new}    Update Dynamic Value    ${list.enrollee.primary_ids}    ${value}
        ${primaryid_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.primary_ids.new}    ${SHORT_WAIT}
        Run Keyword If    '${primaryid_status}'=='False'    Run Keywords    Continue For Loop
        ...    AND    Log    Primary Id is not available
        ${app_primaryId}    AppiumLibrary.Get Text    ${list.enrollee.primary_ids.new}
        ${status}    Run Keyword And Return Status    Should Be Equal As Strings    ${app_primaryId}    ${test_pmimaryid}
        Run Keyword If    ${status}==True    Exit For Loop
    END
    [Return]    ${status}

Validate Device Assigned Status of Enrollees
    [Arguments]    ${deviceid_count}    ${device_assigned_status}
    FOR    ${key}    IN RANGE    1    ${deviceid_count}+1
        ${value}    Convert To String    ${key}
        ${list.enollee.deviceid.new}    Update Dynamic Value    ${list.enollees.deviceid}    ${value}
        ${device_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enollee.deviceid.new}
        Run Keyword If    '${device_status}'=='False'    Run Keywords    Continue For Loop
        ...    AND    Log    Deviec Id is not available
        Run Keyword If    '${device_assigned_status}'=='Assigned'    AppiumLibrary.Element Should Not Contain Text    ${list.enollee.deviceid.new}    Unassigned    Serached results contain assigned enrollees
        Run Keyword If    '${device_assigned_status}'=='Unassigned'    AppiumLibrary.Element Should Contain Text    ${list.enollee.deviceid.new}    Unassigned    Serached results contain unassigned enrollees
    END

Validate FirstName and LastName of Enrollees
    [Arguments]    ${fullname_count}    ${first_name}    ${last_name}
    FOR    ${key}    IN RANGE    1    ${fullname_count}+1
        ${value}    Convert To String    ${key}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}
        Run Keyword If    '${fullname_status}'=='False'    Run Keywords    Continue For Loop
        ...    AND    Log    Enrollee Fullname is not available
        ${full_name}    AppiumLibrary.Get Text    ${list.enrollee.fullname.new}
        ${name}    Remove String    ${full_name}    ,
        ${fullname}    Split String    ${name}    ${SPACE}
        ${app_lastname}    Set Variable    ${fullname}[0]
        ${app_firstname}    Set Variable    ${fullname}[1]
        ${status1}    Run Keyword And Return Status    Should Be Equal As Strings    ${app_firstname}    ${first_name}
        ${status2}    Run Keyword And Return Status    Should Be Equal As Strings    ${app_lastname}    ${last_name}
        Run Keyword If    ${status1}==True and ${status2}==True    Exit For Loop
    END
    [Return]    ${status1}    ${status2}

Validate Searched Results with Partial PrimaryId
    [Arguments]    ${primary_Id}
    FOR    ${key}    IN RANGE    1    20
        sleep    2s
        ${primaryid_count}    Get Matching Xpath Count    ${list.enrollee.primary_id}
        Log    ${primaryid_count}
        Validate Partial PrimaryId of Enrollees    ${primaryid_count}    ${primary_Id}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}    ${SHORT_WAIT}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Validate Enrollee Search fields
    [Arguments]    ${exp_first_name}    ${exp_last_name}    ${exp_primaryid_name}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrollee.search.first_name}    ${LONG_WAIT}    firstname textbox is not displayed after clicking on search icon
    ${act_enrollee_first_name}=    AppiumLibrary.Get Text    ${textbox.enrollee.search.first_name}
    ${act_enrollee_lastt_name}=    AppiumLibrary.Get Text    ${textbox.enrollee.search.last_name}
    ${act_enrollee_primaryid_name}=    AppiumLibrary.Get Text    ${textbox.enrollee.search.primary_id}
    sleep    2s
    Comment    Validate enrollee details
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_first_name}    ${act_enrollee_first_name}    Enrollee First Name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_last_name}    ${act_enrollee_lastt_name}    Enrollee last name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_primaryid_name}    ${act_enrollee_primaryid_name}    Enrollee Primary ID details doesn't match.

Validate Enrollee list contains same First name
    [Arguments]    ${exp_firstname}
    Sleep    2s
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        Validate an Enrollee same Firstname    ${enrollees_count}    ${exp_firstname}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_list.no_more_elements}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Validate Searched Enrollees Details with Assigned Status
    [Arguments]    ${assign_status}
    FOR    ${key}    IN RANGE    1    20
        sleep    2s
        ${deviceid_status_count}    Get Matching Xpath Count    ${list.enollee.deviceid_count}
        Log    ${deviceid_status_count}
        Validate Device Assigned Status of Enrollees    ${deviceid_status_count}    ${assign_status}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}    ${SHORT_WAIT}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Validate Enrollee list contains same Last name
    [Arguments]    ${exp_lastname}
    Sleep    2s
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        Validate an Enrollee same Lastname    ${enrollees_count}    ${exp_lastname}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_list.no_more_elements}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Validate Enrollee list with Last name contains
    [Arguments]    ${exp_lastname}
    Sleep    2s
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        Validate an Enrollee Lastname    ${enrollees_count}    ${exp_lastname}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_list.no_more_elements}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Validate Enrollee list with First name contains
    [Arguments]    ${exp_firstname}
    Sleep    2s
    FOR    ${key}    IN RANGE    1    20
        ${enrollees_count}    Get Matching Xpath Count    ${list.enrollees}
        Log    ${enrollees_count}
        Validate an Enrollee Firstname    ${enrollees_count}    ${exp_firstname}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_list.no_more_elements}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END

Validate an Enrollee Firstname
    [Arguments]    ${enrollees_count}    ${exp_firstname}
    FOR    ${value}    IN RANGE    1    ${enrollees_count}+1
        ${value}    Convert To String    ${value}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}    1s
        Run Keyword If    '${fullname_status}'=='True'    Get Enrollee FullName Text    ${list.enrollee.fullname.new}
        log    ${full_name}
        @{orgslist}=    Split String    ${full_name}    ,
        ${act_firstname}=    Get From list    ${orgslist}    1
        ${act_lastname}=    Get From list    ${orgslist}    0
        Should Contain Any    ${act_firstname}    ${exp_firstname}    ignore_case=True
    END

Validate an Enrollee Lastname
    [Arguments]    ${enrollees_count}    ${exp_lastname}
    FOR    ${value}    IN RANGE    1    ${enrollees_count}+1
        ${value}    Convert To String    ${value}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}    1s
        Run Keyword If    '${fullname_status}'=='True'    Get Enrollee FullName Text    ${list.enrollee.fullname.new}
        log    ${full_name}
        @{orgslist}=    Split String    ${full_name}    ,
        ${act_firstname}=    Get From list    ${orgslist}    1
        ${act_lastname}=    Get From list    ${orgslist}    0
        Should Contain Any    ${act_lastname}    ${exp_lastname}    ignore_case=True
    END

Validate an Enrollee same Firstname
    [Arguments]    ${enrollees_count}    ${exp_firstname}
    FOR    ${value}    IN RANGE    1    ${enrollees_count}+1
        ${value}    Convert To String    ${value}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}    1s
        Run Keyword If    '${fullname_status}'=='True'    Get Enrollee FullName Text    ${list.enrollee.fullname.new}
        log    ${full_name}
        @{orgslist}=    Split String    ${full_name}    ,
        ${act_firstname}=    Get From list    ${orgslist}    1
        ${act_lastname}=    Get From list    ${orgslist}    0
        Run Keyword If    '${act_firstname}'=='${exp_firstname}'    Run Keywords    log    searching same First name is successfull
        ...    AND    Exit For Loop
    END

Validate an Enrollee same Lastname
    [Arguments]    ${enrollees_count}    ${exp_lastname}
    FOR    ${value}    IN RANGE    1    ${enrollees_count}+1
        ${value}    Convert To String    ${value}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}    1s
        Run Keyword If    '${fullname_status}'=='True'    Get Enrollee FullName Text    ${list.enrollee.fullname.new}
        log    ${full_name}
        @{orgslist}=    Split String    ${full_name}    ,
        ${act_firstname}=    Get From list    ${orgslist}    1
        ${act_lastname}=    Get From list    ${orgslist}    0
        Run Keyword If    '${act_lastname}'=='${exp_lastname}'    Run Keywords    log    searching same Last name is successfull
        ...    AND    Exit For Loop
    END

Validate an enrollee with first name, last name, and primary id
    [Arguments]    ${exp_first_name}    ${exp_last_name}    ${exp_primaryid_name}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee_fullname}    ${LONG_WAIT}    firstname textbox is not displayed after clicking on search icon
    ${act_fullname}=    AppiumLibrary.Get Text    ${label.enrollee_fullname}
    @{orgslist}=    Split String    ${act_fullname}    ,
    ${act_firstname}=    Get From list    ${orgslist}    1
    ${act_firstname}=    Remove String    ${act_firstname}    ${SPACE}
    ${act_lastname}=    Get From list    ${orgslist}    0
    ${act_enrollee_primaryid_name}=    AppiumLibrary.Get Text    ${label.enrollee_primaryid}
    sleep    2s
    Comment    Validate enrollee details
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_first_name}    ${act_firstname}    Enrollee First Name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_last_name}    ${act_lastname}    Enrollee last name details doesn't match.
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_primaryid_name}    ${act_enrollee_primaryid_name}    Enrollee Primary ID details doesn't match.

Validate Searched Enrollees with Assigned and First Name Combination
    [Arguments]    ${first_name}
    FOR    ${key}    IN RANGE    1    20
        sleep    2s
        ${fullname_count}    Get Matching Xpath Count    ${list.enrollee.fullname_count}
        Log    ${fullname_count}
        ${status1}    ${status2}    Validate Assigned and First Name Combination    ${fullname_count}    ${first_name}
        Run Keyword If    ${status1}==True and ${status2}==True    Run Keywords    Exit For Loop
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}    ${SHORT_WAIT}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END
    Run Keyword If    ${status1}==True and ${status2}==True    Log    Searched results contains expected firstname and assigned status combination enrollees
    Run Keyword If    ${status1}==False or ${status2}==False    mobile_common.Fail and take screenshot    Searched results does not contains expected firstname and assigned status combination enrollees

Validate Assigned and First Name Combination
    [Arguments]    ${deviceid_count}    ${first_name}
    FOR    ${key}    IN RANGE    1    ${deviceid_count}+1
        ${value}    Convert To String    ${key}
        ${list.enollee.deviceid.new}    Update Dynamic Value    ${list.enollees.deviceid}    ${value}
        ${device_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enollee.deviceid.new}
        ${list.enrollee.fullname.new}    Update Dynamic Value    ${list.enrollee.fullname}    ${value}
        ${fullname_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.fullname.new}
        Run Keyword If    '${device_status}'=='False'    Run Keywords    Continue For Loop
        ...    AND    Log    Deviec Id is not available
        Run Keyword If    '${fullname_status}'=='False'    Run Keywords    Continue For Loop
        ...    AND    Log    FullName is not available
        ${full_name}    AppiumLibrary.Get Text    ${list.enrollee.fullname.new}
        ${name}    Remove String    ${full_name}    ,
        ${fullname}    Split String    ${name}    ${SPACE}
        ${app_firstname}    Set Variable    ${fullname}[1]
        ${status1}    Run Keyword And Return Status    Should Be Equal As Strings    ${app_firstname}    ${first_name}
        ${status2}    Run Keyword And Return Status    AppiumLibrary.Element Should Not Contain Text    ${list.enollee.deviceid.new}    Unassigned
        Run Keyword If    ${status1}==True and ${status2}==True    Exit For Loop
    END
    [Return]    ${status1}    ${status2}

Validate Searched Enrollees with Both Device Assigned status
    FOR    ${key}    IN RANGE    1    20
        sleep    2s
        ${deviceid_status_count}    Get Matching Xpath Count    ${list.enollee.deviceid_count}
        Log    ${deviceid_status_count}
        ${status1}    ${status2}    Validate Device Assigned Status as Both for Enrollees    ${deviceid_status_count}
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}    ${SHORT_WAIT}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END
    Run Keyword If    ${status1}==True or ${status2}==True    Log    Searched enrollees contains Assigned and Unassigned enrolees
    Run Keyword If    ${status1}==False and ${status2}==False    mobile_common.Fail and take screenshot    Searched enrollees does not contains Assigned and Unassigned enrolees

Validate Partial PrimaryId of Enrollees
    [Arguments]    ${primaryid_count}    ${pmimary_id}
    FOR    ${key}    IN RANGE    1    ${primaryid_count}+1
        ${value}    Convert To String    ${key}
        ${list.enrollee.primary_ids.new}    Update Dynamic Value    ${list.enrollee.primary_ids}    ${value}
        ${primaryid_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enrollee.primary_ids.new}
        Run Keyword If    '${primaryid_status}'=='True'    Element Should Contain Text    ${list.enrollee.primary_ids.new}    ${pmimary_id}    Primary id is not visible in searched results
    END

Validate Searched Enrollees with Complete PrimaryId
    [Arguments]    ${primaryId}
    FOR    ${key}    IN RANGE    1    20
        sleep    2s
        ${primaryid_count}    Get Matching Xpath Count    ${list.enrollee.primaryid_count}
        Log    ${primaryid_count}
        ${status1}    Validate Complete PrimaryId of Enrollees    ${primaryid_count}    ${primaryId}
        Run Keyword If    ${status1}==True    Exit For Loop
        ${status2}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}    ${SHORT_WAIT}
        Exit For Loop If    ${status2}==True
        AppiumExtendedLibrary.swipe down    1
    END
    Run Keyword If    ${status1}==True    Log    Searched Enrollees contains expected \ complete primaryid
    Run Keyword If    ${status1}==False    mobile_common.Fail and take screenshot    Searched Enrollees does not contains expected complete primaryid

Validate Searched Enrollees with First and Last name
    [Arguments]    ${first_name}    ${last_name}
    FOR    ${key}    IN RANGE    1    20
        sleep    2s
        ${fullname_count}    Get Matching Xpath Count    ${list.enrollee.fullname_count}
        Log    ${fullname_count}
        ${status1}    ${status2}    Validate FirstName and LastName of Enrollees    ${fullname_count}    ${first_name}    ${last_name}
        Run Keyword If    ${status1}==True and ${status2}==True    Exit For Loop
        ${status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${label.events_list.no_more_elements}    ${SHORT_WAIT}
        Exit For Loop If    ${status}==True
        AppiumExtendedLibrary.swipe down    1
    END
    Run Keyword If    ${status1}==True and ${status2}==True    Log    Searched Enrollees contains expected fullname
    Run Keyword If    ${status1}==False or ${status2}==False    mobile_common.Fail and take screenshot    Searched Enrollees does not contains expected fullname

Validate Device Assigned Status as Both for Enrollees
    [Arguments]    ${deviceid_count}
    FOR    ${key}    IN RANGE    1    ${deviceid_count}+1
        ${value}    Convert To String    ${key}
        ${list.enollee.deviceid.new}    Update Dynamic Value    ${list.enollees.deviceid}    ${value}
        ${device_status}    Run Keyword And Return Status    AppiumLibrary.Wait Until Element Is Visible    ${list.enollee.deviceid.new}
        Run Keyword If    '${device_status}'=='False'    Run Keywords    Continue For Loop
        ...    AND    Log    Deviec status \ is not available
        ${status1}    Run Keyword And Return Status    AppiumLibrary.Element Should Not Contain Text    ${list.enollee.deviceid.new}    Unassigned
        ${status2}    Run Keyword And Return Status    AppiumLibrary.Element Should Contain Text    ${list.enollee.deviceid.new}    Unassigned
    END
    [Return]    ${status1}    ${status2}
