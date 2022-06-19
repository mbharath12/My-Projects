import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";

/** Get JSON files */
const supportData = JSON.parse(open("./Support_data.json"));
const createAccountJson = JSON.parse(open("./create_account_json.json"));

//Setup funtion to call auth token once
export function setup() {
  let accessTokenValue = getAuthToken();
  return accessTokenValue;
}

/** Create Account Start */
export function createAccount(data) {
  let accessTokenValue = data;

  console.log("create account JSON " + JSON.stringify(createAccountJson));

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
    "Create Account Response is 200": (createAccount) => createAccount.status == 200,
  });
}
