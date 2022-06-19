
const TestFilters = (givenTags, runTest) => {
  if (Cypress.env('tags').length!=0) {
    const tags = Cypress.env('tags')
    const isFound = givenTags.some((givenTag) => tags.includes(givenTag))

    if (isFound) {
      runTest()
    }
  } else {
    runTest()
 }
};

export default TestFilters
