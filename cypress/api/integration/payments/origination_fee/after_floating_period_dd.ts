/* eslint-disable cypress/no-async-tests */
/* eslint-disable no-trailing-spaces */
import { paymentAPI } from "../../../api_support/payment";
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { AccountSummary, accountValidator } from "../../../api_validation/account_validator";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";
import { default as paymentProcessingJSON } from "cypress/resources/testdata/payment/after_floating_period_origination_fee.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP46	Full Loan amount repayment one day after floating period ends without origination fee
//PP47	Half Loan amount repayment one day after floating period ends without origination fee
//PP48	5% loan Repayment one day after floating period ends without origination fee
//PP52	Full Loan amount repayment one day after floating period ends with origination fee
//PP53	Half Loan amount repayment one day after floating period ends with origination fee
//PP54	5% loan Repayment one day after floating period ends with origination fee
TestFilters(["regression", "originationFee", "payment", "floatingPeriod"], () => {
  describe("Repayment after floating period  with and without origination fee", function () {
    let accountID;
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID
      })
      productID = await promisify(productAPI.createNewProduct("product_credit.json"));
    });

    paymentProcessingJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //create account and assign to customer
        const days = parseInt(data.account_effective_dt);
        const effective_dt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effective_dt,
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: 0,
          annual_fee_cents: 0,
        };
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        accountID = response.body.account_id;
      });

      it(`should have create a payment - '${data.tc_name}'`, () => {
        //Update payment amount and payment effective dt
        const paymentAmt = data.payment_amt_cents;
        const payment_effective_dt = dateHelper.addDays(0, 0);
        paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, payment_effective_dt);
      });

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getRollDate(1);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate payment - '${data.tc_name}'`, () => {
        //Validate the  repayment amount
        type AccSummary = Pick<AccountSummary, "principal_cents" |"fees_balance_cents"| "total_balance_cents" | "total_paid_to_date_cents">;
        const accSummary: AccSummary = {
          principal_cents: parseInt(data.current_principal_cents),
          fees_balance_cents: parseInt(data.fees_balance_cents),
          total_balance_cents: parseInt(data.total_balance_cents),
          total_paid_to_date_cents: parseInt(data.total_paid_to_date_cents),
        };
        accountValidator.validateAccountSummary(accountID, accSummary);
      });

      it(`should have validate late fee and origination fee details - '${data.tc_name}'`, () => {
        //Validate the  repayment amount
        lineItemsAPI.allLineitems(accountID).then(async (response) => {
          expect(response.status).to.eq(200);

          //Verify Late fee in line item
          type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const lateFeeLineItem: AccLineItem = {
            status: "VALID",
            type: "LATE_FEE",
            original_amount_cents: parseInt(data.late_fee_cents),
          };
          lineItemValidator.validateLineItem(response, lateFeeLineItem);

          //Verify origination fee
          if (parseInt(data.origination_fee_cents) != 0) {
            const originFeeLineItem: AccLineItem = {
              status: "VALID",
              type: "ORIG_FEE",
              original_amount_cents: parseInt(data.origination_fee_cents),
            };
            lineItemValidator.validateLineItem(response, originFeeLineItem);
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
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
>;