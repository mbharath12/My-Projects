*** Variables ***
${button.signin}    name=btn-sign-inbutton
${button.welcome.text}    //android.widget.TextView[@text='VeriTracks']
${button.welcome.privacy_policy}    //XCUIElementTypeButton[@name='Privacy Policy']
${button.schemas_title}    //android.view.View[@text='Schemas']
${button.schemas.cancel}    //XCUIElementTypeStaticText[@label="cancel"]
${button.common.select}    xpath=(//XCUIElementTypeOther[@label="selectSchema"])[2]
${button.common.save}    //android.widget.TextView[@text='save']
${button.org.select}    xpath=(//XCUIElementTypeOther[@label="selectOrg"])[2]
${button.common.cancel}    //XCUIElementTypeButton[@label="Cancel"]
${button.common.delete}    //android.widget.Button[@text='DELETE']
${button.common.yes}    //android.widget.Button[@text='YES']
${button.enrollee.add}    name=icon enrollee add
${button.enrollee.org.select}    //XCUIElementTypeOther[@label='Organization Container']/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeStaticText
${button.enrollee.timezone.select}    xpath=(//XCUIElementTypeOther[@label="TimeZone Container"]//XCUIElementTypeStaticText)[2]
${button.enrollee.risk_level.select}    //XCUIElementTypeOther[@label='RiskLevel Container']/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeStaticText
${button.enrollee.device_managment.device_select}    //android.widget.TextView[@text='Device Assignment']//following::android.widget.ImageView
${button.events.openevents.confirm}    //android.widget.TextView[@text='confirm']
${button.events.openevents.confirm_event_alert.send}    android:id/button2
${button.addenrollee.selectorganization}    //android.widget.TextView[@text='Organization']//following-sibling::android.widget.TextView[contains(@text,'Click to select')]
${button.addenrollee.selecttimezone}    //android.widget.TextView[@text='Time Zone']//following-sibling::android.widget.TextView[contains(@text,'Click to select')]
${button.addenrollee.selectrisklevel}    //android.widget.TextView[@text='Risk Level']//following-sibling::android.widget.TextView[contains(@text,'Click to select')]
${button.addenrolle.save}    name=btnSaveEnrollee
${button.enrollees.searchicon}    name=icon enrollee search
${button.searchicon.searchbutton}    name=btn enrollee search
${button.enrollee.Assigned}    name=Assigned
${button.enrollee.Unassigned}    name=Unassigned
${button.enrollee.Both}    name=Both
${button.enrollee.edit.pursuit.send}    //android.widget.Button[@text='SEND']
${button.account.logout}    //XCUIElementTypeOther[@label='logout']
${button.Events}    /
${button.Enrollee}    //XCUIElementTypeButton[@label='Enrollees, tab, 2 of 5']
${button.Inventory}    //XCUIElementTypeButton[@label='Inventory, tab, 4 of 5']
${button.Dashboard}    //XCUIElementTypeButton[@label='Dashboard, tab, 1 of 5']
${button.Account}    //XCUIElementTypeButton[@label='Account, tab, 5 of 5']
${button.enrollee.pursue.close}    xpath=(//XCUIElementTypeOther[@label="closePursuitMode"])[2]
${button.enrollee.unassigned.edit}    xpath=(//XCUIElementTypeOther[@label="btn enrollee edit"])[2]
${button.editenrolle.device_assignment}    name=Device Assignment Container
${button.editenrollee.set}    name=setDevice
${button.editenrollee.update}    xpath=(//XCUIElementTypeOther[@label="btnSaveEnrollee"])[2]
${buttton.signin.Privacy Policy}    //XCUIElementTypeOther[@label='Privacy Policy']
${button.org.cancel}    xpath=(//XCUIElementTypeOther[@label="cancelOrg"])[2]
${button.enrollee_profile.back_arrow}    name=header-back
${button.account.about}    name=about
${button.account.send}    name=send feedback
${button.account.map_settings}    //XCUIElementTypeOther[@label='replaceText']
${button.common.dashboard_action}    //XCUIElementTypeButton[@label='replaceText']
${button.account.change_ori}    //XCUIElementTypeOther[@label="changeOrganization"]
${button.enollee.profile.chat}    xpath=(//XCUIElementTypeOther[@label="icon agent messaging"])[2]
${button.enollee.profile.chat.send}    //XCUIElementTypeOther[@label="send"]
${button.enrollee.message.previous_messages}    xpath=(//XCUIElementTypeOther[@label="Load earlier messages"])[3] (//XCUIElementTypeOther[@label="Load earlier messages"])[3]
${button.enollee.profile.unassign}    //XCUIElementTypeOther[@label="unassign"]/XCUIElementTypeOther
${button.enrollee.case_note.save}    //XCUIElementTypeOther[@label="save"]
${button.enrollee.events}    //XCUIElementTypeOther[@label="EVENTS EVENTS"]
${button.events.detail.profile}    //XCUIElementTypeOther[@label="profile"]/XCUIElementTypeOther
${button.enrollee.event.event_note.save}    xpath=(//XCUIElementTypeOther[@label="save"])[2]
${button.enollee.profile.assign}    //XCUIElementTypeOther[@label="assign"]/XCUIElementTypeOther
${button.enollee.profile.reason.unassign}    xpath=(//XCUIElementTypeOther[@label="unassign"])[2]
${button.enrollee.event.profile.cancel}    xpath=(//XCUIElementTypeOther[@label="icon enrollee close"])[2]
${button.addenrolle.cancel}    xpath=(//XCUIElementTypeOther[@label="btnCreateEnrolleCancel"])[2]
${button.common.action}    //XCUIElementTypeButton[@label='Send']
${button.enrollee.close}    xpath=(//XCUIElementTypeOther[@name="closeDeviceAssignment"])[2]
${button.common.cancel_action}    //XCUIElementTypeButton[@label='Cancel']
${button.device.unassign.cancel_action}    xpath=(//XCUIElementTypeOther[@name="cancel"])[2]
${button.enrollee.search.cancel}    xpath=(//XCUIElementTypeOther[@label="btn enrollee search cancel"])[2]
${button.enrollee.edit}    xpath=(//XCUIElementTypeOther[@name="btn enrollee edit"])[2]
