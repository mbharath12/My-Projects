export class Charge {
  createCharge(json, accountID) {
    return cy.request({
      method: "POST",
      url: "accounts/" + accountID + "/line_items/charges",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  //Charge for given account number with the amount and effective at date
  //ex:chargeForAccount("4236","charge.json", "create_charge1.json","5000", "2021-08-01T02:18:27-08:00")
  chargeForAccount(accountID, templateFixtureFilePathName, chargeAmount, chargeEffectiveDt) {
    const chargeTemplateJSON = Cypress.env("templateFolderPath").concat("/charge/", templateFixtureFilePathName);
    return cy.fixture(chargeTemplateJSON).then((chargeJSON) => {
      if (chargeEffectiveDt.length) {
        chargeJSON.effective_at = chargeEffectiveDt;
      }
      chargeJSON.original_amount_cents = chargeAmount;
      this.createCharge(chargeJSON, accountID).then((response) => {
        expect(response.status, "charge response status").to.eq(200);
      });
    });
  }

  // Validate charge is not created with negative values on amount and
  // effective_dt
  //validate charge response codes
  //charge is not created on closed account and
  chargeForNegativeAccount(accountID, templateFileName, updateData, responseStatus) {
    const chargeTemplateJSON = Cypress.env("templateFolderPath").concat("/charge/", templateFileName);
    return cy.fixture(chargeTemplateJSON).then((chargeJSON) => {
      if ("effective_at" in updateData) {
        chargeJSON.effective_at = updateData.effective_at;
      }
      if ("original_amount_cents" in updateData) {
        chargeJSON.original_amount_cents = updateData.original_amount_cents;
      }
      if ("line_item_id" in updateData) {
        chargeJSON.line_item_id = updateData.line_item_id;
      }
      cy.log(JSON.stringify(chargeJSON));
      this.createCharge(chargeJSON, accountID).then((response) => {
        expect(response.status, "charge response status").to.eq(parseInt(responseStatus));
      });
    });
  }
}

export const chargeAPI = new Charge();
export interface ChargePayload {
  effective_at?: string;
  original_amount_cents?: number;
  line_item_id?: string;
}
