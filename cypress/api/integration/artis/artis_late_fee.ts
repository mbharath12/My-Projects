/* eslint-disable no-var */

import { Product } from "../../api_support/product";
import { Account } from "../../api_support/account";
import { Payment } from "../../api_support/payment";
import { Auth } from "../../api_support/auth";
import { JSONUpdater } from "../../api_support/jsonUpdater";
import { Customer } from "../../api_support/customer";
import { Rolltime } from "../../api_support/rollTime";
import { Charge } from "../../api_support/charge";
import { LineItems } from "../../api_support/lineItems";
import { Constants } from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";

TestFilters(["artis","lateFee","regression"], () => {
  describe("Verification for late fees", () => {
    const charge = new Charge();
    const product = new Product();
    const account = new Account();
    const customer = new Customer();
    const rollTime = new Rolltime();
    const jsonUpdater = new JSONUpdater();
    const payment = new Payment();
    const lineItems = new LineItems();

    let accountID;
    let productID;
    let customerID;
    let effectiveAt;
    let interestRate = 0;
    let totalBalance = 0;
    let paymentAmt = 0;
    let paymentLineItem;
    const testCaseID = "artis_late_fee_";

    // Because this data is available in QA DB and currently we are running this
    // code in RC its failing

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });

      const accountFileName = "/create_account_".concat(testCaseID, ".json");
      const accountModifyJSON = Constants.tempResourceFilePath.concat(accountFileName);
      cy.fixture(Constants.templateFixtureFilePath.concat("/product/artis_product.json")).then((productjson) => {
        product.createProduct(productjson).then((response) => {
          expect(response.status).to.eq(200);
          productID = response.body.product_id;
          cy.log("new product created : " + productID);
          cy.log("cycle_length : " + response.body.product_lifecycle_policies.billing_cycle_policies.cycle_interval);
          Cypress.env("product_id", productID);
          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/account/artis_account.json"),
            accountModifyJSON,
            "product_id",
            productID
          );
          // jsonUpdater.updateJSON('cypress/fixtures/account/createAccount.json','cypress/fixtures/account/createAccount.json','customer_account_external_id',customerID)
          // jsonUpdater.updateJSON('cypress/fixtures/account/createAccount.json','cypress/fixtures/account/createAccount.json','customer_id',customerID)

          cy.fixture(Constants.tempFixtureFilePath.concat(accountFileName)).then((accountjson) => {
            account.createAccount(accountjson).then((response) => {
              accountID = response.body.account_id;
              effectiveAt = response.body.effective_at;
              cy.log("effectiveAt:" + effectiveAt);
              Cypress.env("accountID", accountID);
              cy.log("new account created : " + accountID);
              Cypress.env("principal_cents", response.body.summary.principal_cents);
              cy.log("monthly fees: " + response.body.account_product.product_lifecycle.monthly_fee_impl_cents);
              Cypress.env("monthly_fees", response.body.account_product.product_lifecycle.monthly_fee_impl_cents);
              cy.log("origination fees: " + response.body.account_product.product_lifecycle.origination_fee_impl_cents);
              Cypress.env(
                "origination_fees",
                response.body.account_product.product_lifecycle.origination_fee_impl_cents
              );
              totalBalance = response.body.summary.totalBalance_cents;
              interestRate = response.body.account_product.promo_overview.promo_impl_interest_rate_percent;
              cy.log("interest: " + interestRate);
              cy.log("balance : " + totalBalance);
              expect(response.status).to.eq(200);
            });
          });
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

    it("should be able to create a charge", () => {
      const chargeFileName = "/create_charge_".concat(testCaseID, ".json");
      const chargeModifyJSON = Constants.tempResourceFilePath.concat(chargeFileName);
      const chargeCreated = Math.trunc(Math.random() * 9000 + 1000);
      cy.log("charge created : " + chargeCreated);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/charge/charge.json"),
        chargeModifyJSON,
        "original_amount_cents",
        chargeCreated
      );
      cy.fixture(Constants.tempFixtureFilePath.concat(chargeFileName)).then((chargejson) => {
        charge.createCharge(chargejson, accountID).then((response) => {
          expect(response.status).to.eq(200);
          Cypress.env("chargeCreated", chargeCreated);
        });
      });
    });

    it("should be able to verify charge is posted", () => {
      account.getAccountById(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.summary.total_balance_cents).to.eq(
          Cypress.env("chargeCreated") + Cypress.env("origination_fees") + Cypress.env("principal_cents")
        );
      });
    });

    it("should be able to post a new payment", () => {
      paymentAmt = Math.floor(Math.random() * 500);
      cy.log("making payment for : " + paymentAmt);
      const datesToMove = 10;
      const endDate = new Date(effectiveAt);
      endDate.setDate(endDate.getDate() + datesToMove);

      const paymentFileName = "/create_payment_".concat(testCaseID, ".json");
      const paymentModifyJSON = Constants.tempResourceFilePath.concat(paymentFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/payment/create_payment.json"),
        paymentModifyJSON,
        "original_amount_cents",
        paymentAmt
      );
      jsonUpdater.updateJSON(
        paymentModifyJSON,
        paymentModifyJSON,
        "effectiveAt",
        endDate.toISOString().slice(0, 10) + "T04:11:28-05:00"
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
      });
    });

    it("should be able to find payment related lineitems", () => {
      lineItems.allLineitems(accountID).then((response) => {
        expect(response.status).to.eq(200);
        response.body.results.forEach(function (row) {
          if (row.line_item_overview.line_item_type == "PAYMENT") {
            paymentLineItem = row.line_item_id;
            cy.log("paymentID: " + paymentLineItem);
          }
        });
      });
    });

    it("should be able to reverse a payment", () => {
      payment.reversePayment(accountID, paymentLineItem).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("should be able to patch time forward to generate monthly fees", () => {
      const datesToMove = 1;
      const endDate = new Date(effectiveAt);
      endDate.setDate(endDate.getDate() + datesToMove);
      const exclusiveEnd = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusiveEnd);
      cy.log("start: " + effectiveAt);

      rollTime.rollAccountForward(accountID, exclusiveEnd).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("should be able to payment reversal line item", () => {
      lineItems.allLineitems(accountID).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it("should be able to patch time forward to generate late fees", () => {
      const datesToMove = 32;
      const endDate = new Date(effectiveAt);
      endDate.setDate(endDate.getDate() + datesToMove);
      const exclusiveEnd = endDate.toISOString().slice(0, 10);
      cy.log("end Date: " + exclusiveEnd);
      cy.log("start: " + effectiveAt);

      rollTime.rollAccountForward(accountID, exclusiveEnd).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    xit("should be able to see late fees on account", () => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(60000);
      lineItems.allLineitems(accountID).then((response) => {
        expect(response.status).to.eq(200);
        const data = response.body.results;
        let flag = "notFound";
        for (let j = 0; j < data.length; j++) {
          if (response.body.results[j].line_item_overview.line_item_type == "LATE_FEE") {
            flag = "found";
            break;
          }
        }
        expect(flag).to.eq("found");
      });
    });
  });
});
