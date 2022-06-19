/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { paymentAPI } from "../../../api_support/payment";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import { statementsAPI } from "cypress/api/api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import { default as paymentProcessingJSON } from "cypress/resources/testdata/payment/value_date_payment.json";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//PP100-Value Date Payment to Back date for a Installment Loan
//PP101-Value Date Payment to Back date in Credit card/Charge card
//PP102-Value Date Payment to Back date in Revolving account
//PP103-Value Date Payment to Back date for a Installment Loan- such that effective date is prior to payment Due date
//PP104-Value Date Payment to Back date for a Installment Loan- such that effective date is after payment Due date but before Grace period expiry
//PP105-Value Date Payment to Back date for a Credit card - such that effective date is prior to Previous billing cycle Due date
//PP106-Value Date Payment to Back date for a Credit card - such that effective date is prior to 2 Previous billing cycles Due date
//PP107-Value Date Payment to Back date for a Delinquent account that cures delinquency
//PP108-Value date a payment with effective date prior to 2 months
//PP110-Verify a  Payment cannot be backdated before account open date
//PP111-Back value dated payment reversed- Installment loan
//PP112-Back value dated payment reversed - Credit Card/Charge card
//PP113-Back value dated payment reversed - Revolving Loan account

TestFilters(
  [
    "regression",
    "systemOfRecords",
    "statements",
    "installmentProduct",
    "revolvingProduct",
    "creditProduct",
    "valueDatePayment",
  ],
  () => {
    describe("value date payment through installment,charge card and revolving card", function () {
      let accountID;
      let customerID;
      let effectiveDt;
      let productType;
      let response;
      let paymentID;

      before(async () => {
        authAPI.getDefaultUserAccessToken();
        //Create a customer
        customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
        cy.log("customer id: " + customerID);
      });

      paymentProcessingJSON.forEach((data) => {
        it(`should have create product with cycle-interval,cycle due interval,delinquent,charge-off - '${data.tc_name}'`, () => {
          if (data.prod_type.toLowerCase() === "installment") {
            productType = "payment_product.json";
          } else if (data.prod_type.toLowerCase() === "charge") {
            productType = "product_charge.json";
          } else if (data.prod_type.toLowerCase() === "revolving") {
            productType = "product_revolving.json";
          }

          const productPayload: CreateProduct = {
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            first_cycle_interval: "delete",
          };

          //Update payload and create an product
          // Tried await/async but in few cases account response was not cleared
          // and product details was not stored in productResponse
          productAPI.updateNCreateProduct(productType, productPayload).then((productResponse) => {
            Cypress.env("product_id", productResponse.body.product_id);
            cy.log(JSON.stringify(productResponse));
          });
        });

        it(`should have create account and assign product and customer - '${data.tc_name}'`, async () => {
          const days = parseInt(data.account_effective_dt);
          effectiveDt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
          const accountPayload: CreateAccount = {
            product_id: Cypress.env("product_id"),
            customer_id: customerID,
            effective_at: effectiveDt,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            first_cycle_interval: "delete",
          };

          //create an account and assign to customer
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });

        if (data.account_status_1.toLowerCase() != "active") {
          it(`should have to wait for roll time forward to make sure account status is updated - '${data.tc_name}'`, async () => {
            const endDate = dateHelper.getRollDate(1);
            response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
            expect(response.status).to.eq(200);
          });

          it(`should have validate account status for - '${data.tc_name}'`, async () => {
            response = await promisify(accountAPI.getAccountById(accountID));
            expect(response.status).to.eq(200);
            expect(response.body.account_overview.account_status).to.eq(data.account_status_1);
          });
        }
        it(`should have update payment amount and payment effective date and should have create a payment - '${data.tc_name}''`, async () => {
          const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment1_effective_dt), 0);
          const paymentTemplateJSONFile = Cypress.env("templateFolderPath").concat("/payment/payment.json");
          const paymentJSON = await promisify(cy.fixture(paymentTemplateJSONFile));
          paymentJSON.effective_at = paymentEffectiveDt;
          paymentJSON.original_amount_cents = data.payment_amt_cents_1;
          const response = await promisify(paymentAPI.createPayment(paymentJSON, accountID));
          expect(response.status, "payment response status").to.eq(parseInt(data.payment_response_status));

          if (parseInt(data.payment_response_status) === 200) {
            paymentID = response.body.line_item_id;
            expect(response.body.line_item_summary.principal_cents, "repayment amount in payment response").to.eq(
              paymentJSON.original_amount_cents * -1
            );
          }
        });

        if (parseInt(data.payment_response_status) === 200) {
          it(`should have validate payment and payment amount in the line items - '${data.tc_name}''`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            type payLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const paymentLineItem: payLineItem = {
              status: "VALID",
              type: "PAYMENT",
              original_amount_cents: parseInt(data.payment_amt_cents_1) * -1,
            };
            lineItemValidator.validateLineItem(response, paymentLineItem);
          });

          it(`should have to wait for roll time forward to make sure balance summary  and late fee line item are updated - '${data.tc_name}'`, async () => {
            const endDate = dateHelper.getRollDate(parseInt(data.roll_time));
            response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
            expect(response.status).to.eq(200);
          });

          it(`should have validate late fee line item and throws error when late fee
     Line Item exist for a charge card - '${data.tc_name}''`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);

            if (parseInt(data.late_fee_cents) != 0) {
              type lateFeeLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const lateFeeLineItem: lateFeeLineItem = {
                status: "VALID",
                type: "LATE_FEE",
                original_amount_cents: parseInt(data.late_fee_cents),
              };
              lineItemValidator.validateLineItem(response, lateFeeLineItem);
            } else {
              //Late_Fee should not come for Charge Product when full payment is done on time.
              const bLineItemExist = lineItemValidator.checkLineItem(response, "LATE_FEE");
              expect(false, "check LATE_FEE line item is not displayed").to.eq(bLineItemExist);
            }
          });

          it(`should have validate account status for - '${data.tc_name}'`, async () => {
            response = await promisify(accountAPI.getAccountById(accountID));
            expect(response.status).to.eq(200);
            expect(response.body.account_overview.account_status).to.eq(data.account_status);
          });

          it(`should have to validate statement balance for latest cycle - '${data.tc_name}'`, async () => {
            response = await promisify(statementsAPI.getStatementByAccount(accountID));
            expect(response.status).to.eq(200);
            const cycleStatementID = statementValidator.getStatementIDByNumber(response, data.stmt_id);
            //Get statement details for given statement id
            response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
            //Check available_credit_cents is displayed in the statement
            expect(response.status).to.eq(200);
            expect(response.body.open_to_buy.available_credit_cents, "Available Credit Balance is displayed").to.eq(
              parseInt(data.available_credit_cents)
            );
          });

          it(`should have to validate statement balance for latest cycle - '${data.tc_name}'`, () => {
          type StmtBalanceSummaryPick = Pick<
              StatementBalanceSummary,
              "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
            >;
            // Validate Loan Principal,fee balance ,total balance and charge principal are as expected
            const balanceSummary: StmtBalanceSummaryPick = {
              charges_principal_cents: parseInt(data.stmt_charges_principal_cents),
              loans_principal_cents: parseInt(data.stmt_loans_principal_cents),
              fees_balance_cents: parseInt(data.stmt_fees_balance_cents),
              total_balance_cents: parseInt(data.stmt_total_balance_cents),
            };
            statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, data.stmt_id, balanceSummary);
          });

          //Execute test only if account is on boarded and perform payment reversal
          if (data.check_payment_reversal.toLowerCase() === "true") {
            //Perform payment reversal
            it(`should have perform payment reversal - '${data.tc_name}'`, async () => {
              response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentID));
              expect(response.status).to.eq(200);
              //Roll time forward to generate payment reversal
              const endDate = dateHelper.getRollDate(1);
              response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
              expect(response.status).to.eq(200);
            });

            it(`should have payment reversal line item and payment reversal fee - '${data.tc_name}'`, async () => {
              response = await promisify(lineItemsAPI.allLineitems(accountID));
              //Verify payment reversal  in account line item
              type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const payReversalItem: AccLineItem = {
                status: "VALID",
                type: "PAYMENT_REVERSAL",
                original_amount_cents: parseInt(data.payment_amt_cents_1),
              };
              lineItemValidator.validateLineItem(response, payReversalItem);
            });
          }
        }
      });
    });
  }
);

type CreateProduct = Pick<
  ProductPayload,
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "cycle_interval_del"
  | "cycle_due_interval_del"
  | "first_cycle_interval"
  | "post_promo_len"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "delete_field_name"
  | "cycle_due_interval_del"
  | "initial_principal_cents"
>;
