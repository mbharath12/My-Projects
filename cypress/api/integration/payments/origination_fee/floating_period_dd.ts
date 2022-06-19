/* eslint-disable cypress/no-async-tests */
import { paymentAPI } from "../../../api_support/payment";
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { AccountSummary, accountValidator } from "../../../api_validation/account_validator";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import paymentProcessingJSON from "cypress/resources/testdata/payment/payment_credit.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

// PP1-PP3 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// without origination fee on account opening day

//PP19-PP21 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// without origination fee on middle of floating period
//PP25-PP27 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// with origination fee on middle of floating period

//PP28-PP30 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// without origination fee one day before floating period ends
//PP34-PP36 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// with origination fee one day before floating period ends

//PP37-PP39 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// without origination fee one the day before floating period
//PP43-PP45 Full Loan amount repayment / Half Loan Repayment / 5% loan Repayment
// with origination fee one the day before floating period

TestFilters(["regression", "originationFee", "payment", "floatingPeriod"], () => {
  describe("Repayment with various amounts with and without origination fee of floating period test cases", function () {
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
        const paymentEffectiveDt = dateHelper.addDays(0, 0);
        const paymentAmt = data.payment_amt_cents;
        paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, paymentEffectiveDt);
      });

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        //Roll time forward to generate surcharge lineItem
        const endDate = dateHelper.getRollDate(1) + "T00:00:00";
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate payment - '${data.tc_name}'`, () => {
        //Validate the  repayment amount
        type AccSummary = Pick<AccountSummary, "principal_cents" | "fees_balance_cents"|"total_balance_cents" | "total_paid_to_date_cents">;
        const accSummary: AccSummary = {
          principal_cents: parseInt(data.current_principal_cents),
          fees_balance_cents: parseInt(data.fees_balance_cents),
          total_balance_cents: parseInt(data.total_balance_cents),
          total_paid_to_date_cents: parseInt(data.total_paid_to_date_cents),
        };
        accountValidator.validateAccountSummary(accountID, accSummary);
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
