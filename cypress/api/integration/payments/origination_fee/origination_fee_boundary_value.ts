/* eslint-disable cypress/no-async-tests */
import { accountAPI, AccountPayload } from "../../../api_support/account";
import { customerAPI } from "../../../api_support/customer";
import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";
import { dateHelper } from "cypress/api/api_support/date_helpers";
import { lineItemsAPI } from "../../../api_support/lineItems";
import paymentProcessingJSON from "cypress/resources/testdata/payment/originationFeeBoundaryValue.json";
import { LineItem, lineItemValidator } from "../../../api_validation/line_item_validator";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP170	Attempt to apply negative fees
//PP171	Attempt to apply 0 fees
//PP172	Attempt to apply 2 cents fees
//PP173	Attempt to apply USD 29.99 fees
//PP174	Attempt to apply USD 35 fees
//PP175	Attempt to apply USD 50 fees
//PP176	Attempt to apply USD 100 fees
//PP177	Attempt to apply USD 1000 fees
//PP178	Attempt to apply USD 1000000 fees
//PP179	Attempt to apply Origination fees more than the Approved credit limit

TestFilters(["regression", "originationFee", "payment", "boundaryValue"], () => {
  //This test suite will cover all the positive, negative and boundary test cases around origination fees.
  describe("Create account with origination fees", function () {
    let accountID;
    let productID;
    let customerID;

    before(async () => {
      authAPI.getDefaultUserAccessToken();
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
      productID = await promisify(productAPI.createNewProduct("payment_product.json"));
    });

    paymentProcessingJSON.forEach((data) => {
      if (parseInt(data.response_status) === 200) {
        it(`should have create account and assign customer - '${data.tc_name}'`, async () => {
          const days = parseInt(data.account_effective_dt);
          const effective_dt = dateHelper.addDays(days, 0);
          const accountPayload: CreateAccount = {
            product_id: productID,
            customer_id: customerID,
            effective_at: effective_dt,
            origination_fee_cents: parseInt(data.origination_fee_cents),
          };
          const response = await promisify(accountAPI.updateNCreateAccount("account_payment.json", accountPayload));
          accountID = response.body.account_id;
        });

        //Calling roll time forward to make sure account summary is updated
        it(`should have to wait for account roll time forward  - '${data.tc_name}'`, async () => {
          //Roll time forward to generate surcharge lineItem
          const endDate = dateHelper.getRollDate(1);
          const response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
          expect(response.status).to.eq(200);
        });

        it(`should have validate origination fee details - '${data.tc_name}'`, () => {
          //Validate the  origination fee details
          if (parseInt(data.response_status) === 200 && parseInt(data.origination_fee_cents) > 0) {
            type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
            lineItemsAPI.allLineitems(accountID).then((response) => {
              expect(response.status).to.eq(200);
              const originFeeLineItem: AccLineItem = {
                status: "VALID",
                type: "ORIG_FEE",
                original_amount_cents: parseInt(data.origination_fee_cents),
              };
              lineItemValidator.validateLineItem(response, originFeeLineItem);
            });
          }
        });
      }
    });
  });
});

type CreateAccount = Pick<AccountPayload, "product_id" | "customer_id" | "effective_at" | "origination_fee_cents">;
