/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

TestFilters(["smoke", "regression", "amSchedule"], () => {
  describe("Validate AM schedule is displayed for installment product", function () {
    let accountID;
    let productID;
    let customerID;
    let effectiveDt;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
      productID = await promisify(productAPI.createNewProduct("product_installment.json"));
    });

    it(`should have create account and assign customer`, () => {
      //Creating account 4 days and 2 hours before current time
      effectiveDt = dateHelper.addDays(-4, -2);
      accountAPI.createNewAccount(productID, customerID, effectiveDt, "account_credit.json").then((response) => {
        accountID = response.body.account_id;
      });
    });

    it(`should have to validate Amortization Schedule schedule displayed `, async () => {
      //Roll time forward to get AM Schedule generated
      const rollDate = dateHelper.getStatementDate(effectiveDt, 1);
      rollTimeAPI.rollAccountForward(accountID, rollDate).then((response) => {
        expect(response.status).to.eq(200);
      });
      //Check AM Schedule is generated
      const amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
      expect(amResponse.status).to.eq(200);
      expect(amResponse.body.length, "check number of cycles in amortization schedule").to.eq(12);
    });
  });
});
