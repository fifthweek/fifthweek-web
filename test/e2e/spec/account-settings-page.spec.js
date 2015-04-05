var CommonWorkflows = require('../common-workflows.js');
var HeaderSettingsPage = require('../pages/header-settings.page.js');
var SidebarPage = require('../pages/sidebar.page.js');

describe('account settings page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderSettingsPage();
  var sidebar = new SidebarPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.accountLink.click();
  });

  header.includeBasicTests(header.accountSettingsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.accountLink);
});
