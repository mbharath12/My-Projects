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
const createDebitOffsetJson = JSON.parse(open("./create_credit_offset_json.json"));
const allocationTypes = ["NONE","PRINCIPAL", "INTEREST", "DEFERRED_INTEREST"];

const csvData = new SharedArray("Get account ID", function() {
    return papaparse.parse(open('./accounts_with_debitoffset.csv'), {
        header: true
    }).data;
});

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

//#####Create Debit Offset function####//
export  function createDebitOffset(data) {
    let accessTokenValue = data;

    let randomUser = csvData[Math.floor(Math.random() * csvData.length)];

    let createDebitOffsetUrl = urlData.accountsUrl+
    "/" + randomUser['accountId'] +"/line_items/debit_offsets";

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
        },
        tags: {
            name: "createDebitOffset",
        }
    };

    // POST Create Debit Offset
    let debitOffset = http.post(createDebitOffsetUrl,JSON.stringify(createDebitOffsetJson), createDebitOffsetParams);

    // Assertions 
    check(debitOffset, {
        'Create Debit Offset Response is 200': (res) => res.status === 200
    });
 }
