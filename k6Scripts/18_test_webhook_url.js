import http from 'k6/http';
import papaparse from './papaparse.js';
import { check } from 'k6';
import { scenario } from 'k6/execution';
import { sleep } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { SharedArray } from "k6/data";

// Get URLs
const data = JSON.parse(open('./support_data.json'));



// Scenario 1 Start
export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '10m', target: 10 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'], // http errors should be less than 2%
    http_req_duration: ['p(99)<200'], // 99% requests should be below 200MS
  },
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
      },
    },
  },
}


//#####Get Access Token function####//
export default function() {
    let accessTokenValue = getAuthToken();


    // #####Webhook URL request start#####// 

    // Get Webhook URL
    let getWebhookUrl = data.organizationUrl + "/subscribe/test";

    //Get webhook headers
    let getWebhookParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    // Test webhook URL GET request
    let getWebhookResponse = http.get(getWebhookUrl, getWebhookParams);



    // Assertions "description": "Event triggered.
    check(getWebhookResponse, {
        'getWebhookResponse Response is 201': (res) => res.status == 201,
        'getWebhookResponse Response description is validated': (res) => res.json("body.description") == "Event triggered."

    });
    //console.log("Print getWebhookResponse response ="+ JSON.stringify(getWebhookResponse)); 

}

