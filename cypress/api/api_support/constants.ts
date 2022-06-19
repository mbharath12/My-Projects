export const Constants = {
  templateFixtureFilePath: Cypress.env("templateFolderPath"),
  templateResourceFilePath: Cypress.env("resourceFolderPath") + "/" + Cypress.env("templateFolderPath"),
  tempFixtureFilePath: Cypress.env("tempFolderPath"),
  tempResourceFilePath: Cypress.env("resourceFolderPath") + "/" + Cypress.env("tempFolderPath"),
};

export const CycleTypeConstants = {
  cycle_interval_7days: "7 days",
  cycle_due_interval_7days: "-2 days",
  first_cycle_interval_7days: "7days",
  cycle_interval_14days: "14 days",
  cycle_due_interval_14days: "2 days",
  first_cycle_interval_14days: "14 days",
  cycle_interval_21days: "21 days",
  cycle_due_interval_21days: "5 days",
  cycle_interval_30days: "30 days",
  cycle_due_interval_30days: "-5 days",
  first_cycle_interval_30days: "30 days",
  cycle_interval_1month: "1 month",
  cycle_due_interval_1month: "28 days",
  first_cycle_interval_1month: "1 month",
};

export const DefaultValues ={
  customerLimit : 30
}
