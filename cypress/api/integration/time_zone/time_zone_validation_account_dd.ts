import { productAPI, ProductPayload } from "../../api_support/product";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import productProcessingJSON from "../../../resources/testdata/timezone/account_timezone.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test cases covered
//TZ-68 -TZ-80-Validate timezone of an Installment/Revolving account in Honolulu,Anchorage,Adak,Dawson
//Phoenix,Hermosillo,Regina,Los Angeles,Denver,Nipigon,Indianapolis,Toronto,Panama

TestFilters(["regression", "account", "timezone"], () => {
  describe("Validation of timezone on account level", function () {
    let accountID;
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });

    //iterate each product and account
    productProcessingJSON.forEach((data) => {
      describe(`should have create product - '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          //Update Cycle_interval,Cycle_due,Promo policies
          const productPayload: CreateProduct = {
            effective_at: data.product_effective_dt,
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            first_cycle_interval: data.first_cycle_interval,
            product_time_zone: data.product_time_zone,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            post_promo_len: parseInt(data.post_promo_len),
          };
          const response = await promisify(productAPI.updateNCreateProduct(data.exp_product_file_name, productPayload));
          cy.log("new product created successfully: " + response.body.product_id);
          productID = response.body.product_id;
        });

        it(`should have create account'`, async () => {
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
            promo_len: parseInt(data.acc_promo_len),
            promo_min_pay_type: data.acc_promo_min_pay_type,
            promo_purchase_window_len: parseInt(data.acc_promo_purchase_window_len),
            promo_interest_deferred: data.acc_promo_interest_deferred,
            promo_min_pay_percent: parseInt(data.acc_promo_min_pay_percent),
            promo_impl_interest_rate_percent: parseInt(data.acc_promo_impl_interest_rate_percent),
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_only_promo.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
          expect(response.body.effective_at, "verify the account effective date is same as the request format").to.eq(
            data.account_effective_dt
          );

          if (data.exp_product_type.toLowerCase() === "installment") {
            expect(
              response.body.account_product.product_lifecycle.loan_end_date,
              "verify the loan end date is same as the Olson request format"
            ).to.eq(data.exp_loan_end_dt);
            expect(
              response.body.account_product.post_promo_overview.post_promo_inclusive_start,
              "verify the post promo exclusive start date is same as the Olson request format"
            ).to.eq(data.exp_promo_start_dt);
            expect(
              response.body.account_product.post_promo_overview.post_promo_exclusive_end,
              "verify the post promo exclusive end date is same as the Olson request format"
            ).to.eq(data.exp_promo_end_dt);
          }
        });
      });
    });
    type CreateProduct = Pick<
      ProductPayload,
      | "effective_at"
      | "cycle_interval"
      | "cycle_due_interval"
      | "first_cycle_interval"
      | "product_time_zone"
      | "promo_len"
      | "promo_min_pay_type"
      | "delinquent_on_n_consecutive_late_fees"
      | "charge_off_on_n_consecutive_late_fees"
      | "post_promo_len"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "promo_len"
      | "promo_min_pay_type"
      | "promo_purchase_window_len"
      | "promo_interest_deferred"
      | "promo_min_pay_percent"
      | "promo_impl_interest_rate_percent"
    >;
  });
});
