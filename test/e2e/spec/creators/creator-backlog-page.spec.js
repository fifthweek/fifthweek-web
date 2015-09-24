(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var HeaderPage = require('../../pages/header-scheduled-posts.page.js');
  var SidebarPage = require('../../pages/sidebar.page.js');

  describe('creator-backlog page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPage();
    var sidebar = new SidebarPage();

    it('should run once before all', function() {
      commonWorkflows.createBlog();
      sidebar.scheduledPostsLink.click();
      header.scheduledPostsLink.click();
    });

    header.includeBasicTests(header.scheduledPostsLink);

    sidebar.includeEstablishedCreatorTests(sidebar.scheduledPostsLink);
  });
})();
