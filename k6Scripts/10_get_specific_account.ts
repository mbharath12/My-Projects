import http from 'k6/http';
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { SharedArray } from "k6/data";

// Get URLs
const data = JSON.parse(open('./support_data.json'));

// Load CSV file and parse it using Papa Parse
const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./10_get_specific_account_data.csv'), {
        header: true
    }).data;
});
/*
// Scenario Start
export const options = {
    stages: [{
            duration: '30s',
            target: 10
        },
        {
            duration: '58m',
            target: 10
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
          name: "10_get_specific_account.js",
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
export default function() {
    let accessTokenValue = getAuthToken();

    // Pick Random account ID from CSV
    let randomUser = csvData[Math.floor(Math.random() * csvData.length)];
	
	//console.log("Record read from CSV file " + randomUser.accountId);


    // #####Get Specific Account request start#####// 

    // Get Account URL
    let getAccountsUrl = data.accountsUrl + "/" + randomUser['accountId'];

    //Get Specific Account headers
    let getAccountsParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    // Get Specific account GET request
    let getSpecificAccount = http.get(getAccountsUrl, getAccountsParams);


    // Assertions 
    check(getSpecificAccount, {
        'GetAllProducts Response is 200': (res) => res.status == 200,
        // 'getSpecificAccount Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
     //console.log("Print getSpecificAccount response ="+ JSON.stringify(getSpecificAccount)); 

}
