var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderPage = require('../../pages/header-scheduled-posts.page.js');
var BreadcrumbPage = require('../../pages/breadcrumb.page.js');
var QueueListPage = require('../../pages/creators/queue-list.page.js');

describe('add queue page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var breadcrumb = new BreadcrumbPage();
  var queueListPage = new QueueListPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.scheduledPostsLink.click();
    header.queuesLink.click();
    queueListPage.addQueueButton.click();
  });

  breadcrumb.includeTests(['Queues', 'New Queue'], function() {
    sidebar.scheduledPostsLink.click();
    header.queuesLink.click();
    queueListPage.addQueueButton.click();
  });

  header.includeBasicTests(header.queuesLink);

  sidebar.includeEstablishedCreatorTests(sidebar.scheduledPostsLink);
});
