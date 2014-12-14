'use strict';

var SignInPage = function() {};

SignInPage.prototype = Object.create({}, {
  usernameTextBox: { get: function () { return element(by.model('signInData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('signInData.password')); }},
  signInButton: { get: function () { return element(by.id('signInButton')); }},
  message: { get: function () { return element(by.id('signInMessage')); }}
});

module.exports = SignInPage;
