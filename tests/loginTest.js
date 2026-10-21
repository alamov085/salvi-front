beforeEach(function() {
  browser.url("/lk-index")
  //localStorage.clear();
})

describe("Login form Salvi", function() {
  beforeEach(function() {
    console.log("Login to Salvi ASSISTANT")
  })

  it("Should be able to login via Login form", function(done) {
    browser.setValue(
      "#app > div > div > div > form > div:nth-child(2) > input",
      "admin@admin.com"
    )
    browser.setValue(
      "#app > div > div > div > form > div:nth-child(3) > input",
      "Q12345678"
    )
    browser.click("[type='submit']")

    //var successfulSubmission = browser.getText('#SALVI ASSISTANT');
    //expect(successfulLoginConfirmation).to.equal('admin@admin.com');
    //browser.pause(1000)
  })
})
