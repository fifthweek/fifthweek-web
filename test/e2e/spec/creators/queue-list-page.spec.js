var CommonWorkflows = require('../../common-workflows.js');
var HeaderPage = require('../../pages/header-scheduled-posts.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('queue list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.scheduledPostsLink.click();
    header.queuesLink.click();
  });

  header.includeBasicTests(header.queuesLink);

  sidebar.includeEstablishedCreatorTests(sidebar.scheduledPostsLink);
});
