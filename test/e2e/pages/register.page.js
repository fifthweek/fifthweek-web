'use strict';

var CreateSubscriptionPage = require('./creators/create-subscription.page.js');

var RegisterPage = function() {};

RegisterPage.prototype = Object.create({},
{
  emailTextBox: { get: function () { return element(by.model('registrationData.email')); }},
  usernameTextBox: { get: function () { return element(by.model('registrationData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('registrationData.password')); }},
  registerButton: { get: function () { return element(by.id('register-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#registrationForm .help-block')); }},
  nextPageUrl: { get: function () { return new CreateSubscriptionPage().pageUrl; }},
  newUsername: { value: function() {
    return 'wd_' + Date.now().toString().split('').reverse().join('');
  }},
  newEmail: { value: function(username) {
    return username + '@testing.fifthweek.com';
  }},
  registerSuccessfully: { value: function() {
    var username = this.newUsername();
    var email = this.newEmail(username);
    var password = 'password1';

    this.emailTextBox.sendKeys(email);
    this.usernameTextBox.sendKeys(username);
    this.passwordTextBox.sendKeys(password);
    this.registerButton.click();

    // If the subsequent call is a `navigate` then the following is necessary to allow the
    // registration to complete.
    browser.waitForAngular();

    return {
      username: username,
      email: email,
      password: password
    };
  }}
});

module.exports = RegisterPage;
