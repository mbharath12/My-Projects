*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Check Notification
    [Arguments]    ${exp_notification_text}
    AppiumLibrary.Wait Until Element Is Visible    ${label.alert.title_notification}    ${LONG_WAIT}    Notification forchange \ request of profile details allert is not displayed.
    ${act_notification_text}    AppiumLibrary.Get Text    ${label.alert.message_notification}
    AppiumLibrary.Click Element    ${button.alert.notification_ok}
    AppiumLibrary.Capture Page Screenshot
    Run Keyword And Continue On Failure    Should Be Equal As Strings    ${exp_notification_text}    ${act_notification_text}
