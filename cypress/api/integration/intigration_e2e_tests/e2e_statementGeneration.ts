import { Product } from "../../api_support/product";
import { Account } from "../../api_support/account";
import { Payment } from "../../api_support/payment";
import { Auth } from "../../api_support/auth";
import { JSONUpdater } from "../../api_support/jsonUpdater";
import { Customer } from "../../api_support/customer";
import { Rolltime } from "../../api_support/rollTime";
import { Statements } from "../../api_support/statements";
import { Charge } from "../../api_support/charge";
import { Constants } from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";
// import { resolveSoa } from 'dns';

TestFilters(["smoke", "regression", "e2e"], () => {
  describe("e2e test", () => {
    let accountID;
    let productID;
    let customerID;
    let effective_at;
    let interestRate = 0;
    let total_balance = 0;
    let paymentAmt = 0;
    // const origination_fees=0;
    const charge = new Charge();
    const product = new Product();
    const statements = new Statements();
    const account = new Account();
    const customer = new Customer();
    const rollTime = new Rolltime();
    const jsonUpdater = new JSONUpdater();
    const payment = new Payment();
    const testCaseID = "e2e_";

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
          Cypress.env("customerID", customerID);
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should be able to create a new product", () => {
      cy.fixture(Constants.templateFixtureFilePath.concat("/product/product.json")).then((productjson) => {
        product.createProduct(productjson).then((response) => {
          expect(response.status).to.eq(200);
          productID = response.body.product_id;
          cy.log("new product created : " + productID);
          cy.log("cycle_length : " + response.body.product_lifecycle_policies.billing_cycle_policies.cycle_interval);
          Cypress.env("product_id", productID);
        });
      });
    });

    it("should be able to create a new customer", () => {
      cy.fixture(Constants.templateFixtureFilePath.concat("/customer/create_customer.json")).then((customerJSON) => {
        customer.createCustomer(customerJSON).then((response) => {
          customerID = response.body.customer_id;
          cy.log("new customer created : " + customerID);
          Cypress.env("customerID", customerID);
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should be able to cerate a new acct", () => {
      const accountFileName = "/create_account".concat(testCaseID, ".json");
      const accountModifyJSON = Constants.tempResourceFilePath.concat(accountFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/account/account.json"),
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
          Cypress.env("accountID", accountID);
          cy.log("new account created : " + accountID);
          cy.log("monthly fees: " + response.body.account_product.product_lifecycle.monthly_fee_impl_cents);
          Cypress.env("monthly_fees", response.body.account_product.product_lifecycle.monthly_fee_impl_cents);
          cy.log("origination fees: " + response.body.account_product.product_lifecycle.origination_fee_impl_cents);
          Cypress.env("origination_fees", response.body.account_product.product_lifecycle.origination_fee_impl_cents);
          total_balance = response.body.summary.total_balance_cents;
          interestRate = response.body.account_product.promo_overview.promo_impl_interest_rate_percent;
          cy.log("interest: " + interestRate);
          cy.log("balance : " + total_balance);
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should be able to create a charge", () => {
      const chargeCreated = Math.trunc(Math.random() * 9000 + 1000);
      cy.log("charge created : " + chargeCreated);
      const chargeFileName = "/create_charge_".concat(testCaseID, ".json");
      const chargeModifyJSON = Constants.tempResourceFilePath.concat(chargeFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/charge/charge.json"),
        chargeModifyJSON,
        "original_amount_cents",
        chargeCreated
      );
      cy.fixture(Constants.tempFixtureFilePath.concat(chargeFileName)).then((chargejson) => {
        charge.createCharge(chargejson, accountID).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.line_item_summary.balance_cents).to.eq(chargeCreated);
          Cypress.env("chargeCreated", chargeCreated);
        });
      });
    });

    it("should be able to verify charge is posted", () => {
      account.getAccountById(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.summary.total_balance_cents).to.eq(
          Cypress.env("chargeCreated") + Cypress.env("origination_fees")
        );
      });
    });

    it("should be able to post a new payment", () => {
      paymentAmt = Math.floor(Math.random() * 500);
      cy.log("making payment for : " + paymentAmt);
      const paymentFileName = "/create_payment_".concat(testCaseID, ".json");
      const paymentModifyJSON = Constants.tempResourceFilePath.concat(paymentFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/payment/create_payment.json"),
        paymentModifyJSON,
        "original_amount_cents",
        paymentAmt
      );
      cy.fixture(Constants.tempFixtureFilePath.concat(paymentFileName)).then((createpaymentjson) => {
        payment.createPayment(createpaymentjson, accountID).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

    it("should be able to verify payment is posted", () => {
      account.getAccountById(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.summary.total_balance_cents).to.eq(
          Cypress.env("chargeCreated") + Cypress.env("origination_fees") - paymentAmt
        );
      });
    });

    // it ('should be able to get account amortization schedule', () => {
    //   account.getAmortizationSchedule(accountID).then((response) => {
    //     expect(response.status).to.eq(200)
    //   })
    // });

    it("should be able to patch time forward to generate monthly fees", () => {
      const datesToMove = 15;
      const endDate = new Date(effective_at);
      endDate.setDate(endDate.getDate() + datesToMove);
      const exclusive_end = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusive_end);
      cy.log("start: " + effective_at);

      rollTime.rollAccountForward(accountID, exclusive_end).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    xit("should be able to verify monthly fees are added", () => {
      account.getAccountById(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.summary.total_balance_cents).to.eq(
          Cypress.env("chargeCreated") + Cypress.env("origination_fees") - paymentAmt + Cypress.env("monthly_fees")
        );
      });
    });

    it("should be able to patch time forward to generate statements", () => {
      const datesToMove = 27;
      const endDate = new Date(effective_at);
      endDate.setDate(endDate.getDate() + datesToMove);
      const exclusive_end = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusive_end);
      cy.log("start: " + effective_at);

      rollTime.rollAccountForward(accountID, exclusive_end).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("should be able to see new statement at end of the month", () => {
      statements.getStatementByAccount(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(1);
        expect(response.body[0].account_id).to.eq(accountID);
        Cypress.env("statement_id", response.body[0].statement_id);
      });
    });

    it("should be able to get statement by statement Id", () => {
      statements.getStatementByStmtId(accountID, Cypress.env("statement_id")).then((response) => {
        expect(response.status).to.eq(200);
        Cypress.env("interest_cents", response.body.balance_summary.interest_balance_cents);
      });
    });

    // it ('should be able to get account by accountId after patch ', () => {
    //   account.getAccountById(accountID).then((response) => {
    //     console.log('currentTotal : ' + total_balance)
    //     const tenthPayment = total_balance/10;
    //     const interest_cents = (tenthPayment * interestRate) / 100
    //     console.log('interest _cent ' + interest_cents)
    //     const currentDue  =  tenthPayment + (interest_cents/10) - paymentAmt + Cypress.env('chargeCreated') + Cypress.env('monthly_fees')
    //     expect(response.body.min_pay_due_cents.statement_min_pay_cents).to.eq(parseInt(currentDue.toFixed()))
    //     expect(response.status).to.eq(200)
    //   })
    // });

    it("should be able to patch time forward to generate more statements", () => {
      const datesToMove = 61;
      const endDate = new Date(effective_at);
      endDate.setDate(endDate.getDate() + datesToMove);
      const exclusive_end = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusive_end);
      cy.log("start: " + effective_at);

      rollTime.rollAccountForward(accountID, exclusive_end).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("should be able to see new statements for 2 months", () => {
      statements.getStatementByAccount(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(2);
        expect(response.body[0].account_id).to.eq(accountID);
      });
    });
  });
});
