(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var HeaderPage = require('../../pages/header-subscribers.page.js');
  var SidebarPage = require('../../pages/sidebar.page.js');

  describe('view-subscribers page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPage();
    var sidebar = new SidebarPage();

    it('should run once before all', function() {
      commonWorkflows.createBlog();
      sidebar.subscribersLink.click();
      header.subscribersLink.click();
    });

    header.includeBasicTests(header.subscribersLink);

    sidebar.includeEstablishedCreatorTests(sidebar.subscribersLink);
  });
})();
