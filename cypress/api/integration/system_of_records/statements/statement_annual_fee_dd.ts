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
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import statementsJSON from "../../../../resources/testdata/statement/statements_for_annual_fees.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "../../../api_support/constants";

//Test Scripts
//pp489 - statement verification with no origination fees charge annual fees no payment
//pp490 - statement verification with no origination fees charge annual fees payment - annual fees
//pp491 - statement verification with no origination fees charge annual fees payment - charge
//pp492 - statement verification with no origination fees charge annual fees  payment - annual fees and charge
//pp493 - statement verification with no origination fees charge annual fees payment  - annual fees and partial amount
//pp494 - statement verification with origination fees charge annual fees and no payment
//pp495 - statement verification with origination fees charge annual fees and payment -  annual fees
//pp496 - statement verification with origination fees charge annual fees payment - charge
//pp497 - statement verification with origination fees charge annual fees and payment - annual fees and charge
//pp498 - statement verification with origination fees charge annual fees and payment all
//pp499 - statement verification with origination fees charge annual fees payment -  fees and partial principal

TestFilters(["regression", "systemOfRecords", "statements", "payments", "annualFee"], () => {
  //This test suite will cover statement verifications with origination fee, charge annual fee with payments .
  describe("Statement verifications with annual fee cycle", function () {
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

    statementsJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer and account details in account JSON file

        //create account and assign to customer
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_dt,
          initial_principal_cents: parseInt(data.initial_principle_in_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          annual_fee_cents: parseInt(data.annual_fee_cents),
          first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
        };
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        accountID = response.body.account_id;
      });

      if (data.check_payment.toLowerCase() === "true") {
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

      it(`should have validate origination fee and charge details in account statement - '${data.tc_name}'`, async () => {
        //Get statements list for account
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        const firstStatementID = statementValidator.getStatementIDByNumber(response, 0);

        //Get first statement id line items
        response = await promisify(statementsAPI.getStatementByStmtId(accountID, firstStatementID));
        expect(response.status).to.eq(200);

        if (data.check_origination_fee.toLowerCase() === "true") {
          const originationFeeLineItem = lineItemValidator.getStatementLineItem(response, "ORIG_FEE");
          cy.log(originationFeeLineItem);
          expect(originationFeeLineItem.line_item_summary.original_amount_cents).to.eq(
            parseInt(data.origination_fee_cents)
          );
        }
        if (data.check_charge.toLowerCase() === "true") {
          const chargeLineItem = lineItemValidator.getStatementLineItem(response, "CHARGE");
          expect(chargeLineItem.line_item_summary.original_amount_cents).to.eq(
            parseInt(data.initial_principle_in_cents)
          );
        }
        //Check annual fee displayed in statement
        const annualFeeStatementDate = dateHelper.getAnnualFeeStatementDate(data.account_effective_dt);
        cy.log("annual fee date" + annualFeeStatementDate);
        type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        const annualFeeLineItem: StmtLineItem = {
          status: "VALID",
          type: "YEAR_FEE",
          original_amount_cents: parseInt(data.annual_fee_cents),
        };
        lineItemValidator.validateStatementLineItem(response, annualFeeLineItem);

        if (data.check_payment.toLowerCase() === "true") {
          const paymentLineItem: StmtLineItem = {
            status: "VALID",
            type: "PAYMENT",
            original_amount_cents: parseInt(data.payment_amt_cents) * -1,
          };
          lineItemValidator.validateStatementLineItem(response, paymentLineItem);
        }
      });
    });
  });
});

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
