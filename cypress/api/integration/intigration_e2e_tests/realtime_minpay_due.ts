import { Product } from "../../api_support/product";
import { Account } from "../../api_support/account";
import { Payment } from "../../api_support/payment";
import { Auth } from "../../api_support/auth";
import { JSONUpdater } from "../../api_support/jsonUpdater";
import { Customer } from "../../api_support/customer";
import { Rolltime } from "../../api_support/rollTime";
import { Statements } from "../../api_support/statements";
import { Constants } from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";

TestFilters(["regression", "minPay" ,"realTime"], () => {
  describe("min pay tests", () => {
    let accountID;
    let productID;
    let customerID;
    let effective_at;
    let interestRate = 0;
    let total_balance = 0;
    let paymentAmt = 0;
    const product = new Product();
    const statements = new Statements();
    const account = new Account();
    const customer = new Customer();
    const rollTime = new Rolltime();
    const jsonUpdater = new JSONUpdater();
    const payment = new Payment();
    const testCaseID = "realtime_minpay_due_";

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });

      cy.fixture(Constants.templateFixtureFilePath.concat("/product/min_pay_product.json")).then((productjson) => {
        product.createProduct(productjson).then((response) => {
          expect(response.status).to.eq(200);
          productID = response.body.product_id;
          cy.log("new product created : " + productID);
          cy.log("cycle_length : " + response.body.product_lifecycle_policies.billing_cycle_policies.cycle_interval);
          Cypress.env("product_id", productID);
        });
      });

      cy.fixture(Constants.templateFixtureFilePath.concat("/customer/create_customer.json")).then((customerJSON) => {
        customer.createCustomer(customerJSON).then((response) => {
          customerID = response.body.customer_id;
          cy.log("new customer created : " + customerID);
          Cypress.env("customerID: ", customerID);
          expect(response.status).to.eq(200);
        });
      });
    });

    xit("should be able to cerate a new acct", () => {
      const accountFileName = "/create_account_".concat(testCaseID, ".json");
      const accountModifyJSON = Constants.tempResourceFilePath.concat(accountFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/account/create_account_set_payment_processor.json"),
        accountModifyJSON,
        "product_id",
        productID
      );
      jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "customer_account_external_id", customerID);
      jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "customer_id", customerID);

      cy.fixture(Constants.tempFixtureFilePath.concat(accountFileName)).then((accountjson) => {
        account.createAccount(accountjson).then((response) => {
          accountID = response.body.account_id;
          effective_at = response.body.effective_at;
          Cypress.env("accountID: ", accountID);
          cy.log("new account created : " + accountID);
          total_balance = response.body.summary.total_balance_cents;
          interestRate = response.body.account_product.promo_overview.promo_impl_interest_rate_percent;
          cy.log("interest: " + interestRate);
          cy.log("balance : " + total_balance);
          expect(response.status).to.eq(200);
        });
      });
    });

    xit("should be able to post a new payment", () => {
      //requires as not doing it, generates 422 status code even for diff accts
      paymentAmt = Math.floor(Math.random() * 500);
      cy.log("making payment for : " + paymentAmt);
      jsonUpdater.updateJSON(
        "cypress/fixtures/payment/create_payment.json",
        "cypress/fixtures/payment/create_payment.json",
        "original_amount_cents",
        paymentAmt
      );
      cy.fixture("payment/create_payment.json").then((createpaymentjson) => {
        payment.createPayment(createpaymentjson, accountID).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    xit("should be able to get account by accountId", () => {
      account.getAccountById(accountID).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    xit("should be able to get account amortization schedule", () => {
      account.getAmortizationSchedule(accountID).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    xit("should be able to patch time forward", () => {
      const datesToMove = 11;
      const endDate = new Date(effective_at);
      endDate.setDate(endDate.getDate() + datesToMove);
      const exclusive_end = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusive_end);
      cy.log("start: " + effective_at);

      rollTime.rollAccountForward(accountID, exclusive_end).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    xit("should be able to get account by accountId after patch ", () => {
      account.getAccountById(accountID).then((response) => {
        const tenthPayment = total_balance / 10;
        const interest_cents = (tenthPayment * interestRate) / 100;
        const currentDue = tenthPayment + interest_cents / 10 - paymentAmt;
        expect(response.body.min_pay_due_cents.statement_min_pay_cents).to.eq(parseInt(currentDue.toFixed()));
        expect(response.status).to.eq(200);
      });
    });

    xit("should be able to get statement by account id", () => {
      statements.getStatementByAccount(accountID).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
