import { Constants } from "./constants";

export class Customer {
  createCustomer(json) {
    return cy.request({
      method: "POST",
      url: "customers",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  getAllCustomer() {
    return cy.request({
      method: "GET",
      url: "customers/accounts",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  getAllCustomerWithLimit(noOfCustomerAccount) {
    return cy.request({
      method: "GET",
      url: "customers/accounts??offset=1&limit="+noOfCustomerAccount,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  //Create new customer and return customer id
  //ex:customer.createNewCustomer("create_customer.json")
  createNewCustomer(fileName: string) {
    return cy.fixture(Constants.templateFixtureFilePath.concat("/customer/", fileName)).then((customerJSON) => {
      this.createCustomer(customerJSON).then((response) => {
        expect(response.status).to.eq(200);       
        const customerID = response.body.customer_id;
        return customerID;
      });
    });
  }

  updateNCreateCustomer(fileName: string, updateData) {
    return cy.fixture(Constants.templateFixtureFilePath.concat("/customer/", fileName)).then((customerJSON) => {
      if ("account_id" in updateData) {
        customerJSON.assign_to_accounts[0].account_id = updateData.account_id;
      }
      if ("customer_account_role" in updateData) {
        customerJSON.assign_to_accounts[0].customer_account_role = updateData.customer_account_role;
      }

      if ("second_account_id" in updateData) {
        customerJSON.assign_to_accounts[1].account_id = updateData.second_account_id;
      }
      if ("second_customer_account_role" in updateData) {
        customerJSON.assign_to_accounts[1].customer_account_role = updateData.second_customer_account_role;
      }

      if ("third_account_id" in updateData) {
        customerJSON.assign_to_accounts[2].account_id = updateData.third_account_id;
      }
      if ("third_customer_account_role" in updateData) {
        customerJSON.assign_to_accounts[2].customer_account_role = updateData.third_customer_account_role;
      }      
      if ("customer_id" in updateData){
        customerJSON.customer_id=updateData.customer_id;
      }
      this.createCustomer(customerJSON).then((response) => {
        expect(response.status).to.eq(200);
        return response;
      });
    });
  }

  //Search Customer and account records by First name
  searchCustomerByName(customerName) {
    return cy.request({
      method: "GET",
      url: "customers/accounts?search_parameter=" + customerName,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

}

export const customerAPI = new Customer();

export interface CustomerPayload {
  name_prefix?: string;
  name_first?: number;
  name_middle?: number;
  name_last?: number;
  name_suffix?: number;
  account_id?: string;
  customer_id?:string;
  customer_account_role?: string;
  second_account_id?: string;
  second_customer_account_role?: string;
  third_account_id?: string;
  third_customer_account_role?: string;
}
