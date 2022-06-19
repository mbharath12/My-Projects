/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { rollTimeAPI } from "../../api_support/rollTime";
import { authAPI } from "../../api_support/auth";
import TestFilters from "../../../support/filter_tests.js";
import { dateHelper } from "../../api_support/date_helpers";
import promisify from "cypress-promise";
import timeZoneProcessingJSON from "../../../resources/testdata/timezone/time_zone_cycle_dst.json";
import { statementsAPI } from "cypress/api/api_support/statements";

//Test Cases covered
// TZ_01 Cycle level Day Light Savings timezone for America/Anchorage
// TZ_02 Cycle level Day Light Savings timezone for America/Adak
// TZ_03 Cycle level Day Light Savings timezone for America/Los_Angeles
// TZ_04 Cycle level Day Light Savings timezone for America/Denver
// TZ_05 Cycle level Day Light Savings timezone for America/Toronto
// TZ_06 Cycle level Day Light Savings timezone for America/Chicago
// TZ_07 Cycle level Day Light Savings timezone for America/Vancouver
// TZ_08 Cycle level Day Light Savings timezone for America/New_York
// TZ_09 Cycle level Day Light Savings timezone for America/Dawson
// TZ_10 Cycle level Day Light Savings timezone for America/Indiana/Knox

TestFilters(["regression", "cycle_Dst_Timezone"], () => {
  describe("should have validate the different time zone at cycle level ", function () {
    let productID;
    let customerID;
    let accountID;
    let response;

    before(async() => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });
    timeZoneProcessingJSON.forEach((data) => {
      it(`should have create product '${data.tc_name}'`, async () => {
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
      // create account
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
      it(`should have to wait for account roll time forward  to make sure line item is processed - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getAccountEffectiveAt(data.rolltime);
        const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate.slice(0, 10)));
        expect(response.status).to.eq(200);
      });

      it(`it should have validate time zone '${data.tc_name};`,  () => {
        accountAPI.getAccountById(accountID).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.effective_at, "verify account effective on the server ").to.eq(data.exp_effective_at);
        })

        statementsAPI.getStatementByAccount(accountID).then((response) => {
          expect(response.status).to.eq(200);
          const length = response.body.length
          if(length==0){
            expect(length,"statements are not generated").to.be.greaterThan(0)
          }
          const cycle = length-1
          expect(response.body[cycle].min_pay_due.min_pay_due_at, "verify min pay_due_date ").to.eq(
            data.exp_min_pay_due_at
          );
          expect(response.body[cycle].cycle_summary.cycle_inclusive_start, "verify cycle inclusive_start").to.eq(
            data.exp_cycle_inclusive_start
          );
          expect(response.body[cycle].cycle_summary.cycle_exclusive_end, "verify cycle exclusive end").to.eq(
            data.exp_cycle_exclusive_end
          );

        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  "cycle_interval" | "cycle_due_interval" | "effective_at" | "first_cycle_interval_del" | "product_time_zone"
>;
type CreateAccount = Pick<AccountPayload, "effective_at" | "product_id" | "customer_id" | "first_cycle_interval_del">;
