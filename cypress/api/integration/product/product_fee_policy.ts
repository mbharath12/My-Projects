/* eslint-disable cypress/no-async-tests */
import { productAPI, ProductPayload } from "../../api_support/product";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { lineItemsAPI } from "../../api_support/lineItems";
import { lineItemValidator } from "../../api_validation/line_item_validator";
import { dateHelper } from "../../api_support/date_helpers";
import { authAPI } from "../../api_support/auth";
import { rollTimeAPI } from "../../api_support/rollTime";
import productProcessingJSON from "../../../resources/testdata/product/product_fee_policy.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1187,PP1187A,PP1187B - Verify late fee is not charged on Installment,Charge,Credit if payment due is received till the expiry of the grace period
//PP1188,PP1188A,PP1188B - Verify Grace days set up for charging late fee at Account level will override the grace days set up at Installment,charge,credit Product level
//PP1189,PP1189A,PP1190 - Verify Surcharge parameters can be set up for charging surcharge for all account under the revolving,credit Product
//PP1184,PP1186 - Verify available credit is increased for pending payment  when this parameter is set to True/False

TestFilters(["regression", "product"], () => {
  describe("validation of products fee policies", function () {
    let productJSONFile;
    let accountJSONFile;
    let accountID;
    let productID;
    let customerID;
    let effectiveDate;
    let response;
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
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
            late_fee_grace: data.late_fee_grace,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            pending_pmt_affects_avail_credit: data.pending_pmt_affects_avail_credit,
            first_cycle_interval_del: "delete",
          };
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
        });

        it(`should have create account'`, async () => {
          accountJSONFile = data.exp_account_file_name;
          //create account JSON
          effectiveDate = dateHelper.getAccountEffectiveAt(data.account_effective_dt);
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDate,
            late_fee_grace: data.acc_late_fee_grace,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
            late_fee_cents: parseInt(data.late_fee),
          };

          const response = await promisify(accountAPI.updateNCreateAccount(accountJSONFile, accountPayload));
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

        it(`should have validate the existence of ' ${data.chk_line_item.toLowerCase()} ' line item - ' ${
          data.tc_name
        }''`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          let bLineItemExist = lineItemValidator.checkLineItem(response, data.chk_line_item);
          expect(
            data.bln_chk_line_item.toLowerCase(),
            "check ".concat(data.chk_line_item.toLowerCase(), " line item displayed")
          ).to.eq(bLineItemExist.toString());
        });

        it(`should have validate the available credit - '${data.tc_name}'`, async () => {
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(200);
          expect(response.body.summary.available_credit_cents, "verify available credit.").to.eq(
            parseInt(data.available_credit_cents)
          );
        });
      });
    });
    type CreateProduct = Pick<
      ProductPayload,
      | "cycle_interval"
      | "cycle_due_interval"
      | "late_fee_grace"
      | "promo_len"
      | "promo_min_pay_type"
      | "promo_default_interest_rate_percent"
      | "promo_min_pay_percent"
      | "first_cycle_interval_del"
      | "pending_pmt_affects_avail_credit"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "late_fee_cents"
      | "first_cycle_interval_del"
      | "late_fee_grace"
    >;
  });
});
