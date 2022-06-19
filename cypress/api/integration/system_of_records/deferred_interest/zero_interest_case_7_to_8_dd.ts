/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../..//api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI, PaymentPayload } from "../../../api_support/payment";
import DeferredInterestJSON from "../../../../resources/testdata/deferredinterest/zero_interest_case_7_to_8.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { payoutAPI } from "../../../api_support/payoutEntity";
import { chargeAPI } from "../../../api_support/charge";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import { statementsAPI } from "../../../api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import { AccountSummary, accountValidator } from "../../../api_validation/account_validator";

//Test Cases Covered [Case 7 - Case 8]
//PP2753 - Borrower pays off according to the amortization schedule through end of term making all payments on time (exact monthly prescribed payments - on time)
//PP2754 - Borrower pays off according to the amortization schedule through end of term missing some payments and incurring late fees (exact monthly prescribed payments – some not on time)

TestFilters(["regression", "interestCalculation", "mixedinstallment", "zerointerest"], () => {
  let productID;
  let customerID;
  let accountID;
  let response;
  let cycleStatementID;
  let stmtresponse;
  let amResponse;

  describe("Validate deferred interest calculation with mixed installment product with different scenarios", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
      //create customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("new customer created : " + customerID);
      });
      //configure ACH payout entity
      response = payoutAPI.createConfigurePayoutEntity("ach.json").then((response) => {
        expect(response.status, "verify payout entity ACH response is successful").to.eq(200);
      });

      //create new product
      const productJSONFile = "non_deferred_interest_product.json";
      const productPayload: CreateProduct = {
        delete_field_name: "first_cycle_interval",
      };

      productAPI.updateNCreateProduct(productJSONFile, productPayload).then((response) => {
        productID = response.body.product_id;
      });
    });

    describe(`should have create product and account `, () => {
      DeferredInterestJSON.forEach((data) => {
        describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
          switch (data.processing_type) {
            case "createAccount":
              it(`should have create account`, async () => {
                const accountJSONFile = data.status;
                cy.log(data.post_promo_len);
                const accountPayload: CreateAccount = {
                  product_id: productID,
                  customer_id: customerID,
                  post_promo_len: parseInt(data.post_promo_len),
                };

                let response = await promisify(accountAPI.updateNCreateAccount(accountJSONFile, accountPayload));
                accountID = response.body.account_id;
                cy.log("new account created : " + accountID);
              });
              break;

            case "charge":
              it(`should be able to create additional charge'`, () => {
                chargeAPI.chargeForAccount(
                  accountID,
                  "create_charge.json",
                  data.original_amount_cents,
                  data.effective_at
                );
              });
              break;

            case "rollTimeForward":
              it(`should do roll time forward to get statement`, async () => {
                response = await promisify(rollTimeAPI.rollAccountForward(accountID, data.roll_date.slice(0, 10)));
                expect(response.status).to.eq(200);
              });
              break;

            case "createACHPayment":
              it(`should be able to first create ACH payment`, async () => {
                const paymentPayload: CreatePayment = {
                  effective_at: data.effective_at,
                  original_amount_cents: parseInt(data.original_amount_cents),
                };

                response = await promisify(
                  paymentAPI.updateNCreatePaymentTransfer(accountID, "payment.json", paymentPayload)
                );
              });
              break;

            case "validateLineItem":
              it(`should be able to get a line item '${data.exp_line_item_type}'`, async () => {
                let lineResponse = await promisify(lineItemsAPI.allLineitems(accountID));
                expect(lineResponse.status).to.eq(200);
                const paymentLineItem: payLineItem = {
                  status: "VALID",
                  type: data.exp_line_item_type,
                  original_amount_cents: parseInt(data.original_amount_cents) * -1,
                };
                lineItemValidator.validateLineItem(lineResponse, paymentLineItem);
              });
              break;

            case "getStatementID":
              it(`should be able to get the statement '${data.exp_line_item_type}'`, () => {
                statementsAPI.getStatementByAccount(accountID).then((response) => {
                  expect(response.status).to.eq(200);
                  cycleStatementID = statementValidator.getStatementID(response, data.stmt_to_validate);
                });
              });
              break;

            case "validateStatement":
              it(`should be able to validate the balance summary in statement '${data.exp_line_item_type}'`, async () => {
                stmtresponse = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
                expect(stmtresponse.status).to.eq(200);

                const balanceSummary: StmtBalanceSummaryPick = {
                  principal_balance_cents: parseInt(data.principal_balance),
                  fees_balance_cents: parseInt(data.fee_balance),
                  am_interest_balance_cents: parseInt(data.am_int_cents),
                  charges_principal_cents: parseInt(data.principal_balance),
                  interest_balance_cents: parseInt(data.int_bal_cents),
                  total_balance_cents: parseInt(data.total_balance),
                  deferred_interest_balance_cents: parseInt(data.deferred_interest_balance_cents),
                };
                statementValidator.validateStatementBalanceSummarybyID(stmtresponse, data.product_type, balanceSummary);
              });
              break;

            case "validateAccountSummary":
              it(`should have validate account summary`, () => {
                const accSummary: AccSummary = {
                  principal_cents: parseInt(data.principal_balance),
                  total_balance_cents: parseInt(data.total_balance),
                  fees_balance_cents: parseInt(data.fee_balance),
                };
                accountValidator.validateAccountSummary(accountID, accSummary);
              });
              break;

            case "validateAccountStatus":
              it(`should have validate account status`, async () => {
                response = await promisify(accountAPI.getAccountById(accountID));
                expect(response.status).to.eq(200);
                expect(response.body.account_overview.account_status, "verify the status of the account").to.eq(
                  data.status
                );
                expect(
                  response.body.account_overview.account_status_subtype,
                  "verify the sub_status of the account"
                ).to.eq(data.sub_status);
              });
              break;

            case "AMSchedule":
              it(`should have validate amortization schedule`, async () => {
                amResponse = await promisify(accountAPI.getAmortizationSchedule(accountID));
                expect(amResponse.status).to.eq(200);
                expect(amResponse.body.length, "check number of cycles in amortization schedule").to.eq(
                  parseInt(data.post_promo_len)
                );
              });
              break;
          }
        });
      });
    });
  });
});

type CreateProduct = Pick<ProductPayload, "delete_field_name">;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "initial_principal_cents"
  | "post_promo_len"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "delete_field_name"
  | "cycle_due_interval_del"
  | "post_promo_impl_interest_rate_percent"
>;

type CreatePayment = Pick<PaymentPayload, "effective_at" | "original_amount_cents">;

type payLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;

type StmtBalanceSummaryPick = Pick<
  StatementBalanceSummary,
  | "principal_balance_cents"
  | "fees_balance_cents"
  | "am_interest_balance_cents"
  | "charges_principal_cents"
  | "interest_balance_cents"
  | "total_balance_cents"
  | "deferred_interest_balance_cents"
>;

type AccSummary = Pick<AccountSummary, "principal_cents" | "total_balance_cents" | "fees_balance_cents">;
