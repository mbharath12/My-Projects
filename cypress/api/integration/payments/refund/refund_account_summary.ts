import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { refundAPI } from "../../../api_support/refund";
import accountJSON from "../../../../resources/testdata/payment/refund_product_account.json";
import accountTransactionJSON from "../../../../resources/testdata/payment/refund_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "../../../api_support/constants";
import { AccountSummary, accountValidator } from "../../../api_validation/account_validator";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";

//Test Scripts
//PP2757 - PP2769 - Refund on revolving account with No fees ,with fees,with interest on revolving,
//installment and mixed rate installment and verify account balance

TestFilters(["regression", "accountsummary", "accounts", "refund"], () => {
  describe("Account - verify balances summary with refund", function () {
    let accountID;
    let productID;
    let customerID;
    let response;
    let validationTransactionJSON;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });

    accountJSON.forEach((data) => {
      validationTransactionJSON = accountTransactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create product account and assign customer - '${data.tc_name}'`, () => {
        it(`should have create a product - '${data.tc_name}'`, async () => {
          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            promo_interest_deferred: data.promo_interest_deferred,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            promo_apr_range_inclusive_lower: parseInt(data.promo_apr_range_inclusive_lower),
            promo_apr_range_inclusive_upper: parseInt(data.promo_apr_range_inclusive_upper),
            first_cycle_interval_del: "first_cycle_interval",
          };

          const response = await promisify(productAPI.updateNCreateProduct(data.product_json, productPayload));
          productID = response.body.product_id;
          cy.log(productID);
        });
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Updating product id based on cycle interval
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principle_in_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            promo_impl_interest_rate_percent: parseInt(data.promo_impl_interest_rate_percent),
            post_promo_impl_interest_rate_percent: parseInt(data.post_promo_impl_interest_rate_percent),
            first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
            post_promo_len: parseInt(data.post_promo_impl_am_len),
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });
      });

      describe(`should have to validate account balance and line items- '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            case "refund":
              it(`should have perform refund`, async () => {
                const response = await promisify(
                  refundAPI.refundForAccount(accountID, "refund.json", results.refund_amount, results.effective_at)
                );
                expect(response.status).to.eq(200);
              });
              break;

            case "rollTimeForward":
              it(`should do roll time forward`, async () => {
                const endDate = dateHelper.getAccountEffectiveAt(results.roll_date);
                response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
                expect(response.status).to.eq(200);
              });
              break;

            case "validateAccountSummary":
              it(`should have validate account summary`, () => {
                const accSummary: AccSummary = {
                  principal_cents: parseInt(results.acc_principal_balance_cents),
                  total_balance_cents: parseInt(results.acc_total_balance_cents),
                  fees_balance_cents: parseInt(results.acc_fees_balance_cents),
                  interest_balance_cents: parseInt(results.interest_balance_cents),
                  am_interest_balance_cents: parseInt(results.am_interest_balance_cents),
                  total_interest_paid_to_date_cents: parseInt(results.total_interest_paid_to_date_cents),
                  deferred_interest_balance_cents: parseInt(results.deferred_interest_balance_cents),
                };
                accountValidator.validateAccountSummary(accountID, accSummary);
              });
              break;

            case "validateLineItem":
              it(`should be able to get a line item '${results.exp_line_item_type}'`, async () => {
                let lineResponse = await promisify(lineItemsAPI.allLineitems(accountID));
                expect(lineResponse.status).to.eq(200);
                const paymentLineItem: payLineItem = {
                  status: "VALID",
                  type: results.exp_line_item_type,
                  original_amount_cents: parseInt(results.original_amount_cents) * -1,
                };
                lineItemValidator.validateLineItem(lineResponse, paymentLineItem);
              });
              break;
          }
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "promo_interest_deferred"
  | "promo_len"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
  | "promo_apr_range_inclusive_lower"
  | "promo_apr_range_inclusive_upper"
  | "first_cycle_interval_del"
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
  | "first_cycle_interval"
  | "promo_impl_interest_rate_percent"
  | "post_promo_impl_interest_rate_percent"
  | "post_promo_len"
>;
type AccSummary = Pick<
  AccountSummary,
  | "principal_cents"
  | "total_balance_cents"
  | "fees_balance_cents"
  | "am_interest_balance_cents"
  | "interest_balance_cents"
  | "total_interest_paid_to_date_cents"
  | "deferred_interest_balance_cents"
>;

type payLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
