/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import billingCycleJSON from "../../../resources/testdata/product/billing_parameter_cycle_interval.json";
import TestFilters from "../../../support/filter_tests.js";
import { dateHelper } from "../../api_support/date_helpers";
import { statementsAPI } from "../../api_support/statements";
import promisify from "cypress-promise";

//Test scripts
//PP1204,PP1210,PP1206A - Verify the impact of Billing cycle parameters for Multi Advance Installment loans during Promotion and post promo period
//Revolving LOC loans,Revolving cards,Revolving Credit cards,Charge cards,BNPL product
//PP1211-PP1216 - Verify the impact of Billing cycle parameters for Installment/Credit loans with Cycle interval - 14/30/1 month and Cycle due interval  2/5/-5/0/20 days

TestFilters(["regression", "billingCycle", "statements", "cycleInterval"], () => {
  let productID;
  let customerID;
  let accountID;
  let response;

  describe("Validate billing policy  with different cycle intervals ", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("new customer created successfully: " + customerID);
      });
    });

    //iterate each product and account
    billingCycleJSON.forEach((data) => {
      describe(`should have create product and account -'${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          productID = "";
          accountID = "";
          const productJSONFile = data.product_template_name;

          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            first_cycle_interval_del: "first_cycle_interval",
            promo_int: parseInt(data.promo_int),
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            post_promo_default_interest_rate_percent: parseInt(data.post_promo_default_interest_rate_percent),
            post_promo_len: parseInt(data.post_promo_len),
            post_promo_min_pay_type: data.post_promo_min_pay_type,
          };
          //Update payload and create an product
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
          cy.log("new product created successfully: " + response.body.product_id);
        });

        //create account
        it(`should have create account`, async () => {
          const accountFileName = data.account_template_name;
          // create account Json
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
          };
          response = await promisify(accountAPI.updateNCreateAccount(accountFileName, accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });

        it(`should have to wait for account roll time forward  to make sure statement is processed - '${data.tc_name}'`, async () => {
          if (data.roll_date.length !== 0) {
            const endDate = dateHelper.getAccountEffectiveAt(data.roll_date);
            const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
            expect(response.status).to.eq(200);
          }
        });

        it(`should have validate the min pay cents and due -'${data.tc_name}'`, async () => {
          response = await promisify(statementsAPI.getStatementByAccount(accountID));
          expect(response.status).to.eq(200);
          expect(
            String(response.body[0].min_pay_due.min_pay_cents),
            "Verify a Minimum Pay Cents for cycle"
          ).to.includes(String(data.min_pay_cents));
          expect(response.body[0].min_pay_due.min_pay_due_at.slice(0, 10), "Check first due date for the cycle").eq(
            data.min_pay_due_at.slice(0, 10)
          );
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "first_cycle_interval_del"
  | "cycle_interval"
  | "cycle_due_interval"
  | "promo_int"
  | "promo_len"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
  | "post_promo_default_interest_rate_percent"
  | "post_promo_len"
  | "post_promo_min_pay_type"
  | "doNot_check_response_status"
>;
type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "initial_principal_cents"
  | "credit_limit_cents"
  | "promo_impl_interest_rate_percent"
>;
