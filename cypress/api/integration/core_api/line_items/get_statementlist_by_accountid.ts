/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { statementsAPI } from "../../../api_support/statements";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
import { customerAPI } from "../../../api_support/customer";

TestFilters(["smoke", "regression", "statements"], () => {
  describe("Get statement related tests", () => {
    let accountID;
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });
      customerID =  await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });

    it("should be able to get the list of statements for the specific account", async () => {
      const response = await promisify(accountAPI.createNewAccount(productID, customerID, "", "account.json"));
      accountID = response.body.account_id;
      statementsAPI.createStatementList(accountID).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    // it ('should be able to get the statements by id', () => {
    //   statements.statementByID(accountID,statementID).then((response) => {
    //     accountID = response.body.account_id
    //     //cy.log('line item by ID : ' + Cypress.env('statementID'))
    //     expect(response.status).to.eq(200)
    //   });
    // })
  });
});
