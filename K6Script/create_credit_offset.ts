import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
// @ts-ignore
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


// Get URLs
const urlData = JSON.parse(open('./support_data.json'));
const createCreditOffsetJson = JSON.parse(open("./create_credit_offset_json.json"));
const allocationstrs = ["FEE", "INTEREST", "DEFERRED_INTEREST"];

const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./accounts_with_creditoffset.csv'), {
        header: true
    }).data;
});

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

//#####Create Credit Offset function####//
export function createCreditOffset(data) {
    let accessTokenValue = data;

    let randomUser = csvData[Math.floor(Math.random() * csvData.length)];

    let createCreditOffsetUrl = urlData.accountsUrl+
    "/" + randomUser['accountId'] +"/line_items/credit_offsets";

    createCreditOffsetJson["original_amount_cents"] = randomIntBetween(10, 1000);
    createCreditOffsetJson["allocation"] = allocationstrs[Math.floor(Math.random() * allocationstrs.length)];

    //Headers for credit offset creation request
    let createCreditOffsetParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        },
        tags: {
            name: "createCreditOffset",
        }
    };

    // POST Create Credit Offset
    let creditOffset = http.post(createCreditOffsetUrl,JSON.stringify(createCreditOffsetJson), createCreditOffsetParams);
    // Assertions 
    check(creditOffset, {
        'Create Credit Offset Response is 200': (res) => res.status === 200
    });
 

}
