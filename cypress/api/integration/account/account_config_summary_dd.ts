import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { lineItemsAPI } from "../../api_support/lineItems";
import { lineItemValidator } from "../../api_validation/line_item_validator";
import { rollTimeAPI } from "../../api_support/rollTime";
import accountJSON from "../../../resources/testdata/account/account_config_summary.json";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";

//Test cases covered
//pp1253 - Verify account effective date is updated
//pp1283-pp1283A Verify Credit limit fixed for the account for revolving and installment products
//pp1284-pp1284A Verify Credit limit overrides Product level credit limit settings for revolving and installment products
//pp1285-pp1286 Verify Late fees charged to the account increases the total balance and available credit should be same
//pp1289-pp1290 Verify Origination fee charged to the account increases the total balance and available credit should be same
//pp1291-pp1292 Verify Annual fee cents charged to the account increases the total balance and available credit should be same
//pp1293-pp1294 Verify Monthly fee cents charged to the account increases the total balance and available credit should be same
//pp1295-pp1295A Verify Initial principal cents is the first charge of an account automatically when account onboarding
//pp1296-1297 Verify initial Principal cents for an account cannot be more than the Credit limit for revolving and installment products

TestFilters(["accountSummary", "config", "regression"], () => {
  //Validate account level Config - summary section in account
  describe("Validate account level Config - summary section in account", () => {
    let accountID;
    let productID;
    let response;
    let productCreditID;
    let productInstallmentID;
    //for updating credit limit in product config to verify account credit limit should be overridden
    const productDefaultCreditLimit = "300000";

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    //Create a new revolving installment product
    it("should be able to create a new revolving and installment product", async () => {
      //Update product payload
      const productPayload: CreateProduct = {
        default_credit_limit_cents: productDefaultCreditLimit,
      };
      productAPI.updateNCreateProduct("payment_product.json", productPayload).then((response) => {
        productCreditID = response.body.product_id;
        cy.log("new installment product created : " + productCreditID);
      });

      response = await promisify(productAPI.updateNCreateProduct("product_credit.json", productPayload));
      productInstallmentID = response.body.product_id;
      cy.log("new revolving product created : " + productCreditID);
    });

    accountJSON.forEach((data) => {
      //Create a new account
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update account payload
        if (data.product_type.toLocaleLowerCase() === "CREDIT") {
          productID = productCreditID;
        } else {
          productID = productInstallmentID;
        }
        //Update account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: Cypress.env("customer_id"),
          credit_limit_cents: parseInt(data.credit_limit_cents),
          max_approved_credit_limit_cents: parseInt(data.credit_limit_cents),
          effective_at: data.account_effective_at,
          late_fee_cents: parseInt(data.late_fee_cents),
          origination_fee_cents: parseInt(data.origination_fee_cents),
          annual_fee_cents: parseInt(data.annual_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          initial_principal_cents: parseInt(data.initial_principal_cents),
          doNot_check_response_status: true,
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(parseInt(data.status_code));

        if (parseInt(data.status_code) === 200) {
          //Verify account effective date
          const actEffectiveDate = response.body.effective_at.slice(0, 10);
          const expEffectiveDate = data.account_effective_at.slice(0, 10);
          expect(actEffectiveDate, "verify account effective date ").to.eq(expEffectiveDate);
          accountID = response.body.account_id;
          cy.log("new account created : " + accountID);

          //Verify account credit limit overrides product credit limit
          expect(
            response.body.summary.credit_limit_cents,
            "verify account credit limit overrides product credit limit"
          ).to.eq(parseInt(data.credit_limit_cents));
          //verify account summary
          expect(response.body.summary.principal_cents, "verify initial principal cents in account summary").to.eq(
            parseInt(data.initial_principal_cents)
          );
          expect(
            response.body.account_product.product_lifecycle.origination_fee_impl_cents,
            "verify origination fee cents in account summary"
          ).to.eq(parseInt(data.origination_fee_cents));
          expect(
            response.body.account_product.product_lifecycle.late_fee_impl_cents,
            "verify late fee cents in account summary"
          ).to.eq(parseInt(data.late_fee_cents));
          expect(
            response.body.account_product.product_lifecycle.annual_fee_impl_cents,
            "verify annual fee cents in account summary"
          ).to.eq(parseInt(data.annual_fee_cents));
          expect(
            response.body.account_product.product_lifecycle.monthly_fee_impl_cents,
            "verify monthly fee cents in account summary"
          ).to.eq(parseInt(data.monthly_fee_cents));
        }
      });

      if (parseInt(data.status_code) === 200) {
        it(`should have origination fee and charge line items in account - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          //Check initial_principal_cents is first charge for account
          //Check charge line item is displayed in account
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "CHARGE",
            parseInt(data.initial_principal_cents)
          );
          //Check origination fee line item is displayed in account
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "ORIG_FEE",
            parseInt(data.origination_fee_cents)
          );
        });
        //Calling roll time forward to make sure account summary is updated
        it(`should be able to roll time forward on account to get statement - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getStatementDate(data.account_effective_at, 45);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have late_fee_cents, year_fee and monthly_fee in account - '${data.tc_name}'`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          //Check late fee line item is displayed in account
          lineItemValidator.validateLineItemWithAmount(response, "VALID", "LATE_FEE", parseInt(data.late_fee_cents));
          //Check annual fee line item is displayed in account
          lineItemValidator.validateLineItemWithAmount(response, "VALID", "YEAR_FEE", parseInt(data.annual_fee_cents));
          //Check monthly fee line item is displayed in account
          lineItemValidator.validateLineItemWithAmount(
            response,
            "VALID",
            "MONTH_FEE",
            parseInt(data.monthly_fee_cents)
          );
        });

        it(`should have validate account total balance and available credit - '${data.tc_name}'`, async () => {
          response = await promisify(accountAPI.getAccountById(accountID));
          expect(response.status).to.eq(200);
          expect(
            response.body.summary.total_balance_cents,
            "verify total balance is increases when fees added."
          ).to.greaterThan(parseInt(data.initial_principal_cents));
          expect(
            response.body.summary.available_credit_cents,
            "verify available credit is not changed when when fees added."
          ).to.eq(parseInt(data.credit_limit_cents));
        });
      }
    });
  });
});

type CreateProduct = Pick<ProductPayload, "default_credit_limit_cents">;
type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "initial_principal_cents"
  | "origination_fee_cents"
  | "monthly_fee_cents"
  | "late_fee_cents"
  | "effective_at"
  | "annual_fee_cents"
  | "credit_limit_cents"
  | "max_approved_credit_limit_cents"
  | "doNot_check_response_status"
>;
