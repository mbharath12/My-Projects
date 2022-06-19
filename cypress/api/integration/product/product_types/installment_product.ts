/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import productInstallmentJSON from "cypress/resources/testdata/product/installment_product.json";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests.js";
//Test cases covered
//TC1168 Create a Installment Product - 12 installments
//TC1169 Create a Installment Product - 24 installments
//TC1170 Create a Installment Product - 48 installments
//TC1171 Effective date - Validate effective date should be current date for new products - when migration is not involved
//TC1172 Effective date - Validate effective date should be allowed as older date for products created through migration mode
//TC1173 Validate  Account effective date cannot be allowed older than the linked Product effective date
//TC1174 Verify a unique Product ID should be generated for each new product in Canopy

TestFilters(["regression", "installmentProduct"], () => {
  describe("Create installment product with various post promo len and check Amortization Schedule", function () {
    let accountID;
    let productID;
    let customerID;
    let accEffectiveAt;
    let response;

    before(async() => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });

    productInstallmentJSON.forEach((data) => {
      it(`should have installment product - '${data.tc_name}'`, async () => {
        //Update product JSON post_promo_len and effective_at
        let productEffectiveAt="";
        if (data.product_effective_at.length != 0) {
          productEffectiveAt = dateHelper.getAccountEffectiveAt(data.product_effective_at);
        }
        const productPayload: CreateProduct = {
          effective_at:productEffectiveAt,
          post_promo_len: parseInt(data.no_of_installments)
        };
        const response = await promisify(productAPI.updateNCreateProduct("payment_product.json", productPayload));
        productID = response.body.product_id;
        cy.log("new product created : " + productID);
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer and effectiveDate in account JSON file
        const days = parseInt(data.account_effective_at);
        const effectiveDate = dateHelper.addDays(days, 0);
        response = await promisify(accountAPI.createNewAccount(productID,customerID,effectiveDate,"account_payment.json"))
        expect(response.status).to.eq(parseInt(data.account_response_code));
        if (data.account_response_code == "200") {
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);
          accEffectiveAt = response.body.effective_at;
          cy.log("account effective date:" + accEffectiveAt);
        }
      });

      //Verify Amortization Schedule - no of installment when account is created
      if (data.check_am_schedule.toLowerCase() == "true") {
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          //Roll time forward to get Amortization Schedule
          const endDate = dateHelper.getRollDate(1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have to validate Amortization Schedule is displayed  - '${data.tc_name}'`, async () => {
          response = await promisify(accountAPI.getAmortizationSchedule(accountID));
          expect(response.status).to.eq(200);
          expect(response.body.length, "check the number of installments in Amortization Schedule").to.eq(
            parseInt(data.no_of_installments)
          );
        });
      }
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "effective_at"
  | "post_promo_len"
>;
