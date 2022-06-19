// @ts-ignore
import { findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import {
  getAuthToken,
  createPayment,
  createCharge,
  getAccount,
  getAllStatements,
  getAllLineitems,
  createManualFees,
  reversePayment,
  getAMSchedule,
  createFeeWaiver,
  getSpecificLineItem,
  getSpecificStatement,
} from "./support.js";
import { SharedArray } from "k6/data";
// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import execution from "k6/execution";

// Get URLs
let accessTokenValue;
const createPaymentJson = JSON.parse(open("./create_payment_json.json"));
const createManualFeeJson = JSON.parse(open("./create_manualfee_json.json"));
const createChargeJson = JSON.parse(open("./create_charge_json.json"));
const paymentReversalJson = JSON.parse(open("./payment_reversal_json.json"));
const feeWaiverJson = JSON.parse(open("./fee_waiver_json.json"));

// Use acct_typeinstallments_withactivities.csv for AM and accts_with_lineitems_and_statements.csv
const csvData = new SharedArray("Get account and line item ID", function() {
    return papaparse.parse(open('./acct_typeinstallments_withactivities.csv'), {
        header: true
    }).data;
  });

let testduration = '58m'


//const accessTokenValue = getAuthToken();
export function setup() {
  accessTokenValue = getAuthToken();
  return accessTokenValue;
}

  // Scenario Start
export const options = {
  scenarios: { 
    scnCreatePaymentandReversePayment: {
      executor: 'constant-arrival-rate',
      rate: 6,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 1, 
      exec: 'scnCreatePaymentandReversePayment', 

    },
    scnCreateCharge: {
      executor: 'constant-arrival-rate',
      rate: 4,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 1, 
      exec: 'scnCreateCharge', 
    }, 
    scnGetAccount: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 2, 
      exec: 'scnGetAccount', 
    },
    scnGetAllStatements: {
      executor: 'constant-arrival-rate',
      rate: 4,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 1, 
      exec: 'scnGetAllStatements', 
    },
    scnGetSpecificLineItem: {
      executor: 'constant-arrival-rate',
      rate: 11,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 2, 
      exec: 'scnGetSpecificLineItem', 
    },
    scnGetSpecificStatement: {
      executor: 'constant-arrival-rate',
      rate: 11,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 2, 
      exec: 'scnGetSpecificStatement', 
    },
    scnGetAllLineItems: {
      executor: 'constant-arrival-rate',
      rate: 4,
      timeUnit: '1m', 
      duration: testduration,
      preAllocatedVUs: 1,
      exec: 'scnGetAllLineItems', 
    },

  },
    thresholds: {
      http_req_failed: ["rate<0.02"], // http errors should be less than 2%
      http_req_duration: ["p(99)<200"], // 99% requests should be below 200MS
    },
    
  //summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
    /*ext: {
      loadimpact: {
        distribution: {
          "amazon:us:ashburn": { "loadZone": "amazon:us:ashburn", "percent": 100 }
        }
      }
    }
    ext: {
      loadimpact: {
        projectID: 3570269,
        name: "account_activities_realtime",
        distribution: {
          "amazon:us:ashburn": { "loadZone": "amazon:us:ashburn", "percent": 100 }
        }
        }
    }
  }*/
  ext: {
    loadimpact: {
      apm: [
        {
          provider: "datadog",
          apiKey: "*******",
          appKey: "*******",

          // optional parameters
          region: "us",

          metrics: ["http_req_sending", "my_rate", "my_gauge"],
          includeDefaultMetrics: true,
          includeTestRunId: true,
        },
      ],
      projectID: 3572271,
      // Test runs with the same name groups test runs together
      name: "02_account_concurrent_APIcalls",
      distribution: {
        "amazon:us:ashburn": {
          loadZone: "amazon:us:ashburn",
          percent: 100,
        },
      },
    },
  }
}



export function scnGetAMSchedule(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "getAMSchedule",
    },
  };

  // get AM Schedule for an account
   getAMSchedule(accountId, params);
}
export function scnCreateCharge(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "createCharge",
    },
  };

   //create charge
   createCharge(accountId, createChargeJson, params);
}

export function scnCreatePaymentandReversePayment(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];

  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "createPaymentandReversePayment",
    },
  };

  //create payment
  let createPaymentRes = createPayment(accountId, createPaymentJson, params);
  const createPaymentLineItemId = findBetween(createPaymentRes.body, '"line_item_id":"', '"');
 
  //Payment reversal
  reversePayment(accountId, createPaymentLineItemId, paymentReversalJson, params);
}

export function scnCreatePayment(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];

  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "createPayment",
    },
  };

  //create payment
  createPayment(accountId, createPaymentJson, params);
}

export function scnGetAccount(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "getAccount",
    },
  };
   //get by account id
  getAccount(accountId, params);
}

export function scnGetAllStatements(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "getAllStatement",
    },
  };
  //get all statements
  getAllStatements(accountId, params);;
}

export function scnGetSpecificLineItem(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let lineItemId = sequenceUser['lineItemId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "getSpecificLineItem",
    },
  };
  //Get information on Specific line item
  getSpecificLineItem(accountId, lineItemId, params);
}

export function scnCreateFeeandWaiveFee(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "createFeeandWaiveFee",
    },
  };

  // Create a manual fee for a specific account
  let createManualFeesRes = createManualFees(accountId, createManualFeeJson, params);
  const createManualFeeLineItemId = findBetween(createManualFeesRes.body, '"line_item_id":"', '"');
  //Waive fees for an account
  createFeeWaiver(accountId, createManualFeeLineItemId, feeWaiverJson, params);
 }

export function scnCreateFee(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "createFee",
    },
  };

  // Create a manual fee for a specific account
  createManualFees(accountId, createManualFeeJson, params);
 }

export function scnGetSpecificStatement(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let statementId = sequenceUser['statementId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "getSpecificStatement",
    },
  };

  //Get Specific statement for specific account 
  getSpecificStatement(accountId, statementId, params);
}

export function scnGetAllLineItems(data) {
  accessTokenValue = data;
  let sequenceUser = csvData[execution.scenario.iterationInTest % (csvData.length -1)];
  let accountId = sequenceUser['accountId'];
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + data,
    },
    tags: {
      name: "getAllLineItems",
    },
  };
  //get all lineitems
  getAllLineitems(accountId, params);
}




