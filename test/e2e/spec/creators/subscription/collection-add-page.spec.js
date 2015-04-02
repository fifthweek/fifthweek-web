var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCollectionsPage = require('../../../pages/header-collections.page.js');
var BreadcrumbPage = require('../../../pages/breadcrumb.page.js');
var CollectionListPage = require('../../../pages/creators/collection-list.page.js');

describe('add collection page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCollectionsPage();
  var breadcrumb = new BreadcrumbPage();
  var collectionListPage = new CollectionListPage();

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    sidebar.collectionsLink.click();
    collectionListPage.addCollectionButton.click();
  });

  breadcrumb.includeTests(['Collections', 'New Collection'], function() {
    header.collectionsLink.click();
    collectionListPage.addCollectionButton.click();
  });

  header.includeBasicTests(header.collectionsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.collectionsLink);
});
