(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');
  var HeaderCreatorPage = require('../../pages/header-creator.page.js');

  describe('creator-landing-page page', function() {

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var headerStandard = new HeaderPage();
    var headerCreator = new HeaderCreatorPage();

    it('should not contain the standard sidebar or header', function() {
      commonWorkflows.createSubscription();
      sidebar.usernameLink.click();
      expect(sidebar.sidebar.isDisplayed()).toBe(false);
      expect(headerStandard.navbar.isDisplayed()).toBe(false);
    });

    headerCreator.includeTests();
  });
})();
