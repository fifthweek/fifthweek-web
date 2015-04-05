'use strict';

var SignInResetEmailPage = function() {};

SignInResetEmailPage.prototype = Object.create({}, {
  resetPasswordLink: { get: function () { return element(by.id('reset-password-link')); }},
  username: { get: function () { return element(by.id('username')); }}
});

module.exports = SignInResetEmailPage;
