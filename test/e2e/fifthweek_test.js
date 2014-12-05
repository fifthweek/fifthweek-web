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
    var emailTextBox = element(by.model('registrationData.email'));
    var usernameTextBox = element(by.model('registrationData.username'));
    var passwordTextBox = element(by.model('registrationData.password'));
    var registerButton = element(by.id('registerButton'));

    beforeEach(function() {
      registerLink.click();
    });

    it('should allow a new user to register', function(){
      emailTextBox.sendKeys("email@mailinator.com");
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('password1');
      registerButton.click();
    });
  });
});
