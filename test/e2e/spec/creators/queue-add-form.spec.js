var _ = require('lodash');
var TestKit = require('../../test-kit.js');
var CommonWorkflows = require('../../common-workflows.js');
var QueueNameInputPage = require('../../pages/queue-name-input.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderPage = require('../../pages/header-scheduled-posts.page.js');
var QueueListPage = require('../../pages/creators/queue-list.page.js');
var QueueAddPage = require('../../pages/creators/queue-add.page.js');

describe('add queue form', function() {
  'use strict';

  var registration;
  var blog;

  var queueCount = 0;
  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var queueNameInputPage = new QueueNameInputPage();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var queueListPage = new QueueListPage();
  var page = new QueueAddPage();

  var inputs;
  var getInputs = function() {
    return inputs;
  };
  var initialValues = {
    nameTextBox: ''
  };

  it('should run once before all', function() {
    var context = commonWorkflows.createBlog();
    registration = context.registration;
    blog = context.blog;

    var channelNames = [ blog.name ];
    channelNames.push(commonWorkflows.createChannel().name);
    channelNames.push(commonWorkflows.createChannel().name);

    inputs = page.inputs();

    sidebar.scheduledPostsLink.click();
    header.queuesLink.click();
    queueListPage.addQueueButton.click();
  });

  it('should initialise with an empty form', function() {
    testKit.expectFormValues(page, initialValues);
  });

  it('should discard changes when user cancels', function() {
    testKit.setFormValues(page, inputs);

    page.cancelButton.click();

    expect(queueListPage.queues.count()).toBe(queueCount);
    queueListPage.addQueueButton.click();
  });

  it('should allow user to cancel when form is invalid', function() {
    testKit.clearForm(page, inputs);

    page.cancelButton.click();

    expect(queueListPage.queues.count()).toBe(queueCount);
    queueListPage.addQueueButton.click();
  });

  describe('on successful submission', function() {
    var newFormValues;

    it('should run once before all', function() {
      newFormValues = testKit.setFormValues(page, inputs);
      page.createButton.click();
      queueCount++;
    });

    it('should persist the changes', function() {
      expectChangesAppliedAndNavigateToPage(newFormValues);
    });

    it('should persist the changes, between sessions', function() {
      commonWorkflows.reSignIn(registration);
      sidebar.scheduledPostsLink.click();
      header.queuesLink.click();

      expectChangesAppliedAndNavigateToPage(newFormValues);
    });
  });

  describe('when validating good input', function() {
    var newFormValues;

    afterEach(function() {
      page.createButton.click();
      queueCount++;
      expectChangesAppliedAndNavigateToPage(newFormValues);
    });

    testKit.includeHappyPaths(page, queueNameInputPage, 'nameTextBox', getInputs, function(generatedFormValues) {
      newFormValues = generatedFormValues;
    });
  });

  describe('when validating bad input', function() {
    afterEach(function() {
      commonWorkflows.fastRefresh();
    });

    testKit.includeSadPaths(page, page.createButton, page.helpMessages, queueNameInputPage, 'nameTextBox', getInputs);
  });

  var expectChangesAppliedAndNavigateToPage = function(newFormValues) {
    queueListPage.waitForPage();
    expect(queueListPage.queues.count()).toBe(queueCount);

    var queue = {
      name: newFormValues.nameTextBox
    };

    queueListPage.expectQueue(queue);

    queueListPage.addQueueButton.click();
  };
});
