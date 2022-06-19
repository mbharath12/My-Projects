import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createManualFeeJson = JSON.parse(open("./create_manualfee_json.json"));

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

/** Create Manual Fee Start */
export default function (data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];
  createManualFeeJson["original_amount_cents"] = randomIntBetween(1000, 10000);

  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
    tags: {
      name: "createManualFee",
  }
};

   /** Create Manual Fee request */
  let lineItems = "line_items";
  let manualFees = "manual_fees";

  let createManualFee = http.post(
    supportData.accountsUrl + "/" + randomAcct.accountId + "/" + lineItems + "/" + manualFees,
    JSON.stringify(createManualFeeJson),
    createAccountParams
  );
  
  /** Assertions on Create Manual Fee Response */
  check(createManualFee, {
    "Create Manual Fee Response is 200": (createManualFee) => createManualFee.status == 200,
  });
}
