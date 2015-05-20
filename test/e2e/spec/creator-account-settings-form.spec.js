var CommonWorkflows = require('../common-workflows.js');
var TestKit = require('../test-kit.js');
var CreatorNameInputPage = require('../pages/creator-name-input.page.js');
var RegisterPage = require('../pages/register.page.js');
var CreatorAccountSettingsPage = require('../pages/creator-account-settings.page.js');
var HeaderSettingsPage = require('../pages/header-settings.page.js');
var SidebarPage = require('../pages/sidebar.page.js');
var DiscardChangesPage = require('../pages/discard-changes.page.js');
var CreateBlogPage = require('../pages/creators/create-blog.page.js');

describe('creator account settings form', function() {
  'use strict';

  var registration;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var registerPage = new RegisterPage();
  var creatorNameInputPage = new CreatorNameInputPage();
  var page = new CreatorAccountSettingsPage();
  var header = new HeaderSettingsPage();
  var sidebar = new SidebarPage();
  var discardChanges = new DiscardChangesPage();
  var createBlogPage = new CreateBlogPage();

  describe('when a creator', function(){
    var navigateToPage = function() {
      var context = commonWorkflows.createBlog();
      registration = context.registration;
      sidebar.accountLink.click();
      header.creatorAccountSettingsLink.click();
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

        creatorNameInputPage.includeHappyPaths(page.creatorNameTextBoxId, function() {});
      });
    });

    describe('when validating against bad input', function() {

      it('should run once before all', function() {
        navigateToPage();
      });

      afterEach(function() {
        commonWorkflows.fastRefresh();
      });

      creatorNameInputPage.includeSadPaths(page.creatorNameTextBoxId, page.saveChangesButton, page.helpMessages, function() {});
    });

    describe('when validating page behaviour', function(){

      it('should run once before all', function() {
        navigateToPage();
      });

      it('should display current account settings', function(){
        expect(page.creatorNameTextBox.getAttribute('value')).toBe(registration.creatorName);
      });

      var setNewValues = function () {
        var newName = creatorNameInputPage.newName();
        testKit.setValue(page.creatorNameTextBoxId, newName);
      };

      var verifyOldValues = function () {
        expect(page.creatorNameTextBox.getAttribute('value')).toBe(registration.creatorName);
      };

      var verifyNewValues = function(){
        expect(page.creatorNameTextBox.getAttribute('value')).not.toBe(registration.creatorName);
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
        function(){ sidebar.accountLink.click(); header.creatorAccountSettingsLink.click(); },
        function(){ sidebar.channelsLink.click(); }, // Cheap arbitrary app link.
        setNewValues,
        verifyNewValues,
        verifyOldValues
      );

      describe('when persisting new settings', function(){

        it('should disable the submit button until changes are made', function(){
          expect(page.saveChangesButton.isEnabled()).toBe(false);
        });

        it('should save changes to text fields', function() {
          var newName = creatorNameInputPage.newName();

          registration.creatorName = newName;
          testKit.setValue(page.creatorNameTextBoxId, registration.creatorName);

          page.saveChangesButton.click();

          expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(true);
          expect(page.saveChangesButton.isEnabled()).toBe(false);
        });

        it('should reset the submit button and success message status on next change', function(){
          testKit.clear(page.creatorNameTextBoxId);
          expect(page.savedSuccessfullyMessage.isDisplayed()).toBe(false);
          expect(page.saveChangesButton.isEnabled()).toBe(true);
        });

        it('should persist new settings between sessions', function(){
          commonWorkflows.fastRefresh();
          commonWorkflows.reSignIn(registration);
          sidebar.accountLink.click();
          header.creatorAccountSettingsLink.click();

          expect(page.creatorNameTextBox.getAttribute('value')).toBe(registration.creatorName);
        });
      });
    });

  });

  describe('when not a creator', function(){
    var navigateToPage = function() {
      registration = commonWorkflows.registerAsConsumer();
      sidebar.accountLink.click();
      header.creatorAccountSettingsLink.click();
    };

    describe('when validating against good input', function() {

      beforeEach(function(){
        navigateToPage();
      });

      it('should not be able to save without changes', function(){
        expect(page.becomeCreatorButton.isEnabled()).toBe(false);
      });

      describe('when saving new data', function(){

        afterEach(function() {
          page.becomeCreatorButton.click();
          expect(browser.getCurrentUrl()).toContain(createBlogPage.pageUrl);
        });

        creatorNameInputPage.includeHappyPaths(page.creatorNameTextBoxId, function() {});
      });
    });

    describe('when validating against bad input', function() {

      it('should run once before all', function() {
        navigateToPage();
      });

      afterEach(function() {
        commonWorkflows.fastRefresh();
      });

      creatorNameInputPage.includeSadPaths(page.creatorNameTextBoxId, page.becomeCreatorButton, page.helpMessages, function() {});
    });

    describe('when validating page behaviour', function(){

      it('should run once before all', function() {
        navigateToPage();
      });

      it('should display emply creator name', function(){
        expect(page.creatorNameTextBox.getAttribute('value')).toBe('');
      });

      var setNewValues = function () {
        var newName = creatorNameInputPage.newName();
        testKit.setValue(page.creatorNameTextBoxId, newName);
      };

      var verifyOldValues = function () {
        expect(page.creatorNameTextBox.getAttribute('value')).toBe('');
      };

      var verifyNewValues = function(){
        expect(page.creatorNameTextBox.getAttribute('value')).not.toBe('');
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
        function(){ sidebar.accountLink.click(); header.creatorAccountSettingsLink.click(); },
        function(){ sidebar.readNowLink.click(); }, // Cheap arbitrary app link.
        setNewValues,
        verifyNewValues,
        verifyOldValues
      );

      describe('when persisting new settings', function(){

        it('should disable the submit button until changes are made', function(){
          expect(page.becomeCreatorButton.isEnabled()).toBe(false);
        });

        it('should save changes to text fields', function() {
          var newName = creatorNameInputPage.newName();

          registration.creatorName = newName;
          testKit.setValue(page.creatorNameTextBoxId, registration.creatorName);

          page.becomeCreatorButton.click();
          expect(browser.getCurrentUrl()).toContain(createBlogPage.pageUrl);

          sidebar.accountLink.click();
          header.creatorAccountSettingsLink.click();

          expect(page.saveChangesButton.isDisplayed()).toBe(true);
        });

        it('should persist new settings between sessions', function(){
          commonWorkflows.fastRefresh();
          commonWorkflows.reSignIn(registration);
          sidebar.accountLink.click();
          header.creatorAccountSettingsLink.click();

          expect(page.creatorNameTextBox.getAttribute('value')).toBe(registration.creatorName);
        });
      });
    });
  });
});
