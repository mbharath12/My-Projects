*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Validate Event Confirmed
    [Arguments]    ${violation_description}    ${enrollee_fullname}
    [Documentation]    Keyword validates the event is confirmed by using (Violation description, Enrollee full name) returned from Database.
    ...
    ...
    ...    Exapmle:
    ...    web_events.Validate Event Confirmed \ \ \ \ ${violation_description} \ ${enrollee_fullname}
    ...
    ...    web_events.Validate Event Confirmed \ \ \ \ Message Gap \ \ CAO, NEIL
    ${web.button.events.search.filter.event.new}    Update Dynamic Values    ${web.button.events.search.filter.event}    ${violation_description}    ${enrollee_fullname}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.events.search.filter.event.new}    ${SHORT_WAIT}    Event with violation description= ${violation_description}, Fullname=${enrollee_fullname} is not visible after waiting ${SHORT_WAIT}
    SeleniumLibrary.Click Element    ${web.button.events.search.filter.event.new}
    ${web.label.events.search.filter.event.is_confirmed.new}    Update Dynamic Values    ${web.label.events.search.filter.event.is_confirmed}    ${violation_description}    ${enrollee_fullname}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.label.events.search.filter.event.is_confirmed.new}    ${SHORT_WAIT}    Event with violation description= ${violation_description}, Fullname=${enrollee_fullname}, IsConfirmed= Yes is not visible after waiting ${SHORT_WAIT}

Search Event
    [Arguments]    ${enrollee_full_name}
    [Documentation]    Keyword used to search a desired Event from the application using enrollee full name ,IsOpen and IsConfirmed dropdowns.
    ...
    ...    Examples:
    ...    web_events.Search Event \ \ \ \ ${data}[2], ${data}[3]
    ...
    ...    web_events.Search Event \ \ \ \ CAO, NEIL
    SeleniumLibrary.Wait Until Element Is Visible    ${web.button.events.search}    ${LONG_WAIT}    Search button is not visible after waiting ${LONG_WAIT}
    SeleniumLibrary.Click Element    ${web.button.events.search}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.checkbox.events.search.select_all}    ${MEDIUM_WAIT}    Search all check box is not visible after waiting ${MEDIUM_WAIT}
    ${status}    Run Keyword And Return Status    SeleniumLibrary.Checkbox Should Be Selected    ${web.checkbox.events.search.select_all}
    Run Keyword If    '${status}'=='False'    SeleniumLibrary.Select Checkbox    ${web.checkbox.events.search.select_all}
    ${event_types_count}    Get Element Count    ${web.checkbox.events.search.event_types}
    FOR    ${count}    IN RANGE    1    ${event_types_count}+1
        ${count1}    Convert To String    ${count}
        ${web.checkbox.events.search.event_type.new}    Update Dynamic Value    ${web.checkbox.events.search.event_type}    ${count1}
        SeleniumLibrary.Scroll Element Into View    ${web.checkbox.events.search.event_type.new}
        SeleniumLibrary.Element Should Be Visible    ${web.checkbox.events.search.event_type.new}    Event type check box is not visible
        ${status}    Run Keyword And Return Status    SeleniumLibrary.Checkbox Should Be Selected    ${web.checkbox.events.search.event_type.new}
        Run Keyword If    '${status}'=='False'    SeleniumLibrary.Select Checkbox    ${web.checkbox.events.search.event_type.new}
    END
    SeleniumLibrary.Element Should Be Visible    ${web.textbox.events.search.enrollee}    Enrollee search textbox is not visible
    SeleniumLibrary.Input Text    ${web.textbox.events.search.enrollee}    ${enrollee_full_name}
    SeleniumLibrary.Element Should Be Visible    ${web.dropdown.events.search.isopen}    IsOpen dropdown is not visible
    SeleniumLibrary.Select From List By Label    ${web.dropdown.events.search.isopen}    Yes
    SeleniumLibrary.Element Should Be Visible    ${web.dropdown.events.search.isconfirmed}    IsConfirmed dropdown is not visible
    SeleniumLibrary.Select From List By Label    ${web.dropdown.events.search.isconfirmed}    Yes
    SeleniumLibrary.Element Should Be Visible    ${web.button.events.search.filter}    Filter button is not visible
    SeleniumLibrary.Click Element    ${web.button.events.search.filter}
    SeleniumLibrary.Wait Until Element Is Visible    ${web.label.events.search.filter.eventsview}    ${MEDIUM_WAIT}    EventsView is not visible after waiting ${MEDIUM_WAIT}
    sleep    2s
