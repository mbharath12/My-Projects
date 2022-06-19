import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
// @ts-ignore
import { findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
// @ts-ignore
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createPaymentsJson = JSON.parse(open("./create_payment_json.json"));


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


/** Create Payment Start */
export function createPayment(data) {
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
    supportData.accountsUrl + "/" + randomAcct['accountId'] + "/" + lineItems + "/" + payments,
    JSON.stringify(createPaymentsJson),
    createPaymentParams
  );
  /** Assertions on Create Payment Response */
  check(createPayment, {
    "Create Payment Response is 200": (createPayment) => createPayment.status == 200,
  });
}
