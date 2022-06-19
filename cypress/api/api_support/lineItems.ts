import { Constants } from "cypress/api/api_support/constants";
export class LineItems {
  lineitembyid(accountID, line_item_id) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/line_items/" + line_item_id + " ",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  allLineitems(accountID) {
    return cy.request({
      method: "GET",
      url: "accounts/" + accountID + "/line_items ",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  creditOffSetLineitems(accountID: string, json: JSON) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/credit_offsets",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  manualFeesLineitems(accountID, json) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/manual_fees",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  paymentReversalLineitems(accountID, paymentID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/payment_reversals/" + paymentID,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  feeWaiverLineitems(accountID, lineItemID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/fee_waivers/" + lineItemID,
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    });
  }

  debitOffSetLineItems(accountID: string, json: JSON) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/debit_offsets",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  //ex:debitOffsetForAccount("4236","debit_offset.json", "5000", "2021-08-01T02:18:27-08:00")
  debitOffsetForAccount(accountID, templateFixtureFilePathName, amount, effectiveAt) {
    const debitOffsetTemplateJSON = Cypress.env("templateFolderPath").concat(
      "/lineitem/" + templateFixtureFilePathName
    );
    cy.fixture(debitOffsetTemplateJSON).then((createDebitOffsetJson) => {
      createDebitOffsetJson.original_amount_cents = amount;
      createDebitOffsetJson.effective_at = effectiveAt;
      this.debitOffSetLineItems(accountID, createDebitOffsetJson).then((response) => {
        expect(response.status, "debit offSet status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "check amount in debitOffset response").to.eq(
          parseInt(amount) * -1
        );
      });
    });
  }

  updateNcreatedebitoffset(accountID, templateFileName: string, updateData) {
    const debitOffsetTemplateJSON = Constants.templateFixtureFilePath.concat("/lineitem/", templateFileName);
    return cy.fixture(debitOffsetTemplateJSON).then((createDebitOffsetJson) => {
      if ("original_amount_cents" in updateData) {
        createDebitOffsetJson.original_amount_cents = updateData.original_amount_cents;
      }
      if ("effective_at" in updateData) {
        createDebitOffsetJson.effective_at = updateData.effective_at;
      }
      if ("allocation" in updateData) {
        createDebitOffsetJson.allocation = updateData.allocation;
        if (updateData.allocation === "delete") {
          delete createDebitOffsetJson.allocation;
        }
      }
      if ("line_item_id" in updateData) {
        createDebitOffsetJson.line_item_id = updateData.line_item_id;
      }
      cy.log(JSON.stringify(createDebitOffsetJson));
      this.debitOffSetLineItems(accountID, createDebitOffsetJson).then((response) => {
        expect(response.status, "debit offSet status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "check amount in debitOffset response").to.eq(
          parseInt(updateData.original_amount_cents) * -1
        );
      });
    });
  }

  //ex:creditOffsetForAccount("4236","credit_offset.json", "create_creditOffset_1.json","5000", "2021-08-01T02:18:27-08:00")
  creditOffsetForAccount(accountID, templateFixtureFilePathName, amount, effectiveAt) {
    const creditOffsetTemplateJSON = Cypress.env("templateFolderPath").concat(
      "/lineitem/" + templateFixtureFilePathName
    );
    return cy.fixture(creditOffsetTemplateJSON).then((createCreditOffsetJson) => {
      createCreditOffsetJson.original_amount_cents = amount;
      createCreditOffsetJson.effective_at = effectiveAt;
      this.creditOffSetLineitems(accountID, createCreditOffsetJson).then((response) => {
        expect(response.status, "credit offSet status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "check amount in creditOffset response").to.eq(
          parseInt(amount)
        );
        return response;
      });
    });
  }

  updateNcreatecreditoffset(accountID, templateFileName: string, updateData) {
    const creditOffsetTemplateJSON = Constants.templateFixtureFilePath.concat("/lineitem/", templateFileName);
    return cy.fixture(creditOffsetTemplateJSON).then((createCreditOffsetJson) => {
      if ("original_amount_cents" in updateData) {
        createCreditOffsetJson.original_amount_cents = updateData.original_amount_cents;
      }
      if ("effective_at" in updateData) {
        createCreditOffsetJson.effective_at = updateData.effective_at;
      }
      if ("allocation" in updateData) {
        createCreditOffsetJson.allocation = updateData.allocation;
        if (updateData.allocation === "delete") {
          delete createCreditOffsetJson.allocation;
        }
      }
      if ("line_item_id" in updateData) {
        createCreditOffsetJson.line_item_id = updateData.line_item_id;
      }
      cy.log(JSON.stringify(createCreditOffsetJson));
      this.creditOffSetLineitems(accountID, createCreditOffsetJson).then((response) => {
        expect(response.status, "credit offSet status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "check amount in creditOffset response").to.eq(
          parseInt(updateData.original_amount_cents)
        );
        return response;
      });
    });
  }

  //ex:manualFeeForAccount("4236","credit_offset.json", "create_creditOffset_1.json","5000", "2021-08-01T02:18:27-08:00")
  manualFeeForAccount(accountID, templateFixtureFilePathName, amount, effectiveAt) {
    const manualFeeTemplateJSON = Cypress.env("templateFolderPath").concat("/lineitem/" + templateFixtureFilePathName);
    return cy.fixture(manualFeeTemplateJSON).then((manualFeeOffsetJson) => {
      manualFeeOffsetJson.original_amount_cents = amount;
      manualFeeOffsetJson.effective_at = effectiveAt;
      this.manualFeesLineitems(accountID, manualFeeOffsetJson).then((response) => {
        expect(response.status, "manual fee response status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "check amount in manual fee response").to.eq(
          parseInt(amount)
        );
        return response;
      });
    });
  }

  getLineItemOfAnAccount(response, lineItemType, effectiveDate) {
    const len = response.body.results.length;
    for (let counter = 0; counter < len; counter++) {
      const curItem = response.body.results[counter];
      const currType = response.body.results[counter].line_item_overview.line_item_type;
      if (currType === lineItemType) {
        if (curItem.effective_at.includes(effectiveDate.slice(0, 10))) {
          return curItem.line_item_id;
        }
      }
    }
    //If line item ex: LATE_FEE is not listed in account line items log test as fail
    expect(lineItemType, "check  " + lineItemType + " is not displayed in account line item").to.eq("");
  }
}

export const lineItemsAPI = new LineItems();

export interface offsetPayload {
  effective_at?: string;
  original_amount_cents?: number;
  allocation?: string;
  line_item_id?:string;
}
