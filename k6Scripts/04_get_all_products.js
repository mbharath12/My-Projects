import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// Get URLs
const data = JSON.parse(open('./Support_data.json'));

/*
// Scenario Start
export const options = {
  stages: [
    { duration: '1m', target: 5 },
    { duration: '10m', target: 5 },
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
*/


//#####Get Access Token function####//
export default function() {
    let accessTokenValue = getAuthToken();



    // #####Get All Products request start#####// 

    // Get product URL
    let getProductUrl = data.createProductUrl + "?offset=1&limit=100";

    //Get all product headers
    let getProductParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            // 'customer_id' : '1866', 
            'event_id': '',
        }
    };

    //console.log("Print CreateProduct ="+ Upd); 
    // Get all products GET request
    let getAllProds = http.get(getProductUrl, getProductParams);



    // Assertions 
    check(getAllProds, {
        'GetAllProducts Response is 200': (res) => res.status == 200,
        // 'getAllProds Response Address State validated': (res) => res.json("address_state") === 'WY',

    });
    //console.log("Print getAllProds response ="+ JSON.stringify(getAllProds)); 

}