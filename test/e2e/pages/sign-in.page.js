'use strict';

var TestKit = require('../test-kit.js');
var CreateSubscriptionPage = require('./creators/subscription/create-subscription.page.js');

var testKit = new TestKit();

var SignInPage = function() {};

SignInPage.prototype = Object.create({}, {
  usernameTextBoxId: { value: 'signInData-username' },
  passwordTextBoxId: { value: 'signInData-password' },
  signInButton: { get: function () { return element(by.id('sign-in-button')); }},
  forgotDetailsLink: { get: function () { return element(by.id('forgot-details-link')); }},
  nextPageUrl: { get: function () { return new CreateSubscriptionPage().pageUrl; }},
  message: { get: function () { return element(by.id('sign-in-message')); }},
  signInSuccessfully: { value: function(username, password) {
    testKit.setValue(this.usernameTextBoxId, username);
    testKit.setValue(this.passwordTextBoxId, password);
    this.signInButton.click();
  }}
});

module.exports = SignInPage;
