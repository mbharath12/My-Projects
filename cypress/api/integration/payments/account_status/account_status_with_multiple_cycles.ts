import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import promisify from "cypress-promise";
import accountStatusJSON from "../../../../resources/testdata/account/account_status_with_cycles.json";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//pp451 - Verify Account status is suspended after 5 cycles and at 6th cycle
// status is closed
//pp453 - Verify Account status is suspended after 12 cycles and at 13th cycle
// status is closed

TestFilters(["regression", "accountStatus"], () => {
  //Validate account status with different products and settings
  describe("Account Status Validation with multiple cycles", function () {
    let accountID;
    let productID;
    let customerID;
    let response;
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    //Create new customer
    it("should have customer ", async () => {
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });
    accountStatusJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //Create product JSON
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.first_cycle_interval,
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct(data.product_json_file, productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update payload and create an account
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_dt,
        };
        //Create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
      });

      it(`should be able to roll time forward with first cycle interval - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(data.account_effective_dt, 8);
        rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
          expect(response.status).to.eq(200);
        });
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status, "Verify account status after first cycle interval").to.eq(
          data.account_status
        );
      });
      it(`should validate account status is suspended after multiple cycles - '${data.tc_name}'`, async () => {
        rollTimeAPI.rollAccountForward(accountID, data.suspended_roll_forward_dt.slice(0, 10)).then((response) => {
          expect(response.status).to.eq(200);
        });
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(
          response.body.account_overview.account_status,
          "Verify account status after multiple cycle interval"
        ).to.eq(data.account_status_after_multiple_cycles);
      });
      it(`should validate account status is closed after suspended cycle interval  - '${data.tc_name}'`, async () => {
        rollTimeAPI.rollAccountForward(accountID, data.chargeoff_roll_forward_dt.slice(0, 10)).then((response) => {
          expect(response.status).to.eq(200);
        });
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(
          response.body.account_overview.account_status,
          "Verify account status after suspended cycle interval"
        ).to.eq(data.account_status_next_suspended_cycle);
      });
    });
  });
});
type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "first_cycle_interval"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
>;
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at">;
