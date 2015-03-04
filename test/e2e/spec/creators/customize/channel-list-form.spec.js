var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var ChannelAddPage = require('../../../pages/creators/customize/channel-add.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');

describe('channel list form', function() {
  'use strict';

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var channelAddPage = new ChannelAddPage();
  var page = new ChannelListPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
  });

  it('should allow new channels to be created', function () {
    navigateToPage();
    page.addChannelButton.click();

    expect(browser.getCurrentUrl()).toContain(channelAddPage.pageUrl);
  });

  it('should contain the base channel after registering', function () {
    navigateToPage();
    expectBaseChannel();
  });

  it('should contain the base channel after registering, after signing back in', function () {
    commonWorkflows.reSignIn(registration);
    navigateToPage();
    expectBaseChannel();
  });

  var navigateToPage = function() {
    sidebar.customizeLink.click();
    header.channelsLink.click();
  };

  var expectBaseChannel = function() {
    expect(page.channels.count()).toBe(1);

    var defaultChannelText = page.getChannel(0).getText();
    expect(defaultChannelText).toContain('Basic Subscription');
    expect(defaultChannelText).toContain('$' + subscription.basePrice);
    expect(defaultChannelText).toContain('Exclusive News Feed');
    expect(defaultChannelText).toContain('Early Updates on New Releases');
  };
});
