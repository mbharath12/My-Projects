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

// Configure Issuer processor JSON
const issuerProcessorJson = JSON.parse(open('./20_configure_issuer_processor_json.json'));


// Scenario 1 Start
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '10m', target: 50 },
    { duration: '1m', target: 0 },
  ],
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
}


//#####Configure Issuer Processer function start####//
export default function() {
    let accessTokenValue = getAuthToken();

    // #####Configure Issuer processor URL create#####// 
       let issuerProcessorUrl = data.organizationUrl + "/issuer_processors";


// Configure Issuer processor Params define
    let issuerProcessorParam = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

	// PUT request
    let issuerProcessorResponse = http.put(issuerProcessorUrl, JSON.stringify(issuerProcessorJson), issuerProcessorParam);



    // Assertions 
    check(issuerProcessorResponse, {
        'issuerProcessor  Response is 200': (res) => res.status == 200,
        //'issuerProcessor Response clientID validated': (res) => res.json("client_id") === true,
    });
     //console.log("Print Configure Issuer Processor response ="+ JSON.stringify(issuerProcessorResponse)); 
}
