/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { customerAPI } from "../../../api_support/customer";
import { authAPI } from "../../../api_support/auth";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { chargeAPI } from "cypress/api/api_support/charge";
import { paymentAPI } from "../../../api_support/payment";

//Test Cases Covered
//API_375 - verify account_id is displaying on Get information on a specific Line item for a specific account- response
//API_376 - verify 'line_item_id' is displaying on Get information on a specific Line item for a specific account- response
//API_377 - verify 'effective_at' on Get information on a specific Line item for a specific account- response
//API_378 - verify 'created_at' on Get information on a specific Line item for a specific account- response
//API_379 - verify 'product_id' on Get information on a specific Line item for a specific account- response
//API_380 - verify 'line item overview' sub section is displaying on Get information on a specific Line item for a specific account- response
//API_381 - verify 'line_item_status' on Get information on a specific Line item for a specific account- response
//API_382 - verify 'line_item_type' on Get information on a specific Line item for a specific account- response
//API_385 - Verify 'description' on Get information on a specific Line item for a specific account- response
//API_386 - Verify 'line_item_summary' on Get information on a specific Line item for a specific account- response
//API_387 - Verify original_amount_cents on Get information on a specific Line item for a specific account- response
//API_388 - Verify balance_cents on Get information on a specific Line item for a specific account- response
//API_389 - Verify principal_cents on Get information on a specific Line item for a specific account- response
//API_390 - Verify interest_balance_cents on Get information on a specific Line item for a specific account- response
//API_391 - Verify am_interest_balance_cents on Get information on a specific Line item for a specific account- response
//API_392 - Verify deferred_interest_balance_cents on Get information on a specific Line item for a specific account- response
//API_393 - Verify am_deferred_interest_balance_cents on Get information on a specific Line item for a specific account- response
//API_394 - Verify total_interest_paid_to_date_cents on Get information on a specific Line item for a specific account- response
//API_395 - Verify merchant data name on Get information on a specific Line item for a specific account- response
//API_396 - Verify merchant id on Get information on a specific Line item for a specific account- response
//API_397 - Verify merchant mcc_code on Get information on a specific Line item for a specific account- response
//API_398 - Verify merchant phone_number on Get information on a specific Line item for a specific account- response
//API_403 - Verify 'external fields' on Get information on a specific Line item for a specific account- response
//API_404 - Verify key on Get information on a specific Line item for a specific account- response
//API_405 - Verify value on Get information on a specific Line item for a specific account- response

TestFilters(["regression", "lineItem"], () => {
  describe("Verify get information on a specific Line item for a specific account- response", function () {
    let response;
    let productID;
    let customerID;
    let accountID;
    let chargeEffectiveAt;
    let chargeAmt;
    let chargeLineItemID;
    let paymentEffectiveAt;
    let paymentAmt;
    let paymentLineItemID;


    //Create Access Token
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new installment product
      productID = await promisify(productAPI.createNewProduct("payment_product.json"));
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    it("should have create an account and assign customer", async () => {
      //Update product in account JSON file
      const effective_at = dateHelper.addDays(-20, 0);
      response = await promisify(
        accountAPI.createNewAccount(productID, customerID, effective_at, "account.json")
      );
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      cy.log("new account created: " + accountID);
    });

    it(`should be able to create a charge`, async () => {
      chargeEffectiveAt = dateHelper.addDays(-10, 0);
      chargeAmt = 2000
      response = await promisify(
        chargeAPI.chargeForAccount(accountID, "charge_all_details.json", chargeAmt, chargeEffectiveAt)
      );
      chargeLineItemID = response.body.line_item_id;
    });

    it(`should be able to create a payment`, async () => {
      paymentEffectiveAt = dateHelper.addDays(-10, 0);
      paymentAmt = 100000
      paymentLineItemID = await promisify(
        paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, paymentEffectiveAt)
      );
    });

    //Get information on a specific Charge Line item for a specific account
    it("should have to validate line item details for a specific account", async () => {
      const chargeJSON = await promisify(cy.fixture(Cypress.env('templateFolderPath').concat("/charge/charge_all_details.json")))
      const expCreatedAt = dateHelper.addDays(0,0)
      response = await promisify(lineItemsAPI.lineitembyid(accountID, chargeLineItemID));
      expect(response.status).to.eq(200);
      const actAccountID = response.body.results[0].account_id;
      expect(actAccountID, "check account ID in line item").to.equals(accountID);
      const actLineItemID = response.body.results[0].line_item_id;
      expect(actLineItemID, "check line item id is displayed").to.equals(chargeLineItemID);
      const lineItemResponse = response.body.results[0]
      expect(lineItemResponse.effective_at, "check effective_at in line item").to.includes(chargeEffectiveAt.slice(0,10));
      expect(lineItemResponse.created_at, "check created_at in line item").to.includes(expCreatedAt.slice(0,10));
      expect(lineItemResponse.product_id.toString(), "check product_id in line item").to.equals(productID);
      expect(lineItemResponse.line_item_overview.line_item_status, "check status in line item").to.equals("VALID");
      expect(lineItemResponse.line_item_overview.line_item_type, "check line item type").to.equals("CHARGE");
      expect(lineItemResponse.line_item_summary.original_amount_cents, "check original_amount_cents").to.eq(parseInt(chargeAmt))
      expect(lineItemResponse.line_item_summary.balance_cents, "check balance_cents").to.eq(parseInt(chargeAmt))
      expect(lineItemResponse.line_item_summary.principal_cents, "check principal_cents").to.eq(parseInt(chargeAmt))
      expect(lineItemResponse.line_item_summary.interest_balance_cents, "check interest_balance_cents").to.eq(0)
      expect(lineItemResponse.line_item_summary.am_interest_balance_cents, "check am_interest_balance_cents").to.eq(0)
      expect(lineItemResponse.line_item_summary.total_interest_paid_to_date_cents, "check principal_cents").to.eq(0)
      expect(lineItemResponse.merchant_data.id,"check merchant id").to.equals(chargeJSON.merchant_data.id);
      expect(lineItemResponse.merchant_data.name,"check merchant name").to.equals(chargeJSON.merchant_data.name);
      expect(lineItemResponse.merchant_data.mcc_code,"check merchant mcc_code").to.equals(chargeJSON.merchant_data.mcc_code);
      expect(lineItemResponse.merchant_data.phone_number,"check merchant phone_number").to.equals(chargeJSON.merchant_data.phone_number);
      expect(lineItemResponse.external_fields[0].key,"check external field key").to.equals(chargeJSON.external_fields[0].key);
      expect(lineItemResponse.external_fields[0].value,"check external field value").to.equals(chargeJSON.external_fields[0].value);
      expect(lineItemResponse.line_item_overview.description, "check line item description").to.not.be.null
    });

    it("should get information on a specific Payment Line item for a specific account", async () => {
      response = await promisify(lineItemsAPI.lineitembyid(accountID, paymentLineItemID));
      expect(response.status).to.eq(200);
      const getPaymentResponseAccountID = response.body.results[0].account_id;
      expect(accountID).to.equals(getPaymentResponseAccountID);
      const getPaymentResponseLineItemID = response.body.results[0].line_item_id;
      expect(paymentLineItemID).to.equals(getPaymentResponseLineItemID);
    });
  });
});
