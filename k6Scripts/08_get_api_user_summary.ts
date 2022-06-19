import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// Get URLs
const urlData = JSON.parse(open('./support_data.json'));

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

// Scenario Start
export const options = {
    stages: [{
            duration: '30s',
            target: 5
        },
        {
            duration: '58m',
            target: 5
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
          name: "08_get_api_user_summary.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
}



//#####Get Access Token function####//
export default function(data) {
    let accessTokenValue = data;

    // #####Get All API Users summary request start#####//
    // Get API users URL 
    let getApiUsersUrl = urlData.apiUsersUrl + "/summary";

    // Get API summary headers
    let getApiUsersParam = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    //console.log("Print CreateProduct ="+ Upd); 
    // Get API summary GET request
    let getApiUserSummary = http.get(getApiUsersUrl, getApiUsersParam);



    // Assertions 
    check(getApiUserSummary, {
        'getApiUserSummary Response is 200': (res) => res.status == 200,
        // 'getApiUserSummary Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    //console.log("Print getApiUserSummary response ="+ JSON.stringify(getApiUserSummary)); 

}
