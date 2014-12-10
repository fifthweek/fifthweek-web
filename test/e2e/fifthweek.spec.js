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
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('requires example work', function(){
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');

      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A valid URL is required.')
    });

    it('requires email address', function(){
      exampleWorkTextBox.sendKeys(username);
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A valid email address is required.')
    });

    it('requires username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A username is required.')
    });

    it('requires password', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys(username);
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('A password is required.')
    });

    it('should not allow spaces in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('abc ' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Only allowed: alphanumeric characters and underscores.')
    });

    it('should not allow forbidden characters in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('abc!' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Only allowed: alphanumeric characters and underscores.')
    });

    it('should allow lowercase and uppercase characters in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('abcABC' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should not allow usernames with fewer than six characters', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('abc');
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Username must be at least 6 characters.')
    });

    it('should not allow passwords with fewer than six characters', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('pass');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Password must be at least 6 characters.')
    });

    it('should allow numbers in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('123456' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow underscores in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('abc_ABC' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow leading and trailing spaces in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys(' ' + username + ' ');
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    var exampleWorkTextBox = element(by.model('registrationData.exampleWork'));
    var emailTextBox = element(by.model('registrationData.email'));
    var usernameTextBox = element(by.model('registrationData.username'));
    var passwordTextBox = element(by.model('registrationData.password'));
    var registerButton = element(by.id('registerButton'));
    var messageBox = element(by.id('messageBox'));

    beforeEach(function() {
      registerLink.click();
    });
  });

  var username;
  var email;

  var signInLink = element(by.id('signInLink'));
  var registerLink = element(by.id('registerLink'));

  beforeEach(function() {
    username = 'webdriver_' + Date.now();
    email = username + '@mailinator.com';
    browser.get('/');
  });
});
