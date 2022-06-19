import { Constants } from "cypress/api/api_support/constants";
export class Users {
  inviteUser(json) {
    return cy.request({
      method: "POST",
      url: "api_users",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  registerOrganisation(json) {
    return cy.request({
      method: "POST",
      url: "register",
      headers: {
        Authorization: Cypress.env("accessToken"),
        "Content-Type": "application/json",
      },
      body: json,
      failOnStatusCode: false,
    });
  }

  inviteAUser(templateFileName: string, updateData) {
    const inviteUserTemplateFile = Constants.templateFixtureFilePath.concat("/users/", templateFileName);
    return cy.fixture(inviteUserTemplateFile).then((inviteUserJson) => {
      if ("phone" in updateData) {
        inviteUserJson.phone = updateData.phone;
        if (updateData.phone === "delete") {
          delete inviteUserJson.phone;
        }
      }
      if ("email" in updateData) {
        inviteUserJson.email = updateData.email;
        if (updateData.email === "delete") {
          delete inviteUserJson.email;
        }
      }
      if ("name_first" in updateData) {
        inviteUserJson.name_first = updateData.name_first;
        if (updateData.name_first === "delete") {
          delete inviteUserJson.name_first;
        }
      }
      if ("name_last" in updateData) {
        inviteUserJson.name_last = updateData.name_last;
        if (updateData.name_last === "delete") {
          delete inviteUserJson.name_last;
        }
      }
      if ("role" in updateData) {
        inviteUserJson.role = updateData.role;
        if (updateData.role === "delete") {
          delete inviteUserJson.role;
        }
      }
      cy.log(JSON.stringify(inviteUserJson));
      this.inviteUser(inviteUserJson).then((response) => {
        if ("doNot_check_response_status" in updateData === false) {
        }
        return response;
      });
    });
  }

  registerOrg(templateFileName: string, updateData) {
    const registernewOrgTemplateFile = Constants.templateFixtureFilePath.concat("/users/", templateFileName);
    return cy.fixture(registernewOrgTemplateFile).then((newOrgCreateJson) => {
      if ("name_first" in updateData) {
        newOrgCreateJson.name_first = updateData.name_first;
        if (updateData.name_first === "delete") {
          delete newOrgCreateJson.name_first;
        }
      }
      if ("name_last" in updateData) {
        newOrgCreateJson.name_last = updateData.name_last;
        if (updateData.name_last === "delete") {
          delete newOrgCreateJson.name_last;
        }
      }
      if ("password" in updateData) {
        newOrgCreateJson.password = updateData.password;
        if (updateData.password === "delete") {
          delete newOrgCreateJson.password;
        }
      }
      if ("email" in updateData) {
        newOrgCreateJson.email = updateData.email;
        if (updateData.email === "delete") {
          delete newOrgCreateJson.email;
        }
      }
      if ("organization_name" in updateData) {
        newOrgCreateJson.organization_name = updateData.organization_name;
        if (updateData.organization_name === "delete") {
          delete newOrgCreateJson.organization_name;
        }
      }
      cy.log(JSON.stringify(newOrgCreateJson));
      this.registerOrganisation(newOrgCreateJson).then((response) => {
        if ("doNot_check_response_status" in updateData === false) {
        }
        return response;
      });
    });
  }
}

export const usersAPI = new Users();

export interface usersPayload {
  email?: string;
  phone?: string;
  role?: string;
  name_first?: string;
  name_last?: string;
  organization_name?: string;
  password?: string;
}
