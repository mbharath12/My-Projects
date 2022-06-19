/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { Auth } from "../../../api_support/auth";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";
import { chargeAPI } from "../../../api_support/charge";
import lineItemProcessingJSON from "../../../../resources/testdata/lineitem/individual_line_item_product_account.json";
import transactionsJSON from "../../../../resources/testdata/lineitem/individual_line_items_transaction.json";
import { lineItemsAPI } from "../../../api_support/lineItems";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1482 -PP1484 & PP1945-PP1953 - Get Line items for a specific account on various products-
//Charges and Charge Reversal, Payments, Payment Reversal, Multiple Line Items on the same date

TestFilters(["regression", "lineItem"], () => {
  describe("Validation of individual line items on various products", function () {
    let accountID;
    let productID;
    let productJSONFile;
    let customerID;
    let effectiveDate;
    let filtered;

    before(() => {
      const auth = new Auth();
      auth.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    lineItemProcessingJSON.forEach((data) => {
      filtered = transactionsJSON.filter((results) => results.tc_name == data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
        it(`should have create product`, async() => {
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
          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          Cypress.env("product_id", response.body.product_id);
          cy.log("new product created : " + Cypress.env("product_id"));
        });

        it(`should have create account`, async() => {
          productID = Cypress.env("product_id");
          customerID = Cypress.env("customer_id");
         // effectiveDate = data.account_effective_dt;
         effectiveDate =dateHelper.getAccountEffectiveAt(data.account_effective_dt);
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
            promo_impl_interest_rate_percent: parseInt(data.promo_int),
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          Cypress.env("account_id", response.body.account_id);
          cy.log("new account created : " + Cypress.env("account_id"));
        });
      });

      describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
        filtered.forEach((results) => {
          if (results.type === "validation") {
            it(`should have validate line item transaction  - '${results.exp_line_item_type}'`, async() => {
              accountID = Cypress.env("account_id");
              if (results.roll_date.length !== 0) {
                let endDate = dateHelper.getAccountEffectiveAt(results.roll_date);
                const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0,10)));
                const response1 = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0,10)));
                 expect(response.status).to.eq(200);
                  expect(response1.status).to.eq(200);
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
                account_id:Cypress.env("account_id"),
                product_id:parseInt(Cypress.env("product_id")),
                line_item_id:"",
                created_at:"",
                description:(results.exp_description)
              };
              const response=await promisify(lineItemsAPI.allLineitems(accountID));
               expect(response.status).to.eq(200);
               lineItemValidator.validateAccountLineItemWithEffectiveDate(response, expOrigFeeLineItemToValidate);
            });
          }

          if (results.type === "debitoffset") {
            //There is no charge reversal api. We are use debit offset for charge reversal
            it(`should be able to create debit offset line item`, () => {
              accountID = Cypress.env("account_id");
              lineItemsAPI.debitOffsetForAccount(
                accountID,
                "debit_offset.json",
                results.original_amount_cents,
                results.effective_at
              );
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

          if (results.type === "payment") {
            it(`should be able to create a payment at first cycle interval`, async() => {
              accountID = Cypress.env("account_id");
              let payEffectivedt=dateHelper.getAccountEffectiveAt(results.effective_at);
              cy.log(payEffectivedt);
              Cypress.env("payment_id", "");
              const paymentID = await promisify(
                paymentAPI.paymentForAccount(
                  accountID,
                  "payment.json",
                  results.original_amount_cents,
                  payEffectivedt
                )
              );
              Cypress.env("payment_id", paymentID);
            });
          }
          if (results.type === "paymentreversal") {
            it(`should be able to create a payment reversal`, async() => {
              accountID = Cypress.env("account_id");
              cy.log(Cypress.env("payment_id"));
              const response = await promisify(
                lineItemsAPI.paymentReversalLineitems(accountID, Cypress.env("payment_id"))
              );
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
