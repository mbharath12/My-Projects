/* eslint-disable cypress/no-async-tests */
import { customerAPI } from "../../api_support/customer";
import { accountAPI, AccountPayload } from "../../api_support/account";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import timeZoneJSON from "../../../resources/testdata/timezone/payment_timezone.json";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { paymentAPI } from "../../api_support/payment";

//Test Cases covered
// TZ_Payment_01 Validate effective at after payment for Installment Product with UTC -09:00
// TZ_Payment_02 Validate effective at after payment for Installment Product with UTC -10:00
// TZ_Payment_03 Validate effective at after payment for Installment Product with UTC -05:00
// TZ_Payment_04 Validate effective at after payment for Installment Product with UTC -06:00
// TZ_Payment_05 Validate effective at after payment for Revolving Product with UTC -08:00
// TZ_Payment_06 Validate effective at after payment for Revolving Product with UTC -05:00
// TZ_Payment_07 Validate effective at after payment for Chanrge card Product with UTC -07:00
// TZ_Payment_08 Validate effective at after payment for BNPL Product with UTC -07:00
// TZ_Payment_09 Validate effective at after doing payment from New_York for  created product at Los Angeles
// TZ_Payment_10 Validate effective at after doing payment from Chicago for  created product at New York
// TZ_Payment_11 Validate effective at after doing payment from Detroit for  created product at Chicago
// TZ_Payment_12 Validate effective at after doing payment at Los Angeles with day light savings
// TZ_Payment_13 Validate effective at after doing payment at Adak with day light savings
// TZ_Payment_14 Validate effective at after doing payment at New York with day light savings
// TZ_Payment_15 Validate effective at after doing payment at Chicago with day light savings
// TZ_Payment_16 Validate effective at after doing payment at Chicago in leaf year

TestFilters(["regression", "dst_timezone", "region"], () => {
  let productID;
  let customerID;
  let accountID;
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
          effective_at: data.product_effective_at,
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
        };
        //Update payload and create an product and validate
        const response = await promisify(productAPI.updateNCreateProduct("product.json", productPayload));
        productID = response.body.product_id;
        expect(response.status).to.eq(200);
      });
      //Create an account
      it(`should be able to create a new account`, async () => {
        //Create account JSON
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
        };
        //Update payload and create an account
        const response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
        accountID = response.body.account_id;
        expect(response.status).to.eq(200);
      });
      //Create Charge
      it(`should be able to create a payment - '${data.tc_name}'`, () => {
        const paymentTemplateJSON = Cypress.env("templateFolderPath").concat("/payment/create_payment.json");
        cy.fixture(paymentTemplateJSON).then((paymentJSON) => {
          paymentJSON.effective_at = data.payment_effective_dt;
          paymentJSON.original_amount_cents = data.payment_amount;
          paymentAPI.createPayment(paymentJSON, accountID).then((response) => {
            expect(response.status, "payment response status").to.eq(200);
            expect(response.body.effective_at).to.eq(data.exp_effective_at);
          });
        });
      });
    });
  });
});

type CreateProduct = Pick<
  ProductPayload,
  "product_time_zone" | "effective_at" | "cycle_interval" | "cycle_due_interval"
>;
type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at">;

