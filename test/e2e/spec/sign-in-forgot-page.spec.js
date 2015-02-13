var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var SignInPage = require('../pages/sign-in.page.js');
var SignInForgotPage = require('../pages/sign-in-forgot.page.js');
var HeaderPage = require('../pages/header.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('sign-in - forgot details page', function() {
  'use strict';

  var header = new HeaderPage();
  var sidebar = new SidebarPage();
  var signOutPage = new SignOutPage();
  var homePage = new HomePage();
  var signInPage = new SignInPage();
  var page = new SignInForgotPage();

  it('should run once before all', function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.forgotDetailsLink.click();
  });

  describe('header', function() {

    it('should contain title', function() {
      expect(header.title.getText()).toContain('Forgot Your Details?');
    });
  });

  describe('sidebar', function() {

    it('should contain 3 links', function () {
      expect(sidebar.links.count()).toBe(3);
    });

    it('should contain highlighted link for current page', function () {
      expect(sidebar.signInLink.getAttribute('class')).toContain('active');
    });

    it('should contain "Register" link', function () {
      expect(sidebar.registerLink.isDisplayed()).toBe(true);
    });

    it('should contain "Help" link', function () {
      expect(sidebar.helpLink.isDisplayed()).toBe(true);
    });
  });
});
