import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { paymentAPI } from "../../../api_support/payment";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { statementsAPI } from "cypress/api/api_support/statements";
import { StatementBalanceSummary, statementValidator } from "cypress/api/api_validation/statements_validator";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import chargeProcessingJSON from "cypress/resources/testdata/payment/revolving_account_payment.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { lineItemsAPI } from "cypress/api/api_support/lineItems";
import { chargeAPI } from "cypress/api/api_support/charge";

//Test Scripts
//PP82-Full payment done One day before floating period ends, on existing card account with only previous cycle dues outstanding using revolving product
//PP83-Full payment done On the day floating period ends, on existing card account with only previous cycle dues outstanding using revolving product
//PP84-Full payment done One day after floating period ends,on existing card account with only previous cycle dues outstanding using revolving product
//PP85-Full payment done One day before floating period ends,on existing card account with more than one previous cycle dues outstanding using revolving product
//PP86-Full payment done On the day floating period ends,on existing card account with more than one previous cycle dues outstanding using revolving product
//PP87-Full payment done One day after floating period ends,on existing card account with more than one previous cycle dues outstanding  using revolving product
//PP88-Full payment on existing Revolving card account one day before Floating period ends
//PP89-Full payment on existing Revolving card account on the day Floating period ends
//PP90-Full payment on existing Revolving card account one day after Floating period ends
//PP91-Part payments not allowed on Revolving cards
//PP92-Excess payments on a Revolving card account

TestFilters(["regression", "systemOfRecords", "revolvingProduct", "payments"], () => {
  describe("Validate payment using revolving card", function () {
    let accountID;
    let customerID;
    let accEffectiveAt;
    let effectiveDt;
    let response;
    let productID;

    before(async() => {
      authAPI.getDefaultUserAccessToken();
      //create customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });
    chargeProcessingJSON.forEach((data) => {
      it(`should have create product - '${data.tc_name}'`, async () => {
        //Create a charge product - with delinquent and charge-off
        const productPayload: CreateProduct = {
          delinquent_on_n_consecutive_late_fees: parseInt(data.delinquent),
          charge_off_on_n_consecutive_late_fees: parseInt(data.charge_off),
        };
        response = await promisify(productAPI.updateNCreateProduct("product_charge.json", productPayload));
        productID = response.body.product_id;
        cy.log("new product created successfully: " + productID);
      });

      it(`should have create account  - '${data.tc_name}'`, async () => {
        const days = parseInt(data.account_effective_dt);
        effectiveDt = dateHelper.addDays(days, parseInt(data.account_effective_dt_time));
        //Create account payload
        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: effectiveDt,
          late_fee_cents: parseInt(data.late_fee_cents),
          initial_principal_cents: parseInt(data.initial_principal_cents),
        };
        response = await promisify(accountAPI.updateNCreateAccount("account_only_promo.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
        accEffectiveAt = response.body.effective_at;
        cy.log("account effective date:" + accEffectiveAt);
      });

      if (data.charge1_amt_cents !== "0") {
        it(`should be able to create a charge - '${data.tc_name}'`, () => {
          const chargeEffectiveDt = dateHelper.addDays(parseInt(data.charge1_effective_dt), 0);
          chargeAPI.chargeForAccount(accountID, "charge.json", parseInt(data.charge1_amt_cents), chargeEffectiveDt);
        });
      }
      it(`should have create a payment - '${data.tc_name}'`, async () => {
        const paymentAmt = data.payment_amt_cents_1;
        const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment1_effective_dt), 0);
        await promisify(paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt, paymentEffectiveDt));
      });
      it(`should have payment details - '${data.tc_name}'`, async () => {
        //validate payment line item
        type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        const paymentLineItem: AccLineItem = {
          status: "VALID",
          type: "PAYMENT",
          original_amount_cents: parseInt(data.payment_amt_cents_1) * -1,
        };
        const response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        lineItemValidator.validateLineItem(response, paymentLineItem);
      });

      if (data.multi_payment_check.toLowerCase() === "true") {
        it(`should have create a payment - '${data.tc_name}'`, async () => {
          const paymentAmt2 = data.payment_amt_cents_2;
          const paymentEffectiveDt = dateHelper.addDays(parseInt(data.payment2_effective_dt), 0);
          await promisify(paymentAPI.paymentForAccount(accountID, "payment.json", paymentAmt2, paymentEffectiveDt));
        });
        it(`should have payment details - '${data.tc_name}'`, async () => {
          type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const paymentLineItem: AccLineItem = {
            status: "VALID",
            type: "PAYMENT",
            original_amount_cents: parseInt(data.payment_amt_cents_2) * -1,
          };
          const response = await promisify(lineItemsAPI.allLineitems(accountID));
          expect(response.status).to.eq(200);
          lineItemValidator.validateLineItem(response, paymentLineItem);
        });
      }
      //Calling roll time forward to make sure balance summary is updated
      it(`should have to wait for account roll time forward - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getRollDate(8);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });
      //For Charge or Revolving ,Late-Fee should not come up .Canopy Team is yet to confirm.Hence blocked the code for now
      it(`should have validate late fee - '${data.tc_name}''`, async () => {
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);

        if (data.line_item_check.toLowerCase() === "true") {
          type lateFeeLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const lateFeeLineItems: lateFeeLineItem = {
            status: "VALID",
            type: "LATE_FEE",
            original_amount_cents: parseInt(data.late_fee_cents),
          };
          lineItemValidator.validateLineItem(response, lateFeeLineItems);
        } else {
          //Late_Fee should not come for Revolving Product when full payment is done on time.
          const bLineItemExist = lineItemValidator.checkLineItem(response, "LATE_FEE");
          expect(false, "check LATE_FEE line item is not displayed").to.eq(bLineItemExist);
        }
      });

      it(`should have validate account status for - '${data.tc_name}'`, async () => {
        //Validate the account status
        response = await promisify(accountAPI.getAccountById(accountID));
        expect(response.status).to.eq(200);
        expect(response.body.account_overview.account_status).to.eq(data.account_status);
      });

      it(`should have to validate statement balance for latest cycle - '${data.tc_name}'`, async () => {
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        const cycleStatementID = statementValidator.getStatementIDByNumber(response, parseInt(data.stmt_id));
        //Get statement details for given statement id
        response = await promisify(statementsAPI.getStatementByStmtId(accountID, cycleStatementID));
        //Check available_credit_cents is displayed in the statement
        expect(response.status).to.eq(200);
        expect(response.body.open_to_buy.available_credit_cents, "Available Credit Balance is displayed").to.eq(
          parseInt(data.available_credit_cents)
        );
      });

      it(`should have to validate statement balance for latest cycle - '${data.tc_name}'`, () => {
        type StmtBalanceSummaryPick = Pick<
          StatementBalanceSummary,
          "loans_principal_cents" | "fees_balance_cents" | "total_balance_cents" | "charges_principal_cents"
        >;
        // Validate Loan Principal,fee balance ,total balance and charge principal are as expected
        const balanceSummary: StmtBalanceSummaryPick = {
          charges_principal_cents: parseInt(data.stmt_charges_principal_cents),
          loans_principal_cents: parseInt(data.stmt_loans_principal_cents),
          fees_balance_cents: parseInt(data.stmt_fees_balance_cents),
          total_balance_cents: parseInt(data.stmt_total_balance_cents),
        };
        statementValidator.validateStatementBalanceForGivenStatementNumber(
          accountID,
          parseInt(data.stmt_id),
          balanceSummary
        );
      });
    });
  });
});
type CreateProduct = Pick<
  ProductPayload,
  "delinquent_on_n_consecutive_late_fees" | "charge_off_on_n_consecutive_late_fees"
>;
type CreateAccount = Pick<
  AccountPayload,
  "customer_id" | "effective_at" | "product_id" | "late_fee_cents" | "initial_principal_cents"
>;
