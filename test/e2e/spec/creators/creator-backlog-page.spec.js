(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var HeaderBacklogPage = require('../../pages/header-backlog.page.js');
  var SidebarPage = require('../../pages/sidebar.page.js');

  describe('creator-backlog page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderBacklogPage();
    var sidebar = new SidebarPage();

    it('should run once before all', function() {
      commonWorkflows.createSubscription();
      sidebar.backlogLink.click();
    });

    header.includeBasicTests(header.futurePostsLink);

    sidebar.includeEstablishedCreatorTests(sidebar.backlogLink);
  });
})();
