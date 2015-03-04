var CommonWorkflows = require('../../../common-workflows.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');

describe('customize landing page page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderCustomizePage();
  var sidebar = new SidebarPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.customizeLink.click();
  });

  header.includeBasicTests(header.landingPageLink);

  sidebar.includeEstablishedCreatorTests(sidebar.customizeLink);
});
