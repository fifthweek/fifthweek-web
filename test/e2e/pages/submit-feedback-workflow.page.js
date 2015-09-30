(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var CommentInputPage = require('./comment-input.page');
  var UsernameInputPage = require('./username-input.page');

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var commentInputPage = new CommentInputPage();
  var usernameInputPage = new UsernameInputPage();

  var signInWorkflowPage = function() {};

  signInWorkflowPage.prototype = Object.create({}, {

    emailTextBoxId: { get: function () { return 'input-email'; }},
    messageTextBoxId: { get: function () { return 'model-input-message'; }},
    emailTextBox: { get: function(){ return element(by.id('input-email')); }},
    registerButton: { get: function(){ return element(by.id('register-button')); }},

    cancelButton: { get: function(){ return element(by.id('modal-cross-button')); }},

    dismissButton: { get: function(){ return element(by.id('dismiss-button')); }},

    helpMessages: { get: function () { return element.all(by.css('.modal-content .help-block')); }},
    registerFormMessage: { get: function () { return element(by.id('register-message')); }},

    expectNotDisplayed: { value: function(){
      expect(element.all(by.id('register-button')).count()).toBe(0);
      expect(element.all(by.id('dismiss-button')).count()).toBe(0);
    }},

    expectRegisterDisplayed: { value: function(){
      expect(this.registerButton.isDisplayed()).toBe(true);
    }},

    expectThankYouMessageDisplayed: { value: function(){
      expect(this.dismissButton.isDisplayed()).toBe(true);
    }},
    newEmail: { value: function(username) {
      return username + '@testing.fifthweek.com';
    }},
    newRegistrationData: { value: function(){
      var name = usernameInputPage.newUsername();
      var email = this.newEmail(name);

      return {
        message: name,
        email: email
      };
    }},
    registerSuccessfully: { value: function() {
      var registration = this.newRegistrationData();
      return this.registerSuccessfullyWithData(registration);
    }},
    registerSuccessfullyWithData: { value: function(registration) {
      var message = registration.message;
      var email = registration.email;

      testKit.setValue(this.emailTextBoxId, email);
      testKit.setContentEditableValue(this.messageTextBoxId, message);
      this.registerButton.click();
      browser.waitForAngular();

      return registration;
    }},

    runTests: { value: function(navigateToWorkflow){
      var page = this;
      var email;
      var message;
      var navigateToPage = function() {
        navigateToWorkflow();
        var userRegistration = page.newRegistrationData();
        email = userRegistration.email;
        message = userRegistration.message;
      };

      it('should run once before all', function(){
        commonWorkflows.signOut();
        commonWorkflows.getRoot();
      });

      describe('when validating against good input', function() {

        beforeEach(navigateToPage);

        afterEach(function() {
          page.registerButton.click();
          page.expectThankYouMessageDisplayed();
          page.dismissButton.click();
        });

        it('should allow feedback to be sent', function(){
          testKit.setContentEditableValue(page.messageTextBoxId, message);
          testKit.setValue(page.emailTextBoxId, email);
        });

        commentInputPage.includeHappyPaths(page.messageTextBoxId, function() {
          testKit.setValue(page.emailTextBoxId, email);
        });
      });

      describe('when validating against bad input', function() {

        it('should run once before all', function() {
          navigateToPage();
        });

        afterEach(function() {
          // Reset form state.
          page.cancelButton.click();
          navigateToPage();
        });

        commentInputPage.includeSadPaths(page.messageTextBoxId, page.registerButton, page.helpMessages, function() {
          testKit.setValue(page.emailTextBoxId, email);
        });
      });
    }}

  });

  module.exports = signInWorkflowPage;
})();
