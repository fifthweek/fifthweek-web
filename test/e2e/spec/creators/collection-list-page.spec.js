var CommonWorkflows = require('../../common-workflows.js');
var HeaderCollectionsPage = require('../../pages/header-collections.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');

describe('collection list page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCollectionsPage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.collectionsLink.click();
  });

  header.includeBasicTests(header.collectionsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.collectionsLink);
});
