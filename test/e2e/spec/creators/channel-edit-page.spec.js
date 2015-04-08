var Defaults = require('../../defaults.js');
var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderChannelsPage = require('../../pages/header-channels.page.js');
var BreadcrumbPage = require('../../pages/breadcrumb.page.js');
var ChannelListPage = require('../../pages/creators/channel-list.page.js');

describe('edit channel page', function() {
  'use strict';

  var defaults = new Defaults();
  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderChannelsPage();
  var breadcrumb = new BreadcrumbPage();
  var channelListPage = new ChannelListPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.channelsLink.click();
    channelListPage.getEditChannelButton(defaults.channelName).click();
  });

  breadcrumb.includeTests(['Channels', defaults.channelName], function() {
    sidebar.channelsLink.click();
    channelListPage.getEditChannelButton(defaults.channelName).click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.channelsLink);
});
