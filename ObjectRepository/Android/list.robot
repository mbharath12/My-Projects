*** Variables ***
${list.addenrollee.list_values}    //android.widget.ScrollView[@index='0']
${list.enrollee.profiledts}    //android.widget.TextView[contains(@text,'replaceText')]
${list.schema}    //android.widget.TextView[@text='replaceText']
${list.enrollee.org}    //android.widget.TextView[@content-desc='replaceText']
${common.dynamic_xpath}    //android.widget.TextView[contains(@text,'replaceText')]
${list.google_map.enrollee.count}    //android.view.View[@content-desc='Google Map']/android.view.View[replaceText]
${list.enrollee.pursuit.primary_id}    //android.widget.TextView[contains(@text,'replaceText')]/preceding-sibling::android.view.ViewGroup[1]
@{testdata_list}    LastName    PrimaryId    Organization    RiskLevel    TimeZone
${list.assign_device}    //android.view.ViewGroup[contains(@content-desc, 'replaceText')]/android.widget.TextView
${list.events.open_events}    //android.widget.TextView[contains(@text,'replaceText')]
${list.events}    //android.view.ViewGroup/android.widget.TextView[@text='replaceText1']//..//following-sibling::android.view.ViewGroup/android.widget.TextView[@text='replaceText2']
${list.enollee.device_id}    xpath=(//android.widget.TextView[contains(@text,'replaceText')])[1]
${list.enollee.profile.unassigned_reason}    //android.widget.CheckedTextView[@text='replaceText']
${list.enollee.enrollee_name}    xpath=(//android.widget.TextView[contains(@text,'replaceText')])[1]//../android.widget.TextView[1]
${list.enollee.primary_id}    xpath=(//android.view.ViewGroup[@content-desc="riskLevel"]//..)[1]/android.view.ViewGroup[@content-desc="device"]/android.widget.TextView[contains(@text,'replaceText')]
${list.enrollee.first_event}    xpath=((//android.widget.ScrollView)[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup)[1]
${list.enollee.enrollee_name}    xpath=(//android.widget.TextView[contains(@text,'replaceText')])[1]//../android.widget.TextView[1]
@{Profile_data_list}    FirstName    LastName    PrimaryId    Organization    RiskLevel    TimeZone    DeviceName
${list.inventory.unassigned_device}    xpath=(//android.widget.TextView[@text='UNASSIGNED'])[3]
${list.inventory.edit.list}    //android.widget.ScrollView/android.view.ViewGroup
${list.inventory.device}    //android.widget.TextView[@text="replaceText"]
${list.locations.list}    //android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View
${list.enrollee.fullname}    xpath=(//android.widget.TextView[@content-desc="enrolleeName"])[replaceText]
${list.enrollee.primary_id}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.widget.TextView[@index='1']
${list.enrollee.organization}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup[1]/android.view.ViewGroup[2]/android.widget.TextView[@index='5']
${list.enrollees}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup
${list.inventory.device_id}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.widget.TextView[@index='1']
${list.inventory.device_organization}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[replaceText]/android.view.ViewGroup[1]/android.view.ViewGroup[1]/android.widget.TextView[@index='4']
${list.inventory.devices}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup
${list.map.location_icon}    //android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View
${list.enrollee.events}    //android.widget.TextView[@text='replaceText']
${list.add_enrollee.organizations}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView
${list.add_enrollee.unassigned_devices}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView
${list.add_enrollee.time_zone}    //android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup
${list.enrollee.events.count}    //android.view.ViewGroup[@content-desc="eventName"]/android.widget.TextView
${list.enrollee.events_name}    xpath=(//android.view.ViewGroup[@content-desc="eventName"])[replaceText]/android.widget.TextView
${list.enrollee.primary_ids}    xpath=(//android.widget.TextView[@content-desc="primaryId"])[replaceText]
${list.enrollee.fullname_count}    //android.widget.TextView[@content-desc="enrolleeName"]
${list.enollees.deviceid}    xpath=(//android.view.ViewGroup[@content-desc="device"])[replaceText]/android.widget.TextView
${list.enollee.deviceid_count}    //android.view.ViewGroup[@content-desc="device"]
${list.enrollee.primaryid_count}    //android.widget.TextView[@content-desc="primaryId"]
${list.edit_enrollee.timezone}    //android.widget.ScrollView[@content-desc="select list"]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@text='replaceText']
${list.event.name}    xpath=(//android.view.ViewGroup[@content-desc="eventName"])[replaceText]/android.widget.TextView
${list.event.enrollee_name}    xpath=(//android.view.ViewGroup[@content-desc="enrolleeName"])[replaceText]/android.widget.TextView
${list.event.deviceSerialNumber}    xpath=(//android.view.ViewGroup[@content-desc="deviceSerialNumber"])[replaceText]/android.widget.TextView
${list.event.startDateProgress}    xpath=(//android.view.ViewGroup[@content-desc="startDateProgress"])[replaceText]/android.widget.TextView
${list.enrollee.select_oraganization}    //android.widget.ScrollView[@content-desc="select list"]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@text='replaceText']
${list.enrollee.timezone}    //android.widget.ScrollView[@content-desc="select list"]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@text='replaceText']
${list.enrollee.risklevel}    //android.widget.ScrollView[@content-desc="select list"]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.TextView[@text='replaceText']
