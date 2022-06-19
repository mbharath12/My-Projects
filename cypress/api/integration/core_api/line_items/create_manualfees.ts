/* eslint-disable cypress/no-async-tests */
import { authAPI } from "../../../api_support/auth";
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { customerAPI } from "../../../api_support/customer";
import { lineItemsAPI } from "../../../api_support/lineItems";
import externalField from "cypress/resources/template/lineitem/manual_fees.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import promisify from "cypress-promise";

TestFilters(["smoke", "regression", "manualFee"], () => {
  describe("create manual fee ", () => {
    let accountID;
    let customerID;
    let productID;
    const externalFieldsKey = externalField.external_fields[0].key;
    const externalFieldsValue = externalField.external_fields[0].value;
    const manualFeeAmount = Math.floor(Math.random() * 500);

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productAPI.createNewProduct("product.json").then((newProductID) => {
        productID = newProductID;
      });
      customerID =  await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });

    it("should be able to create account", async () => {
      const effectiveAt = dateHelper.addDays(-5, 0);
      const response = await promisify(accountAPI.createNewAccount(productID, customerID, effectiveAt, "account.json"));
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      Cypress.env("origination_fees", response.body.account_product.product_lifecycle.origination_fee_impl_cents);
      cy.log("new account created : " + accountID);
    });


    it("should be able to create manual fees line item with effective_at date", () => {
      const effectiveAt = dateHelper.addDays(-3, 0);
      lineItemsAPI.manualFeeForAccount(accountID, "manual_fees.json", manualFeeAmount.toString(), effectiveAt);
    });

    it("should be able to verify manual fees is present in account", async () => {
      const response = await promisify(accountAPI.getAccountById(accountID));
      expect(response.status).to.eq(200);
      expect(response.body.summary.total_balance_cents).to.eq(Cypress.env("origination_fees") + manualFeeAmount);
    });

    it("should be able to create manual fees line item with external_fields", async() => {
      const effectiveAt = dateHelper.addDays(-3, 0);
      const response = await promisify(
        lineItemsAPI.manualFeeForAccount(accountID, "manual_fees.json", manualFeeAmount.toString(), effectiveAt)
      );
      expect(response.body.line_item_summary.original_amount_cents).to.eq(manualFeeAmount);
      expect(response.body.external_fields[0].key).to.eq(externalFieldsKey);
      expect(response.body.external_fields[0].value).to.eq(externalFieldsValue);
    });

    it("should be able to create manual fees line item with no optional field", () => {
      const manualFeeTemplateJSON = Cypress.env("templateFolderPath").concat("/lineitem/manual_fees.json");
      cy.fixture(manualFeeTemplateJSON).then((manualFeeOffsetJson) => {
        manualFeeOffsetJson.original_amount_cents = manualFeeAmount;
        delete manualFeeOffsetJson.effective_at;
        lineItemsAPI.manualFeesLineitems(accountID, manualFeeOffsetJson).then((response) => {
          expect(response.status, "manual fee response status").to.eq(200);
          expect(response.body.line_item_summary.principal_cents, "check amount in manual fee response").to.eq(
            manualFeeAmount
          );
        });
      });
    });
  });
});
