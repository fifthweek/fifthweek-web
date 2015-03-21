var CommonWorkflows = require('../../../common-workflows.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');

describe('channel list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.subscriptionLink.click();
    header.channelsLink.click();
  });

  header.includeBasicTests(header.channelsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.subscriptionLink);
});
