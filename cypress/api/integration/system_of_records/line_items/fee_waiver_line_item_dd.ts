/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";
import { chargeAPI } from "../../../api_support/charge";
import lineItemProcessingJSON from "cypress/resources/testdata/lineitem/fee_waiver_line_item_product_account.json";
import transactionsJSON from "cypress/resources/testdata/lineitem/fee_waiver_line_items_transaction.json";
import { lineItemsAPI } from "../../../api_support/lineItems";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1485 -PP1490 & PP2027-PP2041 - Attempt to revert for a specific account on various products-
//Origination Fee Reversal, Monthly Fee Reversal, Year Fee Reversal, Late Fee Reversal ,Payment Fee Reversal, Surcharge Fee Reversal

TestFilters(["regression", "lineItem"], () => {
  describe("Validation of fee waiver line items on various products", function () {
    let accountID;
    let productID;
    let productJSONFile;
    let customerID;
    let effectiveDate;
    let lineItemID;
    let filtered;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    lineItemProcessingJSON.forEach((data) => {
      filtered = transactionsJSON.filter((results) => results.tc_name == data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          productJSONFile = data.exp_product_file_name;

          //update the Cycle_interval,Cycle_due,Promo policies
          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            delete_field_name: "first_cycle_interval",
          };

          const response = await promisify(
            productAPI.updateNCreateProduct(productJSONFile, productPayload)
          );
          Cypress.env("product_id", response.body.product_id);
        });

        it(`should have create account`, async () => {
          productID = Cypress.env("product_id");
          customerID = Cypress.env("customer_id");
          effectiveDate = data.account_effective_dt;

          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDate,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            credit_limit_cents: parseInt(data.credit_limit_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            payment_reversal_fee_cents: parseInt(data.payment_reversal_fee_cents),
            promo_impl_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
          };

          const response = await promisify(
            accountAPI.updateNCreateAccount("account_charge.json", accountPayload)
          );
          expect(response.status).to.eq(200);
          Cypress.env("account_id", response.body.account_id);
          cy.log("new account created : " + Cypress.env("account_id"));
        });
      });

      describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
        filtered.forEach((results) => {
          if (results.type === "validation") {
            it(`should have validate line item transaction  - '${results.exp_line_item_type}'`, async () => {
              accountID = Cypress.env("account_id");
              if (results.roll_date.length !== 0) {
                let endDate = dateHelper.getAccountEffectiveAt(results.roll_date);
                const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0,10)));
                expect(response.status).to.eq(200);
              }
              const expOrigFeeLineItemToValidate: AllLineItemSummary = {
                status: "VALID",
                type: results.exp_line_item_type,
                original_amount_cents: parseInt(results.exp_original_amount_cents),
                effective_at: results.transaction_date,
                balance_cents: parseInt(results.exp_balance_cents),
                principal_cents: parseInt(results.exp_principal_cents),
                interest_balance_cents: parseInt(results.exp_interest_balance_cents),
                deferred_interest_balance_cents: parseInt(results.exp_deferred_interest_balance_cents),
                am_deferred_interest_balance_cents: parseInt(results.exp_am_deferred_interest_balance_cents),
                am_interest_balance_cents: parseInt(results.exp_am_interest_balance_cents),
                total_interest_paid_to_date_cents: parseInt(results.exp_total_interest_paid_to_date_cents),
                account_id: Cypress.env("account_id"),
                product_id: parseInt(Cypress.env("product_id")),
                line_item_id: "",
                created_at: "",
                description: results.exp_description,
              };
              const response = await promisify(lineItemsAPI.allLineitems(accountID));
              expect(response.status).to.eq(200);
              lineItemValidator.validateAccountLineItemWithEffectiveDate(response, expOrigFeeLineItemToValidate);
            });
          }

          if (results.type === "charge") {
            it(`should be able to create create additional charge`, () => {
              accountID = Cypress.env("account_id");
              chargeAPI.chargeForAccount(
                accountID,
                "create_charge.json",
                results.original_amount_cents,
                results.effective_at
              );
            });
          }

          if (results.type === "getlineitem") {
            it(`should be able to get a line item '${results.exp_line_item_type}'`, async () => {
              accountID = Cypress.env("account_id");
              const response = await promisify(lineItemsAPI.allLineitems(accountID));
              expect(response.status).to.eq(200);
              lineItemID = lineItemsAPI.getLineItemOfAnAccount(response, results.exp_line_item_type, results.effective_at);
            });
          }

          if (results.type === "feereversal") {
            it(`should be able to create a fee reversal '${results.exp_line_item_type}'`, async () => {
              accountID = Cypress.env("account_id");
              const response = await promisify(lineItemsAPI.feeWaiverLineitems(accountID, lineItemID));
              expect(response.status).to.eq(200);
            });
          }
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
      | "delete_field_name"
    >;

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "origination_fee_cents"
      | "late_fee_cents"
      | "monthly_fee_cents"
      | "annual_fee_cents"
      | "payment_reversal_fee_cents"
      | "promo_impl_interest_rate_percent"
    >;

    type AllLineItemSummary = Pick<
      LineItem,
      | "status"
      | "type"
      | "original_amount_cents"
      | "effective_at"
      | "balance_cents"
      | "principal_cents"
      | "interest_balance_cents"
      | "deferred_interest_balance_cents"
      | "am_deferred_interest_balance_cents"
      | "am_interest_balance_cents"
      | "total_interest_paid_to_date_cents"
      | "account_id"
      | "product_id"
      | "line_item_id"
      | "created_at"
      | "description"
    >;
  });
});
