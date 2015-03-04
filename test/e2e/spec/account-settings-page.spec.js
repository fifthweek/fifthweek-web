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
    header.includeBasicTests(header.accountSettingsLink);
  });

  describe('sidebar', function() {
    sidebar.includeEstablishedCreatorTests(sidebar.settingsLink);
  });
});
