import { organizationAPI } from "../../../api_support/organization";
import { authAPI } from "../../../api_support/auth";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

TestFilters(["smoke", "regression"], () => {
  describe("Get Organization", () => {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });
    it("should be able to get organization", async () => {
      const response = await promisify(organizationAPI.getOrganization());
      expect(response.status).to.eq(200);
    });
  });
});
