var CommonWorkflows = require('../../../common-workflows.js');
var HeaderComposePage = require('../../../pages/header-compose.page.js');
var SidebarPage = require('../../../pages/sidebar.page.js');

describe('compose image page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderComposePage();
  var sidebar = new SidebarPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.newPostLink.click();
    header.imageLink.click();
  });

  header.includeBasicTests(header.imageLink);

  sidebar.includeEstablishedCreatorTests(sidebar.newPostLink);
});
