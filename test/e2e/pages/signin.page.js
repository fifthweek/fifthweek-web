'use strict';

var SignInPage = function() {};

SignInPage.prototype = Object.create({}, {
  usernameTextBox: { get: function () { return element(by.model('signInData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('signInData.password')); }},
  signInButton: { get: function () { return element(by.id('sign-in-button')); }},
  message: { get: function () { return element(by.id('sign-in-message')); }}
});

module.exports = SignInPage;
