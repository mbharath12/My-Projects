/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { paymentAPI } from "../../api_support/payment";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { lineItemsAPI } from "../../api_support/lineItems";
import { LineItem, lineItemValidator } from "../../api_validation/line_item_validator";
import { rollTimeAPI } from "../../api_support/rollTime";
import accountConfigJSON from "../../../resources/testdata/account/account_config_with_discount.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
import { CycleTypeConstants } from "../../api_support/constants";

//Test Scripts
//pp1281 - verify loan discount cents signifies the amount of discount that will be offered for Loan Prepayment in full
//pp1282 - verify loan discount is not offered when account is Prepaid in full after the discount date cutoff
//pp1282A - verify loan discount cents signifies the amount of discount that will be offered for Loan Prepayment in full on the loan date
//pp1282B - verify loan discount cents signifies the amount with multiple payments on different dates within the discount period
//pp1282C - verify loan discount cents signifies the amount with multiple payments more than the Discount amount specified on different dates within discount period
//pp1282D - verify loan discount cents signifies the amount of discount that will be offered for Loan Prepayment in full on the loan date after Payment reversed after account closure
//pp836 - verify discount allowed on full prepayment of loan before maturity date
//pp535 - verify account status is closed with full payment

TestFilters(["accountSummary", "config", "discount", "regression"], () => {
  //Validate account status with different products and settings
  describe("Validate account config - loan discount cents ", function () {
    let accountID;
    let productID;
    let response;
    let paymentID;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new installment product
      productAPI.createNewProduct("product_installment.json").then((newInstallmentProductID) => {
        Cypress.env("installmentProductId", newInstallmentProductID);
      });
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    accountConfigJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        productID = Cypress.env("installmentProductId");
        //Update product, customer and account effective date in account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: data.account_effective_at,
          loan_discount_cents: data.loan_discount_cents,
          loan_discount_at: data.loan_discount_at,
          origination_fee_cents: parseInt(data.origination_fee_cents),
          initial_principal_cents: parseInt(data.initial_principal_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          first_cycle_interval: CycleTypeConstants.cycle_interval_1month,
        };

        response = await promisify(accountAPI.updateNCreateAccount("account_discount.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      it(`should have create a payment1 - '${data.tc_name}'`, () => {
        //Update payment amount and payment effective dt
        paymentAPI.paymentForAccount(
          accountID,
          "payment.json",
          parseInt(data.payment1_amount),
          data.payment1_effective_dt
        );
      });

      if (data.payment2_amount !== "0") {
        it(`should have create a payment2 - '${data.tc_name}'`, () => {
          //Update payment amount and payment effective dt
          paymentAPI.paymentForAccount(
            accountID,
            "payment.json",
            parseInt(data.payment2_amount),
            data.payment2_effective_dt
          );
        });
      }
      //Calling roll time forward to get the payment line item
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        //Roll time forward to generate surcharge lineItem
        const endDate = dateHelper.getStatementDate(data.account_effective_at, 9);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have payment line item and prepayment discount line item in account - '${data.tc_name}'`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        //Check payment line item is displayed in account
        //Prepare expected line item data to validate

        type AccLineItem = Pick<LineItem, "status" | "type" | "effective_at" | "original_amount_cents">;
        const payment1LineItem: AccLineItem = {
          status: "VALID",
          type: "PAYMENT",
          original_amount_cents: parseInt(data.payment1_amount) * -1,
          effective_at: data.payment1_effective_dt.slice(0, 10),
        };
        lineItemValidator.validateAccountLineItemWithEffectiveDate(response, payment1LineItem);
        const paymentResponse = lineItemValidator.getLineItem(response, "PAYMENT");
        paymentID = paymentResponse.line_item_id;
        if (data.payment2_amount !== "0") {
          const payment2LineItem: AccLineItem = {
            status: "VALID",
            type: "PAYMENT",
            original_amount_cents: parseInt(data.payment2_amount) * -1,
            effective_at: data.payment2_effective_dt.slice(0, 10),
          };
          lineItemValidator.validateAccountLineItemWithEffectiveDate(response, payment2LineItem);
        }
        //Check pre payment discount line item is displayed in account
        //when payment amount is equal to loan discount amount
        if (parseInt(data.discount_amount) !== 0) {
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "PREPAYMENT_DISCOUNT",
            parseInt(data.discount_amount) * -1
          );
        }
      });

      it(`should have validate account status after full payment - '${data.tc_name}'`, async () => {
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status, "verify account status after full payment").to.eq(
          data.account_status
        );
        expect(
          response.body.summary.total_balance_cents,
          "verify total_balance_cents updated to zero for closed account status"
        ).to.eq(0);
      });

      if (data.payment_reversal.toLowerCase() === "true") {
          it(`should have perform payment reversal - '${data.tc_name}'`, () => {
            lineItemsAPI.paymentReversalLineitems(accountID, paymentID).then((response) => {
              expect(response.status).to.eq(data.account_status_payment_reversal);
            });
          });

        //Inserted condition - Closed account does not allow any transaction
        if (parseInt(data.account_status_payment_reversal) === 200) {
        it(`should have validate payment reversal as a line item and should have payment reversal fee based on the config parameters- '${data.tc_name}'`, async () => {
          //Roll forward till payment reversal update
          const endDate = dateHelper.getRollDate(3);
          rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
            expect(response.status).to.eq(200);
          });
        
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          type payReversalItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const payReversalLineItem: payReversalItem = {
            status: "VALID",
            type: "PAYMENT_REVERSAL",
            original_amount_cents: parseInt(data.payment1_amount) + parseInt(data.discount_amount),
          };
          lineItemValidator.validateLineItem(response, payReversalLineItem);
        });
        it(`should have validate account status after payment reversal - '${data.tc_name}'`, async () => {
          //Validate the account status
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(200);
          expect(response.body.account_overview.account_status, "verify account status after payment reversal").to.eq(
            data.account_status_payment_reversal
          );
        });
      }
      }
    });

    type CreateAccount = Pick<
      AccountPayload,
      | "product_id"
      | "customer_id"
      | "effective_at"
      | "initial_principal_cents"
      | "credit_limit_cents"
      | "origination_fee_cents"
      | "monthly_fee_cents"
      | "late_fee_cents"
      | "loan_discount_cents"
      | "loan_discount_at"
      | "first_cycle_interval"
    >;
  });
});
