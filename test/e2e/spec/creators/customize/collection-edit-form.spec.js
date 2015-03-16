var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');
var ChannelSelectInputPage = require('../../../pages/channel-select-input.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var DeleteConfirmationPage = require('../../../pages/delete-confirmation.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');
var CollectionListPage = require('../../../pages/creators/customize/collection-list.page.js');
var CollectionEditPage = require('../../../pages/creators/customize/collection-edit.page.js');

describe('edit collection form', function() {
  'use strict';

  var registration;
  var subscription;
  var savedValues;
  var inputs;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var collectionNameInputPage = new CollectionNameInputPage();
  var channelSelectInputPage = new ChannelSelectInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var deleteConfirmationPage = new DeleteConfirmationPage();
  var channelListPage = new ChannelListPage();
  var collectionListPage = new CollectionListPage();
  var page = new CollectionEditPage();

  var navigateToPage = function() {
    collectionListPage.waitForPage();
    var editButton = collectionListPage.getEditCollectionButton(savedValues.nameTextBox);
    editButton.click();
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;

    var channelNames = [ channelListPage.defaultChannelName ];
    channelNames.push(commonWorkflows.createChannel().name);
    channelNames.push(commonWorkflows.createChannel().name);

    var channelSelectTexts = channelSelectInputPage.mapToSelectTexts(channelNames);
    inputs = page.inputs(channelSelectTexts);

    var collection = commonWorkflows.createCollection(channelNames);

    savedValues = {
      nameTextBox: collection.name,
      channelSelect: channelSelectInputPage.mapToSelectText(collection.channelName)
    };

    sidebar.customizeLink.click();
    header.collectionsLink.click();
    navigateToPage();
  });

  it('should initialise with the correct properties', function () {
    testKit.expectFormValues(page, savedValues);
    expect(page.releaseTimeSummaries.count()).toBe(1);
  });

  it('should discard changes when user cancels', function() {
    testKit.setFormValues(page, inputs);

    page.expandReleaseTimesButton.click();
    page.newReleaseTimeButton.click();
    page.addReleaseTimeButton.click();

    page.cancelButton.click();
    navigateToPage();

    testKit.expectFormValues(page, savedValues);
    expect(page.releaseTimeSummaries.count()).toBe(1);
  });

  it('should allow user to cancel when form is invalid', function() {
    testKit.clearForm(page, inputs);

    page.cancelButton.click();
    navigateToPage();

    testKit.expectFormValues(page, savedValues);
    expect(page.releaseTimeSummaries.count()).toBe(1);
  });

  describe('on successful submission', function() {
    it('should run once before all', function() {
      savedValues = testKit.setFormValues(page, inputs);

      page.expandReleaseTimesButton.click();
      page.newReleaseTimeButton.click();
      page.addReleaseTimeButton.click();

      page.saveButton.click();
      navigateToPage();
    });

    it('should persist the changes', function() {
      testKit.expectFormValues(page, savedValues);
      expect(page.releaseTimeSummaries.count()).toBe(2);
    });

    it('should persist the changes, between sessions', function() {
      commonWorkflows.reSignIn(registration);
      sidebar.customizeLink.click();
      header.collectionsLink.click();
      navigateToPage();
      testKit.expectFormValues(page, savedValues);
      expect(page.releaseTimeSummaries.count()).toBe(2);
    });
  });

  describe('when validating good input', function() {
    afterEach(function () {
      page.saveButton.click();
      navigateToPage();
      testKit.expectFormValues(page, savedValues);
    });

    testKit.includeHappyPaths(page, collectionNameInputPage, 'nameTextBox', null, function(generatedFormValues) {
      savedValues = generatedFormValues;
    });
  });

  describe('when validating bad input', function() {
    afterEach(function () {
      header.collectionsLink.click(); // Reset form state.
      navigateToPage();
    });

    testKit.includeSadPaths(page, page.saveButton, page.helpMessages, collectionNameInputPage, 'nameTextBox');
  });

  describe('submit button', function () {
    afterEach(function () {
      header.collectionsLink.click(); // Reset form state.
      navigateToPage();
    });

    testKit.itShouldHaveSubmitButtonDisabledUntilDirty(page, inputs, page.saveButton);

    it('should remain disabled after cancelling out of adding a release time', function(){
      page.expandReleaseTimesButton.click();
      page.newReleaseTimeButton.click();
      page.cancelReleaseTimeButton.click();
      expect(page.saveButton.isEnabled()).toBe(false);
    });

    it('should become enabled after adding a release time', function(){
      page.expandReleaseTimesButton.click();
      page.newReleaseTimeButton.click();
      page.addReleaseTimeButton.click();
      expect(page.saveButton.isEnabled()).toBe(true);
    });

    it('should become enabled after removing a release time', function(){
      page.expandReleaseTimesButton.click();
      page.getReleaseTime(0).click();
      page.deleteReleaseTimeButton.click();
      page.confirmDeleteReleaseTimeButton.click();
      expect(page.saveButton.isEnabled()).toBe(true);
    });

    it('should become enabled after updating a release time', function(){
      page.expandReleaseTimesButton.click();
      page.getReleaseTime(0).click();
      testKit.makeSelectDirty(page, 'daySelect');
      page.saveReleaseTimeButton.click();
      expect(page.saveButton.isEnabled()).toBe(true);
    });
  });

  deleteConfirmationPage.describeDeletingWithVerification(
    'Collection',
    function () {
      return savedValues.nameTextBox;
    },
    function () {
      page.deleteButton.click();
    },
    function () {
      // Check not deleted from client-side.
      header.collectionsLink.click();
      navigateToPage();
      testKit.expectFormValues(page, savedValues);

      // Check not deleted from API.
      commonWorkflows.reSignIn(registration);
      sidebar.customizeLink.click();
      header.collectionsLink.click();
      navigateToPage();
      testKit.expectFormValues(page, savedValues);
    },
    function () {
      // Check deleted from client-side.
      collectionListPage.waitForPage();
      expect(collectionListPage.collections.count()).toBe(0);
      expect(collectionListPage.collections.getText()).not.toContain(savedValues.nameTextBox);

      // Check deleted from API.
      commonWorkflows.reSignIn(registration);
      sidebar.customizeLink.click();
      header.collectionsLink.click();
      collectionListPage.waitForPage();
      expect(collectionListPage.collections.count()).toBe(0);
      expect(collectionListPage.collections.getText()).not.toContain(savedValues.nameTextBox);
    }
  );
});