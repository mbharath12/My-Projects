/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "cypress/api/api_support/account";
import { customerAPI } from "cypress/api/api_support/customer";
import { productAPI, ProductPayload } from "cypress/api/api_support/product";
import { paymentAPI } from "cypress/api/api_support/payment";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { authAPI } from "cypress/api/api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import { statementsAPI } from "cypress/api/api_support/statements";
import { chargeAPI } from "../../../api_support/charge";
import { StatementBalanceSummary, statementValidator } from "cypress/api/api_validation/statements_validator";
import statementProcessingJSON from "cypress/resources/testdata/statement/statement_verification_all_transactions.json";
import { lineItemsAPI } from "cypress/api/api_support/lineItems";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//PP460 - PP462 - Statement Verification of Installment loans/Credit cards/Revolving with all transactions - Origination fees Interest Late fees Repayments  Payment Reversals
//PP463 - PP465 - Statement Verification of Installment/Revolving/Credit product correctness of all fields displayed on statement
//PP466 - PP469 - Statement Verification of Installment/Charge/Revolving/Credit product by Backdating a line item / Transaction during the current cycle
//PP1464 - Statement Verification of Credit cards with all transactions - Origination fees Monthly fees Annual Fees Late fees Charges Repayments  Payment Reversals
//PP1465 - PP1469- Statement Verification of Credit/Charge/Revolving/Credit product correctness of all fields displayed on statement by applying charge reversal
TestFilters(
  [
    "regression",
    "systemOfRecords",
    "statements",
    "installmentProduct",
    "revolvingProduct",
    "creditProduct",
    "chargeCardProduct",
  ],
  () => {
    describe("Statement verification with all transactions:Origination fees,interest,late fee,monthly fee,year fee,repayment,payment reversal", function () {
      let accountID;
      let productID;
      let productJSONFile;
      let customerID;
      let effectiveDate;
      let paymentID;
      let response;

      before(() => {
        authAPI.getDefaultUserAccessToken();
        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
      });

      statementProcessingJSON.forEach((data) => {
        it(`should have create product - '${data.tc_name}'`, async () => {
          //create account JSON in temp folder
          // Create different products for the corresponding Test Scenarios
          if (data.product_type.toLowerCase() == data.install_product_type.toLowerCase()) {
            productJSONFile = "payment_product.json";
          } else if (data.product_type.toLowerCase() == data.credit_product_type.toLowerCase()) {
            productJSONFile = "product_credit.json";
          } else if (data.product_type.toLowerCase() == data.revolve_product_type.toLowerCase()) {
            productJSONFile = "product_revolving.json";
          } else if (data.product_type.toLowerCase() == data.charge_product_type.toLowerCase()) {
            productJSONFile = "product_charge.json";
          }

          //update the Cycle_interval,Cycle_due,Promo policies
          const productPayload: CreateProduct = {
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
          };

          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          productID = response.body.product_id;
        });

        it(`should have create account - '${data.tc_name}'`, async () => {
          //create account and assign customer
          const days = parseInt(data.account_effective_dt);
          effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDate,
            initial_principal_cents: parseInt(data.initial_principal_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.Annual_fee_cents),
            first_cycle_interval: data.cycle_interval,
            payment_reversal_fee_cents: parseInt(data.payment_reversal_fee_cents),
            promo_impl_interest_rate_percent: parseInt(data.promo_int),
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          accountID = response.body.account_id;
        });

        if (parseInt(data.stmt1_charge_amount) != 0) {
          it(`should be able to create a charge - '${data.tc_name}'`, () => {
            const chargeEffectiveDt = dateHelper.addDays(parseInt(data.stmt1_charge_effective_dt), 0);
            chargeAPI.chargeForAccount(accountID, "create_charge.json", data.stmt1_charge_amount, chargeEffectiveDt);
          });

          it(`should have validate charge as a Line Item and charge amount details - '${data.tc_name}'`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            lineItemValidator.validateLineItemWithAmount(
              response,
              "VALID",
              "CHARGE",
              parseInt(data.stmt1_charge_amount)
            );
          });
        }

        it(`should have update the payment amount and payment effective date and should have create a payment - '${data.tc_name}'`, async () => {
          const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment_effective_date), 0);
          paymentID = await promisify(
            paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amt_cents, paymentEffectiveDt)
          );
        });

        it(`should have validate payment as a Line Item and payment amount details - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PAYMENT",
            parseInt(data.payment_amt_cents) * -1
          );
        });

        if (parseInt(data.payment2_amt_cents) != 0) {
          it(`should have update the payment amount and payment effective date and should have create a second cycle - '${data.tc_name}'`, async () => {
            const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment1_effective_date), 3);
            paymentAPI.paymentForAccount(accountID, "payment.json", data.payment2_amt_cents, paymentEffectiveDt);
          });

          it(`should have validate payment as a Line Item and payment amount details for the second cycle - '${data.tc_name}'`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            lineItemValidator.validateLineItemWithAmount(
              response,
              "VALID",
              "PAYMENT",
              parseInt(data.payment2_amt_cents) * -1
            );
          });
        }

        it(`should have to wait for account roll time forward  to make sure balance summary is updated - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getRollDate(parseInt(data.Rolltime_before_reversal));
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should be able to see reduction in fee,interest and principal amount in statement based on the config parameters- '${data.tc_name}'`, async () => {
          //Get statements list for account
          response = await promisify(statementsAPI.getStatementByAccount(accountID));
          expect(response.status).to.eq(200);
          const cycleStatementID = statementValidator.getStatementIDByNumber(response, data.stmt_before_reversal);
          //Get statement details for given statement id
          response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
          expect(response.status).to.eq(200);

          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            | "loans_principal_cents"
            | "fees_balance_cents"
            | "am_interest_balance_cents"
            | "charges_principal_cents"
            | "interest_balance_cents"
            | "total_balance_cents"
          >;
          // Validate Loan Principal,fee balance ,total balance ,interest balance and charge principal are as expected
          const balanceSummary: StmtBalanceSummaryPick = {
            loans_principal_cents: parseInt(data.principal_balance),
            fees_balance_cents: parseInt(data.fee_balance),
            am_interest_balance_cents: parseInt(data.am_int_cents),
            charges_principal_cents: parseInt(data.principal_balance),
            interest_balance_cents: parseInt(data.int_bal_cents),
            total_balance_cents: parseInt(data.total_balance),
          };
          statementValidator.validateStatementBalanceSummarybyID(response, data.product_type, balanceSummary);

          if (data.available_credit_cents.toLowerCase() != "null") {
            // Verify available Credits after partial or full repayment
            expect(response.body.open_to_buy.available_credit_cents, "Available Credit Balance is displayed").to.eq(
              parseInt(data.available_credit_cents)
            );
          }
        });

        //There is no charge reversal api. We are use debit offset for charge reversal
        if (data.check_charge_reversal.toLowerCase() == "true") {
          it(`should be able to charge reversal - '${data.tc_name}'`, async () => {
            const chargeEffectiveDt = dateHelper.addDays(parseInt(data.stmt1_charge_effective_dt), 0);
            lineItemsAPI.debitOffsetForAccount(
              accountAPI,
              "debit_offset.json",
              data.stmt1_charge_amount,
              chargeEffectiveDt
            );
          });
        }

        it(`should have perform payment reversal - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentID));
          expect(response.status).to.eq(200);
          //Roll time forward to generate payment reversal
          const endDate = dateHelper.getRollDate(3);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate payment reversal as a line item and should have payment reversal fee based on the config parameters- '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PAYMENT_REVERSAL",
            parseInt(data.payment_amt_rev) * -1
          );
        });

        it(`should have to wait for account roll time forward  to make sure balance summary is updated - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getRollDate(parseInt(data.Rolltime_after_reversal));
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should be able to see addition in fee,interest and principal amount in statement based on the reversal parameter- '${data.tc_name}'`, async () => {
          //Get statements list for account
          response = await promisify(statementsAPI.getStatementByAccount(accountID));
          expect(response.status).to.eq(200);
          const cycleStatementID = statementValidator.getStatementIDByNumber(response, data.stmt_after_reversal);
          //Get statement details for given statement id
          response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
          expect(response.status).to.eq(200);
          type StmtBalanceSummaryPick = Pick<
            StatementBalanceSummary,
            | "loans_principal_cents"
            | "fees_balance_cents"
            | "am_interest_balance_cents"
            | "charges_principal_cents"
            | "interest_balance_cents"
            | "total_balance_cents"
          >;
          // Validate Loan Principal,fee balance ,total balance ,interest balance and charge principal are as expected
          const balanceSummary: StmtBalanceSummaryPick = {
            loans_principal_cents: parseInt(data.principal_balance_rev),
            fees_balance_cents: parseInt(data.fee_balance_rev),
            am_interest_balance_cents: parseInt(data.am_int_cents_rev),
            charges_principal_cents: parseInt(data.principal_balance_rev),
            interest_balance_cents: parseInt(data.int_bal_cents_rev),
            total_balance_cents: parseInt(data.total_balance_rev),
          };
          statementValidator.validateStatementBalanceSummarybyID(response, data.product_type, balanceSummary);
        });

        it(`should have validate the existence of late fee and Late fee amount in the Line Items- '${data.tc_name}''`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(response, "VALID", "LATE_FEE", parseInt(data.late_fee_cents));
        });

        if (data.monthly_fee_cents != "0" && data.check_monthly_fee.toLowerCase() != "false") {
          it(`should have validate the existence of monthly fee and monthly fee amount in the Line Items- '${data.tc_name}''`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            lineItemValidator.validateLineItemWithAmount(
              response,
              "VALID",
              "MONTH_FEE",
              parseInt(data.monthly_fee_cents)
            );
          });
        }

        if (data.Annual_fee_cents != "0" && data.check_annual_fee.toLowerCase() != "false") {
          it(`should have validate the existence of year fee and yearly fee amount in the Line Items- '${data.tc_name}''`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            lineItemValidator.validateLineItemWithAmount(
              response,
              "VALID",
              "YEAR_FEE",
              parseInt(data.Annual_fee_cents)
            );
          });
        }
        it(`should have validate the existence of payment reversal fee in the Line Items- '${data.tc_name}''`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PAYMENT_REVERSAL_FEE",
            parseInt(data.payment_reversal_fee_cents)
          );
        });
      });
    });
  }
);

type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "promo_len"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "first_cycle_interval"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "cycle_due_interval_del"
  | "initial_principal_cents"
  | "payment_reversal_fee_cents"
  | "promo_impl_interest_rate_percent"
>;
