(function(){
  'use strict';

  var _ = require('lodash');
  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var SidebarPage = require('../pages/sidebar.page.js');
  var HeaderPage = require('../pages/header-subscriptions.page.js');
  var GuestListPage = require('../pages/creators/guest-list.page.js');
  var PostPage = require('../pages/post.page.js');
  var SubscribersHeaderPage = require('../pages/header-subscribers.page.js');
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
  var subscribersHeader = new SubscribersHeaderPage();
  var landingPage = new CreatorLandingPagePage();
  var signInWorkflow = new SignInWorkflowPage();
  var postListInformation = new PostListInformationPage();
  var paymentInformationPage = new PaymentInformationPage();

  describe('subscription management', function() {

    var navigateToLatestPosts = function () {
      sidebar.subscriptionsLink.click();
    };

    var navigateToCreatorLandingPage = function (creator) {
      commonWorkflows.getPage('/' + creator.username);
    };

    var navigateFromCreatorLandingPage = function () {
      testKit.scrollIntoView(landingPage.fifthweekLink);
      landingPage.fifthweekLink.click();
    };

    var expectLatestPostCount = function(count){
      expect(header.latestPostsLink.isDisplayed()).toBe(true);
      expect(post.allPosts.count()).toBe(count);
    };

    var expectLandingPagePostCount = function(count){
      expect(landingPage.manageSubscriptionButton.isPresent()).toBe(true);
      expect(post.allPosts.count()).toBe(count);
    };

    var expectLandingPageChannelCount = function(hasFreeAccess, count, prices){
      var totalPrice = '$' +  (hasFreeAccess ? 0 : _.sum(prices)).toFixed(2) + '/week';
      if(count === 1){
        expect(landingPage.buttonFooter.getText()).toBe(count + ' Channel - ' + totalPrice);
      }
      else{
        expect(landingPage.buttonFooter.getText()).toBe(count + ' Channels - ' + totalPrice);
      }
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

    describe('when testing subscription buttons', function(){

      var blog;
      var creatorRegistration1;
      var userRegistration;

      it('should register as a user', function() {
        userRegistration = commonWorkflows.register();
        addCreditToUserAccount(userRegistration);
      });

      it('should register as a creator', function() {
        var context = commonWorkflows.createBlog();
        blog = context.blog;
        creatorRegistration1 = context.registration;
        sidebar.landingPageLink.click();
      });

      describe('when creator', function(){
        afterEach(function(){
          landingPage.fifthweekLink.click();
          sidebar.landingPageLink.click();
        });

        describe('subscribing', function(){
          afterEach(function() {
            // The timeline is tested as part of another spec. We just want to ensure that all routes to subscribe
            // take the user to the timeline.
            expect(landingPage.manageSubscriptionButton.isPresent()).toBe(true);
          });

          it('should be possible via the "subscribe" button', function() {
            landingPage.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            landingPage.channelListSubscribeButton.click();
          });
        });

        describe('unsubscribing', function(){
          it('should be possible to unsubscribe', function(){
            landingPage.subscribeButton.click();
            landingPage.manageSubscriptionButton.click();
            expect(landingPage.cancelChangesButton.isPresent()).toBe(true);
            landingPage.unsubscribeButton.click();
            expect(landingPage.subscribeButton.isPresent()).toBe(true);
          });
        });

        describe('canceling changes', function(){
          it('should be possible to cancel changes', function(){
            landingPage.subscribeButton.click();
            landingPage.manageSubscriptionButton.click();
            landingPage.cancelChangesButton.click();
            expect(landingPage.manageSubscriptionButton.isPresent()).toBe(true);
          });
        });

        describe('accepting changes', function(){
          it('should be possible to accept changes', function(){
            landingPage.subscribeButton.click();
            landingPage.manageSubscriptionButton.click();
            landingPage.updateSubscriptionButton.click();
            expect(landingPage.manageSubscriptionButton.isPresent()).toBe(true);
          });
        });
      });

      describe('when not on guest list', function(){
        afterEach(function() {
          expect(landingPage.guestListInformationPanelCount).toBe(0);
          expect(landingPage.manageSubscriptionButton.isPresent()).toBe(true);
          landingPage.manageSubscriptionButton.click();
          landingPage.unsubscribeButton.click();
          //signInWorkflow.expectGuestListOnlyDisplayed();
          //signInWorkflow.guestListOnlyDismissButton.click();
        });

        describe('subscribing as signed-in user not on guest-list', function(){
          it('should be possible via the "subscribe" button', function(){
            commonWorkflows.reSignIn(userRegistration);
            commonWorkflows.getPage('/' + creatorRegistration1.username);
            landingPage.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            landingPage.channelListSubscribeButton.click();
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
            landingPage.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            landingPage.channelListSubscribeButton.click();
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
            landingPage.subscribeButton.click();
          });

          it('should be possible via the "subscribe now" link', function() {
            landingPage.channelListSubscribeButton.click();
          });
        });
      });

      describe('when on guest list', function(){
        var userRegistration2;
        var userRegistration3;
        it('should run once before all', function(){
          userRegistration2 = signInWorkflow.newRegistrationData();
          userRegistration3 = signInWorkflow.newRegistrationData();

          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.subscribersLink.click();
          subscribersHeader.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email, userRegistration2.email, userRegistration3.email]);
        });

        describe('when subscribing on guest list', function(){
          afterEach(function() {
            expect(landingPage.guestListInformationPanel.isPresent()).toBe(true);
            expect(landingPage.manageSubscriptionButton.isPresent()).toBe(true);
            landingPage.manageSubscriptionButton.click();
            landingPage.unsubscribeButton.click();
          });

          describe('subscribing as signed-in user on guest-list', function(){
            beforeEach(function(){
              commonWorkflows.reSignIn(userRegistration);
              commonWorkflows.getPage('/' + creatorRegistration1.username);
            });

            afterEach(function(){
            });

            it('should be possible via the "subscribe" button', function(){
              landingPage.subscribeButton.click();
            });

            it('should be possible via the "subscribe now" link', function() {
              landingPage.channelListSubscribeButton.click();
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
              landingPage.subscribeButton.click();
            });

            it('should be possible via the "subscribe now" link', function() {
              landingPage.channelListSubscribeButton.click();
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
              landingPage.subscribeButton.click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration2);
            });

            it('should be possible via the "subscribe now" link', function() {
              landingPage.channelListSubscribeButton.click();
              signInWorkflow.expectRegisterDisplayed();
              signInWorkflow.registerSuccessfullyWithData(userRegistration3);
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

      var collectionName = 'Cats';
      var filePath = '../../../sample-image-tiny.jpg';
      var filePathTiff = '../../../sample-image-tiny.tif';

      it('should register as a user', function() {
        userRegistration = commonWorkflows.register();
        addCreditToUserAccount(userRegistration);
      });

      it('should register as a creator', function() {
        var context = commonWorkflows.createBlog();
        blog = context.blog;
        creatorRegistration1 = context.registration;
      });

      it('should create a collection', function(){
        commonWorkflows.createNamedCollection(undefined, collectionName);
      });

      it('should post each type of post', function(){
        sidebar.postsLink.click();
        nonViewableImagePost = commonWorkflows.postImageNow(filePathTiff, collectionName);
        imagePost = commonWorkflows.postImageNow(filePath, collectionName);
        filePost = commonWorkflows.postFileNow(filePath, collectionName);
        notePost = commonWorkflows.postNoteNow();
      });

      describe('when testing posts as creator', function(){
        var navigateToLandingPagePosts = function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.subscribeButton.click();
        };

        it('should display posts on landing page', function(){
          navigateToLandingPagePosts();
          post.postIndex = 0;
          post.expectNotePost(notePost, creatorRegistration1, navigateToLandingPagePosts, false, false);
          post.postIndex = 1;
          post.expectFilePost(filePost, creatorRegistration1, navigateToLandingPagePosts, true, false);
          post.postIndex = 2;
          post.expectImagePost(imagePost, creatorRegistration1, navigateToLandingPagePosts, true, false);
          post.postIndex = 3;
          post.expectNonViewableImagePost(nonViewableImagePost, creatorRegistration1, navigateToLandingPagePosts, true, false);
        });
      });

      describe('when testing posts as user', function(){
        var navigateToLandingPagePosts = function(){
          navigateToCreatorLandingPage(creatorRegistration1);
        };

        it('should sign in as user and register', function(){
          commonWorkflows.reSignIn(userRegistration);
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.subscribeButton.click();
        });

        it('should display posts on landing page', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          post.postIndex = 0;
          post.expectNotePost(notePost, creatorRegistration1, navigateToLandingPagePosts, false, true);
          post.postIndex = 1;
          post.expectFilePost(filePost, creatorRegistration1, navigateToLandingPagePosts, true, true);
          post.postIndex = 2;
          post.expectImagePost(imagePost, creatorRegistration1, navigateToLandingPagePosts, true, true);
          post.postIndex = 3;
          post.expectNonViewableImagePost(nonViewableImagePost, creatorRegistration1, navigateToLandingPagePosts, true, true);
        });

        it('should display posts on read now page', function(){
          navigateFromCreatorLandingPage();
          navigateToLatestPosts();
          post.postIndex = 0;
          post.expectNotePost(notePost, creatorRegistration1, navigateToLatestPosts, false, true);
          post.postIndex = 1;
          post.expectFilePost(filePost, creatorRegistration1, navigateToLatestPosts, true, true);
          post.postIndex = 2;
          post.expectImagePost(imagePost, creatorRegistration1, navigateToLatestPosts, true, true);
          post.postIndex = 3;
          post.expectNonViewableImagePost(nonViewableImagePost, creatorRegistration1, navigateToLatestPosts, true, true);
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
            landingPage.subscribeButton.click();
            expectLandingPagePostCount(0);
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
            channel2 = commonWorkflows.createChannel({ hiddenCheckbox: false });
            commonWorkflows.postNoteNow(channel2.name);
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should not contain any posts', function() {
            navigateToCreatorLandingPage(creatorRegistration1);
            expectLandingPagePostCount(0);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('landing page should contain two channels', function(){
            landingPage.manageSubscriptionButton.click();
            expect(landingPage.getChannelPrice(0).isDisplayed()).toBe(true);
            expect(landingPage.getChannelPrice(1).isDisplayed()).toBe(true);
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
            commonWorkflows.postNoteNow();
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should contain the post', function() {
            navigateToCreatorLandingPage(creatorRegistration1);
            expectLandingPagePostCount(1);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('landing page should contain two channels', function(){
            landingPage.manageSubscriptionButton.click();
            expect(landingPage.getChannelPrice(0).isDisplayed()).toBe(true);
            expect(landingPage.getChannelPrice(1).isDisplayed()).toBe(true);
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
            sidebar.subscribersLink.click();
            subscribersHeader.guestListLink.click();
            guestListPage.setNewGuestList([userRegistration.email]);
          });
        }

        describe('when the creator 2 has not posted', function(){
          it('should run once before all', function(){
            commonWorkflows.reSignIn(userRegistration);
          });

          it('landing page should contain no posts', function() {
            navigateToCreatorLandingPage(creatorRegistration2);
            landingPage.subscribeButton.click();
            expectLandingPagePostCount(0);
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
            navigateToCreatorLandingPage(creatorRegistration1);
            expectLandingPagePostCount(1);
          });

          it('landing page should show subscribed to correct channels', function(){
            expectLandingPageChannelCount(hasFreeAccess, 1, [blog.basePrice]);
          });

          it('should navigate from landing page', navigateFromCreatorLandingPage);

          it('latest posts should contain two posts', function() {
            navigateToLatestPosts();
            expectLatestPostCount(2);
          });
        });

        describe('when the user attempts to subscribe to channel2 but cancels', function(){
          it('should not subscribe to the selected channels when cancelling', function(){
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.manageSubscriptionButton.click();
            landingPage.getChannelPrice(1).click();
            landingPage.cancelChangesButton.click();
          });

          it('landing page should only contain one post', function() {
            expectLandingPagePostCount(1);
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

        describe('when the user subscribes to channel2', function(){
          it('should subscribe to the selected channels', function(){
            navigateToCreatorLandingPage(creatorRegistration1);
            landingPage.manageSubscriptionButton.click();
            landingPage.getChannelPrice(1).click();
            landingPage.updateSubscriptionButton.click();
          });

          it('landing page should contain two posts', function() {
            expectLandingPagePostCount(2);
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
            landingPage.manageSubscriptionButton.click();
            landingPage.getChannelPrice(1).click();
            landingPage.updateSubscriptionButton.click();
          });

          it('landing page should only contain one post', function() {
            expectLandingPagePostCount(1);
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
            landingPage.manageSubscriptionButton.click();
            landingPage.unsubscribeButton.click();
          });

          it('landing page should now display subscribe button', function() {
            expect(landingPage.subscribeButton.isDisplayed()).toBe(true);
            navigateFromCreatorLandingPage();
          });

          it('latest posts should only contain one post', function() {
            navigateToLatestPosts();
            expectLatestPostCount(1);
          });
        });
      };

      describe('when testing subscribing while on the guest list', function(){
        it('latest posts should not contain any posts when the user is not subscribed to any creators', function() {
          userRegistration = commonWorkflows.register();
          navigateToLatestPosts();
          expectLatestPostCount(0);
        });

        it('should register as a creator', function() {
          var context = commonWorkflows.createBlog();
          blog = context.blog;
          creatorRegistration1 = context.registration;
          sidebar.landingPageLink.click();
        });

        it('should add the user to the guest list', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.subscribersLink.click();
          subscribersHeader.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email]);
        });

        testSubscribingToChannels(true);
      });

      describe('when testing subscribing while not on the guest list', function(){
        it('latest posts should not contain any posts when the user is not subscribed to any creators', function() {
          userRegistration = commonWorkflows.register();
          addCreditToUserAccount(userRegistration);
          navigateToLatestPosts();
          expectLatestPostCount(0);
        });

        it('should register as a creator', function() {
          var context = commonWorkflows.createBlog();
          blog = context.blog;
          creatorRegistration1 = context.registration;
          sidebar.landingPageLink.click();
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
        creator1Channel2 = commonWorkflows.createChannel({ hiddenCheckbox: false });
      });

      it('should register as a creator 2', function() {
        var context = commonWorkflows.createBlog();
        blog2 = context.blog;
        creatorRegistration2 = context.registration;
      });

      it('should post a note in each channel', function(){
        commonWorkflows.postNoteNow();
        commonWorkflows.reSignIn(creatorRegistration1);
        commonWorkflows.postNoteNow();
        commonWorkflows.postNoteNow(creator1Channel2.name);
      });

      it('should subscribe to all channels', function(){
        commonWorkflows.reSignIn(userRegistration);
        navigateToCreatorLandingPage(creatorRegistration1);
        landingPage.getChannelPrice(1).click();
        landingPage.subscribeButton.click();
        expectLandingPagePostCount(2);

        navigateToCreatorLandingPage(creatorRegistration2);
        landingPage.subscribeButton.click();
        expectLandingPagePostCount(1);
        navigateFromCreatorLandingPage();

        navigateToLatestPosts();
        expectLatestPostCount(3);
      });

      describe('when price increases', function(){
        it('should increase the price of the base channel', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.00');
        });

        it('should not display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(2);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(1);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceIncrease(0, blog1.basePrice, 15);
        });

        it('should display a notification on the landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceIncrease(0, blog1.basePrice, 15);
        });

        it('should not display a notification on creator 2 landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceIncrease(0, blog1.basePrice, 15);
        });

        it('should display all posts when price is accepted on landing page posts view', function(){
          landingPage.cancelChangesButton.click();
          expectLandingPagePostCount(1);
          postListInformation.getAcceptButton(0).click();
          expectLandingPagePostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on landing page manage view 1', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.10');
          commonWorkflows.reSignIn(userRegistration);

          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceIncrease(0, 15, 15.1);

          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceIncrease(0, 15, 15.1);
          landingPage.updateSubscriptionButton.click();

          expectLandingPagePostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on landing page manage view from read now view', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.20');
          commonWorkflows.reSignIn(userRegistration);

          expectLatestPostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceIncrease(0, 15.1, 15.2);

          postListInformation.getManageButton(0).click();
          landingPage.expectPriceIncrease(0, 15.1, 15.2);
          landingPage.updateSubscriptionButton.click();

          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display all posts when price is accepted on read now page', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.30');
          commonWorkflows.reSignIn(userRegistration);

          expectLatestPostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceIncrease(0, 15.2, 15.3);

          postListInformation.getAcceptButton(0).click();

          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

      });

      describe('when price decreases', function(){
        it('should increase the price of the base channel', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('15.20');
        });

        it('should continue to display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceDecrease(0, 15.3, 15.2);
        });

        it('should display a notification on the landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceDecrease(0, 15.3, 15.2);
        });

        it('should not display a notification on creator 2 landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceDecrease(0, 15.3, 15.2);
        });

        it('should continue to display all posts when price is accepted on landing page posts view', function(){
          landingPage.cancelChangesButton.click();
          expectLandingPagePostCount(2);
          postListInformation.getAcceptButton(0).click();
          expectLandingPagePostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateFromCreatorLandingPage();
          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });
      });

      describe('when added to guest list', function(){

        it('creator 1 should add the user to the guest list', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.subscribersLink.click();
          subscribersHeader.guestListLink.click();
          guestListPage.setNewGuestList([userRegistration.email]);
        });

        it('should continue to display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(3);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(2);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectBasePriceDecrease(0, 15.2, 0);
          postListInformation.expectChannelPriceDecrease(1, creator1Channel2.price, 0);
        });

        it('should display a notification on the landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectBasePriceDecrease(0, 15.2, 0);
          postListInformation.expectChannelPriceDecrease(1, creator1Channel2.price, 0);
        });

        it('should not display a notification on creator 2 landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceDecrease(0, 15.2, 15.2);  // Same price because old price has strikethrough.
          landingPage.expectPriceDecrease(1, creator1Channel2.price, creator1Channel2.price);
        });

        it('should continue to display all posts when prices are accepted on landing page manage view', function(){
          landingPage.updateSubscriptionButton.click();
          expectLandingPagePostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateFromCreatorLandingPage();
          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

      });

      describe('when removed from guest list', function(){

        it('creator 1 should add the user to the guest list', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          sidebar.subscribersLink.click();
          subscribersHeader.guestListLink.click();
          guestListPage.updateGuestList([]);
        });

        it('should not display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(1);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(0);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectBasePriceIncrease(0, 0, 15.2);
          postListInformation.expectChannelPriceIncrease(1, 0, creator1Channel2.price);
        });

        it('should display a notification on the landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectBasePriceIncrease(0, 0, 15.2);
          postListInformation.expectChannelPriceIncrease(1, 0, creator1Channel2.price);
        });

        it('should not display a notification on creator 2 landing page posts view', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });

        it('should display information on the landing page manage view', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceIncrease(0, 0, 15.2);
          landingPage.expectPriceIncrease(1, 0, creator1Channel2.price);
        });

        it('should display all posts when price is accepted on landing page posts view', function(){
          landingPage.cancelChangesButton.click();
          expectLandingPagePostCount(0);

          postListInformation.getAcceptButton(0).click();
          expectLandingPagePostCount(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);

          postListInformation.getAcceptButton(0).click();
          expectLandingPagePostCount(2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);

          navigateFromCreatorLandingPage();
          expectLatestPostCount(3);
          expect(postListInformation.priceChangeIndicatorCount).toBe(0);
        });
      });

      describe('when price changes on multiple accounts and channels', function(){
        it('should increase the price of the base channel', function(){
          commonWorkflows.reSignIn(creatorRegistration1);
          commonWorkflows.setChannelPrice('13', creator1Channel2.name);
          commonWorkflows.reSignIn(creatorRegistration2);
          commonWorkflows.setChannelPrice('14');
        });

        it('should not display posts from the base channel to the subscribed user', function(){
          commonWorkflows.reSignIn(userRegistration);
          expectLatestPostCount(1);
          navigateToCreatorLandingPage(creatorRegistration1);
          expectLandingPagePostCount(1);
          navigateToCreatorLandingPage(creatorRegistration2);
          expectLandingPagePostCount(0);
          navigateFromCreatorLandingPage();
        });

        it('should display a notification on the read now page', function(){
          navigateToLatestPosts();
          expect(postListInformation.priceChangeIndicatorCount).toBe(2);
          postListInformation.expectChannelPriceIncrease(0, creator1Channel2.price, 13);
          postListInformation.expectBasePriceIncrease(1, blog2.basePrice, 14);
        });

        it('should display a notification on the landing page posts view for creator 1', function(){
          navigateToCreatorLandingPage(creatorRegistration1);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectChannelPriceIncrease(0, creator1Channel2.price, 13);
        });

        it('should display information on the landing page manage view for creator 1', function(){
          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceIncrease(1, creator1Channel2.price, 13);
        });

        it('should display a notification on the landing page posts view for creator 2', function(){
          navigateToCreatorLandingPage(creatorRegistration2);
          expect(postListInformation.priceChangeIndicatorCount).toBe(1);
          postListInformation.expectBasePriceIncrease(0, blog2.basePrice, 14);
        });

        it('should display information on the landing page manage view for creator 2', function(){
          landingPage.manageSubscriptionButton.click();
          landingPage.expectPriceIncrease(0, blog2.basePrice, 14);
        });

        it('should display all posts when price is accepted on landing page posts view', function(){
          navigateFromCreatorLandingPage();
          expectLatestPostCount(1);
          postListInformation.getAcceptButton(0).click();
          expectLatestPostCount(2);
          postListInformation.getAcceptButton(0).click();
          expectLatestPostCount(3);
        });
      });
    });
  });
})();
