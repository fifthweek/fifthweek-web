var CommonWorkflows = require('../../common-workflows.js');
var HeaderChannelsPage = require('../../pages/header-channels.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('channel list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderChannelsPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.channelsLink.click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.channelsLink);
});
