import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// Get URLs
const urldata = JSON.parse(open('./support_data.json'));

// Get create product JSON
const createProductJson = JSON.parse(open('./02_create_product_json.json'));


//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}
/**
// Scenario Start
export const options = {
    stages: [{
            duration: '30s',
            target: 20
        },
        {
            duration: '58m',
            target: 20
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
          name: "02_create_product.js",
            distribution: {
                'amazon:us:ashburn': {
                    loadZone: 'amazon:us:ashburn',
                    percent: 100
                },
            },
        },
    },
}
**/

//#####Get Access Token function####//
//export default function(data) {
export function createProductFunction(data) {

    let accessTokenValue = data;
    console.log("Print accessTokenValue ="+ JSON.stringify(data)); 

    // #####Create Product request start#####// 

    // Creae Product URL 
    let createProductUrl = urldata.createProductUrl;

    // Randomize external Product ID
    let randomName = "PerfTest" + randomString(10);

    //Form Create Product JSON
    let updateJson = createProductJson;
    updateJson["external_product_id"] = randomName;
    let createProduct = JSON.stringify(updateJson);
	//const createProduct = JSON.stringify({createProductJson, external_product_id: randomName});

    //console.log("Print createProduct ="+ updateJson); 

    // Create Product headers
    let createProductParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    //console.log("Print createProductParams ="+ createProductParams); 
    // Post request
    let createProd = http.post(createProductUrl, createProduct, createProductParams);


    // Assertions 
    check(createProd, {
        'createProd Response is 200': (res) => res.status == 200,
        //'createProd Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    console.log("Print createrProductResponse ="+ JSON.stringify(createProd)); 

}
