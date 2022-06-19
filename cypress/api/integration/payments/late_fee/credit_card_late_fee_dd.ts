import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import { lineItemsAPI } from "../../../api_support/lineItems";
import paymentProcessingJSON from "cypress/resources/testdata/payment/after_grace_period_late_fee_cc.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { paymentAPI } from "cypress/api/api_support/payment";

//Test Scripts
// PP253-LateFeeValidation using CreditCard Product with monthly cycle interval
// PP254-LateFeeValidation on CreditCard set up with less than 1 month cycle interval - 7 days
// PP255-LateFeeValidation on CreditCard set up with less than 1 month cycle interval - 15 days

TestFilters(["regression", "lateFee", "creditProduct", "cycleInterval"], () => {
  describe("Late Fee validation using CreditCard Product with Monthly/7 days/15 days", function () {
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

    // Drive through each and every LateFee scenario from the test data file
    paymentProcessingJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //Create Credit product
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct("product_credit.json", productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        // Update Product ID in the Payment Json aand Late Fee in the Account
        // Json
        const days = parseInt(data.account_effective_dt);
        const effective_dt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: effective_dt,
          late_fee_cents: parseInt(data.late_fee_cents),
          cycle_interval: parseInt(data.cycle_interval),
        };
        //Create account and assign to customer
        response = await promisify(
          accountAPI.updateNCreateAccount("account_payment_cycle_interval.json", accountPayload)
        );
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        accEffective_at = response.body.effective_at;
        cy.log("account effective date:" + accEffective_at);
      });
      //Set the Flag payment_check to true/false
      // When set to true ,the system should proceed with Payment
      // When set to false, the script should skip the Payment Step
      if (data.payment_check.toLowerCase() === "true") {
        it(`should have create a payment - '${data.tc_name}''`, () => {
          //Update payment amount and payment effective dt
          const paymentAmt = data.payment_amt_cents;
          const payment_effective_dt = dateHelper.addDays(0, 0);
          paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, payment_effective_dt);
        });

        //Validate the amount has been paid fully.
        it(`should have validate payment - '${data.tc_name}''`, async () => {
          //Validate the  repayment amount
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(parseInt(data.response_status));
          expect(response.body.summary.total_paid_to_date_cents, "total paid to date in cents after repayment").to.eq(
            parseInt(data.total_paid_to_date_cents)
          );
        });
      } // if ends here

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        //Roll time forward to generate surcharge lineItem
        const endDate = dateHelper.getRollDate(1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Validate the late fee if exists else throw an error saying late fee not exists
      it(`should have validate late fee - '${data.tc_name}''`, async () => {
        //Validate the LineItem:Late Fee
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(parseInt(data.response_status));
        type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        const lateFeeLineItem: AccLineItem = {
          status: "VALID",
          type: "LATE_FEE",
          original_amount_cents: parseInt(data.late_fee_cents),
        };
        lineItemValidator.validateLineItem(response, lateFeeLineItem);
      });
    });
  });
});

type CreateProduct = Pick<ProductPayload, "cycle_interval">;
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "cycle_interval" | "late_fee_cents"
>;
