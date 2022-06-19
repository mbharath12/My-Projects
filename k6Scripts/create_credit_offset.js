import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


// Get URLs
const urlData = JSON.parse(open('./support_data.json'));
const createCreditOffsetJson = JSON.parse(open("./create_credit_offset_json.json"));
const allocationstrs = ["FEE", "INTEREST", "DEFERRED_INTEREST"];

const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./get_account_id_data.csv'), {
        header: true
    }).data;
});

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

// Scenario Start
export const options = {
    stages: [{
            duration: '1m',
            target: 10
        },
        {
            duration: '10m',
            target: 10
        },
        {
            duration: '1m',
            target: 0
        },
    ],
    thresholds: {
        http_req_failed: ['rate<0.02'], // http errors should be less than 2%
        http_req_duration: ['p(99)<200'], // 99% requests should be below 200MS
    },
    ext: {
        loadimpact: {
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
}

//#####Create Credit Offset function####//
export default function(data) {
    let accessTokenValue = data;

    let randomUser = csvData[Math.floor(Math.random() * csvData.length)];

    let createCreditOffsetUrl = urlData.accountsUrl+
    "/" + randomUser.accountId +"/line_items/credit_offsets";

    createCreditOffsetJson["original_amount_cents"] = randomIntBetween(10, 1000);
    createCreditOffsetJson["allocation"] = allocationstrs[Math.floor(Math.random() * allocationstrs.length)];

    //Headers for credit offset creation request
    let createCreditOffsetParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    // POST Create Credit Offset
    let creditOffset = http.post(createCreditOffsetUrl,JSON.stringify(createCreditOffsetJson), createCreditOffsetParams);
    // Assertions 
    check(creditOffset, {
        'Create Credit Offset Response is 200': (res) => res.status === 200
    });
 

}
