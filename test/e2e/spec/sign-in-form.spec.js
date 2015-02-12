var HomePage = require('../pages/home.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var SignInPage = require('../pages/sign-in.page.js');
var RegisterPage = require('../pages/register.page.js');

describe('sign-in form', function() {
  'use strict';

  var page = new SignInPage();
  var homePage = new HomePage();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
  });

  describe('when a user is registered', function(){
    var username;
    var password;

    beforeEach(function() {
      var signInData = registerPage.registerSuccessfully();
      username = signInData.username;
      password = signInData.password;

      // Wait for angular here because getting a new page doesn't wait.
      browser.waitForAngular();
      signOutPage.signOutAndGoHome();

      homePage.signInLink.click();
    });

    it('should allow the existing user to sign in', function(){
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys(password);
      page.signInButton.click();
      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should be case insensitive for the username', function(){
      // Change the first letter to upper case, and check the result.
      var username2 = username.charAt(0).toUpperCase() + username.substring(1);
      expect(username.length === username2.length).toBeTruthy();
      expect(username !== username2).toBeTruthy();

      page.usernameTextBox.sendKeys(username2);
      page.passwordTextBox.sendKeys(password);
      page.signInButton.click();

      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should require a valid password', function(){
      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys(password + 'X');
      page.signInButton.click();
      expect(page.message.getText()).toContain('Invalid username or password');
    });

    it('should require a valid username', function(){
      page.usernameTextBox.sendKeys(username + 'X');
      page.passwordTextBox.sendKeys(password);
      page.signInButton.click();
      expect(page.message.getText()).toContain('Invalid username or password');
    });

    it('should case sensitive for the password', function(){
      // Change the first letter to upper case, and check the result.
      var password2 = password.charAt(0).toUpperCase() + password.substring(1);
      expect(password.length === password2.length).toBeTruthy();
      expect(password !== password2).toBeTruthy();

      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys(password2);
      page.signInButton.click();

      expect(page.message.getText()).toContain('Invalid username or password');
    });
  });

  describe('when a user is not registered', function() {

    it('should not allow the existing user to sign in', function(){
      homePage.signInLink.click();
      browser.waitForAngular();

      var username = registerPage.newUsername();
      var password = username + '123';

      page.usernameTextBox.sendKeys(username);
      page.passwordTextBox.sendKeys(password);
      page.signInButton.click();

      expect(page.message.getText()).toContain('Invalid username or password');
    });
  });
});
