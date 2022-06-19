import http from 'k6/http';
import { check } from 'k6';
import { getAuthToken } from "./01_authorization_rc.js";

// Get URLs
const urlData = JSON.parse(open('./support_data.json'));
const payoutEntitiesJson = JSON.parse(open("./payout_entities_json.json"));
// setup values to fill in random values to request json at run time
const payoutEntityTypes = ["organization","merchant", "sponsor", "lender"];
const bankRoutingNumbers = ["123456780", "998866783", "996046783"];
const alphanumchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//Setup funtion to call auth token once
export function setup() {
    let accessTokenValue = getAuthToken();
    console.log("Auth token " + accessTokenValue);
    return accessTokenValue;
}

//#####Create Debit Offset function####//
export function payoutEntities(data) {
    let accessTokenValue = data;
    let randomStr = '';
    //prepare a 8 chars long random string
    for (let i = 0; i < 8; i++) {
        randomStr += alphanumchars.charAt(Math.floor(Math.random() * alphanumchars.length));
      }
    // fill in random values in payout entity request json fields
    payoutEntitiesJson["payout_entity_id"] = randomStr;
    payoutEntitiesJson["payout_entity_type"] = payoutEntityTypes[Math.floor(Math.random() * payoutEntityTypes.length)];
    payoutEntitiesJson["bank_routing_number"] = bankRoutingNumbers[Math.floor(Math.random() * bankRoutingNumbers.length)];

    let payoutUrl = urlData.apiBaseUrl + "/payout_entities";
    
    //Headers for debit offset creation request
    let payoutEntitiesParams = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessTokenValue,
            'event_id': '',
        },
        tags: {
            name: "payoutEntities",
        }
    };

    // POST Payout Entities 
    let payoutEntitiesResp = http.post(payoutUrl,JSON.stringify(payoutEntitiesJson), payoutEntitiesParams);
    
    // Assertions 
    check(payoutEntitiesResp, {
        'Payout Entities Response is 200': (payoutEntitiesResp) => payoutEntitiesResp.status === 200
    });
 }
