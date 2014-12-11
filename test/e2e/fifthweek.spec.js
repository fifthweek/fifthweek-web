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
      usernameTextBox.sendKeys('a ' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
    });

    it('should not allow forbidden characters in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('a!' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Letters, numbers and underscores only.')
    });

    it('should allow lowercase and uppercase characters in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('aA' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should not allow usernames with fewer than 6 characters', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('abc');
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Must be at least 6 characters.')
    });

    it('should not allow usernames with over than 20 characters', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('12345678901234567890ThisIsTooLong');
      passwordTextBox.sendKeys('password1');
      browser.waitForAngular();

      expect(usernameTextBox.getAttribute('value')).toEqual('12345678901234567890')
    });

    it('should not allow passwords with fewer than 6 characters', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('pass');
      registerButton.click();
      browser.waitForAngular();

      var messages = element.all(by.css('#registrationForm .help-block'));

      expect(messages.count()).toBe(1);
      expect(messages.get(0).getText()).toContain('Must be at least 6 characters.')
    });

    it('should allow numbers in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('1' + username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
      browser.waitForAngular();
      expect(browser.getCurrentUrl()).toContain('/dashboard');
    });

    it('should allow underscores in username', function(){
      exampleWorkTextBox.sendKeys(username);
      emailTextBox.sendKeys(email);
      usernameTextBox.sendKeys('a_A' + username);
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
    username = 'wd_' + Date.now().toString().split('').reverse().join('');
    email = username + '@testing.fifthweek.com';
    browser.get('/');
  });
});
