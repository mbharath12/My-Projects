*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Get Dashboard Enrollee Count from App
    AppiumLibrary.Wait Until Element Is Visible    ${label.dashboard.enrollees.assigned_count}    ${SHORT_WAIT}    Assigned Enrolles count is not visible on dashboard
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.enrollees.assigned_count}
    ...    ELSE    Get Label Text    ${label.dashboard.enrollees.assigned_count}
    ${assigned_enrolles_count}    Remove String    ${text}    Assigned
    ${assigned_enrolles_count}    Remove String    ${assigned_enrolles_count}    ${SPACE}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.enrollees.unassigned_count}
    ...    ELSE    Get Label Text    ${label.dashboard.enrollees.unassigned_count}
    ${unassigned_enrolles_count}    Remove String    ${text}    Unassigned
    ${unassigned_enrolles_count}    Remove String    ${unassigned_enrolles_count}    ${SPACE}
    ${app_enrollee_dashboard_count}=    Create Dictionary    ASSIGNEDCOUNT=${assigned_enrolles_count}    UNASSIGNEDCOUNT=${unassigned_enrolles_count}
    [Return]    ${app_enrollee_dashboard_count}

Get Dashboard Enrollee Count from Database
    [Arguments]    ${organization_name}
    ${enrollee_assigned_count}=    CustomLibrary.get_dashboard_enrollee_assigned_count    ${organization_name}
    Log    ${enrollee_assigned_count}[COUNT]
    ${enrollee_unassigned_count}=    CustomLibrary.get_dashboard_enrollee_unassigned_count    ${organization_name}
    Log    ${enrollee_unassigned_count}[COUNT]
    ${database_enrollee_dashboard_count}=    Create Dictionary    ASSIGNEDCOUNT=${enrollee_assigned_count}[COUNT]    UNASSIGNEDCOUNT=${enrollee_unassigned_count}[COUNT]
    [Return]    ${database_enrollee_dashboard_count}

Get Dashboard Events Count from App
    [Documentation]    EXCLUSIONEVENTSCOUNT=${exclusion_events_count} MASTERTAMPEREVENTSCOUNT=${mastertamper_events_count}
    AppiumLibrary.Wait Until Element Is Visible    ${label.dashboard.open_events_count}    ${SHORT_WAIT}    Open Events count is not visible on dashboard
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.open_events_count}
    ...    ELSE    Get Label Text    ${label.dashboard.open_events_count}
    ${open_events_count}    Remove String    ${text}    Open
    ${open_events_count}    Remove String    ${open_events_count}    ${SPACE}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.events.inclusion_count}
    ...    ELSE    Get Label Text    ${label.dashboard.events.inclusion_count}
    ${inclusion_events_count}    Remove String    ${text}    Inclusion
    ${inclusion_events_count}    Remove String    ${inclusion_events_count}    ${SPACE}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.events.exclusion_count}
    ...    ELSE    Get Label Text    ${label.dashboard.events.exclusion_count}
    ${exclusion_events_count}    Remove String    ${text}    Exclusion
    ${exclusion_events_count}    Remove String    ${exclusion_events_count}    ${SPACE}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.events.mastertamper_count}
    ...    ELSE    Get Label Text    ${label.dashboard.events.mastertamper_count}
    ${mastertamper_events_count}    Remove String    ${text}    Master Tamper
    ${mastertamper_events_count}    Remove String    ${mastertamper_events_count}    ${SPACE}
    ${app_events_dashboard_count}    Create Dictionary    OPENEVENTSCOUNT=${open_events_count}    INCLUSIONEVENTSCOUNT=${inclusion_events_count}
    [Return]    ${app_events_dashboard_count}

Get Dashboard Events Count from Database
    [Arguments]    ${organization_name}
    ${events_openevents_count}=    CustomLibrary.Get Dashboard Events Openevents Count    ${organization_name}
    Log    ${events_openevents_count}[COUNT]
    ${events_inclusionevents_count}=    CustomLibrary.Get Dashboard Events Inclusionevents Count    ${organization_name}
    Log    ${events_inclusionevents_count}[COUNT]
    ${events_exclusionevents_count}=    CustomLibrary.Get Dashboard Events Exclusionevents Count    ${organization_name}
    Log    ${events_exclusionevents_count}[COUNT]
    ${events_mastertamperevents_count}=    CustomLibrary.Get Dashboard Events Mastertamperevents Count    ${organization_name}
    Log    ${events_mastertamperevents_count}[COUNT]
    ${database_events_dashboard_count}    Create Dictionary    OPENEVENTSCOUNT=${events_openevents_count}[COUNT]    INCLUSIONEVENTSCOUNT=${events_inclusionevents_count}[COUNT]    EXCLUSIONEVENTSCOUNT=${events_exclusionevents_count}[COUNT]    MASTERTAMPEREVENTSCOUNT=${events_mastertamperevents_count}[COUNT]
    [Return]    ${database_events_dashboard_count}

Get Dashboard Inventory Count from App
    AppiumLibrary.Wait Until Element Is Visible    ${label.dashboard.inventory.shelf_rate_count}    ${SHORT_WAIT}    Shelf rate count is not visible on dashboard
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.inventory.shelf_rate_count}
    ...    ELSE    Get Label Text    ${label.dashboard.inventory.shelf_rate_count}
    ${shelfrate_count}    Remove String    ${text}    Shelf Rate
    ${shelfrate_count}    Remove String    ${shelfrate_count}    ${SPACE}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.inventory.assigned_count}
    ...    ELSE    Get Label Text    ${label.dashboard.inventory.assigned_count}
    ${assigned_inventory_count}    Remove String    ${text}    Assigned
    ${assigned_inventory_count}    Remove String    ${assigned_inventory_count}    ${SPACE}
    Run Keyword If    '${PLATFORM_NAME}'=='Android'    Get Static Text    ${label.dashboard.inventory.unassigned_count}
    ...    ELSE    Get Label Text    ${label.dashboard.inventory.unassigned_count}
    ${unassigned_inventory_count}    AppiumLibrary.Get Text    ${text}
    ${unassigned_inventory_count}    Remove String    ${unassigned_inventory_count}    Unassigned
    ${unassigned_inventory_count}    Remove String    ${unassigned_inventory_count}    ${SPACE}
    ${app_inventory_dashboard_count}    Create Dictionary    SHELFRATECOUNT=${shelfrate_count}    ASSIGNEDCOUNT=${assigned_inventory_count}    UNASSIGNEDCOUNT=${unassigned_inventory_count}
    [Return]    ${app_inventory_dashboard_count}

Get Dashboard Inventory Count from Database
    [Arguments]    ${organization_name}
    ${inventory_shelfrate_count}=    CustomLibrary.Get Dashboard Inventory Shelfrate Count    ${organization_name}
    Log    ${inventory_shelfrate_count}=[COUNT]
    ${inventory_assigned_count}=    CustomLibrary.Get Dashboard Inventory Assigned Count    ${organization_name}
    Log    ${inventory_assigned_count}[COUNT]
    ${inventory_unassigned_count}=    CustomLibrary.Get Dashboard Inventory Unassigned Count    ${organization_name}
    Log    ${inventory_unassigned_count}[COUNT]
    ${database_inventory_dashboard_count}    Create Dictionary    SHELFRATECOUNT=${inventory_shelfrate_count}[COUNT]    ASSIGNEDCOUNT=${inventory_assigned_count}[COUNT]    UNASSIGNEDCOUNT=${inventory_unassigned_count}[COUNT]
    [Return]    ${database_inventory_dashboard_count}

Validate Enrollees Count in Dashboard
    [Arguments]    ${organisation_name}
    Comment    Get Dashboard Enrollee Count from Database
    ${database_data}    Get Dashboard Enrollee Count from Database    ${organisation_name}
    Comment    Get Dashboard Enrollee Count from App
    ${app_data}    Get Dashboard Enrollee Count from App
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[ASSIGNEDCOUNT]    ${database_data}[ASSIGNEDCOUNT]    app assigned enrollee count and database assigned enrollee count are not matching
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[UNASSIGNEDCOUNT]    ${database_data}[UNASSIGNEDCOUNT]    app unassigned enrollee count and database unassigned enrollee count are not matching

Validate Events Count in Dashboard
    [Arguments]    ${organization_name}
    Comment    Get Dashboard Events Count from Database
    ${database_data}    Get Dashboard Events Count from Database    ${organization_name}
    Comment    Get Dashboard Events Count from App
    ${app_data}    Get Dashboard Events Count from App
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[OPENEVENTSCOUNT]    ${database_data}[OPENEVENTSCOUNT]    app openevents count and database openevents count are not matching
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[INCLUSIONEVENTSCOUNT]    ${database_data}[INCLUSIONEVENTSCOUNT]    app inclusion events count and database inclusion events count are not matching
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[EXCLUSIONEVENTSCOUNT]    ${database_data}[EXCLUSIONEVENTSCOUNT]    app exclusion events count and database exclusion events count are not matching
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[MASTERTAMPEREVENTSCOUNT]    ${database_data}[MASTERTAMPEREVENTSCOUNT]    app master tamper events count and database master tamper events count are not matching

Validate Inventory Count in Dashboard
    [Arguments]    ${organization_name}
    Comment    Get Dashboard Inventory Count from Database
    ${database_data}    Get Dashboard Inventory Count from Database    ${organization_name}
    Comment    Get Dashboard Inventory Count from App
    ${app_data}    Get Dashboard Inventory Count from App
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[SHELFRATECOUNT]    ${database_data}[SHELFRATECOUNT]    app shelfrate count and database shelfrate count are not matching
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[ASSIGNEDCOUNT]    ${database_data}[ASSIGNEDCOUNT]    app assigned inventory count and database assigned inventory count are not matching
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${app_data}[UNASSIGNEDCOUNT]    ${database_data}[UNASSIGNEDCOUNT]    app unassigned inventory count and database unassigned inventory count are not matching

Get Label Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Element Attribute    ${locator}    label
    Set Global Variable    ${text}    ${value}
    Log    ${text}

Get Static Text
    [Arguments]    ${locator}
    ${value}    AppiumLibrary.Get Text    ${locator}
    Set Global Variable    ${text}    ${value}
    Log    ${text}

Validate Enrollee Count in Dashboard after changing Organization
    [Arguments]    ${before_changing_org_app_enrollee_data}
    Comment    Get Dashboard Enrollee Count from App
    ${after _changing_app_data}    Get Dashboard Enrollee Count from App
    Run Keyword If    ${after _changing_app_data}[ASSIGNEDCOUNT]!=${before_changing_org_app_enrollee_data}[ASSIGNEDCOUNT]    log    app assigned enrollee count before change org and after changing Org assigned enrollee count are changed
    ...    ELSE    log    There are no new enrollee in the selected organisation
    Run Keyword If    ${after _changing_app_data}[UNASSIGNEDCOUNT]!=${before_changing_org_app_enrollee_data}[UNASSIGNEDCOUNT]    log    app unassigned enrollee count before change org and after changing Org unassigned enrollee count are changed
    ...    ELSE    log    There are no new enrollee in the selected organisation

Validate Events Count in Dashboard after changing Organization
    [Arguments]    ${before_changing_org_app_events_data}
    Comment    Get Dashboard Events Count from App
    ${app_data}    Get Dashboard Events Count from App
    Run Keyword If    ${app_data}[OPENEVENTSCOUNT]!=${before_changing_org_app_events_data}[OPENEVENTSCOUNT]    log    app openevents count before change org and after changing Org openevents count are changed
    ...    ELSE    log    There are no new events in the selected organisation
    Run Keyword If    ${app_data}[INCLUSIONEVENTSCOUNT]!=${before_changing_org_app_events_data}[INCLUSIONEVENTSCOUNT]    log    app inclusion events count before change org and after changing Org inclusion events count are changed
    ...    ELSE    log    There are no new events in the selected organisation
    Run Keyword If    ${app_data}[EXCLUSIONEVENTSCOUNT]!=${before_changing_org_app_events_data}[EXCLUSIONEVENTSCOUNT]    log    app exclusion events count before change org and after changing Org exclusion events count are changed
    ...    ELSE    log    There are no new events in the selected organisation
    Run Keyword If    ${app_data}[MASTERTAMPEREVENTSCOUNT]!=${before_changing_org_app_events_data}[MASTERTAMPEREVENTSCOUNT]    log    app master tamper events count before change org and after changing Org master tamper events count are changed
    ...    ELSE    log    There are no new events in the selected organisation

Validate Inventory Count in Dashboard after changing Organization
    [Arguments]    ${before_changing_org_app_inventory_data}
    Comment    Get Dashboard Inventory Count from App
    ${app_data}    Get Dashboard Inventory Count from App
    Run Keyword If    ${app_data}[SHELFRATECOUNT]!=${before_changing_org_app_inventory_data}[SHELFRATECOUNT]    log    app shelfrate count before change org and after changing Org shelfrate count are changed
    ...    ELSE    log    There are no new inventories in the selected organisation
    Run Keyword If    ${app_data}[ASSIGNEDCOUNT]!=${before_changing_org_app_inventory_data}[ASSIGNEDCOUNT]    log    app assigned inventory count before change org and after changing Org assigned inventory count are changed
    ...    ELSE    log    There are no new inventories in the selected organisation
    Run Keyword If    ${app_data}[UNASSIGNEDCOUNT]!=${before_changing_org_app_inventory_data}[UNASSIGNEDCOUNT]    log    app unassigned inventory count before change org and after changing Org unassigned inventory count are changed
    ...    ELSE    log    There are no new inventories in the selected organisation
