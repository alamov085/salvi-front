// eslint-disable-next-line no-undef
beforeEach(function() {
  // eslint-disable-next-line no-undef
  browser.url("/list_location")
})

// eslint-disable-next-line no-undef
describe("Successful Login into Salvi and Create the location in Salvi", function() {
  // eslint-disable-next-line no-undef
  beforeEach(function() {
    console.log("Log in into Salvi and Create the location in Salvi ASSISTANT")
  })

  // eslint-disable-next-line no-undef,no-unused-vars
  it("Should be able to Login into Salvi and Create the location via modal form", function(done) {
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div > div > form > div:nth-child(2) > input",
      "admin@admin.com"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div > div > form > div:nth-child(3) > input",
      "Q12345678"
    )
    // eslint-disable-next-line no-undef
    browser.click("[type='submit']")
    // eslint-disable-next-line no-undef
    browser.pause(2000)
    // eslint-disable-next-line no-undef
    browser.click(
      "#app > div > div.section > div.section__content > div.section__content__head > div.setting__table > button"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(1) > input",
      "Test_location"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(3) > input",
      "Test_city"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(4) > input",
      "Testova"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(5) > input",
      "1"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(6) > input",
      "1"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(7) > input",
      "1"
    )
    // eslint-disable-next-line no-undef
    browser.setValue(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.container.grid-list-md > div > div:nth-child(9) > div > input",
      "501111111"
    )
    // eslint-disable-next-line no-undef
    browser.pause(1000)
    // eslint-disable-next-line no-undef
    browser.click(
      "#app > div > div.v-dialog__content.v-dialog__content--active > div > div.v-card.v-sheet.theme--light > div.v-card__actions > button.button.button__yellow"
    )

    //var successfulLoginConfirmation = browser.isExisting('#lk-index head');
    //expect(successfulLoginConfirmation, 'Successful submission Message does not exist').to.be.true;

    // eslint-disable-next-line no-unused-vars,no-undef
    var successfulSubmission = browser.getText("#list_location")
    // eslint-disable-next-line no-undef
    expect(successfulCreateConfirmation).to.equal("admin@admin.com")
    // eslint-disable-next-line no-undef
    browser.pause(2000)
  })
})
