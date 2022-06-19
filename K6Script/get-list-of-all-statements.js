import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import { findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createAccountJson = JSON.parse(open("./create_account_json.json"));

/** Scenario Start */
export const options = {
  stages: [
    { duration: "30s", target: 5 },
    { duration: "30s", target: 5 },
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

  /** Get List of All Statements For an Account */
  let getAllStatements = http.get(`${supportData.accountsUrl}/${accountId}/statements/list`, createAccountParams);

  /** Assertions on Get List of All Statements For a Account */
  check(getAllStatements, {
    "Get All Statements Response is 200": (getAllStatements) => getAllStatements.status === 200,
  });

  console.log("Get List of All Statements For a Account Successfully Created " + getAllStatements.status);
}
