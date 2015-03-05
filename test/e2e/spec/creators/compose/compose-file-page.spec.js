var CommonWorkflows = require('../../../common-workflows.js');
var HeaderComposePage = require('../../../pages/header-compose.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');

describe('compose file page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderComposePage();
  var sidebar = new SidebarPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.newPostLink.click();
    header.fileLink.click();
  });

  header.includeBasicTests(header.fileLink);

  sidebar.includeEstablishedCreatorTests(sidebar.newPostLink);
});
