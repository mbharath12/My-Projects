/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { paymentAPI } from "../../../api_support/payment";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { Auth } from "cypress/api/api_support/auth";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";
import { chargeAPI } from "../../../api_support/charge";
import lineItemProcessingJSON from "../../../../resources/testdata/lineitem/all_line_items_product_account.json";
import transactionsJSON from "../../../../resources/testdata/lineitem/all_line_items_transaction.json";
import { lineItemsAPI } from "cypress/api/api_support/lineItems";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1470 -PP1481 & PP1541-1570 & PP2171-PP2173 - Get Line items for a specific account on various products-
//Charges and Initial Cents, Payments, Origination fees, Monthly fees , Annual Fees and Interest,
//Debit Offset, Credit Offset, Payment reversals, Payment Reversal fees, Late fees,Surcharge,Fee waiver line Items

TestFilters(["regression", "lineItem"], () => {
  describe("Validation of line items on various products", function () {
    let accountID;
    let productID;
    let productJSONFile;
    let customerID;
    let effectiveDate;
    let lineItemID;
    let accountTransactionJSON;

    before(() => {
      const auth = new Auth();
      auth.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    //iterate each product and account
    lineItemProcessingJSON.forEach((data) => {
      accountTransactionJSON = transactionsJSON.filter((results) => results.tc_name === data.tc_name);
      describe(`should have create product and account- '${data.tc_name}'`, () => {
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
            delete_field_name: "first_cycle_interval",
          };

          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
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
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            payment_reversal_fee_cents: parseInt(data.payment_reversal_fee_cents),
            promo_impl_interest_rate_percent: parseInt(data.promo_int),
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_charge.json", accountPayload));
          expect(response.status).to.eq(200);
          Cypress.env("account_id", response.body.account_id);
          cy.log("new account created : " + Cypress.env("account_id"));
        });
      });

      describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
        // For each account create multiple transactions and validate account
        // line item data
        accountTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            //Validate account line item when transaction type is validation

            case "validation":
              it(`should have validate line item transaction  - '${results.exp_line_item_type}'`, async () => {
                accountID = Cypress.env("account_id");
                if (results.roll_date.length !== 0) {
                  const endDate = dateHelper.getAccountEffectiveAt(results.roll_date);
                  rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)).then((response) => {
                    expect(response.status).to.eq(200);
                  });
                }

                const expOrigFeeLineItemToValidate: AllLineItemSummary = {
                  status: "VALID",
                  type: results.exp_line_item_type,
                  original_amount_cents: parseInt(results.exp_original_amount_cents),
                  effective_at: results.transaction_date,
                  balance_cents: parseInt(results.exp_balance_cents),
                  principal_cents: parseInt(results.exp_principal_cents),
                  interest_balance_cents: 0,
                  deferred_interest_balance_cents: 0,
                  am_deferred_interest_balance_cents: 0,
                  am_interest_balance_cents: 0,
                  total_interest_paid_to_date_cents: 0,
                };
                const response = await promisify(lineItemsAPI.allLineitems(accountID));
                expect(response.status).to.eq(200);
                lineItemValidator.validateAccountLineItemWithEffectiveDate(response, expOrigFeeLineItemToValidate);
              });
              break;

            //Create Debit Offset transaction
            case "debitoffset":
              it(`should be able to create debit offset transaction`, () => {
                accountID = Cypress.env("account_id");
                lineItemsAPI.debitOffsetForAccount(
                  accountID,
                  "debit_offset.json",
                  results.original_amount_cents,
                  results.effective_at
                );
              });
              break;

            //Create Credit Offset transaction
            case "creditoffset":
              it(`should be able to create credit offset transaction`, () => {
                accountID = Cypress.env("account_id");
                lineItemsAPI.creditOffsetForAccount(
                  accountID,
                  "credit_offset.json",
                  results.original_amount_cents,
                  results.effective_at
                );
              });
              break;

            //Create Charge transaction
            case "charge":
              it(`should be able to create create additional charge'`, () => {
                accountID = Cypress.env("account_id");
                chargeAPI.chargeForAccount(
                  accountID,
                  "create_charge.json",
                  results.original_amount_cents,
                  results.effective_at
                );
              });
              break;

            //Create Payment transaction
            case "payment":
              it(`should be able to create a payment at first cycle interval'`, async() => {
                accountID = Cypress.env("account_id");
                Cypress.env("payment_id", "");
                const paymentID =await promisify(paymentAPI.paymentForAccount(
                  accountID,
                  "payment.json",
                  results.original_amount_cents,
                  results.effective_at
                ));
                Cypress.env("payment_id", paymentID);
              });
              break;

            //Create Payment reversal transaction
            case "paymentreversal":
              it(`should be able to reverse payment`, async () => {
                accountID = Cypress.env("account_id");
                const response = await promisify(
                  lineItemsAPI.paymentReversalLineitems(accountID, Cypress.env("payment_id"))
                );
                expect(response.status).to.eq(200);
              });
              break;

            case "getlineitem":
              it(`should be able to get a line item '${results.exp_line_item_type}'`, async () => {
                accountID = Cypress.env("account_id");
                const response = await promisify(lineItemsAPI.allLineitems(accountID));
                expect(response.status).to.eq(200);
                lineItemID = lineItemsAPI.getLineItemOfAnAccount(
                  response,
                  results.exp_line_item_type,
                  results.effective_at
                );
              });
              break;

            case "feereversal":
              it(`should be able to create a fee reversal '${results.exp_line_item_type}'`, async () => {
                accountID = Cypress.env("account_id");
                const response = await promisify(lineItemsAPI.feeWaiverLineitems(accountID, lineItemID));
                expect(response.status).to.eq(200);
              });
              break;
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
    >;
  });
});
