*** Variables ***
${images.welcome.logo}    name=VeriTracks
${images.enrollees.search_icon}    //android.view.View[@text='Enrollees']/preceding::android.widget.ImageView[1]
${images.enrollees.plus_icon}    //android.view.View[@text='Enrollees']/following::android.widget.ImageView[1]
${image.enrollee.profilephoto}    (//android.widget.ScrollView[@index='0']//following-sibling::android.view.ViewGroup[@index='0'])[4]
${image.enrollee.profilephoto.captureimage}    //android.widget.ImageView[@content-desc="Shutter"]
${image.enrolee.profilephoto.capture.okimage}    //android.widget.ImageButton[@content-desc="Done"]
${images.enrollee.edit.pursue}    //android.widget.TextView[@text='pursue']/preceding::android.widget.ImageView[1]
${images.enrollee.pursue}    //XCUIElementTypeOther[@label="pursue"]/XCUIElementTypeOther
${images.dashboard.caseload.enrollees}    //XCUIElementTypeButton[contains(@name,'AIRGMSMarker')]
${images.dashboard.caseload.google_map}    //XCUIElementTypeButton[@label="Google Maps"]
${images.dashboard.recent_pursue_enrollee}    //android.widget.HorizontalScrollView//android.widget.ImageView[1]
${images.account.feedback_sending_message}    Sending Feedback..
${images.account.feedback_error_message}    This field is required
${images.account.feedback_received_message}    name=Feedback received
${images.dashboard.profile}    //XCUIElementTypeOther[@label="profile"]/XCUIElementTypeOther
${images.enrollee.directions}    //XCUIElementTypeOther[@label="directions"]/XCUIElementTypeOther
${images.pursuit.icon}    //XCUIElementTypeOther[@label="Recent Pursuits List"]/XCUIElementTypeScrollView/XCUIElementTypeOther
${images.maptype}    //XCUIElementTypeButton[@label="Google Maps"]
${images.dashboard.maptype}    //XCUIElementTypeOther[@label='maptype replaceText']
${images.enrollee.profile.chat}    xpath=(//XCUIElementTypeOther[contains(@label,"replaceText")])[14]
${images.enrollee.add_case_notes}    xpath=(//XCUIElementTypeOther[@label="Case Notes"])[2]/XCUIElementTypeOther/XCUIElementTypeOther
${images.enrollee.add_event_notes}    xpath=(//XCUIElementTypeOther[@label="Event Notes"])[2]/XCUIElementTypeOther/XCUIElementTypeOther
${images.enrollee.buzz}    //XCUIElementTypeOther[@label="buzz"]/XCUIElementTypeOther
${images.enrollee.vibrate}    //XCUIElementTypeOther[@label="vibrate"]/XCUIElementTypeOther
${images.enrollee.locate}    //XCUIElementTypeOther[@label="locate"]/XCUIElementTypeOther
${images.enrollee.unassign}    //XCUIElementTypeOther[@label="unassign"]/XCUIElementTypeOther
