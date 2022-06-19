/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import billingCycleJSON from "../../../../resources/testdata/billingcycle/cycle_type_product_accounts.json";
import transactionJSON from "../../../../resources/testdata/billingcycle/cycle_type_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";

//TC2043 to TC2048 - Verify cycle type details in AM schedule with post promo len as 6 and different cycle policies
//TC2050 to TC2062 - Verify cycle type details in AM schedule with post promo len as 12 and different cycle policies
//TC2064 - Verify cycle type details in AM schedule with post promo len as 24
//TC2065 to TC2069 - Verify cycle type details in AM schedule with post promo len as 36 and different cycle policies
//TC2071 - Verify cycle type details in AM schedule with post promo len as 12 cycle interval as 1 month cycle
//TC2072 TC2073 - Verify cycle type details in AM schedule with post promo len as 24 cycle interval as 1 month cycle
//TC2074 to TC2076 - Verify cycle type details in AM schedule with post promo len as 36 cycle interval as 1 month cycle
//TC2077 TC2078 - Verify cycle type details in AM schedule with post promo len as 48 cycle interval and cycle interval as 1 month cycle
//TC2079 - Verify cycle type details in AM schedule with post promo len as 48 cycle interval 3 months cycle due interval 5 days first cycle 0 days
//TC2080 - Verify cycle type details in AM schedule with post promo len as 48 cycle interval 3 months cycle due interval 10 days first cycle 3 months
//TC2081 - Verify cycle type details in AM schedule with post promo len as 48 cycle interval 3 months cycle due interval 10 days first cycle 4 months
//TC2082 - Verify cycle type details in AM schedule with post promo len as 56 cycle interval 3 months cycle due interval -10 days first cycle 0 days

TestFilters(["regression", "billingCycle", "cycleType"], () => {
  let productID;
  let validationTransactionJSON;
  let amResponse;
  let accountID;
  let customerID;
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
      validationTransactionJSON = transactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          const productJSONFile = data.product_template_name;

          const productPayload: CreateProduct = {
            post_promo_len: parseInt(data.post_promo_len),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            first_cycle_interval_del: "first_cycle_interval",
          };
          //Update payload and create an product
          response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
        });

        it(`should have create account`, async () => {
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            cycle_interval_del: "cycle_interval",
            cycle_due_interval_del: "cycle_due_interval",
            first_cycle_interval: data.first_cycle_interval,
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
          };
          //Update payload and create an account
          response = await promisify(accountAPI.updateNCreateAccount(data.account_template_name, accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);

          const rollDate = dateHelper.getStatementDate(data.account_effective_dt, 1);
          rollTimeAPI.rollAccountForward(accountID, rollDate).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
        it(`should have get the AM schedule - '${data.tc_name}'`, async () => {
          amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
          expect(amResponse.status).to.eq(200);
          expect(amResponse.body.length, "check number of cycles in amortization schedule").to.eq(
            parseInt(data.post_promo_len)
          );
        });
      });

      describe(`should have to validate cycle type details - '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          it(`should have validate account cycle type details  - '${results.tc_name}'`, () => {
            const cycleNumber = parseInt(results.cycle_number) - 1;
            expect(
              amResponse.body[cycleNumber].cycle_exclusive_end,
              "Verify cycle_exclusive_end for ".concat(results.cycleNumber, "cycle")
            ).to.includes(results.exp_cycle_exclusive_end);
            expect(
              amResponse.body[cycleNumber].min_pay_due_at,
              "Verify min_pay_due_at for ".concat(results.cycleNumber, "cycle")
            ).to.includes(results.exp_min_pay_due_at);
          });
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "post_promo_len"
  | "first_cycle_interval_del"
  | "cycle_interval"
  | "cycle_due_interval"
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
>;
