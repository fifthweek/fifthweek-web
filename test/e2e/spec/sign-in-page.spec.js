var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var SignInPage = require('../pages/sign-in.page.js');
var HeaderPage = require('../pages/header.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('sign-in page', function() {
  'use strict';

  var sidebar = new SidebarPage();
  var signOutPage = new SignOutPage();
  var homePage = new HomePage();
  var page = new SignInPage();

  it('should run once before all', function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
  });

  sidebar.includeSignedOutTests(sidebar.signInLink);

  describe('body', function() {

    it('should contain "forgot your details" link', function() {
      expect(page.forgotDetailsLink.isDisplayed()).toBe(true);
    });
  });
});
