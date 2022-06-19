/* eslint-disable cypress/no-async-tests */
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import tiimeZoneJSON from "../../../resources/testdata/timezone/product_time_zones.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { accountAPI, AccountPayload } from "../../api_support/account";

//Test Cases covered
// TZ_001 - Validate time zone for America Birmingham
// TZ_002 - Validate time zone for America Birmingham
// TZ_003 - Validate time zone for America LosAngeles
// TZ_004 - Validate time zone for America LosAngeles
// TZ_005 - Validate time zone for America Phoenix
// TZ_006 - Validate time zone for America Adak
// TZ_007 - Validate time zone for America Unalaska
// TZ_008 - Validate time zone for America Chicago
// TZ_009 - Validate time zone for America Springfield
// TZ_010 - Validate time zone for America New York City
// TZ_011 - Validate time zone for America Houston
// TZ_012 - Validate time zone for America Seattle
// TZ_013 - Validate time zone for America Newark
// TZ_014 - Validate time zone for America Portland
// TZ_015 - Validate time zone for America Portland
// TZ_016 - Validate time zone for America Denver

TestFilters(["regression", "timezone", "region"], () => {
  let productID;
  let customerID;
  describe("Validate time zones", function () {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    //Create a new revolving installment product and new customer
    it("should have create customer ", async () => {
      await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    //iterate each product and account
    tiimeZoneJSON.forEach((data) => {
      it(`should able to create product for '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          product_time_zone: data.product_time_zone,
          effective_at: data.product_effective_at,
          close_of_business_time: data.product_close_of_business_time,
          interest_calc_time: data.product_interest_calc_time,
        };
        //Update payload and create an product and validate
        const response = await promisify(productAPI.updateNCreateProduct("product.json", productPayload));
        productID = response.body.product_id;
        expect(response.body.effective_at).to.eq(data.response_effective_at);
        expect(response.body.product_lifecycle_policies.billing_cycle_policies.close_of_business_time).to.eq(
          data.response_close_of_business_time
        );
        expect(response.body.product_lifecycle_policies.interest_policies.interest_calc_time).to.eq(
          data.response_interest_calc_time
        );
      });
      it(`should be able to create a new account`, async () => {
        //Create account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
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

