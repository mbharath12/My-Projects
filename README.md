# Canopy QE Test Suite

Testing suite to ensure systematic stability of Canopy Servicing.

## Setup

Install Node.js 14 and above => https://nodejs.org/en/

Run  ```yarn install```

## Test Runner Usage

### Visual Selection Mode(debug):

Execute ```yarn cy:open``` then select specific spec you want to run

### CLI mode

Execute ```yarn cy:run```

### Test Selection in commandline mode
```
./node_modules/.bin/cypress run --spec "cypress/integration/createAccount.ts" 
```

## Write new Test

Test Case files located => cypress/integration

json fixtures located to use in tests => cypress/fixtures

api def => cypress/support

client_secret/id => cypress.json

json updater to run test with custom values => cypress/support/jsonUpdater.ts
(example use : cypress/integration/createAccount.ts)

CSV file format handling example => cypress/integration/createProductCSV.ts

### JSON Schema Validation

Response bodies from API requests should be checked if the structure of the
body-object is compliant with the JSON schema.

NOTE: Schema validation is not a replacement for functional tests

```js
// import
import validateSchema from '../validation/json_schema';

// before assertion
validateSchema.post_accounts(response.body);
expect(response.status).to.eq(200)
```

If there is a missing output schema, you can add one by following this pattern in
`json_schema.ts`.

```js
const extractPostSchema = extractSchema("post");

// accounts
const responseSchemaPostAccount = extractPostSchema("/accounts")(200);
const post_accounts = AJVInstance.compile(responseSchemaPostAccount);
// ^--- make sure to add this to OutputSchema

const OutputSchema = {
    post_accounts
};
```

## Troubleshooting

Q: Why are my code changes not working?
A: Don't forget to run `yarn tsc`
