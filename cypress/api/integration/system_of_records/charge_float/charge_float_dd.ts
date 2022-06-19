import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { AccountSummary, accountValidator } from "../../../api_validation/account_validator";
import chargeProcessingJSON from "cypress/resources/testdata/charge/charge_float.json";
import { chargeAPI, ChargePayload } from "cypress/api/api_support/charge";
import { CycleTypeConstants } from "cypress/api/api_support/constants";

//Test Scripts
// pp283 - PP293 7days float validation - charge on account opening date,
// month after, year after, multiple charges overlapping
// PP300 - PP310 14days float validation - charge on parent card on the day of
// origination, day after, month after, year after, multiple charges overlapping
//PP317 - PP327 21days float validation - charge on parent card on the day of
// origination, day after, month after, year after, multiple charges overlapping
//PP334 - PP344 1 Month float validation - charge on parent card on the day of origination

TestFilters(["regression", "systemOfRecords", "chargeCards", "float"], () => {
  describe("Validate account with various cycle intervals", function () {
    let accountID;
    let productID;
    let product7DaysID;
    let product14DaysID;
    let productOneMonthID;
    let product21DaysID;
    let customerID;
    let accEffectiveAt;
    let chargeAmt;
    let effectiveDt;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //create customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });
    //Create new product with cycle intervals 7 days
    it(`should have create product with cycle intervals 7 days`, async () => {
      response = await promisify(productAPI.createProductWith7daysCycleInterval("product_charge.json", true, false));
      product7DaysID = response.body.product_id;
      cy.log("product created 7 days interval :" + product7DaysID);
    });

    //Create new product with cycle intervals 14 days
    it(`should have create product with cycle intervals 14 days`, async () => {
      response = await promisify(productAPI.createProductWith14daysCycleInterval("product_charge.json", true, false));
      product14DaysID = response.body.product_id;
      cy.log("product created 14 days interval :" + product14DaysID);
    });

    //Create new product with cycle intervals 21 days
    it(`should have create product with  cycle intervals 21 days`, async () => {
      response = await promisify(productAPI.createProductWith21daysCycleInterval("product_charge.json", true, false));
      product21DaysID = response.body.product_id;
      cy.log("product created 21 days interval :" + product21DaysID);
    });

    //Create new product with cycle intervals 1 month
    it(`should have create product with  cycle intervals 1 month`, async () => {
      response = await promisify(productAPI.createProductWith1monthCycleInterval("product_charge.json", true, false));
      productOneMonthID = response.body.product_id;
      cy.log("product created 1 month interval :" + productOneMonthID);
    });

    chargeProcessingJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        const days = parseInt(data.account_effective_dt);
        effectiveDt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        // Get Product ID for the different cycle intervals
        if (data.float_days.toLowerCase() === CycleTypeConstants.cycle_interval_7days) {
          productID = product7DaysID;
        } else if (data.float_days.toLowerCase() === CycleTypeConstants.cycle_interval_14days) {
          productID = product14DaysID;
        } else if (data.float_days.toLowerCase() === CycleTypeConstants.cycle_due_interval_30days) {
          productID = productOneMonthID;
        } else if (data.float_days.toLowerCase() === CycleTypeConstants.cycle_interval_21days) {
          productID = product21DaysID;
        }
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDt,
        };
        response = await promisify(accountAPI.updateNCreateAccount("account_only_promo.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created :" + accountID);
        accEffectiveAt = response.body.effective_at;
        cy.log("account effective date:" + accEffectiveAt);
      });
      it(`should be able to create create charge'`, async () => {
        chargeAmt = data.charge1_amt_cents; //variable to be used for Principal cents validation
        const chargeEffectiveDt = dateHelper.addDays(
          parseInt(data.charge1_effective_dt),
          parseInt(data.charge1_effective_dt_time)
        );
        const ChargePayload: CreateCharge = {
          effective_at: chargeEffectiveDt,
          original_amount_cents: chargeAmt,
        };
        response = await promisify(
          chargeAPI.chargeForNegativeAccount(accountID, "create_charge.json", ChargePayload, "200")
        );
        expect(response.status, "First charge response status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "Charge obtained in charge response").to.eq(
          parseInt(chargeAmt)
        );
      });

      //Create multiple charges with overlapping and non-overlapping charges
      if (data.multiple_charges.toLowerCase() === "true") {
        it(`should have create second charge - '${data.tc_name}'`, async () => {
          chargeAmt = data.charge2_amt_cents; //variable to be used  for Principal cents
          const chargeEffectiveDt = dateHelper.addDays(
            parseInt(data.charge2_effective_dt),
            parseInt(data.charge2_effective_dt_time)
          );
          const ChargePayload: CreateCharge = {
            effective_at: chargeEffectiveDt,
            original_amount_cents: chargeAmt,
          };
          response = await promisify(
            chargeAPI.chargeForNegativeAccount(accountID, "create_charge.json", ChargePayload, "200")
          );
          expect(response.status, "First charge response status").to.eq(200);
          expect(response.body.line_item_summary.principal_cents, "Charge obtained in charge response").to.eq(
            parseInt(chargeAmt)
          );
        });
      }
      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward - '${data.tc_name}'`, async () => {
        //Roll time forward to generate  account summary details
        const endDate = dateHelper.getRollDate(3);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Validate account summary details
      it(`should have validate account details - '${data.tc_name}'`, () => {
        if (data.multiple_charges.toLowerCase() === "true") {
          //When there are multiple charges...
          chargeAmt = data.total_balance_cents; // Principal cents on the account would be the addition of Charge 1 and Charge 2, fetch from the DataSheet
        }

        type AccSummary = Pick<AccountSummary, "principal_cents" | "total_balance_cents" | "total_paid_to_date_cents">;
        const accSummary: AccSummary = {
          principal_cents: parseInt(chargeAmt),
          total_balance_cents: parseInt(chargeAmt),
          total_paid_to_date_cents: 0,
        };
        accountValidator.validateAccountSummary(accountID, accSummary);
      });
    });
  });
});
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at">;
type CreateCharge = Pick<ChargePayload, "effective_at" | "original_amount_cents">;
