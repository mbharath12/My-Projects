import { Product } from "../../support/product";
import { Account } from "../../support/account";
import { Auth } from "../../support/auth";
import { JSONUpdater } from "../../support/jsonUpdater";
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const {Client} = require('pg')

//import {Customer} from '../../support/customer';

describe("Migration test flow", () => {
  let accountID;
  let productID;

  const product = new Product();
  const account = new Account();
  // const customer = new Customer();
  const jsonUpdater = new JSONUpdater();

  before(() => {
    const auth = new Auth();
    auth.getAccessToken(Cypress.env("CLIENT_ID"), Cypress.env("CLIENT_SECRET")).then((response) => {
      Cypress.env("accessToken", "Bearer " + response.body.access_token);
    });

    //cy.fixture('pro1duct/artis_product.json').then((productjson) => {
    //product.createProduct(productjson).then((response)=> {
    // expect(response.status).to.eq(200)
    //productID = response.body.product_id
    // cy.log('new product created : ' + productID)
    // Cypress.env('product_id',productID)
    // })
  });
});

xit("should be able to cerate a new acct", () => {
  //cy.postgresql(`SELECT *  FROM accounts where account_id=123'`).should('eq', 'test');
  // const client = new Client({
  //   host: "aurora-qa.cluster-czyzwdii862u.us-east-1.rds.amazonaws.com",
  //   user: "clusteradmin",
  //   port: 5432,
  //   password: "Jr}&udw?YLeV2r6Ti=O-ahU;23IiM)mc",
  //   database: "sor"
  //   // host: "localhost",
  //   // user: "gopi",
  //   // port: 5432,
  //   // password: "root1234",
  //   // database: "test"
  // })
  // client.connect();
  // client.query("select * from accounts where account_id = 1004"), (err,res) => {
  //   if(!err){
  //     console.log(res.rows)
  //   }
  //   else{
  //     console.log(err.message)
  //   }
  //   client.end();
  // }
  //jsonUpdater.updateJSON('cypress/fixtures/account/artis_account.json','cypress/fixtures/account/create_account.json','product_id',productID)
  //jsonUpdater.updateJSON('cypress/fixtures/account/create_account.json','cypress/fixtures/account/create_account.json','customer_account_external_id',customerID)
  //jsonUpdater.updateJSON('cypress/fixtures/account/create_account.json','cypress/fixtures/account/create_account.json','customer_id',customerID)
  // cy.fixture('account/artis_account.json').then((accountjson) => {
  //account.createAccount(accountjson).then((response)=> {
  // accountID = response.body.account_id
  //cy.log('new account created : ' + accountID)
  // Cypress.env('accountID',accountID)
  // expect(response.status).to.eq(200)
  // })
  // })
});

// it ('should be able to create a new customer', () => {
//   cy.fixture('customer/create_customer.json').then((customerJSON) => {
//     customer.createCustomer(customerJSON).then((response)=> {
//       customerID = response.body.customer_id
//       cy.log('new customer created : ' + customerID)
//       Cypress.env('customerID',customerID)
//       expect(response.status).to.eq(200)
//     })
//   })
// });

//});
