import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
// @ts-ignore
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// Get URLs
const urlData = JSON.parse(open('./support_data.json'));

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    return accessTokenValue;
}

/*
// Scenario Start
export const options = {
    stages: [{
            duration: '1m',
            target: 10
        },
        {
            duration: '60m',
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
          name: "04_get_all_products.js",
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
export default function(data) {
    let accessTokenValue = data;
    //console.log("Print Access Token Value:"+ data);

    // #####Get All Products request start#####// 
    // Get product URL
    let getProductUrl = urlData.createProductUrl + "?offset=1&limit=100";

    //Get all product headers
    let getProductParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        }
    };

    // Get all products GET request
    let getAllProds = http.get(getProductUrl, getProductParams);

    // Assertions 
    check(getAllProds, {
        'GetAllProducts Response is 200': (res) => res.status == 200,
        // 'getAllProds Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    //console.log("Print getAllProds response ="+ JSON.stringify(getAllProds)); 

}
