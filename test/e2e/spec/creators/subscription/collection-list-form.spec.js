var CommonWorkflows = require('../../../common-workflows.js');
var SidebarPage = require('../../../pages/sidebar.page.js');
var HeaderCustomizePage = require('../../../pages/header-customize.page.js');
var CollectionListPage = require('../../../pages/creators/subscription/collection-list.page.js');

describe('collection list form', function() {
  'use strict';

  // NOTE:
  // Tests for listing collections are covered by the add/edit collection specs.

  var registration;
  var subscription;

  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderCustomizePage();
  var page = new CollectionListPage();

  it('should run once before all', function() {
    var context = commonWorkflows.createSubscription();
    registration = context.registration;
    subscription = context.subscription;
    navigateToPage();
  });

  it('should allow new collections to be created', function () {
    expect(page.addCollectionButton.isDisplayed()).toBe(true);
  });

  it('should contain no collections after registering', function () {
    expect(page.collections.count()).toBe(0);
  });

  it('should contain no collections after registering, after signing back in', function () {
    commonWorkflows.reSignIn(registration);
    navigateToPage();
    expect(page.collections.count()).toBe(0);
  });

  var navigateToPage = function() {
    sidebar.subscriptionLink.click();
    header.collectionsLink.click();
  };
});
