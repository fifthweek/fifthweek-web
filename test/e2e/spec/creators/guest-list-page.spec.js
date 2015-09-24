(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var HeaderPage = require('../../pages/header-guest-list.page.js');
  var SidebarPage = require('../../pages/sidebar.page.js');

  describe('guest-list page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPage();
    var sidebar = new SidebarPage();

    it('should run once before all', function() {
      commonWorkflows.createBlog();
      sidebar.guestListLink.click();
      header.guestListLink.click();
    });

    header.includeBasicTests(header.guestListLink);

    sidebar.includeEstablishedCreatorTests(sidebar.guestListLink);
  });
})();
