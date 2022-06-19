import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createPaymentsJson = JSON.parse(open("./create_payment_json.json"));
const paymentReversalJson = JSON.parse(open("./payment_reversal_json.json"));


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
  

/** Create Payment Start */
export default function (data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];
  createPaymentsJson["original_amount_cents"] = randomIntBetween(10, 1000);


  let createPaymentParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
    tags: {
      name: "createPayment",
  } 
  };

    /** Create Payment Request Start */
  let lineItems = "line_items";
  let payments = "payments";

  let createPayment = http.post(
    supportData.accountsUrl + "/" + randomAcct.accountId + "/" + lineItems + "/" + payments,
    JSON.stringify(createPaymentsJson),
    createPaymentParams
  );

  /** Assertions on Create Payment Response */
  check(createPayment, {
    "Create Payment Response is 200": (createPayment) => createPayment.status == 200,
  });
  
  const createPaymentLineitemId = findBetween(createPayment.body, '"line_item_id":"', '"');

  let createPaymentReversalParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
    tags: {
      name: "createPaymentReversals",
  } 
  };

  let payment_reversal = "payment_reversals";

  let createPaymentReversals = http.post(
    supportData.accountsUrl + "/" + randomAcct.accountId + "/" + lineItems + "/" + payment_reversal + "/" + createPaymentLineitemId,
    JSON.stringify(paymentReversalJson),
    createPaymentReversalParams
  );

  // Assertions on Create Payment Reversals Response
  check(createPaymentReversals, {
    "Create Payment Reverse Response is 200": (createPaymentReversals) => createPaymentReversals.status == 200,
  });
}
