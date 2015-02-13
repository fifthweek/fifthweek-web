var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var SignInPage = require('../pages/sign-in.page.js');
var SignInForgotPage = require('../pages/sign-in-forgot.page.js');
var RegisterPage = require('../pages/register.page.js');
var MailboxPage = require('../pages/mailbox.page.js');

describe('sign-in - forgot details form', function() {
  'use strict';

  var homePage = new HomePage();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var mailboxPage = new MailboxPage();
  var signInPage = new SignInPage();
  var page = new SignInForgotPage();

  var navigateToPage = function() {
    signOutPage.signOutAndGoHome();
    homePage.signInLink.click();
    signInPage.forgotDetailsLink.click();
  };

  it('should not allow no username or email to be submitted', function () {
    navigateToPage();

    page.resetPasswordButton.click();

    expect(page.message.getText()).toContain('Must provide username or email');
  });

  describe('when a user is not registered', function() {

    beforeEach(navigateToPage);

    it('should display a success message when username is provided', function () {
      var unregisteredUsername = registerPage.newUsername();
      page.usernameTextBox.sendKeys(unregisteredUsername);

      page.resetPasswordButton.click();

      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    });

    it('should display a success message when email is provided', function () {
      var unregisteredEmail = registerPage.newEmail();
      page.emailTextBox.sendKeys(unregisteredEmail);

      page.resetPasswordButton.click();

      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    });
  });

  ddescribe('when a user is registered', function(){
    var username;
    var email;
    var mailboxUrl;

    it('should run once before all', function() {
      signOutPage.signOutAndGoHome();
      var signInData = registerPage.registerSuccessfully();
      username = signInData.username;
      email = signInData.email;

      mailboxPage.getMailboxUrl(username).then(function(result) {
        mailboxUrl = result;
      });
    });

    afterEach(navigateToPage);

    it('should display a success message when username is provided', function () {
      page.usernameTextBox.sendKeys(username);
      assertSuccessMessage();
    });

    it('should display a success message when email is provided', function () {
      page.emailTextBox.sendKeys(email);
      assertSuccessMessage();
    });

    it('should display a success message when username is provided', function () {
      page.usernameTextBox.sendKeys(username);
      assertEmailReceived();
    });

    it('should display a success message when email is provided', function () {
      page.emailTextBox.sendKeys(email);
      assertEmailReceived();
    });

    var assertSuccessMessage = function() {
      page.resetPasswordButton.click();
      expect(page.formPanel.isDisplayed()).toBe(false);
      expect(page.successMessage.isDisplayed()).toBe(true);
    };

    var assertEmailReceived = function() {
      page.resetPasswordButton.click();

      browser.waitForAngular(); // Not automatically awaited on get.
      browser.get(mailboxUrl);
      expect(mailboxPage.emailSubject.getText()).toContain('Reset Password');
    };
  });
});
