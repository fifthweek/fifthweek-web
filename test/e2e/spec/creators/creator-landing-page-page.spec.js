(function(){
  'use strict';

  var Defaults = require('../../defaults.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderCreatorPage = require('../../pages/header-creator.page.js');

  describe('creator-landing-page page', function() {

    var subscription;
    var registration;

    var defaults = new Defaults();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerCreator = new HeaderCreatorPage();

    it('should not contain the standard sidebar or header', function() {
      var context = commonWorkflows.createSubscription();
      subscription = context.subscription;
      registration = context.registration;

      sidebar.usernameLink.click();
      expect(sidebar.sidebar.isDisplayed()).toBe(false);
      expect(headerStandard.navbar.isDisplayed()).toBe(false);
    });

    describe('after creating a subscription', function() {
      headerCreator.includeTests(function() { return subscription; }, function() { return defaults.introduction });
    });

    describe('after signing back in', function() {
      it('should run once before all', function() {
        commonWorkflows.reSignIn(registration);
        sidebar.usernameLink.click();
      });

      headerCreator.includeTests(function() { return subscription; }, function() { return defaults.introduction });
    });
  });
})();
