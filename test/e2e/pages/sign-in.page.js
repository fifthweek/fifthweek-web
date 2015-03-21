'use strict';

var CreateSubscriptionPage = require('./creators/subscription/create-subscription.page.js');

var SignInPage = function() {};

SignInPage.prototype = Object.create({}, {
  usernameTextBox: { get: function () { return element(by.model('signInData.username')); }},
  passwordTextBox: { get: function () { return element(by.model('signInData.password')); }},
  signInButton: { get: function () { return element(by.id('sign-in-button')); }},
  forgotDetailsLink: { get: function () { return element(by.id('forgot-details-link')); }},
  nextPageUrl: { get: function () { return new CreateSubscriptionPage().pageUrl; }},
  message: { get: function () { return element(by.id('sign-in-message')); }},
  signInSuccessfully: { value: function(username, password) {
    this.usernameTextBox.sendKeys(username);
    this.passwordTextBox.sendKeys(password);
    this.signInButton.click();
  }}
});

module.exports = SignInPage;
