/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { organizationAPI } from "../../../api_support/organization";
import { dateHelper } from "../../../api_support/date_helpers";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import {
  PaymentProcessorFieldDetails,
  paymentProcessorValidator,
} from "../../../api_validation/payment_processor_validation";
import processorJSON from "../../../../resources/testdata/paymentprocessor/payment_processor_account_status.json";
import promisify from "cypress-promise";
import { Constants } from "../../../api_support/constants";
import TestFilters from "../../../../support/filter_tests.js";

//Test Scripts
//pp906 - ACH - verify repay call os created for suspended delinquent accounts
//pp908 - ACH - verify repay call is created for closed chargeoff accounts
//pp906A - Debit card - verify repay call is created for suspended delinquent accounts
//pp908A - Debit card - verify repay call is created for closed chargeoff accounts
//pp943 - Dwolla - verify dwolla call is created for suspended delinquent accounts
//pp945 - Dwolla - verify dwolla call are created for closed chargeoff accounts
//pp980 - Modern treasury - verify  modern treasury call is created for suspended delinquent accounts
//pp982 - Modern treasury - verify modern treasury call is created for closed chargeoff accounts
//pp1017 - Checkout - verify checkout call is created for suspended delinquent accounts
//pp1019 - Checkout - verify checkout call is created for closed chargeoff accounts

TestFilters(["regression", "paymentProcessor", "accountStatus"], () => {
  //Validate payment processor - account status
  describe("Validate payment processing - account status", () => {
    let accountID;
    let productID;
    let customerID;
    let statementMinPay;
    let minPayDueAt;
    let paymentLineItemID;
    let effectiveDate;
    let response;
    const autoEnabled = true;

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

    //Create a new customer
    it("should have create customer ", async () => {
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    processorJSON.forEach((data) => {
      //Create a new installment product
      it("should be able to create a new installment product", async () => {
        //Create product JSON
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
          cycle_due_interval: data.cycle_due_interval,
          first_cycle_interval: data.first_cycle_interval,
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct("payment_product.json", productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
      });

      //Create a new account and set payment processor
      it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
        //Get account effective date based on dates
        const days = parseInt(data.account_effective_dt);
        effectiveDate = dateHelper.addDays(days, 0);
        cy.log(effectiveDate);
        //Update payload and create an account
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDate,
          autopay_enabled: autoEnabled,
          default_payment_processor_method: data.default_payment_process_method,
        };
        //Create an account with payment processor
        const response = await promisify(accountAPI.updateNCreateAccount(data.account_json_file_name, accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        minPayDueAt = response.body.min_pay_due_cents.min_pay_due_at;
        cy.log("due date" + minPayDueAt);
        //Validate payment processor config details
        const accountPaymentProcessor: AccountPaymentProcessor = {
          auto_enabled: autoEnabled,
          default_payment_processor_method: data.default_payment_process_method,
          payment_processor_name: data.processor_name,
          validate_processor_token: true,
        };
        paymentProcessorValidator.validatePaymentProcessorAccount(response, accountPaymentProcessor);
      });

      //Roll time forward to 2 day from account effective at to get first statement
      // min pay.
      it(`should be able to roll time forward on account to get statement min pay - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(effectiveDate, 8);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
        response = await promisify(accountAPI.getAccountById(accountID));
        statementMinPay = response.body.min_pay_due_cents.statement_min_pay_cents;
        cy.log("Statement Min pay: " + statementMinPay);
      });

      //Roll time forward to 1 day from min pay due date.
      it(`should be able to roll time forward on account - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getStatementDate(minPayDueAt, 1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });
      //Get account details and check payment processing config details
      it(`should have validate payment line item in accounts  - ${data.tc_name}`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        //Prepare expected line item data to validate
        type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
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
        const paymentResponse = lineItemValidator.getLineItem(response, "PAYMENT");
        paymentLineItemID = paymentResponse.line_item_id;
      });

      it(`should have perform payment reversal - '${data.tc_name}'`, async () => {
        response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentLineItemID));
        expect(response.status).to.eq(200);
        //Roll time forward to generate payment reversal
        const endDate = dateHelper.getRollDate(3);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      it(`should have validate account status for - '${data.tc_name}'`, async () => {
        //Validate the account status after payment reversal
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status).to.eq(data.account_status);
      });

      if (data.account_status.toLowerCase() === "suspended") {
        //Get account details and check payment processing config details
        it(`should have validate payment line item in accounts  - ${data.tc_name}`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);

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

      if (data.account_status.toLowerCase() === "closed") {
        //Check payment line item is not available in line items for for closed accounts
        it(`should have to validate payment line item is not available for closed accounts  - ${data.tc_name}`, async () => {
          response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          const checkLineItem = lineItemValidator.checkLineItem(response, "PAYMENT");
          expect(checkLineItem, "validate payment line item for closed account").to.false;
        });
      }
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
  "product_id" | "customer_id" | "effective_at" | "autopay_enabled" | "default_payment_processor_method"
>;
type AccountPaymentProcessor = Pick<
  PaymentProcessorFieldDetails,
  "auto_enabled" | "default_payment_processor_method" | "payment_processor_name" | "validate_processor_token"
>;
type AccLineItem = Pick<LineItem, "status" | "type" | "description" | "effective_at" | "original_amount_cents">;
