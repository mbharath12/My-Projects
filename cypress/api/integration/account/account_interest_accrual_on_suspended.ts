import { productAPI, ProductPayload } from "../../api_support/product";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { authAPI } from "../../api_support/auth";
import { customerAPI } from "../../api_support/customer";
import { rollTimeAPI } from "../../api_support/rollTime";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { CycleTypeConstants } from "../../api_support/constants";
import { dateHelper } from "../../api_support/date_helpers";

//Test Scripts
//PP457 - Account status verifications - Interest accrual on Suspended account Installment

TestFilters(["regression", "accountStatus"], () => {
  //Validate account status with Interest accrual on Suspended account
  describe("Validate Account Status - Interest accrual on Suspended account", function () {
    let accountID;
    let productID;
    let response;
    let firstCycleTotalBalance;
    let secondCycleTotalBalance;

    const initialPrinciple = 10000;
    const accountEffectiveDate = "2021-08-10T02:18:27-08:00";

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
      });
    });

    it(`should have create product `, async () => {
      //Update product payload
      const productPayload: CreateProduct = {
        cycle_interval: CycleTypeConstants.cycle_interval_7days,
        cycle_due_interval: CycleTypeConstants.cycle_due_interval_7days,
        first_cycle_interval: CycleTypeConstants.first_cycle_interval_7days,
        delinquent_on_n_consecutive_late_fees: 2,
        charge_off_on_n_consecutive_late_fees: 4,
      };
      response = await promisify(productAPI.updateNCreateProduct("payment_product.json", productPayload));
      productID = response.body.product_id;
    });

    it(`should have create account and assign customer `, async () => {
      const accountPayload: CreateAccount = {
        product_id: productID,
        customer_id: Cypress.env("customer_id"),
        effective_at: accountEffectiveDate,
        first_cycle_interval: CycleTypeConstants.first_cycle_interval_7days,
        initial_principal_cents: initialPrinciple,
      };
      //Create account and assign to customer
      response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      cy.log("new account created : " + accountID);
    });

    //Calling roll time forward to update account
    it(`should have to wait for account roll time forward `, async () => {
      //Roll time forward to update account
      const endDate = dateHelper.getStatementDate(accountEffectiveDate, 23);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });

    it(`should have validate account status and interest is added to total for first cycle`, async () => {
      //Validate the account status
      response = await promisify(accountAPI.getAccountById(accountID));
      expect(response.status).to.eq(200);
      expect(response.body.account_overview.account_status).to.eq("SUSPENDED");
      firstCycleTotalBalance = response.body.summary.total_balance_cents;
      expect(parseInt(firstCycleTotalBalance)).to.greaterThan(initialPrinciple);
    });
    //Calling roll time forward to update account for second cycle
    it(`should have to wait for account roll time forward `, async () => {
      //Roll time forward to update account
      const endDate = dateHelper.getStatementDate(accountEffectiveDate, 33);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });

    it(`should have validate account status and interest is added to total for second cycle`, async () => {
      //Validate the account status
      response = await promisify(accountAPI.getAccountById(accountID));
      expect(response.status).to.eq(200);
      expect(response.body.account_overview.account_status).to.eq("SUSPENDED");
      secondCycleTotalBalance = response.body.summary.total_balance_cents;
      expect(parseInt(secondCycleTotalBalance)).to.greaterThan(parseInt(firstCycleTotalBalance));
      expect(parseInt(secondCycleTotalBalance)).to.greaterThan(initialPrinciple);
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
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "first_cycle_interval" | "initial_principal_cents"
>;
