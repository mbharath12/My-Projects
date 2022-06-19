/* eslint-disable cypress/no-async-tests */
import { productAPI, ProductPayload } from "cypress/api/api_support/product";
import { authAPI } from "cypress/api/api_support/auth";
import productProcessingJSON from "cypress/resources/testdata/product/product_field_validation.json";
import TestFilters from "cypress/support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1176  - Verify product name is mandatory in Product Overview Section
//PP1176A - Verify product type is mandatory in Product Overview Section
//PP1176B - Verify product short description is mandatory in Product Overview Section
//PP1176C - Verify product long description is mandatory in Product Overview Section
//PP1176D - Verify product color is not mandatory in Product Overview Section
//PP1177  - Verify revolving product type allowed
//PP1177A - Verify installment product type allowed
//PP1177B - Verify mixed installment product type allowed
//PP1177C - Verify revolving charge card  product type allowed
//PP1177D - Verify revolving credit product type allowed

TestFilters(["regression", "product"], () => {
  describe("Creation and validation of products fields", function () {
    let productJSONFile;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    //iterate through each product
    productProcessingJSON.forEach((data) => {
      describe(`should have create product - '${data.tc_name}'`, () => {
        it(`should have create product`, async () => {
          productJSONFile = data.exp_product_file_name;
          //Update Cycle_interval,Cycle_due,Promo policies
          const productPayload: CreateProduct = {
            product_type: data.product_type,
            cycle_interval: data.cycle_interval,
            cycle_due_interval: data.cycle_due_interval,
            promo_len: parseInt(data.promo_len),
            promo_min_pay_type: data.promo_min_pay_type,
            promo_default_interest_rate_percent: parseInt(data.promo_default_interest_rate_percent),
            promo_min_pay_percent: parseInt(data.promo_min_pay_percent),
            delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
            charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
            product_name: data.product_name,
            product_short_description: data.product_short_description,
            product_long_description: data.product_long_description,
            product_color: data.product_color,
            doNot_check_response_status: false,
          };

          const response = await promisify(productAPI.updateNCreateProduct(productJSONFile, productPayload));
          if (parseInt(data.exp_status) === 400) {
            expect(response.body.error.details[0].message, "check detailed error message").to.eq(
              data.detailed_error_message
            );
            expect(response.status, "product should not be created without the mandatory field").to.eq(
              parseInt(data.exp_status)
            );
          }
          cy.log("new product created successfully: " + response.body.product_id);
        });
      });
    });
    type CreateProduct = Pick<
      ProductPayload,
      | "product_type"
      | "cycle_interval"
      | "cycle_due_interval"
      | "promo_len"
      | "promo_min_pay_type"
      | "promo_default_interest_rate_percent"
      | "promo_min_pay_percent"
      | "delinquent_on_n_consecutive_late_fees"
      | "charge_off_on_n_consecutive_late_fees"
      | "product_name"
      | "product_short_description"
      | "product_long_description"
      | "product_color"
      | "doNot_check_response_status"
    >;
  });
});
