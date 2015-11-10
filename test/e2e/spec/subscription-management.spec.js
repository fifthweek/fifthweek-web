(function(){
  'use strict';

  var _ = require('lodash');
  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var SidebarPage = require('../pages/sidebar.page.js');
  var HeaderPage = require('../pages/header-subscriptions.page.js');
  var GuestListPage = require('../pages/creators/guest-list.page.js');
  var PostPage = require('../pages/post.page.js');
  var CreatorLandingPagePage = require('../pages/creators/creator-landing-page.page.js');
  var SignInWorkflowPage = require('../pages/sign-in-workflow.page.js');
  var PostListInformationPage = require('../pages/post-list-information.page.js');
  var PaymentInformationPage = require('../pages/payment-information.page.js');

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var guestListPage = new GuestListPage();
  var post = new PostPage();
  var landingPage = new CreatorLandingPagePage();
  var signInWorkflow = new SignInWorkflowPage();
  var postListInformation = new PostListInformationPage();
  var paymentInformationPage = new PaymentInformationPage();

  describe('subscription management', function() {

    var navigateToLatestPosts = function () {
      sidebar.latestPostsLink.click();
    };

    var navigateToCreatorLandingPage = function (creator) {
      commonWorkflows.getPage('/' + creator.username);
    };

    var navigateFromCreatorLandingPage = function () {
      sidebar.subscriptionsLink.click();
    };

    var expectLatestPostCount = function(count){
      browser.waitForAngular();
      expect(sidebar.latestPostsLink.isDisplayed()).toBe(true);
      expect(post.allPosts.count()).toBe(count);
    };

    var expectLandingPagePostCount = function(count){
      browser.waitForAngular();
      expect(post.allPosts.count()).toBe(count);
    };

    var expectLandingPageSubscribedPostCount = function(count){
      browser.waitForAngular();
      landingPage.showSubscribedPostsButton.click();
      expect(post.allPosts.count()).toBe(count);
    };

    var expectLandingPageChannelCount = function(hasFreeAccess, count, prices){
      browser.waitForAngular();
      var totalPrice;
      if(hasFreeAccess){
        totalPrice = 'This profile is currently free as you are on the guest list.';
      }
      else{
        totalPrice = 'Total price is $' +  _.sum(prices).toFixed(2) + '/week.';
      }
      if(count === 1){
        expect(landingPage.channelCountInformation.getText()).toBe('Subscribed to ' + count + ' channel. ' + totalPrice);
      }
      else{
        expect(landingPage.channelCountInformation.getText()).toBe('Subscribed to ' + count + ' channels. ' + totalPrice);
      }
    };

    var addCreditToUserAccount = function(userRegistration){

      var context = commonWorkflows.createBlog();
      var tempCreatorRegistration = context.registration;

      commonWorkflows.reSignIn(userRegistration);
      navigateToCreatorLandingPage(tempCreatorRegistration);
      landingPage.getSubscribeButton(0).click();

      paymentInformationPage.completeSuccessfully();

      landingPage.getUnsubscribeButton(0).click();
      navigateFromCreatorLandingPage();
    };

    describe('when testing subscription buttons', function(){

      var blog;
      var creatorRegistration1;
      var userRegistration;

      it('should register as a user', function() {
        userRegistration = commonWorkflows.registerAsCreator();
        addCreditToUserAccount(userRegistration);
      });

      it('should register as a creator', function() {
        var context = commonWorkflows.createBlog();
        blog = context.blog;
        creatorRegistration1 = context.registration;
        commonWorkflows.postNoteNow();
        sidebar.viewProfileLink.click();
      });

      describe('when creator', function(){

        describe('subscribing', function(){
          afterEach(function() {
            expect(landingPage.getSubscribeButton(0).isPresent()).toBe(true);
          });

          it('should not be possible via the "subscribe" button', function() {
            landingPage.getSubscribeButton(0).click();
          });
        });
      });

      describe('when not on guest list', function(){
        afterEach(function() {
        });

        describe('subscribing as signed-in user not on guest-list', function(){
          afterEach(function(){
            testKit.waitForElementToDisplay(landingPage.getSubscribeButton(0));
          });

          it('should be possible via the "subscribe" button', function(){
            commonWorkflows.reSignIn(userRegistration);
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.getSubscribeButton(0).click();
            landingPage.getUnsubscribeButton(0).click();
          });

          it('should be possible via a post dialog', function() {
            post.openPostLink.click();
            landingPage.getPostSubscribeButton(0).click();
            post.crossButton.click();
            landingPage.getUnsubscribeButton(0).click();
          });

          it('should be possible via an embedded post', function() {
            post.openPostLink.click();
            post.sharePostLink.click();
            landingPage.getPostSubscribeButton(0).click();
            post.morePostsLink.click();
            landingPage.getUnsubscribeButton(0).click();
          });
        });

        describe('subscribing as signed-out user not on guest-list', function(){
          beforeEach(function(){
            commonWorkflows.signOut();
            commonWorkflows.getPage('/' + creatorRegistration1.username);
          });

          afterEach(function(){
            signInWorkflow.expectRegisterDisplayed();
            signInWorkflow.signInSuccessfully(userRegistration);
          });

          it('should be possible via the "subscribe" button', function(){
            landingPage.getSubscribeButton(0).click();
          });

          it('should be possible via a post dialog', function() {
            post.openPostLink.click();
            landingPage.getPostSubscribeButton(0).click();
          });

          it('should be possible via an embedded post', function() {
            post.openPostLink.click();
            post.sharePostLink.click();
            landingPage.getPostSubscribeButton(0).click();
          });
        });

        describe('it should unsubscribe', function(){

          it('should be possible via an embedded post', function() {
            commonWorkflows.reSignIn(userRegistration);
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.getUnsubscribeButton(0).click();
            testKit.waitForElementToDisplay(landingPage.getSubscribeButton(0));
          });
        });

        describe('subscribing as new user not on guest-list', function(){
          beforeEach(function(){
            commonWorkflows.signOut();
            commonWorkflows.getPage('/' + creatorRegistration1.username);
          });

          afterEach(function(){
            signInWorkflow.expectRegisterDisplayed();
            signInWorkflow.registerSuccessfully();
          });

          it('should be possible via the "subscribe" button', function(){
            landingPage.getSubscribeButton(0).click();
          });

          it('should be possible via a post dialog', function() {
            post.openPostLink.click();
            landingPage.getPostSubscribeButton(0).click();
          });

          it('should be possible via an embedded post', function() {
            post.openPostLink.click();
            post.sharePostLink.click();
            landingPage.getPostSubscribeButton(0).click();
          });
        });
      });

      describe('when on guest list', function(){
        var userRegistration2;
        var userRegistration3;
        var userRegistration4;
        it('should run once before all', function(){
          userRegistration2 = signInWorkflow.newRegistrationData();
          userRegistration3 = signInWorkflow.newRegistrationData();
          userRegistration4 = signInWorkflow.newRegistrationData();

          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email, userRegistration2.email, userRegistration3.email, userRegistration4.email]);
        });

        describe('when subscribing on guest list', function(){
          afterEach(function() {
          });

          describe('subscribing as signed-in user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.reSignIn(userRegistration);
              commonWorkflows.getPage('/' + creatorRegistration1.username);
            });

            afterEach(function(){
            });

            it('should be possible via the "subscribe" button', function(){
              expect(post.tag.getText()).toBe('Guest List');
              landingPage.getSubscribeButton(0).click();
              landingPage.getUnsubscribeButton(0).click();
            });

            it('should not be possible via a post dialog', function() {
              post.openPostLink.click();
              expect(landingPage.getPostSubscribeButtonCount(0)).toBe(0);
              post.crossButton.click();
            });

            it('should not be possible via an embedded post', function() {
              post.openPostLink.click();
              post.sharePostLink.click();
              expect(landingPage.getPostSubscribeButtonCount(0)).toBe(0);
              post.morePostsLink.click();
            });
          });

          describe('subscribing as signed-out user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.signOut();
              commonWorkflows.getPage('/' + creatorRegistration1.username);
            });

            afterEach(function(){
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.signInSuccessfully(userRegistration);
            });

            it('should be possible via the "subscribe" button', function(){
              landingPage.getSubscribeButton(0).click();
            });

            it('should be possible via a post dialog', function() {
              post.openPostLink.click();
              landingPage.getPostSubscribeButton(0).click();
            });

            it('should be possible via an embedded post', function() {
              post.openPostLink.click();
              post.sharePostLink.click();
              landingPage.getPostSubscribeButton(0).click();
            });
          });

          describe('subscribing as new user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.signOut();
              commonWorkflows.getPage('/' + creatorRegistration1.username);
            });

            afterEach(function(){
            });

            it('should be possible via the "subscribe" button', function(){
              landingPage.getSubscribeButton(0).click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration2);
            });

            it('should be possible via a post dialog', function() {
              post.openPostLink.click();
              landingPage.getPostSubscribeButton(0).click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration3);
            });

            it('should be possible via an embedded post', function() {
              post.openPostLink.click();
              post.sharePostLink.click();
              landingPage.getPostSubscribeButton(0).click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration4);
            });
          });
        });
      });
    });

    describe('when testing posts', function(){
      var blog;
      var creatorRegistration1;
      var userRegistration;

      var notePost;
      var filePost;
      var imagePost;
      var nonViewableImagePost;

      var filePath = '../../../sample-image-tiny.jpg';
      var filePathTiff = '../../../sample-image-tiny.tif';

      it('should register as a user', function() {
        userRegistration = commonWorkflows.registerAsCreator();
        addCreditToUserAccount(userRegistration);
      });

      it('should register as a creator', function() {
        var context = commonWorkflows.createBlog();
        blog = context.blog;
        creatorRegistration1 = context.registration;
      });

      it('should post each type of post', function(){
        nonViewableImagePost = commonWorkflows.postImageAndFileNow(filePathTiff, filePath);
        imagePost = commonWorkflows.postImageNow(filePath);
        filePost = commonWorkflows.postFileNow(filePath);
        notePost = commonWorkflows.postNoteNow();
      });

      describe('when testing posts as creator', function(){
        var navigateToLandingPagePosts = function(){
          navigateToCreatorLandingPage(creatorRegistration1);
        };

        it('should display posts on landing page', function(){
          navigateToLandingPagePosts();
          post.postIndex = 0;
          post.expectPost(blog, notePost, creatorRegistration1, navigateToLandingPagePosts, false, post.ownerTag);
          post.postIndex = 1;
          post.expectPost(blog, filePost, creatorRegistration1, navigateToLandingPagePosts, false, post.ownerTag);
          post.postIndex = 2;
          post.expectPost(blog, imagePost, creatorRegistration1, navigateToLandingPagePosts, false, post.ownerTag);
          post.postIndex = 3;
          post.expectPost(blog, nonViewableImagePost, creatorRegistration1, navigateToLandingPagePosts, false, post.ownerTag);
        });
      });

      describe('when testing posts as user', function(){
        var navigateToLandingPagePosts = function(){
          navigateToCreatorLandingPage(creatorRegistration1);
        };

        it('should sign in as user and register', function(){
          commonWorkflows.reSignIn(userRegistration);
          navigateToCreatorLandingPage(creatorRegistration1);
        });

        it('should display posts on landing page', function(){
          post.postIndex = 0;
          post.expectPost(blog, notePost, creatorRegistration1, navigateToLandingPagePosts, true, post.previewTag);
          post.postIndex = 1;
          post.expectPost(blog, filePost, creatorRegistration1, navigateToLandingPagePosts, true, post.previewTag);
          post.postIndex = 2;
          post.expectPost(blog, imagePost, creatorRegistration1, navigateToLandingPagePosts, true, post.previewTag);
          post.postIndex = 3;
          post.expectPost(blog, nonViewableImagePost, creatorRegistration1, navigateToLandingPagePosts, true, post.previewTag);
        });

        it('should subscribe to creator', function(){
          landingPage.getSubscribeButton(0).click();
        });

        it('should display posts on landing page', function(){
          post.postIndex = 0;
          post.expectPost(blog, notePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
          post.postIndex = 1;
          post.expectPost(blog, filePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
          post.postIndex = 2;
          post.expectPost(blog, imagePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
          post.postIndex = 3;
          post.expectPost(blog, nonViewableImagePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
        });

        it('should display posts on landing page subscribed posts', function(){
          landingPage.showSubscribedPostsButton.click();
          post.postIndex = 0;
          post.expectPost(blog, notePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
          post.postIndex = 1;
          post.expectPost(blog, filePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
          post.postIndex = 2;
          post.expectPost(blog, imagePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
          post.postIndex = 3;
          post.expectPost(blog, nonViewableImagePost, creatorRegistration1, navigateToLandingPagePosts, true, post.subscribedTag);
        });

        it('should display posts on read now page', function(){
          navigateFromCreatorLandingPage();
          navigateToLatestPosts();
          post.postIndex = 0;
          post.expectPost(blog, notePost, creatorRegistration1, navigateToLatestPosts, true, post.subscribedTag);
          post.postIndex = 1;
          post.expectPost(blog, filePost, creatorRegistration1, navigateToLatestPosts, true, post.subscribedTag);
          post.postIndex = 2;
          post.expectPost(blog, imagePost, creatorRegistration1, navigateToLatestPosts, true, post.subscribedTag);
          post.postIndex = 3;
          post.expectPost(blog, nonViewableImagePost, creatorRegistration1, navigateToLatestPosts, true, post.subscribedTag);
        });
      });
    });

    describe('when testing subscribing', function(){
      var blog;
      var creatorRegistration1;
      var creatorRegistration2;
      var userRegistration;

      var testSubscribingToChannels = function(hasFreeAccess){

        describe('when the creator has not posted', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should not contain any posts', function() {
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.getSubscribeButton(0).click();
            expectLandingPagePostCount(0);
            expectLandingPageSubscribedPostCount(0);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should not contain any posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(0);
          });
        });

        describe('when the creator has posted to backlog', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(creatorRegistration1);
            commonWorkflows.postNoteOnDate();
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should not contain any posts', function() {
            navigateToCreatorLandingPage(creatorRegistration1);
            expectLandingPagePostCount(0);
            expectLandingPageSubscribedPostCount(0);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should not contain any posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(0);
          });
        });

        var channel2;

        describe('when the creator has posted to an unsubscribed channel', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(creatorRegistration1);
            channel2 = commonWorkflows.createChannel({ hiddenCheckbox: false, nameTextBox: 'ZZZ' });
            commonWorkflows.postNoteNow(1);
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should not contain any posts', function() {
            navigateToCreatorLandingPage(creatorRegistration1);
            expectLandingPagePostCount(1);
            expectLandingPageSubscribedPostCount(0);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('landing page should contain two channels', function(){
            expect(landingPage.channelCount).toBe(2);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should not contain any posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(0);
          });
        });

        describe('when the creator has posted to the subscribed channel', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(creatorRegistration1);
            commonWorkflows.postNoteNow(0);
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should contain the post', function() {
            navigateToCreatorLandingPage(creatorRegistration1);
            expectLandingPagePostCount(2);
            expectLandingPageSubscribedPostCount(1);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('landing page should contain two channels', function(){
            expect(landingPage.channelCount).toBe(2);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should contain the post', function() {
            navigateToLatestPosts();
            expectLatestPostCount(1);
          });
        });

        var blog2;

        it('should create a new blog for creator2', function(){
          var createBlogResult = commonWorkflows.createBlog();
          creatorRegistration2 = createBlogResult.registration;
          blog2 = createBlogResult.blog;
        });

        if(hasFreeAccess){
          it('should add the user to the guest list of creator2', function() {
            sidebar.guestListLink.click();
            guestListPage.setNewGuestList([userRegistration.email]);
          });
        }

        describe('when the creator 2 has not posted', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should contain no posts', function() {
            navigateToCreatorLandingPage(creatorRegistration2);
            landingPage.getSubscribeButton(0).click();
            expectLandingPagePostCount(0);
            expectLandingPageSubscribedPostCount(0);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog2.basePrice]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should still contain one post', function() {
            navigateToLatestPosts();
            expectLatestPostCount(1);
          });
        });

        describe('when the creator 2 has posted to the subscribed channel', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(creatorRegistration2);
            commonWorkflows.postNoteNow();
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should contain the post', function() {
            navigateToCreatorLandingPage(creatorRegistration2);
            expectLandingPagePostCount(1);
            expectLandingPageSubscribedPostCount(1);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog2.basePrice]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should contain two posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(2);
          });
        });

        describe('when the user subscribes to channel2', function(){
          it('should subscribe to the selected channels', function(){
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.getSubscribeButton(1).click();
          });

          it('landing page should contain two posts', function() {
            expectLandingPagePostCount(2);
            expectLandingPageSubscribedPostCount(2);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 2, [blog.basePrice, channel2.price]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should contain three posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(3);
          });
        });

        describe('when the user unsubscribes from channel2', function(){
          it('should unsubscribe from channel2', function(){
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.getUnsubscribeButton(1).click();
          });

          it('landing page should only contain one post', function() {
            expectLandingPagePostCount(2);
            expectLandingPageSubscribedPostCount(1);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should only contain two posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(2);
          });
        });

        describe('when the user unsubscribes from creator 1', function(){
          it('should unsubscribe from creator 1', function(){
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.getUnsubscribeButton(0).click();
          });

          it('landing page should contain no posts', function() {
            expectLandingPagePostCount(2);
            expectLandingPageSubscribedPostCount(0);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should only contain one post', function() {
            navigateToLatestPosts();
            expectLatestPostCount(1);
          });
        });
      };

      describe('when testing subscribing while on the guest list', function(){
        it('latest posts should not contain any posts when the user is not subscribed to any creators', function() {
          userRegistration = commonWorkflows.registerAsCreator();
          navigateToLatestPosts();
          expectLatestPostCount(0);
        });

        it('should register as a creator', function() {
          var context = commonWorkflows.createBlog();
          blog = context.blog;
          creatorRegistration1 = context.registration;
          sidebar.viewProfileLink.click();
        });

        it('should add the user to the guest list', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email]);
        });

        testSubscribingToChannels(true);
      });

      describe('when testing subscribing while not on the guest list', function(){
        it('latest posts should not contain any posts when the user is not subscribed to any creators', function() {
          userRegistration = commonWorkflows.registerAsCreator();
          addCreditToUserAccount(userRegistration);
          navigateToLatestPosts();
          expectLatestPostCount(0);
        });

        it('should register as a creator', function() {
          var context = commonWorkflows.createBlog();
          blog = context.blog;
          creatorRegistration1 = context.registration;
          sidebar.viewProfileLink.click();
        });

        testSubscribingToChannels(false);
      });
    });

    describe('testing price changes', function(){
      var blog1;
      var blog2;
      var creatorRegistration1;
      var creatorRegistration2;
      var userRegistration;

      var creator1Channel2;

      it('should register as a user', function() {
        userRegistration = commonWorkflows.registerAsConsumer();
        addCreditToUserAccount(userRegistration);
      });

      it('should register as a creator 1', function() {
        var context = commonWorkflows.createBlog();
        blog1 = context.blog;
        creatorRegistration1 = context.registration;
      });

      it('should create a new channel', function(){
        creator1Channel2 = commonWorkflows.createChannel({ hiddenCheckbox: false, nameTextBox: 'ZZZ' });
      });

      it('should register as a creator 2', function() {
        var context = commonWorkflows.createBlog();
        blog2 = context.blog;
        creatorRegistration2 = context.registration;
      });

      it('should post a note in each channel', function(){
        commonWorkflows.postNoteNow();
        commonWorkflows.reSignIn(creatorRegistration1);
        commonWorkflows.postNoteNow(1);
        commonWorkflows.postNoteNow(0);
      });

      it('should subscribe to all channels', function(){
        commonWorkflows.reSignIn(userRegistration);
        navigateToCreatorLandingPage(creatorRegistration1);
        landingPage.getSubscribeButton(0).click();
        landingPage.getSubscribeButton(1).click();
        expectLandingPageSubscribedPostCount(2);
        post.expectTag(post.subscribedTag, 0);
        post.expectTag(post.subscribedTag, 1);

        navigateToCreatorLandingPage(creatorRegistration2);
        landingPage.getSubscribeButton(0).click();
        expectLandingPageSubscribedPostCount(1);
        post.expectTag(post.subscribedTag, 0);

        navigateFromCreatorLandingPage();

        navigateToLatestPosts();
        expectLatestPostCount(3);
        post.expectTag(post.subscribedTag, 0);
        post.expectTag(post.subscribedTag, 1);
        post.expectTag(post.subscribedTag, 2);
      });

      describe('when price increases', function(){
        it('should increase the price of the base channel', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.00', blog1.name);
        });

        it('should display preview posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);

          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          expectLandingPageSubscribedPostCount(2);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);

          navigateToCreatorLandingPage(creatorRegistration2);
          post.expectTag(post.subscribedTag, 0);
          expectLandingPageSubscribedPostCount(1);
          post.expectTag(post.subscribedTag, 0);

          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, blog1.basePrice, 15);
        });

        it('should display information on the landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration1);

          expect(landingPage.getAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceIncrease(0, blog1.basePrice, 15);

          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, blog1.basePrice, 15);
        });

        it('should not display a notification on creator 2 landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          postListInformation.getAcceptButton(0).click();
          expectLandingPagePostCount(2);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on landing page manage view 1', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.10', blog1.name);
          commonWorkflows.reSignIn(userRegistration);

          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, 15, 15.1);

          landingPage.expectPriceIncrease(0, 15, 15.1);
          landingPage.getAcceptButton(0).click();

          expectLandingPagePostCount(2);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on landing page manage view from read now view', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.20', blog1.name);
          commonWorkflows.reSignIn(userRegistration);

          expectLatestPostCount(3);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, 15.1, 15.2);

          postListInformation.getManageButton(0).click();
          landingPage.expectPriceIncrease(0, 15.1, 15.2);
          landingPage.getAcceptButton(0).click();

          expectLandingPagePostCount(2);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);

          landingPage.cancelChangesButton.click();
          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on read now page', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.30', blog1.name);
          commonWorkflows.reSignIn(userRegistration);

          expectLatestPostCount(3);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, 15.2, 15.3);

          postListInformation.getAcceptButton(0).click();

          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on post dialog page', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.40', blog1.name);
          commonWorkflows.reSignIn(userRegistration);

          expectLatestPostCount(3);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, 15.3, 15.4);

          post.openPostLink.click();
          landingPage.getPostAcceptButton(0).click();
          expect(landingPage.getPostAcceptButtonCount(0)).toBe(0);
          post.crossButton.click();

          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on embedded post page', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.50', blog1.name);
          commonWorkflows.reSignIn(userRegistration);

          expectLatestPostCount(3);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, 15.4, 15.5);

          post.openPostLink.click();
          post.sharePostLink.click();
          landingPage.getPostAcceptButton(0).click();
          expect(landingPage.getPostAcceptButtonCount(0)).toBe(0);
          navigateFromCreatorLandingPage();
          navigateToLatestPosts();

          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

      });

      describe('when price decreases', function(){
        it('should decrease the price of the base channel', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.20', blog1.name);
        });

        it('should continue to display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          post.expectTag(post.subscribedTag, 0);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceDecrease(0, 15.5, 15.2);
        });

        it('should display information on the landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);

          expect(landingPage.getAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceDecrease(0, 15.5, 15.2);

          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceDecrease(0, 15.5, 15.2);
        });

        it('should not display a notification on creator 2 landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the post dialog', function(){
          navigateToLatestPosts();

          post.openPostLink.click();

          expect(landingPage.getPostAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceDecrease(0, 15.5, 15.2);
          post.crossButton.click();
        });

        it('should display information on the embedded post view', function(){
          navigateToLatestPosts();

          post.openPostLink.click();
          post.sharePostLink.click();

          expect(landingPage.getPostAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceDecrease(0, 15.5, 15.2);
        });

        it('should continue to display all posts when price is accepted on landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          postListInformation.getAcceptButton(0).click();
          expectLandingPagePostCount(2);
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateFromCreatorLandingPage();
          navigateToLatestPosts();
          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });
      });

      describe('when added to guest list', function(){

        it('creator 1 should add the user to the guest list', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email]);
        });

        it('should continue to display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          post.expectTag(post.subscribedTag, 0);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectChannelPriceDecrease(0, 15.2, 0);
          postListInformation.expectChannelPriceDecrease(1, creator1Channel2.price, 0);
        });

        it('should display a notification on the landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration1);

          landingPage.expectPriceDecrease(0, 15.2, 0);
          landingPage.expectPriceDecrease(1, creator1Channel2.price, 0);

          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectChannelPriceDecrease(0, 15.2, 0);
          postListInformation.expectChannelPriceDecrease(1, creator1Channel2.price, 0);
        });

        it('should not display a notification on creator 2 landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the post dialog', function(){
          navigateToLatestPosts();

          post.openPostLink.click();
          expect(landingPage.getPostAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceDecrease(0, 15.2, 0);
          post.crossButton.click();
        });

        it('should display information on the embedded post view', function(){
          navigateToLatestPosts();

          post.openPostLink.click();
          post.sharePostLink.click();

          expect(landingPage.getPostAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceDecrease(0, 15.2, 0);
        });

        it('should continue to display all posts when prices are accepted on landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expect(landingPage.getAcceptButtonCount(0)).toBe(1);
          expect(landingPage.getAcceptButtonCount(1)).toBe(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.getAcceptButton(0).click();
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(landingPage.getAcceptButtonCount(1)).toBe(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.getAcceptButton(0).click();
          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(landingPage.getAcceptButtonCount(1)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
          expectLandingPagePostCount(2);

          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateFromCreatorLandingPage();
          navigateToLatestPosts();
          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

      });

      describe('when removed from guest list', function(){

        it('creator 1 should remove the user to the guest list', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.guestListLink.click();
          guestListPage.updateGuestList([]);
        });

        it('should not display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.previewTag, 1);
          post.expectTag(post.subscribedTag, 2);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.previewTag, 1);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          post.expectTag(post.subscribedTag, 0);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectChannelPriceIncrease(0, 0, 15.2);
          postListInformation.expectChannelPriceIncrease(1, 0, creator1Channel2.price);
        });

        it('should display information on the landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);

          landingPage.expectPriceIncrease(0, 0, 15.2);
          landingPage.expectPriceIncrease(1, 0, creator1Channel2.price);

          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectChannelPriceIncrease(0, 0, 15.2);
          postListInformation.expectChannelPriceIncrease(1, 0, creator1Channel2.price);
        });

        it('should not display a notification on creator 2 landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the post dialog', function(){
          navigateToLatestPosts();

          post.openPostLink.click();

          expect(landingPage.getPostAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceIncrease(0, 0, 15.2);
          post.crossButton.click();
        });

        it('should display information on the embedded post view', function(){
          navigateToLatestPosts();

          post.openPostLink.click();
          post.sharePostLink.click();

          expect(landingPage.getPostAcceptButtonCount(0)).toBe(1);
          landingPage.expectPriceIncrease(0, 0, 15.2);
        });

        it('should display all posts when price is accepted on landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          post.expectTag(post.previewTag, 0);
          post.expectTag(post.previewTag, 1);

          expect(landingPage.getAcceptButtonCount(0)).toBe(1);
          expect(landingPage.getAcceptButtonCount(1)).toBe(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);

          landingPage.getAcceptButton(0).click();

          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.previewTag, 1);

          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(landingPage.getAcceptButtonCount(1)).toBe(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);

          landingPage.getAcceptButton(1).click();

          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);

          expect(landingPage.getAcceptButtonCount(0)).toBe(0);
          expect(landingPage.getAcceptButtonCount(1)).toBe(0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          post.expectTag(post.subscribedTag, 0);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateFromCreatorLandingPage();
          navigateToLatestPosts();
          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });
      });

      describe('when price changes on multiple accounts and channels', function(){
        it('should increase the price of the base channel', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('13', creator1Channel2.name);
          commonWorkflows.reSignIn(creatorRegistration2);
          commonWorkflows.setChannelPrice('14', blog2.name);
        });

        it('should not display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.previewTag, 1);
          post.expectTag(post.previewTag, 2);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.previewTag, 1);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          post.expectTag(post.previewTag, 0);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectChannelPriceIncrease(0, creator1Channel2.price, 13);
          postListInformation.expectChannelPriceIncrease(1, blog2.basePrice, 14);
        });

        it('should display a notification on the landing page for creator 1', function(){
          navigateToCreatorLandingPage(creatorRegistration1);

          landingPage.expectPriceIncrease(1, creator1Channel2.price, 13);

          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, creator1Channel2.price, 13);
        });

        it('should display a notification on the landing page for creator 2', function(){
          navigateToCreatorLandingPage(creatorRegistration2);

          landingPage.expectPriceIncrease(0, blog2.basePrice, 14);

          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, blog2.basePrice, 14);
        });

        it('should display all posts when price is accepted on landing page posts view', function(){
          navigateFromCreatorLandingPage();
          navigateToLatestPosts();
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.previewTag, 1);
          post.expectTag(post.previewTag, 2);
          postListInformation.getAcceptButton(0).click();
          postListInformation.getAcceptButton(0).click();
          post.expectTag(post.subscribedTag, 0);
          post.expectTag(post.subscribedTag, 1);
          post.expectTag(post.subscribedTag, 2);
        });
      });
    });
  });
})();
