/* eslint-disable prefer-const */
import { Constants } from "cypress/api/api_support/constants";
import { v4 as uuid } from "uuid";

export class Account {
  createAccount(json) {
    return cy.request({
      method: "POST",
      url: "accounts",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  getAccountById(accountId) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountId,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }
  getAmortizationSchedule(accountId) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountId + "/amortization_schedule",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  //Create new account with given product id, customer id and account effective at
  //ex:createNewAccount("4236","3461", "2021-08-01T02:18:27-08:00","account_payment.json")
  createNewAccount(productID: string, customerID: string, effectiveAt: string, templateFileName: string) {
    //Update product, customer and effective At in account JSON file
    const accountFileName = Constants.templateFixtureFilePath.concat("/account/", templateFileName);

    return cy.fixture(accountFileName).then((accountJSON) => {
      accountJSON.product_id = productID;
      if (customerID) {
        accountJSON.assign_customers[0].customer_id = customerID;
      }
      if (effectiveAt.length) {
        accountJSON.effective_at = effectiveAt;
      }
      if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
        accountJSON.account_id = "autoTest_acct_".concat(uuid());
      }
      cy.log(JSON.stringify(accountJSON));
      this.createAccount(accountJSON).then((response) => {
        return response;
      });
    });
  }

  //Create new account with given product id, customer id ,templateFileName, temporaryFileName,Pick Object
  //ex:updateNCreateAccount("account_payment.json",Pick Obj)
  updateNCreateAccount(templateFileName: string, updateData) {
    //Update product, customer and effective At in account JSON file

    const accountFileName = Constants.templateFixtureFilePath.concat("/account/", templateFileName);

    return cy.fixture(accountFileName).then((accountJSON) => {
      accountJSON.product_id = updateData.product_id;

      if ("customer_id" in updateData) {
        accountJSON.assign_customers[0].customer_id = updateData.customer_id;
        if (updateData.customer_id === 0) {
          delete accountJSON.assign_customers[0].customer_id;
        }
      }
      if ("customer_account_role" in updateData) {
        accountJSON.assign_customers[0].customer_account_role = updateData.customer_account_role;
        if (updateData.customer_account_role === "delete") {
          delete accountJSON.assign_customers[0].customer_account_role;
        }
      }
      if ("second_customer_id" in updateData) {
        accountJSON.assign_customers[1].customer_id = updateData.second_customer_id;
      }
      if ("second_customer_account_role" in updateData) {
        accountJSON.assign_customers[1].customer_account_role = updateData.second_customer_account_role;
        if (updateData.second_customer_account_role === "delete") {
          delete accountJSON.assign_customers[1].customer_account_role;
        }
      }
      if ("third_customer_id" in updateData) {
        accountJSON.assign_customers[2].customer_id = updateData.third_customer_id;
      }
      if ("third_customer_account_role" in updateData) {
        accountJSON.assign_customers[2].customer_account_role = updateData.third_customer_account_role;
      }
      if ("fourth_customer_id" in updateData) {
        accountJSON.assign_customers[3].customer_id = updateData.fourth_customer_id;
      }
      if ("fourth_customer_account_role" in updateData) {
        accountJSON.assign_customers[3].customer_account_role = updateData.fourth_customer_account_role;
      }
      if ("fifth_customer_id" in updateData) {
        accountJSON.assign_customers[4].customer_id = updateData.fifth_customer_id;
      }
      if ("fifth_customer_account_role" in updateData) {
        accountJSON.assign_customers[4].customer_account_role = updateData.fifth_customer_account_role;
      }
      if ("effective_at" in updateData) {
        accountJSON.effective_at = updateData.effective_at;
      }
      if ("late_fee_grace" in updateData) {
        //if (updateData.late_fee_grace) {
        if ("late_fee_grace" in accountJSON) {
          accountJSON.cycle_type.late_fee_grace = updateData.late_fee_grace;
          if (updateData.late_fee_grace === "delete") {
            delete accountJSON.cycle_type.late_fee_grace;
          }
        }
      }
      if ("credit_limit_cents" in updateData) {
        accountJSON.summary.credit_limit_cents = updateData.credit_limit_cents;
        if (updateData.credit_limit_cents === -1) {
          delete accountJSON.summary.credit_limit_cents;
        }
      }
      if ("max_approved_credit_limit_cents" in updateData) {
        accountJSON.summary.max_approved_credit_limit_cents = updateData.max_approved_credit_limit_cents;
      }
      if ("late_fee_cents" in updateData) {
        accountJSON.summary.late_fee_cents = updateData.late_fee_cents;
        if (updateData.late_fee_cents === -1) {
          delete accountJSON.summary.late_fee_cents;
        }
      }

      if ("payment_reversal_fee_cents" in updateData) {
        accountJSON.summary.payment_reversal_fee_cents = updateData.payment_reversal_fee_cents;
        if (updateData.payment_reversal_fee_cents === -1) {
          delete accountJSON.summary.payment_reversal_fee_cents;
        }
      }
      if ("initial_principal_cents" in updateData) {
        accountJSON.summary.initial_principal_cents = updateData.initial_principal_cents;
      }
      if ("origination_fee_cents" in updateData) {
        accountJSON.summary.origination_fee_cents = updateData.origination_fee_cents;
      }
      if ("monthly_fee_cents" in updateData) {
        accountJSON.summary.monthly_fee_cents = updateData.monthly_fee_cents;
      }
      if ("annual_fee_cents" in updateData) {
        accountJSON.summary.annual_fee_cents = updateData.annual_fee_cents;
      }
      if ("late_fee_cap_percent" in updateData) {
        accountJSON.summary.late_fee_cap_percent = updateData.late_fee_cap_percent;
      }
      if ("cycle_interval" in updateData) {
        accountJSON.cycle_type.cycle_interval = updateData.cycle_interval;
      }
      if ("cycle_due_interval" in updateData) {
        accountJSON.cycle_type.cycle_due_interval = updateData.cycle_due_interval;
      }
      if ("first_cycle_interval" in updateData) {
        accountJSON.cycle_type.first_cycle_interval = updateData.first_cycle_interval;
        if (updateData.first_cycle_interval === "delete") {
          delete accountJSON.cycle_type.first_cycle_interval;
        }
      }

      if ("loan_discount_cents" in updateData) {
        accountJSON.discounts.prepayment_discount_config.loan_discount_cents = updateData.loan_discount_cents;
      }

      if ("loan_discount_at" in updateData) {
        accountJSON.discounts.prepayment_discount_config.loan_discount_at = updateData.loan_discount_at;
      }

      if ("autopay_enabled" in updateData) {
        accountJSON.payment_processor_config.autopay_enabled = updateData.autopay_enabled;
      }

      if ("plaid_access_token" in updateData) {
        accountJSON.plaid_config.plaid_access_token = updateData.plaid_access_token;
      }

      if ("plaid_account_id" in updateData) {
        accountJSON.plaid_config.plaid_account_id = updateData.plaid_account_id;
      }

      if ("check_balance_enabled" in updateData) {
        accountJSON.plaid_config.check_balance_enabled = updateData.check_balance_enabled;
      }

      if ("default_payment_processor_method" in updateData) {
        accountJSON.payment_processor_config.default_payment_processor_method =
          updateData.default_payment_processor_method;
      }
      if ("promo_impl_interest_rate_percent" in updateData) {
        accountJSON.promo_overview.promo_impl_interest_rate_percent = updateData.promo_impl_interest_rate_percent;
        if (updateData.promo_impl_interest_rate_percent === -1) {
          delete accountJSON.promo_overview.promo_impl_interest_rate_percent;
        }
      }
      if ("post_promo_impl_interest_rate_percent" in updateData) {
        accountJSON.post_promo_overview.post_promo_impl_interest_rate_percent =
          updateData.post_promo_impl_interest_rate_percent;
        if (updateData.post_promo_impl_interest_rate_percent === -1) {
          delete accountJSON.post_promo_overview.post_promo_impl_interest_rate_percent;
        }
      }
      if ("post_promo_impl_am_len" in updateData) {
        accountJSON.post_promo_overview.post_promo_impl_am_len = updateData.post_promo_impl_am_len;
        if (updateData.post_promo_impl_am_len === -1) {
          delete accountJSON.post_promo_overview.post_promo_impl_am_len;
        }
      }
      if ("promo_len" in updateData) {
        if ("promo_len" in accountJSON.promo_overview) {
          accountJSON.promo_overview.promo_len = updateData.promo_len;
        }
      }

      if ("promo_min_pay_type" in updateData) {
        if ("promo_min_pay_type" in accountJSON.promo_overview) {
          accountJSON.promo_overview.promo_min_pay_type = updateData.promo_min_pay_type;
        }
        if (updateData.promo_min_pay_type === "delete") {
          delete accountJSON.promo_overview.promo_min_pay_type;
        }
      }

      if ("promo_purchase_window_len" in updateData) {
        if ("promo_purchase_window_len" in accountJSON.promo_overview) {
          accountJSON.promo_overview.promo_purchase_window_len = updateData.promo_purchase_window_len;
        }
        if (updateData.promo_purchase_window_len === -1) {
          delete accountJSON.promo_overview.promo_purchase_window_len;
        }
      }

      if ("promo_interest_deferred" in updateData) {
        if (updateData.promo_interest_deferred.toLowerCase() === "false") {
          accountJSON.promo_overview.promo_interest_deferred = false;
        }
        if (updateData.promo_interest_deferred.toLowerCase() === "true") {
          accountJSON.promo_overview.promo_interest_deferred = true;
        }
        if (updateData.promo_interest_deferred.toLowerCase() === "delete") {
          delete accountJSON.promo_overview.promo_interest_deferred;
        }
      }
      if ("promo_min_pay_percent" in updateData) {
        if ("promo_min_pay_percent" in accountJSON.promo_overview) {
          accountJSON.promo_overview.promo_min_pay_percent = updateData.promo_min_pay_percent;
        }
        if (updateData.promo_min_pay_percent === -1) {
          delete accountJSON.promo_overview.promo_min_pay_percent;
        }
      }

      if ("post_promo_len" in updateData) {
        accountJSON.post_promo_overview.post_promo_len = updateData.post_promo_len;
      }
      if ("merchant_name" in updateData) {
        accountJSON.associated_entities.merchant_name = updateData.merchant_name;
      }
      if ("lender_name" in updateData) {
        accountJSON.associated_entities.lender_name = updateData.lender_name;
      }
      if ("delete_field_name" in updateData) {
        delete accountJSON[updateData.delete_field_name];
      }
      if ("cycle_interval_del" in updateData) {
        delete accountJSON.cycle_type.cycle_interval;
      }
      if ("cycle_due_interval_del" in updateData) {
        delete accountJSON.cycle_type.cycle_due_interval;
      }
      if ("first_cycle_interval_del" in updateData) {
        delete accountJSON.cycle_type.first_cycle_interval;
      }
      if ("state" in updateData) {
        accountJSON.assign_customers[0].customer_account_issuer_processor_config.lithic.state = updateData.state;
      }
      if ("type" in updateData) {
        accountJSON.assign_customers[0].customer_account_issuer_processor_config.lithic.type = updateData.type;
      }
      if ("memo" in updateData) {
        accountJSON.assign_customers[0].customer_account_issuer_processor_config.lithic.memo = updateData.memo;
      }
      if ("spend_limit" in updateData) {
        accountJSON.assign_customers[0].customer_account_issuer_processor_config.spend_limit = parseInt(
          updateData.spend_limit
        );
      }
      if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
        accountJSON.account_id = "autoTest_acct_".concat(uuid());
      }
      cy.log(JSON.stringify(accountJSON));
      this.createAccount(accountJSON).then((response) => {
        //if account update data contains doNot_check_response_status field
        //then not check the response status
        //this condition is for delete fields from account payload
        if ("doNot_check_response_status" in updateData === false) {
          expect(response.status).to.eq(200);
        }
        return response;
      });
    });
  }

  //Create new account with given product id, customer id ,templateFileName, temporaryFileName,Pick Object
  //ex:updateNCreatePaymentProcessorAccount("account_payment.json",Pick Obj)
  updateNCreatePaymentProcessorAccount(templateFileName: string, updateData) {
    //Update product, customer and effective At in account JSON file

    const accountFileName = Constants.templateFixtureFilePath.concat("/account/", templateFileName);

    return cy.fixture(accountFileName).then((accountJSON) => {
      accountJSON.product_id = updateData.product_id;

      if ("customer_id" in updateData) {
        accountJSON.assign_customers[0].customer_id = updateData.customer_id;
        if (updateData.customer_id === 0) {
          delete accountJSON.assign_customers[0].customer_id;
        }
      }
      if ("effective_at" in updateData) {
        accountJSON.effective_at = updateData.effective_at;
      }
      if ("autopay_enabled" in updateData) {
        accountJSON.payment_processor_config.autopay_enabled = updateData.autopay_enabled;
      }

      if ("default_payment_processor_method" in updateData) {
        accountJSON.payment_processor_config.default_payment_processor_method =
          updateData.default_payment_processor_method;
      }
      if ("payment_processor_name" in updateData) {
        accountJSON.payment_processor_config.ach.payment_processor_name = updateData.payment_processor_name;
        if (updateData.payment_processor_name === "delete") {
          delete accountJSON.payment_processor_config.ach.payment_processor_name;
        }
      }
      if ("repay_account_type" in updateData) {
        accountJSON.payment_processor_config.ach.repay_config.repay_account_type = updateData.repay_account_type;
        if (updateData.repay_account_type === "delete") {
          delete accountJSON.payment_processor_config.ach.repay_config.repay_account_type;
        }
      }
      if ("repay_check_type" in updateData) {
        accountJSON.payment_processor_config.ach.repay_config.repay_check_type = updateData.repay_check_type;
        if (updateData.repay_check_type === "delete") {
          delete accountJSON.payment_processor_config.ach.repay_config.repay_check_type;
        }
      }
      if ("repay_transit_number" in updateData) {
        accountJSON.payment_processor_config.ach.repay_config.repay_transit_number = updateData.repay_transit_number;
        if (updateData.repay_transit_number === "delete") {
          delete accountJSON.payment_processor_config.ach.repay_config.repay_transit_number;
        }
      }
      if ("repay_account_number" in updateData) {
        accountJSON.payment_processor_config.ach.repay_config.repay_account_number = updateData.repay_account_number;
        if (updateData.repay_account_number === "delete") {
          delete accountJSON.payment_processor_config.ach.repay_config.repay_account_number;
        }
      }
      if ("repay_name_on_check" in updateData) {
        accountJSON.payment_processor_config.ach.repay_config.repay_name_on_check = updateData.repay_name_on_check;
        if (updateData.repay_name_on_check === "delete") {
          delete accountJSON.payment_processor_config.ach.repay_config.repay_name_on_check;
        }
      }
      if ("repay_name_on_check" in updateData) {
        accountJSON.payment_processor_config.ach.repay_config.repay_name_on_check = updateData.repay_name_on_check;
        if (updateData.repay_name_on_check === "delete") {
          delete accountJSON.payment_processor_config.ach.repay_config.repay_name_on_check;
        }
      }
      if ("repay_card_number" in updateData) {
        accountJSON.payment_processor_config.debit_card.repay_config.repay_card_number = updateData.repay_card_number;
        if (updateData.repay_card_number === "delete") {
          delete accountJSON.payment_processor_config.debit_card.repay_config.repay_card_number;
        }
      }
      if ("repay_exp_date" in updateData) {
        accountJSON.payment_processor_config.debit_card.repay_config.repay_exp_date = updateData.repay_exp_date;
        if (updateData.repay_exp_date === "delete") {
          delete accountJSON.payment_processor_config.debit_card.repay_config.repay_exp_date;
        }
      }
      if ("repay_name_on_card" in updateData) {
        accountJSON.payment_processor_config.debit_card.repay_config.repay_name_on_card = updateData.repay_name_on_card;
        if (updateData.repay_name_on_card === "delete") {
          delete accountJSON.payment_processor_config.debit_card.repay_config.repay_name_on_card;
        }
      }
      if ("repay_street" in updateData) {
        accountJSON.payment_processor_config.debit_card.repay_config.repay_street = updateData.repay_street;
        if (updateData.repay_street === "delete") {
          delete accountJSON.payment_processor_config.debit_card.repay_config.repay_street;
        }
      }
      if ("repay_zip" in updateData) {
        accountJSON.payment_processor_config.debit_card.repay_config.repay_zip = updateData.repay_zip;
        if (updateData.repay_zip === "delete") {
          delete accountJSON.payment_processor_config.debit_card.repay_config.repay_zip;
        }
      }
      if ("modern_treasury_name" in updateData) {
        accountJSON.payment_processor_config.ach.modern_treasury_config.name = updateData.modern_treasury_name;
        if (updateData.modern_treasury_name === "delete") {
          delete accountJSON.payment_processor_config.ach.modern_treasury_config.name;
        }
      }
      if ("plaid_processor_token" in updateData) {
        accountJSON.payment_processor_config.ach.modern_treasury_config.plaid_processor_token =
          updateData.plaid_processor_token;
        if (updateData.plaid_processor_token === "delete") {
          delete accountJSON.payment_processor_config.ach.modern_treasury_config.plaid_processor_token;
        }
      }
      if ("dwolla_plaid_token" in updateData) {
        accountJSON.payment_processor_config.ach.dwolla_config.dwolla_plaid_token = updateData.dwolla_plaid_token;
        if (updateData.dwolla_plaid_token === "delete") {
          delete accountJSON.payment_processor_config.ach.dwolla_config.dwolla_plaid_token;
        }
      }
      if ("credit_card_number" in updateData) {
        accountJSON.payment_processor_config.credit_card.checkout_config.card_number = updateData.credit_card_number;
        if (updateData.credit_card_number === "delete") {
          delete accountJSON.payment_processor_config.credit_card.checkout_config.card_number;
        }
      }
      if ("expiry_month" in updateData) {
        accountJSON.payment_processor_config.credit_card.checkout_config.expiry_month = updateData.expiry_month;
        if (updateData.expiry_month === "delete") {
          delete accountJSON.payment_processor_config.credit_card.checkout_config.expiry_month;
        }
      }
      if ("expiry_year" in updateData) {
        accountJSON.payment_processor_config.credit_card.checkout_config.expiry_year = updateData.expiry_year;
        if (updateData.expiry_year === "delete") {
          delete accountJSON.payment_processor_config.credit_card.checkout_config.expiry_year;
        }
      }
      if ("cvv" in updateData) {
        accountJSON.payment_processor_config.credit_card.checkout_config.cvv = updateData.cvv;
        if (updateData.cvv === "delete") {
          delete accountJSON.payment_processor_config.credit_card.checkout_config.cvv;
        }
      }

      if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
        accountJSON.account_id = "autoTest_acct_".concat(uuid());
      }
      cy.log(JSON.stringify(accountJSON));
      this.createAccount(accountJSON).then((response) => {
        //if account update data contains doNot_check_response_status field
        //then not check the response status
        //this condition is for delete fields from account payload
        if ("doNot_check_response_status" in updateData === false) {
          expect(response.status).to.eq(200);
        }
        return response;
      });
    });
  }

  verifyBusinessCustomerDetailsInAccount(customerExpectedJSON, accountResponse, customerID) {
    const expCustomerID = accountResponse.body.customers[0].customer_id;
    expect(expCustomerID.toString(), "check business Customer ID is displayed").to.eq(customerID.toString());

    const actBusinessLegalName = accountResponse.body.customers[0].business_details.business_legal_name;
    const expBusinessLegalName = customerExpectedJSON.business_details.business_legal_name;
    expect(actBusinessLegalName, "check customer business legal name").to.eq(expBusinessLegalName);

    const actDoingBusinessAs = accountResponse.body.customers[0].business_details.doing_business_as;
    const expDoingBusinessAs = customerExpectedJSON.business_details.doing_business_as;
    expect(actDoingBusinessAs, "check customer Do business as").to.eq(expDoingBusinessAs);

    const actBusinessEin = accountResponse.body.customers[0].business_details.business_ein;
    const expBusinessEin = customerExpectedJSON.business_details.business_ein;
    expect(actBusinessEin, "check customer Business Ein").to.eq(expBusinessEin);
  }

}

export const accountAPI = new Account();

export interface AccountPayload {
  effective_at?: string;
  product_id?: number;
  customer_id?: number;
  credit_limit_cents?: number;
  credit_limit_cents_str?: string;
  max_approved_credit_limit_cents?: number;
  cycle_interval?: number;
  cycle_interval_del?: string;
  cycle_due_interval?: string;
  cycle_due_interval_del?: string;
  first_cycle_interval?: string;
  first_cycle_interval_del?: string;
  post_promo_len?: number;
  late_fee_cents?: number;
  late_fee_cents_str?: string;
  late_fee_grace?: string;
  payment_reversal_fee_cents?: number;
  initial_principal_cents?: number;
  origination_fee_cents?: number;
  monthly_fee_cents?: number;
  annual_fee_cents?: number;
  promo_impl_interest_rate_percent?: number;
  post_promo_impl_interest_rate_percent?: number;
  post_promo_impl_am_len?: number;
  promo_len?: number;
  promo_min_pay_type?: string;
  promo_purchase_window_len?: number;
  promo_min_pay_percent?: number;
  promo_interest_deferred?: string;
  loan_discount_cents?: string;
  loan_discount_at?: string;
  autopay_enabled?: boolean;
  default_payment_processor_method?: string;
  delete_field_name?: string;
  customer_account_role?: string;
  second_customer_id?: string;
  second_customer_account_role?: string;
  third_customer_id?: string;
  third_customer_account_role?: string;
  fourth_customer_id?: string;
  fourth_customer_account_role?: string;
  fifth_customer_id?: string;
  fifth_customer_account_role?: string;
  late_fee_cap_percent?: number;
  doNot_check_response_status?: boolean;
  plaid_access_token?: string;
  plaid_account_id?: string;
  check_balance_enabled?: boolean;
  payment_processor_name?: string;
  repay_account_type?: string;
  repay_check_type?: string;
  repay_transit_number?: string;
  repay_account_number?: string;
  repay_name_on_check?: string;
  repay_card_number?: string;
  repay_exp_date?: string;
  repay_name_on_card?: string;
  repay_zip?: string;
  repay_street?: string;
  modern_treasury_name?: string;
  plaid_processor_token?: string;
  dwolla_plaid_token?: string;
  credit_card_number?: string;
  expiry_month?: string;
  expiry_year?: string;
  cvv?: string;
  merchant_name?: string;
  lender_name?: string;
  state?: string;
  type?: string;
  memo?: string;
  spend_limit?: string;
  statement_min_pay_charges_principal_cents?: string;
  statement_min_pay_interest_cents?: string;
  statement_min_pay_am_interest_cents?: string;
  statement_min_pay_deferred_cents?: string;
  statement_min_pay_am_deferred_interest_cents?: string;
  statement_min_pay_fees_cents?: string;
  previous_statement_min_pay_cents?: string;
}
