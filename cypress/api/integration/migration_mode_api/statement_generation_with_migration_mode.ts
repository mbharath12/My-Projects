/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-async-tests */
import {Account} from "../../api_support/account";
import {Customer} from "../../api_support/customer";
import {Product} from "../../api_support/product";
import {Events} from "../../api_support/events";
import {Auth} from "../../api_support/auth";
import {Charge} from "../../api_support/charge";
import {JSONUpdater} from "../../api_support/jsonUpdater";
import {Payment} from "../../api_support/payment";
import {Statements} from "cypress/api/api_support/statements";
import {StatementBalanceSummary, StatementValidator} from "cypress/api/api_validation/statements_validator";
import {LineItem, LineItemValidator} from "cypress/api/api_validation/line_item_validator";
import statementJSON from "cypress/resources/testdata/statement/consecutive_statement_verification.json";
import {Constants} from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";
import {migrationModeAPI} from "../../api_support/migrationmode";
import promisify from "cypress-promise";

//import { forEach } from "cypress/types/lodash";

// Test failure reason https://linear.app/canopy-inc/issue/CAN-355/bug-migration-mode-api-after-turning-it-off-also-events-are-not-being

//Test Scripts
// 40 tests
// MM513-MM519 Payment at first and fourth cycle of statement - 5 consecutive statements with
// origination fees - charge
// MM520-MM524 Payment at first and fourth cycle of statement - 5 consecutive statements with  no
// origination fees - charge - monthly fees
// MM525-MM530 Payment at first and fourth cycle of statement - 5 consecutive statements with
// origination fees - charge - monthly fees
// MM531-MM535 Payment at first and fourth cycle of statement - 5 consecutive statements
// with no origination fee -charge - annual fees
// MM536-MM541 Payment at first and fourth cycle of statement - 5 consecutive statements
// with origination fee - charge - annual fees
// MM542-MM546 Payment at first and fourth cycle of statement - 5 consecutive statements
// with no origination fee -charge - monthly and annual fees
// MM547-MM552 Payment at first and fourth cycle of statement - 5 consecutive statements
// with origination fee - charge - monthly and annual fees

//5 consecutive statement validation with annual, monthly with origination fee, charges,
// and payments at first and fourth cycle of statement: This should work as
// normally with migration mode API as it is working for other scenario.

TestFilters(["regression", "Migrationmode"], () => {
  describe("5 consecutive statements generation after migration mode updated - verify origination fee,charges,annual,monthly with payment for migration mode API ", function () {
    let accountID;
    let productID;
    let product7DaysID;
    let product1MonthID;
    let customerID;

    const product = new Product();
    const account = new Account();
    const customer = new Customer();
    const charge = new Charge();
    const payment = new Payment();
    const jsonUpdater = new JSONUpdater();
    const statement = new Statements();
    const statementValidator = new StatementValidator();
    const lineItemValidator = new LineItemValidator();
    const events = new Events();
    const testCaseID = "consecutive_stmt_";

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });


      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval with 7 days cycle in creditProduct json file
      let productFileName = "/create_product_".concat(testCaseID, "_1_.json");
      let productModifyJSON = Constants.tempResourceFilePath.concat(productFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/product/product_credit.json"),
        productModifyJSON,
        "cycle_interval",
        "7 days"
      );
      jsonUpdater.updateJSON(productModifyJSON, productModifyJSON, "cycle_due_interval", "-2 days");
      jsonUpdater.updateJSON(productModifyJSON, productModifyJSON, "first_cycle_interval", "7 days");
      cy.fixture(Constants.tempFixtureFilePath.concat(productFileName)).then((productJson) => {
        product.createProduct(productJson).then((response) => {
          expect(response.status).to.eq(200);
          product7DaysID = response.body.product_id;
          cy.log("new credit product created : " + product7DaysID);

          //set migration mode true
          const migrationmodeFile = "/productMigration_".concat(product7DaysID, ".json");
          const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationmodeFile);

          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
            migrationModeJSON,
            "migration_mode",
            "true"
          );

          cy.fixture(Constants.tempFixtureFilePath.concat(migrationmodeFile)).then((json) => {
            migrationModeAPI.setmigrationmode(json, product7DaysID).then((response) => {
              expect(response.status).to.eq(200);
            });
          });
        });
      });

      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval with 1 month cycle in creditProduct json file
      productFileName = "/create_product_".concat(testCaseID, "_2_.json");
      productModifyJSON = Constants.tempResourceFilePath.concat(productFileName);
      jsonUpdater.updateJSON(
        Constants.templateResourceFilePath.concat("/product/product_credit.json"),
        productModifyJSON,
        "cycle_interval",
        "1 month"
      );
      jsonUpdater.updateJSON(productModifyJSON, productModifyJSON, "cycle_due_interval", "28 days");
      jsonUpdater.updateJSON(productModifyJSON, productModifyJSON, "first_cycle_interval", "1 month");
      cy.fixture(Constants.tempFixtureFilePath.concat(productFileName)).then((productJson) => {
        product.createProduct(productJson).then((response) => {
          expect(response.status).to.eq(200);
          product1MonthID = response.body.product_id;
          cy.log("new credit product created : " + product1MonthID);

          //set migration mode true

          const migrationmodeFile = "/productMigration_".concat(product1MonthID, ".json");
          const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationmodeFile);

          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
            migrationModeJSON,
            "migration_mode",
            "true"
          );

          cy.fixture(Constants.tempFixtureFilePath.concat(migrationmodeFile)).then((json) => {
            migrationModeAPI.setmigrationmode(json, product1MonthID).then((response) => {
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
      it(`should have create account and assign customer - '${data.tc_name}'`, () => {
        if (data.cycle_interval.toLowerCase() == "7 days") {
          productID = product7DaysID;
        } else {
          productID = product1MonthID;
        }
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
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "first_cycle_interval", data.cycle_interval);
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
          parseInt(data.initial_principal_cents)
        );
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "late_fee_cents", parseInt(data.late_fee_cents));
        jsonUpdater.updateJSON(
          accountModifyJSON,
          accountModifyJSON,
          "monthly_fee_cents",
          parseInt(data.monthly_fee_cents)
        );
        jsonUpdater.updateJSON(
          accountModifyJSON,
          accountModifyJSON,
          "annual_fee_cents",
          parseInt(data.annual_fee_cents)
        );
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "effective_at", data.account_effective_dt);

        //create account and assign to customer
        const accountJSONFile = Constants.tempFixtureFilePath.concat(accountFileName);
        cy.fixture(accountJSONFile).then((accountJSON) => {
          cy.log("iternation 1:  " + accountFileName);

          account.createAccount(accountJSON).then((response) => {
            cy.log("iternation :  " + accountFileName);
            accountID = response.body.account_id;
            cy.log("new account created : " + accountID);
            expect(response.status).to.eq(200);
          });
        });
      });

      if (data.stmt1_charge_amount !== "0") {
        it(`should be able to create a charge to for first cycle - '${data.tc_name}'`, () => {
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge_amount,
            data.stmt1_charge_effective_dt
          );
        });
      }

      if (data.payment_amount !== "0") {
        it(`should be able to create a payment at first cycle interval - '${data.tc_name}'`, async () => {
          await promisify(
            payment.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_dt)
          );
        });
      }

      // Verify the is_processed is false in events table

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

      // migration mode change

      it(`should set migration mode to false`, async () => {
        await promisify(
          cy.fixture("template/migrationmode/migration_mode.json").then((json) => {
            migrationModeAPI.setmigrationmode(json, product7DaysID).then((response) => {
              expect(response.status).to.eq(200);
            });
          })
        );
        await promisify(
          cy.fixture("template/migrationmode/migration_mode.json").then((json) => {
            migrationModeAPI.setmigrationmode(json, product1MonthID).then((response) => {
              expect(response.status).to.eq(200);
            });
          })
        );
      });

      // Verify the is_processed is true in events table

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

      // The bellow assertions will be more useful onse we have the migration mode
      // off working as expected and events get processed on time

      xit(`should have to validate statement balance for first cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt1_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt1_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt1_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt1_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 0, balanceSummary);
      });

      xit(`should have to validate statement line items for first cycle - '${data.tc_name}'`, () => {
        //const statementDateForCharge = dateHelper.getStatementDate(effectiveDate,0)
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 0);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            if (data.initial_principal_cents !== "0") {
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "CHARGE",
                original_amount_cents: parseInt(data.initial_principal_cents),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);
            }
            //Check origination line item is displayed in the statement
            if (data.origination_fee_cents !== "0") {
              const originationFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "ORIG_FEE",
                original_amount_cents: parseInt(data.origination_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, originationFeeLineItem);
            }
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }

            if (data.payment_amount !== "0") {
              const paymentLineItem: StmtLineItem = {
                status: "VALID",
                type: "PAYMENT",
                original_amount_cents: parseInt(data.payment_amount) * -1,
              };
              lineItemValidator.validateStatementLineItem(response, paymentLineItem);
            }
          });
        });
      });

      xit(`should have to validate statement balance for second cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt2_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt2_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt2_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt2_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 1, balanceSummary);
      });

      xit(`should have to validate statement line items for second cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 1);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }

            //Check monthly fee item is displayed in the statement
            if (data.annual_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              //Check monthly fee line item is displayed in the statement
              type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
              const annualFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "YEAR_FEE",
                original_amount_cents: parseInt(data.annual_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, annualFeeLineItem);
            }
          });
        });
      });

      if (data.stmt3_charge_amount !== "0") {
        it(`should be able to create a charge to for third cycle - '${data.tc_name}'`, async () => {
          await promisify(
            charge.chargeForAccount(
              accountID,
              "create_charge.json",
              data.stmt3_charge_amount,
              data.stmt3_charge_effective_dt
            )
          );
        });
      }

      xit(`should have to validate statement balance for third cycle - '${data.tc_name}'`, () => {
        const balanceSummaryJSON: JSON = <JSON>(<unknown>{
          charges_principal_cents: parseInt(data.stmt3_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt3_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt3_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt3_total_balance_cents),
        });
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 2, balanceSummaryJSON);
      });

      xit(`should have to validate statement line items for third cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 2);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }
            if (data.stmt3_charge_amount !== "0") {
              const chargeLineItem: StmtLineItem = {
                status: "VALID",
                type: "CHARGE",
                original_amount_cents: parseInt(data.stmt3_charge_amount),
              };
              lineItemValidator.validateStatementLineItem(response, chargeLineItem);
            }
          });
        });
      });

      if (data.stmt4_payment_amount !== "0") {
        it(`should be able to create a payment at 4th cycle of statement - '${data.tc_name}'`, async () => {
          await promisify(
            payment.paymentForAccount(
              accountID,
              "payment.json",
              data.stmt4_payment_amount,
              data.stmt4_payment_effective_dt
            )
          );
        });
      }

      xit(`should have to validate statement balance for fourth cycle - '${data.tc_name}'`, () => {
        const balanceSummaryJSON: JSON = <JSON>(<unknown>{
          charges_principal_cents: parseInt(data.stmt4_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt4_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt4_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt4_total_balance_cents),
        });
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 3, balanceSummaryJSON);
      });

      xit(`should have to validate statement line items for fourth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 3);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }
            if (data.stmt4_payment_amount !== "0") {
              const paymentLineItem: StmtLineItem = {
                status: "VALID",
                type: "PAYMENT",
                original_amount_cents: parseInt(data.stmt4_payment_amount) * -1,
              };
              lineItemValidator.validateStatementLineItem(response, paymentLineItem);
            }
          });
        });
      });

      xit(`should have to validate statement balance for fifth cycle - '${data.tc_name}'`, () => {
        const balanceSummaryJSON: JSON = <JSON>(<unknown>{
          charges_principal_cents: parseInt(data.stmt5_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt5_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt5_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt5_total_balance_cents),
        });
        cy.wait(1000);
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 4, balanceSummaryJSON);
      });

      xit(`should have to validate statement line items for fifth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 3);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check principal charge line item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            //Check monthly fee item is displayed in the statement
            if (data.monthly_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const monthlyFeeLineItem: StmtLineItem = {
                status: "VALID",
                type: "MONTH_FEE",
                original_amount_cents: parseInt(data.monthly_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
            }
          });
        });
      });
    });
  });
});
