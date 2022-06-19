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
import statementJSON from "../../../../resources/testdata/statement/statement_annual_monthly_fee.json";
import TestFilters from "../../../../support/filter_tests.js";
import { CycleTypeConstants } from "../../../api_support/constants";
import promisify from "cypress-promise";

//Test Scripts
//pp500 - statement with - no origination fees - charge - monthly fees - annual fees - no payment
//pp501 - statement with - no origination fees - charge - monthly fees - annual fees - monthly fees only payment
//pp502 - statement with - no origination fees - charge - monthly fees - annual fees - charge only payment
//pp503 - statement with - no origination fees - charge - monthly fees - annual fees - monthly fees and charge payment
//pp504 - statement with - no origination fees - charge - monthly fees - annual fees - annual fees and charge payment
//pp505 - statement with - no origination fees - charge - monthly fees - annual fees - all fees and partial payment
//pp506 - statement with - origination fees - monthly fees- charge - monthly fees - annual fees - no payment
//pp507 - statement with - origination fees - charge - annual fees - monthly fees only payment
//pp508 - statement with - origination fees - charge - monthly fees - annual fees - charge only payment
//pp509 - statement with - origination fees - charge - monthly fees - annual fees - monthly fees and charge payment
//pp510 - statement with - origination fees - charge - monthly fees - annual fees - annual fees and charge payment
//pp511 - statement with - origination fees - charge - monthly fees - annual fees - all payments
//pp512 - statement with - origination fees - charge - monthly fees - annual fees - pay fees and partial principal pay

// Statement verifications with annual and monthly cycle with origination fee, charges,
// payments and monthly fee
TestFilters(
  ["regression", "systemOfRecords", "statements", "payments", "charges", "originationFee", "annualFee", "monthlyFee"],
  () => {
    describe("Statement verifications with monthly cycle", function () {
      let accountID;
      let productID;
      let customerID;
      let response;

      before(() => {
        authAPI.getDefaultUserAccessToken();

        //Update credit product cycle interval details
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
          //create account and assign to customer
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            initial_principal_cents: parseInt(data.intial_principle_in_cents),
            origination_fee_cents: parseInt(data.origination_fee_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
          accountID = response.body.account_id;
        });

        if (data.do_payment.toLowerCase() === "true") {
          it(`should have create a payment - '${data.tc_name}'`, () => {
            //Update payment amount and payment effective dt
            paymentAPI.paymentForAccount(
              accountID,
              "payment.json",
              parseInt(data.payment_amt_cents),
              data.payment_effective_dt
            );
          });
        }
        //Calling roll time forward to get statement and statement details get updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          //Roll time forward to generate statement lineItem
          const endDate = dateHelper.getStatementDate(data.account_effective_dt, 35);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });
        //Check charge amount and origination fee displayed in first cycle of statement
        it(`should able to see charge amount  in statement- '${data.tc_name}'`, async () => {
          //Get statements list for account
          response = await promisify(statementsAPI.getStatementByAccount(accountID));
          expect(response.status).to.eq(200);
          const firstStatementID = statementValidator.getStatementIDByNumber(response, 0);
          //Get first statement id line items
          response = await promisify(statementsAPI.getStatementByStmtId(accountID, firstStatementID));
          expect(response.status).to.eq(200);
          type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          //Check charge line item is displayed in the statement
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
          //Check year fee line item is displayed in the statement
          const annualFeeLineItem: StmtLineItem = {
            status: "VALID",
            type: "YEAR_FEE",
            original_amount_cents: parseInt(data.annual_fee_cents),
          };
          lineItemValidator.validateStatementLineItem(response, annualFeeLineItem);

          //Check monthly fee line item is displayed in the statement
          const monthFeeLineItem: StmtLineItem = {
            status: "VALID",
            type: "MONTH_FEE",
            original_amount_cents: parseInt(data.monthly_fee_cents),
          };
          lineItemValidator.validateStatementLineItem(response, monthFeeLineItem);

          if (data.do_payment.toLowerCase() === "true") {
            const paymentLineItem: StmtLineItem = {
              status: "VALID",
              type: "PAYMENT",
              original_amount_cents: parseInt(data.payment_amt_cents) * -1,
            };
            lineItemValidator.validateStatementLineItem(response, paymentLineItem);
            //validate payment line item in line items list
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            lineItemValidator.validateLineItem(response, paymentLineItem);
          }
        });
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
  | "initial_principal_cents"
>;
