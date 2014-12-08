describe('fifthweek', function() {
  'use strict';

  //it('should have a sign in link', function() {
  //  expect(signInLink.getText()).toContain('Sign In');
  //});

  it('should have a register link', function() {
    expect(registerLink.getText()).toContain('Become a creator');
  });

  describe('register page', function() {

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

    it('should allow lowercase and uppercase characters in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys("abcABC");
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for success
    });

    it('should allow numbers in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys("123");
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for success
    });

    it('should allow hypens and underscores in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys("abc_ABC-123");
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for success
    });

    it('should allow leading and trailing spaces in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys(" abc ");
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for success
    });

    it('should not allow spaces in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys("abc ABC");
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for failure
    });

    it('should not allow forbidden characters in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(username + '@mailinator.com');
      usernameTextBox.sendKeys("abc!");
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      // Todo: assert check for failure
      // Todo: Repeat with several different characters...
    });

    var exampleWorkTextBox = element(by.model('registrationData.exampleWork'));
    var emailTextBox = element(by.model('registrationData.email'));
    var usernameTextBox = element(by.model('registrationData.username'));
    var passwordTextBox = element(by.model('registrationData.password'));
    var registerButton = element(by.id('registerButton'));

    beforeEach(function() {
      registerLink.click();
    });
  });

  var username = 'webdriver_' + Date.now();

  var signInLink = element(by.id('signInLink'));
  var registerLink = element(by.id('registerLink'));

  beforeEach(function() {
    browser.get('/');
  });
});
