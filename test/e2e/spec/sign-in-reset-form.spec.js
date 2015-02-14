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
    signOutPage.signOutAndGoHome();
    var signInData = registerPage.registerSuccessfully();
    username = signInData.username;
    email = signInData.email;
  };

  var navigateToPage = function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.forgotDetailsLink.click();

    mailboxPage.getMailboxUrl(username).then(function(mailboxUrl) {
      return signInForgotPage.emailTextBox.sendKeys(email)
        .then(function() {
          return signInForgotPage.resetPasswordButton.click();
        })
        .then(function() {
          return browser.waitForAngular(); // Not automatically awaited on get.
        })
        .then(function() {
          browser.get(mailboxUrl); // Thing that actually requires all these manual continuations!
        });
    });

    rebaseLinkAndClick(signInResetEmailPage.resetPasswordLink).then(function(url) {
      resetPasswordPageUrl = url;
    });
  };

  it('should run once before all', register);

  describe('when user provides valid input', function() {

    beforeEach(navigateToPage);

    afterEach(function() {
      page.resetPasswordButton.click();
      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    });

    passwordInputPage.includeHappyPaths(page.passwordTextBox, function() { });
  });

  describe('when user provides invalid input', function() {

    it('should run once before all', navigateToPage);

    afterEach(function() {
      // Reset form state.
      browser.refresh();
    });

    passwordInputPage.includeSadPaths(page.passwordTextBox, page.resetPasswordButton, page.helpMessages, function() { });
  });

  var rebaseLinkAndClick = function(linkElement) {
    return linkElement.getAttribute('href').then(function(href) {
      var pathArray = href.split( '/' );
      var protocol = pathArray[0];
      var host = pathArray[2];
      var baseUrl = protocol + '//' + host;
      var path = href.substring(baseUrl.length);
      return browser.get(path).then(function() {
        return path;
      });
    });
  };
});
