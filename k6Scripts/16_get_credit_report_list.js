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


// Load CSV file and parse it using PapaParse
const csvData = new SharedArray("Get account ID & report ID", function() {
    return papaparse.parse(open('./15_get_a_credit_report_data.csv'), {
        header: true
    }).data;
});

// Scenario 2 start
export const options = {
  scenarios: {
    'use-all-the-data': {
      executor: 'shared-iterations',
      vus: 20,
      iterations: csvData.length,
      maxDuration: '11m',
    },
  },
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
};


//#####Get Access Token function####//
export default function() {
    let accessTokenValue = getAuthToken();

// Reading data from CSV file in sequence
	let sequenceUser = csvData[scenario.iterationInTest];


    // #####Get All Products request start#####// 

    // Get Credit report list URL 
    let getCreditReportUrl = data.accountsUrl + "/" + sequenceUser.accountId + "/credit_reports/list";

    //Get credit report list headers
    let getCreditReportParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    // Get Credit report list request
    let getCreditReportResponse = http.get(getCreditReportUrl, getCreditReportParams);



    // Assertions 
    check(getCreditReportResponse, {
        'Get Credit Report list Response is 200': (res) => res.status == 200,
        // 'getCreditReportResponse Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    //console.log("Print getCreditReportResponse response ="+ JSON.stringify(getCreditReportResponse)); 
}
