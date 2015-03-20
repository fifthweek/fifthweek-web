(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.post.js');
  var HeaderBacklogPage = require('../../pages/header-backlog.post.js');
  var PostPage = require('../../pages/post.post.js');

  describe('creator-backlog form', function() {

    var collectionName = 'Cats';
    var filePath = '../../../sample-image-tiny.jpg';

    var registration;
    var subscription;

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var header = new HeaderBacklogPage();
    var post = new PostPage();

    it('should run once before all', function() {
      var context = commonWorkflows.createSubscription();
      registration = context.registration;
      subscription = context.subscription;

      commonWorkflows.createNamedCollection(undefined, collectionName);
      navigateToPage();
    });

    it('should contain no posts after registering', function () {
      expect(post.allPosts.count()).toBe(0);
    });

    it('should contain no posts after registering, after signing back in', function () {
      commonWorkflows.reSignIn(registration);
      navigateToPage();
      expect(post.allPosts.count()).toBe(0);
    });

    it('should not show the post after posting a note now', function () {
      commonWorkflows.postNoteNow();
      navigateToPage();
      expect(post.allPosts.count()).toBe(0);
    });

    it('should show the post after posting a note on a date', function () {
      commonWorkflows.postNoteOnDate();
      navigateToPage();
      expect(post.allPosts.count()).toBe(1);
      //expect(post.comment.isDisplayed()).toBe(true);
    });

    it('should not show the post after posting a file now', function () {
      commonWorkflows.postFileNow(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(1);
    });

    it('should show the post after posting a file on a date', function () {
      commonWorkflows.postFileOnDate(filePath, collectionName);
      navigateToPage();
      post.postIndex = 1;
      expect(post.allPosts.count()).toBe(2);
      //expect(post.fileDownloadLink.isDisplayed()).toBe(true);
    });

    it('should show the post after posting a file to the queue', function () {
      commonWorkflows.postFileToQueue(filePath, collectionName);
      navigateToPage();
      post.postIndex = 2;
      expect(post.allPosts.count()).toBe(3);
      //expect(post.fileDownloadLink.isDisplayed()).toBe(true);
    });

    it('should not show the post after posting a image now', function () {
      commonWorkflows.postImageNow(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(3);
    });

    it('should show the post after posting a image on a date', function () {
      commonWorkflows.postImageOnDate(filePath, collectionName);
      navigateToPage();
      post.postIndex = 3;
      expect(post.allPosts.count()).toBe(4);
      //expect(post.image.isDisplayed()).toBe(true);
    });

    it('should show the post after posting a image to the queue', function () {
      commonWorkflows.postImageToQueue(filePath, collectionName);
      navigateToPage();
      post.postIndex = 4;
      expect(post.allPosts.count()).toBe(5);
      //expect(post.image.isDisplayed()).toBe(true);
    });

    var navigateToPage = function() {
      sidebar.backlogLink.click();
      header.yourFuturePostsLink.click();
    };
  });
})();
