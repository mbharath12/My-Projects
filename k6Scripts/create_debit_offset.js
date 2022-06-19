import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


// Get URLs
const urlData = JSON.parse(open('./support_data.json'));
const createDebitOffsetJson = JSON.parse(open("./create_credit_offset_json.json"));
const allocationTypes = ["NONE","PRINCIPAL", "INTEREST", "DEFERRED_INTEREST"];

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

//#####Create Debit Offset function####//
export default function(data) {
    let accessTokenValue = data;

    let randomUser = csvData[Math.floor(Math.random() * csvData.length)];

    let createDebitOffsetUrl = urlData.accountsUrl+
    "/" + randomUser.accountId +"/line_items/debit_offsets";

    createDebitOffsetJson["original_amount_cents"] = randomIntBetween(10, 1000);
    createDebitOffsetJson["allocation"] = allocationTypes[Math.floor(Math.random() * allocationTypes.length)];
    // Delete the "allocation" key, if its value happens to be "NONE"
    if (createDebitOffsetJson["allocation"] == "NONE") {
        delete createDebitOffsetJson.allocation;
    }
    //Headers for debit offset creation request
    let createDebitOffsetParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    // POST Create Debit Offset
    let debitOffset = http.post(createDebitOffsetUrl,JSON.stringify(createDebitOffsetJson), createDebitOffsetParams);

    // Assertions 
    check(debitOffset, {
        'Create Debit Offset Response is 200': (res) => res.status === 200
    });
 

}
