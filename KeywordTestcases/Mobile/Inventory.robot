*** Settings ***
Resource          ../../Config/super.robot

*** Test Cases ***
TC01 - C78083 Organization Change-Save
    [Tags]    Android_test_case_id=78083    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_29    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    ${inventory_data}=    Read TestData From Excel    TC_29    Inventory
    mobile_inventory.Select Device from Inventory    UNASSIGNED    ${inventory_data}[Organization]
    Comment    Navigate to Edit Inventory Device Details
    mobile_inventory.Navigate to Edit Inventory Device Details
    comment    Select Edit Organization
    mobile_inventory.Select Edit Organization    ${inventory_data}[Organization]
    Comment    Update Device Details
    mobile_inventory.Update Device Details    ${inventory_data}[ChangeOrganization]
    Comment    Validate Inventory Device Details
    mobile_inventory.Validate Inventory Device Details    ${inventory_data}[ChangeOrganization]
    Comment    Navigate to Edit Inventory Device Details
    mobile_inventory.Navigate to Edit Inventory Device Details
    comment    Select Edit Organization
    mobile_inventory.Select Edit Organization    ${inventory_data}[ChangeOrganization]
    Comment    Update Device Details
    mobile_inventory.Update Device Details    ${inventory_data}[Organization]

TC02 - C78085 Status Change-Save
    [Tags]    Android_test_case_id=78085    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_30    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    ${inventory_data}=    Read TestData From Excel    TC_30    Inventory
    mobile_inventory.Select Device from Inventory    UNASSIGNED    ${inventory_data}[Organization]
    Comment    Navigate to Edit Inventory Device Details
    mobile_inventory.Navigate to Edit Inventory Device Details
    Comment    Select Edit Device Status
    mobile_inventory.Select Edit Device Status    ${inventory_data}[DeviceStatus]
    Comment    Update Device Details
    mobile_inventory.Update Device Details    ${inventory_data}[ChangeDeviceStatus]
    Comment    Validate Inventory Device Details
    mobile_inventory.Validate Inventory Device Details    ${inventory_data}[ChangeDeviceStatus]
    Comment    Navigate to Edit Inventory Device Details
    mobile_inventory.Navigate to Edit Inventory Device Details
    Comment    Select Edit Device Status
    mobile_inventory.Select Edit Device Status    ${inventory_data}[ChangeDeviceStatus]
    Comment    Update Device Details
    mobile_inventory.Update Device Details    ${inventory_data}[DeviceStatus]

TC03 - C84484 Send Locate
    [Tags]    Android_test_case_id=84484    iOS_test_case_id=78212
    [Setup]    Read TestData From Excel    TC_43    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_43
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    comment    mobile_inventory.Select an assigned device
    mobile_inventory.Select an assigned device    ASSIGNED
    comment    Get Blutag Device id
    ${device_id}=    mobile_inventory.Get Device Id
    &{inventory_serial_number}=    get_serial_number_for_inventory_operation    ${device_id}
    comment    Get Message Id for assigned enrollee Before device operation
    &{device_msg}=    CustomLibrary.Get Message Id Before Device Operation    ${inventory_serial_number}[DEVICE_SERIAL_NUM]
    Perform device action from inventory    locate
    ${perl_commands}=    Read TestData From Excel    TC_43    PursuitData
    comment    mobile_pursuit.Validate Pursuit from Database
    mobile_pursuit.Validate Pursuit from Database    ${inventory_serial_number}[DEVICE_SERIAL_NUM]    ${device_msg}[MSGID]    ${perl_commands}

TC04 - C84485 Send vibrate
    [Tags]    Android_test_case_id=84485    iOS_test_case_id=78213
    [Setup]    Read TestData From Excel    TC_44    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_44
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    comment    mobile_inventory.Select an assigned device
    mobile_inventory.Select an assigned device    ASSIGNED
    comment    Get Blutag Device id
    ${device_id}=    mobile_inventory.Get Device Id
    &{inventory_serial_number}=    get_serial_number_for_inventory_operation    ${device_id}
    comment    Get Message Id for assigned enrollee Before device operation
    &{device_msg}=    CustomLibrary.Get Message Id Before Device Operation    ${inventory_serial_number}[DEVICE_SERIAL_NUM]
    Perform device action from inventory    vibrate
    ${perl_commands}=    Read TestData From Excel    TC_44    PursuitData
    comment    mobile_pursuit.Validate Pursuit from Database
    mobile_pursuit.Validate Pursuit from Database    ${inventory_serial_number}[DEVICE_SERIAL_NUM]    ${device_msg}[MSGID]    ${perl_commands}

TC05 - C84486 Send Buzz
    [Tags]    Android_test_case_id=84486    iOS_test_case_id=78214
    [Setup]    Read TestData From Excel    TC_45    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_45
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    comment    mobile_inventory.Select an assigned device
    mobile_inventory.Select an assigned device    ASSIGNED
    comment    Get Blutag Device id
    ${device_id}=    mobile_inventory.Get Device Id
    &{inventory_serial_number}=    get_serial_number_for_inventory_operation    ${device_id}
    comment    Get Message Id for assigned enrollee Before device operation
    &{device_msg}=    CustomLibrary.Get Message Id Before Device Operation    ${inventory_serial_number}[DEVICE_SERIAL_NUM]
    Perform device action from inventory    buzz
    ${perl_commands}=    Read TestData From Excel    TC_45    PursuitData
    comment    mobile_pursuit.Validate Pursuit from Database
    mobile_pursuit.Validate Pursuit from Database    ${inventory_serial_number}[DEVICE_SERIAL_NUM]    ${device_msg}[MSGID]    ${perl_commands}

TC06 - C78084 Organization Change-Cancel
    [Tags]    Android_test_case_id=78084    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_08    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    comment    Select Device from Inventory
    sleep    3s
    mobile_inventory.Select Device from Inventory    UNASSIGNED    ${test_prerequisite_data}[Org]
    ${inventory_data}=    Read TestData From Excel    TC_08    Inventory
    Comment    Navigate to Edit Inventory Device Details
    mobile_inventory.Navigate to Edit Inventory Device Details
    comment    Select Edit Organization
    mobile_inventory.Select Edit Organization    ${inventory_data}[Organization]
    Comment    Cancel Change Organization
    mobile_inventory.Cancel the update changes
    Comment    Validate Inventory Device Details
    mobile_inventory.Validate Inventory Device Details    ${inventory_data}[Organization]

TC07 - C78086 Status Change-Cancel
    [Tags]    Android_test_case_id=78086    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_08    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    ${inventory_data}=    Read TestData From Excel    TC_08    Inventory
    mobile_inventory.Select Device from Inventory    UNASSIGNED    ${inventory_data}[Organization]
    Comment    Navigate to Edit Inventory Device Details
    mobile_inventory.Navigate to Edit Inventory Device Details
    Comment    Select Edit Device Status
    mobile_inventory.Select Edit Device Status    ${inventory_data}[DeviceStatus]
    Comment    Cancel Device Status
    mobile_inventory.Cancel the update changes
    Comment    Validate Inventory Device Details
    mobile_inventory.Validate Inventory Device Details    ${inventory_data}[Organization]

TC08 - C78082 Inventory Tile
    [Tags]    Android_test_case_id=78082    Android_test_case_id=12345
    [Setup]    Read TestData From Excel    TC_08    Login
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${test_prerequisite_data}[Username]    ${test_prerequisite_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${test_prerequisite_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${test_prerequisite_data}[Org]
    Comment    Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    comment    Read TestData From Excel
    ${inventory_data}=    Read TestData From Excel    TC_08    Inventory
    comment    Validate Inventory Devices
    Comment    mobile_inventory.Validate Inventory Devices    ${inventory_data}[Devices]
    Comment    Get All Enrollee details from Enrollee List
    mobile_inventory.Get all inventory details from inventory list and Validate    ${inventory_data}[Organization]

TC09 - C84482 Verify Last Trackpoint Icon
    [Tags]    Android_test_case_id=84482    iOS_test_case_id=78210
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_40
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    ${account_data}=    Read TestData From Excel    ${tcname}    Enrollee
    Comment    Get device pattern from Blutag device name
    ${device_pattern}    Get device pattern    ${account_data}[DeviceName]
    Comment    mobile_inventory.Select Device From Inventory
    mobile_inventory.Select Device with Status    ${device_pattern}    ASSIGNED
    Comment    mobile_inventory.Validate Toast Message
    mobile_inventory.Validate Toast Message

TC10 - C84483 Verify Device Assigment Details
    [Tags]    Android_test_case_id=84483    iOS_test_case_id=78211
    Comment    Set Test case iD tag based on the platform
    mobile_common.Set Tag for test case id
    ${tcname}=    Set Variable    TC_40
    ${login_data}=    Read TestData From Excel    ${tcname}    Login
    Comment    Login to VeriTracks Application
    mobile_common.Login to Mobile Application    ${login_data}[Username]    ${login_data}[Password]
    Comment    Select Schema
    mobile_common.Select Schema    ${login_data}[Schema]
    Comment    Select Oraganization from list
    mobile_common.Select Organization    ${login_data}[Org]
    comment    mobile_common.Select Navigation Tab
    mobile_common.Select Navigation Tab    Inventory
    comment    mobile_inventory.Select First Device in the List
    mobile_inventory.Select a device    ASSIGNED
    comment    mobile_inventory.Get the Selected Device Details
    ${device_details}=    mobile_inventory.Get the Selected Device Details
    mobile_inventory.Validate Device Assignment Details    ${device_details}    ${device_details}[DEVICE_SERIALNUMER]
