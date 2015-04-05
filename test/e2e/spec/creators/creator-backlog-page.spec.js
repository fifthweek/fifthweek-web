(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var HeaderPostsPage = require('../../pages/header-posts.page.js');
  var SidebarPage = require('../../pages/sidebar.page.js');

  describe('creator-backlog page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPostsPage();
    var sidebar = new SidebarPage();

    it('should run once before all', function() {
      commonWorkflows.createSubscription();
      sidebar.postsLink.click();
      header.scheduledLink.click();
    });

    header.includeBasicTests(header.scheduledLink);

    sidebar.includeEstablishedCreatorTests(sidebar.postsLink);
  });
})();
