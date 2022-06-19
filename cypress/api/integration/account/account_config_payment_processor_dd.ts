import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { lineItemsAPI } from "../../api_support/lineItems";
import { organizationAPI } from "../../api_support/organization";
import { rollTimeAPI } from "../../api_support/rollTime";
import { dateHelper } from "../../api_support/date_helpers";
import { LineItem, lineItemValidator } from "../../api_validation/line_item_validator";
import { paymentProcessorValidator, PaymentProcessorFieldDetails } from "../../api_validation/payment_processor_validation";
import accountJSON from "../../../resources/testdata/account/account_config_processor.json";
import promisify from "cypress-promise";
import { Constants } from "../../api_support/constants";
import TestFilters from "../../../support/filter_tests.js";

//Test Scripts
//pp1257 - verify Payment Processor name set to none
//pp1258 - verify Payment Processor setup for ACH
//pp1259 - verify Payment Processor setup for Debit card
//pp1260 - verify REPAY call is made to get the tokenized information for account
//pp1261 - verify ACH REPAY secured token is generate for raw account details.
//pp1262 - verify dwolla secured token is generate for raw account details.
//pp1263 - verify Payment Processor setup for dwolla
//pp1264 - verify Payment Processor setup for Modern treasury
//pp1265-pp1267 - verify secured token is generate will generate for Debit card and Modern treasury
//pp1268 - verify Payment Processor setup for Checkout
//pp1269-1271 - verify payment call for autopay_enabled set to True
//pp1272 - verify autopay is not triggered for the account default_payment_processor is set to None and Auto Pay enabled field is set to True
//pp1273 - verify autopay is not triggered for the account default_payment_processor is set to None and Auto Pay enabled field is set to false
//pp1274-1277 - verify default_payment_processor_method can be set to ACH Debit card dwolla modern treasury credit card and none

TestFilters(["regression", "accountSummary", "config", "paymentProcessor"], () => {
  //Validate account config with payment processor configurations
  describe("Validate account config - with payment processor", () => {
    let accountID;
    let productID;
    let customerID;
    let minPayDueAt;
    let response;
    let statementMinPay = 0;

    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    // Update payment processor at organization level - repay, dwolla, checkout,
    // modern treasury
    it("should be able to configure organization with payment processor credentials ", () => {
      const configs = new Map([
        ["REPAY", "repay_configs"],
        ["CHECKOUT", "checkout_configs"],
        ["DWOLLA", "dwolla_configs"],
        ["MODERN_TREASURY", "modern_treasury_configs"],
      ]);
      configs.forEach((value: string, key: string) => {
        const filename = "credentials/".concat(value);
        const configJSON = Constants.templateFixtureFilePath.concat("/", filename);
        cy.fixture(configJSON).then((processorJson) => {
          organizationAPI.updatePaymentProcessorConfigs(processorJson).then((response) => {
            paymentProcessorValidator.validatePaymentProcessConfigResponse(response, key);
          });
        });
      });
    });

    //Create a new installment product and customer
    it("should be able to create a new installment product", async () => {
      //productID =productAPI.createNewProduct("product.json");
      productAPI.createNewProduct("product_payment_processing.json").then((newProductID) => {
        productID = newProductID;
      });
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    accountJSON.forEach((data) => {
      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Convert autoEnable value to boolean
        const myBool = data.autoEnabled.toLowerCase() === "true";
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_at,
          autopay_enabled: myBool,
          default_payment_processor_method: data.default_payment_processor_method,
          payment_processor_name: data.payment_processor_name,
          doNot_check_response_status: true,
        };

        //Update payload and create an account
        response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        if (parseInt(data.status_code) === 200) {
          accountID = response.body.account_id;
          //when on boarding an account "min_pay_due_at" field is not displayed in account response
          //previously min_pay_due_at is coming when account on boarding
          minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
          type AccountPaymentProcessor = Pick<
            PaymentProcessorFieldDetails,
            | "auto_enabled"
            | "default_payment_processor_method"
            | "payment_processor_name"
            | "validate_processor_token"
            | "payment_processor_method"
          >;
          const accountPaymentProcessor: AccountPaymentProcessor = {
            auto_enabled: myBool,
            default_payment_processor_method: data.default_payment_processor_method,
            payment_processor_name: data.payment_processor_name,
            validate_processor_token: true,
            payment_processor_method: data.check_payment_process_method,
          };
          paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
        }
      });

      if (parseInt(data.status_code) === 200) {
        // Roll time forward to 10 days from account effective at to get first statement
        // min pay.
        it(`should be able to roll time forward on account to get statement min pay - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getStatementDate(data.account_effective_at, 10);
          rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
            expect(response.status).to.eq(200);
          });
          response = await promisify(accountAPI.getAccountById(accountID));
          statementMinPay = response.body.min_pay_due_cents.statement_min_pay_cents;
          //After doing roll forward minPayDueAt is generated 
          //minPayDueAt date is used to do roll forward with date to generate autopay for account
          minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
          cy.log("Statement Min pay: " + statementMinPay);
        });

        //Roll time forward to 1 day from min pay due date to generate autopay.
        it(`should be able to roll time forward on account - '${data.tc_name}'`, async () => {
          const endDate = dateHelper.getStatementDate(minPayDueAt, 1);
          response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        if (data.autoEnabled.toLowerCase() === "true") {
          //Get account details and check payment processing config details
          it(`should have validate payment line item in accounts  - ${data.tc_name}`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            //Prepare expected line item data to validate
            type AccLineItem = Pick<
              LineItem,
              "status" | "type" | "description" | "effective_at" | "original_amount_cents"
            >;
            //Statement date is one day less than min pay due date in account summary
            const paymentEffectiveAt = dateHelper.getStatementDate(minPayDueAt, -1);
            const paymentLineItem: AccLineItem = {
              status: "PENDING",
              type: "PAYMENT",
              original_amount_cents: statementMinPay * -1,
              description: "auto_pay",
              effective_at: paymentEffectiveAt,
            };
            lineItemValidator.validateAccountLineItemWithEffectiveDate(response, paymentLineItem);
          });
        }
        if (data.autoEnabled.toLowerCase() === "false") {
          //Check payment line item is not available when autopay is false
          it(`should have to validate payment line item is not available in accounts  - ${data.tc_name}`, async () => {
            response = await promisify(lineItemsAPI.allLineitems(accountID));
            expect(response.status).to.eq(200);
            const checkLineItem = lineItemValidator.checkLineItem(response, "PAYMENT");
            expect(checkLineItem, "validate payment line item is not available when autopay is false").to.false;
          });
        }
      }
    });
  });
});

type CreateAccount = Pick<
  AccountPayload,
  | "product_id"
  | "customer_id"
  | "effective_at"
  | "autopay_enabled"
  | "default_payment_processor_method"
  | "payment_processor_name"
  | "doNot_check_response_status"
>;
