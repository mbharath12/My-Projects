import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const changeLineItemStatusJson = JSON.parse(open("./change_lineitem_status_json.json"));
const lineItemStatusValues = ["VALID","INVALID", "OFFSET", "PENDING", "AUTHORIZED", "DECLINED", "VOID", "POSTED"];

const csvData = new SharedArray("Get account and line item ID", function() {
  return papaparse.parse(open('./change_line_item_status_onlypayment.csv'), {
      header: true
  }).data;
});

//Setup funtion to call auth token once
export function setup() {
  let accessTokenValue = getAuthToken();
  return accessTokenValue;
}


/** Create Account Start */
export function changeLineItemStatus(data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];
  changeLineItemStatusJson["line_item_status"] = lineItemStatusValues[Math.floor(Math.random() * lineItemStatusValues.length)];

  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };

  /** Change Status of a Line Item */

  let changeLineItemStatus = http.put(
    `${supportData.accountsUrl}/${randomAcct['accountId']}/line_items/${randomAcct['lineItemId']}`,
    JSON.stringify(changeLineItemStatusJson),
    createAccountParams
  );
  
  /** Assertions on Change Status of a Line Item Response */
  check(changeLineItemStatus, {
    "Change LineItem Status Response is 200": (changeLineItemStatus) => changeLineItemStatus.status === 200,
  });

}
