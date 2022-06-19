import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI, CustomerPayload } from "../../api_support/customer";
import { productAPI, ProductPayload } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { chargeAPI, ChargePayload } from "../../api_support/charge";
import { paymentAPI, PaymentPayload } from "../../api_support/payment";
import { lineItemsAPI, offsetPayload } from "../../api_support/lineItems";
import { refundAPI, refundPayload } from "../../api_support/refund";
import TestFilters from "../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { v4 as uuid } from "uuid";
import { dateHelper } from "cypress/api/api_support/date_helpers";

//Test cases covered -
// Verify the entity ID on product,customer,account,charge,payment record,payment transfer,manual fee,credit offset,debit offset and refund
// when the flag is set to ON.

if (Cypress.env("enableStrictEntityClientIdFlagOn") === true) {
  TestFilters(["regression", "entity"], () => {
    describe("Validate entity feature only when the entity Flag is ON ", function () {
      let accountID;
      let productID;
      let response;
      let customerID;
      let paymentID;
      let prodIdV2;
      let custIdV2;
      let chargelineItemIDV2;
      let debitlineItemIDV2;
      let creditlineItemIDV2;
      let paymentRecordlineItemIDV2;
      let paymentTransferlineItemIDV2;
      let manualFeelineItemIDV2;
      let refundlineItemIDV2;
      let effectiveDate;

      before(() => {
        authAPI.getDefaultUserAccessToken();
      });

      it(`should have create product `, async () => {
        prodIdV2 = "autoTest_prod_".concat(uuid());
        const productPayload: CreateProduct = {
          product_id: prodIdV2,
        };
        response = await promisify(productAPI.updateNCreateProduct("product_installment.json", productPayload));
        productID = response.body.product_id;
        cy.log("new product created : " + productID);
        expect(response.body.product_id, "Verify product id when the entity flag is on").to.eq(prodIdV2);
      });

      it(`should have create customer  `, async () => {
        custIdV2 = "autoTest_custom_".concat(uuid());
        const customerPayload: CreateCustomer = {
          customer_id: custIdV2,
        };
        response = await promisify(customerAPI.updateNCreateCustomer("create_customer.json", customerPayload));
        customerID = response.body.customer_id;
        cy.log("new customer created " + customerID);
        expect(response.body.customer_id, "verify customer id when the entity flag is on").to.eq(custIdV2);
      });

      it(`should have create account - `, async () => {
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
        };
        response = await promisify(accountAPI.updateNCreateAccount("account.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        expect(response.body.account_product.product_id).to.eq(prodIdV2);
        expect(response.body.customers.customer_id).to.eq(custIdV2);
      });

      it(`should be able to create a charge `, async () => {
        chargelineItemIDV2 = "autoTest-charge-li-".concat(uuid());
        const chargePayload: CreateCharge = {
          line_item_id: chargelineItemIDV2,
        };
        response = await promisify(
          chargeAPI.chargeForNegativeAccount(accountID, "create_charge.json", chargePayload, "200")
        );
        expect(response.body.line_item_id, "verify charge line item id when the entity flag is on").to.eq(
          chargelineItemIDV2
        );
      });

      it(`should be able to create payment `, async () => {
        paymentID = await promisify(paymentAPI.paymentForAccount(accountID, "payment.json", 200, effectiveDate));
      });

      it(`should be able to create a payment reversal`, async () => {
        response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentID));
        expect(response.status).to.eq(200);
      });

      it(`should be able to create debit offset line item`, async () => {
        debitlineItemIDV2 = "autoTest-debit-li-".concat(uuid());
        effectiveDate = dateHelper.addDays(-10, 0);
        const debitoffsetPayload: CreateDebitOffset = {
          effective_at: effectiveDate,
          original_amount_cents: 20,
          allocation: "delete",
          line_item_id: debitlineItemIDV2,
        };
        response = await promisify(
          lineItemsAPI.updateNcreatedebitoffset(accountID, "debit_offset.json", debitoffsetPayload)
        );
        expect(response.body.line_item_id, "Verify debit offset line item id when the entity flag is on").to.eq(
          debitlineItemIDV2
        );
      });

      it(`should be able to create credit offset transaction`, async () => {
        creditlineItemIDV2 = "autoTest-credit-li-".concat(uuid());
        effectiveDate = dateHelper.addDays(-9, 0);
        const creditoffsetPayload: CreateCreditOffset = {
          effective_at: effectiveDate,
          original_amount_cents: 20,
          allocation: "delete",
          line_item_id: creditlineItemIDV2,
        };
        response = await promisify(
          lineItemsAPI.updateNcreatecreditoffset(accountID, "credit_offset_allocation.json", creditoffsetPayload)
        );
        expect(response.body.line_item_id, "Verify the credit offset line item id when the entity flag is on").to.eq(
          creditlineItemIDV2
        );
      });

      it(`should be able to create payment record`, async () => {
        paymentRecordlineItemIDV2 = "autoTest-paymentRecord-li-".concat(uuid());
        const paymentRecordPayload: PaymentRecord = {
          line_item_id: paymentRecordlineItemIDV2,
        };
        response = await promisify(
          paymentAPI.updateNCreatePaymentRecord(accountID, "create_payment_record.json", paymentRecordPayload)
        );
        expect(response.body.line_item_id, "verify the payment record line item id when the entity flag is on").to.eq(
          paymentRecordlineItemIDV2
        );
      });

      it(`should be able to create payment transfer`, async () => {
        paymentTransferlineItemIDV2 = "autoTest-paymentTransfer-li-".concat(uuid());
        const paymentTransferPayload: PaymentTransfer = {
          line_item_id: paymentTransferlineItemIDV2,
        };
        response = await promisify(
          paymentAPI.updateNCreatePaymentRecord(accountID, "create_payment_transfer.json", paymentTransferPayload)
        );
        expect(response.body.line_item_id, "Verify the payment transfer line item id when the entity flag is on").to.eq(
          paymentTransferlineItemIDV2
        );
      });

      it(`should be able to create manual fee`, async () => {
        manualFeelineItemIDV2 = "autoTest-manualfee-li-".concat(uuid());
        const manualFeePayload: ManualFee = {
          line_item_id: manualFeelineItemIDV2,
        };
        response = await promisify(
          paymentAPI.updateNCreatePaymentRecord(accountID, "manual_fees_entity.json", manualFeePayload)
        );
        expect(response.body.line_item_id, "Verify the manual fee line item id when the entity flag is on").to.eq(
          manualFeelineItemIDV2
        );
      });

      it(`should be able to create refund`, async () => {
        refundlineItemIDV2 = "autoTest-refund-li-".concat(uuid());
        const refundPayload: refund = {
          line_item_id: refundlineItemIDV2,
        };
        response = await promisify(refundAPI.updateNCreateRefund(accountID, "refund.json", refundPayload));
        expect(response.body.line_item_id, "Verify the refund line item id when the entity flag is on").to.eq(
          refundlineItemIDV2
        );
      });
    });
  });
  type CreateProduct = Pick<ProductPayload, "product_id">;
  type CreateCustomer = Pick<CustomerPayload, "customer_id">;
  type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id">;
  type CreateCharge = Pick<ChargePayload, "line_item_id">;
  type CreateDebitOffset = Pick<
    offsetPayload,
    "line_item_id" | "effective_at" | "allocation" | "original_amount_cents"
  >;
  type CreateCreditOffset = Pick<
    offsetPayload,
    "line_item_id" | "effective_at" | "allocation" | "original_amount_cents"
  >;
  type PaymentRecord = Pick<PaymentPayload, "line_item_id">;
  type PaymentTransfer = Pick<PaymentPayload, "line_item_id">;
  type ManualFee = Pick<PaymentPayload, "line_item_id">;
  type refund = Pick<refundPayload, "line_item_id">;
}
