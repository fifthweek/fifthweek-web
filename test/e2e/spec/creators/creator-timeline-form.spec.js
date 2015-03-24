(function(){
  'use strict';

  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var PostPage = require('../../pages/post.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
  var DeleteConfirmationPage = require('../../pages/delete-confirmation.page.js');

  describe('creator-timeline form', function() {

    var collectionName = 'Cats';
    var filePath = '../../../sample-image-tiny.jpg';

    var registration;
    var subscription;

    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var post = new PostPage(false);
    var creatorLandingPagePage = new CreatorLandingPagePage();
    var deleteConfirmationPage = new DeleteConfirmationPage();

    describe('when posting many posts', function(){

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
    });

    var scrollIntoView = function(element){
      var scrollIntoViewInner = function () {
        arguments[0].scrollIntoView();
      };
      browser.executeScript(scrollIntoViewInner, element.getWebElement());
    };

    var testDeletion = function(){
      deleteConfirmationPage.describeDeletingWithoutVerification(
        'Post',
        function () {
          navigateToSite();
          navigateToPage();
          scrollIntoView(post.moreActionsButton);
          post.moreActionsButton.click();
          scrollIntoView(post.deletePostLink);
          post.deletePostLink.click();
        },
        function () {
          // Check not deleted from page model.
          expect(post.allPosts.count()).toBe(1);

          // Check not deleted from API.
          navigateToSite();
          sidebar.helpLink.click();
          navigateToPage();
          expect(post.allPosts.count()).toBe(1);
        },
        function () {
          // Check deleted from page model.
          expect(post.allPosts.count()).toBe(0);

          // Check deleted from API.
          navigateToSite();
          sidebar.helpLink.click();
          navigateToPage();
          expect(post.allPosts.count()).toBe(0);
        }
      );
    };

    describe('when posting single posts', function(){
      it('should run once before all', function() {
        var context = commonWorkflows.createSubscription();
        registration = context.registration;
        subscription = context.subscription;

        commonWorkflows.createNamedCollection(undefined, collectionName);
        navigateToPage();
      });

      it('should show the post after posting a note now', function () {
        navigateToSite();
        var postData = commonWorkflows.postNoteNow();
        navigateToPage();
        post.expectNotePost(postData, registration);
      });

      testDeletion();

      it('should show the post after posting a file now', function () {
        navigateToSite();
        var postData = commonWorkflows.postFileNow(filePath, collectionName);
        navigateToPage();
        post.expectFilePost(postData, registration);
      });

      testDeletion();

      it('should show the post after posting a image now', function () {
        navigateToSite();
        var postData = commonWorkflows.postImageNow(filePath, collectionName);
        navigateToPage();
        post.expectImagePost(postData, registration);
      });

      testDeletion();
    });

    var navigateToSite = function() {
      scrollIntoView(creatorLandingPagePage.fifthweekLink);
      creatorLandingPagePage.fifthweekLink.click();
    };

    var navigateToPage = function() {
      sidebar.usernameLink.click();
      creatorLandingPagePage.subscribeButton.click();
    };
  });
})();
