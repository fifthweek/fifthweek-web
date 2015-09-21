var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderChannelsPage = require('../../pages/header-channels.page.js');
var BreadcrumbPage = require('../../pages/breadcrumb.page.js');
var ChannelListPage = require('../../pages/creators/channel-list.page.js');

describe('edit channel page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderChannelsPage();
  var breadcrumb = new BreadcrumbPage();
  var channelListPage = new ChannelListPage();

  var blog;
  it('should run once before all', function() {
    blog = commonWorkflows.createBlog().blog;
    sidebar.channelsLink.click();
    channelListPage.getEditChannelButton(blog.name).click();
  });

  breadcrumb.includeTests(['Channels', function() { return blog.name; }], function() {
    sidebar.channelsLink.click();
    channelListPage.getEditChannelButton(blog.name).click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.channelsLink);
});
