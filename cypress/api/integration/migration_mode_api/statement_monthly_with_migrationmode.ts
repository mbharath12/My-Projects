/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-async-tests */
import {Account} from "../../api_support/account";
import {Customer} from "../../api_support/customer";
import {Product} from "../../api_support/product";
import {Auth} from "../../api_support/auth";
import {Payment} from "../../api_support/payment";
import {JSONUpdater} from "../../api_support/jsonUpdater";
import {DateHelper} from "cypress/api/api_support/date_helpers";
import {Rolltime} from "cypress/api/api_support/rollTime";
import {Statements} from "cypress/api/api_support/statements";
import {StatementValidator} from "cypress/api/api_validation/statements_validator";
import {LineItems} from "cypress/api/api_support/lineItems";
import {LineItem, LineItemValidator} from "cypress/api/api_validation/line_item_validator";
import statementJSON from "cypress/resources/testdata/statement/statement_monthly_fee.json";
import {Constants} from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";
import {Migrationmode} from "../../api_support/migrationmode";
import {Events} from "../../api_support/events";
import promisify from "cypress-promise";

// Test failure reason https://linear.app/canopy-inc/issue/CAN-355/bug-migration-mode-api-after-turning-it-off-also-events-are-not-being

//Test Scripts
// 11 tests
//MM478 Statement with - no origination fees - charge - monthly fees - no payment
//MM479 Statement with - no origination fees - charge - monthly fees - monthly fees only payment
//MM480 Statement with - no origination fees - charge - monthly fees - charge only payment
//MM481 Statement with - no origination fees - charge - monthly fees - monthly fees and charge payment
//MM482 Statement with - no origination fees - charge - monthly fees - monthly fees and partial payment
//MM483 Statement with - origination fees - charge - monthly fees - no payment
//MM484 Statement with - origination fees - charge - monthly fees - monthly fees only payment
//MM485 Statement with - origination fees - charge - monthly fees - charge only payment
//MM486 Statement with - origination fees - charge - monthly fees - monthly fees and charge payment
//MM487 Statement with - origination fees - charge - monthly fees - all payments
//MM488 Statement with- origination fees - charge - monthly fees - pay fees and partial principal pay

// Statement verifications with monthly cycle with origination fee, charges,
// payments and monthly fee with migration mode API
TestFilters(["regression", "Migrationmode"], () => {
  describe("Statement verifications with monthly cycle using migration mode API", function () {
    let accountID;
    let productID;
    let customerID;
    let effectiveDate;

    const product = new Product();
    const account = new Account();
    const customer = new Customer();
    const payment = new Payment();
    const dateHelper = new DateHelper();
    const jsonUpdater = new JSONUpdater();
    const rollTime = new Rolltime();
    const statement = new Statements();
    const statementValidator = new StatementValidator();
    const lineItems = new LineItems();
    const lineItemValidator = new LineItemValidator();
    const testCaseID = "stmt_monthly_";
    const migrationmode = new Migrationmode();
    const events = new Events();

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });

      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval in creditProduct json file
      const productFileName = "/create_product_".concat(testCaseID, ".json");
      const productModifyJSON = Constants.tempResourceFilePath.concat(productFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/product/product_credit.json"),
        productModifyJSON,
        "cycle_interval",
        "1 month"
      );
      jsonUpdater.updateJSON(productModifyJSON, productModifyJSON, "cycle_due_interval", "-2 days");
      jsonUpdater.updateJSON(productModifyJSON, productModifyJSON, "first_cycle_interval", "1 month");
      cy.fixture(Constants.tempFixtureFilePath.concat(productFileName)).then((productJson) => {
        product.createProduct(productJson).then((response) => {
          expect(response.status).to.eq(200);
          productID = response.body.product_id;
          cy.log("new credit product created : " + productID);

          //set migration mode true

          const migrationmodeFile = "/productMigration_".concat(productID, ".json");
          const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationmodeFile);

          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
            migrationModeJSON,
            "migration_mode",
            "true"
          );

          cy.fixture(Constants.tempFixtureFilePath.concat(migrationmodeFile)).then((json) => {
            migrationmode.setmigrationmode(json, productID).then((response) => {
              expect(response.status).to.eq(200);
            });
          });
        });
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

    statementJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer and origination fee in account JSON file
        const accountFileName = "/create_account_".concat(testCaseID, data.index, ".json");
        const accountModifyJSON = Constants.tempResourceFilePath.concat(accountFileName);
        jsonUpdater.updateJSON(
          Constants.templateResourceFilePath.concat("/account/account_credit.json"),
          accountModifyJSON,
          "product_id",
          productID
        );
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "customer_id", customerID);
        jsonUpdater.updateJSON(
          accountModifyJSON,
          accountModifyJSON,
          "origination_fee_cents",
          parseInt(data.origination_fee_cents)
        );
        jsonUpdater.updateJSON(
          accountModifyJSON,
          accountModifyJSON,
          "initial_principal_cents",
          parseInt(data.intial_principle_in_cents)
        );
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "late_fee_cents", parseInt(data.late_fee_cents));
        jsonUpdater.updateJSON(
          accountModifyJSON,
          accountModifyJSON,
          "monthly_fee_cents",
          parseInt(data.monthly_fee_cents)
        );
        const days = parseInt(data.account_effective_dt);
        effectiveDate = dateHelper.addDays(days, 0);
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "effective_at", effectiveDate);

        //create account and assign to customer
        const accountJSONFile = Constants.tempFixtureFilePath.concat(accountFileName);
        await promisify(
          cy.fixture(accountJSONFile).then((accountJSON) => {
            account.createAccount(accountJSON).then((response) => {
              accountID = response.body.account_id;
              cy.log("new account created : " + accountID);
              expect(response.status).to.eq(200);
            });
          })
        );
      });

      if (data.do_payment.toLowerCase() === "true") {
        it(`should be able to see is_processed flag is false`, async () => {
          await promisify(
            events.getEvents(accountID).then((response) => {
              const results = response.body.results;
              results.forEach(function (data) {
                expect(data.is_processed).to.be.false;
              });
            })
          );
        });

        it(`should set migration mode to false`, async () => {
          await promisify(
            cy.fixture("template/migrationmode/migration_mode.json").then((json) => {
              migrationmode.setmigrationmode(json, productID).then((response) => {
                expect(response.status).to.eq(200);
              });
            })
          );
        });

        it(`should be able to see is_processed flag is true`, async () => {
          await promisify(
            events.getEvents(accountID).then((response) => {
              const results = response.body.results;
              results.forEach(function (data) {
                expect(data.is_processed).to.be.true;
              });
            })
          );
        });

        // Bellow assertions will be useful once we have migration mode API
        // working as expected and all events gets processed once we turn
        // migration mode off (false)
        //Check charge amount and origination fee displayed in first cycle of statement
        xit(`should able to see charge amount in statement- '${data.tc_name}'`, () => {
          //const statementDateForCharge = dateHelper.getStatementDate(effectiveDate,0)
          //Get statement list for account
          statement.getStatementByAccount(accountID).then((response) => {
            const chargeStatementID = statementValidator.getStatementIDByNumber(response, 0);
            //Get statement details for given statement id
            statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
              //Check charge line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "CHARGE",
                original_amount_cents: parseInt(data.intial_principle_in_cents),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);

              //Check origination line item is displayed in the statement
              if (data.check_origination_fee.toLowerCase() == "true") {
                const originationFeeLineItem: StmtLineItem = {
                  status: "VALID",
                  type: "ORIG_FEE",
                  original_amount_cents: parseInt(data.origination_fee_cents),
                };
                lineItemValidator.validateStatementLineItem(response, originationFeeLineItem);
              }
            });
          });
        });

        //Check monthly fee displayed in statement
        xit(`should able to see monthly fee in statement- '${data.tc_name}'`, () => {
          //Get statement list for account
          statement.getStatementByAccount(accountID).then((response) => {
            const monthlyStatementID = statementValidator.getStatementIDByNumber(response, 1);
            //Get statement details for given statement id
            statement.getStatementByStmtId(accountID, monthlyStatementID).then((response) => {
              //Check monthly fee line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);
            });
          });
        });
        it(`should have create a payment - '${data.tc_name}'`, async () => {
          //Update payment amount and payment effective dt
          const paymentFileName = "/create_payment_".concat(testCaseID, data.index, ".json");
          const paymentModifyJSON = Constants.tempResourceFilePath.concat(paymentFileName);
          const paymentAmt = data.payment_amt_cents;
          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/payment/payment.json"),
            paymentModifyJSON,
            "original_amount_cents",
            paymentAmt
          );
          const paymentEffectiveDate = dateHelper.getMonthlyFeeStatementDate(effectiveDate);
          jsonUpdater.updateJSON(
            paymentModifyJSON,
            paymentModifyJSON,
            "effective_at",
            paymentEffectiveDate + "T02:00:00-08:00"
          );

          const paymentJSON = Constants.tempFixtureFilePath.concat(paymentFileName);
          await promisify(
            cy.fixture(paymentJSON).then((createPaymentJson) => {
              payment.createPayment(createPaymentJson, accountID).then((response) => {
                expect(response.status, "payment response status").to.eq(200);
                expect(
                  response.body.line_item_summary.principal_cents,
                  "check payment amount in payment response"
                ).to.eq(createPaymentJson.original_amount_cents * -1);
              });
            })
          );
        });

        //Calling roll time forward to get statement and statement details get updated
        xit(`should have to wait for account roll time forward  - '${data.tc_name}'`, () => {
          //Roll time forward to generate statement lineItem
          const moveDate = 20;
          const endDate = dateHelper.getRollDate(moveDate);
          rollTime.rollAccountForward(accountID, endDate).then((response) => {
            expect(response.status).to.eq(200);
          });
        });

        //Check payment details displayed in statement
        xit(`should able to see payment amount  in statement- '${data.tc_name}'`, () => {
          //check the line item is displayed for the account
          type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const paymentLineItem: StmtLineItem = {
            status: "VALID",
            type: "PAYMENT",
            original_amount_cents: parseInt(data.payment_amt_cents) * -1,
          };
          lineItems.allLineitems(accountID).then((response) => {
            lineItemValidator.validateLineItem(response, paymentLineItem);
          });

          //Get statement list for account to check payment line item
          statement.getStatementByAccount(accountID).then((response) => {
            const monthlyStatementID = statementValidator.getStatementIDByNumber(response, 2);
            //Get statement details for given statement id
            statement.getStatementByStmtId(accountID, monthlyStatementID).then((response) => {
              //Check monthly fee line item is displayed in the statement
              lineItemValidator.validateStatementLineItem(response, paymentLineItem);
            });
          });
        });
      }
    });
  });
});

