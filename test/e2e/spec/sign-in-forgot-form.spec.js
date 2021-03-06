var TestKit = require('../test-kit.js');
var CommonWorkflows = require('../common-workflows.js');
var HomePage = require('../pages/home.page.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var SignInPage = require('../pages/sign-in.page.js');
var SignInForgotPage = require('../pages/sign-in-forgot.page.js');
var SignInResetEmailPage = require('../pages/sign-in-reset-email.page.js');
var SignInResetPage = require('../pages/sign-in-reset.page.js');
var RegisterPage = require('../pages/register.page.js');
var MailboxPage = require('../pages/mailbox.page.js');

describe('sign-in - forgot details form', function() {
  'use strict';

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var homePage = new HomePage();
  var usernameInputPage = new UsernameInputPage();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var mailboxPage = new MailboxPage();
  var signInPage = new SignInPage();
  var signInResetEmailPage = new SignInResetEmailPage();
  var signInResetPage = new SignInResetPage();
  var page = new SignInForgotPage();

  var navigateToPage = function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.forgotDetailsLink.click();
    testKit.waitForElementToDisplay(element(by.id(page.usernameTextBoxId)));
  };

  describe('when a user is not registered', function() {

    beforeEach(navigateToPage);

    it('should display a success message when username is provided', function () {
      var unregisteredUsername = usernameInputPage.newUsername();

      testKit.setValue(page.usernameTextBoxId, unregisteredUsername);

      page.resetPasswordButton.click();

      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    });

    it('should display a success message when email is provided', function () {
      var unregisteredEmail = registerPage.newEmail(usernameInputPage.newUsername());
      testKit.setValue(page.emailTextBoxId, unregisteredEmail);

      page.resetPasswordButton.click();

      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    });
  });

  describe('when a user is registered', function(){
    var username;
    var email;
    var mailboxUrl;

    it('should run once before all', function() {
      registerPage.signOutAndGoToRegistration();
      var signInData = registerPage.registerSuccessfully();
      username = signInData.username;
      email = signInData.email;

      mailboxPage.getMailboxUrl(username).then(function(result) {
        mailboxUrl = result;
      });
    });

    afterEach(navigateToPage);

    it('should display a success message when username is provided', function () {
      testKit.setValue(page.usernameTextBoxId, username);
      page.resetPasswordButton.click();
      expectSuccessMessage();
    });

    it('should display a success message when email is provided', function () {
      testKit.setValue(page.emailTextBoxId, email);
      page.resetPasswordButton.click();
      expectSuccessMessage();
    });

    describe('the "reset password" email', function() {

      afterEach(function() {
        browser.get('/#'); // Return to site.
      });

      it('should be delivered when username is provided', function () {
        testKit.setValue(page.usernameTextBoxId, username);
        submitAndReadEmail();
        expect(mailboxPage.emailSubject.getText()).toContain('Reset Password');
      });

      it('should be delivered when email is provided', function () {
        testKit.setValue(page.emailTextBoxId, email);
        submitAndReadEmail();
        expect(mailboxPage.emailSubject.getText()).toContain('Reset Password');
      });

      it('should remind user of username', function () {
        testKit.setValue(page.emailTextBoxId, email);
        submitAndReadEmail();
        expect(signInResetEmailPage.username.getText()).toContain(username);
      });

      it('should link to "reset password" page', function () {
        testKit.setValue(page.emailTextBoxId, email);
        submitAndReadEmail();
        commonWorkflows.rebaseLinkAndClick(signInResetEmailPage.resetPasswordLink);
        expect(browser.getCurrentUrl()).toContain(signInResetPage.pageUrl);
      });
    });

    var expectSuccessMessage = function() {
      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    };

    var submitAndReadEmail = function() {
      page.resetPasswordButton.click();
      browser.waitForAngular(); // Not automatically awaited on get.
      browser.get(mailboxUrl);
    }
  });
});
