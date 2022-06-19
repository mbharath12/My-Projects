import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import minPayJSON from "../../../../resources/testdata/billingcycle/cycle_type_multi_adv_installment.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
// eslint-disable-next-line cypress/no-async-tests

// PP2113 Verify minimum pay cents schedule with AM as post_promo_len 12 promo_min_pay_percent 10 initial principal 5000000 post_promo_default_interest_rate_percent 8
// PP2114 Verify minimum pay cents schedule with AM as post_promo_len 24 promo_min_pay_percent 10 initial principal 5000000 post_promo_default_interest_rate_percent 8
// PP2115 Verify minimum pay cents schedule with AM as post_promo_len 36 promo_min_pay_percent 100 initial principal 5000000 post_promo_default_interest_rate_percent 9
// PP2116 Verify minimum pay cents schedule with AM as post_promo_len 48 promo_min_pay_percent 100 initial principal 5000000post_promo_default_interest_rate_percent 10
// PP2117 Verify minimum pay cents schedule with AM as post_promo_len 56 promo_min_pay_percent 0 initial principal 5000000 post_promo_default_interest_rate_percent 12.99
// PP2118 Verify minimum pay cents schedule with AM as post_promo_len 12 promo_min_pay_percent 0 initial principal 5000000 post_promo_default_interest_rate_percent 13.99

TestFilters(["regression", "billingCycle", "minPayment"], () => {
  let productID;
  let customerID;
  let amResponse;
  let accountID;
  let response;
  describe("Validate multi advanced installments min pay cents", function () {
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });

    //iterate each product and account
    minPayJSON.forEach((data) => {
      it(`should able to create product `, async () => {
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
          productAPI.updateNCreateProduct("product_multi_adv_installment.json", productPayload)
        );
        productID = response.body.product_id;
      });

      // eslint-disable-next-line cypress/no-async-tests
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
      it(`should have to wait for account roll time forward - '${data.tc_name}'`, async () => {
        const rollDate = dateHelper.getStatementDate(data.roll_time_forward, 1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollDate));
        expect(response.status).to.eq(200);
      });
      it(`should have validate minimum payment cents in AM schedule- '${data.tc_name}'`, async () => {
        amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
        expect(amResponse.status).to.eq(200);
        const len = amResponse.body.length;
        if (len !== 0) {
          const amMinPayCents = String(data.am_min_pay_cents);
          const amMinPay = String(amResponse.body[0].am_min_pay_cents);
          expect(amMinPay, "Verify a AM Minimum Pay Cents for cycle").to.includes(amMinPayCents);
        }
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
