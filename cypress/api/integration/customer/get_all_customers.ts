/* eslint-disable cypress/no-async-tests */
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import { Constants } from "../../api_support/constants";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests";

//Test cases covered -
//PP1335 - Number of Customer accounts retrieved - defaulted to 30
//PP1336 - Maximum number of Customer accounts retrieved - maximum limit 100
//PP1337 - Search Customer and account records by First name
//PP1338 - Search Customer and account records by Last name

TestFilters(["customer", "regression", "search"], () => {
  describe("Check Search customer details and get customers with account", function () {
    let response;
    const defaultCustomerLimit = 30;
    const maxCustomerLimit=100;
    const moreThanMaxLimit=120;

    //Create Access Token
    before(() => {
      authAPI.getDefaultUserAccessToken();
    })

    //PP1335-Get all Accounts for all Customers are retrieved
    it("should able to retrieved number of customer accounts - defaulted to 30", async () => {
      response = await promisify(customerAPI.getAllCustomer());
      expect(response.status).to.eq(200);
      expect(response.body.results.length,"check default customer account limit").to.eq(defaultCustomerLimit)
    });

    //PP1336-Maximum number of Customer accounts retrieved limit is not more than 100
    it("Should able to retrieve maximum number of Customer accounts is not more than 100", async () => {
      response = await promisify(customerAPI.getAllCustomerWithLimit(maxCustomerLimit));
      expect(response.status).to.eq(200);
      const customerCount = response.body.results.length;
      expect(customerCount,"verify maximum number of customers retrieved").to.eq(maxCustomerLimit)
    });

    it("Retrieve customer account more than limit", async () => {
      response = await promisify(customerAPI.getAllCustomerWithLimit(moreThanMaxLimit));
      expect(response.status).to.eq(200);
      const customerCount = response.body.results.length;
      expect(customerCount,"Verify maximum number of customers retrieved even when more than limit is entered").to.eq(maxCustomerLimit)
    });

    //PP1337-Search Customer and account records by First name
    it("Search Customer and account records by First name", async () => {
      const customerDts = await promisify(cy.fixture(Constants.templateFixtureFilePath.concat("/customer/create_customer.json")))
      const firstName = customerDts.name_first
      response = await promisify(customerAPI.searchCustomerByName(firstName));
      expect(response.status).to.eq(200);
      const customerNumber = response.body.results.length
      const filterByFirstName = response.body.results.filter((customer) => {
        return customer.name_first === firstName
      });

      expect(filterByFirstName.length,"check response has searched customer first name").to.eq(customerNumber)
    });

    //PP1338-Search Customer and account records by Last name
    it("Search Customer and account records by Last name", async () => {
      const customerDts = await promisify(cy.fixture(Constants.templateFixtureFilePath.concat("/customer/create_customer.json")))
      const lastName =customerDts.name_last
      response = await promisify(customerAPI.searchCustomerByName(lastName));
      expect(response.status).to.eq(200);
      const customerNumber = response.body.results.length
      const filterByLastName = response.body.results.filter((customer) => {
        return customer.name_last === lastName
      });

      expect(filterByLastName.length,"check response has searched customer last name").to.eq(customerNumber)
    });
  });
});
