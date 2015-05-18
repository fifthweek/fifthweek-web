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

  describe('sidebar', function() {

    it('should contain 2 links', function () {
      expect(sidebar.links.count()).toBe(2);
    });

    it('should contain highlighted link for current page', function () {
      expect(sidebar.signInLink.getAttribute('class')).toContain('active');
    });

    it('should contain "Help" link', function () {
      expect(sidebar.helpLink.isDisplayed()).toBe(true);
    });
  });

  describe('body', function() {

    it('should contain "forgot your details" link', function() {
      expect(page.forgotDetailsLink.isDisplayed()).toBe(true);
    });
  });
});
