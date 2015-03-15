var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var BreadcrumbPage = require('../../../pages/breadcrumb.page.js');
var CollectionListPage = require('../../../pages/creators/customize/collection-list.page.js');

describe('edit collection page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var breadcrumb = new BreadcrumbPage();
  var collectionListPage = new CollectionListPage();

  var collectionName;

  it('should run once before all', function() {
    commonWorkflows.createSubscription();
    collectionName = commonWorkflows.createCollection().name;
    header.collectionsLink.click();
    collectionListPage.getEditCollectionButton(collectionName).click();
  });

  breadcrumb.includeTests(['Collections', function() { return collectionName; }], function() {
    header.collectionsLink.click();
    collectionListPage.getEditCollectionButton(collectionName).click();
  });

  header.includeBasicTests(header.collectionsLink);

  sidebar.includeEstablishedCreatorTests(sidebar.customizeLink);
});
