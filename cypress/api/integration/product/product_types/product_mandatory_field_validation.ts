/* eslint-disable cypress/no-async-tests */
import { Product } from "../../../api_support/product";
import { Auth } from "../../../api_support/auth";
import { JSONUpdater } from "../../../api_support/jsonUpdater";
import { Constants } from "../../../api_support/constants";
import promisify from "cypress-promise";
import productMandatoryJSON from "cypress/resources/testdata/product/mandatory_field_validation.json";
import TestFilters from "../../../../support/filter_tests.js";

//Test cases covered
//API_001 - create product without product overview section header key
//API_004 - create product without product name key
//API_005 - create product without product type key
//API_010 - create product without product short description key
//API_011 - create product without product long description key
//API_014 - create product without product lifecycle policies section header key
//API_034 - create product without cycle interval
//API_046 - create product without default credit limit
//API_049 - create product without promotional policies section header key
//API_071 - create product without post promotional policies
TestFilters(["regression", "product", "mandatoryFieldValidation"], () => {
  describe("Validate create product without entering mandatory field", function () {
    const product = new Product();
    const jsonUpdater = new JSONUpdater();
    const testCaseID = "product_mandatory_field_";
    const expResponseStatus = 400;

    before(() => {
      const auth = new Auth();
      auth.getDefaultUserAccessToken();
    });

    productMandatoryJSON.forEach((data) => {
      it(`should not able to create product - '${data.tc_name}'`, async () => {
        //Try to create product without entering mandatory field
        const productFileName = "/create_product_".concat(testCaseID, data.index, ".json");
        const productModifyJSON = Constants.tempResourceFilePath.concat(productFileName);
        cy.log(data.key_name);
        jsonUpdater.deleteJSON(
          Constants.templateResourceFilePath.concat("/product/product.json"),
          productModifyJSON,
          data.key_name
        );

        const productJSONFile = Constants.tempFixtureFilePath.concat(productFileName);
        const productJSON = await promisify(cy.fixture(productJSONFile));
        product.createProduct(productJSON).then((response) => {
          expect(response.status, "check response code when mandatory key is not in payload").to.eq(expResponseStatus);
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
