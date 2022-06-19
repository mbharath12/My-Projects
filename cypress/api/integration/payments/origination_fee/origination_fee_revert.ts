/* eslint-disable cypress/no-async-tests */
import { paymentAPI } from "../../../api_support/payment";
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { lineItemValidator } from "../../../api_validation/line_item_validator";
import paymentProcessingJSON from "cypress/resources/testdata/payment/origination_fee_revert.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP166-Verify Origination fees is set up at Account level
//PP167	Verify Origination fees can be waived
//PP168-Verify Origination fees is charged automatically while onboarding a new account
//PP189	Attempt to revert origination fees after floating period
//PP190	Attempt to revert origination fees after floating period- when there is a payment done during the Float days
//PP191	Attempt to revert origination fees after floating period- when there is a payment done after the Float days
//PP192	Attempt to revert origination fees 5 days after account opening
//PP193	Attempt to revert origination fees 1 month after account opening
//PP194	Attempt to revert origination fees 1 year after account opening

TestFilters(["regression", "originationFee", "payment", "feeReversal"], () => {
  describe("Origination fee revert for different product at different stage of account", function () {
    let accountID;
    let productID;
    let productCreditID;
    let productInstallmentID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      productCreditID = await promisify(productAPI.createNewProduct("product_credit.json"));
      productInstallmentID = await promisify(productAPI.createNewProduct("payment_product.json"));
    });

    paymentProcessingJSON.forEach((data) => {
      if (parseInt(data.response_status) === 200) {
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Assign product id to environment global variable
          if (data.product_type === "CREDIT") {
            productID = productCreditID;
          } else {
            productID = productInstallmentID;
          }

          //Update product, customer and origination fee in account JSON
          const days = parseInt(data.account_effective_dt);
          const effectiveDt = dateHelper.addDays(days, 0);
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDt,
            origination_fee_cents: parseInt(data.origination_fee_cents),
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          accountID = response.body.account_id;
        });

        if (data.do_payment.toLowerCase() === "true") {
          it(`should have create a payment - '${data.tc_name}'`, async () => {
            //Update payment amount and payment effective dt
            const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment_effective_dt), 0);
            const paymentAmt = data.payment_amt_cents;
            paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, paymentEffectiveDt);
          });
        }

        it(`should have create fee waiver to revert origination fee - '${data.tc_name}'`, async () => {
          //Get the  origination fee line item id
          let response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          const line_item_JSON = lineItemValidator.getLineItem(response, "ORIG_FEE");
          const orgin_line_item_id = line_item_JSON.line_item_id;
          response = await promisify(lineItemsAPI.feeWaiverLineitems(accountID, orgin_line_item_id));
          cy.log("fee waiver response:" + data.response_status);
          expect(response.status).to.eq(parseInt(data.response_status));
        });

        if (parseInt(data.response_status) === 200) {
          it("should be able to patch time forward to generate fee reversal", async () => {
            const endDate = dateHelper.getRollDate(1);
            const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
            expect(response.status).to.eq(200);
          });

          it(`should have validate fee waiver in line item - '${data.tc_name}'`, () => {
            //Get the  origination fee line item id
            lineItemsAPI.allLineitems(accountID).then(async (response) => {
              expect(response.status).to.eq(200);
              // Return true if fee reversal line item is displayed in list of
              // account line items
              const blnFeeWavierLineItemExist = lineItemValidator.checkLineItem(response, "FEE_REVERSAL");
              expect(true, "check fee wavier line item is displayed for the account").to.eq(blnFeeWavierLineItemExist);
            });
          });
        }
      }
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "origination_fee_cents" | "late_fee_cents" | "monthly_fee_cents"
>;
