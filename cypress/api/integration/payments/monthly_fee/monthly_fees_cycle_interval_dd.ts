import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI, ProductPayload } from "../../../api_support/product";
import { rollTimeAPI } from "../../../api_support/rollTime";
import { dateHelper } from "../../../api_support/date_helpers";
import { authAPI } from "../../../api_support/auth";
import { lineItemsAPI } from "../../../api_support/lineItems";
import { LineItem, lineItemValidator } from "cypress/api/api_validation/line_item_validator";
import { statementValidator } from "cypress/api/api_validation/statements_validator";
import { statementsAPI } from "cypress/api/api_support/statements";
import monthlyFeeCreditJSON from "cypress/resources/testdata/lineitem/monthly_fee_credit_intervals.json";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts - Validation of Monthly fees details
// PP217 Monthly fees on Cards set up with monthly cycle interval
// PP218 Monthly fees validation - Attempt to revert Monthly fees after floating period
// PP219 Monthly fees validation - Attempt to revert Monthly fees after floating period, after a payment has been applied

TestFilters(["regression", "monthlyFee", "cycleInterval"], () => {
  //Validating monthly fee type and monthly fee cents in account line_items
  describe("monthly fee validation - monthly fee is reflected with different cycle intervals in product level", function () {
    let accountID;
    let productID;
    let response;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      cy.log("new customer created successfully: " + customerID);
    });

    monthlyFeeCreditJSON.forEach((data) => {
      it(`should be able to create product - monthly Fee validation -'${data.tc_name}'`, async () => {
        //Update cycle interval in creditProduct json file
        //Create Credit product
        const productPayload: CreateProduct = {
          cycle_interval: data.cycle_interval,
        };
        //Update payload and create an product
        const response = await promisify(productAPI.updateNCreateProduct("product_credit.json", productPayload));
        expect(response.status).to.eq(200);
        productID = response.body.product_id;
        cy.log(productID);
      });

      it(`should be able to create account and assign customer - monthly Fee validation -'${data.tc_name}'`, async () => {
        //Update product, customer, late fee, origination fee, monthly fee, annual fee and effective_dt in account JSON file

        const accountPayload: CreateAccount = {
          product_id: productID,
          customer_id: customerID,
          effective_at: data.account_effective_dt,
          initial_principal_cents: parseInt(data.principal_amount_cents),
          late_fee_cents: parseInt(data.late_fee_cents),
          monthly_fee_cents: parseInt(data.monthly_fee_cents),
        };
        //Create account and assign to customer
        response = await promisify(accountAPI.updateNCreateAccount("account_credit.json", accountPayload));
        expect(response.status).to.eq(200);
        accountID = response.body.account_id;
        cy.log("new account created : " + accountID);
      });

      //Calling roll time forward to make sure account summary is updated
      it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
        const endDate = dateHelper.getRollDate(1);
        response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
        expect(response.status).to.eq(200);
      });

      //Validate monthly fees in line items
      it(`should have validate monthly fee details - '${data.tc_name}''`, async () => {
        //Validate the  monthly fee details
        response = await promisify(lineItemsAPI.allLineitems(accountID));
        expect(response.status).to.eq(200);
        type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
        const monthlyFeeLineItem: AccLineItem = {
          status: "VALID",
          type: "MONTH_FEE",
          original_amount_cents: parseInt(data.monthly_fee_cents),
        };
        lineItemValidator.validateLineItem(response, monthlyFeeLineItem);
      });

      it(`should have validate monthly fee statement details - '${data.tc_name}'`, async () => {
        // common.waitForAccountTotalBalanceUpdate(accountID, parseInt(data.total_balance_cents))
        response = await promisify(statementsAPI.getStatementByAccount(accountID));
        expect(response.status).to.eq(200);
        const monthlyFeeDate = dateHelper.getMonthlyFeeStatementDate(data.account_effective_dt);
        cy.log("get monthly fee date:" + monthlyFeeDate);
        const monthlyFeeStatementID = statementValidator.getStatementID(response, data.statement_cycle_inclusive_start);
        statementsAPI.getStatementByStmtId(accountID, monthlyFeeStatementID).then((response) => {
          expect(response.status).to.eq(200);
          type StmtLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
          const monthlyFeeLineItem: StmtLineItem = {
            status: "VALID",
            type: "MONTH_FEE",
            original_amount_cents: parseInt(data.monthly_fee_cents),
          };
          lineItemValidator.validateStatementLineItem(response, monthlyFeeLineItem);
        });
      });
    });
  });
});

type CreateProduct = Pick<ProductPayload, "cycle_interval">;

type CreateAccount = Pick<
  AccountPayload,
  "product_id" | "customer_id" | "effective_at" | "late_fee_cents" | "monthly_fee_cents" | "initial_principal_cents"
>;
