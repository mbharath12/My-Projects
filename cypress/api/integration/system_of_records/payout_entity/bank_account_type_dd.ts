import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import payoutJSON from "../../../../resources/testdata/payoutentity/bank_account_type.json";
import TestFilters from "../../../../support/filter_tests.js";
import { payoutAPI, payoutEntityPayload } from "../../../api_support/payoutEntity";
import promisify from "cypress-promise";

/*
Test cases covered
PayoutEntity291 to PayoutEntity473 - Verify bank account type should accept CHECKINGS,SAVINGS,GL 
*/

if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
  TestFilters(["regression", "payoutentities", "bankaccounttype"], () => {
    describe("Validate the payout entity bank account type", function () {
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
            bank_account_type: data.bank_account_type,
            doNot_check_response_status: false,
          };

          response = await promisify(payoutAPI.updateNCreatePayoutEntity(payoutFileName, payoutentitypayload));

          if (data.response.toString() === "400") {
            expect(response.body.error.code, "check response error code").to.eq(data.error_code);
            expect(response.body.error.message, "check response error message").to.eq(data.error_message);
            expect(response.status.toString(), "Bank_account_type failed the checksum test ").to.eq(
              data.response.toString()
            );
          } else {
            expect(response.status.toString(), "Bank_account_type passed the checksum test ").to.eq(
              data.response.toString()
            );
            expect(response.body.bank_account_type, "Validate the bank account type in response body").to.eq(
              data.exp_bank_account_type
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
    | "bank_account_type"
    | "doNot_check_response_status"
  >;
}
