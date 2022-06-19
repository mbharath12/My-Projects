import { authAPI } from "../../../api_support/auth";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { usersAPI, usersPayload } from "../../../api_support/users";
import userJSON from "../../../../resources/testdata/users/register_new_organization_and_user.json";
import { v4 as uuidv4 } from "uuid";

//Test Cases:
// PP2237 Validate error for invalid first_name format
// PP2238 Validate error when last_name format
// PP2239 Validate error for invalid password
// PP2240 Validate error for invalid email
// PP2241 Verify Email id cannot be duplicated
// PP2242 Validate error for invalid organization_name
// PP2136 Verify the status in the response as Success

TestFilters(["smoke", "regression", "organization", "users"], () => {
  describe("Validate registration of new organization", () => {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    //iterate for each user
    userJSON.forEach((data) => {
      xit(`should able register a new organization '${data.tc_name}'`, async () => {
        const email = "harriet".concat(uuidv4()) + "@acmecorporation.com";
        if (data.randromEmail == "FALSE") {
          const usersPayload: registerNewOrg = {
            name_first: data.name_first,
            name_last: data.name_last,
            password: data.password,
            email: data.email,
            organization_name: data.organization_name,
          };
          //Update payload and register a organization
          const response = await promisify(usersAPI.registerOrg("register_New_Organization.json", usersPayload));
          const statusCode = parseInt(data.expected_status_code);
          expect(response.status).to.eq(statusCode);
          expect(response.body.error.message).to.eq(data.error_message);
        } else {
          const usersPayload: registerNewOrg = {
            name_first: data.name_first,
            name_last: data.name_last,
            password: data.password,
            email: email,
            organization_name: data.organization_name,
          };
          //Update payload and register a organization
          const response = await promisify(usersAPI.registerOrg("register_New_Organization.json", usersPayload));
          const statusCode = parseInt(data.expected_status_code);
          expect(response.status).to.eq(statusCode);
        }
      });
    });
  });
});

type registerNewOrg = Pick<usersPayload, "email" | "name_first" | "name_last" | "password" | "organization_name">;
