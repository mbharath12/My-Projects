/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { statementsAPI } from "../../../api_support/statements";
import { statementValidator } from "../../../api_validation/statements_validator";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import statementJSON from "../../../../resources/testdata/statement/statement_monthly_fee.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "../../../api_support/constants";

//Test Scripts
//pp478	Statement with - no origination fees - charge - monthly fees - no payment
//pp479	Statement with - no origination fees - charge - monthly fees - monthly fees only payment
//pp480	Statement with - no origination fees - charge - monthly fees - charge only payment
//pp481	Statement with - no origination fees - charge - monthly fees - monthly fees and charge payment
//pp482	Statement with - no origination fees - charge - monthly fees - monthly fees and partial payment
//pp483	Statement with - origination fees - charge - monthly fees - no payment
//pp484	Statement with - origination fees - charge - monthly fees - monthly fees only payment
//pp485	Statement with - origination fees - charge - monthly fees - charge only payment
//pp486	Statement with - origination fees - charge - monthly fees - monthly fees and charge payment
//pp487	Statement with - origination fees - charge - monthly fees - all payments
//pp488	Statement with- origination fees - charge - monthly fees - pay fees and partial principal pay

// Statement verifications with monthly cycle with origination fee, charges,
// payments and monthly fee
TestFilters(
  ["regression", "systemOfRecords", "statements", "payments", "charges", "originationFee", "monthlyFee"],
  () => {
    describe("Statement verifications with monthly cycle", function () {
      let accountID;
      let productID;
      let customerID;
      let response;

      before(() => {
        authAPI.getDefaultUserAccessToken();

        productAPI.createProductWith1monthCycleInterval("product_credit.json", true, true).then((productResponse) => {
          productID = productResponse.body.product_id;
        });

        //Create a customer
        customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
          customerID = newCustomerID;
        });
      });

      statementJSON.forEach((data) => {
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          //Update product, customer and origination fee in account JSON
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.intial_principle_in_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: 0,
            first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
          };

          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
        });

        //Calling roll time forward to get charge amount in statement and statement details get updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          //Roll time forward to generate statement lineIte
          const endDate = dateHelper.getStatementDate(data.account_effective_dt, 40);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        //Check charge amount and origination fee displayed in first cycle of statement
        it(`should able to see charge amount  in statement- '${data.tc_name}'`, async() => {
          //const statementDateForCharge = dateHelper.getStatementDate(effectiveDate,0)
          //Get statement list for account
           response = await promisify(statementsAPI.getStatementByAccount(accountID));
            const chargeStatementID = statementValidator.getStatementIDByNumber(response, 0);
            //Get statement details for given statement id
            response = await promisify(statementsAPI.getStatementByStmtId(accountID, chargeStatementID));
              //Check charge line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "CHARGE",
                original_amount_cents: parseInt(data.intial_principle_in_cents),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);

              //Check origination line item is displayed in the statement
              if (data.check_origination_fee.toLowerCase() === "true") {
                const originationFeeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "ORIG_FEE",
                  original_amount_cents: parseInt(data.origination_fee_cents),
                };
                lineItemValidator.validateStatementLineItem(response, originationFeeLineItem);
              }
        });

        //Check monthly fee displayed in statement
        it(`should able to see monthly fee in statement- '${data.tc_name}'`, () => {
          //Get statement list for account
          statementsAPI.getStatementByAccount(accountID).then((response) => {
            const monthlyStatementID = statementValidator.getStatementIDByNumber(response, 0);
            //Get statement details for given statement id
            statementsAPI.getStatementByStmtId(accountID, monthlyStatementID).then((response) => {
              //Check monthly fee line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);
            });
          });
        });

        if (data.do_payment.toLowerCase() === "true") {
          it(`should have create a payment - '${data.tc_name}'`, () => {
            //Update payment amount and payment effective dt
            const paymentAmt = data.payment_amt_cents;
            //const paymentEffectiveDate = dateHelper.getMonthlyFeeStatementDate(effectiveDate);
            paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, data.payment_effective_dt);
          });

          //Calling roll time forward to get statement and statement details get updated
          it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
            //Roll time forward to generate statement lineItem
            const endDate = dateHelper.getStatementDate(data.account_effective_dt, 65);
            const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
            expect(response.status).to.eq(200);
          });

          //Check payment details displayed in statement
          it(`should able to see payment amount in statement- '${data.tc_name}'`, () => {
            //check the line item is displayed for the account
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const paymentLineItem: StmtLineItem = {
              status: "VALID",
              type: "PAYMENT",
              original_amount_cents: parseInt(data.payment_amt_cents) * -1,
            };
            lineItemsAPI.allLineitems(accountID).then((response) => {
              lineItemValidator.validateLineItem(response, paymentLineItem);
            });

            //Get statement list for account to check payment line item
            statementsAPI.getStatementByAccount(accountID).then((response) => {
              const monthlyStatementID = statementValidator.getStatementIDByNumber(response, 1);
              //Get statement details for given statement id
              statementsAPI.getStatementByStmtId(accountID, monthlyStatementID).then((response) => {
                //Check monthly fee line item is displayed in the statement
                lineItemValidator.validateStatementLineItem(response, paymentLineItem);
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
  | "initial_principal_cents"
  | "credit_limit_cents"
  | "origination_fee_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "payment_reversal_fee_cents"
  | "promo_impl_interest_rate_percent"
  | "first_cycle_interval"
>;
