var Defaults = require('../../../defaults.js');
var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var ChannelListPage = require('../../../pages/creators/subscription/channel-list.page.js');

describe('channel list form', function() {
  'use strict';

  // NOTE:
  // Tests for listing non-default channels are covered by the add/edit collection specs.

  var registration;
  var subscription;

  var defaults = new Defaults();
  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new ChannelListPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    navigateToPage();
  });

  it('should allow new channels to be created', function () {
    expect(page.addChannelButton.isDisplayed()).toBe(true);
  });

  it('should contain the default channel after registering', function () {
    expectBaseChannel();
  });

  it('should contain the default channel after registering, after signing back in', function () {
    commonWorkflows.reSignIn(registration);
    navigateToPage();
    expectBaseChannel();
  });

  it('should allow default channel to be edited', function () {
    expect(page.getEditChannelButton(defaults.channelName).isDisplayed()).toBe(true);
  });

  var navigateToPage = function() {
    sidebar.subscriptionLink.click();
    header.channelsLink.click();
  };

  var expectBaseChannel = function() {
    expect(page.channels.count()).toBe(1);
    page.expectChannel({
      name: defaults.channelName,
      price: subscription.basePrice,
      description: defaults.channelDescription
    });
  };
});
