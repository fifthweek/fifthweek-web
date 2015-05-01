(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var UsernameInputPage = require('./username-input.page');

  var testKit = new TestKit();

  var signInWorkflowPage = function() {};

  signInWorkflowPage.prototype = Object.create({}, {

    showSignInLink: { get: function(){ return element(by.id('show-sign-in-link')); }},
    showRegisterLink: { get: function(){ return element(by.id('show-register-link')); }},

    forgotDetailsLink: { get: function(){ return element(by.id('forgot-details-link')); }},

    registrationEmailTextBoxId: { get: function () { return 'registrationData-email'; }},
    registrationUsernameTextBoxId: { get: function () { return 'registrationData-username'; }},
    registrationPasswordTextBoxId: { get: function () { return 'registrationData-password'; }},
    registrationEmailTextBox: { get: function(){ return element(by.id('registrationData-email')); }},
    registrationUsernameTextBox: { get: function(){ return element(by.id('registrationData-username')); }},
    registrationPasswordTextBox: { get: function(){ return element(by.id('registrationData-password')); }},
    registerButton: { get: function(){ return element(by.id('register-button')); }},

    signInUsernameTextBoxId: { value: 'signInData-username' },
    signInPasswordTextBoxId: { value: 'signInData-password' },
    signInUsernameTextBox: { get: function(){ return element(by.id('signInData-username')); }},
    signInPasswordTextBox: { get: function(){ return element(by.id('signInData-password')); }},
    signInButton: { get: function(){ return element(by.id('sign-in-button')); }},

    cancelButton: { get: function(){ return element(by.id('modal-cancel-button')); }},

    guestListOnlyDismissButton: { get: function(){ return element(by.id('guest-list-only-dismiss-button')); }},

    helpMessages: { get: function () { return element.all(by.css('.modal-content .help-block')); }},
    signInFormMessage: { get: function () { return element(by.id('sign-in-message')); }},
    registerFormMessage: { get: function () { return element(by.id('register-message')); }},

    expectNotDisplayed: { value: function(){
      expect(element.all(by.id('sign-in-button')).count()).toBe(0);
      expect(element.all(by.id('register-button')).count()).toBe(0);
      expect(element.all(by.id('guest-list-only-dismiss-button')).count()).toBe(0);
    }},

    expectRegisterDisplayed: { value: function(){
      expect(this.registerButton.isDisplayed()).toBe(true);
    }},

    expectGuestListOnlyDisplayed: { value: function(){
      expect(this.guestListOnlyDismissButton.isDisplayed()).toBe(true);
    }},
    newEmail: { value: function(username) {
      return username + '@testing.fifthweek.com';
    }},
    newRegistrationData: { value: function(){
      var username = new UsernameInputPage().newUsername();
      var email = this.newEmail(username);
      var password = 'password1';

      return {
        username: username,
        email: email,
        password: password
      };
    }},
    registerSuccessfully: { value: function() {
      var registration = this.newRegistrationData();
      return this.registerSuccessfullyWithData(registration);
    }},
    registerSuccessfullyWithData: { value: function(registration) {
      var username = registration.username;
      var email = registration.email;
      var password = registration.password;

      testKit.setValue(this.registrationEmailTextBoxId, email);
      testKit.setValue(this.registrationUsernameTextBoxId, username);
      testKit.setValue(this.registrationPasswordTextBoxId, password);
      this.registerButton.click();
      browser.waitForAngular();

      return registration;
    }},
    signInSuccessfully: { value: function(registration) {
      this.showSignInLink.click();
      testKit.setValue(this.signInUsernameTextBoxId, registration.username);
      testKit.setValue(this.signInPasswordTextBoxId, registration.password);
      this.signInButton.click();
      browser.waitForAngular();
    }}


  });

  module.exports = signInWorkflowPage;
})();
