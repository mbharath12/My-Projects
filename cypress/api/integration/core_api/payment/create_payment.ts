import { paymentAPI } from "../../../api_support/payment";
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import { customerAPI } from "../../../api_support/customer";

TestFilters(["smoke", "regression"], () => {
  describe("Create Payment", () => {
    const paymentAmt = Math.floor(Math.random() * 500);
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });
      customerID =  await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });

    it("should be able to create account and charge", async () => {
      const response = await promisify(accountAPI.createNewAccount(productID, customerID, "", "account.json"));
      const accountID = response.body.account_id;
      const paymentEffectiveAt = dateHelper.addDays(1, 0);
      paymentAPI.paymentForAccount(accountID, "create_payment.json", paymentAmt, paymentEffectiveAt);
    });
  });
});
