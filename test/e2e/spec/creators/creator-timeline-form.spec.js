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
    var blog;

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var post = new PostPage(false);
    var creatorLandingPagePage = new CreatorLandingPagePage();
    var deleteConfirmationPage = new DeleteConfirmationPage();
    var editPostDialogPage = new EditPostDialogPage();

    var navigateToLandingPage = function() {
      sidebar.landingPageLink.click();
      creatorLandingPagePage.subscribeButton.click();
    };

    var navigateToSiteFromLandingPage = function() {
      testKit.scrollIntoView(creatorLandingPagePage.fifthweekLink);
      creatorLandingPagePage.fifthweekLink.click();
    };

    var navigateToPostsPage = function() {
      sidebar.postsLink.click();
    };

    var navigateToSiteFromPostsPage = function() {
    };

    var runTests = function(navigateToPage, navigateToSite){
      describe('when posting many posts', function(){

        it('should run once before all', function() {
          var context = commonWorkflows.createBlog();
          registration = context.registration;
          blog = context.blog;

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
            testKit.scrollIntoView(post.deletePostLink);
            post.deletePostLink.click();
          },
          function () {
            // Check not deleted from page model.
            expect(post.allPosts.count()).toBe(1);

            // Check not deleted from API.
            navigateToSite();
            sidebar.channelsLink.click();
            navigateToPage();
            expect(post.allPosts.count()).toBe(1);
          },
          function () {
            // Check deleted from page model.
            expect(post.allPosts.count()).toBe(0);

            // Check deleted from API.
            navigateToSite();
            sidebar.channelsLink.click();
            navigateToPage();
            expect(post.allPosts.count()).toBe(0);
          }
        );
      };

      var displayEditModal = function (targetPost) {
        targetPost = targetPost || post;
        navigateToSite();
        navigateToPage();
        testKit.scrollIntoView(targetPost.moreActionsButton);
        targetPost.moreActionsButton.click();
        testKit.scrollIntoView(targetPost.editPostLink);
        targetPost.editPostLink.click();
        testKit.waitForElementToDisplay(editPostDialogPage.expandButton);
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
          displayEditModal,
          refresh);
      };


      var testEditToQueue= function(inputData){
        editPostDialogPage.describeEditingPostToQueue(
          false,
          inputData,
          navigateToPage,
          displayEditModal,
          refresh);
      };

      var testEditToFutureDate = function(inputData){
        editPostDialogPage.describeEditingPostToFutureDate(
          false,
          inputData,
          navigateToPage,
          displayEditModal,
          refresh,
          2);
      };

      describe('when posting single posts', function(){
        var inputData = {};
        it('should run once before all', function() {
          var context = commonWorkflows.createBlog();
          registration = context.registration;
          blog = context.blog;

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

      describe('when reordering posts', function(){
        it('should re-order correctly', function() {
          var context = commonWorkflows.createBlog();
          registration = context.registration;
          blog = context.blog;

          commonWorkflows.createNamedCollection(undefined, collectionName);

          var post1 = new PostPage(false, 0);
          var post2 = new PostPage(false, 1);
          var post3 = new PostPage(false, 2);

          commonWorkflows.postNoteOnPastDate();
          commonWorkflows.fastRefresh();
          commonWorkflows.postNoteOnPastDate();
          commonWorkflows.fastRefresh();
          commonWorkflows.postNoteOnPastDate();
          navigateToPage();
          displayEditModal(post1);
          editPostDialogPage.editPostComment('One');
          displayEditModal(post2);
          editPostDialogPage.editPostComment('Two');
          displayEditModal(post3);
          editPostDialogPage.editPostComment('Three');

          expect(post1.comment.getText()).toBe('One');
          expect(post2.comment.getText()).toBe('Two');
          expect(post3.comment.getText()).toBe('Three');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(0);
          expect(post3.dayGroupings.count()).toBe(0);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);
          refresh();
          expect(post1.comment.getText()).toBe('One');
          expect(post2.comment.getText()).toBe('Two');
          expect(post3.comment.getText()).toBe('Three');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(0);
          expect(post3.dayGroupings.count()).toBe(0);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);

          displayEditModal(post1);
          editPostDialogPage.editPostDate(-3);

          expect(post1.comment.getText()).toBe('Two');
          expect(post2.comment.getText()).toBe('Three');
          expect(post3.comment.getText()).toBe('One');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(0);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);
          refresh();
          expect(post1.comment.getText()).toBe('Two');
          expect(post2.comment.getText()).toBe('Three');
          expect(post3.comment.getText()).toBe('One');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(0);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);

          displayEditModal(post2);
          editPostDialogPage.editPostDate(-2);

          expect(post1.comment.getText()).toBe('Two');
          expect(post2.comment.getText()).toBe('Three');
          expect(post3.comment.getText()).toBe('One');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(1);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);
          refresh();
          expect(post1.comment.getText()).toBe('Two');
          expect(post2.comment.getText()).toBe('Three');
          expect(post3.comment.getText()).toBe('One');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(1);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);

          displayEditModal(post3);
          editPostDialogPage.editPostDate(2);

          expect(post1.comment.getText()).toBe('Two');
          expect(post2.comment.getText()).toBe('One');
          expect(post3.comment.getText()).toBe('Three');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(1);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);
          refresh();
          expect(post1.comment.getText()).toBe('Two');
          expect(post2.comment.getText()).toBe('One');
          expect(post3.comment.getText()).toBe('Three');
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(1);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);

          displayEditModal(post1);
          editPostDialogPage.editPostDate(-1);

          // Can't guarantee ordering here because of time rounding to nearest minute.
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(0);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);
          refresh();
          expect(post1.dayGroupings.count()).toBe(1);
          expect(post2.dayGroupings.count()).toBe(0);
          expect(post3.dayGroupings.count()).toBe(1);
          expect(post1.scheduleTags.count()).toBe(0);
          expect(post2.scheduleTags.count()).toBe(0);
          expect(post3.scheduleTags.count()).toBe(0);
        });
      });
    };

    runTests(navigateToPostsPage, navigateToSiteFromPostsPage);
    runTests(navigateToLandingPage, navigateToSiteFromLandingPage);
  });
})();
