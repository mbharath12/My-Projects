export class Payment {
  createPayment(json, accountID) {
    return cy.request({
      method: "POST",

      url: "accounts/" + accountID + "/line_items/payments ",

      headers: {
        Authorization: Cypress.env("accessToken"),

        "Content-Type": "application/json",
      },

      body: json,

      failOnStatusCode: false,
    });
  }

  reversePayment(accountID, pmt_line_item_id) {
    return cy.request({
      method: "POST",

      url: "accounts/" + accountID + "/line_items/payment_reversals/" + pmt_line_item_id,

      headers: {
        Authorization: Cypress.env("accessToken"),

        "Content-Type": "application/json",
      },

      failOnStatusCode: false,
    });
  }
  editPaymentProcessorConfig(accountID: string, json: JSON) {
    return cy.request({
      method: "PUT",

      url: "accounts/" + accountID + "/payment_processor_config",

      headers: {
        Authorization: Cypress.env("accessToken"),

        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  createPaymentRecord(json, accountID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/payments/payment_record ",
      headers: {
        Authorization: Cypress.env("accessToken"),

        "Content-Type": "application/json",
      },

      body: json,

      failOnStatusCode: false,
    });
  }

  createPaymentTransfer(json, accountID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/payments/payment_transfer ",
      headers: {
        Authorization: Cypress.env("accessToken"),

        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  //Pay for given account number with the amount and effective at date
  //ex:paymentForAccount("4236","payment.json", "create_payment1.json","5000", "2021-08-01T02:18:27-08:00")
  paymentForAccount(accountID, templateFixtureFilePathName, amount, paymentEffectiveAt) {
    const paymentTemplateJSON = Cypress.env("templateFolderPath").concat("/payment/", templateFixtureFilePathName);
    return cy.fixture(paymentTemplateJSON).then((paymentJSON) => {
      paymentJSON.effective_at = paymentEffectiveAt;
      paymentJSON.original_amount_cents = amount;
      this.createPayment(paymentJSON, accountID).then((response) => {
        expect(response.status, "payment response status").to.eq(200);
        expect(response.body.line_item_summary.principal_cents, "check payment amount in payment response").to.eq(
          paymentJSON.original_amount_cents * -1
        );
        return response.body.line_item_id;
      });
    });
  }

  //Pay for given account number with the amount and effective at date
  //ex:updateNCreatePaymentRecord("4236","payment.json","5000", "2021-08-01T02:18:27-08:00")
  updateNCreatePaymentRecord(accountID, templateFileName: string, updateData) {
    const paymentTemplateJSON = Cypress.env("templateFolderPath").concat("/payment/", templateFileName);
    return cy.fixture(paymentTemplateJSON).then((paymentRecordJson) => {
      if ("line_item_id" in updateData) {
        paymentRecordJson.line_item_id = updateData.line_item_id;
      }
      cy.log(JSON.stringify(paymentRecordJson));
      this.createPaymentRecord(paymentRecordJson, accountID).then((response) => {
        expect(response.status).to.eq(200);
        return response;
      });
    });
  }

  //Pay for given account number with the amount and effective at date
  //ex:updateNCreatePaymentTransfer("4236","payment.json", "5000", "2021-08-01T02:18:27-08:00")
  updateNCreatePaymentTransfer(accountID, templateFileName: string, updateData) {
    const paymentTemplateJSON = Cypress.env("templateFolderPath").concat("/payment/", templateFileName);
    return cy.fixture(paymentTemplateJSON).then((paymentTransferJson) => {
      if ("effective_at" in updateData) {
        paymentTransferJson.effective_at = updateData.effective_at;
      }
      if ("original_amount_cents" in updateData) {
        paymentTransferJson.original_amount_cents = updateData.original_amount_cents;
      }
      cy.log(JSON.stringify(paymentTransferJson));
      this.createPaymentTransfer(paymentTransferJson, accountID).then((response) => {
        expect(response.status).to.eq(200);
        return response;
      });
    });
  }
}

export const paymentAPI = new Payment();
export interface PaymentPayload {
  line_item_id: string;
  effective_at: string;
  original_amount_cents: number;
}
