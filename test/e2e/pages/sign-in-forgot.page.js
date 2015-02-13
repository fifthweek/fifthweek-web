'use strict';

var SignInForgotPage = function() {};

SignInForgotPage.prototype = Object.create({}, {
  usernameTextBox: { get: function () { return element(by.model('passwordResetRequestData.username')); }},
  emailTextBox: { get: function () { return element(by.model('passwordResetRequestData.email')); }},
  resetPasswordButton: { get: function () { return element(by.id('password-reset-request-button')); }},
  message: { get: function () { return element(by.id('password-reset-request-message')); }}
});

module.exports = SignInForgotPage;
