describe('fifthweek', function() {
  'use strict';

  var username = 'webdriver_' + Date.now();

  var signInLink = element(by.id('signInLink'));
  var registerLink = element(by.id('registerLink'));


  beforeEach(function() {
    browser.get('/');
  });

  //it('should have a sign in link', function() {
  //  expect(signInLink.getText()).toContain('Sign In');
  //});

  it('should have a register link', function() {
    expect(registerLink.getText()).toContain('Become a creator');
  });

  describe('register page', function() {
    var exampleWorkTextBox = element(by.model('registrationData.exampleWork'));
    var emailTextBox = element(by.model('registrationData.email'));
    var usernameTextBox = element(by.model('registrationData.username'));
    var passwordTextBox = element(by.model('registrationData.password'));
    var registerButton = element(by.id('registerButton'));

    beforeEach(function() {
      registerLink.click();
    });

    it('should allow a new user to register', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for success
    });

    it('requires example work', function(){
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert failure
    });

    it('requires email address', function(){
      exampleWorkTextBox.sendKeys(username);
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert failure
    });

    it('requires username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert failure
    });

    it('requires password', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys(username);
      registerButton.click();
      // Todo: assert failure
    });
  });
});
