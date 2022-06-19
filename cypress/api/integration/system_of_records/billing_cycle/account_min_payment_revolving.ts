/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import billingCycleJSON from "../../../../resources/testdata/billingcycle/min_payment_revolving.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { statementsAPI } from "cypress/api/api_support/statements";

// PP2098 Verify minimum pay cents schedule with promo_len 999999 promo_min_pay_percent 0 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2099 Verify minimum pay cents schedule with promo_len 999999 promo_min_pay_percent 10 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2100 Verify minimum pay cents schedule with promo_len 999999 promo_min_pay_percent 50 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2101 Verify minimum pay cents schedule with promo_len 999999 promo_min_pay_percent 100 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2102 Verify minimum pay cents schedule with promo_len 6 promo_min_pay_percent 10 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2103 Verify minimum pay cents schedule with promo_len 12 promo_min_pay_percent 5 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2104 Verify minimum pay cents schedule with promo_len 24 promo_min_pay_percent 100 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2105 Verify minimum pay cents schedule with promo_len 999999 promo_min_pay_percent 0 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2106 Verify minimum pay cents schedule with promo_len 999999 promo_min_pay_percent 0 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2110 Verify minimum pay cents schedule with AM as promo_len 6 promo_min_pay_percent 0 initial principal 1000000 promo_default_interest_rate_percent 13.99
// PP2111 Verify minimum pay cents schedule with AM as promo_len 6 promo_min_pay_percent 50 initial principal 1000000 promo_default_interest_rate_percent 13.99

TestFilters(["regression", "billingCycle", "minPayment"], () => {
  let productID;
  let customerID;
  let response;
  let accountID;
  describe("Validate minimum payment revolving min pay cents", function () {
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });

    //iterate each product and account
    billingCycleJSON.forEach((data) => {
      it(`should have create product `, async () => {
        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          cycle_interval: data.cycle_interval,
          promo_min_pay_type: data.promo_min_pay_type,
          promo_len: parseInt(data.promo_len),
          promo_default_interest_rate_percent: parseFloat(data.promo_default_interest_rate_percent),
          post_promo_default_interest_rate_percent: parseInt(data.post_promo_default_interest_rate_percent),
          promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval_del: "first_cycle_interval",
          post_promo_len: parseInt(data.post_promo_len),
          post_promo_min_pay_type: data.post_promo_min_pay_type,
        };
        //Update payload and create an product
        const response = await promisify(
          productAPI.updateNCreateProduct("product_min_pay_revolving.json", productPayload)
        );
        productID = response.body.product_id;
      });

      it(`should have create account '${data.tc_name}'`, async () => {
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
      it(`should have to wait for account roll time forward to make sure statement is processed - '${data.tc_name}'`, async () => {
        const moveDays = dateHelper.calculateMoveDaysForCycleInterval(data.cycle_interval, 1);
        const rollDate = dateHelper.moveDate(data.account_effective_dt, moveDays).slice(0, 10);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollDate));
        expect(response.status).to.eq(200);
      });
      //Get statement list for account
      it(`should have  Verify minimum pay cents  - '${data.tc_name}'`, async () => {
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        const minPayCents = String(data.min_pay_cents);
        const minPay = String(response.body[0].min_pay_due.min_pay_cents);
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
  | "promo_len"
  | "promo_default_interest_rate_percent"
  | "post_promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
  | "promo_min_pay_type"
  | "post_promo_min_pay_type"
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
