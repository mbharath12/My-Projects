/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import paymentProcessingJSON from "cypress/resources/testdata/payment/after_grace_period_late_fee_install.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Scripts
// pp245-LateFeeValidation using Installment Product and check LateFee Line-Item displayed
// PP246-Late Fee validation - Process when grace period end date falls on a holiday
// PP247-Attempt to apply Late fees amount over and above the Credit limit 5000 on an account using Installment Product and verify system throws error
// PP248-Attempt to apply negative fees -29 on an account using Installment Product and confirm Negative Latefee shouldnot be accepted
// PP249-Attempt to apply 0 late fees on an account and confirm the late fee entry is not exist in Line Item
// PP250- Attempt to apply 82 late fee cents fees on an account and confirm the
// late fee should not be accepted in Cents
// PP251-Attempt to apply USD 29.99 late fees on an account and the late fee should get accepted
// PP252-Attempt to apply USD 1000 fees and confirm the late fee should not be accepted.

TestFilters(["regression", "lateFee", "installmentProduct", "cycleInterval"], () => {
  describe("Late Fee validation using Installment product with boundary check", function () {
    //*Variable declaration*
    let accountID;
    let productID;
    let accEffective_at;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    //Drive through each and every LateFee scenario in the data file
    paymentProcessingJSON.forEach((data) => {
      if (parseInt(data.response_status) === 200) {
        it(`should have create product - '${data.tc_name}'`, async () => {
          productAPI.createNewProduct("payment_product_cycle_interval.json").then((newProductID) => {
            productID = newProductID;
          });

          const days = parseInt(data.account_effective_dt); //Get the Account Effective date from the datatable
          const effective_dt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: Cypress.env("customer_id"),
            effective_at: effective_dt,
            late_fee_cents: parseInt(data.late_fee_cents),
          };
          //Create account and assign to customer
          response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
          if (response.status === 200) {
            accountID = response.body.account_id;
            cy.log("new account created : " + accountID);
            accEffective_at = response.body.effective_at;
            cy.log("account effective date:" + accEffective_at);
          }
        }); //it block ends here for product,customer and account

        //Set the Flag payment_check to true/false
        // when flag is set to true proceed with payment else skip
        if (data.payment_check.toLowerCase() === "true") {
          it(`should have create a payment - '${data.tc_name}''`, () => {
            //Update payment amount and payment effective dt
            const payment_effective_dt = dateHelper.addDays(5, 0);
            paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amt_cents, payment_effective_dt);
          });
        } // if ends here

        //Calling roll time forward to make sure account summary is updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getRollDate(2);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        // Set the Flag line_item_check to true/false to proceed with Line Item check
        if (parseInt(data.response_status) === 200) {
          it(`should have validate late fee - '${data.tc_name}''`, async () => {
            // Validate the  Valid Late_fee existence and Late fee amount in the
            // Line Items
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(parseInt(data.response_status));
            if (data.line_item_check.toLowerCase() === "true") {
              type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const lateFeeLineItem: AccLineItem = {
                status: "VALID",
                type: "LATE_FEE",
                original_amount_cents: parseInt(data.late_fee_cents),
              };
              lineItemValidator.validateLineItem(response, lateFeeLineItem);
            } else {
              const bLineItemExist = lineItemValidator.checkLineItem(response, "LATE_FEE");
              expect(false, "check LATE_FEE line item is not displayed").to.eq(bLineItemExist);
            }
          });
        } // if ends here
      } // Main if ends here
    });
  });
});

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at" | "late_fee_cents">;
