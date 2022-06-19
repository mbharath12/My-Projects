import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createAccountJson = JSON.parse(open("./get_specific_lineitem_create_account_json.json"));
const csvData = new SharedArray("Get account and line item ID", function() {
  return papaparse.parse(open('./specific_lineitem_list.csv'), {
      header: true
  }).data;
});

//Setup funtion to call auth token once
export function setup() {
  let accessTokenValue = getAuthToken();
  return accessTokenValue;
}

/** Scenario Start */
export const options = {
    stages: [
    { duration: "30s", target: 10 },
    { duration: "30s", target: 10 },
    { duration: "30s", target: 0 },
  ],
  
  thresholds: {
    http_req_failed: ["rate<0.02"], // http errors should be less than 2%
    http_req_duration: ["p(99)<200"], // 99% requests should be below 200MS
  },
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};


/** Get Info on Specific Line Item */
export default function (data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];

  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };

    /** Get Information On a Specific Line Item For a Specific Account Request */
  let getSpecificLineItemSpecificAccount = http.get(
    `${supportData.accountsUrl}/${randomAcct.accountId}/line_items/${randomAcct.lineItemId}`,
    createAccountParams
  );

  /** Assertions */
  check(getSpecificLineItemSpecificAccount, {
    "Get Specific Line Item Specific Account Response is 200": (getSpecificLineItemSpecificAccount) =>
      getSpecificLineItemSpecificAccount.status === 200,
  });
 
}
