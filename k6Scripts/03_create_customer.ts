import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";

// Get URLs
const urldata = JSON.parse(open('./support_data.json'));

// Get create customer JSON body
const createCustomerJson = JSON.parse(open('./03_create_customer_json.json'));

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}
/*
// Scenario Start
export const options = {
    stages: [{
            duration: '30s',
            target: 7
        },
        {
            duration: '30m',
            target: 7
        },
        {
            duration: '30s',
            target: 0
        },
    ],
    thresholds: {
        http_req_failed: ['rate<0.02'], // http errors should be less than 2%
        http_req_duration: ['p(99)<200'], // 99% requests should be below 200MS
    },
    ext: {
        loadimpact: {
          apm: [
            {
              provider: 'datadog',
              apiKey: '****',
              appKey: '****',

              // optional parameters
              region: 'us',

              metrics: ['http_req_sending', 'my_rate', 'my_gauge'],
              includeDefaultMetrics: true,
              includeTestRunId: true,
            },
          ],
          projectID: 3560313,
          // Test runs with the same name groups test runs together
          name: "03_create_customer.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
}
*/

//#####Get Access Token function####//
export function createCustomerFunction(data) {
 //  let accessTokenValue = data;

//export default function(data) {
  let accessTokenValue = data;
	
    //##### Create Customer function#####//
    let createCustUrl = urldata.createCustUrl;

    //create customer headers
    let createCustParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    //console.log("Print createCustParams ="+ createCustParams); 

    // create customer POST request
    let createCust = http.post(createCustUrl, JSON.stringify(createCustomerJson), createCustParams);


    // Assertions 
    check(createCust, {
        'createCust Response is 200': (res) => res.status == 200,
        'createCust Response Address State validated': (res) => res.json("address_state") === 'WY',
    });
     //console.log("Print CreateCustomerResponse ="+ JSON.stringify(createCust)); 

}
