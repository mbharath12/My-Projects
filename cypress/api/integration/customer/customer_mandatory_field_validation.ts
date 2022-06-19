/* eslint-disable cypress/no-async-tests */
import { customerAPI } from "../../api_support/customer";
import { authAPI } from "../../api_support/auth";
import { Constants } from "../../api_support/constants";
import customerMandatoryJSON from "../../../resources/testdata/customer/customer_mandatory_field_validation.json";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered
//API_221 - create customer without name_first
//API_223 - create customer without name_last
//API_225 - create customer without phone_number
//API_226  - create customer without address_line_one
//API_228  - create customer without address_city
//API_229  - create customer without address_state
//API_230  - create customer without address_zip
//API_234  - create customer without email
//API_235  - create customer without date_of_birth
//API_237  - create customer without business_legal_name
//API_238  - create customer without doing_business_as
//API_239  - create customer without business_ein

TestFilters(["regression", "customer", "mandatoryFieldValidation"], () => {
  describe("Validate create customer without entering mandatory fields", function () {
    const expResponseStatus = 400;
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    customerMandatoryJSON.forEach((data) => {
      it(`should not able to create customer - '${data.tc_name}'`, () => {
        //Try to create customer without entering mandatory field
        let customerJSON;
        const customerJSONTemplateFile = Constants.templateFixtureFilePath.concat("/customer/business_customer.json");
        cy.fixture(customerJSONTemplateFile).then((newCustomerJSON) => {
          customerJSON = newCustomerJSON;
          if (data.field_name.includes("business")) {
            delete customerJSON.business_details[data.field_name];
          } else {
            delete customerJSON[data.field_name];
          }
          customerAPI.createCustomer(customerJSON).then((response) => {
            expect(
              response.status,
              "check response code when mandatory ".concat(data.field_name, "key is not in payload")
            ).to.eq(expResponseStatus);
            expect(response.body.error.message, "check response error message").to.eq(data.error_message);
            expect(response.body.error.details.length, "check detailed error message is displayed").to.not.eq(0);
            expect(response.body.error.details[0].message, "check detailed error message").to.eq(
              data.detailed_error_message
            );
          });
        });
      });
    });
  });
});
