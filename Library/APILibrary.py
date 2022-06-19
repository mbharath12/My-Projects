import os
import requests
import ast
import subprocess
import time
import json
import requests
import base64
import jsonpath_rw
import jwt
import requests.packages.urllib3
requests.packages.urllib3.disable_warnings() 

class APILibrary:


    
    def __init__(self):
        pass
    
    def Generate_Authentication_Token_Linux(self,userKeyValue,pulicKeyPath):
        """Returns the temporary token used to generate JWT token """
        try:
            uniqueKey = os.popen('echo -n '+userKeyValue+'|base64')
            data = uniqueKey.read()
            authenticationkey = os.popen("echo '"+data+"+date +%s' | openssl rsautl -pubin -inkey "+pulicKeyPath+" -encrypt -pkcs | base64 | tr -d '[:space:]'")
            key = authenticationkey.read()
            return key.strip()
        except Exception as e:
            return e

    def Generate_Authentication_Token(self,userKeyValue):
        """Returns the temporary token used to generate JWT token """
        try:
            """ The below command converts the user key value to base64 format """
            bashCommand = "echo -n " + userKeyValue + "|base64"
            output = subprocess.check_output(['bash', '-c', bashCommand])
            data = output.decode("utf-8")
            print(output.decode("utf-8"))
            """The below command uses the base64 format of userkeyvalue and public key(.pem) file and generates the authentication key"""
            command = "cd ~; cd /mnt/c/Windows/System32;echo '" + data + "`date +%s`' | openssl rsautl -pubin -inkey autotest_int.pem -encrypt -pkcs |  base64  | tr -d '[:space:]'"
            output = subprocess.check_output(['bash', '-c', command])
            print(output.decode("utf-8"))
            return output.decode("utf-8")
        except Exception as e:
            return e
                


    def Generate_JWT_Token(self,url,client,key):
        """ Sends the Request to eOmis authentication API and returns JWT Token"""
        try:
            payload = ""
            print('key is',key)
            print(client)
            headers = {
                'Content-Type': "application/json",
                'authenticationkey': key,
                'client': client
                }
            response = requests.request("POST", url, data=payload, headers=headers,verify=False)
            print(response.text)
            responseToken = str(response.text).replace("\"","")
            jwtToken = "Bearer "+responseToken
            print("Appanded token: "+"Bearer "+responseToken)
            return jwtToken,response.status_code
        except Exception as e:
            return e,None

    def Send_Get_Request(self,url,jwtToken,params=None):
        """ Sends the GET Request to eOmis API and returns Response Body and Status Code"""
        try:
            if not params is None:
                params = ast.literal_eval(params)
            headers = {'Content-Type': "application/json",'authorization':jwtToken}
            response = requests.request("GET", url, headers=headers, params=params,verify=False)
            return response.text,response.status_code
        except Exception as e:
            return e,None

    def Send_Post_Request(self,url,jwtToken,data,params=None):
        """ Sends the POST Request to eOmis API and returns Response Body and Status Code"""
        try:
            if not params is None:
                params = ast.literal_eval(params)
            headers = {'Content-Type': "application/json",'authorization':jwtToken}
            response = requests.request("POST", url, headers=headers, data=data ,verify=False)
            return response.text,response.status_code
        except Exception as e:
            return e,None
        
    def Send_Put_Request(self,url,jwtToken,data,params=None):
        """ Sends the PUT Request to eOmis API and returns Response Body and Status Code"""
        try:
            if not params is None:
                params = ast.literal_eval(params)
            headers = {'Content-Type': "application/json",'authorization':jwtToken}
            print(data)
            response = requests.request("PUT", url, headers=headers, data=data,verify=False)
            return response.text,response.status_code
        except Exception as e:
            return e,None

    def Send_Delete_Request(self,url,jwtToken,data):
        """ Sends the DELETE Request to eOmis API and returns Response Body and Status Code"""
        try:
            headers = {'Content-Type': "application/json",'authorization':jwtToken}
            print(data)
            url = url+"/"+str(data)
            print("URL: ",url)
            response = requests.request("DELETE", url,headers=headers,verify=False)
            print(response)
            return response.text,response.status_code
        except Exception as e:
            return e,None
        
    def Validate_Response_Code(self,requestType,responseCode):
        """ Validates the Status code based on Response Type"""
        if requestType == "POST":
            assert (responseCode == 201),"Actual and Expected Status Codes are not Equal"
            return "Actual and Expected Status Codes are Equal"
        elif requestType == "GET":
            assert (responseCode == 200),"Actual and Expected Status Codes are not Equal"
            return "Actual and Expected Status Codes are Equal"
        elif requestType== "PUT":
            assert (responseCode == 201),"Actual and Expected Status Codes are not Equal"
            return "Actual and Expected Status Codes are Equal"

    def Validate_Status_Code(self,actualStatusCode,expectedStatusCode):
        """ Validates the Status code"""
        assert (int(actualStatusCode) == int(expectedStatusCode)),"Actual and Expected Status Codes are not Equal, Actual is : "+str(actualStatusCode)+" and Expected is : "+str(expectedStatusCode)
        return "Actual and Expected Status Codes are Equal"


    def Compare_JSON_Response(self,actualResponse,expectedResponse):
        """Compares the JSON data and returns true if both actual and expected responses are equal """ 
        actualData = json.loads(actualResponse)
        print("Actual Data: ",actualData[0])
        expectedData = json.loads(expectedResponse)
        status = actualData[0] == expectedData[0]
        assert status == True,"Actual and Expected Responses are not Equal, Actual is : "+str(actualData[0])+" and Expected is : "+str(expectedData[0])

    def Compare_JSON_Data_Based_On_Key(self,keyName,actualResponse,expectedResponse):
        """Compares the JSON data based on key and returns true if both actual and expected responses are equal """ 
        actualData = json.loads(actualResponse)
        print (len(actualData))
        itemsList=[]
        for item in actualData:
            itemsList.append(item[keyName])
        expectedData = json.loads(expectedResponse)
        itemsList.sort()
        expectedData.sort()
        status = itemsList == expectedData
        print ("expected Response is ",expectedData,"actual Response is ",itemsList)
        assert status == True,"Actual and Expected Responses are not Equal"

    def Compare_Response_Body(self,actualResponse,expectedResponse):
        """ compares the Tuple and returns Status"""
        return cmp(actualResponse[0],expectedResponse[0])

    def Generate_SessionID(self,url,data):
        """Returns Session ID if credentials are valid"""
        try:
           headers = {
                   'Content-Type': "application/json",
                   }      
           responseBody = requests.request("PUT", url, data=data, headers=headers)
           statusCode=responseBody.status_code
           return responseBody.text,statusCode
        except Exception as e:
            return e,statusCode

    def Send_Device_Data_Request_Payload(self,url,methodType,payload=None):
        """Sends PUT request with Body to Device Data API and returns Response body and Status code"""
        try:
            payload=payload
            headers = {
                'Content-Type': "application/json",
                }
            response = requests.request(methodType, url, data=payload, headers=headers)
            print(response.text)
            return response.text,response.status_code
        except Exception as e:
            return e,None


    def Decode_JWT_Token(self,jwtToken):
        """Decodes the Base64 JWT token"""
        try:
            token = jwtToken.split('.')
            command = "echo "+token[1]+" | base64 --decode"
            output = subprocess.check_output(['bash','-c', command])
            data = output.decode("utf-8")
            print(data)
            return data
        except Exception as e:
            return e
    def Get_Data_From_JSON(self,responseBody,pathToElement):
        """Returns the data from the JSON based on the path specified"""
        try:
            data = json.loads(responseBody)
            jsonData = jsonpath_rw.parse(pathToElement)
            return [match.value for match in jsonData.find(data)][0]
        except Exception as e:
            return e

    def Encode_To_Base64(self,data):
        """Converts the string to base64 and returns base64 value"""
        try:
            bashCommand = "echo -n "+data+"|base64"
            output = subprocess.check_output(['bash', '-c', bashCommand])
            encodedData = output.decode("utf-8")
            print(encodedData)
            return encodedData
        except Exception as e:
            return e

    def Decode_JWT_Token(self,token):
        try:
            data = jwt.decode(token,verify=False)
            print(data)
            return data
        except Exception as e:
            return e

    def Get_JSON_Length(self,data):
        """Returns the Length of JSON"""
        try:
            data = json.loads(data)
            return len(data)
        except Exception as e:
            return None

    def Basic_Authentication_AgentMobileApp(self,url,headers):
        """This test case inputs the username and password and returns the JWTToken"""
        try:
            headers = headers
            response = requests.request("POST", url, headers=headers)
            responseToken = str(response.text).replace("\"","")
            jwtToken = "Bearer "+responseToken
            print ("responses is", response)
            return jwtToken,response.status_code
        except Exception as e:
            return e,None

    def Add_User_Client_Schema_Details_To_Token(self,url,payload,headers):
        """ Sends the Request to eOmis authentication API and returns JWT Token"""
        try:
            payload = payload
            headers = headers
            response = requests.request("POST", url, data=payload, headers=headers,verify=False)
            print(response.text)
            responseToken = str(response.text).replace("\"","")
            #jwtToken = "Bearer "+responseToken
            jwtToken = responseToken
            return jwtToken,response.status_code
        except Exception as e:
            return e,None

    def Generate_JWTToken_Using_UserKeyValue_AgentAuth(self,url,headers):
        """This keyword will take the user key value as input and returns response with token and status code"""
        try:
            headers = headers
            response = requests.request("POST",url,headers=headers)
            return response.status_code
        except Exception as e:
            return e,None
        
a = APILibrary()
'''data = a.Compare_Particular_Objects('id',actualResponse,expectedResponse)
print(data)'''
