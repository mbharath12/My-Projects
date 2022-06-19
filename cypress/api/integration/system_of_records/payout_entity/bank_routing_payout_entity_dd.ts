/* eslint-disable cypress/no-async-tests */
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import payoutJSON from "../../../../resources/testdata/payoutentity/bank_routing_number.json";
import TestFilters from "../../../../support/filter_tests.js";
import { payoutAPI, payoutEntityPayload } from "../../../api_support/payoutEntity";
import promisify from "cypress-promise";

/*
Test cases covered
PayoutEntity281A to 347C - Verify bank routing number should accept 9 digits 
and should not accept less than 9 or greater than 9 in all the payout entities
*/

if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
  TestFilters(["regression", "payout entities"], () => {
    describe("Validate the payout entity bank routing number", function () {
      let response;
      let productID;

      before(async () => {
        authAPI.getDefaultUserAccessToken();
        productID = await promisify(productAPI.createNewProduct("product_revolving.json"));
        cy.log("New product created :" + productID);
      });
      payoutJSON.forEach((data) => {
        it(`should have create payout entity '${data.tc_name}' `, async () => {
          const payoutFileName = data.payout_entity_file_name;

          const payoutentitypayload: CreatePayoutEntity = {
            payout_entity_type: data.exp_payout_entity_type,
            bank_account_number: data.exp_bank_account_number,
            payout_entity_name: data.exp_payout_entity_name,
            bank_routing_number: data.exp_bank_routing_number,
            irs_tin: data.exp_irs_tin,
            doNot_check_response_status: false,
          };

          response = await promisify(payoutAPI.updateNCreatePayoutEntity(payoutFileName, payoutentitypayload));

          if (response.status.toString() === "400") {
            expect(response.body.error.code, "check response error code").to.eq(data.error_code);
            expect(response.body.error.message, "check response error message").to.eq(data.error_message);
            expect(response.status.toString(), "Bank_routing_number failed the checksum test ").to.eq(
              data.response.toString()
            );
          } else {
            expect(response.status.toString(), "Bank_routing_number passed the checksum test ").to.eq(
              data.response.toString()
            );
          }
        });
      });
    });
  });
  type CreatePayoutEntity = Pick<
    payoutEntityPayload,
    | "payout_entity_type"
    | "bank_account_number"
    | "bank_routing_number"
    | "irs_tin"
    | "payout_entity_name"
    | "doNot_check_response_status"
  >;
}
