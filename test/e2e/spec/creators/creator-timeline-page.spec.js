(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderCreatorPage = require('../../pages/header-creator.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');

  describe('creator-timeline page', function() {

    var registration;
    var blog;

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerCreator = new HeaderCreatorPage();
    var creatorLandingPagePage = new CreatorLandingPagePage();

    it('should not contain a sidebar or header', function() {
      var context = commonWorkflows.createBlog();
      registration = context.registration;
      blog = context.blog;
      sidebar.landingPageLink.click();
      creatorLandingPagePage.subscribeButton.click();
      expect(sidebar.sidebar.isDisplayed()).toBe(false);
      expect(headerStandard.navbar.isDisplayed()).toBe(false);
    });

    headerCreator.includeTests(function() { return blog; }, function() { return ''; });
  });
})();
