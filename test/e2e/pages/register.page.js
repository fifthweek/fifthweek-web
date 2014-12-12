'use strict';

var RegisterPage = function() {};

RegisterPage.prototype = {
  get exampleWorkTextBox() { return element(by.model('registrationData.exampleWork')) },
  get emailTextBox() { return element(by.model('registrationData.email')) },
  get usernameTextBox() { return element(by.model('registrationData.username')) },
  get passwordTextBox() { return element(by.model('registrationData.password')) },
  get registerButton() { return element(by.id('registerButton')) },
  get helpMessages() { return element.all(by.css('#registrationForm .help-block')) }
};

module.exports = RegisterPage;
