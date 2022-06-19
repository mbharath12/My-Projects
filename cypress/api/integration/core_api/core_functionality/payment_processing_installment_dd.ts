/* eslint-disable cypress/no-async-tests */
import { paymentAPI } from "../../../api_support/payment";
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { AccountSummary, accountValidator } from "cypress/api/api_validation/account_validator";
import paymentProcessingJSON from "cypress/resources/testdata/payment/paymentInstallments.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
// PP1-PP3 Full Loan amount payment / Half Loan payment / 5% loan payment
// without origination fee on account opening day
// PP7-PP9 Full Loan amount payment / Half Loan payment / 5% loan payment
// with origination fee on account opening day
// PP10-PP12 Full Loan amount payment / Half Loan payment / 5% loan payment
// without origination fee on next day of account opening day
// PP16-PP18 Full Loan amount payment / Half Loan payment / 5% loan payment
// with origination fee on next day of account opening day
// PP55-PP57	Full Loan amount payment / Half Loan payment / 5% loan payment
// without origination fee one day before grace period ends
// PP61-63	Full Loan amount payment / Half Loan payment / 5% loan payment
// with origination fee one day before grace period ends
// PP64-66	Full Loan amount payment / Half Loan payment / 5% loan payment
// without origination fee on the day of grace period ends
// PP70-72	Full Loan amount payment / Half Loan payment / 5% loan payment
// with origination fee on the day of grace period ends

TestFilters(["smoke","regression", "originationFee", "paymentPouring", "installmentProduct"], () => {
  describe("Payment with various amounts with and without origination fee", function () {
    let accountID;
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID
      })
      productID = await promisify(productAPI.createNewProduct("payment_product.json"));
    });

    paymentProcessingJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        const days = parseInt(data.account_effective_dt);
        const effectiveDt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDt,
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: 0,
          annual_fee_cents: 0
        };
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        accountID = response.body.account_id;
      });

      it(`should have create a payment - '${data.tc_name}'`,() => {
        //Update payment amount and payment effective dt
        const paymentEffectiveDt = dateHelper.addDays(0, 0);
        const paymentAmt = data.payment_amt_cents;
        paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, paymentEffectiveDt);
      });

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        //Roll time forward to generate surcharge lineItem
        const endDate = dateHelper.getRollDate(1);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate payment - '${data.tc_name}'`, () => {
        //Validate the  payment amount
        type AccSummary = Pick<AccountSummary, "principal_cents" | "fees_balance_cents" |"total_balance_cents" | "total_paid_to_date_cents">;
        const accSummary: AccSummary = {
          principal_cents: parseInt(data.current_principal_cents),
          total_balance_cents: parseInt(data.total_balance_cents),
          total_paid_to_date_cents: parseInt(data.total_paid_to_date_cents),
          fees_balance_cents: parseInt(data.fee_balance_cents)
        };
        accountValidator.validateAccountSummary(accountID, accSummary);
      });
    });
  });
});
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "origination_fee_cents" | "late_fee_cents" | "monthly_fee_cents" | "annual_fee_cents"
>;
