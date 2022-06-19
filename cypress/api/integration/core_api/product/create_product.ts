import { productAPI } from "../../../api_support/product";
import { authAPI } from "../../../api_support/auth";
import TestFilters from "../../../../support/filter_tests.js";
import promisify from "cypress-promise";

TestFilters(["smoke", "regression"], () => {
  describe("create product", () => {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    // eslint-disable-next-line cypress/no-async-tests
    it("should be able to cerate a new product", async () => {
      const productID = await promisify(productAPI.createNewProduct("product.json"));
      cy.log("new product created:" + productID);
    });

    it("should be able to get all products create", async () => {
      const response = await promisify(productAPI.getAllProducts());
      expect(response.status).to.eq(200);
    });
  });
});
