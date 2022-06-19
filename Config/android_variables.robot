*** Variables ***
${ANDROID_APP}    ${EXECDIR}/Apps/veritracks.apk
${ANDROID_LONG_WAIT}    60s
${ANDROID_PLATFORM_VERSION}    10    # depends on the OS you use. Currently for iOS: 13.3 and for Androsi its 10
${ANDROID_DEVICE_NAME}    emulator-5554    # args can be : <Device id for android> or iPhone for iOS
${ANDROID_AUTOMATION_NAME}    UIAutomator2    # args can be: UIAutomator2 for android for XCUITest for iOS
${APPIUM_SERVER_URL}    http://localhost:4723/wd/hub
${ANDROID_NO_RESET_APP}    False
${NEW_COMMAND_TIMEOUT}    20000
