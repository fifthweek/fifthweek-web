'use strict';

var RegisterPage = function() {};

RegisterPage.prototype = Object.create({},
{
  emailTextBox: { get: function () { return element(by.model('registrationData.email')); }},
  usernameTextBox: { get: function () { return element(by.model('registrationData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('registrationData.password')); }},
  registerButton: { get: function () { return element(by.id('register-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#registrationForm .help-block')); }},
  newUsername: { value: function() {
    return 'wd_' + Date.now().toString().split('').reverse().join('');
  }},
  newEmailAddress: { value: function(username) {
    return username + '@testing.fifthweek.com';
  }},
  registerSuccessfully: { value: function() {
    var username = this.newUsername();
    var email = this.newEmailAddress(username);
    var password = 'password1';

    this.usernameTextBox.sendKeys(username);
    this.passwordTextBox.sendKeys(password);
    this.emailTextBox.sendKeys(email);
    this.registerButton.click();

    return {
      username: username,
      password: password
    };
  }}
});

module.exports = RegisterPage;
