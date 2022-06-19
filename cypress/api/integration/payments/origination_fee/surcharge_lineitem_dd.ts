/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import surchargeJSON from "../../../../resources/testdata/payment/payment_surcharges_original_cents.json";
import { LineItem, lineItemValidatorAPI } from "../../../api_validation/line_item_validator";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { paymentAPI } from "cypress/api/api_support/payment";

// Test Cases:
// pp421 - surcharge amount in 4 % slab with charge less than lower limit
// pp422 - surcharge amount in 4 % slab with charge equal to lower limit
// pp423 - surcharge amount in 4 % slab with charge greater than lower limit
// pp424 - surcharge amount in 4 % slab with charge less than upper limit
// pp425 - surcharge amount in 4 % slab with charge equal to upper limit
// pp426 - surcharge amount in 4 % slab with charge greater than upper limit
// pp427 - surcharge amount in 4 % slab with charge mid value of slab
// pp428 - surcharge amount in 4 % slab with charge mid value of slab and payment
// pp429 - surcharge amount in 4 % slab with charge more than the upper limit

TestFilters(["regression", "surcharge", "originationFee"], () => {
  let productID;
  let customerID;
  let accountID;

  describe("Validate surcharge lineitem", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });

    //iterate each product and account
    surchargeJSON.forEach((data) => {
      it(`should able to create product and verify original amount cents`, async () => {
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          surcharge_fee_interval: data.surcharge_fee_interval,
          surcharge_start_inclusive_cents: parseInt(data.surcharge_start_inclusive_cents),
          surcharge_end_exclusive_cents: parseInt(data.surcharge_end_exclusive_cents),
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval_del: "first_cycle_interval",
          percent_surcharge: parseInt(data.percent_surcharge),
        };
        //Update payload and create an product
        const response = await promisify(
          productAPI.updateNCreateProduct("product_surcharge_revolving.json", productPayload)
        );
        productID = response.body.product_id;
      });

      it(`should have create account and '${data.tc_name}'`, async () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_dt,
          initial_principal_cents: parseInt(data.initial_principal_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          annual_fee_cents: parseInt(data.annual_fee_cents),
        };

        //Update payload and create an account
        let response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);

        if (parseInt(data.payment_amt_cents) != 0) {
          it(`should be able to create a payment at first cycle interval - '${data.tc_name}'`, async() => {
            const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment_effective_dt), 0);
            await promisify(paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amt_cents, paymentEffectiveDt))
          });

          const rollDate = dateHelper.getStatementDate(data.roll_time_forward, 1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollDate));
          expect(response.status).to.eq(200);
        }
        it(`should have surcharge line item and validate surcharge amount - '${data.tc_name}'`, async () => {
          const response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          if (data.surcharge_line_item_display.toLowerCase() == "true") {
            //Verify FEE_SURCHARGE  in account line item
            type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const surchargeLineItem: AccLineItem = {
              status: "VALID",
              type: "FEE_SURCHARGE",
              original_amount_cents: parseInt(data.surcharge_amt_cents),
            };
            lineItemValidatorAPI.validateLineItem(response, surchargeLineItem);
          } else {
            // check the line item is not displayed for the amount that doesn't
            // beyond the slab
            const blnCheckLineItemSurcharge = lineItemValidatorAPI.checkLineItem(response, "FEE_SURCHARGE");
            expect(false, "check FEE_SURCHARGE line item is not displayed with amount beyond the limit").to.equal(
              blnCheckLineItemSurcharge
            );
          }
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval_del"
  | "surcharge_start_inclusive_cents"
  | "surcharge_end_exclusive_cents"
  | "percent_surcharge"
  | "surcharge_fee_interval"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "cycle_interval_del"
  | "cycle_due_interval_del"
  | "first_cycle_interval"
  | "post_promo_len"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "delete_field_name"
  | "cycle_due_interval_del"
  | "initial_principal_cents"
>;
