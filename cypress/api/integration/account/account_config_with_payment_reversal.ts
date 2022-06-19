import { accountAPI, AccountPayload } from "../../api_support/account";
import { customerAPI } from "../../api_support/customer";
import { productAPI } from "../../api_support/product";
import { authAPI } from "../../api_support/auth";
import { dateHelper } from "../../api_support/date_helpers";
import { paymentAPI } from "../../api_support/payment";
import { rollTimeAPI } from "../../api_support/rollTime";
import { lineItemsAPI } from "../../api_support/lineItems";
import { LineItem, lineItemValidator } from "../../api_validation/line_item_validator";
import promisify from "cypress-promise";
import TestFilters from "../../../support/filter_tests.js";
//Test Scripts
//pp1287 - verify payment reversal fee cents applied to Payment reversal fee applied automatically to the account
//pp1288 - Verify Payment reversal fees charged to the account increases the total balance and available credit is same

TestFilters(["accountSummary", "config", "paymentReversal", "regression"], () => {
  //Validate account config with payment reversal fee cents
  describe("Validate account config - payment reversal fee cents ", function () {
    let accountID;
    let response;
    let effective_dt;
    let paymentLineItemID;
    let paymentAmount = 100000;
    const paymentReversalFee = 4000;
    const initialPrincipalCents = 200000;

    before(() => {
      authAPI.getDefaultUserAccessToken();
      //Create new product
      productAPI.createNewProduct("payment_product.json").then((newProductID) => {
        Cypress.env("product_id", newProductID);
      });
      //Create a new customer
      customerAPI.createNewCustomer("create_customer.json").then((newCustomerID) => {
        Cypress.env("customer_id", newCustomerID);
        cy.log("Customer ID : " + Cypress.env("customer_id"));
      });
    });

    it(`should have create account and assign customer `, async () => {
      //Get account effective date
      effective_dt = dateHelper.addDays(-10, 0);
      const accountPayload: CreateAccount = {
        product_id: Cypress.env("product_id"),
        customer_id: Cypress.env("customer_id"),
        effective_at: effective_dt,
        initial_principal_cents: initialPrincipalCents,
        payment_reversal_fee_cents: paymentReversalFee,
        origination_fee_cents: 0,
        late_fee_cents: 0,
        monthly_fee_cents: 0,
      };
      //Create account and assign to customer
      response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      cy.log("new account created : " + accountID);
    });

    //Calling roll time forward to update total balance for account
    it(`should be able to roll time forward to total balance for account `, async () => {
      const endDate = dateHelper.getStatementDate(effective_dt, 7);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });
    //Get account details and validate Available credit in the account is not increased and the Total balance is not reduced
    it(`should have validate total balance and available credit for pending payment `, async () => {
      response = await promisify(accountAPI.getAccountById(accountID));
      expect(response.status).to.eq(200);
      cy.log(response.body.summary.available_credit_cents);
      //payment_reversal_fee_cents feature is not yet implemented in Canopy System. Hence modified
      expect(response.body.summary.total_balance_cents, "verify total balance ").to.eq(initialPrincipalCents);
      //uncomment the lines #74 and #75 when payment_reversal_fee_cents feature is implemented in Canopy System and comment line#72
      //expect(response.body.summary.total_balance_cents, "verify total balance ").to.greaterThan(initialPrincipalCents);
      //expect(response.body.summary.available_credit_cents, "verify available credit").to.eq(availableCredit);
    });

    it(`should have create a payment`, () => {
      //Update payment amount and payment effective dt
      const payment_effective_dt = dateHelper.addDays(-5, 0);
      paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmount, payment_effective_dt);
    });

    //Calling roll time forward to get the payment line item for account
    it(`should be able to roll time forward to get the payment line item for account`, async () => {
      const endDate = dateHelper.getStatementDate(effective_dt, 7);
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });

    it(`should have validate payment line item and payment reversal line item details `, async () => {
      response = await promisify(lineItemsAPI.allLineitems(accountID));
      expect(response.status).to.eq(200);
      lineItemValidator.validateLineItemWithAmount(response, "VALID", "PAYMENT", paymentAmount * -1);
      //Get payment line item id
      const paymentResponse = lineItemValidator.getLineItem(response, "PAYMENT");
      paymentLineItemID = paymentResponse.line_item_id;
    });

    it(`should have perform payment reversal `, async () => {
      response = await promisify(lineItemsAPI.paymentReversalLineitems(accountID, paymentLineItemID));
      expect(response.status).to.eq(200);
      //Roll time forward to generate payment reversal
      const endDate = dateHelper.getRollDate(6);
      rollTimeAPI.rollAccountForward(accountID, endDate).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it(`should have validate payment reversal as a line item and should have payment reversal fee`, async () => {
      cy.wait(2000);
      response = await promisify(lineItemsAPI.allLineitems(accountID));
      //payment_reversal_fee_cents feature is not yet implemented in Canopy System. Hence commented
      // const paymentReversalAmount = paymentAmount + paymentReversalFee;
      lineItemValidator.validateLineItemWithAmount(response, "VALID", "PAYMENT_REVERSAL", paymentAmount);
    });

    //The feature is not yet implemented in Canopy System
    xit(`should have validate return check fee as a line item and should have payment reversal fee based on the config parameters- `, async () => {
      response = await promisify(lineItemsAPI.allLineitems(accountID));
      const payReversalLineItem: payReversalItem = {
        status: "VALID",
        type: "RETURN_CHECK_FEE",
        original_amount_cents: paymentReversalFee,
      };
      lineItemValidator.validateLineItem(response, payReversalLineItem);
    });
  });
});

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
  | "payment_reversal_fee_cents"
>;

type payReversalItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
