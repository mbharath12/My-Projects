*** Variables ***
${label.welcome.text}    //XCUIElementTypeStaticText[@label='VeriTracks']
${label.schemas_title}    xpath=(//XCUIElementTypeOther[@label="Schemas"])[2]
${label.org_title}    xpath=(//XCUIElementTypeOther[@label='Organizations'])[2]
${label.dashboard_title}    xpath=(//XCUIElementTypeOther[@label="Dashboard"])[6]
${label.dashboard.dashboard_tab}    //android.widget.TextView[@text='Dashboard']
${label.dashboard.enrollees_tab}    //android.widget.TextView[@text='Enrollees']
${label.dashboard.events_tab}    //android.widget.TextView[@text='Events']
${label.dashboard.inventory_tab}    //android.widget.TextView[@text='Inventory']
${label.dashboard.account_tab}    //android.widget.TextView[@text='Account']
${label.events.openevents.event_confirmed}    //android.widget.TextView[@text='Confirmed']
${label.enrollee}    name=Enrollees
${label.enrollee.addenrollee}    name=Add Enrollee
${label.pagetitle}    //XCUIElementTypeOther[contains(@label,'replaceText')]
${label.event.detail}    //android.widget.TextView[@text='DETAIL']
${label.search_enrollee.profile}    //XCUIElementTypeOther[@label="PROFILE PROFILE"]
${label.enrollee.editenrollee}    name=Edit Enrollee
${label.enrollee.editenrollee}    xpath=(//XCUIElementTypeOther[@label="Edit Enrollee"])[2]
${label.assign_device.selected_device}    name=Selected Device
${label.assigned_device}    //XCUIElementTypeOther[@label="device"]//XCUIElementTypeStaticText
${label.sigin.Privacy Policy.Privacy and Data Processing Policy}    //XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeWebView
${label.login.sign_in_error_alert_title}    //XCUIElementTypeStaticText[@label="Sign In Error"]
${label.login.sign_in_error_alert.message}    //XCUIElementTypeStaticText[@label="Sorry, your username or password is incorrect.Please try again and be careful not to lock your account."]
${label.account.Veritracks}    name=VeriTracks 2.0.4
${lable.account.Feedback}    name=feedback
${label.account.agentname}    name=agentname
${lable.account.Feedback}    name=feedback
${lable.account.Account}    name=Account
${label.common.pagetitle}    //XCUIElementTypeOther[@name='replaceText']
${label.dashboard.enrollees.assigned_count}    xpath=(//XCUIElementTypeStaticText[contains(@label,'Assigned')])[1]
${label.dashboard.enrollees.unassigned_count}    xpath=(//XCUIElementTypeStaticText[contains(@label,'Unassigned')])[1]
${label.dashboard.open_events_count}    //XCUIElementTypeStaticText[contains(@label,'Open')]
${label.dashboard.events.exclusion_count}    //XCUIElementTypeStaticText[contains(@label,'Exclusion')]
${label.dashboard.events.mastertamper_count}    //XCUIElementTypeStaticText[contains(@label,'Master Tamper')]
${label.dashboard.events.inclusion_count}    //XCUIElementTypeStaticText[contains(@label,'Inclusion')]
${label.dashboard.inventory.shelf_rate_count}    //XCUIElementTypeStaticText[contains(@label,'Shelf Rate')]
${label.dashboard.inventory.assigned_count}    xpath=(//XCUIElementTypeStaticText[contains(@label,'Assigned')])[2]
${label.dashboard.inventory.unassigned_count}    xpath=(//XCUIElementTypeStaticText[contains(@label,'Unassigned')])[2]
${label.enrollee.profile.chats.messaging}    //XCUIElementTypeTextView[@label="Type a message... Type a message..."]
${label.enrollee.profile.message}    xpath=(//XCUIElementTypeOther[contains(@label,"replaceText")])
${label.enrollee.message.checkmark_1}    xpath=(//XCUIElementTypeOther[contains(@label,"replaceText")])
${label.enrollee.message.checkmark_2}    xpath=(//XCUIElementTypeOther[contains(@label,"replaceText")])
${label.enrollee.pagetitle}    xpath=(//XCUIElementTypeOther[contains(@label,"replaceText")])[34]
${label_enrollee_profilepage_contactdate}    //XCUIElementTypeOther[@label="contactdate"]/XCUIElementTypeStaticText
${label_enrollee_profilepage_timezone}    //XCUIElementTypeOther[@label="timezone"]/XCUIElementTypeStaticText
${label.enrollee.profile_Name}    //XCUIElementTypeOther[@label="enrolleeName"]/XCUIElementTypeStaticText
${label.enrollee.profile_primaryid}    //XCUIElementTypeOther[@label="primaryId"]/XCUIElementTypeStaticText
${label.enrollee.profile_organization}    //XCUIElementTypeOther[@label="organization"]/XCUIElementTypeStaticText
${label.enrollee.profile_timezone}    //XCUIElementTypeOther[@label="timezone"]/XCUIElementTypeStaticText
${label.enrollee.profile_risklevel}    //XCUIElementTypeOther[@label="riskLevel"]/XCUIElementTypeStaticText
${label.enrollee.profile_deviceid}    //XCUIElementTypeOther[@label="device"]/XCUIElementTypeStaticText
${label.enrollee.profile_contactdate}    //XCUIElementTypeOther[@label="contactdate"]/XCUIElementTypeStaticText
${label.enrollee.event.detail}    //XCUIElementTypeOther[@label="DETAIL DETAIL"]
${label.profile.map}    //XCUIElementTypeOther[@label="MAP MAP"]
${label.events.events_note}    //XCUIElementTypeStaticText[contains(@label,"replaceText")]
${lable.inventory.event}    //XCUIElementTypeOther[contains(@label,’E’vents)]
${label.create_enrollee.time_zone}    xpath=(//XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeStaticText)[replaceText]
${label.create_enrollee.device}    //XCUIElementTypeScrollView/XCUIElementTypeOther[1]/XCUIElementTypeOther[replaceText]
${label.enrollee.select}    //XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther
