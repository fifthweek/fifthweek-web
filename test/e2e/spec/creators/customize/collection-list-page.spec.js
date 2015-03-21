var CommonWorkflows = require('../../../common-workflows.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');

describe('collection list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.subscriptionLink.click();
    header.collectionsLink.click();
  });

  header.includeBasicTests(header.collectionsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.subscriptionLink);
});
