describe("Verify whether dev.salvi.com.ua links on homepage work correctly", function() {
  it("check that the registration button opens the registration page", function(done) {
    browser.setViewportSize({
      width: 1200,
      height: 800
    })
    browser.url("/")
    var title = browser.getTitle()
    expect(title).to.equal("SALVI")
    console.log("Title is: " + title)
    browser.click("#app > div > header > div.nav > a")
    browser.pause(1000)
  })

  it("check that the presentation button opens the presentation page", function(done) {
    browser.url("/")
    browser.click(
      "#home > div.container-xl.footer__wrap > footer > div.footer__end > a"
    )
    var title = browser.getTitle()
    title.should.equal("SALVI")
    console.log("Title is: " + title)
    browser.pause(1000)
  })
})
