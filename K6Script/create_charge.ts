import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createChargesJson = JSON.parse(open("./create_charge_json.json"));
const csvData = new SharedArray("Get account and line item ID", function() {
  return papaparse.parse(open('./revolving_credit_accounts.csv'), {
      header: true
  }).data;
});

//Setup funtion to call auth token once
export function setup() {
  let accessTokenValue = getAuthToken();
  return accessTokenValue;
}


/** Create Charge Start */
export function createCharge(data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];


  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };

    /** Create Charge Start */
  let createCharge = http.post(
    `${supportData.accountsUrl}/${randomAcct['accountId']}/line_items/charges`,
    JSON.stringify(createChargesJson),
    createAccountParams
  );
  if (createCharge.status != 200) {
    console.log("Created charge for " + createCharge.body + " " + createCharge.status);
  }

  /** Assertions on Create Charge Response */
  check(createCharge, {
    "Create Charge Response is 200": (createCharge) => createCharge.status == 200,
  });

}
