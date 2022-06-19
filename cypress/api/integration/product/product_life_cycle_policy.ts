/* eslint-disable cypress/no-async-tests */
import { productAPI, ProductPayload } from "cypress/api/api_support/product";
import { accountAPI, AccountPayload } from "cypress/api/api_support/account";
import { customerAPI } from "cypress/api/api_support/customer";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { authAPI } from "cypress/api/api_support/auth";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import productProcessingJSON from "cypress/resources/testdata/product/product_life_cycle_policy.json";
import TestFilters from "cypress/support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1178 - Verify account status is updated to Suspended/Delinquent after late events
//PP1180 - Verify account status is updated to Closed/Charged Off after late events
//PP1182,PP1182A-PP1182C - Validate value set for "Charge off" should be greater than the "Delinquency" substatus in an Installment,Revolving,Charge,Credit
//PP1183,PP1183A-PP1183C - Validate value set for "Charge off" and "Delinquency" substatus parameter should not be less than 1

TestFilters(["regression", "product"], () => {
  describe("validation of products life cycle policies", function () {
    let productJSONFile;
    let accountID;
    let productID;
    let customerID;
    let effectiveDate;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    //iterate each product and account
    productProcessingJSON.forEach((data) => {
      describe(`should have create product - '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          productJSONFile = data.exp_product_file_name;
          //Update Cycle_interval,Cycle_due,Promo policies
          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            first_cycle_interval: "delete",
          };
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          cy.log("new product created successfully: " + response.body.product_id);
          Cypress.env("product_id", response.body.product_id);
        });

        it(`should have create account'`, async () => {
          productID = Cypress.env("product_id");
          customerID = Cypress.env("customer_id");
          //create account JSON
          effectiveDate = data.account_effective_dt;

          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDate,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
            late_fee_cents: parseInt(data.late_fee),
            promo_impl_interest_rate_percent: parseInt(data.promo_impl_interest_rate_percent),
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_only_promo.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });

        it(`should have to wait for account roll time forward  to make sure line item is processed - '${data.tc_name}'`, async () => {
          if (data.roll_date.length !== 0) {
            const endDate = dateHelper.getAccountEffectiveAt(data.roll_date);
            const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
            expect(response.status).to.eq(200);
          }
        });

        it(`should have validate account status - '${data.tc_name}'`, async () => {
          //Validate the account status
          const response1 = await promisify(accountAPI.getAccountById(accountID));
          expect(response1.status).to.eq(200);
          expect(response1.body.account_overview.account_status, "verify account status ").to.eq(data.exp_acc_status);
          expect(response1.body.account_overview.account_status_subtype, "verify account sub-status ").to.eq(
            data.exp_acc_sub_status
          );
        });
      });
    });
    type CreateProduct = Pick<
      ProductPayload,
      | "cycle_interval"
      | "cycle_due_interval"
      | "promo_len"
      | "promo_min_pay_type"
      | "promo_default_interest_rate_percent"
      | "promo_min_pay_percent"
      | "delinquent_on_n_consecutive_late_fees"
      | "charge_off_on_n_consecutive_late_fees"
      | "first_cycle_interval"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "late_fee_cents"
      | "promo_impl_interest_rate_percent"
    >;
  });
});
