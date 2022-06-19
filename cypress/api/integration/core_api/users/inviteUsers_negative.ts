import { authAPI } from "../../../api_support/auth";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";
import { usersAPI, usersPayload } from "../../../api_support/users";
import userJSON from "../../../../resources/testdata/users/invite_user.json";
import { v4 as uuidv4 } from "uuid";

//Test Cases:
// PP2229 Validate error for invalid email id format
// PP2130 Validate error when email id of existing user
// PP2134 Validate error for invalid phone number format
// PP2135 Verify the status in the response as Success

TestFilters(["smoke", "regression", "users"], () => {
  describe("Validate invite a user", () => {
    before(() => {
      authAPI.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });
    });

    //iterate for each user
    userJSON.forEach((data) => {
      it(`should able to invite a user with '${data.tc_name}'`, async () => {
        const email = "marissa".concat(uuidv4()) + "@globex.com";
        if (data.randromEmail == "FALSE") {
          const usersPayload: userCreate = {
            email: data.email,
            phone: data.phone,
          };
          //Update payload and create a user
          const response = await promisify(usersAPI.inviteAUser("invite_new_user.json", usersPayload));
          const statusCode = parseInt(data.expected_status_code);
          expect(response.status).to.eq(statusCode);
          expect(response.body.error.message).to.eq(data.error_message);
        } else {
          const usersPayload: userCreate = {
            email: email,
            phone: data.phone,
          };
          //Update payload and create a user
          const response = await promisify(usersAPI.inviteAUser("invite_new_user.json", usersPayload));
          const statusCode = parseInt(data.expected_status_code);
          expect(response.status).to.eq(statusCode);
        }
      });
    });
  });
});

type userCreate = Pick<usersPayload, "email" | "phone">;
