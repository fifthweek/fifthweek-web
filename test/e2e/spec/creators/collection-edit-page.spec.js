var CommonWorkflows = require('../../common-workflows.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var HeaderCollectionsPage = require('../../pages/header-collections.page.js');
var BreadcrumbPage = require('../../pages/breadcrumb.page.js');
var CollectionListPage = require('../../pages/creators/collection-list.page.js');

describe('edit collection page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCollectionsPage();
  var breadcrumb = new BreadcrumbPage();
  var collectionListPage = new CollectionListPage();

  var collectionName;

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    collectionName = commonWorkflows.createCollection().name;
    collectionListPage.getEditCollectionButton(collectionName).click();
  });

  breadcrumb.includeTests(['Collections', function() { return collectionName; }], function() {
    sidebar.collectionsLink.click();
    collectionListPage.getEditCollectionButton(collectionName).click();
  });

  header.includeBasicTests(header.collectionsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.collectionsLink);
});
