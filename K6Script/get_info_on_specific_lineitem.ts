import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
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

/** Get Info on Specific Line Item */
export function getInfoOnSpecificLineItem(data) {
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
    `${supportData.accountsUrl}/${randomAcct['accountId']}/line_items/${randomAcct['lineItemId']}`,
    createAccountParams
  );

  /** Assertions */
  check(getSpecificLineItemSpecificAccount, {
    "Get Specific Line Item Specific Account Response is 200": (getSpecificLineItemSpecificAccount) =>
      getSpecificLineItemSpecificAccount.status === 200,
  });
 
}
