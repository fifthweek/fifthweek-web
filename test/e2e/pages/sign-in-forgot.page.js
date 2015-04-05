'use strict';

var SignInForgotPage = function() {};

SignInForgotPage.prototype = Object.create({}, {
  usernameTextBoxId: { value: 'passwordResetRequestData-username'},
  emailTextBoxId: { value: 'passwordResetRequestData-email' },
  resetPasswordButton: { get: function () { return element(by.id('password-reset-request-button')); }},
  message: { get: function () { return element(by.id('password-reset-request-message')); }},
  formPanel: { get: function () { return element(by.id('password-reset-request-panel')); }},
  successMessage: { get: function () { return element(by.id('password-reset-request-success')); }}
});

module.exports = SignInForgotPage;
