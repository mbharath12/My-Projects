import { AccountPayload, accountAPI } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { organizationAPI } from "../../../api_support/organization";
import { Constants } from "../../../api_support/constants";
import { paymentProcessorValidator } from "../../../api_validation/payment_processor_validation";
import { authAPI } from "../../../api_support/auth";
import promisify from "cypress-promise";
import accountMandatoryJSON from "cypress/resources/testdata/paymentprocessor/debitcard_repay_mandatory_field_validation.json";
import TestFilters from "../../../../support/filter_tests.js";

//Test cases covered
//API_132 - create account without repay_card_number
//API_133 - create account without repay_exp_date
//API_135 - create account without repay_name_on_card
//API_136 - create account without repay_street
//API_137 - create account without repay_zip

TestFilters(["regression", "paymentProcessor", "debitCard", "mandatoryFieldValidation"], () => {
  describe("Validate create account without entering mandatory field in payment processor debit card", function () {
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
          repay_card_number: data.repay_card_number,
          repay_exp_date: data.repay_exp_date,
          repay_name_on_card: data.repay_name_on_card,
          repay_street: data.repay_street,
          repay_zip: data.repay_zip,
          doNot_check_response_status: true,
        };
        const response = await promisify(
          accountAPI.updateNCreatePaymentProcessorAccount("account_payment_processor_debit_card_repay.json", accountPayload)
        );
        //Check status and error message when mandatory field is not in payload
        expect(response.status, "check response code when mandatory field is not in payload").to.eq(400);
        expect(response.body.error.message, "check response error message").to.eq(data.error_message);
        expect(response.body.error.details.length, "check detailed error message is displayed").to.not.eq(0)
        expect(response.body.error.details[0].message, "check detailed error message").to.eq(data.detailed_error_message);

      });
    });
  });
});

type CreateAccount = Pick<
AccountPayload,
  | "product_id"
  | "customer_id"
  | "repay_card_number"
  | "repay_exp_date"
  | "repay_zip"
  | "repay_name_on_card"
  | "repay_street"
  | "doNot_check_response_status"
>;
