/* eslint-disable cypress/no-async-tests */
import { chargeAPI } from "../../../api_support/charge";
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
import { customerAPI } from "../../../api_support/customer";

TestFilters(["smoke", "regression", "lineItem"], () => {
  describe("Get line item related tests", () => {
    let accountID;
    let productID;
    let customerID;
    let response;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    it("should be able to create account and charge", async () => {
      response = await promisify(accountAPI.createNewAccount(productID, customerID, "", "account.json"));
      accountID = response.body.account_id;
      chargeAPI.chargeForAccount(accountID, "charge.json", 5000, "");
    });

    it("should be able to get line item by id", () => {
      lineItemsAPI.allLineitems(accountID).then((response) => {
        const lineItemID = response.body.results[0].line_item_id;
        lineItemsAPI.lineitembyid(accountID, lineItemID).then((response) => {
          expect(response.status).to.eq(200);
          const lineItemID = response.body.results[0].line_item_id;
          cy.log("line item by ID : " + lineItemID);
        });
      });
    });

    it("should be able to get all line items ", async () => {
      response = await promisify(lineItemsAPI.allLineitems(accountID));
      expect(response.status).to.eq(200);
    });
  });
});
