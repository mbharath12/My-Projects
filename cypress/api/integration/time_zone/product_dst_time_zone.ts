/* eslint-disable cypress/no-async-tests */
import { customerAPI } from "../../api_support/customer";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import timeZoneJSON from "../../../resources/testdata/timezone/dst_time_zones.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { timeZone } from "../../api_support/timezone";

//Test Cases covered
// TZ_001 - Validate day light savings time zone for America Denver
// TZ_002 - Validate normal time zone for America Denver
// TZ_003 - Validate day light savings time zone for America Chicago
// TZ_004 - Validate normal time zone for America Chicago
// TZ_005 - Validate day light savings time zone for America Detroit
// TZ_006 - Validate normal time zone for America Detroit
// TZ_007 - Validate day light savings time zone for America Dawson
// TZ_008 - Validate normal time zone for America Dawson

TestFilters(["regression", "dstTimeZone", "product"], () => {
  let productID;
  let customerID;
  describe("Validate day light savings time zones", function () {
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });
    //iterate each product and account
    timeZoneJSON.forEach((data) => {
      it(`should able to create product for '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          product_time_zone: data.product_time_zone,
          effective_at: data.product_req_effective_at,
          close_of_business_time: data.product_close_of_business_time,
          interest_calc_time: data.product_interest_calc_time,
        };
        //Update payload and create an product and validate
        const response = await promisify(productAPI.updateNCreateProduct("product.json", productPayload));
        const expEffectiveAt = timeZone.convertDateToGivenTimezone(data.product_req_effective_at, Cypress.env("TIMEZONE"));
        productID = response.body.product_id;
        expect(response.body.effective_at).to.eq(expEffectiveAt);
        expect(response.body.product_lifecycle_policies.billing_cycle_policies.close_of_business_time).to.eq(
          data.response_close_of_business_time
        );
        expect(response.body.product_lifecycle_policies.interest_policies.interest_calc_time).to.eq(
          data.response_interest_calc_time
        );
      });
      //Create an account
      it(`should be able to create a new account`, async () => {
        //Create account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_req_effective_at,
        };
        //Update payload and create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
        expect(response.status).to.eq(200);
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  "product_time_zone" | "effective_at" | "interest_calc_time" | "close_of_business_time"
>;
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at">;

