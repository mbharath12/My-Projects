export class Refunds {
  createRefund(json, accountID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/refunds",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }
  updateNCreateRefund(accountID, templateFileName: string, updateData) {
    const paymentTemplateJSON = Cypress.env("templateFolderPath").concat("/refund/", templateFileName);
    return cy.fixture(paymentTemplateJSON).then((paymentRecordJson) => {
      if ("line_item_id" in updateData) {
        paymentRecordJson.line_item_id = updateData.line_item_id;
      }
      cy.log(JSON.stringify(paymentRecordJson));
      this.createRefund(paymentRecordJson, accountID).then((response) => {
        expect(response.status).to.eq(200);
        return response;
      });
    });
  }
  //refund for given account number with the amount and effective at date
  //ex:refundForAccount("4236","refund.json","5000", "2021-08-01T02:18:27-08:00")
  refundForAccount(accountID, templateFixtureFilePathName, refundAmount, refundEffectiveDt) {
    const refundTemplateJSON = Cypress.env("templateFolderPath").concat("/refund/", templateFixtureFilePathName);
    return cy.fixture(refundTemplateJSON).then((refundJSON) => {
      refundJSON.effective_at = refundEffectiveDt;
      refundJSON.original_amount_cents = refundAmount;
      this.createRefund(refundJSON, accountID).then((response) => {
        expect(response.status, "refund response status").to.eq(200);
      });
    });
  }
}

export const refundAPI = new Refunds();
export interface refundPayload {
  line_item_id: string;
}
