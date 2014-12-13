'use strict';

var RegisterPage = function() {};

RegisterPage.prototype = Object.create({}, {
  exampleWorkTextBox: { get: function () { return element(by.model('registrationData.exampleWork')); }},
  emailTextBox: { get: function () { return element(by.model('registrationData.email')); }},
  usernameTextBox: { get: function () { return element(by.model('registrationData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('registrationData.password')); }},
  registerButton: { get: function () { return element(by.id('registerButton')); }},
  helpMessages: { get: function () { return element.all(by.css('#registrationForm .help-block')); }}
});

module.exports = RegisterPage;
