import promisify from "cypress-promise";
import { authAPI } from "../../../api_support/auth";
import TestFilters from "../../../../support/filter_tests.js";
import { validateuserdetails } from "../../../api_validation/users";

//Test Cases:
// TCPP2212 - Verify "Get all API users in your organisation", endpoint retrieves list of all API users in the organization
// TCPP2214 - Verify api_user_id  is unique in Canopy for this API user is retrieved
// TCPP2216 - Verify first name of the API user is retrieved
// TCPP2217 - Verify last name of the API user is retrieved
// TCPP2218 - Verify email address of this API User is retrieved
// TCPP2219 - Verify Phone number of the API user is retrieved
// TCPP2220 - Verify  role of the API user is retrieved
// TCPP2221 - Verify status of the API user is retrieved
// TCPP2222 - Verify token of the API user is retrieved

TestFilters(["smoke", "regression", "users"], () => {
  describe("Validate user details", () => {
    let response;

    before(() => {
      authAPI.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
        Cypress.env("accessToken", "Bearer " + response.body.access_token);
      });
    });

    it(`should have to get api user details and validate`, async () => {
      response = await promisify(authAPI.getAPIUsers());
      expect(response.status).to.eq(200);
      validateuserdetails.getAllUsersAndValidate(response);
    });
  });
});
