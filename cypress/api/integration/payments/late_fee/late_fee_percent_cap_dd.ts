import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import lateFeeCycleJSON from "../../../../resources/testdata/payment/late_fee_percent_caps.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";

//Test Cases:
// PP1150A - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 5 initial_principal_cents 10000
// PP1150B - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 12.5 initial_principal_cents 100000
// PP1150C - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 4 initial_principal_cents 6000000
// PP1150D - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 10 initial_principal_cents 20000000
// PP1150E - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 1 initial_principal_cents 1000000
// PP1149A - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 1 initial_principal_cents 2900000
// PP1150F - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 1 initial_principal_cents 30000000
// PP1150G - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 3 initial_principal_cents 500000
// PP1150H - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 6.5 initial_principal_cents 1000000
// PP1150I - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 7 initial_principal_cents 1000000
// PP1150J - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 6.5 initial_principal_cents 200000
// PP1150K - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 12 initial_principal_cents 100000
// PP1150L - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 8 initial_principal_cents 5500000
// PP1150M - Verify Original Amount Cents in Late Fees with late_fee_cap_percent 4 initial_principal_cents 6000000

let productID;
let accountID;
let customerID;

TestFilters(["regression", "lateFeeCap", "cycleInterval"], () => {
  describe("Late Fee validation using Installment product with boundary check", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });

    //Iterate each product and account
    lateFeeCycleJSON.forEach((data) => {
      it(`should have create product`, async () => {
        const productJSONFile = data.product_template_name;

        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval_del: "first_cycle_interval",
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
        productID = response.body.product_id;
      });

      it(`should have create account`, () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          late_fee_cap_percent: parseFloat(data.late_fee_cap_percent),
          effective_at: data.account_effective_dt,
          initial_principal_cents: parseInt(data.initial_principal_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
        };
        //Update payload and create an account
        accountAPI.updateNCreateAccount(data.account_template_name, accountPayload).then((response) => {
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
          const rollDate = dateHelper.getAccountEffectiveAt(data.roll_forward_date);
          rollTimeAPI.rollAccountForward(accountID, rollDate).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });
      it(`should have validate late fee - '${data.tc_name}''`, async () => {
        //Validate the LineItem:Late Fee
        const response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        const lateFeeLineItem: AccLineItem = {
          status: "VALID",
          type: "LATE_FEE",
          original_amount_cents: parseInt(data.late_fee_charged),
        };
        lineItemValidator.validateLineItem(response, lateFeeLineItem);
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
  | "initial_principal_cents"
  | "late_fee_cap_percent"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
>;
