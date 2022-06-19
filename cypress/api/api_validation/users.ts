export class UsersValidation {
  getAllUsersAndValidate(response) {
    let len = response.body.length;
    if (len !== 0) {
      for (let i = 0; i <= len - 1; i++) {
        expect(response.body[i].api_user_id, "Check api userid in api user id response").not.null;
        expect(response.body[i].email, "Check email in api user response").not.null;
        expect(response.body[i].status, "Check status in api user response").not.null;
        expect(response.body[i].first_name, "Check first name in api user response").not.null;
        expect(response.body[i].last_name, "Check last name in api user response").not.null;
        expect(response.body[i].phone, "Check phone in api user response").not.null;
        expect(response.body[i].role, "Check role in api user response").not.null;
        expect(response.body[i].token, "Check token in api user response").to.eq("");
      }
    }
  }
}

export const validateuserdetails = new UsersValidation();
