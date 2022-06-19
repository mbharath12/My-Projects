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
const data = JSON.parse(open('./support_data.json'));


// Load CSV file and parse it using Papa Parse
const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./15_get_a_credit_report_data.csv'), {
        header: true
    }).data;
});

// Scenario 2 start
export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 5,
      iterations: csvData.length,
      maxDuration: '58m',
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
              apiKey: '******',
              appKey: '******',

              // optional parameters
              region: 'us',
              metrics: ['http_req_sending', 'my_rate', 'my_gauge'],
              includeDefaultMetrics: true,
              includeTestRunId: true,
            },
          ],
          projectID: 3560313,
          // Test runs with the same name groups test runs together
          name: "22_get_statement_list.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
};


//#####Get statement list function start####//
export default function() {
    let accessTokenValue = getAuthToken();

	// Reading data from CSV file in sequence
	let sequenceUser = csvData[scenario.iterationInTest];

    // Get statement list URL 
					
    let getStatementListUrl = data.accountsUrl + "/" + sequenceUser['accountId'] + "/statements/list";

    //Get statement list headers
    let getStatementListParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    // Get statement list GET request
    let getStatementListResponse = http.get(getStatementListUrl, getStatementListParams);


    // Assertions 
    check(getStatementListResponse, {
        'getStatementList Response is 200': (res) => res.status == 200,
        // 'getStatementListResponse Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    //console.log("Print getStatementListResponse response ="+ JSON.stringify(getStatementListResponse)); 

}
