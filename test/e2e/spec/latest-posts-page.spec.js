(function(){
  'use strict';

  var CommonWorkflows = require('../common-workflows.js');
  var HeaderPage = require('../pages/header-latest-posts.page.js');
  var SidebarPage = require('../pages/sidebar.page.js');

  describe('latest-posts page', function() {

    var commonWorkflows = new CommonWorkflows();
    var header = new HeaderPage();
    var sidebar = new SidebarPage();

    describe('when an established creator', function(){
      it('should run once before all', function() {
        commonWorkflows.createBlog();
        sidebar.latestPostsLink.click();
        header.latestPostsLink.click();
      });

      header.includeBasicTests(header.latestPostsLink);

      sidebar.includeEstablishedCreatorTests(sidebar.latestPostsLink);
    });

    describe('when a new creator', function(){
      it('should run once before all', function() {
        commonWorkflows.registerAsCreator();
        sidebar.latestPostsLink.click();
        header.latestPostsLink.click();
      });

      header.includeBasicTests(header.latestPostsLink);

      sidebar.includeNewCreatorTests(sidebar.latestPostsLink);
    });

    describe('when a consumer', function(){
      it('should run once before all', function() {
        commonWorkflows.registerAsConsumer();
        sidebar.latestPostsLink.click();
        header.latestPostsLink.click();
      });

      header.includeBasicTests(header.latestPostsLink);

      sidebar.includeConsumerTests(sidebar.latestPostsLink);
    });
  });
})();
