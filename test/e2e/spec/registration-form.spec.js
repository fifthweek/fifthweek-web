var TestKit = require('../test-kit.js');
var CommonWorkflows = require('../common-workflows.js');
var RegisterPage = require('../pages/register.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var PasswordInputPage = require('../pages/password-input.page.js');

describe("registration form", function() {
  'use strict';

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var signOutPage = new SignOutPage();
  var usernameInputPage = new UsernameInputPage();
  var passwordInputPage = new PasswordInputPage();
  var page = new RegisterPage();
  var username;
  var email;

  var navigateToPage = function() {
    signOutPage.signOutAndGoHome();
    username = usernameInputPage.newUsername();
    email = page.newEmail(username);
  };

  describe('when validating against good input', function() {

    beforeEach(navigateToPage);

    afterEach(function() {
      page.registerButton.click();
      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should allow a new user to register', function(){
      testKit.setValue(page.usernameTextBoxId, username);
      testKit.setValue(page.passwordTextBoxId, 'password1');
      testKit.setValue(page.emailTextBoxId, email);
    });

    usernameInputPage.includeHappyPaths(page.usernameTextBoxId, function() {
      testKit.setValue(page.passwordTextBoxId, 'password1');
      testKit.setValue(page.emailTextBoxId, email);
    });

    passwordInputPage.includeHappyPaths(page.passwordTextBoxId, function() {
      testKit.setValue(page.usernameTextBoxId, username);
      testKit.setValue(page.emailTextBoxId, email);
    });
  });

  describe('when validating against bad input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    afterEach(function() {
      // Reset form state.
      commonWorkflows.fastRefresh();
    });

    it('requires email address', function(){
      testKit.setValue(page.usernameTextBoxId, username);
      testKit.setValue(page.passwordTextBoxId, 'password1');
      page.registerButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'A valid email address is required.');
    });

    usernameInputPage.includeSadPaths(page.usernameTextBoxId, page.registerButton, page.helpMessages, function() {
      testKit.setValue(page.passwordTextBoxId, 'password1');
      testKit.setValue(page.emailTextBoxId, email);
    });

    passwordInputPage.includeSadPaths(page.passwordTextBoxId, page.registerButton, page.helpMessages, function() {
      testKit.setValue(page.usernameTextBoxId, username);
      testKit.setValue(page.emailTextBoxId, email);
    });
  });
});
