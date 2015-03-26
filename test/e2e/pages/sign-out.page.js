'use strict';

var SignOutPage = function() {};

SignOutPage.prototype = Object.create({},
{
  usernameTextBox: { get: function () { return element(by.model('signInData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('signInData.password')); }},
  signInButton: { get: function () { return element(by.id('sign-in-button')); }},
  message: { get: function () { return element(by.id('sign-in-message')); }},
  signOutAndGoHome: { value: function() {
    browser.controlFlow().execute(function() {
      browser.executeScript('angular.element(document.body).injector().get(\'$state\').go(\'signOut\')');
      browser.executeScript('angular.element(document.body).injector().get(\'$state\').go(\'home\')');
    });
  }}
});

module.exports = SignOutPage;
