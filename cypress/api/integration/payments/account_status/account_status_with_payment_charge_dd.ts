import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { paymentAPI } from "../../../api_support/payment";
import { chargeAPI } from "../../../api_support/charge";
import accountStatusJSON from "cypress/resources/testdata/account/account_status_with_payment_charge.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
/* eslint-disable cypress/no-async-tests */
//Test Scripts
//pp437 - Verify Delinquent account should not allowed charges and allowed payments
//pp438 - Verify Delinquent account should allow payments
//pp439 - Verify New Charges are allowed in cured Delinquent accounts
//pp443 - Verify Closed account status is cured by payment
//pp444 - Verify no further charge transactions are allowed on closed account credit product
//pp445 - Verify Closed account status is cured by half loan payment
//pp448 - Verify no further charge transactions are allowed on closed account for installment product
//pp452 - Verify Payment received on a Suspended account
//pp454 - Verify Delinquent account is not cured by half due payment installment product
//pp455 - Verify Delinquent account is not cured by half due payment for credit product

TestFilters(["regression", "accountStatus", "payments", "charges"], () => {
  //Validate account status with different products and settings
  describe("Account Status Validation with payment and charge ", function () {
    let accountID;
    let productID;
    let response;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"))
    });

    accountStatusJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
        };
        response = await promisify(
          productAPI.updateNCreateProduct(data.product_json_file, productPayload)
        );
        productID = response.body.product_id;
        cy.log("new installment product created : " + productID);
      });

      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Update product, customer and account effective date in account JSON file
        const days = parseInt(data.account_effective_dt);
        const effectiveDate = dateHelper.addDays(days, 0);

        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id:  customerID,
          effective_at: effectiveDate,
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      it(`should have validate account status for - '${data.tc_name}'`, async () => {
        //Roll time forward to account status is updated
        const endDate = dateHelper.getRollDate(2);
        rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
        expect(response.status).to.eq(200);
        });
        //Validate the account status
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status).to.eq(data.account_status);
      });

      //Validate charges are not allowed for suspended account
      if (parseInt(data.charge_status) === 200) {
        it("should be able to validate suspended account not allowed a charge", () => {
          if (data.charge_before_payment.toLowerCase() === "true") {
            const effective_dt = dateHelper.addDays(0, 0);
            const chargeTemplateJSON = Cypress.env("templateFolderPath").concat("/charge/charge.json");
            cy.fixture(chargeTemplateJSON).then((chargeJSON) => {
              chargeJSON.effective_at = effective_dt;
              chargeAPI.createCharge(chargeJSON, accountID).then((response) => {
                expect(response.status).to.eq(parseInt(data.charge_status));
              });
            });
          }
        });
      }
      if (data.payment_check.toLowerCase() === "true") {
        it(`should be able to validate suspended/charged_off account is allow create payment - '${data.tc_name}'`, () => {
          //Validate repayment amount
          const paymentEffectiveDate = dateHelper.addDays(0, 0);
          const paymentTemplateJSON = Cypress.env("templateFolderPath").concat("/payment/payment.json");
          cy.fixture(paymentTemplateJSON).then((paymentJSON) => {
            paymentJSON.effective_at = paymentEffectiveDate;
            paymentJSON.original_amount_cents = parseInt(data.payment_amt_cents);
            paymentAPI.createPayment(paymentJSON, accountID).then((response) => {
              expect(response.status, "payment response status").to.eq(parseInt(data.payment_status));
            });
          });
        });

        if(parseInt(data.payment_status) === 200){
        //Calling roll time forward to make sure account status is updated
      it("should have validate account status after payment", async () => {
        //Roll time forward to update account status
        const endDate = dateHelper.getRollDate(7);
        rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
          expect(response.status).to.eq(200);
          });
         //Validate the account status
         const accountResponse = await promisify(accountAPI.getAccountById(accountID));
         expect(accountResponse.status).to.eq(200);
         expect(accountResponse.body.account_overview.account_status).to.eq(data.account_status_after_payment);
      });
      }
    }
    if (data.charge_after_payment.toLowerCase() === "true") {
        it(`should have validate suspended account is allow charge after payment - '${data.tc_name}'`, () => {
          //Validate active account is allowed to charges
            //Update charge effective date to current date
            const effective_dt = dateHelper.addDays(0, 0);
            const chargeTemplateJSON = Cypress.env("templateFolderPath").concat("/charge/charge.json");
            cy.fixture(chargeTemplateJSON).then((chargeJSON) => {
              chargeJSON.effective_at = effective_dt;
              chargeAPI.createCharge(chargeJSON, accountID).then((response) => {
                expect(response.status).to.eq(parseInt(data.charge_status));
              });
            });
        });
      }
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  | "cycle_interval"
  | "cycle_due_interval"
  | "delinquent_on_n_consecutive_late_fees"
  | "charge_off_on_n_consecutive_late_fees"
>;
type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "monthly_fee_cents" | "late_fee_cents"
>;
