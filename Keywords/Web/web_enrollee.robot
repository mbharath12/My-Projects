*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Validate enrollee details
    [Arguments]    ${first_name}    ${last_name}    ${organization}    ${primaryId}    ${risk_level}
    ${labels.searched_enrollee.new}    mobile_common.Update Dynamic Value    ${labels.searched_enrollee}    ${first_name}
    FOR    ${value}    IN RANGE    1    10
        SeleniumLibrary.Click Element    ${labels.searched_enrollee.new}
        ${status}    Run Keyword And Return Status    SeleniumLibrary.Element Text Should Be    ${labels.searched_enrollee.fullname}    ${last_name}, ${first_name}    FirstName and LastName of an enrollee is not displayed
        Exit For Loop If    '${status}'=='True'
        sleep    10s
    END
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    Enrollee details in right side pane is not refreshed
    SeleniumLibrary.Element Text Should Be    ${labels.searched_enrollee.fullname}    ${last_name}, ${first_name}
    SeleniumLibrary.Element Text Should Be    ${labels.searched_enrollee.organization}    ${organization}
    SeleniumLibrary.Element Text Should Be    ${labels.searched_enrollee.primaryId}    ${primaryId}
    SeleniumLibrary.Element Text Should Be    ${labels.searched_enrollee.risklevel}    ${risk_level}

Search enrollee
    [Arguments]    ${first_name}    ${primary_id}    ${is_device_assign}
    web_enrollee.Reload the page
    comment    Navigate to Enrollees Page
    web_enrollee.Select Navigation Menu    Enrollees
    SeleniumLibrary.Wait Until Element Is Visible    ${button.web.enrollee.enrollee_search}    ${MEDIUM_WAIT}    Search enrollee is not displayed
    SeleniumLibrary.Click Element    ${button.web.enrollee.enrollee_search}
    SeleniumLibrary.Wait Until Element Is Visible    ${textbox.enrollee_search_page}    ${SHORT_WAIT}    Search Enrollee page details should be displayed
    SeleniumLibrary.Element Should Be Visible    ${textbox.enrollee_search.name}    FirstName textbox is not displayed
    SeleniumLibrary.Input Text    ${textbox.enrollee_search.name}    ${first_name}
    comment    wait for primaryid textbox
    SeleniumLibrary.Element Should Be Visible    ${textbox.enrollee_search.primaryid}    PrimaryId textbox is not displayed
    SeleniumLibrary.Input Text    ${textbox.enrollee_search.primaryid}    ${primary_id}
    SeleniumLibrary.Element Should Be Visible    ${web.dropdown.enrollee.search.isassignd}    IsAssigned dropdown is not visible
    SeleniumLibrary.Select From List By Label    ${web.dropdown.enrollee.search.isassignd}    ${is_device_assign}
    comment    click on find button
    SeleniumLibrary.Element Should Be Visible    ${button.web.enrollee.find}    Find button is not displayed
    SeleniumLibrary.Click Element    ${button.web.enrollee.find}

Select Navigation Menu
    [Arguments]    ${tab_name}
    ${web.button.dashboard.tabs.new}    Update Dynamic Value    ${web.button.dashboard.tabs}    ${tab_name}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.dashboard.tabs.new}    ${LONG_WAIT}    ${tab_name} Tab is not visible after waiting ${LONG_WAIT}
    SeleniumLibrary.Click Element    ${web.button.dashboard.tabs.new}

Reload the page
    Reload Page
    veritracks_common.Validate VeriTracks dashboard page

Validate Assign device
    [Arguments]    ${last_name}    ${first_name}    ${assigned_device_text}
    ${labels.searched_enrollee.assigned_device.new}    mobile_common.Update Dynamic Value    ${labels.searched_enrollee.assigned_device}    ${last_name}, ${first_name}
    SeleniumLibrary.Wait Until Element Is Visible    ${labels.searched_enrollee.assigned_device.new}    ${LONG_WAIT}
    ${device_text}    SeleniumLibrary.Get Text    ${labels.searched_enrollee.assigned_device.new}
    Should Be Equal    ${device_text}    ${assigned_device_text}    The assigned device is not same in web application.

Search and Wait for enrollee to display
    [Arguments]    ${first_name}    ${primaryId}    ${is_device_assign}
    [Timeout]
    ${labels.searched_enrollee.new}    mobile_common.Update Dynamic Value    ${labels.searched_enrollee}    ${first_name}
    FOR    ${value}    IN RANGE    1    3
        web_enrollee.Search enrollee    ${first_name}    ${primaryId}    ${is_device_assign}
        ${status}    Run Keyword And Return Status    SeleniumLibrary.Wait Until Element Is Visible    ${labels.searched_enrollee.new}    ${MEDIUM_WAIT}
        Exit For Loop If    '${status}'=='True'
        sleep    10sec
        Reload the page
        sleep    2sec
        SeleniumLibrary.Wait Until Element Is Visible    ${web.button.dashboard}    ${MEDIUM_WAIT}    Dashboard page is not displayed.
        SeleniumLibrary.Click Element    ${web.button.dashboard}
    END
    Run Keyword If    '${status}'=='True'    SeleniumLibrary.Click Element    ${labels.searched_enrollee.new}
    Run Keyword If    ${status} == False    mobile_common.Fail and take screenshot    Newly Created enrollee ${first_name} is not displayed in Web Application

Validate Unassigned Enrollee
    [Arguments]    ${enrollee_name}    ${primary_id}
    [Documentation]    Validate the enrollee is unassigned. Takes enrollee name and primaryid as arguments
    ...
    ...    Exapmle:
    ...
    ...    web_enrollee.Validate Unassined Enrollee Neil, Cao 5648765
    ${web.label.enrollee.searched_enrollee.unassigned.new}    mobile_common.Update Dynamic Values    ${web.label.enrollee.searched_enrollee.unassigned}    ${enrollee_name}    ${primary_id}
    AppiumLibrary.Wait Until Element Is Visible    ${web.label.enrollee.searched_enrollee.unassigned.new}    ${MEDIUM_WAIT}    Enrollee is not visible

Find Enrollee Events
    [Arguments]    ${isopen}    ${isclosed}    ${hasnotes}    ${event_name}
    ${web.checkbox.enrollee.event.new}    Update Dynamic Value    ${web.checkbox.enrollee.event}    ${event_name}
    ${status}    Run Keyword And Return Status    SeleniumLibrary.Checkbox Should Be Selected    ${web.checkbox.enrollee.event.new}
    Run Keyword If    '${status}'=='False'    SeleniumLibrary.Select Checkbox    ${web.checkbox.enrollee.event.new}
    SeleniumLibrary.Select From List By Label    ${web.dropdown.enrollee.event.search.isopen}    ${isopen}
    SeleniumLibrary.Select From List By Label    ${web.dropdown.enrollee.event.search.isconfirmed}    ${isclosed}
    SeleniumLibrary.Select From List By Label    ${web.dropdown.enrollee.event.search.has_notes}    ${hasnotes}
    AppiumLibrary.Click Button    ${web.button.enrollee.find_events}
    AppiumLibrary.Wait Until Element Is Visible    ${web.label.enrollee.event.column_id}    ${SHORT_WAIT}    Events table is not displayed

Validate Enrollee Closed Event
    [Arguments]    ${event_id}
    ${web.label.enrollee.event.id.new}    Update Dynamic Value    ${web.label.enrollee.event.id}    ${event_id}
    SeleniumLibrary.Element Should Be Visible    ${web.label.enrollee.event.id.new}    Closed Event ID is not visible

Select Searched Enrollee
    [Arguments]    ${full_name}
    ${labels.searched_enrollee.new}    mobile_common.Update Dynamic Value    ${labels.searched_enrollee}    ${full_name}
    SeleniumLibrary.Wait Until Element Is Visible    ${labels.searched_enrollee.new}    ${SHORT_WAIT}    Searched enrollee is not visible
    SeleniumLibrary.Click Button    ${labels.searched_enrollee.new}

Select Enrollee's Navigation Tab
    [Arguments]    ${enrollee's_tab}
    ${web.button.enrollee.tab.new}    Update Dynamic Value    ${web.button.enrollee.tab}    ${enrollee's_tab}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.enrollee.tab.new}    ${SHORT_WAIT}    Enrollee's' expected tab is not visible
    SeleniumLibrary.Click Element    ${web.button.enrollee.tab.new}
