*** Variables ***
${label.welcome.text}    //android.widget.TextView[@text='VeriTracks']
${label.schemas_title}    //android.view.View[@text='Schemas']
${label.org_title}    //android.view.View[@text='Organizations']
${label.dashboard_title}    //android.view.View[@text='Dashboard']
${label.dashboard.dashboard_tab}    //android.widget.TextView[@text='Dashboard']
${label.dashboard.enrollees_tab}    //android.widget.TextView[@text='Enrollees']
${label.dashboard.events_tab}    //android.widget.TextView[@text='Events']
${label.dashboard.inventory_tab}    //android.widget.TextView[@text='Inventory']
${label.dashboard.account_tab}    //android.widget.TextView[@text='Account']
${label.events.openevents.event_confirmed}    //android.widget.TextView[@text='Confirmed']
${label.enrollee}    //android.view.View[contains(@text,'Enrollee')]
${label.enrollee.addenrollee}    //android.view.View[@text='Add Enrollee']
${label.pagetitle}    //android.view.View[contains(@text,'replaceText')]
${label.event.detail}    //android.widget.TextView[@text='DETAIL']
${label.search_enrollee.profile}    //android.widget.TextView[@text='PROFILE']
${label.enrollee.editenrollee}    //android.view.View[@text='Edit Enrollee']
${label.assign_device.selected_device}    //android.widget.TextView[@text='Selected Device']
${label.assigned_device}    xpath=(//android.view.ViewGroup[@content-desc="riskLevel"]//..)[1]/android.view.ViewGroup[@content-desc="device"]/android.widget.TextView
${label.login.sign_in_error_alert_title}    android:id/alertTitle
${label.login.sign_in_error_alert.message}    android:id/message
${label.dashboard.enrollees.assigned_count}    xpath=(//android.widget.TextView[contains(@text,'Assigned')])[1]
${label.dashboard.enrollees.unassigned_count}    xpath=(//android.widget.TextView[contains(@text,'Unassigned')])[1]
${label.dashboard.open_events_count}    //android.widget.TextView[contains(@text,'Open')]
${label.dashboard.events.inclusion_count}    //android.widget.TextView[contains(@text,'Inclusion')]
${label.dashboard.events.exclusion_count}    //android.widget.TextView[contains(@text,'Exclusion')]
${label.dashboard.events.mastertamper_count}    //android.widget.TextView[contains(@text,'Master Tamper')]
${label.dashboard.inventory.shelf_rate_count}    //android.widget.TextView[contains(@text,'Shelf Rate')]
${label.dashboard.inventory.assigned_count}    xpath=(//android.widget.TextView[contains(@text,'Assigned')])[2]
${label.dashboard.inventory.unassigned_count}    xpath=(//android.widget.TextView[contains(@text,'Unassigned')])[2]
${label.enrollee.casenote_text}    xpath=(//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView)[1]
${label.sigin.Privacy Policy.Privacy and Data Processing Policy}    //android.view.View[@text='Privacy and Data Processing Policy']
${label.inventory.device}    //android.view.ViewGroup[@content-desc="organisationName"]/android.widget.TextView[@text='replaceText2']//..//following-sibling::android.view.ViewGroup[@content-desc="status"]/android.widget.TextView[@text='replaceText1']
${label.enrollee.profile.chats.messaging}    //android.view.View[@text='Messaging']
${label.enrollee.event.detail}    //android.widget.TextView[@text='DETAIL']
${label.events.events_note}    //android.widget.TextView[@text='replaceText']
${label.inventory.unassigned.edit_device}    //android.view.View[@text='Edit Device']
${label.inventory.unassigned.edit_detail}    //android.widget.TextView[@text='replaceText']
${label.inventory.unassigned.details}    //android.widget.TextView[@text='replaceText']
${label.inventory.charger}    //android.view.ViewGroup/android.widget.ImageView[@index='10']
${label.profile.map}    //android.widget.TextView[@text='MAP']
${label.inventory.device_id}    xpath=(//android.widget.Button[contains(@content-desc,'Inventory, back')]/following-sibling::android.view.View)[1]
${label.enrollee_list.no_more_elements}    //android.widget.TextView[@text='No more elements']
${label.inventory.list.no_more_elements}    //android.widget.TextView[@text='No more elements']
${label.account.Veritracks}    //android.widget.TextView[contains(@text,'VeriTracks')]
${label.account.agentname}    xpath=(//android.view.ViewGroup/android.widget.TextView[@index='0'])[2]
${lable.account.Feedback}    //android.widget.TextView[@text='Feedback']
${lable.account.Account}    //android.view.View[@text='Account']
${lable.inventory.first_device}    xpath=(//android.widget.ScrollView[@index='0']//following-sibling::android.view.ViewGroup[@index='0'])[3]
${label.inventory.selectedDevice_device_id}    //android.view.ViewGroup[@content-desc="deviceSerialNum"]/android.widget.TextView
${label.inventory.selectedDevice_device_name}    //android.view.ViewGroup[@content-desc="deviceName"]/android.widget.TextView
${label.inventory.selectedDevice_device_organization}    //android.view.ViewGroup[@content-desc="oreganizationName"]/android.widget.TextView
${label.inventory.selectedDevice_device_location}    xpath=(//android.view.ViewGroup[@content-desc="trackDate"])[6]/android.widget.TextView
${label.inventory.selectedDevice_device_phoneNo}    xpath=(//android.view.ViewGroup[@content-desc="contactDate"])[6]/android.widget.TextView
${label.inventory.selectedDevice_device_Assignment}    //android.view.ViewGroup[@content-desc="deviceStatus"]/android.widget.TextView
${label.profile.tab}    //android.widget.TextView[@text='replaceText']
${label.enrollee.select}    xpath=(//android.view.ViewGroup[@index='1'])[10]
${label.inventory.device_num}    xpath=(//android.view.ViewGroup/android.widget.TextView[contains(@text,'replaceText1')]//following::android.widget.TextView[@text="replaceText2"])[1]
${lable.inventory.event}    //android.view.View[@text='Events']
${label.events}    //android.widget.TextView[@text="replaceText"]
${label.events.selectedEvent_firstName}    xpath=(//android.view.ViewGroup[@content-desc="enrolleeName"])[7]/android.widget.TextView
${label.events.profile_firstName}    xpath=(//android.view.ViewGroup[@content-desc="enrolleeName"])[7]/android.widget.TextView
${label.events.selectedEvent_timezone}    //android.view.ViewGroup[@content-desc="timezone"]/android.widget.TextView
${label.events.selectedEvent_name}    xpath=(//android.view.ViewGroup[@content-desc="enrolleeName"])[8]/android.widget.TextView
${label.events.selectedEvent_id}    //android.view.ViewGroup[@content-desc="primaryId"]/android.widget.TextView
${label.events.selectedEvent_organization}    //android.view.ViewGroup[@content-desc="organization"]/android.widget.TextView
${label.events.selectedEvent_risklevel}    //android.view.ViewGroup[@content-desc="riskLevel"]/android.widget.TextView
${label.events.selectedEvent_deviceid}    //android.view.ViewGroup[@content-desc="device"]/android.widget.TextView
${label.create_enrollee.organization}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.widget.TextView
${label.create_enrollee.time_zone}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.widget.TextView
${label.common.pagetitle}    //android.view.View[@text='replaceText']
${label.enrollee.profile_Name}    //android.view.ViewGroup[@content-desc="enrolleeName"]/android.widget.TextView
${label.enrollee.profile_primaryid}    //android.view.ViewGroup[@content-desc="primaryId"]/android.widget.TextView
${label.enrollee.profile_organization}    //android.view.ViewGroup[@content-desc="organization"]/android.widget.TextView
${label.enrollee.profile_timezone}    //android.view.ViewGroup[@content-desc="timezone"]/android.widget.TextView
${label.enrollee.profile_risklevel}    //android.view.ViewGroup[@content-desc="riskLevel"]/android.widget.TextView
${label.enrollee.profile_deviceid}    xpath=(//android.view.ViewGroup[@content-desc="device"])[6]/android.widget.TextView
${label.enrollee.profile_contactdate}    //android.view.ViewGroup[@content-desc="contactdate"]/android.widget.TextView
${label.enrollee.casenote}    xpath=(//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView)[replaceText]
${label.enrollee.casenote_block}    //android.widget.TextView[@text='Case Notes']/../following-sibling::android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup
${label.enrollee.casenote_text1}    //android.widget.TextView[@text='Case Notes']/../following-sibling::android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.widget.TextView[1]
${label.enrollee.casenote_text2}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView
${label.enrollee.casenotes_block}    //android.widget.TextView[@text='Case Notes']/../following-sibling::android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup
${label_enrollee_profilepage_timezone}    //android.view.ViewGroup[@content-desc="timezone"]/android.widget.TextView
${label_enrollee_profilepage_contactdate}    //android.view.ViewGroup[@content-desc="contactdate"]/android.widget.TextView
${label_enrollee_editpage_timezone}    //android.view.ViewGroup[@content-desc="TimeZone Container"]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView
${label_enrollee_editpage_update}    //android.widget.TextView[@content-desc="btnSaveEnrollee, true"]
${label.inventory.device_number}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@index='1']
${label.inventory.device_productname}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@index='2']
${label.inventory.organization}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@index='4']
${label.inventory.device_contactdate}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@index='6']
${label.inventory.device_reported_date}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@index='8']
${label.inventory.device_status}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@index='10']
${label.events_list.no_more_elements}    //android.widget.TextView[@text='No more elements']
${label.enrollee.message.name_and_time_stamp}    xpath=(//android.widget.ScrollView)[2]//android.view.ViewGroup/android.widget.TextView[@text='replaceText1']/following-sibling::android.widget.TextView[@text='replaceText2']
${label.enrollee.message.checkmark_1}    xpath=(//android.widget.ScrollView)[2]//android.view.ViewGroup/android.widget.TextView[@text='replaceText']/following-sibling::android.widget.TextView[@index='2']
${label.enrollee.message.checkmark_2}    xpath=(//android.widget.ScrollView)[2]//android.view.ViewGroup/android.widget.TextView[@text='replaceText']/following-sibling::android.widget.TextView[@index='3']
${label.enrollee.profile.message}    xpath=(//android.widget.ScrollView)[2]//android.view.ViewGroup/android.widget.TextView[@text='replaceText']
${label.enrollee.profile.message_date}    //android.widget.TextView[@text='replaceText']
${label.agent.message.name_and_time_stamp}    xpath=(//android.widget.ScrollView)[2]//android.view.ViewGroup/android.widget.TextView[@text='replaceText1']/following-sibling::android.widget.TextView[@text='replaceText2']
${label.enrollee.editenrollee}    //android.view.View[@text='Edit Enrollee']
${label.alert.title_notification}    //android.widget.TextView[@resource-id='android:id/alertTitle' and @text='Notification']
${label.alert.message_notification}    //android.widget.TextView[@resource-id='android:id/message']
${label.enrollee_primaryid}    //android.widget.TextView[@content-desc="primaryId"]
${label.enrollee_fullname}    //android.widget.TextView[@content-desc="enrolleeName"]
${label.create_enrollee.device}    xpath=(//android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView)[replaceText]
