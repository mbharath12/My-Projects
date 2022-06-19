import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
// @ts-ignore
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


/** Create Manual Fee Start */
export  function createManualFee(data) {
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
    supportData.accountsUrl + "/" + randomAcct['accountId'] + "/" + lineItems + "/" + manualFees,
    JSON.stringify(createManualFeeJson),
    createAccountParams
  );
  if (createManualFee.status != 200) {
    console.log("Create manual fee " + createManualFee.body + " " + createManualFee.status);
  }
  
  /** Assertions on Create Manual Fee Response */
  check(createManualFee, {
    "Create Manual Fee Response is 200": (createManualFee) => createManualFee.status == 200,
  });
}
