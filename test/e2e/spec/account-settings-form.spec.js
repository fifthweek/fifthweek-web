var CommonWorkflows = require('../common-workflows.js');
var TestKit = require('../test-kit.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var RegisterPage = require('../pages/register.page.js');
var PasswordInputPage = require('../pages/password-input.page.js');
var AccountSettingsPage = require('../pages/account-settings.page.js');
var SidebarPage = require('../pages/sidebar.page.js');
var DiscardChangesPage = require('../pages/discard-changes.page.js');

describe('account settings form', function() {
  'use strict';

  var registration;
  var subscription;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var registerPage = new RegisterPage();
  var usernameInputPage = new UsernameInputPage();
  var passwordInputPage = new PasswordInputPage();
  var page = new AccountSettingsPage();
  var sidebar = new SidebarPage();
  var discardChanges = new DiscardChangesPage();

  var navigateToPage = function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    sidebar.accountLink.click();
  };

  describe('when validating against good input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    it('should not be able to save without changes', function(){
      expect(page.saveChangesButton.isEnabled()).toBe(false);
    });

    describe('when saving new data', function(){

      afterEach(function() {
        page.saveChangesButton.click();
        expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(true);
        expect(page.saveChangesButton.isEnabled()).toBe(false);

        commonWorkflows.fastRefresh();
      });

      it('should allow the user to change their email', function(){
        testKit.clear(page.emailTextBoxId);
        testKit.setValue(page.emailTextBoxId, 'a+' + registration.email);
      });

      usernameInputPage.includeHappyPaths(page.usernameTextBoxId, function() {});

      passwordInputPage.includeHappyPaths(page.passwordTextBoxId, function() {});
    });
  });

  describe('when validating against bad input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    afterEach(function() {
      commonWorkflows.fastRefresh();
    });

    it('requires email address', function(){

      testKit.setValue(page.emailTextBoxId, 'invalid');
      page.saveChangesButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'A valid email address is required.');
    });

    usernameInputPage.includeSadPaths(page.usernameTextBoxId, page.saveChangesButton, page.helpMessages, function() {});

    passwordInputPage.includeSadPaths(page.passwordTextBoxId, page.saveChangesButton, page.helpMessages, function() {}, true);
  });

  describe('when validating page behaviour', function(){

    it('should run once before all', function() {
      navigateToPage();
    });

    it('should display current account settings', function(){
      expect(page.noProfileImage.isDisplayed()).toBe(true);
      expect(page.fileUploadButton.isDisplayed()).toBe(true);
      expect(element(by.id(page.emailTextBoxId)).getAttribute('value')).toBe(registration.email);
      expect(element(by.id(page.usernameTextBoxId)).getAttribute('value')).toBe(registration.username);
      expect(element(by.id(page.passwordTextBoxId)).getAttribute('value')).toBe('');
    });

    var setNewValues = function () {
      page.setFileInput('../sample-image.jpg');
      testKit.waitForElementToDisplay(page.profileImage);

      var newUsername = usernameInputPage.newUsername();
      var newEmail = registerPage.newEmail(newUsername);
      testKit.setValue(page.emailTextBoxId, newEmail);
      testKit.setValue(page.usernameTextBoxId, newUsername);
      testKit.setValue(page.passwordTextBoxId, 'phil-the-cat');
    };

    var verifyOldValues = function () {
      testKit.waitForElementToDisplay(page.noProfileImage);
      expect(element(by.id(page.emailTextBoxId)).getAttribute('value')).toBe(registration.email);
      expect(element(by.id(page.usernameTextBoxId)).getAttribute('value')).toBe(registration.username);
      expect(element(by.id(page.passwordTextBoxId)).getAttribute('value')).toBe('');
    };

    var verifyNewValues = function(){
      testKit.waitForElementToDisplay(page.profileImage);

      expect(element(by.id(page.emailTextBoxId)).getAttribute('value')).not.toBe(registration.email);
      expect(element(by.id(page.usernameTextBoxId)).getAttribute('value')).not.toBe(registration.username);
    };

    it('should not persist settings if the user does not save', function(){
      setNewValues();
      commonWorkflows.fastRefresh();
      verifyOldValues();
    });

    it('should not persist settings if the user cancels', function(){
      setNewValues();
      page.cancelButton.click();
      verifyOldValues();
    });

    discardChanges.describeDiscardingChanges(
      function(){ sidebar.accountLink.click(); },
      function(){ sidebar.helpLink.click(); },
      setNewValues,
      verifyNewValues,
      verifyOldValues
    );

    describe('when persisting new settings', function(){

      it('should disable the submit button until changes are made', function(){
        expect(page.saveChangesButton.isEnabled()).toBe(false);
      });

      it('should display a thumbnail', function(){
        page.setFileInput('../sample-image.jpg');
        testKit.waitForElementToDisplay(page.profileImage);
      });

      it('should enable the submit button after setting the profile image', function(){
        expect(page.saveChangesButton.isEnabled()).toBe(true);
      });

      it('should save changes to text fields', function() {
        var newUsername = usernameInputPage.newUsername();
        var newEmail = registerPage.newEmail(newUsername);

        registration.email = newEmail;
        testKit.setValue(page.emailTextBoxId, registration.email);

        registration.username = newUsername;
        testKit.setValue(page.usernameTextBoxId, registration.username);

        registration.password = 'phil-the-cat';
        testKit.setValue(page.passwordTextBoxId, registration.password);

        page.saveChangesButton.click();
        expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(true);
        expect(page.saveChangesButton.isEnabled()).toBe(false);
      });

      it('should reset the submit button and success message status on next change', function(){
        testKit.clear(page.usernameTextBoxId);
        expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(false);
        expect(page.saveChangesButton.isEnabled()).toBe(true);
      });

      it('should persist new settings between sessions', function(){
        commonWorkflows.fastRefresh();
        commonWorkflows.reSignIn(registration);
        sidebar.accountLink.click();

        testKit.waitForElementToDisplay(page.profileImage);

        expect(element(by.id(page.emailTextBoxId)).getAttribute('value')).toBe(registration.email);
        expect(element(by.id(page.usernameTextBoxId)).getAttribute('value')).toBe(registration.username);
      });
    });
  });
});
