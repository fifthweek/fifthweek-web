var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');
var ChannelSelectInputPage = require('../../../pages/channel-select-input.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var ChannelListPage = require('../../../pages/creators/subscription/channel-list.page.js');
var CollectionListPage = require('../../../pages/creators/subscription/collection-list.page.js');
var CollectionAddPage = require('../../../pages/creators/subscription/collection-add.page.js');

describe('add collection form', function() {
  'use strict';

  var registration;
  var subscription;
  var defaultChannelSelectText = 'Share with everyone';

  var collectionCount = 0;
  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var collectionNameInputPage = new CollectionNameInputPage();
  var channelSelectInputPage = new ChannelSelectInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var channelListPage = new ChannelListPage();
  var collectionListPage = new CollectionListPage();
  var page = new CollectionAddPage();

  var inputs;
  var getInputs = function() {
    return inputs;
  };
  var initialValues = {
    nameTextBox: '',
    channelSelect: defaultChannelSelectText
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

    sidebar.subscriptionLink.click();
    header.collectionsLink.click();
    collectionListPage.addCollectionButton.click();
  });

  it('should initialise with an empty form', function() {
    testKit.expectFormValues(page, initialValues);
  });

  it('should discard changes when user cancels', function() {
    testKit.setFormValues(page, inputs);

    page.cancelButton.click();

    expect(collectionListPage.collections.count()).toBe(collectionCount);
    collectionListPage.addCollectionButton.click();
  });

  it('should allow user to cancel when form is invalid', function() {
    testKit.clearForm(page, inputs);

    page.cancelButton.click();

    expect(collectionListPage.collections.count()).toBe(collectionCount);
    collectionListPage.addCollectionButton.click();
  });

  describe('on successful submission', function() {
    var newFormValues;

    it('should run once before all', function() {
      newFormValues = testKit.setFormValues(page, inputs);
      page.createButton.click();
      collectionCount++;
    });

    it('should persist the changes', function() {
      expectChangesAppliedAndNavigateToPage(newFormValues);
    });

    it('should persist the changes, between sessions', function() {
      commonWorkflows.reSignIn(registration);
      sidebar.subscriptionLink.click();
      header.collectionsLink.click();

      expectChangesAppliedAndNavigateToPage(newFormValues);
    });
  });

  describe('when validating good input', function() {
    var newFormValues;

    afterEach(function() {
      page.createButton.click();
      collectionCount++;
      expectChangesAppliedAndNavigateToPage(newFormValues);
    });

    testKit.includeHappyPaths(page, collectionNameInputPage, 'nameTextBox', getInputs, function(generatedFormValues) {
      newFormValues = generatedFormValues;
    });
  });

  describe('when validating bad input', function() {
    afterEach(function() {
      header.collectionsLink.click(); // Reset form state.
      collectionListPage.addCollectionButton.click();
    });

    testKit.includeSadPaths(page, page.createButton, page.helpMessages, collectionNameInputPage, 'nameTextBox', getInputs);
  });

  var expectChangesAppliedAndNavigateToPage = function(newFormValues) {
    collectionListPage.waitForPage();
    expect(collectionListPage.collections.count()).toBe(collectionCount);

    var collection = {
      name: newFormValues.nameTextBox,
      channelName: channelSelectInputPage.mapToChannelName(newFormValues.channelSelect)
    };

    collectionListPage.expectCollection(collection);

    collectionListPage.addCollectionButton.click();
  };
});
