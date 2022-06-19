import { productAPI } from "../../../api_support/product";
import { payoutAPI, payoutEntityPayload } from "../../../api_support/payoutEntity";
import { authAPI } from "../../../api_support/auth";
import promisify from "cypress-promise";
import payoutJSON from "../../../../resources/testdata/payoutentity/payout_entity_mandatory_field_validation.json";
import TestFilters from "../../../../support/filter_tests.js";

//Test cases covered
//PayoutEntity-256A-259A-General-Create payout entity without entity type,entity name,bank account number and routing number
//PayoutEntity-271A-274A-Merchant-Create payout entity without entity type,entity name,bank account number and routing number
//PayoutEntity-288A-291A-Lender-Create payout entity without entity type,entity name,bank account number and routing number
//PayoutEntity-305A-308A-ACH Source-Create payout entity without entity type,entity name,bank account number and routing number
//PayoutEntity-321A-324A-Debit Source-Create payout entity without entity type,entity name,bank account number and routing number
//PayoutEntity-337A-340A-Lock box-Create payout entity without entity type,entity name,bank account number and routing number

if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
  TestFilters(["regression", "payoutEntity", "mandatoryFieldValidation"], () => {
    describe("Validate create payout entity without entering mandatory fields", function () {
      let productID;
      let response;

      before(async () => {
        authAPI.getDefaultUserAccessToken();
        productID = await promisify(productAPI.createNewProduct("product_revolving.json"));
        cy.log("New product created :" + productID);
      });
      payoutJSON.forEach((data) => {
        it(`should have create payout entity '${data.tc_name}' `, async () => {
          const payoutFileName = data.payout_entity_file_name;
          //Update payload and create payout entity
          const payoutEntityPayload: CreatePayoutEntity = {
            payout_entity_type: data.exp_payout_entity_type,
            bank_account_number: data.exp_bank_account_number,
            payout_entity_name: data.exp_payout_entity_name,
            bank_routing_number: data.exp_bank_routing_number,
            irs_tin: data.exp_irs_tin,
            doNot_check_response_status: true,
          };
          response = await promisify(payoutAPI.updateNCreatePayoutEntity(payoutFileName, payoutEntityPayload));
          expect(response.status.toString(), "Validate the response code of the payout entity").to.eq(
            data.response.toString()
          );
          if (data.response !== "200") {
            //Check status and error message when mandatory field is not in payload
            expect(response.body.error.message, "check response error message").to.eq(data.error_message);
            if (data.detailed_error_message.length !== 0) {
              expect(response.body.error.details.length, "check detailed error message is displayed").to.not.eq(0);
              expect(response.body.error.details[0].message, "check detailed error message").to.eq(
                data.detailed_error_message
              );
            }
          }
        });
      });
    });
  });
}
type CreatePayoutEntity = Pick<
  payoutEntityPayload,
  | "doNot_check_response_status"
  | "payout_entity_name"
  | "payout_entity_type"
  | "bank_account_number"
  | "bank_routing_number"
  | "irs_tin"
>;
