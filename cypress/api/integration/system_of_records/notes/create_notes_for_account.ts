/* eslint-disable cypress/no-async-tests */
import { accountAPI } from "../../../api_support/account";
import { productAPI } from "../../../api_support/product";
import { customerAPI } from "../../../api_support/customer";
import { authAPI } from "../../../api_support/auth";
import { notesAPI } from "../../../api_support/notes";
import promisify from "cypress-promise";
import TestFilters from "../../../../support/filter_tests";
import { dateHelper } from "../../../api_support/date_helpers";
import { rollTimeAPI } from "cypress/api/api_support/rollTime";

//Test Cases Covered
//PP2195 - Create note for an account
//PP2196 - Create multiple notes for an account
//PP2197 - View all the notes created for an account, with history
//PP2198 - Verify Contents for a note is mandatory in the request
//PP2199 - Validate a unique note id is created
//PP2200 - Validate the details of the note creator is captured and retrieved - author API user id
//PP2201 - Validate the details of the note creator is captured and retrieved - author Organization name
//PP2202 - Validate the details of the note creator is captured and retrieved - author first name
//PP2203 - Validate the details of the note creator is captured and retrieved - author API last name
//PP2204 - Validate the details of the note creator is captured and retrieved- author API email id
//PP2205 - Validate the details of the note creator is captured and retrieved- author phone
//PP2206 - Validate the details of the note creator is captured  and retrieved- author role
//PP2207 - Validate the message contents of the note is captured  and retrieved
//PP2208 - Validate the note created date is captured  and retrieved
//PP2209 - Get all notes for a Specific account
//PP2210 - Verify historical notes in Delinquent account can be retrieved
//PP2211 - Verify historical notes in a Closed account can be retrieved

TestFilters(["regression", "account", "notes"], () => {
  describe("Verify get information on a specific Line item for a  Specific account- response", function () {
    let productID;
    let customerID;
    let response;
    let accountID;
    let message1;
    let message2;
    let message3;

    //Create Access Token
    before(async () => {
      authAPI.getDefaultUserAccessToken();
      //Create a new customer
      customerID = await promisify(customerAPI.createNewCustomer("create_customer.json"));
    });

    it("should be able to create product", async () => {
      //Create a new installment product
      response = await promisify(productAPI.updatePaymentDuePoliciesNCreateProduct("payment_product.json", "2", "4"));
      productID = response.body.product_id;
      cy.log("new product created: " + productID);
    });

    it("should be able to create an account, assign customer", async () => {
      //Update product in account JSON file
      const effectiveAt = "2021-08-06T06:33:54-04:00";
      response = await promisify(
        accountAPI.createNewAccount(productID, customerID, effectiveAt, "account_credit.json")
      );
      expect(response.status).to.eq(200);
      accountID = response.body.account_id;
      cy.log("new account created: " + accountID);
    });

    it(`should be able to create first notes for an account`, async () => {
      const expCreatedDate = dateHelper.addDays(0, 0);
      message1 = "Create first note. Attempted to call back customer but no response.";
      response = await promisify(notesAPI.createNotesForAccount(accountID, "notes.json", message1));
      expect(response.status).to.eq(200);
      //check note id is created
      const notes_id = response.body.note_id;
      expect(notes_id, "check notes unique id is created").to.not.be.null;
      expect(response.body.created_date, "check notes created date is displayed").to.includes(
        expCreatedDate.slice(0, 10)
      );
    });

    it(`should be able to create multiple notes for an account`, async () => {
      message2 = "Create Second note. Attempted to call back customer but no response.";
      response = await promisify(notesAPI.createNotesForAccount(accountID, "notes.json", message2));
      expect(response.status).to.eq(200);

      message3 = "Create Third note. Attempted to call back customer but no response.";
      response = await promisify(notesAPI.createNotesForAccount(accountID, "notes.json", message3));
      expect(response.status).to.eq(200);
    });

    it(`should have to view all notes for an account`, async () => {
      response = await promisify(notesAPI.getAllNotes(accountID));
      expect(response.status).to.eq(200);
      expect(response.body.length, "check all notes of account are retrieved").to.eq(3);
      const actNote1Msg = response.body[0].message;
      const actNote2Msg = response.body[1].message;
      const actNote3Msg = response.body[2].message;
      expect(actNote1Msg, "check first notes message").to.include(message1);
      expect(actNote2Msg, "check second notes message").to.include(message2);
      expect(actNote3Msg, "check third notes message").to.include(message3);
    });

    it(`should have to validate note creator details in notes`, async () => {
      const userAPIResponse = await promisify(authAPI.getAPIUserSummary());
      response = await promisify(notesAPI.getAllNotes(accountID));
      expect(response.body[0].author.api_user_id, "check note creator api user id").to.eq(
        userAPIResponse.body.api_user_id
      );
      expect(response.body[0].author.organization_name, "check note creator organization name").to.eq(
        userAPIResponse.body.organization_name
      );
      expect(response.body[0].author.name_first, "check note creator first name").to.eq(
        userAPIResponse.body.name_first
      );
      expect(response.body[0].author.name_last, "check note creator last name").to.eq(userAPIResponse.body.name_last);
      expect(response.body[0].author.email, "check note creator email").to.eq(userAPIResponse.body.email);
      expect(response.body[0].author.phone, "check note creator phone").to.eq(userAPIResponse.body.phone);
      expect(response.body[0].author.role, "check note creator role").to.eq(userAPIResponse.body.role);
    });

    it(`should have to wait for account roll time forward to change the status to delinquent`, async () => {
      const endDate = "2021-11-01";
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });

    it(`should have to validate retrieve notes from delinquent account `, async () => {
      response = await promisify(notesAPI.getAllNotes(accountID));
      expect(response.body.length, "check all notes of delinquent account are retrieved").to.eq(3);
    });

    it(`should have to wait for account roll time forward to change the status to closed/charged off`, async () => {
      const endDate = "2022-02-01";
      response = await promisify(rollTimeAPI.rollAccountForward(accountID, endDate));
      expect(response.status).to.eq(200);
    });

    it(`should have to validate retrieve notes from charged off account `, async () => {
      response = await promisify(notesAPI.getAllNotes(accountID));
      expect(response.body.length, "check all notes of charged off account are retrieved").to.eq(3);
    });
  });
});
