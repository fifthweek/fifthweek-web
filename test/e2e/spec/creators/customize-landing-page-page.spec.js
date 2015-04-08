var CommonWorkflows = require('../../common-workflows.js');
var HeaderLandingPagePage = require('../../pages/header-landing-page.page.js');
var SidebarPage = require('../../pages/sidebar.page.js');
var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');

describe('customize landing page page', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var header = new HeaderLandingPagePage();
  var sidebar = new SidebarPage();
  var creatorLandingPagePage = new CreatorLandingPagePage();

  it('should run once before all', function() {
    commonWorkflows.createBlog();
    sidebar.landingPageLink.click();
    creatorLandingPagePage.editPageLink.click();
  });

  header.includeBasicTests(header.editPageLink);

  sidebar.includeEstablishedCreatorTests(sidebar.landingPageLink);
});
