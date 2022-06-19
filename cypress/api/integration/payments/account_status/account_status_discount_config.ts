/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { paymentAPI } from "../../../api_support/payment";
import { productAPI,ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import { rollTimeAPI } from "../../../api_support/rollTime";
import accountConfigJSON from "../../../../resources/testdata/account/account_status_with_discount_config.json";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
import { CycleTypeConstants } from "cypress/api/api_support/constants";

//Test Scripts
//PP2675 - Installment Product - Verify Full payment with Discount and status updated to "Closed_Paidofff"
//PP2676 - Installment Product - Verify Excess payment with Discount and status updated to "Closed_Surplus Balance"
//PP2684 - BNPL Product - Verify Full payment with Discount and status updated to "Closed_Paidofff"
//PP2685 - BNPL Product - Verify Excess payment with Discount and status updated to "Closed_Surplus Balance"
//PP1282E - BNPL Product - Verify Loan Discount cents signifies the amount of discount that will be offered for Loan Prepayment in full

TestFilters(["regression", "accountStatus", "discount", "fullPayment"], () => {
  //Validate closed account status where account with discount config
  describe("Validate account status with discount config ", function () {
    let accountID;
    let productID;
    let response;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("Customer ID : " + customerID);
    });

    accountConfigJSON.forEach((data) => {
      //Create a new product
      it(`should have create a new product - '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.cycle_interval,
          promo_len: parseInt(data.promo_len),
          promo_min_pay_type: data.promo_min_pay_type
        }
        response = await promisify(productAPI.updateNCreateProduct(data.product_file,productPayload));
        productID = response.body.product_id;
        cy.log("product ID : " + productID);
      });
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer and account effective date in account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          loan_discount_cents: data.loan_discount_cents,
          loan_discount_at: data.loan_discount_at,
          origination_fee_cents: parseInt(data.origination_fee_cents),
          initial_principal_cents: parseInt(data.initial_principal_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          first_cycle_interval: data.cycle_interval,
        };
        response = await promisify(accountAPI.updateNCreateAccount("account_discount.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });
      it(`should have create a payment - '${data.tc_name}'`, () => {
        //Update payment amount and payment effective dt
        paymentAPI.paymentForAccount(
          accountID,
          "payment.json",
          parseInt(data.payment_amount),
          data.payment_effective_dt
        );
      });
      //Calling roll time forward to get the payment line item
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        const forwardDate = dateHelper.calculateMoveDaysForCycleInterval(CycleTypeConstants.cycle_interval_1month, 2);
        const rollForwardDate = dateHelper.getRollDateWithEffectiveAt(data.account_effective_at, forwardDate);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, rollForwardDate));
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
          original_amount_cents: parseInt(data.payment_amount) * -1,
          effective_at: data.payment_effective_dt.slice(0, 10),
        };
        lineItemValidator.validateAccountLineItemWithEffectiveDate(response, payment1LineItem);
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
        expect(response.body.account_overview.account_status_subtype).to.eq(data.account_sub_status);
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
    | "monthly_fee_cents"
    | "late_fee_cents"
    | "loan_discount_cents"
    | "loan_discount_at"
    | "first_cycle_interval"
  >;
  type CreateProduct = Pick< ProductPayload,
  | "cycle_interval"
  |"cycle_due_interval"
  |"first_cycle_interval"
  |"promo_len"
  | "promo_min_pay_type"
  >;
});
