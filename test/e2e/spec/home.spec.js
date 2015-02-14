var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');

describe("homepage", function() {
  'use strict';

  var homePage = new HomePage();
  var signOutPage = new SignOutPage();

  signOutPage.signOutAndGoHome();

  it('should have a sign-in link', function() {
    expect(homePage.signInLink.getText()).toContain('Sign In');
    homePage.signInLink.click();
    expect(browser.getCurrentUrl()).toContain('/sign-in');
  });
});
