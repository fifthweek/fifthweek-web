var CommonWorkflows = require('../common-workflows.js');
var TestKit = require('../test-kit.js');
var UsernameInputPage = require('../pages/username-input.page.js');
var PasswordInputPage = require('../pages/password-input.page.js');
var AccountSettingsPage = require('../pages/account-settings.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('account settings form', function() {
  'use strict';

  var registration;
  var subscription;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var usernameInputPage = new UsernameInputPage();
  var passwordInputPage = new PasswordInputPage();
  var page = new AccountSettingsPage();
  var sidebar = new SidebarPage();

  var navigateToPage = function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    sidebar.settingsLink.click();
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

        browser.refresh();
      });

      it('should allow the user to change their email', function(){
        page.emailTextBox.clear();
        page.emailTextBox.sendKeys('a+' + registration.email);
      });

      usernameInputPage.includeHappyPaths(page.usernameTextBox, function() {});

      passwordInputPage.includeHappyPaths(page.passwordTextBox, function() {});
    });
  });

  describe('when validating against bad input', function() {

    it('should run once before all', function() {
      navigateToPage();
    });

    afterEach(function() {
      browser.refresh();
    });

    it('requires email address', function(){

      page.emailTextBox.clear();
      page.emailTextBox.sendKeys('invalid');
      page.saveChangesButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages,
        'A valid email address is required.');
    });

    usernameInputPage.includeSadPaths(page.usernameTextBox, page.saveChangesButton, page.helpMessages, function() {});

    passwordInputPage.includeSadPaths(page.passwordTextBox, page.saveChangesButton, page.helpMessages, function() {}, true);
  });

  describe('when setting form to known data', function(){

    it('should run once before all', function() {
      navigateToPage();
    });

    it('should disable the submit button until changes are made', function(){
      expect(page.saveChangesButton.isEnabled()).toBe(false);
    });

    it('should display a thumbnail', function(){
      expect(page.noProfileImage.isDisplayed()).toBe(true);
      page.setFileInput('../sample-image.jpg');
      browser.wait(function(){
        return page.profileImage.isPresent();
      });
      expect(page.profileImage.isDisplayed()).toBe(true);
    });

    it('should enable the submit button after setting the profile image', function(){
      expect(page.saveChangesButton.isEnabled()).toBe(true);
    });

    it('should save changes to text fields', function() {
      registration.email = 'phil+' + registration.email;
      page.emailTextBox.clear();
      page.emailTextBox.sendKeys(registration.email);

      registration.username = 'ph_' + registration.username.substring(3);
      page.usernameTextBox.clear();
      page.usernameTextBox.sendKeys(registration.username);

      registration.password = 'phil-the-cat';
      page.passwordTextBox.clear();
      page.passwordTextBox.sendKeys(registration.password);

      page.saveChangesButton.click();
      expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(true);
      expect(page.saveChangesButton.isEnabled()).toBe(false);
    });

    it('should reset the submit button and success message status on next change', function(){
      page.usernameTextBox.clear();
      expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(false);
      expect(page.saveChangesButton.isEnabled()).toBe(true);
    });

    it('should persist new settings between sessions', function(){
      commonWorkflows.reSignIn(registration);
      sidebar.settingsLink.click();

      browser.wait(function(){
        return page.profileImage.isPresent();
      });
      expect(page.profileImage.isDisplayed()).toBe(true);

      expect(page.emailTextBox.getAttribute('value')).toBe(registration.email);
      expect(page.usernameTextBox.getAttribute('value')).toBe(registration.username);
    });
  });

  describe('when setting form to known data and cancelling', function(){

    it('should run once before all', function() {
      navigateToPage();
    });

    it('should not persist settings', function(){
      page.setFileInput('../sample-image.jpg');
      browser.wait(function(){
        return page.profileImage.isPresent();
      });
      expect(page.profileImage.isDisplayed()).toBe(true);

      page.emailTextBox.clear();
      page.emailTextBox.sendKeys('phil+' + registration.email);

      page.usernameTextBox.clear();
      page.usernameTextBox.sendKeys('ph_' + registration.username.substring(3));

      page.passwordTextBox.clear();
      page.passwordTextBox.sendKeys('phil-the-cat');

      sidebar.helpLink.click();
      sidebar.settingsLink.click();

      expect(page.noProfileImage.isDisplayed()).toBe(true);
      expect(page.emailTextBox.getAttribute('value')).toBe(registration.email);
      expect(page.usernameTextBox.getAttribute('value')).toBe(registration.username);
      expect(page.passwordTextBox.getAttribute('value')).toBe('');
    });
  });
});
