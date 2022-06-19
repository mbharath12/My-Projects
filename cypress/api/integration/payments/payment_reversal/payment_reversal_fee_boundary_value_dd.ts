import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import paymentProcessingJSON from "../../../../resources/testdata/payment/payment_reversal_fee.json";
import { lineItemsAPI } from "../../../api_support/lineItems";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//PP259 Payment Reversal Fee validation - Automated process
//PP260 Attempt to apply Payment Reversal fees amount over and above the Credit limit
//PP261 Attempt to apply negative fees
//PP262 Attempt to apply 0 fees
//PP263 Attempt to apply 39 cents fees
//PP264 Attempt to apply USD 29.00 fees
//PP265 Attempt to apply USD 1000 fees

TestFilters(["regression", "payment", "paymentReversal", "boundaryValue"], () => {
  describe("Validate payment reversal fee functionality with positive and negative data", function () {
    let productID;
    let customerID;
    let accountID;
    let paymentID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new installment product
      productAPI.createNewProduct("product_credit.json").then((newInstallmentProductID) => {
        productID = newInstallmentProductID;
        cy.log("new product created : " + productID);
      });
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("new customer created : " + customerID);
      });
    });

    paymentProcessingJSON.forEach((data) => {
      it(`should have create account`, async () => {
        const days = parseInt(data.account_effective_dt);
        const effective_dt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        //Create account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effective_dt,
          origination_fee_cents: parseInt(data.origination_fee_cents),
          payment_reversal_fee_cents: parseInt(data.return_check_fee),
          post_promo_impl_interest_rate_percent:parseInt(data.post_promo_impl_interest_rate_percent),
          doNot_check_response_status: false,
        };
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
            expect(response.status.toString(), "Account should not be onboarded with the payment reversal fee in negative").to.eq(
            data.account_onboard_status.toString()
          );
        accountID = response.body.account_id;
        cy.log("new account created successfully: " + accountID);
      });
      //Execute test only if account is on boarded and perform payment reversal
      if (data.check_payment_reversal.toLowerCase() === "true") {
        it(`should have create and validate payment -'${data.tc_name}'`, async () => {
          const paymentAmt = data.payment_amt_cents;
          const payment_effective_dt = dateHelper.addDays(0, 0);
          paymentID = await promisify(
            paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, payment_effective_dt)
          );
        });

        it(`should have perform rolltime forward - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentID));
          expect(response.status).to.eq(200);
          const endDate = dateHelper.getRollDate(1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate payment reversal as a line item and should have payment reversal based on the payment done- '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          type payReversalItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const payReversalLineItem: payReversalItem = {
            status: "VALID",
            type: "PAYMENT_REVERSAL",
            original_amount_cents: parseInt(data.payment_reversal_prin),
          };
          lineItemValidator.validateLineItem(response, payReversalLineItem);
        });

        it(`should have validate payment reversal fee as a line item and should have payment reversal fee based on the payment done- '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          type payReversalItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const payReversalLineItem: payReversalItem = {
            status: "VALID",
            type: "PAYMENT_REVERSAL_FEE",
            original_amount_cents: parseInt(data.payment_reversal_fee),
          };
          lineItemValidator.validateLineItem(response, payReversalLineItem);
        });

        it(`should have validate payment reversal interest as a line item and should have payment reversal interest based on the payment done- '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          type payReversalItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const payReversalLineItem: payReversalItem = {
            status: "VALID",
            type: "PAYMENT_REVERSAL_INTEREST",
            original_amount_cents: parseInt(data.payment_reversal_int),
          };
          lineItemValidator.validateLineItem(response, payReversalLineItem);
        });

        //The feature is not yet implemented in Canopy System
        xit(`should have validate return check fee as a line item and should have payment reversal fee based on the config parameters- '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          type payReversalItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const payReversalLineItem: payReversalItem = {
            status: "VALID",
            type: "RETURN_CHECK_FEE",
            original_amount_cents: parseInt(data.return_check_fee),
          };
          lineItemValidator.validateLineItem(response, payReversalLineItem);
        });
      }
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "late_fee_cents"
  | "origination_fee_cents"
  | "payment_reversal_fee_cents"
  | "post_promo_impl_interest_rate_percent"
  | "doNot_check_response_status"
>;
