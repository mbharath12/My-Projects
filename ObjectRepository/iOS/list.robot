*** Variables ***
${list.addenrollee.list_values}    name=select list
${list.enrollee.profiledts}    //XCUIElementTypeStaticText[contains(@label,'replaceText')]
${list.schema}    xpath=(//XCUIElementTypeOther[@label="replaceText"])[2]
${list.enrollee.org}    //XCUIElementTypeScrollView/XCUIElementTypeOther[1]/XCUIElementTypeOther[contains(@label,'replaceText')]
${common.dynamic_xpath}    //XCUIElementTypeStaticText[@label="replaceText"]
${list.google_map.enrollee.count}    xpath=(//XCUIElementTypeButton[contains(@name,'AIRGMSMarker')])[replaceText]
${list.enrollee.pursuit.primary_id}    //XCUIElementTypeStaticText[@label="replaceText"]
@{testdata_list}    LastName    PrimaryId    Organization    RiskLevel    TimeZone
${list.assign_device}    xpath=(//XCUIElementTypeOther[contains(@label,'replaceText')])[2]
${list.events.open_events}    //android.widget.TextView[contains(@text,'replaceText')]
${list.events}    //android.widget.TextView[@text='replaceText1']//following-sibling::android.widget.TextView[contains(@text,'replaceText2')]
${list.first_enrolle}    //XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther
@{Profile_data_list}    FirstName    LastName    PrimaryId    Organization    RiskLevel    TimeZone    DeviceName
${list.enrollee.timezone}    //XCUIElementTypeStaticText[@label="replaceText"]
${list.enrollee.risklevel}    xpath=(//XCUIElementTypeStaticText[@label="replaceText"])[2]
${list.enrollee.events}    xpath=(//XCUIElementTypeOther[@label="eventName enrolleeName deviceSerialNumber startDateProgress"])[2]
${list.first_element}    //XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther[1]/XCUIElementTypeOther
${list.add_enrollee.time_zone}    //XCUIElementTypeScrollView/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther
${list.add_enrollee.unassigned_devices}    //XCUIElementTypeScrollView/XCUIElementTypeOther[1]/XCUIElementTypeOther
