import { Constants } from "./constants";
import { v4 as uuid } from "uuid";

export class PayoutEntity {
  configurePayoutEntity(json) {
    return cy.request({
      method: "POST",
      url: "payout_entities",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }
  configureOrganizationNACHA(json) {
    return cy.request({
      method: "PUT",
      url: "organization/nacha_config",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  //configure organization for NACHA
  //ex:createConfigureOrganizationNACHA("organization.json")
  createConfigureOrganizationNACHA(fileName: string) {
    const payoutFileName = Constants.templateFixtureFilePath.concat("/payoutentity/", fileName);
    return cy.fixture(payoutFileName).then((payoutJson) => {
      cy.log(JSON.stringify(payoutJson));
      this.configureOrganizationNACHA(payoutJson).then((response) => {
        return response;
      });
    });
  }

  //create new payout entity using payout entity file
  //ex:createConfigurePayoutEntity("merchant.json")
  createConfigurePayoutEntity(fileName: string) {
    const payoutFileName = Constants.templateFixtureFilePath.concat("/payoutentity/", fileName);
    return cy.fixture(payoutFileName).then((payoutJson) => {
      payoutJson.payout_entity_id = payoutJson.payout_entity_type + "-".concat(uuid());
      cy.log(JSON.stringify(payoutJson));
      this.configurePayoutEntity(payoutJson).then((response) => {
        return response;
      });
    });
  }

  //create new payout entity using payout entity file with payout type, bank name
  //ex:createNewAccount("merchant.json", updated data)
  updateNCreatePayoutEntity(templateFileName: string, updateData) {
    //update payout entity id
    const payoutTemplateJSON = Constants.templateFixtureFilePath.concat("/payoutentity/", templateFileName);
    return cy.fixture(payoutTemplateJSON).then((payoutJson) => {
      payoutJson.payout_entity_id = payoutJson.payout_entity_type + "-".concat(uuid());

      if ("payout_entity_type" in updateData) {
        payoutJson.payout_entity_type = updateData.payout_entity_type;
        if (updateData.payout_entity_type === "delete") {
          delete payoutJson.payout_entity_type;
        }
      }
      if ("payout_entity_name" in updateData) {
        payoutJson.payout_entity_name = updateData.payout_entity_name;
        if (updateData.payout_entity_name === "delete") {
          delete payoutJson.payout_entity_name;
        }
      }
      if ("bank_account_number" in updateData) {
        payoutJson.bank_account_number = updateData.bank_account_number;
        if (updateData.bank_account_number === "delete") {
          delete payoutJson.bank_account_number;
        }
      }
      if ("bank_routing_number" in updateData) {
        payoutJson.bank_routing_number = updateData.bank_routing_number;
        if (updateData.bank_routing_number === "delete") {
          delete payoutJson.bank_routing_number;
        }
      }
      if ("irs_tin" in updateData) {
        payoutJson.irs_tin = updateData.irs_tin;
        if (updateData.irs_tin === "delete") {
          delete payoutJson.irs_tin;
        }
      }
      cy.log(JSON.stringify(payoutJson));
      this.configurePayoutEntity(payoutJson).then((response) => {
        //if payout entity update data contains doNot_check_response_status field
        //then not check the response status
        //this condition is for delete fields from payout entity payload
        if ("doNot_check_response_status" in updateData === false) {
          expect(response.status).to.eq(200);
        }
        return response;
      });
    });
  }
}

export const payoutAPI = new PayoutEntity();
export interface payoutEntityPayload {
  payout_entity_type?: string;
  payout_entity_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  irs_tin?: string;
  bank_account_type?: string;
  doNot_check_response_status?: boolean;
}
