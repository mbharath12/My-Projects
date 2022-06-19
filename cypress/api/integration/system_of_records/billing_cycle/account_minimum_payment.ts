/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import billingCycleJSON from "../../../../resources/testdata/billingcycle/min_payment.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";

//PP2090 - Verify minimum pay cents in AM schedule with post promo len as 12 initial principal 3000000 post promo default interest rate percent is 3.99
//PP2091 - Verify minimum pay cents in AM schedule with post promo len as 24 initial principal 3000000 post promo default interest rate percent is 15.00
//PP2092 - Verify minimum pay cents in AM schedule with post promo len as 36 initial principal 3000000 post promo default interest rate percent is 23.99
//PP2093 - Verify minimum pay cents in AM schedule with post promo len as 48 initial principal 3000000 post promo default interest rate percent is 23.99
//PP2094 - Verify minimum pay cents in AM schedule with post promo len as 56 initial principal 3000000 post promo default interest rate percent is 13.99
//PP2095 - Verify minimum pay cents in AM schedule with post promo len as 4 initial principal 500000 post promo default interest rate percent is 8.0
//PP2096 - Verify minimum pay cents in AM schedule with post promo len as 6 initial principal 500000 post promo default interest rate percent is 13.99
//PP2097 - Verify minimum pay cents in AM schedule with post promo len as 8 initial principal 500000 post promo default interest rate percent is 8.0

TestFilters(["regression", "billingCycle", "minPayment"], () => {
  let productID;
  let amResponse;
  let customerID;
  let accountID;
  let response;
  describe("Validate billing cycle date and due date with different billing policies", function () {
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });

    //iterate each product and account
    billingCycleJSON.forEach((data) => {
      it(`Should have create product `, async () => {
        cy.log(data.post_promo_default_interest_rate_percent);
        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval_del: "first_cycle_interval",
          post_promo_len: parseInt(data.post_promo_len),
          post_promo_default_interest_rate_percent: parseFloat(data.post_promo_default_interest_rate_percent),
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct("product_installment.json", productPayload));
        productID = response.body.product_id;
      });

      it(`should have create account `, async () => {
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
        response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });
      it(`should have to wait for account roll time forward to make sure AM schedule is processed - '${data.tc_name}'`, async () => {
        const moveDays = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 1);
        const rollDate = dateHelper.moveDate(data.account_effective_dt, moveDays).slice(0, 10);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollDate));
        expect(response.status).to.eq(200);
      });
      it(`should have validate minimum payment cents in AM schedule - '${data.tc_name}'`, async () => {
        amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
        expect(amResponse.status).to.eq(200);
        expect(amResponse.body.length, "check number of cycles in amortization schedule").to.eq(
          parseInt(data.post_promo_len)
        );
        const minPayCents = String(data.am_min_pay_cents);
        const minPay = String(amResponse.body[0].am_min_pay_cents);
        expect(minPay, "Verify a Minimum Pay Cents for cycle").to.includes(minPayCents);
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval_del"
  | "post_promo_len"
  | "post_promo_default_interest_rate_percent"
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
  | "credit_limit_cents"
  | "initial_principal_cents"
>;
