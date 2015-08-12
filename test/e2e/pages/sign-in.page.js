'use strict';

var TestKit = require('../test-kit.js');
var CreateBlogPage = require('./creators/create-blog.page.js');

var testKit = new TestKit();

var SignInPage = function() {};

SignInPage.prototype = Object.create({}, {
  usernameTextBoxId: { value: 'signInData-username' },
  passwordTextBoxId: { value: 'signInData-password' },
  signInButton: { get: function () { return element(by.id('sign-in-button')); }},
  forgotDetailsLink: { get: function () { return element(by.id('forgot-details-link')); }},
  nextPageUrl: { get: function () { return new CreateBlogPage().pageUrl; }},
  message: { get: function () { return element(by.id('sign-in-message')); }},
  signInSuccessfully: { value: function(username, password) {
    testKit.waitForElementToDisplay(element(by.id(this.usernameTextBoxId)));
    testKit.setValue(this.usernameTextBoxId, username);
    testKit.setValue(this.passwordTextBoxId, password);
    this.signInButton.click();
    browser.waitForAngular();
  }}
});

module.exports = SignInPage;
