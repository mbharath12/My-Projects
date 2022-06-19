import http from "k6/http";
import { check, sleep } from "k6";
// @ts-ignore
import {randomIntBetween,} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
   
// Get clientID & Secret
const data = JSON.parse(open("./support_data.json"));

//#####Get Access Token function####//
export function getAuthToken() {
  let url = data.tokenUrl;
  // Payload client ID & secret
  let payload = JSON.stringify({
    client_id: data.clientId,
    client_secret: "" + data.clientSecret,
  });

  //headers
  let params = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // making Get Access Token POST call
  let response = http.post(url, payload, params);

  //console.log("Full response = " + JSON.stringify(response));

  //Grabbing Access Token
  let tokenType = response.json("token_type");
  let accessTokenValue = response.json("access_token");

  // Assertions
  check(response, {
    "AccessToken response is 200": (res) => res.status == 200,
    "AccessToken response token_type is Bearer": (res) =>
      res.json("token_type") === "Bearer",
  });

  return accessTokenValue;
}

export function createCustomer(requestBody, params) {
  let createCust = http.post(
    data.createCustUrl,
    JSON.stringify(requestBody),
    params
  );

  check(createCust, {
    "Create Customer Response is 200": (createCust) =>
      createCust.status === 200,
  });
  const customerId = createCust.json()["customer_id"];

  return customerId;
}

//Create Account
export function createAccount(productId,requestBody, params) {
  requestBody["product_id"] =  productId;

  const createAcc = http.post(
    data.accountsUrl,
    JSON.stringify(requestBody),
    params
  );

  check(createAcc, {
    "Create Account Response is 200": (createAcc) => createAcc.status === 200,
  });

  const accountId = createAcc.json()["account_id"];

  return accountId;
}

//Create Payment
export function createPayment(accountId,requestBody, params) {
  requestBody["original_amount_cents"] = randomIntBetween(100, 6000);

  let createPaymentUrl =
    data.accountsUrl + "/" + accountId + "/line_items/payments";

  const createPayment = http.post(
    createPaymentUrl,
    JSON.stringify(requestBody),
    params
  );
 
  /* Uncomment this block for debugging purposes 
  if (createPayment.status != 200) {
    console.log("create Payment URL " + createPayment.url + " and status " + createPayment.status);
  }
  */

  check(createPayment, {
    "Create Payment Response is 200": (createPayment) =>
      createPayment.status === 200,
  });
  return createPayment;
}

//Create Charge
export function createCharge(accountId,requestBody, params) {
    requestBody["original_amount_cents"] = randomIntBetween(10, 100);
  
    let createChargeUrl =
      data.accountsUrl + "/" + accountId + "/line_items/charges";
  
    const createCharge = http.post(
        createChargeUrl,
      JSON.stringify(requestBody),
      params
    );
  
    check(createCharge, {
      "Create Charge Response is 200": (createCharge) =>
      createCharge.status === 200,
    });
    return createCharge;
  }


//roll time account forward
export function rollAccountForward(accountId, exclusiveEnd, params) {
  
    let rolltimeAccountUrl =
      data.rolltimeAccount + "?account_id=" + accountId + "&exclusive_end=" + exclusiveEnd;
  
    const rollForward = http.patch(
    rolltimeAccountUrl,"",
      params
    );
    //console.log("url "+rolltimeAccountUrl)
  
    check(rollForward, {
      "Rolltime account forward Response is 200": (rollForward) =>
      rollForward.status === 200,
    });
    //\console.log("Staus code :" + rollForward.status)
    //console.log("param"+JSON.stringify(params.headers))
  }

  //get account
export function getAccount(accountId, params) {
  
    let getAccountUrl =
      data.accountsUrl + "/" + accountId;
  
    const getAcc = http.get(
        getAccountUrl,
      params
    );
     /* Uncomment this block for debugging purposes
    if (getAcc.status != 200) {
      console.log("Get Account URL " + getAcc.url + " and status " + getAcc.status);
    }
    */
    check(getAcc, {
      "Get account Response is 200": (getAcc) =>
      getAcc.status === 200,
    });
  }

   //get all statements
export function getAllStatements(accountId, params) {
  
    let getAllStatementUrl =
      data.accountsUrl + "/" + accountId  + "/statements/list";
  
    const getAccState = http.get(
      getAllStatementUrl,
      params
    );
    check(getAccState, {
      "Get all statements Response is 200": (getAccState) =>
      getAccState.status === 200,
      "Get all statements should not be blank": (getAccState) =>
      getAccState.body !== "[]",
    });
  }

//get all lineitems
export function getAllLineitems(accountId, params) {
  
    let getAllLineitemsUrl =
      data.accountsUrl + "/" + accountId +"/line_items";
  
    const getAcc = http.get(
        getAllLineitemsUrl,
      params
    );
  
    check(getAcc, {
      "Get all lineitems Response is 200": (getAcc) =>
      getAcc.status === 200,
      "Get all line items should not be blank": (getAcc) =>
      getAcc.body !== "[]",
    });

  }

  //Reverse a payment corresponding to a lineitem
  export function reversePayment(accountId, lineItemId, paymentReversalJson, params) {
      let lineItems = "line_items";
      let payment_reversal = "payment_reversals";
    
      let createPaymentReversals = http.post(
        data.accountsUrl + "/" + accountId + "/" + lineItems + "/" + payment_reversal + "/" + lineItemId,
        JSON.stringify(paymentReversalJson),
        params
      );
        /* Uncomment this block for debugging purposes
      if (createPaymentReversals.status != 200) {
        console.log("Reverse Payment URL " + createPaymentReversals.url + " and status " + createPaymentReversals.status);
      }
      */
      // Assertions on Create Payment Reversals Response
      check(createPaymentReversals, {
        "Create Payment Reverse Response is 200": (createPaymentReversals) => createPaymentReversals.status == 200,
      });

  }
  

  export function createManualFees(accountId, createManualFeeJson, params) {
    createManualFeeJson["original_amount_cents"] = randomIntBetween(1000, 10000);

    /** Create Manual Fee request */
    let lineItems = "line_items";
    let manualFees = "manual_fees";
  
    let createManualFee = http.post(
      data.accountsUrl + "/" + accountId + "/" + lineItems + "/" + manualFees,
      JSON.stringify(createManualFeeJson),
      params
    );
    /** Assertions on Create Manual Fee Response */
    check(createManualFee, {
        "Create Manual Fee Response is 200": (createManualFee) => createManualFee.status == 200,
    });
    return createManualFee;//return the entire response to the caller
  }

  export function createFeeWaiver(accountId, lineItemId, feeWaiverJson, params) {
      let feeWaiver = http.post(
        data.accountsUrl + "/" + accountId + "/line_items/fee_waivers/" + lineItemId,
        JSON.stringify(feeWaiverJson),
        params
      );
      
      /** Assertions on Fee Waiver Response */
      check(feeWaiver, {
        "Fee Waiver Response is 200": (feeWaiver) => feeWaiver.status === 200,
      });
    }


  export function getSpecificStatement(accountId, statementId, params) {
  
    let getSpecificStatementUrl =
      data.accountsUrl + "/" + accountId  + "/statements/" + statementId;
  
    const getSpecificStatementRes = http.get(
      getSpecificStatementUrl,
      params
    );
    check(getSpecificStatementRes, {
      "Get a specific statement Response is 200": (getSpecificStatementRes) =>
      getSpecificStatementRes.status === 200,
      "Get a specific statement should not be blank": (getSpecificStatementRes) =>
      getSpecificStatementRes.body !== "[]",
    });

  }

  export function getSpecificLineItem(accountId, lineItemId, params) {
  
    let getSpecificLineItemUrl =
      data.accountsUrl + "/" + accountId +"/line_items/" + lineItemId;
  
    /** Get Information On a Specific Line Item For a Specific Account Request */
    const getSpecificLineItemSpecificAccount = http.get(
      getSpecificLineItemUrl,
      params
    );
   
    /** Assertions */
    check(getSpecificLineItemSpecificAccount, {
    "Get Specific Line Item Specific Account Response is 200": (getSpecificLineItemSpecificAccount) =>
    getSpecificLineItemSpecificAccount.status === 200,
    });


  }

  export function getAMSchedule(accountId,params){
    /** amortization schedule Start */
    let amortizationSchedule = http.get(
      data.accountsUrl + "/" + accountId + "/amortization_schedule",
    params
    );
    /** Assertions on Amortization Schedule Response */
    check(amortizationSchedule, {
    "Amortization Schedule Response is 200": (amortizationSchedule) => amortizationSchedule.status === 200,
  });

  }
  
  export function getRollDate() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate());
    const exclusiveEnd = endDate.toISOString().slice(0, 10);
    return exclusiveEnd;
  }
