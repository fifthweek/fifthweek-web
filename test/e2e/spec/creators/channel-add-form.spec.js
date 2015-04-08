var _ = require('lodash');
var TestKit = require('../../test-kit.js');
var CommonWorkflows = require('../../common-workflows.js');
var ChannelNameInputPage = require('../../pages/channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../../pages/channel-description-input.page.js');
var ChannelPriceInputPage = require('../../pages/channel-price-input.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var ChannelListPage = require('../../pages/creators/channel-list.page.js');
var ChannelAddPage = require('../../pages/creators/channel-add.page.js');

describe('add channel form', function() {
  'use strict';

  var registration;
  var blog;
  var channelCount = 1; // Account for default channel.

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var channelNameInputPage = new ChannelNameInputPage();
  var channelDescriptionInputPage = new ChannelDescriptionInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var sidebar = new SidebarPage();
  var channelListPage = new ChannelListPage();
  var page = new ChannelAddPage();

  var initialValues = {
    nameTextBox: '',
    descriptionTextBox: '',
    priceTextBox: '1.00',
    hiddenCheckbox: false
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;
    sidebar.channelsLink.click();
    channelListPage.addChannelButton.click();
  });

  it('should initialise with an empty form', function() {
    testKit.expectFormValues(page, initialValues);
  });

  it('should discard changes when user cancels', function() {
    testKit.setFormValues(page, page.inputs);

    page.cancelButton.click();

    expect(channelListPage.channels.count()).toBe(channelCount);
    channelListPage.addChannelButton.click();
  });

  it('should allow user to cancel when form is invalid', function() {
    testKit.clearForm(page, page.inputs);

    page.cancelButton.click();

    expect(channelListPage.channels.count()).toBe(channelCount);
    channelListPage.addChannelButton.click();
  });

  describe('on successful submission', function() {
    var newFormValues;

    it('should run once before all', function() {
      newFormValues = testKit.setFormValues(page, page.inputs);
      page.createButton.click();
      channelCount++;
    });

    it('should persist the changes', function() {
      expectChangesAppliedAndNavigateToPage(newFormValues);
    });

    it('should persist the changes, between sessions', function() {
      commonWorkflows.reSignIn(registration);
      sidebar.channelsLink.click();

      expectChangesAppliedAndNavigateToPage(newFormValues);
    });
  });

  describe('when validating good input', function() {
    var newFormValues;

    afterEach(function() {
      page.createButton.click();
      channelCount++;
      expectChangesAppliedAndNavigateToPage(newFormValues);
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
      commonWorkflows.fastRefresh();
    });

    testKit.includeSadPaths(page, page.createButton, page.helpMessages, channelNameInputPage, 'nameTextBox', page.inputs);
    testKit.includeSadPaths(page, page.createButton, page.helpMessages, channelDescriptionInputPage, 'descriptionTextBox', page.inputs);
    testKit.includeSadPaths(page, page.createButton, page.helpMessages, channelPriceInputPage, 'priceTextBox', page.inputs);
  });

  var expectChangesAppliedAndNavigateToPage = function(newFormValues) {
    channelListPage.waitForPage();
    expect(channelListPage.channels.count()).toBe(channelCount);

    channelListPage.expectChannel({
      name: newFormValues.nameTextBox,
      price: newFormValues.priceTextBox,
      description: newFormValues.descriptionTextBox
    });

    channelListPage.addChannelButton.click();
  };
});
