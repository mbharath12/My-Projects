import http from 'k6/http';
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { check } from 'k6';
// @ts-ignore
import { scenario } from 'k6/execution';
//import { sleep } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { SharedArray } from "k6/data";

// Get URLs 
const urlData = JSON.parse(open('./support_data.json'));

// Get Payment processor JSON
const updatePaymentProcessorJson = JSON.parse(open('./14_update_payment_processor_json.json'));

// Load CSV file and parse it using Papa Parse
const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./14_update_payment_processor_data.csv'), {
        header: true
    }).data;
});

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

/* 	
// Scenario 1 Start
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '10m', target: 50 },
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

// Scenario 2 start
export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 2,
      iterations: csvData.length,
      maxDuration: '30m',
    },
  },
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
          name: "14_update_payment_processor.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
}


//#####Update Payment Processer function start####//
export default function(data) {
    let accessTokenValue = data;

	// Reading data from CSV file in sequence
	let sequenceUser = csvData[scenario.iterationInTest];


    // #####Update payment processor URL create#####// 
       let updatePaymentProcessorUrl = urlData.accountsUrl + "/" + sequenceUser['accountId'] + "/payment_processor_config";


// Update payment processor Params define
    let updatePaymentProcessorParam = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    //console.log("Print CreateProduct ="+ Upd); 
	// PUT request
    let updatePaymentResponse = http.put(updatePaymentProcessorUrl, JSON.stringify(updatePaymentProcessorJson), updatePaymentProcessorParam);



    // Assertions 
    check(updatePaymentResponse, {
        'Update Payment Processor Response is 200': (res) => res.status == 200,
        // 'Payment Processor Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
     //console.log("Print Payment Processor response ="+ JSON.stringify(updatePaymentResponse)); 

}
