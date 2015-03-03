var SignOutPage = require('../pages/sign-out.page.js');
var RegisterPage = require('../pages/register.page.js');
var AccountSettingsPage = require('../pages/account-settings.page.js');
var HeaderSettingsPage = require('../pages/header-settings.page.js');
var SidebarPage = require('../pages/sidebar.page.js');
var CreateSubscriptionPage = require('../pages/creators/create-subscription.page.js');

describe('account settings page', function() {
  'use strict';

  var header = new HeaderSettingsPage();
  var sidebar = new SidebarPage();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var createSubscriptionPage = new CreateSubscriptionPage();
  var page = new AccountSettingsPage();

  it('should run once before all', function() {
    signOutPage.signOutAndGoHome();
    registerPage.registerSuccessfully();
    createSubscriptionPage.submitSuccessfully();
    sidebar.settingsLink.click();
  });

  describe('header', function() {

    it('should contain the correct number of links', function() {
      expect(header.navigationLinks.count()).toBe(2);
    });

    it('should contain account settings', function() {
      expect(header.accountSettingsLink.getAttribute('class')).toContain('active');
    });

    it('should contain sign out', function() {
      expect(header.signOutLink.isDisplayed()).toBe(true);
    });
  });

  describe('sidebar', function() {

    it('should contain the correct number of links', function () {
      expect(sidebar.links.count()).toBe(6);
    });

    it('should contain highlighted link for current page', function () {
      expect(sidebar.settingsLink.getAttribute('class')).toContain('active');
    });

    it('should contain "Username" link', function () {
      expect(sidebar.usernameLink.isDisplayed()).toBe(true);
    });

    it('should contain "Settings" link', function () {
      expect(sidebar.newPostLink.isDisplayed()).toBe(true);
    });

    it('should contain "Backlog" link', function () {
      expect(sidebar.backlogLink.isDisplayed()).toBe(true);
    });

    it('should contain "Customize" link', function () {
      expect(sidebar.customizeLink.isDisplayed()).toBe(true);
    });

    it('should contain "Settings" link', function () {
      expect(sidebar.settingsLink.isDisplayed()).toBe(true);
    });

    it('should contain "Help" link', function () {
      expect(sidebar.helpLink.isDisplayed()).toBe(true);
    });
  });
});
