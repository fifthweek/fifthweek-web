var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderPage = require('../../pages/header-edit-profile.page.js');
var BreadcrumbPage = require('../../pages/breadcrumb.page.js');
var ChannelListPage = require('../../pages/creators/channel-list.page.js');

describe('add channel page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var breadcrumb = new BreadcrumbPage();
  var channelListPage = new ChannelListPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.editProfileLink.click();
    header.channelsLink.click();
    channelListPage.addChannelButton.click();
  });

  breadcrumb.includeTests(['Channels', 'New Channel'], function() {
    sidebar.editProfileLink.click();
    header.channelsLink.click();
    channelListPage.addChannelButton.click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.editProfileLink);
});
