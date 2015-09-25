(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var SidebarPage = require('../pages/sidebar.page.js');
  var PostPage = require('../pages/post.page.js');
  var CreatorLandingPagePage = require('../pages/creators/creator-landing-page.page.js');
  var PaymentInformationPage = require('../pages/payment-information.page.js');
  var CommentsAndLikesPage = require('../pages/comments-and-likes.page.js');

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var post = new PostPage();
  var landingPage = new CreatorLandingPagePage();
  var paymentInformationPage = new PaymentInformationPage();
  var commentsAndLikesPage = new CommentsAndLikesPage();

  describe('comments and likes', function() {

    var navigateToLatestPosts = function () {
      sidebar.latestPostsLink.click();
    };

    var navigateToCreatorLandingPage = function (creator) {
      commonWorkflows.getPage('/' + creator.username);
    };

    var navigateFromCreatorLandingPage = function () {
      testKit.scrollIntoView(landingPage.fifthweekLink);
      landingPage.fifthweekLink.click();
      sidebar.subscriptionsLink.click();
    };

    var addCreditToUserAccount = function(userRegistration){

      var context = commonWorkflows.createBlog();
      var tempCreatorRegistration = context.registration;

      commonWorkflows.reSignIn(userRegistration);
      navigateToCreatorLandingPage(tempCreatorRegistration);
      landingPage.subscribeButton.click();

      paymentInformationPage.completeSuccessfully();

      landingPage.manageSubscriptionButton.click();
      landingPage.unsubscribeButton.click();
      navigateFromCreatorLandingPage();
    };

    describe('when testing posts', function(){
      var blog;
      var creatorRegistration1;
      var userRegistration;

      var notePost1;
      var notePost2;

      it('should register as a user', function() {
        userRegistration = commonWorkflows.registerAsCreator();
        addCreditToUserAccount(userRegistration);
      });

      it('should register as a creator', function() {
        var context = commonWorkflows.createBlog();
        blog = context.blog;
        creatorRegistration1 = context.registration;
      });

      it('should post a note', function(){
        notePost1 = commonWorkflows.postNoteNow();
        notePost2 = commonWorkflows.postNoteNow();
      });

      describe('when testing likes and comments as creator', function(){
        var navigateToLandingPagePosts = function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.subscribeButton.click();
        };

        it('should like and unlike posts', function(){
          navigateToLandingPagePosts();
          post.postIndex = 0;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 0;
          post.likePostLink.click();

          expect(post.likesLink.getText()).toBe('1');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 0;
          post.unlikePostLink.click();
          post.postIndex = 1;
          post.likePostLink.click();

          post.postIndex = 0;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('1');
          expect(post.commentsLink.getText()).toBe('0');
        });

        it('should comment on posts', function(){
          post.postIndex = 0;
          post.commentOnPostLink.click();

          expect(commentsAndLikesPage.allComments.count()).toBe(0);

          expect(commentsAndLikesPage.helpMessages.count()).toBe(0);
          commentsAndLikesPage.addCommentButton.click();
          expect(commentsAndLikesPage.helpMessages.count()).toBe(1);

          var comment = commentsAndLikesPage.postComment();
          expect(commentsAndLikesPage.helpMessages.count()).toBe(0);

          expect(commentsAndLikesPage.commentTextBox.getAttribute('value')).toBe('');
          expect(commentsAndLikesPage.allComments.count()).toBe(1);

          expect(commentsAndLikesPage.commentNumber.getText()).toBe('1');
          expect(commentsAndLikesPage.commentUsername.getText()).toBe(creatorRegistration1.username);
          expect(commentsAndLikesPage.commentContent.getText()).toBe(comment.content);

          commentsAndLikesPage.crossButton.click();
          expect(commentsAndLikesPage.allComments.count()).toBe(0); // Check it closed.

          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('1');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('1');
          expect(post.commentsLink.getText()).toBe('0');
        });
      });

      describe('when testing posts as user', function(){
        var navigateToLandingPagePosts = function(){
          navigateToCreatorLandingPage(creatorRegistration1);
        };

        it('should sign in as user and subscribe', function(){
          commonWorkflows.reSignIn(userRegistration);
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.subscribeButton.click();
        });

        it('should like posts on landing page and read now page', function(){
          post.postIndex = 0;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('1');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('1');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 0;
          post.likePostLink.click();

          expect(post.likesLink.getText()).toBe('1');
          expect(post.commentsLink.getText()).toBe('1');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('1');
          expect(post.commentsLink.getText()).toBe('0');

          post.postIndex = 0;
          post.unlikePostLink.click();
          post.postIndex = 1;
          post.likePostLink.click();

          post.postIndex = 0;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('1');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('2');
          expect(post.commentsLink.getText()).toBe('0');

          navigateFromCreatorLandingPage();
          navigateToLatestPosts();

          post.postIndex = 0;
          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('1');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('2');
          expect(post.commentsLink.getText()).toBe('0');
        });

        it('should comment on posts', function(){
          post.postIndex = 0;
          post.commentOnPostLink.click();

          expect(commentsAndLikesPage.allComments.count()).toBe(1);

          var comment = commentsAndLikesPage.postComment();

          expect(commentsAndLikesPage.commentTextBox.getAttribute('value')).toBe('');
          expect(commentsAndLikesPage.allComments.count()).toBe(2);

          expect(commentsAndLikesPage.commentNumber.getText()).toBe('2');
          expect(commentsAndLikesPage.commentUsername.getText()).toBe(userRegistration.username);
          expect(commentsAndLikesPage.commentContent.getText()).toBe(comment.content);

          commentsAndLikesPage.commentIndex = 1;
          expect(commentsAndLikesPage.commentNumber.getText()).toBe('1');
          expect(commentsAndLikesPage.commentUsername.getText()).toBe(creatorRegistration1.username);

          commentsAndLikesPage.crossButton.click();
          expect(commentsAndLikesPage.allComments.count()).toBe(0); // Check it closed.

          expect(post.likesLink.getText()).toBe('0');
          expect(post.commentsLink.getText()).toBe('2');

          post.postIndex = 1;
          expect(post.likesLink.getText()).toBe('2');
          expect(post.commentsLink.getText()).toBe('0');
        });
      });
    });
  });
})();
