var CommonWorkflows = require('../../common-workflows.js');
var HeaderQueuesPage = require('../../pages/header-queues.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('queue list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderQueuesPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.queuesLink.click();
  });

  header.includeBasicTests(header.queuesLink);

  sidebar.includeEstablishedCreatorTests(sidebar.queuesLink);
});
