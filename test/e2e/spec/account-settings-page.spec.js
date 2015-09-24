var CommonWorkflows = require('../common-workflows.js');
var HeaderSettingsPage = require('../pages/header-account.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('account settings page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderSettingsPage();
  var sidebar = new SidebarPage();

  describe('when an established creator', function(){
    it('should run once before all', function() {
      commonWorkflows.createBlog();
      sidebar.accountLink.click();
    });

    header.includeBasicTests(header.accountSettingsLink);

    sidebar.includeEstablishedCreatorTests(sidebar.accountLink);
  });

  describe('when a new creator', function(){
    it('should run once before all', function() {
      commonWorkflows.register();
      sidebar.accountLink.click();
    });

    header.includeBasicTests(header.accountSettingsLink);

    sidebar.includeNewCreatorTests(sidebar.accountLink);
  });

  describe('when a consumer', function(){
    it('should run once before all', function() {
      commonWorkflows.registerAsConsumer();
      sidebar.accountLink.click();
    });

    header.includeBasicTests(header.accountSettingsLink);

    sidebar.includeConsumerTests(sidebar.accountLink);
  });
});
