/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { paymentAPI } from "../../../api_support/payment";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemValidator } from "../../../api_validation/line_item_validator";
import { statementsAPI } from "../../../api_support/statements";
import { StatementBalanceSummary, statementValidator } from "../../../api_validation/statements_validator";
import chargeProcessingJSON from "cypress/resources/testdata/payment/payment_generic_prod.json";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//PP123 - Payment comes in for an Account already closed
//PP124,PP1531-PP1533 - Payment comes in for a revolving/charge/credit/installment card with zero credit balance
//PP128,PP1534-PP1536 -  Payments beyond current day cut off time in a revolving/installment/charge/credit product
//PP134,PP135,PP1537,PP1538 - Credit offset for a specific revolving/installment/charge/credit account
//PP136,PP137,PP1539,PP1540 - Debit offset for specific revolving/installment/charge/credit account
//PP138-PP140 -Re-allocation of current payment after Origination fees reversal,Late fee reversal,Annual fees reversal

TestFilters(["regression", "originationFee", "paymentPouring", "feeReversal"], () => {
  describe("Payment generic behavior on various products", function () {
    let accountID;
    let productID;
    let customerID;
    let effectiveDate;
    let paymentID;
    let response;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    chargeProcessingJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
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
        };
        const response = await promisify(productAPI.updateNCreateProduct(data.exp_product_file_name, productPayload));
        productID = response.body.product_id;
        cy.log("product" + data.product_type.toLowerCase() + "created : " + productID);
      });

      it(`should have create account - '${data.tc_name}'`, async () => {
        //Update payload and create an account
        const days = parseInt(data.account_effective_dt);
        effectiveDate = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDate,
          initial_principal_cents: parseInt(data.initial_principal_cents),
          credit_limit_cents: parseInt(data.credit_limit_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          annual_fee_cents: parseInt(data.Annual_fee_cents),
          promo_impl_interest_rate_percent: parseInt(data.promo_int),
        };
        const response = await promisify(accountAPI.updateNCreateAccount(data.exp_account_file_name, accountPayload));
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        cy.log("origination fees: " + response.body.account_product.product_lifecycle.origination_fee_impl_cents);
        Cypress.env("origination_fees", response.body.account_product.product_lifecycle.origination_fee_impl_cents);
      });

      if (data.check_credit_offset.toLowerCase() === "true") {
        it("should be able to create credit offset line item", () => {
          cy.log("making credit offset for : " + data.credit_offset_val);
          const creditEffectiveAt = dateHelper.moveDate(effectiveDate, 1);
          lineItemsAPI.creditOffsetForAccount(
            accountID,
            "credit_offset.json",
            data.credit_offset_val,
            creditEffectiveAt
          );
        });

        it("should be able to verify credit offset is present in account", async () => {
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(200);
          expect(response.body.summary.total_balance_cents).to.eq(parseInt(data.principal_after_credit_offset));
        });

        it(`should have validate credit-offset line item - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "CREDIT_OFFSET",
            parseInt(data.credit_offset_val)
          );
        });
      }

      if (data.check_debit_offset.toLowerCase() === "true") {
        it("should be able to create debit offset line item", () => {
          const effectiveAt = dateHelper.addDays(-1,0)
          lineItemsAPI.debitOffsetForAccount(accountID,"debit_offset.json",20,effectiveAt)
        });

        it("should be able to verify debit offset is present in account", async () => {
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(200);
          expect(response.body.summary.total_balance_cents).to.eq(parseInt(data.principal_after_debit_offset));
        });

        it(`should have validate debit-offset line item - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "DEBIT_OFFSET",
            parseInt(data.debit_offset_val)
          );
        });
      }

      if (data.check_payment.toLowerCase() === "true") {
        it(`should be able to create a payment at first cycle interval - '${data.tc_name}'`, () => {
          const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment1_effective_date), 0);
          paymentAPI
            .paymentForAccount(accountID, "payment.json", data.payment1_amt_cents, paymentEffectiveDt)
            .then((newPaymentID) => {
              paymentID = newPaymentID;
            });
        });

        //Calling roll time forward to make sure balance summary is updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getRollDate(parseInt(data.Rolltime_after_first_pay));
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate payment line item - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PAYMENT",
            parseInt(data.payment1_amt_cents) * -1
          );
        });

        it(`should have validate account status for - '${data.tc_name}'`, async () => {
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(200);
          expect(response.body.account_overview.account_status).to.eq(data.acc_status);
        });

        it(`should be able to see reduction in fee,interest and principal amount in statement based on the config parameters- '${data.tc_name}'`, async () => {
          //Get statements list for account
          response = await promisify(statementsAPI.getStatementByAccount(accountID));
          expect(response.status).to.eq(200);
          const cycleStatementID = statementValidator.getStatementIDByNumber(response, data.stmt_after_first_pay);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, cycleStatementID).then((response) => {
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
              //Verify available Credits after partial or full repayment
              expect(response.body.open_to_buy.available_credit_cents, "Available Credit Balance is displayed").to.eq(
                parseInt(data.available_credit_cents)
              );
            }
          });
        });
      }
      if (data.payment2_amt_cents.toLowerCase() !== "null") {
        it(`should be able to create a payment at second cycle interval - '${data.tc_name}'`, () => {
          const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment2_effective_date), 3);
          paymentAPI
            .paymentForAccount(accountID, "payment.json", data.payment2_amt_cents, paymentEffectiveDt)
            .then((newPaymentID) => {
              paymentID = newPaymentID;
            });
        });

        //Calling roll time forward to make sure balance summary is updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getRollDate(parseInt(data.Rolltime_after_second_pay));
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate payment as a Line Item and payment amount details - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PAYMENT",
            parseInt(data.payment2_amt_cents) * -1
          );
        });

        it(`should be able to see reduction in fee,interest and principal amount in statement based on the config parameters- '${data.tc_name}'`, async () => {
          //Get statements list for account
          response = await promisify(statementsAPI.getStatementByAccount(accountID));
          expect(response.status).to.eq(200);
          const cycleStatementID = statementValidator.getStatementIDByNumber(response, data.stmt_after_second_pay);
          //Get statement details for given statement id
          statementsAPI.getStatementByStmtId(accountID, cycleStatementID).then((response) => {
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
            total_balance_cents: parseInt(data.total_balance_second),
          };
          statementValidator.validateStatementBalanceSummarybyID(response, data.product_type, balanceSummary);

            if (data.available_credit_cents.toLowerCase() != "null") {
              //Verify available Credits after partial or full repayment
              expect(response.body.open_to_buy.available_credit_cents, "Available Credit Balance is displayed").to.eq(
                parseInt(data.available_credit_cents)
              );
            }
          });
        });
      }
      if (data.check_payment_reversal.toLowerCase() === "true") {
        it(`should have perform payment reversal - '${data.tc_name}'`, async () => {
          lineItemsAPI.paymentReversalLineitems(accountID, paymentID).then((response) => {
            expect(response.status).to.eq(200);
          });
          //Roll time forward to generate payment reversal
          const endDate = dateHelper.getRollDate(1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate payment reversal as a line item and should have payment reversal fee based on the config parameters- '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PAYMENT_REVERSAL_FEE",
            parseInt(data.payment1_amt_cents)
          );
        });

        it(`should have to wait for account roll time forward  to make sure balance summary is updated - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getRollDate(parseInt(data.Rolltime_after_reversal));
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should be able to see reduction in fee,interest and principal amount in statement based on the config parameters- '${data.tc_name}'`, async () => {
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
      }
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "product_type"
  | "cycle_interval"
  | "cycle_due_interval"
  | "promo_len"
  | "promo_min_pay_type"
  | "promo_default_interest_rate_percent"
  | "promo_min_pay_percent"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
>;

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "post_promo_len"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "delete_field_name"
  | "cycle_due_interval_del"
  | "initial_principal_cents"
  | "credit_limit_cents"
  | "promo_impl_interest_rate_percent"
>;
