import { chargeAPI } from "../../../api_support/charge";
import { customerAPI } from "../../../api_support/customer";
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

TestFilters(["smoke", "regression", "charges"], () => {
  describe("create Charge Tests", () => {
    let accountID;
    let customerID;
    let productID;
    const chargeAmount = 5000;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });

      const effectiveAt = dateHelper.addDays(-5, 0);
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        accountAPI.createNewAccount(productID, customerID, effectiveAt, "account.json").then((response) => {
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
        });
      });
    });

    it("should be able to create a charge", async () => {
      const effectiveAt = dateHelper.addDays(-3, 0);
      const response = await promisify(chargeAPI.chargeForAccount(accountID, "charge.json", chargeAmount, effectiveAt));
      expect(response.status).to.eq(200);
      expect(response.body.line_item_summary.principal_cents).to.eq(chargeAmount);
    });
  });
});
