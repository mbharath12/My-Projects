import http from 'k6/http';
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { check } from 'k6';
// @ts-ignore
import {scenario} from 'k6/execution';
//import { sleep } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { SharedArray } from "k6/data";

// Get URLs
const data = JSON.parse(open('./support_data.json'));

// Load CSV file and parse it using PapaParse
const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./10_get_specific_account_data.csv'), {
        header: true
    }).data;
});


// Scenario2
export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 2,
      iterations: csvData.length,
      maxDuration: '2s',
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
          name: "13_soft_delete_account.js",
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
export default function() {
    let accessTokenValue = getAuthToken();

    // Pick sequenceUser account ID from CSV
	let sequenceUser = csvData[scenario.iterationInTest];
    //console.log("Record read from CSV file " + sequenceUser.accountId);


    // #####Soft Delete request start#####// 

    // Get Account URL
    let getAccountsUrl = data.accountsUrl + "/" + sequenceUser['accountId'];

    //Get Specific Account headers
    let getAccountsParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }	
    };

    // Soft delte request
    let deleteSpecificAccount = http.del(getAccountsUrl, null, getAccountsParams);

	
    // Assertions   
	// Response "description": "Account deleted successfully."
    check(deleteSpecificAccount, {
        'GetAllProducts Response is 200': (res) => res.status == 200,
        'deleteSpecificAccount Response validated': (res) => res.json("description") === 'Account deleted successfully.',

    });
    // console.log("Print deleted Account response ="+ JSON.stringify(deleteSpecificAccount)); 
     console.log("Deleted Account Id is = " + sequenceUser['accountId']);

}
