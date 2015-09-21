var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var QueueListPage = require('../../pages/creators/queue-list.page.js');

describe('queue list form', function() {
  'use strict';

  // NOTE:
  // Tests for listing queues are covered by the add/edit queue specs.

  var registration;
  var blog;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var page = new QueueListPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;
    navigateToPage();
  });

  it('should allow new queues to be created', function () {
    expect(page.addQueueButton.isDisplayed()).toBe(true);
  });

  it('should contain no queues after registering', function () {
    expect(page.queues.count()).toBe(0);
  });

  it('should contain no queues after registering, after signing back in', function () {
    commonWorkflows.reSignIn(registration);
    navigateToPage();
    expect(page.queues.count()).toBe(0);
  });

  var navigateToPage = function() {
    sidebar.queuesLink.click();
  };
});
