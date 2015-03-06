var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var ChannelNameInputPage = require('../../../pages/channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../../../pages/channel-description-input.page.js');
var ChannelPriceInputPage = require('../../../pages/channel-price-input.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');
var ChannelAddPage = require('../../../pages/creators/customize/channel-add.page.js');

describe('edit channel form', function() {
  'use strict';

  var registration;
  var subscription;

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var channelNameInputPage = new ChannelNameInputPage();
  var channelDescriptionInputPage = new ChannelDescriptionInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var channelListPage = new ChannelListPage();
  var page = new ChannelAddPage();

  var initialValues = {
    nameTextBox: '',
    descriptionTextBox: '',
    priceTextBox: '1.00',
    hiddenCheckbox: false
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    sidebar.customizeLink.click();
    header.channelsLink.click();
    channelListPage.addChannelButton.click();
  });

  it('should initialise with an empty form', function() {
    testKit.expectFormValues(page, initialValues);
  });

  it('should discard changes when user cancels', function() {
    testKit.setFormValues(page, page.inputs);

    page.cancelButton.click();

    expect(channelListPage.channels.count()).toBe(1);
    channelListPage.addChannelButton.click();
  });

  it('should allow user to cancel when form is invalid', function() {
    testKit.clearForm(page, page.inputs);

    page.cancelButton.click();

    expect(channelListPage.channels.count()).toBe(1);
    channelListPage.addChannelButton.click();
  });

  describe('on successful submission', function() {
    var newFormValues;

    it('should run once before all', function() {
      newFormValues = testKit.setFormValues(page, page.inputs);
      page.createButton.click();
    });

    it('should persist the changes', function() {
      expectChangesAppliedAndNavigateToPage(newFormValues, 1);
    });

    it('should persist the changes, between sessions', function() {
      commonWorkflows.reSignIn(registration);
      sidebar.customizeLink.click();
      header.channelsLink.click();

      expectChangesAppliedAndNavigateToPage(newFormValues, 1);
    });
  });

  describe('when validating good input', function() {
    var newFormValues;
    var newChannelIndex = 2;

    afterEach(function() {
      page.createButton.click();
      expectChangesAppliedAndNavigateToPage(newFormValues, newChannelIndex++);
    });

    testKit.includeHappyPaths(page, channelNameInputPage, 'nameTextBox', page.inputs, function(generatedFormValues) {
      newFormValues = generatedFormValues;
    });

    testKit.includeHappyPaths(page, channelDescriptionInputPage, 'descriptionTextBox', page.inputs, function(generatedFormValues) {
      newFormValues = generatedFormValues;
    });

    testKit.includeHappyPaths(page, channelPriceInputPage, 'priceTextBox', page.inputs, function(generatedFormValues) {
      newFormValues = generatedFormValues;
    });
  });

  describe('when validating bad input', function() {
    afterEach(function() {
      header.channelsLink.click(); // Reset form state.
      channelListPage.addChannelButton.click();
    });

    testKit.includeSadPaths(page, page.createButton, page.helpMessages, channelNameInputPage, 'nameTextBox', page.inputs);
    testKit.includeSadPaths(page, page.createButton, page.helpMessages, channelDescriptionInputPage, 'descriptionTextBox', page.inputs);
    testKit.includeSadPaths(page, page.createButton, page.helpMessages, channelPriceInputPage, 'priceTextBox', page.inputs);
  });

  var expectChangesAppliedAndNavigateToPage = function(newFormValues, index) {
    channelListPage.waitForPage();
    expect(channelListPage.channels.count()).toBe(index + 1);

    channelListPage.expectChannel(index, {
      name: newFormValues.nameTextBox,
      price: newFormValues.priceTextBox,
      description: newFormValues.descriptionTextBox
    });

    channelListPage.addChannelButton.click();
  };
});
