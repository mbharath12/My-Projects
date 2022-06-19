import { Account } from "../../../api_support/account";
import { Customer } from "../../../api_support/customer";
import { Product } from "../../../api_support/product";
import { Payment } from "../../../api_support/payment";
import { Rolltime } from "../../../api_support/rollTime";
import { Auth } from "../../../api_support/auth";
import { JSONUpdater } from "../../../api_support/jsonUpdater";
import { DateHelper } from "../../../api_support/date_helpers";
import { LineItems } from "../../../api_support/lineItems";
import { LineItem, LineItemValidator } from "cypress/api/api_validation/line_item_validator";
import { Statements } from "cypress/api/api_support/statements";
import { StatementBalanceSummary, StatementValidator } from "../../../api_validation/statements_validator";
import chargeProcessingJSON from "cypress/resources/testdata/payment/charge_payment.json";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//PP1034-Full payment on Charge card within the due date
//PP1035-Full payment on Charge card after the due date before the Grace date expiry
//PP1036-Full payment on Charge card after the Grace date expiry
//PP1037-Part Payment on Charge Cards
//PP1038-Part Payment on Charge Cards- multiple payments totalling to total outstanding within the due date
//PP1040-Late fees in charge card for delayed part payment after grace period

TestFilters(["regression", "systemOfRecords", "chargeCards", "payments"], () => {
  describe("payment using charge card", function () {
    let accountID;
    let productID;
    let customerID;
    let accEffectiveAt;
    let effectiveDt;

    const product = new Product();
    const account = new Account();
    const customer = new Customer();
    const dateHelper = new DateHelper();
    const payment = new Payment();
    const lineItems = new LineItems();
    const lineItemValidator = new LineItemValidator();
    const statements = new Statements();
    const statementValidator = new StatementValidator();
    const rollTime = new Rolltime();
    const jsonUpdater = new JSONUpdater();
    const testCaseID = "charge_payment_";

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });

      //Create a customer
      cy.fixture(Constants.templateFixtureFilePath.concat("/customer/create_customer.json")).then((customerJSON) => {
        customer.createCustomer(customerJSON).then((response) => {
          customerID = response.body.customer_id;
          Cypress.env("customer_id", customerID);
          expect(response.status).to.eq(200);
        });
      });
    });

    chargeProcessingJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, () => {
        //Create a charge product - with delinquent and charge-off
        const productFileName = "/create_product_".concat(testCaseID, data.index, ".json");
        const productModifyJSON = Constants.tempResourceFilePath.concat(productFileName);

        jsonUpdater.updateJSON(
          Constants.templateResourceFilePath.concat("/product/product_charge.json"),
          productModifyJSON,
          "delinquent_on_n_consecutive_late_fees",
          data.delinquent
        );
        jsonUpdater.updateJSON(
          productModifyJSON,
          productModifyJSON,
          "charge_off_on_n_consecutive_late_fees",
          data.charge_off
        );

        const productJSONFile = Constants.tempFixtureFilePath.concat(productFileName);
        cy.fixture(productJSONFile).then((productJson) => {
          product.createProduct(productJson).then((response) => {
            expect(response.status).to.eq(200);
            productID = response.body.product_id;
            cy.log("charge product created : " + productID);
          });
        });
      });

      it(`should have create account and assign product and customer - '${data.tc_name}'`, () => {
        //create account JSON in temp folder
        const accountFileName = "/create_account_".concat(testCaseID, data.index, ".json");
        const accountModifyJSON = Constants.tempResourceFilePath.concat(accountFileName);

        //Update product, customer,initial principal cents,late fee cents and account effective date in account JSON file
        jsonUpdater.updateJSON(
          Constants.templateResourceFilePath.concat("/account/account_only_promo.json"),
          accountModifyJSON,
          "product_id",
          productID
        );
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "customer_id", customerID);
        const days = parseInt(data.account_effective_dt);
        effectiveDt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "effective_at", effectiveDt);
        jsonUpdater.updateJSON(
          accountModifyJSON,
          accountModifyJSON,
          "initial_principal_cents",
          parseInt(data.initial_principal_cents)
        );
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "late_fee_cents", parseInt(data.late_fee_cents));

        //create an account and assign to customer
        const accountJSONFile = Constants.tempFixtureFilePath.concat(accountFileName);
        cy.fixture(accountJSONFile).then((accountJSON) => {
          account.createAccount(accountJSON).then((response) => {
            accountID = response.body.account_id;
            cy.log("new account created : " + accountID);
            expect(response.status).to.eq(200);
            accEffectiveAt = response.body.effective_at;
            cy.log("account effective date:" + accEffectiveAt);
          });
        });
      });

      it(`should have create a payment - '${data.tc_name}''`, () => {
        //Update payment amount and payment effective dt
        const paymentFileName = "/create_payment_".concat(testCaseID, data.index, "_1_", ".json");
        const paymentModifyJSON = Constants.tempResourceFilePath.concat(paymentFileName);
        const paymentAmt = data.payment_amt_cents_1;
        jsonUpdater.updateJSON(
          Constants.templateResourceFilePath.concat("/payment/payment.json"),
          paymentModifyJSON,
          "original_amount_cents",
          paymentAmt
        );
        const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment1_effective_dt), 0);
        jsonUpdater.updateJSON(paymentModifyJSON, paymentModifyJSON, "effective_at", paymentEffectiveDt);

        //Create a Payment
        const paymentJSON = Constants.tempFixtureFilePath.concat(paymentFileName);
        cy.fixture(paymentJSON).then((createPaymentJson) => {
          payment.createPayment(createPaymentJson, accountID).then((response) => {
            expect(response.status, "payment response status").to.eq(200);
            //Pay the full/partial amount
            expect(response.body.line_item_summary.principal_cents, "repayment amount in payment response").to.eq(
              createPaymentJson.original_amount_cents * -1
            );
          });
        });
      });

      it(`should have validate PAYMENT existence and PAYMENT amount in the
    Line Items - '${data.tc_name}''`, () => {
        lineItems.allLineitems(accountID).then(async (response) => {
          expect(response.status).to.eq(200);
          type payLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const paymentLineItem: payLineItem = {
            status: "VALID",
            type: "PAYMENT",
            original_amount_cents: parseInt(data.payment_amt_cents_1) * -1,
          };
          lineItemValidator.validateLineItem(response, paymentLineItem);
        });
      });

      if (data.multi_payment_check.toLowerCase() === "true") {
        it(`should have create multiple part payments - '${data.tc_name}''`, () => {
          //Update payment amount and payment effective dt
          const paymentFileName = "/create_payment_".concat(testCaseID, data.index, "_2_", ".json");
          const paymentModifyJSON = Constants.tempResourceFilePath.concat(paymentFileName);
          const paymentAmt2 = data.payment_amt_cents_2;
          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/payment/payment.json"),
            paymentModifyJSON,
            "original_amount_cents",
            paymentAmt2
          );

          const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment2_effective_dt), 0);
          jsonUpdater.updateJSON(paymentModifyJSON, paymentModifyJSON, "effective_at", paymentEffectiveDt);

          //Create a Payment
          const paymentJSON = Constants.tempFixtureFilePath.concat(paymentFileName);
          cy.fixture(paymentJSON).then((createPaymentJson) => {
            payment.createPayment(createPaymentJson, accountID).then((response) => {
              expect(response.status, "payment response status").to.eq(200);
              //Pay the full/partial amount
              expect(response.body.line_item_summary.principal_cents, "repayment amount in payment response").to.eq(
                createPaymentJson.original_amount_cents * -1
              );
            });
          });
        });

        it(`should have validate Validate the  PAYMENT existence and PAYMENT amount in the
      Line Items - '${data.tc_name}''`, () => {
          lineItems.allLineitems(accountID).then(async (response) => {
            expect(response.status).to.eq(200);
            type payLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const paymentLineItem: payLineItem = {
              status: "VALID",
              type: "PAYMENT",
              original_amount_cents: parseInt(data.payment_amt_cents_2) * -1,
            };
            lineItemValidator.validateLineItem(response, paymentLineItem);
          });
        });
      }

      //For Charge Card there shouldnot be late_fee coming up. Canopy Team is yet to confirm.Hence blocked for now
      xit(`should have validate late fee - '${data.tc_name}''`, () => {
        // Validate the  Valid Late_fee existence and throws error when LATE_FEE
        // Line Item exist for a charge card
        lineItems.allLineitems(accountID).then(async (response) => {
          expect(response.status).to.eq(200);

          if (data.line_item_check.toLowerCase() === "true") {
            type lateFeeLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const lateFeeLineItem: lateFeeLineItem = {
              status: "VALID",
              type: "LATE_FEE",
              original_amount_cents: parseInt(data.late_fee_cents),
            };
            lineItemValidator.validateLineItem(response, lateFeeLineItem);
          } else {
            //Late_Fee should not come for Charge Product when full payment is done on time.
            const bLineItemExist = lineItemValidator.checkLineItem(response, "LATE_FEE");
            expect(false, "check LATE_FEE line item is not displayed").to.eq(bLineItemExist);
          }
        });
      });
      //Calling roll time forward to make sure balance summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, () => {
        //Roll time forward to generate  balance summary details
        const endDate = dateHelper.getRollDate(10);
        rollTime.rollAccountForward(accountID, endDate).then((response) => {
          expect(response.status).to.eq(200);
        });
      });

      it(`should have validate account status for - '${data.tc_name}'`, () => {
        //Validate the account status
        account.getAccountById(accountID).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.account_overview.account_status).to.eq(data.account_status);
        });
      });

      it(`should have to validate statement balance for latest cycle - '${data.tc_name}'`, () => {
        statements.getStatementByAccount(accountID).then((response) => {
          expect(response.status).to.eq(200);
          const cycleStatementID = statementValidator.getStatementIDByNumber(response, data.stmt_id);
          //Get statement details for given statement id
          statements.getStatementByStmtId(accountID, cycleStatementID).then((response) => {
            //Check available_credit_cents is displayed in the statement
            expect(response.status).to.eq(200);
            expect(response.body.open_to_buy.available_credit_cents, "Available Credit Balance is displayed").to.eq(
              parseInt(data.available_credit_cents)
            );
            type StmtBalanceSummaryPick = Pick<
              StatementBalanceSummary,
              "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
            >;
            // Validate Loan Principal,fee balance ,total balance and charge principal are as expected
            const balanceSummary: StmtBalanceSummaryPick = {
              charges_principal_cents: parseInt(data.stmt_charges_principal_cents),
              loans_principal_cents: parseInt(data.stmt_loans_principal_cents),
              fees_balance_cents: parseInt(data.stmt_fees_balance_cents),
              total_balance_cents: parseInt(data.stmt_total_balance_cents),
            };
            statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, data.stmt_id, balanceSummary);
          });
        });
      });
    });
  });
});
