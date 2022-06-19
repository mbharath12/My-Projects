/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import TestFilters from "../../../support/filter_tests.js";
import { dateHelper } from "../../api_support/date_helpers";
import promisify from "cypress-promise";
import timeZoneProcessingJSON from "../../../resources/testdata/timezone/time_zone_cycle_level.json";
import { statementsAPI } from "cypress/api/api_support/statements";

TestFilters(["regression", "timezone"], () => {
  describe("should have validate the different time zone at cycle level ", function () {
    let productID;
    let customerID;
    let accountID;
    let response;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //create customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
      });
    });
    timeZoneProcessingJSON.forEach((data) => {
      it(`it should have create product '${data.tc_name}'`, async () => {
        const productJSONFile = data.product_template_name;
        cy.log(productJSONFile);
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          effective_at: data.product_effective_at,
          first_cycle_interval_del: "first_cycle_interval",
          product_time_zone: data.product_time_zone,
        };
        response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
      });
      it(`should have create account '${data.tc_name}'`, async () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          first_cycle_interval_del: "first_cycle_interval",
        };
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
      });
      //roll time forward
      it(`should have to wait for account roll time forward to make sure line item is processed - '${data.tc_name}'`, async () => {
        if (data.rolltime.length !== 0) {
          const endDate = dateHelper.getAccountEffectiveAt(data.rolltime);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
          expect(response.status).to.eq(200);
        }
      });
      it(`it should have validate time zone '${data.tc_name};`, async () => {
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.effective_at, "verify account effective on the server ").to.eq(data.exp_effective_at);

        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        expect(response.body[0].min_pay_due.min_pay_due_at, "verify min pay_due_date ").to.eq(data.exp_min_pay_due_at);
        expect(response.body[0].cycle_summary.cycle_exclusive_end, "verify cycle exclusive end").to.eq(
          data.exp_cycle_exclusive_end
        );
        expect(response.body[0].cycle_summary.cycle_inclusive_start, "verify cycle inclusive_start").to.eq(
          data.exp_cycle_inclusive_start
        );
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  "cycle_interval" | "cycle_due_interval" | "effective_at" | "first_cycle_interval_del" | "product_time_zone"
>;
type CreateAccount = Pick<AccountPayload, "effective_at" | "product_id" | "customer_id" | "first_cycle_interval_del">;
