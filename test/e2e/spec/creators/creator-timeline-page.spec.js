(function(){
  'use strict';

  var Defaults = require('../../defaults.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderCreatorPage = require('../../pages/header-creator.page.js');
  var CreatorTimelinePage = require('../../pages/creators/creator-timeline.page.js');

  describe('creator-timeline page', function() {

    var registration;
    var subscription;

    var defaults = new Defaults();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerCreator = new HeaderCreatorPage();
    var page = new CreatorTimelinePage();

    it('should not contain a sidebar or header', function() {
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;
      sidebar.usernameLink.click();
      page.subscribeButton.click();
      expect(sidebar.sidebar.isDisplayed()).toBe(false);
      expect(headerStandard.navbar.isDisplayed()).toBe(false);
    });

    headerCreator.includeTests(function() { return subscription; }, function() { return defaults.introduction });
  });
})();
