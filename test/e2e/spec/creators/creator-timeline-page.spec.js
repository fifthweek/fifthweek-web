(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderPage = require('../../pages/header.page.js');

  describe('creator-timeline page', function() {

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var header = new HeaderPage();

    it('should not contain a sidebar or header', function() {
      commonWorkflows.createSubscription();
      sidebar.usernameLink.click();
      expect(sidebar.links.count()).toBe(0);
      expect(header.navigationLinks.count()).toBe(0);
    });
  });
})();
