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

// Get Payment processor JSON
const subscribeEventsJson = JSON.parse(open('./21_subscribe_to_events_json.json'));



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



//#####Subscribe to events function start####//
export default function() {
    let accessTokenValue = getAuthToken();

    // #####Subscribe to events URL create#####// 
       let subscribeEventsUrl = data.organizationUrl + "/subscribe";


// Subscribe to events Params define
    let subscribeEventsParam = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

	// Subscribe to events PUT request
    let subscribeEventsResponse = http.put(subscribeEventsUrl, JSON.stringify(subscribeEventsJson), subscribeEventsParam);


    // Assertions "description": "Webhook created"
    check(subscribeEventsResponse, {
        'subscribeEvents  Response is 200': (res) => res.status == 200,
        'subscribeEvents Response description validated': (res) => res.json("description") === 'Webhook created',

    });
     //console.log("Print Payment Processor response ="+ JSON.stringify(subscribeEventsResponse)); 

}
