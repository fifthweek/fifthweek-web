(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var SidebarPage = require('../pages/sidebar.page.js');
  var HeaderPage = require('../pages/header-read-now.page.js');
  var GuestListPage = require('../pages/creators/guest-list.page.js');
  var PostPage = require('../pages/post.page.js');
  var SubscribersHeaderPage = require('../pages/header-subscribers.page.js');
  var CreatorLandingPagePage = require('../pages/creators/creator-landing-page.page.js');
  var CreatorTimelinePage = require('../pages/creators/creator-timeline.page.js');

  describe('latest-posts form', function() {

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var header = new HeaderPage();
    var guestListPage = new GuestListPage();
    var post = new PostPage();
    var subscribersHeader = new SubscribersHeaderPage();
    var landingPage = new CreatorLandingPagePage();
    var creatorTimelinePage = new CreatorTimelinePage();

    var navigateToLatestPosts = function () {
      sidebar.readNowLink.click();
    };

    var navigateToCreatorLandingPage = function (creator) {
      commonWorkflows.getPage('/' + creator.username);
    };

    var navigateFromCreatorLandingPage = function () {
      landingPage.fifthweekLink.click();
    };

    var expectLatestPostCount = function(count){
      expect(header.latestPostsLink.isDisplayed()).toBe(true);
      expect(post.allPosts.count()).toBe(count);
    };

    var expectLandingPagePostCount = function(count){
      expect(creatorTimelinePage.subscribedButton.isPresent()).toBe(true);
      expect(post.allPosts.count()).toBe(count);
    };

    var creatorRegistration1;
    var creatorRegistration2;
    var userRegistration;

    it('latest posts should not contain any posts when the user is not subscribed to any creators', function() {
      userRegistration = commonWorkflows.register();
      navigateToLatestPosts();
      expectLatestPostCount(0);
    });

    it('should add the user to the guest list of creator1', function() {
      creatorRegistration1 = commonWorkflows.createBlog().registration;
      sidebar.subscribersLink.click();
      subscribersHeader.guestListLink.click();
      guestListPage.setNewGuestList([userRegistration.email]);
    });

    describe('when the creator has not posted', function(){
      it('should run once before all', function(){
        commonWorkflows.reSignIn(userRegistration);
      });

      it('landing page should not contain any posts', function() {
        navigateToCreatorLandingPage(creatorRegistration1);
        landingPage.subscribeButton.click();
        expectLandingPagePostCount(0);
        navigateFromCreatorLandingPage();
      });

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
        navigateFromCreatorLandingPage();
      });

      it('latest posts should not contain any posts', function() {
        navigateToLatestPosts();
        expectLatestPostCount(0);
      });
    });

    describe('when the creator has posted to an unsubscribed channel', function(){
      it('should run once before all', function(){
        commonWorkflows.reSignIn(creatorRegistration1);
        var result = commonWorkflows.createChannel();
        commonWorkflows.postNoteNow(result.name);
        commonWorkflows.reSignIn(userRegistration);
      });

      it('landing page should not contain any posts', function() {
        navigateToCreatorLandingPage(creatorRegistration1);
        expectLandingPagePostCount(0);
        navigateFromCreatorLandingPage();
      });

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
        navigateFromCreatorLandingPage();
      });

      it('latest posts should contain the post', function() {
        navigateToLatestPosts();
        expectLatestPostCount(1);
      });
    });

    it('should add the user to the guest list of creator2', function() {
      creatorRegistration2 = commonWorkflows.createBlog().registration;
      sidebar.subscribersLink.click();
      subscribersHeader.guestListLink.click();
      guestListPage.setNewGuestList([userRegistration.email]);
    });

    describe('when the creator 2 has not posted', function(){
      it('should run once before all', function(){
        commonWorkflows.reSignIn(userRegistration);
      });

      it('landing page should contain no posts', function() {
        navigateToCreatorLandingPage(creatorRegistration2);
        landingPage.subscribeButton.click();
        expectLandingPagePostCount(0);
        navigateFromCreatorLandingPage();
      });

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
        navigateFromCreatorLandingPage();
      });

      it('latest posts should contain two posts', function() {
        navigateToLatestPosts();
        expectLatestPostCount(2);
      });
    });
  });
})();
