var RegisterPage = require('../pages/register.page.js');
var SignOutPage = require('../pages/sign-out.page.js');
var CreateSubscriptionPage = require('../pages/creators/create-subscription.page.js');

describe("registration form", function() {
  'use strict';

  var signOutPage = new SignOutPage();
  var page = new RegisterPage();
  var username;
  var email;

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
    username = page.newUsername();
    email = page.newEmailAddress(username);
  });

  it('should allow a new user to register', function(){
    page.usernameTextBox.sendKeys(username);
    page.passwordTextBox.sendKeys('password1');
    page.emailTextBox.sendKeys(email);
    page.registerButton.click();

    expect(browser.getCurrentUrl()).toContain(new CreateSubscriptionPage().pageUrl);
  });

  it('requires email address', function(){
    page.usernameTextBox.sendKeys(username);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('A valid email address is required.')
  });

  it('requires username', function(){
    page.emailTextBox.sendKeys(email);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('A username is required.')
  });

  it('requires password', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys(username);
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('A password is required.')
  });

  it('should not allow spaces in username', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('a ' + username);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
  });

  it('should not allow forbidden characters in username', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('a!' + username);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
  });

  it('should allow lowercase and uppercase characters in username', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('aA' + username);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    expect(browser.getCurrentUrl()).toContain(new CreateSubscriptionPage().pageUrl);
  });

  it('should not allow usernames with fewer than 2 characters', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('a');
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('Must be at least 2 characters.')
  });

  it('should not allow usernames with over than 20 characters', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('12345678901234567890ThisIsTooLong');
    page.passwordTextBox.sendKeys('password1');

    // Some browsers don't honor maxlength attribute with protractor's sendKeys
    // so we also check the ng-maxlength error as a backup.
    var messages = page.helpMessages;
    messages.count().then(function(count){
      if(count){
        expect(messages.get(0).getText()).toContain('Allowed 20 characters at most.')
      }
      else{
        expect(page.usernameTextBox.getAttribute('value')).toBe('12345678901234567890');
      }
    });
  });

  it('should not allow passwords with fewer than 6 characters', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys(username);
    page.passwordTextBox.sendKeys('pass');
    page.registerButton.click();

    var messages = page.helpMessages;

    expect(messages.count()).toBe(1);
    expect(messages.get(0).getText()).toContain('Must be at least 6 characters.')
  });

  it('should allow numbers in username', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('1' + username);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    expect(browser.getCurrentUrl()).toContain(new CreateSubscriptionPage().pageUrl);
  });

  it('should allow underscores in username', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys('a_A' + username);
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    expect(browser.getCurrentUrl()).toContain(new CreateSubscriptionPage().pageUrl);
  });

  it('should allow leading and trailing spaces in username', function(){
    page.emailTextBox.sendKeys(email);
    page.usernameTextBox.sendKeys(' ' + username + ' ');
    page.passwordTextBox.sendKeys('password1');
    page.registerButton.click();

    expect(browser.getCurrentUrl()).toContain(new CreateSubscriptionPage().pageUrl);
  });
});
