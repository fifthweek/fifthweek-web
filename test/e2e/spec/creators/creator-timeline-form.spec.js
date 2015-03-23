(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var PostPage = require('../../pages/post.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');

  describe('creator-timeline form', function() {

    var collectionName = 'Cats';
    var filePath = '../../../sample-image-tiny.jpg';

    var registration;
    var subscription;

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var post = new PostPage();
    var creatorLandingPagePage = new CreatorLandingPagePage();

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
      navigateToSite();
      commonWorkflows.reSignIn(registration);
      navigateToPage();
      expect(post.allPosts.count()).toBe(0);
    });

    it('should show the post after posting a note now', function () {
      navigateToSite();
      commonWorkflows.postNoteNow();
      navigateToPage();
      expect(post.allPosts.count()).toBe(1);
      post.expectNotePost();
    });

    it('should not show the post after posting a note on a date', function () {
      navigateToSite();
      commonWorkflows.postNoteOnDate();
      navigateToPage();
      expect(post.allPosts.count()).toBe(1);
    });

    it('should show the post after posting a file now', function () {
      navigateToSite();
      commonWorkflows.postFileNow(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(2);
      post.expectFilePost();
    });

    it('should not show the post after posting a file on a date', function () {
      navigateToSite();
      commonWorkflows.postFileOnDate(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(2);
    });

    it('should not show the post after posting a file to the queue', function () {
      navigateToSite();
      commonWorkflows.postFileToQueue(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(2);
    });

    it('should show the post after posting a image now', function () {
      navigateToSite();
      commonWorkflows.postImageNow(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(3);
      post.expectImagePost();
    });

    it('should not show the post after posting a image on a date', function () {
      navigateToSite();
      commonWorkflows.postImageOnDate(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(3);
    });

    it('should not show the post after posting a image to the queue', function () {
      navigateToSite();
      commonWorkflows.postImageToQueue(filePath, collectionName);
      navigateToPage();
      expect(post.allPosts.count()).toBe(3);
    });

    var navigateToSite = function() {
      creatorLandingPagePage.fifthweekLink.click();
    };

    var navigateToPage = function() {
      sidebar.usernameLink.click();
      creatorLandingPagePage.subscribeButton.click();
    };
  });
})();
