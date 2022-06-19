/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import { chargeAPI } from "../../../api_support/charge";
import { paymentAPI } from "cypress/api/api_support/payment";
import paymentProcessingJSON from "cypress/resources/testdata/payment/payment_surcharges.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts - covers 40 manual test cases
// pp359 - pp367 validate surcharge amount in 10 % slab with various charges and
// boundary value
// pp368 - pp378 validate surcharge amount in 10 % slab with origination fee,
// check the origination fee is not including in surcharge calculation
// pp379 - pp389 validate surcharge amount in 10 % slab with origination fee,payment
// check the origination fee payment are not including in surcharge calculation
// pp388 - p392 validate surcharge amount in 8 % slab with various charges and
// boundary value
// pp393 - pp397 validate surcharge amount in 8 % slab with origination fee,
// check the origination fee is not including in surcharge calculation
// pp398 - pp402 validate surcharge amount in 8 % slab with origination
// fee,payment. check the origination fee payment are not including in surcharge calculation
// pp403 - pp409 validate surcharge amount in 7 % slab with various charges and
// boundary value
// pp410 - pp414 validate surcharge amount in 7 % slab with origination fee,
// check the origination fee is not including in surcharge calculation
// pp415 - pp420 validate surcharge amount in 7 % slab with origination
// fee,payment. check the origination fee payment are not including in surcharge calculation

TestFilters(["regression", "originationFee", "paymentPouring", "surcharge"], () => {
  describe("Check surcharge calculations with different slabs along with origination fee", function () {
    let accountID;
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      productID = await promisify(productAPI.createNewProduct("product_surcharge.json"));
    });

    paymentProcessingJSON.forEach((data) => {
      it(`should be able to create account and assign customer - '${data.tc_name}'`, async() => {
        // Update product, customer, summary amounts and origination fee in
        // account JSON file

        const days = parseInt(data.account_effective_dt);
        const effectiveDate = dateHelper.addDays(days, 0);
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDate,
          origination_fee_cents: parseInt(data.origination_fee_cents),
          credit_limit_cents: parseInt(data.credit_limit_cents),
          max_approved_credit_limit_cents:parseInt(data.max_approved_credit_limit_cents),
          initial_principal_cents: parseInt(data.initial_principal_cents)
        };

        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        accountID = response.body.account_id;
      });

      it(`should be able to create a charge - '${data.tc_name}'`, () => {
        //Update charge amount and charge effective dt
        const chargeAmt = data.charge_amt_cents;
        const days = parseInt(data.charge_effective_dt);
        const chargeEffectiveDt = dateHelper.addDays(days, 0);
        chargeAPI.chargeForAccount(accountID,"charge.json",chargeAmt,chargeEffectiveDt)
      });

      if (parseInt(data.payment_amt_cents) != 0) {
        it(`should have create a payment - '${data.tc_name}'`, async() => {
          //Update payment amount and payment effective dt
          const days = parseInt(data.payment_effective_dt);
          const paymentEffectiveDt = dateHelper.addDays(days, 0);
          const paymentAmt = data.payment_amt_cents;
          paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, paymentEffectiveDt);
        });
      }

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        //Roll time forward to generate surcharge lineItem
        const endDate = dateHelper.getRollDate(1);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have surcharge line item and validate surcharge amount - '${data.tc_name}'`, () => {
        lineItemsAPI.allLineitems(accountID).then(async (response) => {
          expect(response.status).to.eq(200);
          if (data.surcharge_line_item_display.toLowerCase() == "true") {
            //Verify FEE_SURCHARGE  in account line item
            type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const surchargeLineItem: AccLineItem = {
              status: "VALID",
              type: "FEE_SURCHARGE",
              original_amount_cents: parseInt(data.surcharge_amt_cents),
            };
            lineItemValidator.validateLineItem(response, surchargeLineItem);
          } else {
            // check the line item is not displayed for the amount that doesn't
            // beyond the slab
            const blnCheckLineItemSurcharge = lineItemValidator.checkLineItem(response, "FEE_SURCHARGE");
            expect(false, "check FEE_SURCHARGE line item is not displayed with amount beyond the limit").to.equal(
              blnCheckLineItemSurcharge
            );
          }
        });
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "origination_fee_cents"
  | "credit_limit_cents"
  | "max_approved_credit_limit_cents"
  | "initial_principal_cents"
>;
