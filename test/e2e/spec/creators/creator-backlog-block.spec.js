(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderBacklogPage = require('../../pages/header-backlog.page.js');
  var PostPage = require('../../pages/post.page.js');

  describe('collection list form', function() {

    var collectionName = 'Cats';
    var filePath = '../../../sample-image-tiny.jpg';

    var registration;
    var subscription;

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var header = new HeaderBacklogPage();
    var page = new PostPage();

    it('should run once before all', function() {
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;

      commonWorkflows.createNamedCollection(undefined, collectionName);
      navigateToPage();
    });

    it('should contain no posts after registering', function () {
      expect(page.allPosts.count()).toBe(0);
    });

    it('should contain no posts after registering, after signing back in', function () {
      commonWorkflows.reSignIn(registration);
      navigateToPage();
      expect(page.allPosts.count()).toBe(0);
    });

    it('should not show the post after posting a note now', function () {
      commonWorkflows.postNoteNow();
      navigateToPage();
      expect(page.allPosts.count()).toBe(0);
    });

    it('should show the post after posting a note on a date', function () {
      commonWorkflows.postNoteOnDate();
      navigateToPage();
      expect(page.allPosts.count()).toBe(1);
      //expect(page.comment.isDisplayed()).toBe(true);
    });

    it('should not show the post after posting a file now', function () {
      commonWorkflows.postFileNow(filePath, collectionName);
      navigateToPage();
      //expect(page.allPosts.count()).toBe(1);
    });

    it('should show the post after posting a file on a date', function () {
      commonWorkflows.postFileOnDate(filePath, collectionName);
      navigateToPage();
      page.postIndex = 1;
      expect(page.allPosts.count()).toBe(2);
      //expect(page.fileDownloadLink.isDisplayed()).toBe(true);
    });

    it('should show the post after posting a file to the queue', function () {
      commonWorkflows.postFileToQueue(filePath, collectionName);
      navigateToPage();
      page.postIndex = 2;
      expect(page.allPosts.count()).toBe(3);
      //expect(page.fileDownloadLink.isDisplayed()).toBe(true);
    });

    it('should not show the post after posting a image now', function () {
      commonWorkflows.postImageNow(filePath, collectionName);
      navigateToPage();
      expect(page.allPosts.count()).toBe(3);
    });

    it('should show the post after posting a image on a date', function () {
      commonWorkflows.postImageOnDate(filePath, collectionName);
      navigateToPage();
      page.postIndex = 3;
      expect(page.allPosts.count()).toBe(4);
      //expect(page.image.isDisplayed()).toBe(true);
    });

    it('should show the post after posting a image to the queue', function () {
      commonWorkflows.postImageToQueue(filePath, collectionName);
      navigateToPage();
      page.postIndex = 4;
      expect(page.allPosts.count()).toBe(5);
      //expect(page.image.isDisplayed()).toBe(true);
    });

    var navigateToPage = function() {
      sidebar.backlogLink.click();
      header.futurePostsLink.click();
    };
  });
})();
