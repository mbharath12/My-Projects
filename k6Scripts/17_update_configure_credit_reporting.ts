import http from 'k6/http';
import { check } from 'k6';
// @ts-ignore
import { scenario } from 'k6/execution';
//import { sleep } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
//import { SharedArray } from "k6/data";

// Get URLs 
const data = JSON.parse(open('./support_data.json'));

// Get Config credit report JSON
const configureCreditReportJson = JSON.parse(open('./17_update_configure_credit_reporting_json.json'));

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
          name: "17_update_configure_credit_reporting.js",
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

    // #####Update Configure credit reporting URL create#####// 
       let configureCreditReportUrl = data.organizationUrl + "/credit_reporting";


// Update Configure credit report Params define
    let configureCreditReportParam = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

	// PUT request
    let configureCreditReportResponse = http.put(configureCreditReportUrl, JSON.stringify(configureCreditReportJson), configureCreditReportParam);



    // Assertions 
    check(configureCreditReportResponse, {
        'Update Config Credit Report Response is 200': (res) => res.status == 200,
        // 'Payment Processor Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
     //console.log("Print Payment Processor response ="+ JSON.stringify(configureCreditReportResponse)); 

}

