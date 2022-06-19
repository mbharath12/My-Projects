import { AccountPayload, accountAPI } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { organizationAPI } from "../../../api_support/organization";
import { Constants } from "../../../api_support/constants";
import { paymentProcessorValidator } from "../../../api_validation/payment_processor_validation";
import { authAPI } from "../../../api_support/auth";
import promisify from "cypress-promise";
import accountMandatoryJSON from "../../../../resources/testdata/paymentprocessor/repay_mandatory_field_validation.json";
import TestFilters from "../../../../support/filter_tests.js";

//Test cases covered
//API_105 - create account without payment_processor_name field_name
//API_110 - create account without repay_check_type field_name
//API_112 - create account without repay_account_type field_name
//API_114 - create account without repay_transit_number field_name
//API_115 - create account without repay_account_number field_name
//API_116 - create account without repay_name_on_check field_name

TestFilters(["regression", "paymentProcessorRepay", "mandatoryFieldValidation"], () => {
  describe("Validate create account without entering mandatory field in payment processor repay", function () {
    let productID;
    let customerID;
    before(() => {
      authAPI.getDefaultUserAccessToken();
      // Update payment processor at organization level - repay
      const configJSON = Constants.templateFixtureFilePath.concat("/credentials/repay_configs");
      cy.fixture(configJSON).then((processorJson) => {
        organizationAPI.updatePaymentProcessorConfigs(processorJson).then((response) => {
          paymentProcessorValidator.validatePaymentProcessConfigResponse(response, "REPAY");
        });
      });
    });

    it("should have create product and customer ", async () => {
      //Create a product
      productID = await promisify(productAPI.createNewProduct("product_payment_processing.json"));
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    accountMandatoryJSON.forEach((data) => {
      it(`should have not create an account - '${data.tc_name}'`, async () => {
        //Update payload and create an account
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          payment_processor_name: data.payment_processor_name,
          repay_account_type: data.repay_account_type,
          repay_transit_number: data.repay_transit_number,
          repay_account_number: data.repay_account_number,
          repay_name_on_check: data.repay_name_on_check,
          repay_check_type: data.repay_check_type,
          doNot_check_response_status: true,
        };
        const response = await promisify(
          accountAPI.updateNCreatePaymentProcessorAccount("account_payment_processor_ach_repay.json", accountPayload)
        );
        //Check status and error message when mandatory field is not in payload
        expect(response.status, "check response code when mandatory field is not in payload").to.eq(400);
        expect(response.body.error.message, "check response error message").to.eq(data.error_message);
        expect(response.body.error.details.length, "check detailed error message is displayed").to.not.eq(0);
        expect(response.body.error.details[0].message, "check detailed error message").to.eq(
          data.detailed_error_message
        );
      });
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "doNot_check_response_status"
  | "payment_processor_name"
  | "repay_account_type"
  | "repay_transit_number"
  | "repay_account_number"
  | "repay_name_on_check"
  | "repay_check_type"
>;
