// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "../ui/ui_support/cmd_util";
import "../ui/ui_support/pom/cmd_login";
import "../ui/ui_validation/cmd_account_validator"
import "cypress-xpath"

// Alternatively you can use CommonJS syntax:
// require('./commands')
