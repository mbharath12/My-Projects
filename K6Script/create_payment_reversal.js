import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createAccountJson = JSON.parse(open("./payment_reversal_create_account_json.json"));
const createPaymentsJson = JSON.parse(open("./payment_reversal_create_payment_json.json"));
const paymentReversalJson = JSON.parse(open("./payment_reversal_json.json"));

/** Scenario Start */
export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "30s", target: 10 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"], // http errors should be less than 2%
    http_req_duration: ["p(95)<200"], // 95% requests should be below 200MS
  },
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};

/** Create Account Start */
export default function () {
  let accessTokenValue = getAuthToken();
  let randomName = "PerfAccountTest" + randomString(10);

  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };

  let createAccount = http.post(supportData.accountsUrl, JSON.stringify(createAccountJson), createAccountParams);

  /** Assertions on Create Account Response */
  check(createAccount, {
    "Create Account Response is 200": (createAccount) => createAccount.status === 200,
  });

  /** Find between Function that returns a string from between two other strings. */
  const accountId = findBetween(createAccount.body, '"account_id":"', '"');
  console.log("Create Account Id is = " + accountId);

  /** Create Payment Start */
  let createPayment = http.post(
    `${supportData.accountsUrl}/${accountId}/line_items/payments`,
    JSON.stringify(createPaymentsJson),
    createAccountParams
  );

  /** Assertions on Create Payment Response */
  check(createPayment, {
    "Create Payment Response is 200": (createPayment) => createPayment.status === 200,
  });

  const createPaymentAccountId = findBetween(createPayment.body, '"account_id":"', '"');
  console.log("Create Payment Account Id is: " + createPaymentAccountId);
  const createPaymentLineItemId = findBetween(createPayment.body, '"line_item_id":"', '"');
  console.log("Create Payment Line Item Id is: " + createPaymentLineItemId);

  /** Payment Reversal Start */
  let paymentReversal = http.post(
    `${supportData.accountsUrl}/${accountId}/line_items/payment_reversals/${createPaymentLineItemId}`,
    JSON.stringify(paymentReversalJson),
    createAccountParams
  );

  /** Assertions on Payment Reversal Response */
  check(paymentReversal, {
    "Payment Reversal Response is 200": (paymentReversal) => paymentReversal.status === 200,
  });

  console.log("Payment Reversal Successfully Applied: " + paymentReversal.status);
}
