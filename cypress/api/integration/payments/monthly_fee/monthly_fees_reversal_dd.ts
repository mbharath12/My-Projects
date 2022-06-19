import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import monthlyFeesReversalJSON from "cypress/resources/testdata/lineitem/monthly_fee_reversal.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Scripts - Validation of Monthly fees details
// PP221 Monthly fees validation - Attempt to revert Monthly fees before floating period
// PP222 Monthly fees validation - Attempt to revert Monthly fees after floating period
// PP223 Monthly fees validation - Attempt to revert Monthly fees after floating period, after a payment has been applied

TestFilters(["regression", "monthlyFee", "feeReversal"], () => {
  //Validating monthly fee type and monthly fee cents in account line_items
  describe("Monthly fees validation - waiver fees are added to account with different floating periods", function () {
    let accountID;
    let productID;
    let customerID;
    let monthlyFeeLineItem;
    let productCreditID;
    let productRevolvingID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    it(`should have create product and assign customer `, async () => {
      //Create a product - using Credit product
      productAPI.createNewProduct("product_credit.json").then((newCreditProductID) => {
        productCreditID = newCreditProductID;
      });
      //Create a product - using Revolving product
      productAPI.createNewProduct("product_revolving.json").then((newRevolvingProductID) => {
        productRevolvingID = newRevolvingProductID;
      });
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    monthlyFeesReversalJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer, monthly fee and effective date in account JSON file
        if (data.product_type === "CREDIT") {
          productID = productCreditID;
        } else {
          productID = productRevolvingID;
        }
        const days = parseInt(data.account_effective_dt);
        const effective_dt = dateHelper.addDays(days, parseInt(data.account_effective_dt));
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effective_dt,
          initial_principal_cents: parseInt(data.principal_amount_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      it("should be able to patch time forward to generate fee reversal", async () => {
        //Roll time api get failed in batch execution.
        const endDate = dateHelper.getRollDate(1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate monthly fee details in line items - '${data.tc_name}''`, async () => {
        //Temporary code until performance issue is fixed
        //accountValidator.waitForAccountTotalBalanceUpdate(accountID, parseInt(data.total_balance_cents))
        //Validate the  monthly fee details
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        const monthlyFeeSON = {
          status: "VALID",
          type: "MONTH_FEE",
          original_amount_cents: parseInt(data.monthly_fee_cents),
        };
        lineItemValidator.validateLineItem(response, monthlyFeeSON);
        const monthlyFeesResponse = lineItemValidator.getLineItem(response, "MONTH_FEE");
        monthlyFeeLineItem = monthlyFeesResponse.line_item_id;
      });

      it(`should have create a payment - monthly fee payment`, () => {
        if (data.payment_check === "TRUE") {
          //Update payment amount and payment effective dt
          const payment_effective_dt = dateHelper.addDays(0, 0);
          paymentAPI.paymentForAccount(accountID, "payment.json", data.Payment_amount, payment_effective_dt);
        }
      });

      it("should be able to wavier a monthly fees for an account", async () => {
        response = await promisify(lineItemsAPI.feeWaiverLineitems(accountID, monthlyFeeLineItem));
        expect(response.status).to.eq(200);
        expect(response.body.description).to.eq("Fee waiver successfully applied.");
      });

      it("should be able to patch time forward to generate fee reversal", async () => {
        //Roll time api get failed in batch execution.
        const endDate = dateHelper.getRollDate(1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate fee waiver in line item - '${data.tc_name}'`, async () => {
        //Get the  origination fee line item id
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        const bFeeWavier = lineItemValidator.checkLineItem(response, "FEE_REVERSAL");
        expect(true, "check fee wavier line item is displayed for the account").to.eq(bFeeWavier);
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "late_fee_cents" | "monthly_fee_cents" | "initial_principal_cents"
>;
