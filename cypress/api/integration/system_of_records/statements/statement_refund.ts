import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { refundAPI } from "../../../api_support/refund";
import statementJSON from "../../../../resources/testdata/statement/statements_refund.json";
import statementTransactionJSON from "../../../../resources/testdata/statement/statements_refund_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "../../../api_support/constants";
import { statementsAPI } from "../../../api_support/statements";
import { statementValidator, StatementBalanceSummary } from "../../../api_validation/statements_validator";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";

//Test Scripts
//PP2735 - Refund on revolving account and verify statement balances
//PP2736 - Refund on revolving account with fees and verify statement balances
//PP2737 - Refund on revolving account with interest and verify statement balances
//PP2738 - Refund on revolving account with both interest and fees and verify statement balances
//PP2739 - Refund on installment account and verify statement balances
//PP2740 - Refund on installment account with fees and verify statement balances
//PP2741 - Refund on installment account with interest and verify statement balances
//PP2742 - Refund on installment account with both interest and fees and verify statement balances

TestFilters(["regression", "systemOfRecords", "statements", "refund"], () => {
  describe("statement - verify balances summary with refund", function () {
    let accountID;
    let productID;
    let customerID;
    let validationTransactionJSON;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });

    statementJSON.forEach((data) => {
      validationTransactionJSON = statementTransactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create product account and assign customer - '${data.tc_name}'`, () => {

      it(`should have create a product - '${data.tc_name}'`, async () => {
        const response = await promisify(productAPI.createProductWith1monthCycleInterval(data.product_json, true, true));
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
            post_promo_len:parseInt(data.post_promo_impl_am_len)
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });
      });

      describe(`should have to validate statements balance and line items- '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            case "refund":
              it(`should have perform refund - '${data.tc_name}'`, async() => {
                const response = await promisify( refundAPI.refundForAccount(accountID, "refund.json", results.refund_amount,results.effective_at));
                expect(response.status).to.eq(200);
              });
              break;
            case "balances for statement":
              //Calling roll time forward to get charge amount in statement and statement details get updated
              it(`should have to wait for account roll time forward till third cycle - '${data.tc_name}'`, async () => {
                //Roll time forward to generate statement lineItem
                const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(CycleTypeConstants.cycle_interval_1month.toLowerCase(), 3);
                const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                expect(response.status).to.eq(200);
              });

              it(`should have to validate statement balance for second cycle - '${data.tc_name}'`, () => {
                const balanceSummary: StmtBalanceSummaryPick = {
                  charges_principal_cents: parseInt(results.charges_principal_cents),
                  loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                  fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                  total_balance_cents: parseInt(results.stmt_total_balance_cents),
                  interest_balance_cents: parseInt(results.interest_balance_cents),
                  am_interest_balance_cents:parseInt(results.am_interest_balance_cents),
                  principal_balance_cents:parseInt(results.stmt_principal_balance_cents)
                };
                statementsAPI.getStatementByAccount(accountID).then((response) => {
                const chargeStatementID = statementValidator.getStatementIDByNumber(response, 1);

                statementsAPI.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
                statementValidator.validateStatementBalanceSummarybyID(response, data.product_type, balanceSummary);
              });
            });
            });

              it(`should have to validate statement line items for second cycle - '${data.tc_name}'`, async () => {
                //Get statement list for account
                const response = await promisify(statementsAPI.getStatementByAccount(accountID));
                const chargeStatementID = statementValidator.getStatementIDByNumber(response, 1);
                //Get statement details for given statement id
                const statementResponse = await promisify(
                  statementsAPI.getStatementByStmtId(accountID, chargeStatementID)
                );
                type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
                //verify refund line item
                const refundLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "REFUND",
                  original_amount_cents: parseInt(results.lineitem_amount) * -1,
                };
                lineItemValidator.validateStatementLineItem(statementResponse, refundLineItem);
              });
              break;
          }
        });
      });
    });
  });
});

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
type StmtBalanceSummaryPick = Pick<
  StatementBalanceSummary,
  "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents" | "interest_balance_cents" |"am_interest_balance_cents" |"principal_balance_cents"
>;
