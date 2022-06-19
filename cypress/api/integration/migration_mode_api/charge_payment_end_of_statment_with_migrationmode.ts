/* eslint-disable cypress/no-async-tests */
/* eslint-disable cypress/no-unnecessary-waiting */
import {accountAPI, AccountPayload} from "../../api_support/account";
import {customerAPI} from "../../api_support/customer";
import {productAPI, ProductPayload} from "../../api_support/product";
import {authAPI} from "../../api_support/auth";
//import { paymentAPI } from "../../support/payment";
import {chargeAPI} from "../../api_support/charge";
//import { StatementBalanceSummary, StatementValidator } from "../../validation/statements_validator";
import statementJSON from "cypress/resources/testdata/statement/statement_make_charges_payment_at_end_of_statement.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import {migrationModeAPI} from "../../api_support/migrationmode";
import {Constants} from "../../api_support/constants";
import {JSONUpdater} from "../../api_support/jsonUpdater";
import {Events} from "../../api_support/events";

// Test failure reason https://linear.app/canopy-inc/issue/CAN-355/bug-migration-mode-api-after-turning-it-off-also-events-are-not-being

//Test Scripts
// 32 tests
// MM636-MM639 Make Charges - Payment at the end of last statement - 5 consecutive statements with
// origination fees - charge
// MM640-MM643 Make Charges - Payment at the end of last statement - 5 consecutive statements with  no
// origination fees - charge - monthly fees
// MM644-MM648 Make Charges - Payment at the end of last statement - 5 consecutive statements with
// origination fees - charge - monthly fees
// MM649-MM652 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with no origination fee -charge - annual fees
// MM653-MM657 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with origination fee -charge - annual fees
// MM658-MM662 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with no origination fee -charge - monthly and annual fees
// MM663-MM668 Make Charges - Payment at the end of last statement - 5 consecutive statements
// with origination fee -charge - monthly and annual fees

//5 consecutive statement validation with annual, monthly with origination fee, charges,
// and payments end of all statement after migration mode is updated.

TestFilters(["regression", "Migrationmode"], () => {
  describe("Validate 5 consecutive statements after migration mode is updated  - make charges every cycle and payment to be done after end of statement", function () {
    let accountID;
    let productID;
    let product7DaysID;
    let product1MonthID;
    let customerID;

    const jsonUpdater = new JSONUpdater();
    const events = new Events();

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a product - using  credit product
      //Update product with cycle interval, cycle due date, first cycle interval
      //Update cycle interval with 7 days cycle in creditProduct json file
      //Update Cycle_interval,Cycle_due,Promo policies
      const productPayload1: CreateProduct = {
        cycle_interval: "7 days",
        cycle_due_interval: "-2 days",
        first_cycle_interval: "7 days",
      };

      productAPI.updateNCreateProduct("product_credit.json", productPayload1).then((response) => {
        product7DaysID = response.body.product_id;
        cy.log("new credit product created : " + product7DaysID);

        const migrationModeFile = "/product_migration_".concat(product7DaysID, ".json");
        const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationModeFile);

        jsonUpdater.updateJSON(
          Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
          migrationModeJSON,
          "migration_mode",
          "true"
        );

        cy.fixture(Constants.tempFixtureFilePath.concat(migrationModeFile)).then((json) => {
          migrationModeAPI.setmigrationmode(json, product7DaysID).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });

      // //Create a product - using  credit product
      // //Update product with cycle interval, cycle due date, first cycle interval
      // //Update cycle interval with 1 month cycle in creditProduct json file
      const productPayload2: CreateProduct = {
        cycle_interval: "1 month",
        cycle_due_interval: "28 days",
        first_cycle_interval: "1 month",
      };
      productAPI.updateNCreateProduct("product_credit.json", productPayload2).then((response) => {
        product1MonthID = response.body.product_id;
        cy.log("new credit product created : " + product1MonthID);
        const migrationModeFile = "/productMigration_".concat(product1MonthID, ".json");
        const migrationModeJSON = Constants.tempResourceFilePath.concat(migrationModeFile);

        jsonUpdater.updateJSON(
          Constants.templateResourceFilePath.concat("/migrationmode/migration_mode.json"),
          migrationModeJSON,
          "migration_mode",
          "true"
        );

        cy.fixture(Constants.tempFixtureFilePath.concat(migrationModeFile)).then((json) => {
          migrationModeAPI.setmigrationmode(json, product1MonthID).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });

      //Create a customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        Cypress.env("customer_id", customerID);
      });
    });

    statementJSON.forEach((data) => {
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Updating product id based on cycle interval
        data.cycle_interval.toLowerCase() == "7 days" ? (productID = product7DaysID) : (productID = product1MonthID);

        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_dt,
          initial_principal_cents: parseInt(data.initial_principal_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          annual_fee_cents: parseInt(data.annual_fee_cents),
        };

        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      it(`should be able to create a charge for first cycle - '${data.tc_name}'`, async () => {
        await promisify(
          chargeAPI.chargeForAccount(
            accountID,
            "create_charge.json",
            data.stmt1_charge_amount,
            data.stmt1_charge_effective_dt
          )
        );
      });

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
    });
  });

  type CreateProduct = Pick<ProductPayload, "cycle_interval" | "cycle_due_interval" | "first_cycle_interval">;
  type CreateAccount = Pick<
    AccountPayload,
    | "product_id"
    | "customer_id"
    | "effective_at"
    | "initial_principal_cents"
    | "credit_limit_cents"
    | "origination_fee_cents"
    | "late_fee_cents"
    | "monthly_fee_cents"
    | "annual_fee_cents"
    | "payment_reversal_fee_cents"
    | "promo_impl_interest_rate_percent"
  >;
});
