/* eslint-disable cypress/no-async-tests */
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { Constants } from "../../../api_support/constants";
import promisify from "cypress-promise";
import productMandatoryJSON from "cypress/resources/testdata/product/default_values_product.json";
import TestFilters from "../../../../support/filter_tests.js";
import { DateHelper } from "cypress/api/api_support/date_helpers";

//Test cases covered
//API_002 - Validate default value for effective_at
//API_003  - Validate default value for external_product_id
//API_012 - Validate default value for product_color
//API_015 - Validate default value for delinquent_on_n_consecutive_late_fees
//API_017 - Validate default value for charge_off_on_n_consecutive_late_fees
//API_021 - Validate default value for pending_pmt_affects_avail_credit
//API_024 - Validate default value for late_fee_grace
//API_028 - Validate default value for surcharge_fee_interval
//API_029 - Validate default value for default_surcharge_fee_structure
//API_038 - Validate default value for first_cycle_interval
//API_035 - Validate default value for cycle_due_interval
//API_041 - Validate default value for close_of_business_time
//API_042 - Validate default value for product_time_zone
//API_044 - Validate default value for interest_calc_time
//API_047 - Validate default value for default_late_fee_cents
//API_048 - Validate default value for default_payment_reversal_fee_cents
//API_050 - Validate default value for promo_len
//API_053 - Validate default value for promo_min_pay_type
//API_057 - Validate default value for promo_purchase_window_len
//API_058 - Validate default value for promo_min_pay_percent
//API_062 - Validate default value for promo_interest_deferred
//API_065 - Validate default value for promo_default_interest_rate_percent
//API_067 - Validate default value for promo_apr_range_inclusive_lower
//API_069 - Validate default value for promo_apr_range_inclusive_upper
//API_072 - Validate default value for post_promo_len
//API_077 - Validate default value for post_promo_am_len_range_inclusive_lower
//API_079 - Validate default value for post_promo_am_len_range_inclusive_upper
//API_081 - Validate default value for post_promo_min_pay_type
//API_084 - Validate default value for post_promo_default_interest_rate_percent
//API_087 - Validate default value for post_promo_apr_range_inclusive_lower
//API_089 - Validate default value for post_promo_apr_range_inclusive_upper
//API_093 - Validate default value for migration_mode

TestFilters(["regression", "product", "defaultFieldValidation"], () => {
  describe("Validate default values while creating product ", function () {

    const dateHelper = new DateHelper();
    const expResponseStatus = 200;
    let response;
    let expectedDefaultFieldValue: any;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    it(`should not able to create product `, async () => {
      const productJSONFile = Constants.templateFixtureFilePath.concat("/product/product_installment_mandatory.json");
      const productJSON = await promisify(cy.fixture(productJSONFile));
      response = await promisify(productAPI.createProduct(productJSON));
      expect(response.status).to.eql(expResponseStatus);
    });

    productMandatoryJSON.forEach((data) => {
      it(`should have to validate default value - '${data.tc_name}'`, async () => {
        const jsonPath = data.field_path;
        let actualDefaultFieldValue = eval("response.body." + jsonPath);

        // Converting response value to string as the test data from JSON is in
        // string format. Don't convert if the value is null
        if (actualDefaultFieldValue !== null) {
          actualDefaultFieldValue = actualDefaultFieldValue.toString().toLowerCase();
        }

        //If test data has current date, get current date
        expectedDefaultFieldValue = data.field_value.toLowerCase();
        if (expectedDefaultFieldValue === "current_date") {
          expectedDefaultFieldValue = dateHelper.getRollDate(0);
        }

        //Validate default value
        if (expectedDefaultFieldValue === "null") {
          expect(actualDefaultFieldValue,"check default value of ".concat(data.field_name)).to.be.null;
        } else {
          expect(actualDefaultFieldValue,"check default value of ".concat(data.field_name)).to.include(expectedDefaultFieldValue);
        }
      });
    });
  });
});
