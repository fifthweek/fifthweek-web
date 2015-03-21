var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var BreadcrumbPage = require('../../../pages/breadcrumb.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');

describe('edit channel page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var breadcrumb = new BreadcrumbPage();
  var channelListPage = new ChannelListPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.subscriptionLink.click();
    header.channelsLink.click();
    channelListPage.getEditChannelButton(channelListPage.defaultChannelName).click();
  });

  breadcrumb.includeTests(['Channels', channelListPage.defaultChannelName], function() {
    header.channelsLink.click();
    channelListPage.getEditChannelButton(channelListPage.defaultChannelName).click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.subscriptionLink);
});
