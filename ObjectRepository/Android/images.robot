*** Variables ***
${images.welcome.logo}    //android.widget.ImageView[@index='0']
${images.enrollees.search_icon}    //android.view.View[@text='Enrollees']/preceding::android.widget.ImageView[1]
${images.enrollees.plus_icon}    //android.view.View[@text='Enrollees']/following::android.widget.ImageView[1]
${image.enrollee.profilephoto}    (//android.widget.ScrollView[@index='0']//following-sibling::android.view.ViewGroup[@index='0'])[4]
${image.enrollee.profilephoto.captureimage}    //android.widget.ImageView[@content-desc="Shutter"]
${image.enrolee.profilephoto.capture.okimage}    //android.widget.ImageButton[@content-desc="Done"]
${images.enrollee.edit.pursue}    //android.widget.TextView[@text='pursue']/preceding::android.widget.ImageView[1]
${images.enrollee.pursue}    //android.widget.TextView[@text='pursue']/preceding::android.widget.ImageView[1]
${images.dashboard.caseload.enrollees}    //android.view.View[@content-desc='Google Map']/android.view.View
${images.dashboard.caseload.google_map}    //android.view.View[@content-desc='Google Map']
${images.dashboard.recent_pursue_enrollee}    //android.widget.HorizontalScrollView//android.widget.ImageView[1]
${images.enrollee.vibrate}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[3]
${images.enrollee.buzz}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[4]
${images.enrollee.locate}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[2]
${images.enrollee.pursue}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[5]
${images.enrollee.add_case_notes}    //android.widget.TextView[@text='Case Notes']//../android.view.ViewGroup/android.widget.ImageView
${images.enrollee.add_event_notes}    //android.widget.TextView[@text='Event Notes']//../android.view.ViewGroup/android.widget.ImageView
${images.enrollee.directions}    //android.widget.TextView[@text='directions']/preceding::android.widget.ImageView[2]
${images.enrollee.maps.start}    //android.support.design.chip.Chip[@text='Start']
${images.enrollee.sound_icon}    //android.widget.LinearLayout/android.widget.FrameLayout[2]/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.View
${images.directions_icon}    xpath=((//android.widget.Button[@content-desc="Enrollee, back"]//..)[1]/android.view.ViewGroup)[2]/android.widget.ImageView
${images.inventory.vibrate}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[2]
${images.inventory.locate}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[1]
${images.inventory.buzz}    xpath=(//android.widget.TextView[@text='locate']/preceding-sibling::android.view.ViewGroup)[3]
${images.dashboard.profile}    xpath=(//android.widget.TextView[@text='profile']/preceding-sibling::android.view.ViewGroup)[3]
${images.map.toast_message}    //android.widget.Toast
${image.inventory.trackpoint}    xpath=(//android.view.View[@index="0"])[2]
${images.account.feedback_sending_message}    Sending Feedback..
${images.account.feedback_received_message}    Feedback received
${images.account.feedback_error_message}    This field is required
${images.enrollee.profile.chat}    xpath=(//android.widget.ScrollView)[2]//android.view.ViewGroup/android.widget.TextView[contains(@text,'replaceText')]
${images.map.location_icon}    //android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View[replaceText]
${images.map.events.location_icon}    //android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View[35]
${images.maptype}    //android.widget.FrameLayout[contains(@content-desc,'maptype')]
${images.pursuit.icon}    //android.widget.HorizontalScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView
