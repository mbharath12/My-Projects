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

// Configure Payment Processor JSON
const configurePaymentProcessorJson = JSON.parse(open('./25_configure_payment_processor_repay_json.json'));


/*
// Scenario 1 Start
export const options = {
  stages: [
    { duration: '1m', target: 8 },
    { duration: '10m', target: 8 },
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

*/


//#####Get Access Token function####//
export default function() {
    let accessTokenValue = getAuthToken();

    // #####Configure Payment Processor URL create#####// 
       let configurePaymentProcessorUrl = data.organizationUrl + "/payment_processors";


// Configure Payment Processor Params define
    let configureCreditReportParam = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

	// PUT request
    let configurePaymentProcessorResponse = http.put(configurePaymentProcessorUrl, JSON.stringify(configurePaymentProcessorJson), configureCreditReportParam);


    // Assertions 
    check(configurePaymentProcessorResponse, {
        'Configure payment Processor Response is 200': (res) => res.status == 200,
        'Configure payment Processor Name validated': (res) => res.json("payment_processor_name") === 'REPAY',

    });
     console.log("Print Payment Processor response ="+ JSON.stringify(configurePaymentProcessorResponse)); 

}

