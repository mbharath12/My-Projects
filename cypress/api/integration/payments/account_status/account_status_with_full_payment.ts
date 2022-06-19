import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { paymentAPI } from "../../../api_support/payment";
import accountStatusJSON from "cypress/resources/testdata/account/account_status_closed.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
/* eslint-disable cypress/no-async-tests */

//Test Scripts
//PP2670 - Installment product - Account closed by full payment and status updated to "Closed - Paidoff"
//PP2671 - Installment product - Account closed by Excess payment and status updated to "Closed-SURPLUS_BALANCE"
//PP2677 - Installment product - SUSPENDED/ Delinquent Account closed by full payment and status updated to "Closed- Paidoff"
//PP2678 - Installment product - SUSPENDED/Delinquent Account closed by Excess payment and status updated to "Closed-SURPLUS_BALANCE"
//PP2679 - BNPL product - Account closed by full payment and status updated to "Closed - Paidoff"
//PP2680 - BNPL product - Account closed by Excess payment and status updated to "Closed-SURPLUS_BALANCE"
//PP2686 - BNPL product - SUSPENDED/ Delinquent Account closed by full payment and status updated to "Closed- Paidoff"
//PP2687 - BNPL product - SUSPENDED/Delinquent Account closed by Excess payment and status updated to "Closed-SURPLUS_BALANCE"
//PP2688 - Multi Adv product - Account closed after promo period by full payment and status updated to "Closed- Paidoff"
//PP2689 - Multi Adv product - Account closed after promo period by full payment and status updated to "Closed-SURPLUS_BALANCE"
//PP2690 - Multi Adv product - Account closed before promo period by full payment and status remain "Active"
//PP2691 - Multi Adv product - Account closed before promo period by Excess payment and status remain"Active"
//PP2692 - Revolving LOC - Verify after full payment in the account status remain "Active"
//PP2693 - Revolving LOC - Verify after Excess payment in the account status remain "Active" with credit balance
//PP2694 - Charge Card - Verify after full payment in the account status remain "Active"
//PP2695 - Charge Card - Verify after Excess payment in the account status remain "Active" with credit balance

TestFilters(["regression", "accountStatus", "fullPayment"], () => {
  //Validate account status on full payment with different products and settings
  describe("Account Status Validation with payment and charge ", function () {
    let accountID;
    let productID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    accountStatusJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
        };
        response = await promisify(productAPI.updateNCreateProduct(data.product_json_file, productPayload));
        productID = response.body.product_id;
        cy.log("new installment product created : " + productID);
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer and account effective date in account JSON file

        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          effective_at: data.account_effective_dt,
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      //Calling roll time forward to make sure account status is updated
      it(`should have to wait for account roll time forward - '${data.tc_name}'`, async () => {
        //Roll time forward to account status is updated
        const endDate = dateHelper.getStatementDate(data.account_effective_dt, 9);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status).to.eq(data.account_status);
      });

      it(`should be able to create payment and verify account status - '${data.tc_name}'`, async () => {
        paymentAPI.paymentForAccount(accountID, "payment.json", data.payment_amt_cents, data.payment_date);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, data.rollforward_date));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status).to.eq(data.account_status_on_full_payment);
        if (data.account_status_on_full_payment.toLocaleLowerCase() === "closed") {
          expect(response.body.account_overview.account_status_subtype).to.eq(data.account_sub_status);
        }
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
>;
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "monthly_fee_cents" | "late_fee_cents"
>;
