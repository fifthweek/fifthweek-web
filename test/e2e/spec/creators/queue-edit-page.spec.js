var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderQueuesPage = require('../../pages/header-queues.page.js');
var BreadcrumbPage = require('../../pages/breadcrumb.page.js');
var QueueListPage = require('../../pages/creators/queue-list.page.js');

describe('edit queue page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderQueuesPage();
  var breadcrumb = new BreadcrumbPage();
  var queueListPage = new QueueListPage();

  var queueName;

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    queueName = commonWorkflows.createQueue().name;
    queueListPage.getEditQueueButton(queueName).click();
  });

  breadcrumb.includeTests(['Queues', function() { return queueName; }], function() {
    sidebar.queuesLink.click();
    queueListPage.getEditQueueButton(queueName).click();
  });

  header.includeBasicTests(header.queuesLink);

  sidebar.includeEstablishedCreatorTests(sidebar.queuesLink);
});
