var TestKit = require('../test-kit.js');
var CommonWorkflows = require('../common-workflows.js');
var SignOutPage = require('../pages/sign-out.page.js');
var HomePage = require('../pages/home.page.js');
var RegisterPage = require('../pages/register.page.js');
var SignInPage = require('../pages/sign-in.page.js');
var SignInForgotPage = require('../pages/sign-in-forgot.page.js');
var MailboxPage = require('../pages/mailbox.page.js');
var SignInResetEmailPage = require('../pages/sign-in-reset-email.page.js');
var PasswordInputPage = require('../pages/password-input.page.js');
var SignInResetPage = require('../pages/sign-in-reset.page.js');

describe('sign-in - reset password form', function() {
  'use strict';

  var username;
  var email;
  var resetPasswordPageUrl;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var signOutPage = new SignOutPage();
  var homePage = new HomePage();
  var registerPage = new RegisterPage();
  var signInPage = new SignInPage();
  var signInForgotPage = new SignInForgotPage();
  var mailboxPage = new MailboxPage();
  var signInResetEmailPage = new SignInResetEmailPage();
  var passwordInputPage = new PasswordInputPage();
  var page = new SignInResetPage();

  var register = function() {
    registerPage.signOutAndGoToRegistration();
    var signInData = registerPage.registerSuccessfully();
    username = signInData.username;
    email = signInData.email;
  };

  var navigateToPage = function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.forgotDetailsLink.click();

    mailboxPage.getMailboxUrl(username).then(function(mailboxUrl) {
      testKit.setValue(signInForgotPage.emailTextBoxId, email);
      signInForgotPage.resetPasswordButton.click();
      browser.waitForAngular();
      browser.get(mailboxUrl);
    });

    commonWorkflows.rebaseLinkAndClick(signInResetEmailPage.resetPasswordLink).then(function(url) {
      resetPasswordPageUrl = url;
    });
  };

  it('should run once before all', register);

  describe('when validating against good input', function() {

    beforeEach(navigateToPage);

    afterEach(function() {
      page.resetPasswordButton.click();
      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    });

    passwordInputPage.includeHappyPaths(page.passwordTextBoxId, function() { });
  });

  describe('when validating against bad input', function() {

    it('should run once before all', navigateToPage);

    afterEach(function() {
      // Reset form state.
      commonWorkflows.fastRefresh();
    });

    passwordInputPage.includeSadPaths(page.passwordTextBoxId, page.resetPasswordButton, page.helpMessages, function() { });
  });

  describe('after resetting password', function() {

    var newPassword = 'YayItsBeenReset!';

    it('should run once before all', function() {
      navigateToPage();
      testKit.setValue(page.passwordTextBoxId, newPassword);
      page.resetPasswordButton.click();
    });

    it('should allow user to sign in with new password', function() {
      signOutPage.signOutAndGoHome();
      homePage.signInLink.click();
      signInPage.signInSuccessfully(username, newPassword);
    });

    it('the link should become expired', function() {
      signOutPage.signOutAndGoHome();
      commonWorkflows.getPage(resetPasswordPageUrl);
      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.linkExpiredMessage.isDisplayed()).toBe(true);
    });
  });
});
