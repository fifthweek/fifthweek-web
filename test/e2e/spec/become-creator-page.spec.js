var CommonWorkflows = require('../common-workflows.js');
var HeaderSettingsPage = require('../pages/header-publish.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('account settings page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderSettingsPage();
  var sidebar = new SidebarPage();

  describe('when a consumer', function(){
    it('should run once before all', function() {
      commonWorkflows.registerAsConsumer();
      sidebar.publishLink.click();
      header.publishLink.click();
    });

    header.includeBasicTests(header.publishLink);

    sidebar.includeConsumerTests(sidebar.publishLink);
  });
});
