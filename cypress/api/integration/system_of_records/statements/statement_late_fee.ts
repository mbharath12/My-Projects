import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { chargeAPI } from "../../../api_support/charge";
import statementJSON from "../../../../resources/testdata/statement/statement_late_fee.json";
import statementTransactionJSON from "../../../../resources/testdata/statement/statement_late_fee_transaction.json";
import TestFilters from "../../../../support/filter_tests.js";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import { paymentAPI } from "../../../api_support/payment";
import { CycleTypeConstants } from "../../../api_support/constants";
import { statementsAPI } from "../../../api_support/statements";
import { statementValidator, StatementBalanceSummary } from "../../../api_validation/statements_validator";
import { lineItemValidator, LineItem } from "../../../api_validation/line_item_validator";

//Test Scripts
//PP2734 - Validate late fee line in statements for revolving account
//PP2734A - Validate late fee line in statements for revolving account with org_fee
//PP2734B - Create charge and verify late fee line in statements for revolving account
//PP2734C - Create less than min payment and verify late fee line in statements
//PP2734D - Validate late fee line in statements for installment account
//PP2734E - Validate late fee line in statements for installment account with org_fee
//PP2734F - Create charge and verify late fee line in statements for installment account
//PP2734G - Create less than min payment and verify late fee line in statements
//PP2734H - Create charge and less than min payment and verify late fee line in revolving account statements
//PP2734I - Create charge and less than min payment and verify late fee line in installment account statements

TestFilters(["regression", "systemOfRecords", "statements", "lateFee", "charges", "payment"], () => {
  describe("statements - verify late fee line item in statements", function () {
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

    statementJSON.forEach((data) => {
      validationTransactionJSON = statementTransactionJSON.filter((results) => results.account_tc_id === data.tc_name);
      describe(`should have create account and assign customer - '${data.tc_name}'`, () => {
        it(`should have create product - '${data.tc_name}'`, async () => {
          //Update product payload
          const productPayload: CreateProduct = {
            cycle_interval: CycleTypeConstants.cycle_interval_1month,
            cycle_due_interval: CycleTypeConstants.cycle_due_interval_1month,
            first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
          };
          response = await promisify(productAPI.updateNCreateProduct(data.product_json_file, productPayload));
          productID = response.body.product_id;
          cy.log("new product created : " + productID);
        });

        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Updating product id based on cycle interval
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
          };
          response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });
      });

      describe(`should have to validate statements balance and line items- '${data.tc_name}'`, () => {
        validationTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            case "charge":
              it(`should be able to create a charge - '${data.tc_name}'`, async () => {
                await promisify(
                  chargeAPI.chargeForAccount(accountID, "create_charge.json", results.amount, results.effective_at)
                );
              });
              break;
            case "payment":
              it(`should be able to create a payment - '${data.tc_name}'`, async () => {
                await promisify(
                  paymentAPI.paymentForAccount(accountID, "payment.json", results.amount, results.effective_at)
                );
              });
              break;
            case "stmt_balance_validation":
              //Calling roll time forward to get charge amount in statement and statement details get updated
              it(`should have to wait for account roll time forward till third cycle - '${data.tc_name}'`, async () => {
                //Roll time forward to generate statement lineItem
                const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(
                  CycleTypeConstants.cycle_interval_1month.toLowerCase(),
                  3
                );
                const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_dt, forwardDate);
                const response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
                expect(response.status).to.eq(200);
              });

              it(`should have to validate statement balance for second cycle - '${data.tc_name}'`, () => {
                const balanceSummary: StmtBalanceSummaryPick = {
                  charges_principal_cents: parseInt(results.stmt_charges_principal_cents),
                  loans_principal_cents: parseInt(results.stmt_loans_principal_cents),
                  fees_balance_cents: parseInt(results.stmt_fees_balance_cents),
                  total_balance_cents: parseInt(results.stmt_total_balance_cents),
                };
                statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 1, balanceSummary);
              });

              it(`should have to validate statement line items - '${data.tc_name}'`, async () => {
                //Get statement list for account
                const response = await promisify(statementsAPI.getStatementByAccount(accountID));
                const chargeStatementID = statementValidator.getStatementIDByNumber(response, 1);
                //Get statement details for given statement id
                const statementResponse = await promisify(
                  statementsAPI.getStatementByStmtId(accountID, chargeStatementID)
                );
                type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
                if (results.lineitem_amount !== "0") {
                  const chargeLineItem: StmtLineItem = {
                    status: "VALID",
                    type: "CHARGE",
                    original_amount_cents: parseInt(results.lineitem_amount),
                  };
                  lineItemValidator.validateStatementLineItem(statementResponse, chargeLineItem);
                }

                //Check late_fee line item is displayed in the statement
                const lateFeeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "LATE_FEE",
                  original_amount_cents: parseInt(data.late_fee_cents),
                };
                lineItemValidator.validateStatementLineItem(statementResponse, lateFeeLineItem);

                //Check payment line item is displayed in the statement
                if (results.lineitem2_amount !== "0") {
                  const paymentLineItem: StmtLineItem = {
                    status: "VALID",
                    type: "PAYMENT",
                    original_amount_cents: parseInt(results.lineitem2_amount) * -1,
                  };
                  lineItemValidator.validateStatementLineItem(statementResponse, paymentLineItem);
                }
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
>;
type StmtBalanceSummaryPick = Pick<
  StatementBalanceSummary,
  "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
>;
type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "promo_min_pay_percent"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
>;
