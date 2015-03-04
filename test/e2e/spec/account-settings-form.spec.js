var CommonWorkflows = require('../common-workflows.js');
var TestKit = require('../test-kit.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var PasswordInputPage = require('../pages/password-input.page.js');
var AccountSettingsPage = require('../pages/account-settings.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('account settings form', function() {
  'use strict';

  var registration;
  var subscription;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var usernameInputPage = new UsernameInputPage();
  var passwordInputPage = new PasswordInputPage();
  var page = new AccountSettingsPage();
  var sidebar = new SidebarPage();

  var navigateToPage = function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    sidebar.settingsLink.click();
  };

  describe('when validating against good input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    describe('when saving new data', function(){

      afterEach(function() {
        page.saveChangesButton.click();
        expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(true);

        page.emailTextBox.clear();
        page.emailTextBox.sendKeys(registration.email);
        page.usernameTextBox.clear();
        page.usernameTextBox.sendKeys(registration.username);
        page.passwordTextBox.clear();

        expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(false);
      });

      it('should allow the user to change their email', function(){
        page.emailTextBox.clear();
        page.emailTextBox.sendKeys('a+' + registration.email);
      });

      usernameInputPage.includeHappyPaths(page.usernameTextBox, function() {});

      passwordInputPage.includeHappyPaths(page.passwordTextBox, function() {});
    });
  });

  describe('when validating against bad input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    afterEach(function() {
      page.emailTextBox.clear();
      page.emailTextBox.sendKeys(registration.email);
      page.usernameTextBox.clear();
      page.usernameTextBox.sendKeys(registration.username);
      page.passwordTextBox.clear();
    });

    it('requires email address', function(){

      page.emailTextBox.clear();
      page.emailTextBox.sendKeys('invalid');
      page.saveChangesButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'A valid email address is required.');
    });

    usernameInputPage.includeSadPaths(page.usernameTextBox, page.saveChangesButton, page.helpMessages, function() {});

    passwordInputPage.includeSadPaths(page.passwordTextBox, page.saveChangesButton, page.helpMessages, function() {}, true);
  });
});
