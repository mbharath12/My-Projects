/* eslint-disable cypress/no-async-tests */
import { productAPI } from "cypress/api/api_support/product";
import { authAPI } from "cypress/api/api_support/auth";
import TestFilters from "cypress/support/filter_tests.js";
import promisify from "cypress-promise";

//Test Scripts
//PP1165 -	Get all available Products
//PP1166 -	Default number of products that will be retrieved - 10
//PP1167 -  Default maximum number of products that will be retrieved - 100

TestFilters(["smoke", "regression", "product"], () => {
  describe("validation of maximum retrieval of products", () => {
    before(() => {
      authAPI.getDefaultUserAccessToken();
    });

    it("should be able to get all products", async () => {
      const response = await promisify(productAPI.getAllProducts());
      expect(response.status, "verify the get all products").to.eq(200);
    });

    it("should be able retrieve default 10 products", async () => {
      const response = await promisify(productAPI.getAllProducts());
      expect(response.status, "verify the response is successful").to.eq(200);
      cy.log("Product Counts: " + response.body.results.length);
      expect(response.body.results.length, "verify the product count is equal to 10").to.eq(10);
    });

    it("should be able to retrieve default max 100 products", async () => {
      const maxResponse = await promisify(productAPI.getAllProductWithLimit(100));
      expect(maxResponse.status, "verify the response is successful").to.eq(200);
      cy.log("Product Counts: " + maxResponse.body.results.length);
      expect(maxResponse.body.results.length, "verify the product count is equal to 100").to.eq(100);
      productAPI.getAllProductWithLimit(110).then((response) => {
        expect(response.status, "Maximum number of products to retrieve is 100").to.eq(500);
      });
    });
  });
});
