*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Get Message Details
    [Arguments]    ${message}
    ${label.enrollee.profile.message.new}    Update Dynamic Value    ${label.enrollee.profile.message}    ${message}
    FOR    ${value}    IN RANGE    1    20
        AppiumExtendedLibrary.Swipe Up To Element    ${label.enrollee.profile.message.new}
        ${status1}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${label.enrollee.profile.message.new}
        Exit For Loop If    ${status1}==True
        ${status2}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${button.enrollee.message.previous_messages}
        Run Keyword If    ${status2}==True    AppiumLibrary.Click Element    ${button.enrollee.message.previous_messages}
    END
    ${label.enrollee.message.checkmark_1.new}    Update Dynamic Value    ${label.enrollee.message.checkmark_1}    ${message}
    ${checkmark_icon1}    AppiumLibrary.Get Text    ${label.enrollee.message.checkmark_1.new}
    ${label.enrollee.message.checkmark_2.new}    Update Dynamic Value    ${label.enrollee.message.checkmark_2}    ${message}
    ${checkmark_icon2}    AppiumLibrary.Get Text    ${label.enrollee.message.checkmark_2.new}
    [Return]    ${checkmark_icon1}    ${checkmark_icon2}

Validate Enrollee Sent Message Source and Timestamp
    [Arguments]    ${notificationDate}    ${message}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrolle.profile.chat}    ${MEDIUM_WAIT}    Message textbox is not visible.
    ${notificationDate}    Convert To String    ${notificationDate}
    ${converted_date_ and_time}    mobile_messaging.Get Date Time In Given TimeZone    ${notificationDate}    UTC    Asia/Kolkata
    ${converted_date_ and_time}    Convert To String    ${converted_date_ and_time}
    ${database_date}    Change Date Time format    ${converted_date_ and_time}
    ${date_ and_time}    String.Split String    ${database_date}    |
    ${time}    Set Variable    ${date_ and_time}[1]
    ${time}    Split String    ${time}    ${SPACE}
    ${meredian}    Set Variable    ${time}[1]
    ${hour_minutes}    Split String    ${time}[0]    :
    ${minutes}    Set Variable    ${hour_minutes}[1]
    ${hour}    Convert To Integer    ${hour_minutes}[0]
    ${database_time}    Set Variable    ${hour}:${minutes} ${meredian}
    ${label.enrolee.message.name_and_time_stamp.new}    Update Dynamic Values    ${label.enrollee.message.name_and_time_stamp}    ${message}    ${database_time}
    ${status1}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${label.enrolee.message.name_and_time_stamp.new}
    Run Keyword If    ${status1}==True    Log    Expected enrollee message is visible in chat section.
    ...    ELSE    mobile_common.Fail and take screenshot    Expected message is not visible in chat section.

Validate Sent message Check Mark Icon
    [Arguments]    ${message}    ${app_checkmark_icon1}    ${app_checkmark_icon2}    ${test_checkmark_icon}
    ${label.enrollee.message.checkmark_2.new}    Update Dynamic Value    ${label.enrollee.message.checkmark_2}    ${message}
    AppiumLibrary.Wait Until Element Is Visible    ${label.enrollee.message.checkmark_2.new}    ${SHORT_WAIT}
    Should Be Equal As Strings    ${app_checkmark_icon1}    ${test_checkmark_icon}    First check mark icon is not visible
    Should Be Equal As Strings    ${app_checkmark_icon2}    ${test_checkmark_icon}    Second check mark icon is not visible

Validate Historical Messages
    [Arguments]    ${message}
    ${label.enrollee.profile.message.new}    Update Dynamic Value    ${label.enrollee.profile.message}    ${message}
    FOR    ${value}    IN RANGE    1    20
        AppiumExtendedLibrary.Swipe Up To Element    ${label.enrollee.profile.message.new}
        ${status1}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${label.enrollee.profile.message.new}
        Exit For Loop If    ${status1}==True
        ${status2}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${button.enrollee.message.previous_messages}
        Run Keyword If    ${status2}==True    AppiumLibrary.Click Element    ${button.enrollee.message.previous_messages}
    END
    Run Keyword If    ${status1}==False    Log    Historical message not visible

Validate Message Date
    [Arguments]    ${notificationDate}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrolle.profile.chat}    ${MEDIUM_WAIT}    Message textbox is not visible.
    ${notificationDate}    Convert To String    ${notificationDate}
    ${converted_date_ and_time}    mobile_Messaging.Get Date Time In Given TimeZone    ${notificationDate}    UTC    Asia/Kolkata
    ${converted_date_ and_time}    Convert To String    ${converted_date_ and_time}
    ${database_date}    Change Date Time format    ${converted_date_ and_time}
    ${date_ and_time}    String.Split String    ${database_date}    |
    ${date}    Set Variable    ${date_ and_time}[0]
    ${time}    Set Variable    ${date_ and_time}[1]
    ${databasedate}    String.Split String    ${date}    ${SPACE}
    ${month}    Convert To Integer    ${databasedate}[1]
    ${database_date}    Set Variable    ${databasedate}[0] ${month}, ${databasedate}[2]
    ${label.enrollee.profile.message_date.new}    Update Dynamic Value    ${label.enrollee.profile.message_date}    ${database_date}
    FOR    ${value}    IN RANGE    1    20
        sleep    2s
        AppiumExtendedLibrary.Swipe Up To Element    ${label.enrollee.profile.message_date.new}
        ${status1}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${label.enrollee.profile.message_date.new}
        Run Keyword If    ${status1}==True    Run Keywords    Log    Expected date is visible in chat section.
        ...    AND    Exit For Loop
        Run Keyword If    ${status1}==False    mobile_common.Fail and take screenshot    Expected date is not visible in chat section.
        ${status2}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${button.enrollee.message.previous_messages}
        Run Keyword If    ${status2}==True    AppiumLibrary.Click Element    ${button.enrollee.message.previous_messages}
    END

Get Date Object For Given String
    [Arguments]    ${date_time_str}
    ${date_time_obj}=    CustomLibrary.Convert String To DateObj2    ${date_time_str}
    [Return]    ${date_time_obj}

Get Date Time In Given TimeZone
    [Arguments]    ${date_time_str}    ${current_time_zone}    ${convert_time_zone}
    ${date_time_obj}    CustomLibrary.convert Date Time To Given Timezone2    ${date_time_str}    ${current_time_zone}    ${convert_time_zone}
    [Return]    ${date_time_obj}

Change Date Time format
    [Arguments]    ${date_ and_time}
    ${database_date}    CustomLibrary.convert date time format    ${date_ and_time}
    [Return]    ${database_date}

Validate Agent Sent Message Source and Timestamp
    [Arguments]    ${notificationDate}    ${message}
    AppiumLibrary.Wait Until Element Is Visible    ${textbox.enrolle.profile.chat}    ${MEDIUM_WAIT}    Message textbox is not visible.
    ${notificationDate}    Convert To String    ${notificationDate}
    ${converted_date_ and_time}    Get Date Time In Given TimeZone    ${notificationDate}    UTC    Asia/Kolkata
    ${converted_date_ and_time}    Convert To String    ${converted_date_ and_time}
    ${database_date}    Change Date Time format    ${converted_date_ and_time}
    ${date_ and_time}    String.Split String    ${database_date}    |
    ${time}    Set Variable    ${date_ and_time}[1]
    ${time}    Split String    ${time}    ${SPACE}
    ${meredian}    Set Variable    ${time}[1]
    ${hour_minutes}    Split String    ${time}[0]    :
    ${minutes}    Set Variable    ${hour_minutes}[1]
    ${hour}    Convert To Integer    ${hour_minutes}[0]
    ${database_time}    Set Variable    ${hour}:${minutes} ${meredian}
    ${label.agent.message.name_and_time_stamp.new}    Update Dynamic Values    ${label.agent.message.name_and_time_stamp}    ${message}    ${database_time}
    ${status1}    Run Keyword And Return Status    AppiumLibrary.Element Should Be Visible    ${label.agent.message.name_and_time_stamp.new}
    Run Keyword If    ${status1}==True    Log    Expected agent message is visible in chat section.
    ...    ELSE    mobile_common.Fail and take screenshot    Expected message is not visible in chat section.
