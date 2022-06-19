*** Settings ***
Resource          ../../Config/super.robot

*** Keywords ***
Generate Ema Verification Code
    [Arguments]    ${tc_name}
    [Documentation]    This Keyword is used to generate a verificatiom code in DB using Ema User Id
    comment    This keyword is used to read data from Excel. It takes filePath, testcase name and sheet name as the arguments
    ${data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${tc_name}    Enrollink
    ${endpoint}    Get From Dictionary    ${data}    Endpoint
    ${payload}    Get From Dictionary    ${data}    Ema_User_Id
    ${expectedStatusCode}    Get From Dictionary    ${data}    Expected_Response_Code
    ${json}    Create Dictionary    emaUserId    ${payload}
    ${response}    requests.Post    ${enrollink_URL}/${endpoint}    json=${json}
    ${actualStatusCode}    Set Variable    ${response.status_code}
    APILibrary.Validate Status Code    ${actualStatusCode}    ${expectedStatusCode}

Generate Enrollink JWT Token
    [Arguments]    ${tc_name}
    [Documentation]    This keyword will generate JWTToken using Ema User Id which is used by all other enrollink test cases for authorization
    comment    This keyword is used to generate Ema verification token
    Generate Ema Verification Code    TC_Enrollink_01
    comment    This keyword is used to read data from Excel. It takes filePath, testcase name and sheet name as the arguments
    ${data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${tc_name}    Enrollink
    ${endpoint}    Get From Dictionary    ${data}    Endpoint
    ${payload}    Get From Dictionary    ${data}    Ema_User_Id
    ${expectedStatusCode}    Get From Dictionary    ${data}    Expected_Response_Code
    ${date}    CustomLibrary.Get Current Date
    ${todaysDate}    Convert To String    ${date}
    comment    This keyword is used to execute the given SQL query and returns query result
    ${query}    CustomLibrary.Retrieve Data From DB    SELECT VERIFICATION_CODE FROM EMA_VERIFICATION_CODE EVC INNER JOIN EMA_REGISTRATION ER ON EVC.EMA_REGISTRATION_ID=ER.EMA_REGISTRATION_ID where EMA_ID='${payload}' and EVC.Active_flag='Y' and to_char(EVC.CREATED_DATE,'DD/MM/YYYY')='${todaysDate}'    I1DB00_Autotest    vt_master_dapi    vt_master_dapi
    Log    ${query}
    ${json}    Create Dictionary    emaUserId=${payload}    verificationCode=${query}[0]
    ${response}    requests.Post    ${Enrollink_URL}/${endpoint}    json=${json}
    ${actualResponse}    Set Variable    ${response.text}
    ${actualStatusCode}    Set Variable    ${response.status_code}
    APILibrary.Validate Status Code    ${actualStatusCode}    ${expectedStatusCode}
    ${updatedresponseBody}    Replace String    ${actualResponse}    "    ${SPACE}
    ${jwtToken_Enrollink}    Catenate    Bearer    ${updatedresponseBody.strip()}
    Set Global Variable    ${jwtToken_Enrollink}
    log    ${jwtToken_Enrollink}

POST Enrollee Send a Message to Agent
    [Arguments]    ${tc_name}
    comment    This keyword is used to read data from Excel. It takes filePath, testcase name and sheet name as the arguments
    ${data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${tc_name}    Enrollink
    ${endpoint}    Get From Dictionary    ${data}    Endpoint
    ${payload}    Get From Dictionary    ${data}    Payload
    ${notificationDate }    CustomLibrary.getTimeForTimezone    UTC
    ${updatedPayload}    Replace String    ${payload}    SYSDATE    ${notificationDate }
    log    ${updatedPayload}
    ${expectedStatusCode}    Get From Dictionary    ${data}    Expected_Response_Code
    Comment    ${expectedResponse}    Get From Dictionary    ${data}    Expected_Response
    Comment    ${sysdate}    Get Time
    comment    This keyword is used to send POST Request.It takes URL,JWT Token and payload as the arguments.
    ${actualResponse}    ${actualResponseCode}    APILibrary.Send Post Request    ${Enrollink_URL}/${endpoint}    ${jwtToken_Enrollink}    ${updatedPayload}
    comment    This keyword is used to validate the actual status code and expected status code
    APILibrary.Validate Status Code    ${actualResponseCode}    ${expectedStatusCode}
    Comment    Should Be Equal    ${actualResponse}    ${expectedResponse}
    [Return]    ${notificationDate }    ${updatedPayload}

POST Agent Send a Message to Enrollee
    [Arguments]    ${tc_name}
    comment    This keyword is used to read data from Excel. It takes filePath, testcase name and sheet name as the arguments
    ${data}    CustomLibrary.Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${tc_name}    Enrollink
    ${endpoint}    Get From Dictionary    ${data}    Endpoint
    ${payload}    Get From Dictionary    ${data}    Payload
    ${notificationDate}    CustomLibrary.getTimeForTimezone    UTC
    ${updatedPayload}    Replace String    ${payload}    SYSDATE    ${notificationDate }
    log    ${updatedPayload}
    ${expectedStatusCode}    Get From Dictionary    ${data}    Expected_Response_Code
    Comment    ${expectedResponse}    Get From Dictionary    ${data}    Expected_Response
    Comment    ${sysdate}    Get Time
    comment    This keyword is used to send POST Request.It takes URL,JWT Token and payload as the arguments.
    Sleep    5s
    ${actualResponse}    ${actualResponseCode}    APILibrary.Send Post Request    ${Enrollink_URL}/${endpoint}    ${jwtToken_Enrollink}    ${updatedPayload}
    comment    This keyword is used to validate the actual status code and expected status code
    APILibrary.Validate Status Code    ${actualResponseCode}    ${expectedStatusCode}
    Comment    Should Be Equal    ${actualResponse}    ${expectedResponse}
    [Return]    ${notificationDate}    ${updatedPayload}

POST Update Change Request of Enrollee
    [Arguments]    ${tc_name}
    [Documentation]    Steps:
    ...
    ...    1. Read test data from excel
    ...
    ...    2. Send the request to the API with change request details
    ...
    ...    3. Validate the status code
    ...
    ...    4.Validate actual and expected responses
    comment    This keyword is used to read data from Excel. It takes filePath, testcase name and sheet name as the arguments
    Log    ${TESTDATA_FOLDER}/TestData.xlsx
    Log    ${tc_name}
    ${data}    Get Ms Excel Row Values Into Dictionary Based On Key    ${TESTDATA_FOLDER}/TestData.xlsx    ${tc_name}    Enrollink
    ${endpoint}    Get From Dictionary    ${data}    Endpoint
    ${payload}    Get From Dictionary    ${data}    Payload
    ${startDate}    get current date ymd
    ${updatedPayload}    Replace String    ${payload}    SYSDATE    ${startDate}
    log    ${updatedPayload}
    ${expectedStatusCode}    Get From Dictionary    ${data}    Expected_Response_Code
    ${expectedResponse}    Get From Dictionary    ${data}    Expected_Response
    ${actualResponse}    ${actualResponseCode}    Send Post Request    ${Enrollink_URL}/${endpoint}    ${jwtToken_Enrollink}    ${updatedPayload}
    comment    This keyword is used to validate the actual status code and expected status code
    Validate Status Code    ${actualResponseCode}    ${expectedStatusCode}
    Should Be Equal    ${actualResponse}    ${expectedResponse}
