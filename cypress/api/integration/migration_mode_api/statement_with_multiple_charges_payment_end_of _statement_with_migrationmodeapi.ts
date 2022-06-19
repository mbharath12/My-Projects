/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-async-tests */

import {Account} from "../../api_support/account";
import {Customer} from "../../api_support/customer";
import {Product} from "../../api_support/product";
import {Auth} from "../../api_support/auth";
import {Payment} from "../../api_support/payment";
import {Charge} from "../../api_support/charge";
import {JSONUpdater} from "../../api_support/jsonUpdater";
import {Statements} from "../../api_support/statements";
import {StatementBalanceSummary, StatementValidator} from "../../api_validation/statements_validator";
import {LineItem, LineItemValidator} from "../../api_validation/line_item_validator";
import statementJSON from "cypress/resources/testdata/statement/statement_multiple_charges_payment_at_the_end_of_last_statement.json";
import {Constants} from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";
import {Migrationmode} from "../../api_support/migrationmode";
import {Events} from "../../api_support/events";
import promisify from "cypress-promise";

//Test Scripts
// 28 tests
// MM677-MM680 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements with
// origination fees - charges
// MM681-MM684 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements with  no
// origination fees - charge - monthly fees
// MM685-MM689 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements with
// origination fees - charge - monthly fees
// MM690-MM693 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements
// with no origination fee -charge - annual fees
// MM694-MM698 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements
// with origination fee -charge - annual fees
// MM699-MM703 Multiple charges through statements and payment at the end of last statement - 5 consecutive statements
// with no origination fee - charge - monthly and annual fees
// MM704-MM709 Multiple charges through statements and payment at the end of
// last statement - 5 consecutive statements
// with origination fee - charge - monthly and annual fees

// consecutive statement validation with annual, monthly with origination fee, charges,
// and payments end of all statement with Migration mode API use
TestFilters(["regression", "Migrationmode"], () => {
  describe("Statements validation - multiple charges and payment to be done after end of statement using migration mode API", function () {
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
    const migrationmode = new Migrationmode();

    const jsonUpdater = new JSONUpdater();
    const statement = new Statements();
    const statementValidator = new StatementValidator();
    const lineItemValidator = new LineItemValidator();
    const testCaseID = "stmt_multiple_charges_";
    const events = new Events();

    before(() => {
      const auth = new Auth();
      auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });

      // Test failure reason https://linear.app/canopy-inc/issue/CAN-355/bug-migration-mode-api-after-turning-it-off-also-events-are-not-being

      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval with 7 days cycle in creditProduct json file
      let productFileName = "/create_product_".concat(testCaseID, "1_.json");
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

          //set migration mode true for product 1

          const migrationmodeFile = "/productMigration_".concat(product7DaysID, ".json");
          const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationmodeFile);

          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
            migrationModeJSON,
            "migration_mode",
            "true"
          );

          cy.fixture(Constants.tempFixtureFilePath.concat(migrationmodeFile)).then((json) => {
            migrationmode.setmigrationmode(json, product7DaysID).then((response) => {
              expect(response.status).to.eq(200);
            });
          });
        });
      });

      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval with 1 month cycle in creditProduct json file
      productFileName = "/create_product_".concat(testCaseID, "2_.json");
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

          // set migration mode for product 2

          const migrationmodeFile = "/productMigration_".concat(product1MonthID, ".json");
          const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationmodeFile);

          jsonUpdater.updateJSON(
            Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
            migrationModeJSON,
            "migration_mode",
            "true"
          );

          cy.fixture(Constants.tempFixtureFilePath.concat(migrationmodeFile)).then((json) => {
            migrationmode.setmigrationmode(json, product1MonthID).then((response) => {
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
        //Updating product id based on cycle interval
        data.cycle_interval.toLowerCase() == "7 days" ? (productID = product7DaysID) : (productID = product1MonthID);

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
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "late_fee_cents", data.late_fee_cents);
        jsonUpdater.updateJSON(accountModifyJSON, accountModifyJSON, "annual_fee_cents", data.annual_fee_cents);
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

      it(`should be able to create a charge1 to for first cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge1_amount,
            data.stmt1_charge1_effective_dt
          )
        );
      });

      it(`should be able to create a charge2 to for first cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge2_amount,
            data.stmt1_charge2_effective_dt
          )
        );
      });

      it(`should be able to create a charge1 to for second cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt2_charge1_amount,
            data.stmt2_charge1_effective_dt
          )
        );
      });

      it(`should be able to create a charge2 to for second cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt2_charge2_amount,
            data.stmt2_charge2_effective_dt
          )
        );
      });

      it(`should be able to create a charge1 to for third cycle - ${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt3_charge1_amount,
            data.stmt3_charge1_effective_dt
          )
        );
      });

      it(`should be able to create a charge2 to for third cycle - ${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt3_charge2_amount,
            data.stmt3_charge2_effective_dt
          )
        );
      });
      it(`should be able to create a charge1 to for fourth cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt4_charge1_amount,
            data.stmt4_charge1_effective_dt
          )
        );
      });

      it(`should be able to create a charge2 to for fourth cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt4_charge2_amount,
            data.stmt4_charge2_effective_dt
          )
        );
      });

      it(`should be able to create a charge1 to for fifth cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt5_charge1_amount,
            data.stmt5_charge1_effective_dt
          )
        );
      });

      it(`should be able to create a charge2 to for fifth cycle - '${data.tc_name}'`, async () => {
        await promisify(
          charge.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt5_charge2_amount,
            data.stmt5_charge2_effective_dt
          )
        );
      });

      //payment done in sixth statement
      it(`should be able to create a payment at end of 5 statements - '${data.tc_name}'`, async () => {
        await promisify(
          payment.paymentForAccount(accountID, "payment.json", data.payment_amount, data.payment_effective_dt)
        );
      });

      // verify that the events in the event table are is not processed and
      // is_processes = false

      it(`should be able to see is_processed parameter is false`, async () => {
        await promisify(
          events.getEvents(accountID).then((response) => {
            const results = response.body.results;
            results.forEach(function (data) {
              expect(data.is_processed).to.be.false;
            });
          })
        );
      });

      // set migration mode to false to let all the events get processed and
      // verify the behavior for product 1

      it(`should set migration mode to false`, async () => {
        await promisify(
          cy.fixture("template/migrationmode/migration_mode.json").then((json) => {
            migrationmode.setmigrationmode(json, product7DaysID).then((response) => {
              expect(response.status).to.eq(200);
            });
          })
        );

        // set migration mode to false to let all the events get processed and
        // verify the behavior for product 2

        await promisify(
          cy.fixture("template/migrationmode/migration_mode.json").then((json) => {
            migrationmode.setmigrationmode(json, product1MonthID).then((response) => {
              expect(response.status).to.eq(200);
            });
          })
        );
      });
      // verify that the events in the event table are is processed and
      // is_processes = true

      it(`should be able to see is_processed parameter is true`, async () => {
        await promisify(
          events.getEvents(accountID).then((response) => {
            const results = response.body.results;
            results.forEach(function (data) {
              expect(data.is_processed).to.be.true;
            });
          })
        );
      });

      // The bellow assertions will be useful once we have the is_processed
      // parameter true via migration mode , commented out as they are failing for
      // because of the above issue

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
        const chargeAmount1 = data.stmt2_charge1_amount;
        const chargeAmount2 = data.stmt2_charge2_amount;
        const chargeDate1 = data.stmt2_charge1_effective_dt.slice(0, 10);
        const chargeDate2 = data.stmt2_charge2_effective_dt.slice(0, 10);
        statementValidator.validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 1, accountID);
      });

      xit(`should have to validate statement balance for third cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt3_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt3_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt3_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt3_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 2, balanceSummary);
      });

      xit(`should have to validate statement line items for third cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        const chargeAmount1 = data.stmt3_charge1_amount;
        const chargeAmount2 = data.stmt3_charge2_amount;
        const chargeDate1 = data.stmt3_charge1_effective_dt.slice(0, 10);
        const chargeDate2 = data.stmt3_charge2_effective_dt.slice(0, 10);
        statementValidator.validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 2,accountID);

        //validate year_fee line item in statement
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 2);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            //Check year fee item is displayed in the statement
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            if (data.annual_fee_cents !== "0" && data.cycle_interval.toLowerCase() !== "7 days") {
              const yearLineItem: StmtLineItem = {
                status: "VALID",
                type: "YEAR_FEE",
                original_amount_cents: parseInt(data.annual_fee_cents),
              };
              lineItemValidator.validateStatementLineItem(response, yearLineItem);
            }
          });
        });
      });

      xit(`should have to validate statement balance for fourth cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt4_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt4_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt4_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt4_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 3, balanceSummary);
      });

      xit(`should have to validate statement line items for fourth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        const chargeAmount1 = data.stmt4_charge1_amount;
        const chargeAmount2 = data.stmt4_charge2_amount;
        const chargeDate1 = data.stmt4_charge1_effective_dt.slice(0, 10);
        const chargeDate2 = data.stmt4_charge2_effective_dt.slice(0, 10);
        statementValidator.validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 3,accountID);
      });

      xit(`should have to validate statement balance for fifth cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt5_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt5_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt5_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt5_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 4, balanceSummary);
      });

      xit(`should have to validate statement line items for fifth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        const chargeAmount1 = data.stmt5_charge1_amount;
        const chargeAmount2 = data.stmt5_charge2_amount;
        const chargeDate1 = data.stmt5_charge1_effective_dt.slice(0, 10);
        const chargeDate2 = data.stmt5_charge2_effective_dt.slice(0, 10);
        statementValidator.validateStatementLineItem(data, chargeAmount1, chargeDate1, chargeAmount2, chargeDate2, 4,accountID);
      });

      // Validate the statement summary after the payment is done at end of 5
      // consecutive statements
      xit(`should have to validate statement balance for sixth cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt6_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt6_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt6_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt6_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(accountID, 5, balanceSummary);
      });

      //check payment line item in fifth statement
      xit(`should have to validate payment line item in statement for sixth cycle - '${data.tc_name}'`, () => {
        //Get statement list for account
        statement.getStatementByAccount(accountID).then((response) => {
          const chargeStatementID = statementValidator.getStatementIDByNumber(response, 5);
          //Get statement details for given statement id
          statement.getStatementByStmtId(accountID, chargeStatementID).then((response) => {
            type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            const paymentLineItem: StmtLineItem = {
              status: "VALID",
              type: "PAYMENT",
              original_amount_cents: parseInt(data.payment_amount) * -1,
            };
            lineItemValidator.validateStatementLineItem(response, paymentLineItem);
          });
        });
      });
    });
  });
});

