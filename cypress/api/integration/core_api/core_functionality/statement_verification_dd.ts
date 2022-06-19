import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { statementsAPI } from "../../../api_support/statements";
import { statementValidator } from "../../../api_validation/statements_validator";
import { lineItemValidator } from "../../../api_validation/line_item_validator";
import statementsJSON from "../../../../resources/testdata/statement/statements.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//pp470 - statement with no origination fee no charge no payment  for installment
//pp471 - statement with no origination fee no charge no payment for credit card
//pp472 - statement with origination fee no charge no payment for installment
//pp473 - statement with origination fee charge no payment for credit card
//pp474 - statement with origination fee charge payment - origination fee  for credit card
//pp475 - statement with origination fee charge payment -charge for credit card
//pp476 - statement with origination fee charge payment -charge and origination fee for credit card
//pp477 - statement with origination fee charge payment -partial charge and origination fee for credit card

// This test suite will cover statement verifications with origination fee,
// charge and payment
TestFilters(
  ["smoke","regression", "systemOfRecords", "statements", "payments", "charges", "originationFee", "annualFee", "monthlyFee"],
  () => {
    describe("Statement verifications with origination fee, charge and payment", function () {
      let accountID;
      let productID;
      let customerID;
      let productCreditID;
      let productInstallmentID;
      let effectiveDate;

      before(() => {
        authAPI.getDefaultUserAccessToken();

        productAPI.createProductWith7daysCycleInterval("product_credit.json", true, true).then((productResponse) => {
          productCreditID = productResponse.body.product_id;
        });

        productAPI.createProductWith7daysCycleInterval("payment_product.json", true, true).then((productResponse) => {
          productInstallmentID = productResponse.body.product_id;
        });

        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
      });

      statementsJSON.forEach((data) => {
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Assign product id based on product type
          if (data.product_type === "CREDIT") {
            productID = productCreditID;
          } else {
            productID = productInstallmentID;
          }

          //create account and assign customer
          const days = parseInt(data.account_effective_dt);
          effectiveDate = dateHelper.addDays(days, 0);
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effectiveDate,
            initial_principal_cents: parseInt(data.initial_principle_in_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: 0,
            first_cycle_interval: data.cycle_interval,
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          accountID = response.body.account_id;
        });

        if (data.check_payment.toLowerCase() === "true") {
          it(`should have create a payment - '${data.tc_name}'`, () => {
            //Update payment amount and payment effective dt
            const paymentEffectiveDate = dateHelper.addDays(parseInt(data.payment_effective_dt), 0);
            paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amt_cents, paymentEffectiveDate);
          });
        }

        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          //Roll time forward to generate statement lineItem
          const moveDate = parseInt(data.cycle_interval) * 2;
          const endDate = dateHelper.getRollDate(moveDate);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate origination fee and charge details in account statement - '${data.tc_name}'`, () => {
          //Get statements list for account
          statementsAPI.getStatementByAccount(accountID).then((response) => {
            expect(response.status).to.eq(200);

            const firstStatementDate = dateHelper.getStatementDate(effectiveDate, 0);
            const firstStatementID = statementValidator.getStatementID(response, firstStatementDate);

            //Get first statement id line items
            statementsAPI.getStatementByStmtId(accountID, firstStatementID).then((response) => {
              cy.log(JSON.stringify(response));
              expect(response.status).to.eq(200);

              //validation of no charge and no origination fee
              if (parseInt(data.origination_fee_cents) === 0 && parseInt(data.initial_principle_in_cents) === 0) {
                expect(response.body.line_items.length,"check no line items are displayed when no origination fee and no loan ").to.eq(0);
              }

              if (data.check_origination_fee.toLowerCase() === "true") {
                const originationFeeLineItem = lineItemValidator.getStatementLineItem(response, "ORIG_FEE");
                cy.log(originationFeeLineItem);
                expect(originationFeeLineItem.line_item_summary.original_amount_cents,"check origination fee amount in origination fee line item").to.eq(
                  parseInt(data.origination_fee_cents)
                );
              }
              if (data.check_charge.toLowerCase() === "true") {
                const chargeLineItem = lineItemValidator.getStatementLineItem(response, "CHARGE");
                expect(chargeLineItem.line_item_summary.original_amount_cents,"check original_amount_cents in charge line item").to.eq(
                  parseInt(data.initial_principle_in_cents)
                );
              }
            });
          });
        });

        if (data.check_payment.toLowerCase() === "true") {
          it(`should have validate payment line item in statement- '${data.tc_name}'`, () => {
            //Get statements list for account
            statementsAPI.getStatementByAccount(accountID).then((response) => {
              expect(response.status).to.eq(200);
              const secondStatementID = statementValidator.getStatementIDByNumber(response, 1);
              //Get second statement id line items
              statementsAPI.getStatementByStmtId(accountID, secondStatementID).then((response) => {
                expect(response.status).to.eq(200);

                const paymentLineItem = lineItemValidator.getStatementLineItem(response, "PAYMENT");
                expect(paymentLineItem.line_item_summary.original_amount_cents).to.eq(
                  parseInt(data.payment_amt_cents) * -1
                );
              });
            });
          });
        }
      });
    });
  }
);

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
