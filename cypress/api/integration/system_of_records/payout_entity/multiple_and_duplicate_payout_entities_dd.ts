/* eslint-disable cypress/no-async-tests */
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import payoutJSON from "../../../../resources/testdata/payoutentity/multiple_and_duplicate_payout_entities.json";
import TestFilters from "../../../../support/filter_tests.js";
import { payoutAPI, payoutEntityPayload } from "../../../api_support/payoutEntity";
import promisify from "cypress-promise";

//Test cases covered
//PayoutEntity288 - PayoutEntity374 - Verify duplication of Merchant Payout entity is not permitted - with the same  Routing number Account number and IRS_tin
//PayoutEntity289 - PayoutEntity375 - Verify multiple Merchant Payout entities can  be created for the same client using different irs_tin-account number different

//if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
TestFilters(["regression", "payoutentities"], () => {
  describe("Validate the payoutentities by creating multiple times and duplicating the attribute values", function () {
    let response;
    let productID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      productID = await promisify(productAPI.createNewProduct("product_revolving.json"));
      cy.log("New product created :" + productID);
    });
    payoutJSON.forEach((data) => {
      it(`should have create payout entity multiple times '${data.tc_name}' `, async () => {
        const payoutFileName = data.payout_entity_file_name;

        const payoutentitypayload: CreatePayoutEntity = {
          payout_entity_type: data.exp_payout_entity_type,
          bank_account_number: data.exp_bank_account_number,
          payout_entity_name: data.exp_payout_entity_name,
          bank_routing_number: data.exp_bank_routing_number,
          irs_tin: data.exp_irs_tin,
        };

        response = await promisify(payoutAPI.updateNCreatePayoutEntity(payoutFileName, payoutentitypayload));
        //TODO :Line #38 will be modified to compare the status code from testdata once CAN-651 is fixed       
        if (response.status.toString() === "400") {
          expect(response.body.error.code, "check response error code").to.eq(data.error_code);
          expect(response.body.error.message, "check response error message").to.eq(data.error_message);
          expect(
            response.status.toString(),
            "Duplication of payout entity with the same Routing number ,Account number and IRS_tin is not permitted"
          ).to.eq(data.response.toString());
        } else {
          expect(response.status.toString(), "Validate the response code of the payout entity").to.eq(
            data.response.toString()
          );
          expect(response.body.payout_entity_type, "Validate the payout entity type").to.eq(
            data.exp_payout_entity_type
          );
          expect(response.body.payout_entity_name, "Validate the payout entity name").to.eq(
            data.exp_payout_entity_name
          );
          expect(response.body.bank_account_number, "Validate the payout entity bank account number").to.eq(
            data.exp_bank_account_number
          );
          expect(response.body.bank_routing_number, "Validate the payout entity bank routing number").to.eq(
            data.exp_bank_routing_number
          );
          expect(response.body.irs_tin, "Validate the payout entity tin number").to.eq(data.exp_irs_tin);
        }
      });
    });
  });
});
type CreatePayoutEntity = Pick<
  payoutEntityPayload,
  "payout_entity_type" | "bank_account_number" | "bank_routing_number" | "irs_tin" | "payout_entity_name"
>;
//}
