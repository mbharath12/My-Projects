import { Constants, CycleTypeConstants } from "cypress/api/api_support/constants";
export class Product {
  createProduct(json) {
    return cy.request({
      method: "POST",
      url: "products",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  getAllProducts() {
    return cy.request({
      method: "GET",
      url: "products",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  getAllProductWithLimit(limit) {
    return cy.request({
      method: "GET",
      url: "products?offset=0&limit=".concat(limit),
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  //Create new product and return product id
  //ex:product.createNewProduct("payment_product.json")
  createNewProduct(fileName: string) {
    //Cypress.env("product_id", null)
    return cy.fixture(Constants.templateFixtureFilePath.concat("/product/", fileName)).then((productJson) => {
      this.createProduct(productJson).then((response) => {
        expect(response.status).to.eq(200);
        const productID = response.body.product_id;
        //Cypress.env("product_id", productID);
        return productID;
      });
    });
  }

  createProductWith7daysCycleInterval(fileName: string, updateCycleInterval: boolean, updateCycleDueInterval: boolean) {
    let cycleInterval = "";
    let cycleDueInterval = "";
    if (updateCycleInterval === true) {
      cycleInterval = CycleTypeConstants.cycle_interval_7days;
    }
    if (updateCycleDueInterval === true) {
      cycleDueInterval = CycleTypeConstants.cycle_interval_7days;
    }
    return this.createProductWithCycleInterval(fileName, cycleInterval, cycleDueInterval);
  }
  createProductWith14daysCycleInterval(
    fileName: string,
    updateCycleInterval: boolean,
    updateCycleDueInterval: boolean
  ) {
    let cycleInterval = "";
    let cycleDueInterval = "";
    if (updateCycleInterval === true) {
      cycleInterval = CycleTypeConstants.cycle_interval_14days;
    }
    if (updateCycleDueInterval === true) {
      cycleDueInterval = CycleTypeConstants.cycle_due_interval_14days;
    }
    return this.createProductWithCycleInterval(fileName, cycleInterval, cycleDueInterval);
  }
  createProductWith21daysCycleInterval(
    fileName: string,
    updateCycleInterval: boolean,
    updateCycleDueInterval: boolean
  ) {
    let cycleInterval = "";
    let cycleDueInterval = "";
    if (updateCycleInterval === true) {
      cycleInterval = CycleTypeConstants.cycle_interval_21days;
    }
    if (updateCycleDueInterval === true) {
      cycleDueInterval = CycleTypeConstants.cycle_due_interval_21days;
    }
    return this.createProductWithCycleInterval(fileName, cycleInterval, cycleDueInterval);
  }
  createProductWith1monthCycleInterval(
    fileName: string,
    updateCycleInterval: boolean,
    updateCycleDueInterval: boolean
  ) {
    let cycleInterval = "";
    let cycleDueInterval = "";
    if (updateCycleInterval === true) {
      cycleInterval = CycleTypeConstants.cycle_interval_1month;
    }
    if (updateCycleDueInterval === true) {
      cycleDueInterval = CycleTypeConstants.cycle_interval_1month;
    }
    return this.createProductWithCycleInterval(fileName, cycleInterval, cycleDueInterval);
  }

  createProductWithCycleInterval(fileName: string, cycleInterval: string, cycleDueInterval: string) {
    return cy.fixture(Constants.templateFixtureFilePath.concat("/product/", fileName)).then((productJson) => {
      if (cycleInterval.length !== 0) {
        productJson.product_lifecycle_policies.billing_cycle_policies.cycle_interval = cycleInterval;
      }
      if (cycleDueInterval.length !== 0) {
        productJson.product_lifecycle_policies.billing_cycle_policies.cycle_due_interval = cycleDueInterval;
      }
      this.createProduct(productJson).then((response) => {
        expect(response.status).to.eq(200);
        return response;
      });
    });
  }

  updatePaymentDuePoliciesNCreateProduct(fileName: string, delinquentValue: string, chargeOffValue: string) {
    return cy.fixture(Constants.templateFixtureFilePath.concat("/product/", fileName)).then((productJson) => {
      if (delinquentValue.length !== 0) {
        productJson.product_lifecycle_policies.payment_due_policies.delinquent_on_n_consecutive_late_fees = delinquentValue;
      }
      if (chargeOffValue.length !== 0) {
        productJson.product_lifecycle_policies.payment_due_policies.charge_off_on_n_consecutive_late_fees = chargeOffValue;
      }
      this.createProduct(productJson).then((response) => {
        expect(response.status).to.eq(200);
        return response;
      });
    });
  }

  //Create new product and return response
  //ex:product.updateNCreateProduct("payment_product.json",PickObject")
  updateNCreateProduct(templateFileName: string, updateData) {
    const productTemplateFile = Constants.templateFixtureFilePath.concat("/product/", templateFileName);
    return cy.fixture(productTemplateFile).then((productJson) => {
      if ("effective_at" in updateData) {
        productJson.effective_at = updateData.effective_at;
      }

      if ("product_type" in updateData) {
        productJson.product_overview.product_type = updateData.product_type;
        if (updateData.product_type === "delete") {
          delete productJson.product_overview.product_type;
        }
      }

      if ("effective_at" in updateData) {
        productJson.effective_at = updateData.effective_at;
        if (updateData.effective_at === "delete") {
          delete productJson.effective_at;
        }
      }
      if ("product_short_description" in updateData)
        productJson.product_overview.product_short_description = updateData.product_short_description;
      if (updateData.product_short_description === "delete") {
        delete productJson.product_overview.product_short_description;
      }

      if ("product_name" in updateData) {
        productJson.product_overview.product_name = updateData.product_name;
        if (updateData.product_name === "delete") {
          delete productJson.product_overview.product_name;
        }
      }

      if ("product_short_description" in updateData) {
        productJson.product_overview.product_short_description = updateData.product_short_description;
        if (updateData.product_short_description === "delete") {
          delete productJson.product_overview.product_short_description;
        }
      }
      if ("product_long_description" in updateData) {
        productJson.product_overview.product_long_description = updateData.product_long_description;
        if (updateData.product_long_description === "delete") {
          delete productJson.product_overview.product_long_description;
        }
      }
      if ("product_color" in updateData) {
        productJson.product_overview.product_color = updateData.product_color;
        if (updateData.product_color === "delete") {
          delete productJson.product_overview.product_color;
        }
      }

      if ("product_time_zone" in updateData) {
        productJson.product_lifecycle_policies.billing_cycle_policies.product_time_zone = updateData.product_time_zone;
      }
      if ("first_cycle_interval" in updateData) {
        productJson.product_lifecycle_policies.billing_cycle_policies.first_cycle_interval =
          updateData.first_cycle_interval;
        if (updateData.first_cycle_interval === "delete") {
          delete productJson.product_lifecycle_policies.billing_cycle_policies.first_cycle_interval;
        }
      }

      if ("delinquent_on_n_consecutive_late_fees" in updateData) {
        productJson.product_lifecycle_policies.payment_due_policies.delinquent_on_n_consecutive_late_fees =
          updateData.delinquent_on_n_consecutive_late_fees;
      }

      if ("charge_off_on_n_consecutive_late_fees" in updateData) {
        productJson.product_lifecycle_policies.payment_due_policies.charge_off_on_n_consecutive_late_fees =
          updateData.charge_off_on_n_consecutive_late_fees;
      }

      if ("late_fee_grace" in updateData) {
        productJson.product_lifecycle_policies.fee_policies.late_fee_grace = updateData.late_fee_grace;
      }

      if ("surcharge_fee_interval" in updateData) {
        productJson.product_lifecycle_policies.fee_policies.surcharge_fee_interval = updateData.surcharge_fee_interval;
      }

      if ("surcharge_end_exclusive_cents" in updateData) {
        productJson.product_lifecycle_policies.fee_policies.default_surcharge_fee_structure.surcharge_end_exclusive_cents =
          updateData.surcharge_end_exclusive_cents;
      }

      if ("surcharge_start_inclusive_cents" in updateData) {
        productJson.product_lifecycle_policies.fee_policies.default_surcharge_fee_structure.surcharge_start_inclusive_cents =
          updateData.surcharge_start_inclusive_cents;
      }

      if ("percent_surcharge" in updateData) {
        productJson.product_lifecycle_policies.fee_policies.default_surcharge_fee_structure.percent_surcharge =
          updateData.percent_surcharge;
      }

      if ("cycle_interval" in updateData) {
        productJson.product_lifecycle_policies.billing_cycle_policies.cycle_interval = updateData.cycle_interval;
      }
      if ("close_of_business_time" in updateData) {
        productJson.product_lifecycle_policies.billing_cycle_policies.close_of_business_time =
          updateData.close_of_business_time;
      }

      if ("interest_calc_time" in updateData) {
        productJson.product_lifecycle_policies.interest_policies.interest_calc_time = updateData.interest_calc_time;
      }

      if ("product_time_zone" in updateData) {
        productJson.product_lifecycle_policies.billing_cycle_policies.product_time_zone = updateData.product_time_zone;
      }

      if ("cycle_due_interval" in updateData) {
        productJson.product_lifecycle_policies.billing_cycle_policies.cycle_due_interval =
          updateData.cycle_due_interval;
        if (updateData.cycle_due_interval === "delete") {
          delete productJson.product_lifecycle_policies.billing_cycle_policies.cycle_due_interval;
        }
      }
      if ("default_credit_limit_cents" in updateData) {
        productJson.product_lifecycle_policies.default_attributes.default_credit_limit_cents =
          updateData.default_credit_limit_cents;
      }

      if ("promo_len" in updateData) {
        //Check for the existence of promo_len attribute in productJson and then update it
        if ("promo_len" in productJson.promotional_policies) {
          productJson.promotional_policies.promo_len = updateData.promo_len;
          // Given -1 to delete promo_len as the datatype is integer
          if (updateData.promo_len === -1) {
            delete productJson.promotional_policies.promo_len;
          }
        }
      }

      if ("promo_min_pay_type" in updateData) {
        //Check for the existence of promo_min_pay_type attribute in productJson and then update it
        if ("promo_min_pay_type" in productJson.promotional_policies) {
          productJson.promotional_policies.promo_min_pay_type = updateData.promo_min_pay_type;
        }
        if (updateData.promo_min_pay_type === "delete") {
          delete productJson.promotional_policies.promo_min_pay_type;
        }
      }
      if ("promo_purchase_window_len" in updateData) {
        productJson.promotional_policies.promo_purchase_window_len = updateData.promo_purchase_window_len;
        // Given -1 to delete promo_purchase_window_len as the datatype is integer
        if (updateData.promo_purchase_window_len === -1) {
          delete productJson.promotional_policies.promo_purchase_window_len;
        }
      }

      if ("promo_default_interest_rate_percent" in updateData) {
        //Check for the existence of promo_default_interest_rate_percent attribute in productJson and then update it
        if ("promo_default_interest_rate_percent" in productJson.promotional_policies) {
          productJson.promotional_policies.promo_default_interest_rate_percent =
            updateData.promo_default_interest_rate_percent;
        }
        // Given -1 to delete promo_default_interest_rate_percent as the datatype is integer
        if (updateData.promo_default_interest_rate_percent === -1) {
          delete productJson.promotional_policies.promo_default_interest_rate_percent;
        }
      }

      if ("promo_min_pay_percent" in updateData) {
        //Check for the existence of promo_min_pay_percent attribute in productJson and then update it
        if ("promo_min_pay_percent" in productJson.promotional_policies) {
          productJson.promotional_policies.promo_min_pay_percent = updateData.promo_min_pay_percent;
        }
        // Given -1 to delete promo_min_pay_percent as the datatype is integer
        if (updateData.promo_min_pay_percent === -1) {
          delete productJson.promotional_policies.promo_min_pay_percent;
        }
      }

      if ("promo_apr_range_inclusive_lower" in updateData) {
        productJson.promotional_policies.promo_apr_range_inclusive_lower = updateData.promo_apr_range_inclusive_lower;
        // Given -1 to delete promo_apr_range_inclusive_lower as the datatype is integer
        if (updateData.promo_apr_range_inclusive_lower === -1) {
          delete productJson.promotional_policies.promo_apr_range_inclusive_lower;
        }
      }

      if ("promo_apr_range_inclusive_upper" in updateData) {
        productJson.promotional_policies.promo_apr_range_inclusive_upper = updateData.promo_apr_range_inclusive_upper;
        // Given -1 to delete promo_apr_range_inclusive_upper as the datatype is integer
        if (updateData.promo_apr_range_inclusive_upper === -1) {
          delete productJson.promotional_policies.promo_apr_range_inclusive_upper;
        }
      }

      if ("post_promo_len" in updateData) {
        //Check for the existence of post_promo_len attribute in productJson and then update it
        if ("post_promo_len" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_len = updateData.post_promo_len;
        }
        // Given -1 to delete post_promo_len as the datatype is integer
        if (updateData.post_promo_len === -1) {
          delete productJson.post_promotional_policies.post_promo_len;
        }
      }

      if ("post_promo_am_len_range_inclusive_lower" in updateData) {
        //Check for the existence of post_promo_am_len_range_inclusive_lower attribute in productJson and then update it
        if ("post_promo_am_len_range_inclusive_lower" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_am_len_range_inclusive_lower =
            updateData.post_promo_am_len_range_inclusive_lower;
        }
        // Given -1 to delete post_promo_am_len_range_inclusive_lower as the datatype is integer
        if (updateData.post_promo_am_len_range_inclusive_lower === -1) {
          delete productJson.post_promotional_policies.post_promo_am_len_range_inclusive_lower;
        }
      }

      if ("post_promo_am_len_range_inclusive_upper" in updateData) {
        //Check for the existence of post_promo_am_len_range_inclusive_upper attribute in productJson and then update it
        if ("post_promo_am_len_range_inclusive_upper" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_am_len_range_inclusive_upper =
            updateData.post_promo_am_len_range_inclusive_upper;
        }
        // Given -1 to delete post_promo_am_len_range_inclusive_upper as the datatype is integer
        if (updateData.post_promo_am_len_range_inclusive_upper === -1) {
          delete productJson.post_promotional_policies.post_promo_am_len_range_inclusive_upper;
        }
      }
      if ("post_promo_min_pay_type" in updateData) {
        //Check for the existence of post_promo_min_pay_type attribute in productJson and then update it
        if ("post_promo_min_pay_type" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_min_pay_type = updateData.post_promo_min_pay_type;
        }
        // Given -1 to delete post_promo_min_pay_type as the datatype is integer
        if (updateData.post_promo_min_pay_type === -1) {
          delete productJson.post_promotional_policies.post_promo_min_pay_type;
        }
      }

      if ("post_promo_default_interest_rate_percent" in updateData) {
        //Check for the existence of post_promo_default_interest_rate_percent attribute in productJson and then update it
        if ("post_promo_default_interest_rate_percent" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_default_interest_rate_percent =
            updateData.post_promo_default_interest_rate_percent;
        }
        // Given -1 to delete post_promo_default_interest_rate_percent as the datatype is integer
        if (updateData.post_promo_default_interest_rate_percent === -1) {
          delete productJson.post_promotional_policies.post_promo_default_interest_rate_percent;
        }
      }

      if ("post_promo_apr_range_inclusive_lower" in updateData) {
        if ("post_promo_apr_range_inclusive_lower" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_apr_range_inclusive_lower =
            updateData.post_promo_apr_range_inclusive_lower;
        }
        // Given -1 to delete post_promo_apr_range_inclusive_lower as the datatype is integer
        if (updateData.post_promo_apr_range_inclusive_lower === -1) {
          delete productJson.post_promotional_policies.post_promo_apr_range_inclusive_lower;
        }
      }
      if ("post_promo_apr_range_inclusive_upper" in updateData) {
        if ("post_promo_apr_range_inclusive_upper" in productJson.post_promotional_policies) {
          productJson.post_promotional_policies.post_promo_apr_range_inclusive_upper =
            updateData.post_promo_apr_range_inclusive_upper;
        }
        // Given -1 to delete post_promo_apr_range_inclusive_upper as the datatype is integer
        if (updateData.post_promo_apr_range_inclusive_upper === -1) {
          delete productJson.post_promotional_policies.post_promo_apr_range_inclusive_upper;
        }
      }

      if ("pending_pmt_affects_avail_credit" in updateData) {
        if (updateData.pending_pmt_affects_avail_credit.toLowerCase() === "false") {
          productJson.product_lifecycle_policies.payment_pouring_policies.pending_pmt_affects_avail_credit = false;
        }
        if (updateData.pending_pmt_affects_avail_credit.toLowerCase() === "true") {
          productJson.product_lifecycle_policies.payment_pouring_policies.pending_pmt_affects_avail_credit = true;
        }
      }

      if ("promo_interest_deferred" in updateData) {
        if (updateData.promo_interest_deferred.toLowerCase() === "false") {
          productJson.promotional_policies.promo_interest_deferred = false;
        }
        if (updateData.promo_interest_deferred.toLowerCase() === "true") {
          productJson.promotional_policies.promo_interest_deferred = true;
        }
        // Given -1 to delete promo_interest_deferred as the datatype is integer
        if (updateData.promo_interest_deferred === -1) {
          delete productJson.promotional_policies.promo_interest_deferred;
        }
      }
      if ("delete_field_name" in updateData) {
        delete productJson[updateData.delete_field_name];
      }

      if ("first_cycle_interval_del" in updateData) {
        delete productJson.product_lifecycle_policies.billing_cycle_policies.first_cycle_interval;
      }

      if ("migration_mode" in updateData) {
        productJson.admin.migration_mode = updateData.migration_mode;
      }
      if ("product_id" in updateData) {
        productJson.product_id = updateData.product_id;
      }
      cy.log(JSON.stringify(productJson));
      this.createProduct(productJson).then((response) => {
        if ("doNot_check_response_status" in updateData === false) {
          expect(response.status).to.eq(200);
        }
        return response;
      });
    });
  }
}

export const productAPI = new Product();

export interface ProductPayload {
  effective_at?: string;
  product_type?: string;
  product_name?: string;
  product_short_description?: string;
  product_long_description?: string;
  product_color?: string;
  delinquent_on_n_consecutive_late_fees?: number;
  charge_off_on_n_consecutive_late_fees?: number;
  late_fee_grace?: string;
  product_time_zone?: string;
  cycle_interval?: string;
  cycle_due_interval?: string;
  first_cycle_interval?: string;
  first_cycle_interval_del?: string;
  default_credit_limit_cents?: string;
  promo_int?: number;
  promo_len?: number;
  promo_min_pay_type?: string;
  promo_purchase_window_len?: number;
  promo_interest_deferred?: string;
  promo_default_interest_rate_percent?: number;
  promo_min_pay_percent?: number;
  promo_apr_range_inclusive_lower?: number;
  promo_apr_range_inclusive_upper?: number;
  post_promo_default_am_len?: number;
  post_promo_len?: number;
  post_promo_am_len_range_inclusive_lower?: number;
  post_promo_am_len_range_inclusive_upper?: number;
  post_promo_min_pay_type?: string;
  post_promo_default_interest_rate_percent?: number;
  post_promo_apr_range_inclusive_lower?: number;
  post_promo_apr_range_inclusive_upper?: number;
  delete_field_name?: string;
  doNot_check_response_status?: boolean;
  close_of_business_time?: string;
  interest_calc_time?: string;
  surcharge_fee_interval?: string;
  surcharge_start_inclusive_cents?: number;
  surcharge_end_exclusive_cents?: number;
  percent_surcharge?: number;
  pending_pmt_affects_avail_credit?: string;
  migration_mode?: boolean;
  product_id?: string;
}
