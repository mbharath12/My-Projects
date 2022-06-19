import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const csvData = new SharedArray("Get account Ids ", function() {
  return papaparse.parse(open('./accounts_for_getnotes.csv'), {
      header: true
  }).data;
});

//Setup funtion to call auth token once
export function setup() {
  let accessTokenValue = getAuthToken();
  return accessTokenValue;
}

/** Get Notes Start */
export function getNotes(data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];

  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };

   /** Get Notes Request Start */
  let getNotesResponse = http.get(supportData.accountsUrl + "/" + randomAcct['accountId'] + "/notes", createAccountParams);
  if (getNotesResponse.status != 200) {
    console.log("Get Notes output " + getNotesResponse.body + " " +  getNotesResponse.url );
  }
  /** Assertions on Get Notes Response */
  check(getNotesResponse, {
    "Get Notes Response is 200": (getNotesResponse) => getNotesResponse.status == 200,
  });
}
