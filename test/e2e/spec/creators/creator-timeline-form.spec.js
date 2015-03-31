(function(){
  'use strict';

  var TestKit = require('../../test-kit.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var PostPage = require('../../pages/post.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
  var DeleteConfirmationPage = require('../../pages/delete-confirmation.page.js');
  var EditPostDialogPage = require('../../pages/creators/edit-post-dialog.page.js');

  describe('creator-timeline form', function() {

    var collectionName = 'Cats';
    var filePath = '../../../sample-image-tiny.jpg';
    var filePathTiff = '../../../sample-image-tiny.tif';

    var registration;
    var subscription;

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var post = new PostPage(false);
    var creatorLandingPagePage = new CreatorLandingPagePage();
    var deleteConfirmationPage = new DeleteConfirmationPage();
    var editPostDialogPage = new EditPostDialogPage();

    var navigateToSite = function() {
      testKit.scrollIntoView(creatorLandingPagePage.fifthweekLink);
      creatorLandingPagePage.fifthweekLink.click();
    };

    var navigateToPage = function() {
      sidebar.usernameLink.click();
      creatorLandingPagePage.subscribeButton.click();
    };

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

    var testDeletion = function(){
      deleteConfirmationPage.describeDeletingWithoutVerification(
        'Post',
        function () {
          navigateToSite();
          navigateToPage();
          testKit.scrollIntoView(post.moreActionsButton);
          post.moreActionsButton.click();
          browser.waitForAngular();
          testKit.scrollIntoView(post.deletePostLink);
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

    var displayModal = function () {
      navigateToSite();
      navigateToPage();
      testKit.scrollIntoView(post.moreActionsButton);
      post.moreActionsButton.click();
      browser.waitForAngular();
      testKit.scrollIntoView(post.editPostLink);
      post.editPostLink.click();
    };

    var refresh = function () {
      navigateToSite();
      navigateToPage();
    };

    var testEditingContent = function(inputData){
      editPostDialogPage.describeEditingPostContent(
        false,
        inputData,
        navigateToPage,
        displayModal,
        refresh);
    };


    var testEditToQueue= function(inputData){
      editPostDialogPage.describeEditingPostToQueue(
        false,
        inputData,
        navigateToPage,
        displayModal,
        refresh);
    };

    var testEditToFutureDate = function(inputData){
      editPostDialogPage.describeEditingPostToFutureDate(
        false,
        inputData,
        navigateToPage,
        displayModal,
        refresh,
        2);
    };

    describe('when posting single posts', function(){
      var inputData = {};
      it('should run once before all', function() {
        var context = commonWorkflows.createSubscription();
        registration = context.registration;
        subscription = context.subscription;

        inputData.registration = registration;
        commonWorkflows.createNamedCollection(undefined, collectionName);
        navigateToPage();
      });

      it('should show the post after posting a note now', function () {
        navigateToSite();
        var postData = inputData.postData = commonWorkflows.postNoteNow();
        navigateToPage();
        post.expectNotePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a file now', function () {
        navigateToSite();
        var postData = inputData.postData = commonWorkflows.postFileNow(filePath, collectionName);
        navigateToPage();
        post.expectFilePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a image now', function () {
        navigateToSite();
        var postData = inputData.postData = commonWorkflows.postImageNow(filePath, collectionName);
        navigateToPage();
        post.expectImagePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a TIFF image now', function () {
        navigateToSite();
        var postData = inputData.postData = commonWorkflows.postImageNow(filePathTiff, collectionName);
        navigateToPage();
        post.expectNonViewableImagePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testEditToQueue();

      it('should show the post after posting a note to the past', function () {
        navigateToSite();
        var postData = inputData.postData = commonWorkflows.postNoteOnPastDate();
        navigateToPage();
        post.expectNotePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testEditToFutureDate();
    });
  });
})();
