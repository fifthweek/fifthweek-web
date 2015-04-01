(function(){
  'use strict';

  var TestKit = require('../../test-kit.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var HeaderBacklogPage = require('../../pages/header-backlog.page.js');
  var PostPage = require('../../pages/post.page.js');
  var DeleteConfirmationPage = require('../../pages/delete-confirmation.page.js');
  var EditPostDialogPage = require('../../pages/creators/edit-post-dialog.page.js');

  describe('creator-backlog form', function() {

    var collectionName = 'Cats';
    var filePath = '../../../sample-image-tiny.jpg';
    var filePathTiff = '../../../sample-image-tiny.tif';

    var registration;
    var subscription;

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var header = new HeaderBacklogPage();
    var post = new PostPage(true);
    var deleteConfirmationPage = new DeleteConfirmationPage();
    var editPostDialogPage = new EditPostDialogPage();

    var navigateToPage = function() {
      sidebar.backlogLink.click();
      header.futurePostsLink.click();
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
      });

      it('should not show the post after posting a file now', function () {
        commonWorkflows.postFileNow(filePath, collectionName);
        navigateToPage();
        expect(post.allPosts.count()).toBe(1);
      });

      it('should show the post after posting a file on a date', function () {
        commonWorkflows.postFileOnDate(filePath, collectionName);
        navigateToPage();
        expect(post.allPosts.count()).toBe(2);
      });

      it('should show the post after posting a file to the queue', function () {
        commonWorkflows.postFileToQueue(filePath, collectionName);
        navigateToPage();
        expect(post.allPosts.count()).toBe(3);
      });

      it('should not show the post after posting a image now', function () {
        commonWorkflows.postImageNow(filePath, collectionName);
        navigateToPage();
        expect(post.allPosts.count()).toBe(3);
      });

      it('should show the post after posting a image on a date', function () {
        commonWorkflows.postImageOnDate(filePath, collectionName);
        navigateToPage();
        expect(post.allPosts.count()).toBe(4);
      });

      it('should show the post after posting a image to the queue', function () {
        commonWorkflows.postImageToQueue(filePath, collectionName);
        navigateToPage();
        expect(post.allPosts.count()).toBe(5);
      });
    });

    var testDeletion = function(){
      deleteConfirmationPage.describeDeletingWithoutVerification(
        'Post',
        function () {
          commonWorkflows.fastRefresh();
          post.moreActionsButton.click();
          testKit.scrollIntoView(post.moreActionsButton);
          post.moreActionsButton.click();
          testKit.waitForElementToDisplay(post.deletePostLink);
          testKit.scrollIntoView(post.deletePostLink);
          post.deletePostLink.click();
        },
        function () {
          // Check not deleted from page model.
          expect(post.allPosts.count()).toBe(1);

          // Check not deleted from API.
          commonWorkflows.fastRefresh();
          expect(post.allPosts.count()).toBe(1);
        },
        function () {
          // Check deleted from page model.
          expect(post.allPosts.count()).toBe(0);

          // Check deleted from API.
          commonWorkflows.fastRefresh();
          expect(post.allPosts.count()).toBe(0);
        }
      );
    };

    var displayEditModal = function (targetPost) {
      targetPost = targetPost || post;
      commonWorkflows.fastRefresh();
      testKit.scrollIntoView(targetPost.moreActionsButton);
      targetPost.moreActionsButton.click();
      testKit.waitForElementToDisplay(post.editPostLink);
      testKit.scrollIntoView(targetPost.editPostLink);
      targetPost.editPostLink.click();
      testKit.waitForElementToDisplay(editPostDialogPage.expandButton);
    };

    var refresh = function () {
      commonWorkflows.fastRefresh();
    };

    var testEditingContent = function(inputData){
      editPostDialogPage.describeEditingPostContent(
        true,
        inputData,
        navigateToPage,
        displayEditModal,
        refresh);
    };

    var testEditToLive = function(inputData){
      editPostDialogPage.describeEditingPostToLive(
        true,
        inputData,
        navigateToPage,
        displayEditModal,
        refresh);
    };

    var testEditToPastDate = function(inputData){
      editPostDialogPage.describeEditingPostToPastDate(
        false,
        inputData,
        navigateToPage,
        displayEditModal,
        refresh,
        6);
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

      it('should show the post after posting a note on a date', function () {
        var postData = inputData.postData = commonWorkflows.postNoteOnDate();
        navigateToPage();
        post.expectNotePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a file on a date', function () {
        var postData = inputData.postData = commonWorkflows.postFileOnDate(filePath, collectionName);
        navigateToPage();
        post.expectFilePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a file to the queue', function () {
        var postData = inputData.postData = commonWorkflows.postFileToQueue(filePath, collectionName);
        navigateToPage();
        post.expectFilePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a image on a date', function () {
        var postData = inputData.postData = commonWorkflows.postImageOnDate(filePath, collectionName);
        navigateToPage();
        post.expectImagePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a image to the queue', function () {
        var postData = inputData.postData = commonWorkflows.postImageToQueue(filePath, collectionName);
        navigateToPage();
        post.expectImagePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testDeletion();

      it('should show the post after posting a TIFF image on a date', function () {
        var postData = inputData.postData = commonWorkflows.postImageOnDate(filePathTiff, collectionName);
        navigateToPage();
        post.expectNonViewableImagePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testEditToLive();

      it('should show the post after posting a TIFF image to the queue', function () {
        var postData = inputData.postData = commonWorkflows.postImageToQueue(filePathTiff, collectionName);
        navigateToPage();
        post.expectNonViewableImagePost(postData, registration, navigateToPage);
      });

      testEditingContent(inputData);
      testEditToPastDate();
    });

    describe('when reordering posts', function(){
      it('should re-order correctly', function() {
        var context = commonWorkflows.createSubscription();
        registration = context.registration;
        subscription = context.subscription;

        commonWorkflows.createNamedCollection(undefined, collectionName);

        var post1 = new PostPage(false, 0);
        var post2 = new PostPage(false, 1);
        var post3 = new PostPage(false, 2);

        commonWorkflows.postNoteOnDate();
        commonWorkflows.fastRefresh();
        commonWorkflows.postNoteOnDate();
        commonWorkflows.fastRefresh();
        commonWorkflows.postNoteOnDate();
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
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);
        refresh();
        expect(post1.comment.getText()).toBe('One');
        expect(post2.comment.getText()).toBe('Two');
        expect(post3.comment.getText()).toBe('Three');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);

        displayEditModal(post1);
        editPostDialogPage.editPostDate(3);

        expect(post1.comment.getText()).toBe('Two');
        expect(post2.comment.getText()).toBe('Three');
        expect(post3.comment.getText()).toBe('One');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);
        refresh();
        expect(post1.comment.getText()).toBe('Two');
        expect(post2.comment.getText()).toBe('Three');
        expect(post3.comment.getText()).toBe('One');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);

        displayEditModal(post2);
        editPostDialogPage.editPostDate(2);

        expect(post1.comment.getText()).toBe('Two');
        expect(post2.comment.getText()).toBe('Three');
        expect(post3.comment.getText()).toBe('One');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);
        refresh();
        expect(post1.comment.getText()).toBe('Two');
        expect(post2.comment.getText()).toBe('Three');
        expect(post3.comment.getText()).toBe('One');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);

        displayEditModal(post3);
        editPostDialogPage.editPostDate(-2);

        expect(post1.comment.getText()).toBe('Two');
        expect(post2.comment.getText()).toBe('One');
        expect(post3.comment.getText()).toBe('Three');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);
        refresh();
        expect(post1.comment.getText()).toBe('Two');
        expect(post2.comment.getText()).toBe('One');
        expect(post3.comment.getText()).toBe('Three');
        expect(post1.dayGroupings.count()).toBe(0);
        expect(post2.dayGroupings.count()).toBe(0);
        expect(post3.dayGroupings.count()).toBe(0);
        expect(post1.scheduleTags.count()).toBe(1);
        expect(post2.scheduleTags.count()).toBe(1);
        expect(post3.scheduleTags.count()).toBe(1);
      });
    });
  });
})();
