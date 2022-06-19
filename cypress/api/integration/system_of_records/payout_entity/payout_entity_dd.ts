/* eslint-disable cypress/no-async-tests */
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import payoutJSON from "../../../../resources/testdata/payoutentity/payout_entity.json";
import TestFilters from "../../../../support/filter_tests.js";
import { payoutAPI, payoutEntityPayload } from "../../../api_support/payoutEntity";
import promisify from "cypress-promise";

//Test cases covered
//PayoutEntity269,PayoutEntity286,PayoutEntity254,PayoutEntity303,PayoutEntity319,PayoutEntity335,PayoutEntity270 - Verify the creation of all Payout entities
//Merchant,Lender,General org,ACH Source,Debit Source,Lockbox Source
//PayoutEntity270,PayoutEntity287,PayoutEntity255,PayoutEntity304,PayoutEntity320,PayoutEntity336 - Validate the payout entity id autogenerates unique value for
//Merchant,Lender,General org,ACH Source,Debit Source,Lockbox Source
//PayoutEntity273,PayoutEntity290,PayoutEntity258,PayoutEntity307,PayoutEntity323,PayoutEntity339 - Validate bank_account_number attribute is mandatory and should accepts the valid format of 8-12 digits

if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
  TestFilters(["regression", "payout entities"], () => {
    describe("Validate the payout entities", function () {
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
          };

          response = await promisify(payoutAPI.updateNCreatePayoutEntity(payoutFileName, payoutentitypayload));
          expect(response.status.toString(), "Validate the response code of the payout entity").to.eq(
            data.response.toString()
          );
          if (response.status.toString() === "200") {
            expect(
              response.body.payout_entity_id,
              "Validate the payout entity id unique value is auto generated"
            ).to.not.eq(null);
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
          } else {
            //Compare it with the expected error message once CAN-627 is fixed
            expect(response.body.error.details[0].message, "check detailed error message").to.not.eq(null);
          }
        });
      });
    });
  });
  type CreatePayoutEntity = Pick<
    payoutEntityPayload,
    "payout_entity_type" | "bank_account_number" | "bank_routing_number" | "irs_tin" | "payout_entity_name"
  >;
}
