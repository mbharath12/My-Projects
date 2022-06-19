export class LineItemValidator {
  //Verify line item type, status and amount for given account
  //ex: type AccLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
  // const lateFeeLineItem: AccLineItem = {status: "VALID",type: "LATE_FEE",original_amount_cents: parseInt(data.late_fee_cents)};
  // lineItemValidator.validateLineItem(response, lateFeeLineItem);
  validateLineItem(response, expAccLineItem) {
    const len = response.body.results.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.results[counter];
      const currType = response.body.results[counter].line_item_overview.line_item_type;
      if (currType == expAccLineItem.type) {
        //Verify given line item details
        const desc = response.body.results[counter].line_item_overview.description;
        expect(
          curItem.line_item_overview.line_item_type,
          "account line item type " + expAccLineItem.type + " is displayed"
        ).to.eq(expAccLineItem.type);
        expect(curItem.line_item_overview.line_item_status, "verify transaction status").to.eq(expAccLineItem.status);
        expect(
          curItem.line_item_summary.original_amount_cents,
          "verify original amount for " + desc + " transaction"
        ).to.eq(expAccLineItem.original_amount_cents);
        if ("description" in expAccLineItem) {
          expect(curItem.line_item_overview.description, "verify description transaction").to.eq(
            expAccLineItem.description
          );
        }
        return;
      }
    }
    //If line item ex: LATE_FEE is not listed in account line items log test as fail
    expect(expAccLineItem.type, "check  " + expAccLineItem.type + " is displayed in account line item").to.eq("");
  }

  validateAccountLineItemWithEffectiveDate(response, expAccountLineItem) {
    const len = response.body.results.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.results[counter];
      const currType = response.body.results[counter].line_item_overview.line_item_type;
      if (
        currType === expAccountLineItem.type &&
        curItem.effective_at.includes(expAccountLineItem.effective_at.slice(0, 10))
      ) {
        //Verify given line item details
        const desc = response.body.results[counter].line_item_overview.description;
        if ("account_id" in expAccountLineItem) {
          expect(curItem.account_id.toString(), "verify account ID").to.eq(expAccountLineItem.account_id.toString());
        }
        if ("product_id" in expAccountLineItem) {
          expect(curItem.product_id.toString(), "verify product ID").to.eq(expAccountLineItem.product_id.toString());
        }
        if ("line_item_id" in expAccountLineItem) {
          expect(curItem.line_item_id, "verify line item ID ").not.eq("");
        }
        if ("created_at" in expAccountLineItem) {
          expect(curItem.created_at, "verify created at").not.eq("");
        }
        if ("merchant_name" in expAccountLineItem) {
          if (expAccountLineItem.merchant_name !== "") {
            expect(curItem.merchant_data.name, "verify merchant data name").to.eq(expAccountLineItem.merchant_name);
          }
        }
        if ("mcc_code" in expAccountLineItem) {
          if (!isNaN(expAccountLineItem.mcc_code)) {
            expect(curItem.merchant_data.mcc_code.toString(), "verify merchant mcc code").to.eq(expAccountLineItem.mcc_code.toString());
          }
        }

        if ("external_field_value" in expAccountLineItem) {
          if (expAccountLineItem.external_field_value !== "") {
            cy.log(curItem.external_fields.length);
            expect(curItem.external_fields[0].value).to.eq(expAccountLineItem.external_field_value);
          }
        }
        if ("external_field_key" in expAccountLineItem) {
          if (expAccountLineItem.external_field_key !== "") {
            expect(curItem.external_fields[0].key, "verify external field key").to.eq(
              expAccountLineItem.external_field_key
            );
          }
        }

        expect(
          curItem.line_item_overview.line_item_type,
          "account line item type " + expAccountLineItem.type + " is displayed"
        ).to.eq(expAccountLineItem.type);

        expect(curItem.line_item_overview.line_item_status, "verify transaction status").to.eq(
          expAccountLineItem.status
        );

        if (curItem.line_item_summary.original_amount_cents === expAccountLineItem.original_amount_cents) {
          expect(
            curItem.line_item_summary.original_amount_cents,
            "verify original amount for " + desc + " transaction"
          ).to.eq(expAccountLineItem.original_amount_cents);
          if ("description" in expAccountLineItem) {
            expect(curItem.line_item_overview.description, "verify description transaction").to.eq(
              expAccountLineItem.description
            );
          }
        } else if (curItem.line_item_summary.original_amount_cents > expAccountLineItem.original_amount_cents) {
          expect(curItem.line_item_summary.original_amount_cents, "verify transaction status").greaterThan(
            expAccountLineItem.original_amount_cents
          );
          expect(curItem.line_item_summary.original_amount_cents, "verify transaction status").lessThan(
            2 * expAccountLineItem.original_amount_cents
          );
          if ("description" in expAccountLineItem) {
            expect(curItem.line_item_overview.description, "verify description transaction").to.not.eq(null);
          }
        }

        if ("effective_at" in expAccountLineItem) {
          expect(curItem.effective_at, "verify effective date line item ").to.includes(expAccountLineItem.effective_at);
        }
        if ("balance_cents" in expAccountLineItem) {
          expect(curItem.line_item_summary.balance_cents, "verify balance cents in line item summary").to.eq(
            expAccountLineItem.balance_cents
          );
        }
        if ("principal_cents" in expAccountLineItem) {
          expect(curItem.line_item_summary.principal_cents, "verify principal cents in line item summary").to.eq(
            expAccountLineItem.principal_cents
          );
        }
        if ("interest_balance_cents" in expAccountLineItem) {
          expect(
            curItem.line_item_summary.interest_balance_cents,
            "verify interest balance cents in line item summary"
          ).to.eq(expAccountLineItem.interest_balance_cents);
        }
        if ("deferred_interest_balance_cents" in expAccountLineItem) {
          expect(
            curItem.line_item_summary.deferred_interest_balance_cents,
            "verify deferred interest balance cents in line item summary"
          ).to.eq(expAccountLineItem.deferred_interest_balance_cents);
        }
        if ("am_deferred_interest_balance_cents" in expAccountLineItem) {
          expect(
            curItem.line_item_summary.am_deferred_interest_balance_cents,
            "verify AM deferred interest balance cents in line item summary"
          ).to.eq(expAccountLineItem.am_deferred_interest_balance_cents);
        }
        if ("am_interest_balance_cents" in expAccountLineItem) {
          expect(
            curItem.line_item_summary.am_interest_balance_cents,
            "verify AM interest balance cents in line item summary"
          ).to.eq(expAccountLineItem.am_interest_balance_cents);
        }
        if ("total_interest_paid_to_date_cents" in expAccountLineItem) {
          expect(
            curItem.line_item_summary.total_interest_paid_to_date_cents,
            "verify total interest paid to date cents in line item summary"
          ).to.eq(expAccountLineItem.total_interest_paid_to_date_cents);
        }
        return;
      }
    }
    expect(
      "",
      "check  " +
        expAccountLineItem.type +
        "and" +
        expAccountLineItem.effective_at +
        " is displayed in account line item"
    ).to.eq(expAccountLineItem.type);
  }

  //Check the given line item is displayed in the list
  //ex: const status = checkLineItem(response,"LATE_FEE")
  checkLineItem(response, transType) {
    const len = response.body.results.length;
    for (let counter = 0; counter < len; counter++) {
      const currType = response.body.results[counter].line_item_overview.line_item_type;
      if (currType == transType) {
        //given line item is displayed in item list
        return true;
      }
    }
    //given line item is not displayed in item list
    return false;
  }

  //Get the line item details for given line item type and given account
  //const line_item_JSON = getLineItem(response,"LATE_FEE")
  getLineItem(response, transType) {
    const len = response.body.results.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.results[counter];
      const currType = response.body.results[counter].line_item_overview.line_item_type;
      if (currType == transType) {
        return curItem;
      }
    }
    //If line item ex: LATE_FEE is not listed in account line items log test as fail
    expect(transType, "check  " + transType + " is displayed in account line item").to.eq("");
  }

  //Return the count of the line item is displayed in the list
  //ex: const count = countLineItem(response,"PAYMENT","auto_pay","PENDING",1)
  countLineItem(response, transType, description, status, count) {
    const len = response.body.results.length;
    let num = 0;
    let currType;
    let currDesc;
    let currStatus;
    for (let counter = 0; counter < len; counter++) {
      currType = response.body.results[counter].line_item_overview.line_item_type;
      currDesc = response.body.results[counter].line_item_overview.description;
      currStatus = response.body.results[counter].line_item_overview.line_item_status;

      if (currType == transType && currDesc == description && currStatus == status) {
        cy.log("Line Item By id : " + response.body.results[counter].line_item_id);
        num++;
      }
    }
    if (count == num) return true;

    return false;
  }

  //Verify statement line item type, status and amount for given account
  //ex: type StmlLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
  // const lateFeeLineItem: StmlLineItem = {status: "VALID",type: "LATE_FEE",original_amount_cents: parseInt(data.late_fee_cents)};
  // lineItemValidator.validateStatementLineItem(response, lateFeeLineItem);
  validateStatementLineItem(response, expStatementLineItem) {
    const len = response.body.line_items.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.line_items[counter];
      const currType = response.body.line_items[counter].line_item_overview.line_item_type;
      if (currType == expStatementLineItem.type) {
        expect(
          curItem.line_item_overview.line_item_type,
          "statement line item type " + expStatementLineItem.type + " is displayed"
        ).to.eq(expStatementLineItem.type);
        expect(curItem.line_item_overview.line_item_status, "verify transaction status").to.eq(
          expStatementLineItem.status
        );
        expect(curItem.line_item_summary.original_amount_cents, "verify transaction amount").to.eq(
          expStatementLineItem.original_amount_cents
        );
        return;
      }
    }
    expect("", "check  " + expStatementLineItem.type + " is displayed in statement line item").to.eq(
      expStatementLineItem.type
    );
  }

  //Get the line item details for given line item type and given account
  //const line_item_JSON = getLineItem(response,"LATE_FEE")
  getStatementLineItem(response, transType) {
    const len = response.body.line_items.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.line_items[counter];
      const currType = response.body.line_items[counter].line_item_overview.line_item_type;
      if (currType == transType) {
        return curItem;
      }
    }
    //If line item ex: LATE_FEE is not listed in account line items log test as fail
    expect(transType, "check  " + transType + " is displayed in account line item").to.eq("");
  }

  checkStatementLineItem(response, transType) {
    const len = response.body.line_items.length;
    for (let counter = 0; counter < len; counter++) {
      const currType = response.body.line_items[counter].line_item_overview.line_item_type;
      if (currType == transType) {
        return true;
      }
    }
    return false;
  }

  //Verify statement line item type, status,amount and effective_at for given account
  // ex: type StmlLineItem = Pick<LineItem, "status" | "type" |
  // "original_amount_cents" | "effective_at">;
  // const lateFeeLineItem: StmlLineItem = {status: "VALID",type: "LATE_FEE",original_amount_cents: parseInt(data.late_fee_cents),effective_at:data.effective_at};
  // lineItemValidator.validateStatementLineIteWwithEffectiveDate(response, lateFeeLineItem);
  validateStatementLineItemWithEffectiveDate(response, expStatementLineItem) {
    const len = response.body.line_items.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.line_items[counter];
      const currType = response.body.line_items[counter].line_item_overview.line_item_type;
      if (currType == expStatementLineItem.type && curItem.effective_at.includes(expStatementLineItem.effective_at)) {
        expect(
          curItem.line_item_overview.line_item_type,
          "statement line item type " + expStatementLineItem.type + " is displayed"
        ).to.eq(expStatementLineItem.type);
        expect(curItem.line_item_overview.line_item_status, "verify transaction status").to.eq(
          expStatementLineItem.status
        );
        expect(curItem.line_item_summary.original_amount_cents, "verify transaction amount").to.eq(
          expStatementLineItem.original_amount_cents
        );
        return;
      }
    }
    expect(
      "",
      "check  " +
        expStatementLineItem.type +
        "and" +
        expStatementLineItem.effective_at +
        " is displayed in statement line item"
    ).to.eq(expStatementLineItem.type);
  }

  //Verify Account line item type, status,amount for given account
  // ex: type AccLineItem = Pick<LineItem, "status" | "type" |
  // "original_amount_cents" >;
  // const lateFeeLineItem: StmlLineItem = {status: "VALID",type: "LATE_FEE",original_amount_cents: parseInt(data.late_fee_cents)};
  validateLineItemWithAmount(response, expStatus: string, expType: string, expOriginalAmount: number) {
    type accLineItem = Pick<LineItem, "status" | "type" | "original_amount_cents">;
    const lineItem: accLineItem = {
      status: expStatus,
      type: expType,
      original_amount_cents: expOriginalAmount,
    };
    this.validateLineItem(response, lineItem);
  }
}

export const lineItemValidator = new LineItemValidator();

export interface LineItem {
  status?: string;
  type: string;
  original_amount_cents?: number;
  effective_at?: string;
  description?: string;
  balance_cents?: number;
  principal_cents?: number;
  interest_balance_cents?: number;
  deferred_interest_balance_cents?: number;
  am_deferred_interest_balance_cents?: number;
  am_interest_balance_cents?: number;
  total_interest_paid_to_date_cents?: number;
  account_id?: number;
  product_id?: number;
  line_item_id?: string;
  created_at?: string;
  merchant_name?: string;
  mcc_code?: number;
  external_field_key?: string;
  external_field_value?: string;
}

export const lineItemValidatorAPI = new LineItemValidator();
