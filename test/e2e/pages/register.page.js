'use strict';

var TestKit = require('../test-kit.js');
var UsernameInputPage = require('./username-input.page');
var CreateBlogPage = require('./creators/create-blog.page.js');

var testKit = new TestKit();

var RegisterPage = function() {};

RegisterPage.prototype = Object.create({},
{
  creatorNameTextBoxId: { get: function () { return 'registrationData-creatorName'; }},
  emailTextBoxId: { get: function () { return 'registrationData-email'; }},
  usernameTextBoxId: { get: function () { return 'registrationData-username'; }},
  passwordTextBoxId: { get: function () { return 'registrationData-password'; }},
  registerButton: { get: function () { return element(by.id('register-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#registrationForm .help-block')); }},
  nextPageUrl: { get: function () { return new CreateBlogPage().pageUrl; }},
  newEmail: { value: function(username) {
    return username + '@testing.fifthweek.com';
  }},
  signOutAndGoToRegistration: { value: function() {
    browser.controlFlow().execute(function() {
      var script =
        'angular.element(document.body).injector().get(\'$state\').go(\'user.signOut\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ' +
        'angular.element(document.body).injector().get(\'$state\').go(\'register\'); ' +
        'angular.element(document.body).injector().get(\'$rootScope\').$digest(); ';
      browser.executeScript(script);
    });
  }},
  registerSuccessfully: { value: function() {
    var username = new UsernameInputPage().newUsername();
    var email = this.newEmail(username);
    var password = 'password1';
    var name = 'A Name';

    testKit.waitForElementToDisplay(element(by.id(this.creatorNameTextBoxId)));
    testKit.setValue(this.creatorNameTextBoxId, name);
    testKit.setValue(this.emailTextBoxId, email);
    testKit.setValue(this.usernameTextBoxId, username);
    testKit.setValue(this.passwordTextBoxId, password);
    this.registerButton.click();
    browser.waitForAngular();

    return {
      username: username,
      email: email,
      password: password,
      creatorName: name
    };
  }}
});

module.exports = RegisterPage;
