import http from 'k6/http';
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { check } from 'k6';
// @ts-ignore
import { scenario } from 'k6/execution';
//import { sleep } from 'k6';
// @ts-ignore
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { SharedArray } from "k6/data";

// Get URLs
const urldata = JSON.parse(open('./support_data.json'));


// Load CSV file and parse it using Papa Parse
const csvData = new SharedArray("Get account ID & Statement ID", function() {
    return papaparse.parse(open('./15_get_a_credit_report_data.csv'), {
        header: true
    }).data;
});

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

// Scenario 2 start
export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 7,
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
              apiKey: '*****',
              appKey: '*****',

              // optional parameters
              region: 'us',
              metrics: ['http_req_sending', 'my_rate', 'my_gauge'],
              includeDefaultMetrics: true,
              includeTestRunId: true,
            },
          ],
          projectID: 3560313,
          // Test runs with the same name groups test runs together
          name: "23_get_statement_by_id.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
};


//#####Get Access Token function####//
export default function(data) {
    let accessTokenValue = data;

// Reading data from CSV file in sequence
	let sequenceUser = csvData[scenario.iterationInTest];


    // #####Get All Products request start#####// 

    // Get product URL "https://rc-api.canopyservicing.com/accounts/17254/statements/274"
						
    let getStatementUrl = urldata.accountsUrl + "/" + sequenceUser['accountId'] + "/statements/" + sequenceUser['statementId'];

    //Get all product headers
    let getStatementParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    //console.log("Print CreateProduct ="+ Upd); 
    // Get all products GET request
    let getStatementResponse = http.get(getStatementUrl, getStatementParams);



    // Assertions 
    check(getStatementResponse, {
        'getStatementList Response is 200': (res) => res.status == 200,
        // 'getStatementResponse Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    //console.log("Print getStatementResponse response ="+ JSON.stringify(getStatementResponse)); 

}
