import http from 'k6/http';
//Import APIs needs to be executed concurrently
import { createProductFunction } from "./02_create_product.js";
import { createCustomerFunction } from "./03_create_customer.js";


// Support data
const data = JSON.parse(open('./support_data.json'));

//Scenario to concurrently execute APIs
export const options = {
  discardResponseBodies: false,
  scenarios: {
    createproduct02: {
      executor: 'constant-vus',
      exec: 'createproduct02',
      vus: 5,
      duration: '2s',
    },
    createcustomer03: {
      executor: 'constant-vus',
      exec: 'createcustomer03',
      vus: 5,
	  duration: '2s',
      //iterations: 100,
      //startTime: '30s',
      //maxDuration: '1m',
    },
  },
};

// Following functions will be executed concurrently
export function createproduct02() {
  createProductFunction();
}


export function createcustomer03() {
  createCustomerFunction();
}


