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
    expect(registerLink.getText()).toContain('Register');
  });

  describe('register page', function() {
    var usernameTextBox = element(by.model('registrationData.username'));
    var passwordTextBox = element(by.model('registrationData.password'));
    var confirmPasswordTextBox = element(by.model('registrationData.confirmPassword'));
    var registerButton = element(by.id('registerButton'));

    beforeEach(function() {
      registerLink.click();
    });

    it('should allow a new user to register', function(){
      usernameTextBox.sendKeys(username);
      passwordTextBox.sendKeys('terriblepassword');
      confirmPasswordTextBox.sendKeys('terriblepassword');
      registerButton.click();
    });
  });
});