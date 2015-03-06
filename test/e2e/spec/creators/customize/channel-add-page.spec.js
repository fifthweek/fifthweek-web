var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var BreadcrumbPage = require('../../../pages/breadcrumb.page.js');
var ChannelListPage = require('../../../pages/creators/customize/channel-list.page.js');

describe('add channel page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var breadcrumb = new BreadcrumbPage();
  var channelListPage = new ChannelListPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.customizeLink.click();
    header.channelsLink.click();
    channelListPage.addChannelButton.click();
  });

  breadcrumb.includeTests(['Channels', 'New Channel'], function() {
    header.channelsLink.click();
    channelListPage.addChannelButton.click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.customizeLink);
});
