/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { rollTimeAPI } from "../../../api_support/rollTime";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import { customerAPI } from "../../../api_support/customer";

TestFilters(["smoke", "regression"], () => {
  describe(" Roll time froward as needed ", () => {
    let accountID;
    let productID;
    let customerID;
    let effective_at;
    let response;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });
      customerID =  await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });

    it("should be able to create account", async () => {
      response = await promisify(accountAPI.createNewAccount(productID, customerID, "", "account.json"));
      accountID = response.body.account_id;
      effective_at = response.body.effective_at;
    });

    it("should be able to roll time forward on account", async () => {
      const datesToMove = 15;
      const exclusive_end = dateHelper.getRollDateWithEffectiveAt(effective_at, datesToMove);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, exclusive_end));
      expect(response.status).to.eq(200);
    });
  });
});
