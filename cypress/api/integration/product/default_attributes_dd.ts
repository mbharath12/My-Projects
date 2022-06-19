/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { paymentAPI } from "../../api_support/payment";
import { rollTimeAPI } from "../../api_support/rollTime";
import { dateHelper } from "../../api_support/date_helpers";
import { authAPI } from "../../api_support/auth";
import { lineItemValidator } from "../../api_validation/line_item_validator";
import lineItemProcessingJSON from "../../../resources/testdata/product/attributes_product_account.json";
import transactionsJSON from "../../../resources/testdata/product/attributes_transaction.json";
import { lineItemsAPI } from "../../api_support/lineItems";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test scripts
//PP1218 - Verify this is the default credit limit cents for all the accounts under the product when specific different credit limit is not specified at Account level
//PP1219 - Verify Credit limit cents specified at the Account level overrides the credit limit cents specified at the Product level
//PP1221 - Default_late_fee_cents can be specified here and can be applied to all accounts under this product where this is not overridden at account level
//PP1222 - Default_late_fee_cents can be Overridden at the account level.
//PP1223 - Default_payment_reversal_fee_cents can be specified here and can be applied to all accounts under this product where this is not overridden at account level
//PP1224 - Default_payment_reversal_fee_cents set up at Product level can be Overridden at the account level.

TestFilters(["regression", "statements", "product", "lineitem"], () => {
  describe("validate different default attribute in product ", function () {
    let accountID;
    let productID;
    let customerID;
    let paymentID;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //create customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        customerID = newCustomerID;
        cy.log("created customer :" + customerID);
      });
    });

    lineItemProcessingJSON.forEach((data) => {
      const accountTransactionJSON = transactionsJSON.filter((results) => results.tc_name === data.tc_name);
      describe(`should have create product and account - '${data.tc_name}'`, () => {
        if (data.product_creation.toLowerCase() === "true") {
          it(`should have create product`, async () => {
            productID = await promisify(productAPI.createNewProduct(data.product_template_name));
            cy.log("created product :" + productID);
          });
        }
        it(`should have create account`, async () => {
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: data.account_effective_dt,
            credit_limit_cents: parseInt(data.credit_limit_cents),
            late_fee_cents: parseInt(data.late_fee_cents),
            monthly_fee_cents: parseInt(data.monthly_fee_cents),
            annual_fee_cents: parseInt(data.annual_fee_cents),
            payment_reversal_fee_cents: parseInt(data.payment_reversal_fee_cents),
          };
          const response = await promisify(accountAPI.updateNCreateAccount(data.account_template_name, accountPayload));
          expect(response.status).to.eq(200);
          accountID = response.body.account_id;
          cy.log("account created  : " + accountID);
        });
      });
      describe(`should have to create transactions and validate - '${data.tc_name}'`, () => {
        accountTransactionJSON.forEach((results) => {
          switch (results.transaction_type) {
            case "statement":
              it(`should have validate statement - '${results.stmt_credit_limit_cents}'`, async () => {
                const response = await promisify(accountAPI.getAccountById(accountID));
                expect(response.status).to.eq(200);
                expect(response.body.summary.credit_limit_cents, "verify the credit limits cents").to.eq(
                  parseInt(results.stmt_credit_limit_cents)
                );
              });
              break;

            case "validation":
              it(`should have perform rolltime forward -'${results.exp_line_item_type}'`, async () => {
                if (results.roll_date.length !== 0) {
                  const enddate = dateHelper.getAccountEffectiveAt(results.roll_date);
                  const response = await promisify(rollTimeAPI.rollAccountForward(accountID, enddate.slice(0,10)));
                  expect(response.status).to.eq(200);
                }
              });

              it(`should have validate line item transaction -'${results.exp_line_item_type}'`, () => {
                lineItemsAPI.allLineitems(accountID).then((response) => {
                  expect(response.status).to.eq(200);
                  lineItemValidator.validateLineItemWithAmount(
                    response,
                    "VALID",
                    results.exp_line_item_type,
                    parseInt(results.exp_origination_fee_cents)
                  );
                });
              });
              break;

            case "payment":
              it(`should have create and validate payment -'${results.tc_name}'`, async () => {
                paymentID = await promisify(
                  paymentAPI.paymentForAccount(
                    accountID,
                    "payment.json",
                    results.origination_fee_cents,
                    results.effective_at
                  )
                );
              });
              break;

            case "paymentreversal":
              it(`should have create payment reversal -'${results.tc_name}'`, async () => {
                const response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentID));
                expect(response.status).to.eq(200);
              });
              break;
          }
        });
      });
    });
  });
});
type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "credit_limit_cents"
  | "late_fee_cents"
  | "monthly_fee_cents"
  | "annual_fee_cents"
  | "payment_reversal_fee_cents"
>;
