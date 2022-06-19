import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";


/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
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

/** Get Amortization Schedule */
export function getAmortizationSchedule(data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];


  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };
  /** amortization schedule Start */
  let amortizationSchedule = http.get(
    `${supportData.accountsUrl}/${randomAcct['accountId']}/amortization_schedule`,
    createAccountParams
  );

  /** Assertions on Amortization Schedule Response */
  check(amortizationSchedule, {
    "Amortization Schedule Response is 200": (amortizationSchedule) => amortizationSchedule.status === 200,
  });
}
