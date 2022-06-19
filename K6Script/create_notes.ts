import http from "k6/http";
import { check } from "k6";
import { getAuthToken } from "./01_authorization_rc.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

/** Get JSON files */
const supportData = JSON.parse(open("./support_data.json"));
const createNotesJson = JSON.parse(open("./create_notes_json.json"));
const csvData = new SharedArray("Get accounts with Notes ", function() {
  return papaparse.parse(open('./accounts_with_notes.csv'), {
      header: true
  }).data;
});

//Setup funtion to call auth token once
export function setup() {
  let accessTokenValue = getAuthToken();
  return accessTokenValue;
}


/** Create Notes Start */
export function createNotes(data) {
  let accessTokenValue = data;
  let randomAcct = csvData[Math.floor(Math.random() * csvData.length)];

  let createAccountParams = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + accessTokenValue,
    },
  };

  /** Create Notes Start */
  let createNoteString = "notes";

  let createNotes = http.post(
    supportData.accountsUrl + "/" + randomAcct['accountId'] + "/" + createNoteString,
    JSON.stringify(createNotesJson),
    createAccountParams
  );

  /** Assertions on Create Notes Response */
  check(createNotes, {
    "Create Notes Response is 200": (createNotes) => createNotes.status == 200,
  });
 }
