var TestKit = require('../test-kit.js');
var RegisterPage = require('../pages/register.page.js');
var SignOutPage = require('../pages/sign-out.page.js');

describe("registration form", function() {
  'use strict';

  var testKit = new TestKit();
  var signOutPage = new SignOutPage();
  var page = new RegisterPage();
  var username;
  var email;

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
    username = page.newUsername();
    email = page.newEmailAddress(username);
  });

  describe('happy path', function() {

    afterEach(function() {
      page.registerButton.click();
      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should allow a new user to register', function(){
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.emailTextBox.sendKeys(email);
    });

    it('should allow numbers in username', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('1' + username);
      page.passwordTextBox.sendKeys('password1');
    });

    it('should allow underscores in username', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a_A' + username);
      page.passwordTextBox.sendKeys('password1');
    });

    it('should allow leading and trailing spaces in username', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(' ' + username + ' ');
      page.passwordTextBox.sendKeys('password1');
    });

    it('should allow lowercase and uppercase characters in username', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('aA' + username);
      page.passwordTextBox.sendKeys('password1');
    });

    it('should allow password with 6 characters or more', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('123456');
    });
  });

  describe('sad path', function() {
    it('requires email address', function(){
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'A valid email address is required.');
    });

    it('requires username', function(){
      page.emailTextBox.sendKeys(email);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      testKit.assertRequired(page.helpMessages, 'username');
    });

    it('requires password', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.registerButton.click();

      testKit.assertRequired(page.helpMessages, 'password');
    });

    it('should not allow spaces in username', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a ' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'Letters, numbers and underscores only.');
    });

    it('should not allow forbidden characters in username', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a!' + username);
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'Letters, numbers and underscores only.');
    });

    it('should not allow usernames with fewer than 2 characters', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys('a');
      page.passwordTextBox.sendKeys('password1');
      page.registerButton.click();

      testKit.assertMinLength(page.helpMessages, 2);
    });

    it('should not allow usernames with over than 20 characters', function(){
      var maxLength = 20;
      var overSizedValue = username + new Array(maxLength).join('x');

      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(overSizedValue);
      page.passwordTextBox.sendKeys('password1');

      testKit.assertMaxLength(page.helpMessages, page.usernameTextBox, overSizedValue, maxLength);
    });

    it('should not allow passwords with fewer than 6 characters', function(){
      page.emailTextBox.sendKeys(email);
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys('pass');
      page.registerButton.click();

      testKit.assertMinLength(page.helpMessages, 6);
    });
  });
});
