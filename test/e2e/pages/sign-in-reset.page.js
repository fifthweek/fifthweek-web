'use strict';

var SignInResetPage = function() {};

SignInResetPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/sign-in/reset'; }},
  passwordTextBox: { get: function () { return element(by.model('passwordResetConfirmationData.newPassword')); }},
  resetPasswordButton: { get: function () { return element(by.id('password-reset-confirmation-button')); }},
  message: { get: function () { return element(by.id('password-reset-confirmation-message')); }},
  formPanel: { get: function () { return element(by.id('password-reset-confirmation-panel')); }},
  successMessage: { get: function () { return element(by.id('password-reset-confirmation-success')); }}
});

module.exports = SignInResetPage;
