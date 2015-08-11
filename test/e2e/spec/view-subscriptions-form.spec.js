(function(){
  'use strict';

  var _ = require('lodash');
  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');
  var SidebarPage = require('../pages/sidebar.page.js');
  var HeaderPage = require('../pages/header-subscriptions.page.js');
  var AccountSettingsPage = require('../pages/account-settings.page.js');
  var PaymentInformationPage = require('../pages/payment-information.page.js');
  var CreatorLandingPagePage = require('../pages/creators/creator-landing-page.page.js');
  var SubscribersHeaderPage = require('../pages/header-subscribers.page.js');
  var GuestListPage = require('../pages/creators/guest-list.page.js');
  var DeleteConfirmationPage = require('../pages/delete-confirmation.page.js');
  var ViewSubscriptionsPage = require('../pages/view-subscriptions.page.js');
  var PostListInformationPage = require('../pages/post-list-information.page.js');
  var Defaults = require('../defaults.js');

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();
  var sidebar = new SidebarPage();
  var header = new HeaderPage();
  var accountSettings = new AccountSettingsPage();
  var paymentInformationPage = new PaymentInformationPage();
  var landingPage = new CreatorLandingPagePage();
  var subscribersHeader = new SubscribersHeaderPage();
  var guestListPage = new GuestListPage();
  var deleteConfirmationPage = new DeleteConfirmationPage();
  var viewSubscriptionsPage = new ViewSubscriptionsPage();
  var postListInformationPage = new PostListInformationPage();
  var defaults = new Defaults();

  var navigateToCreatorLandingPage = function (creator) {
    commonWorkflows.getPage('/' + creator.username);
  };

  var navigateFromCreatorLandingPage = function () {
    testKit.scrollIntoView(landingPage.fifthweekLink);
    landingPage.fifthweekLink.click();
  };

  var navigateToPage = function(){
    sidebar.subscriptionsLink.click();
    header.manageLink.click();
  };

  describe('view subscriptions form', function(){

    var blog1;
    var blog2;
    var creatorRegistration1;
    var creatorRegistration2;
    var userRegistration;

    it('should register as a user', function() {
      userRegistration = commonWorkflows.register();
    });

    it('should register as a creator 1', function() {
      var context = commonWorkflows.createBlog();
      blog1 = context.blog;
      creatorRegistration1 = context.registration;
    });

    it('should register as a creator 2', function() {
      var context = commonWorkflows.createBlog();
      blog2 = context.blog;
      creatorRegistration2 = context.registration;
    });

    it('should contain zero account balance', function(){
      commonWorkflows.reSignIn(userRegistration);
      navigateToPage();
      viewSubscriptionsPage.expectZeroAccountBalance();
    });

    it('should contain zero subscriptions cost', function(){
      viewSubscriptionsPage.expectZeroSubscriptionsCost();
    });

    it('should contain no changed prices cost', function(){
      viewSubscriptionsPage.expectNoChangedPricesCost();
    });

    it('should contain no blogs', function(){
      expect(viewSubscriptionsPage.blogCount).toBe(0);
      expect(viewSubscriptionsPage.channelCount).toBe(0);
      expect(viewSubscriptionsPage.collectionCount).toBe(0);
    });

    it('should display subscribed channels', function(){
      commonWorkflows.reSignIn(creatorRegistration1);
      commonWorkflows.createNamedCollection(undefined, 'Collection 1');
      commonWorkflows.createNamedCollection(undefined, 'Collection 2');
      var newChannel = commonWorkflows.createChannel({ hiddenCheckbox: false });

      navigateToPage();

      commonWorkflows.reSignIn(userRegistration);
      navigateToCreatorLandingPage(creatorRegistration1);
      landingPage.subscribeButton.click();

      navigateFromCreatorLandingPage();
      navigateToPage();

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectNonZeroSubscriptionsCost();

      expect(viewSubscriptionsPage.blogCount).toBe(1);
      expect(viewSubscriptionsPage.channelCount).toBe(1);
      expect(viewSubscriptionsPage.collectionCount).toBe(2);
    });

    it('should display second subscribed channel', function(){
      viewSubscriptionsPage.manageButton(0).click();
      landingPage.getChannelPrice(1).click();
      landingPage.updateSubscriptionButton.click();

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectNonZeroSubscriptionsCost();

      expect(viewSubscriptionsPage.blogCount).toBe(1);
      expect(viewSubscriptionsPage.channelCount).toBe(2);
      expect(viewSubscriptionsPage.collectionCount).toBe(2);
    });

    it('should link to blogs', function(){
      viewSubscriptionsPage.firstBlogLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + creatorRegistration1.username + '/all/');
      landingPage.fifthweekLink.click();
      navigateToPage();
    });

    it('should link to channels', function(){
      viewSubscriptionsPage.firstChannelLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + creatorRegistration1.username + '/channel/');
      expect(postListInformationPage.postsHeader.getText()).toBe(defaults.channelName);
      landingPage.fifthweekLink.click();
      navigateToPage();

    });

    it('should link to collections', function(){
      viewSubscriptionsPage.firstCollectionLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + creatorRegistration1.username + '/collection/');
      expect(postListInformationPage.postsHeader.getText()).toBe(defaults.channelName + ' / Collection 1');
      landingPage.fifthweekLink.click();
      navigateToPage();
    });

    it('should unsubscribe', function(){
      viewSubscriptionsPage.manageButton(0).click();
      landingPage.unsubscribeButton.click();

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectZeroSubscriptionsCost();
      viewSubscriptionsPage.expectNoChangedPricesCost();

      expect(viewSubscriptionsPage.blogCount).toBe(0);
      expect(viewSubscriptionsPage.channelCount).toBe(0);
      expect(viewSubscriptionsPage.collectionCount).toBe(0);
    });

    it('should add user to guest list', function(){
      commonWorkflows.reSignIn(creatorRegistration2);
      sidebar.subscribersLink.click();
      subscribersHeader.guestListLink.click();
      guestListPage.setNewGuestList([userRegistration.email]);
      commonWorkflows.reSignIn(userRegistration);
    });

    it('should display guest list blog', function(){
      navigateToPage();
      expect(viewSubscriptionsPage.blogCount).toBe(1);
      expect(viewSubscriptionsPage.channelCount).toBe(0);
      expect(viewSubscriptionsPage.collectionCount).toBe(0);
    });

    it('should link to blog manage page', function(){
      viewSubscriptionsPage.firstBlogLink.click();
      expect(browser.getCurrentUrl()).toContain('/' + creatorRegistration2.username + '/manage/');
      landingPage.fifthweekLink.click();
      navigateToPage();
    });

    it('should display subscribed guest list blog', function(){
      viewSubscriptionsPage.manageButton(0).click();
      landingPage.subscribeButton.click();

      expect(viewSubscriptionsPage.blogCount).toBe(1);
      expect(viewSubscriptionsPage.channelCount).toBe(1);
      expect(viewSubscriptionsPage.collectionCount).toBe(0);

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectZeroSubscriptionsCost();
      viewSubscriptionsPage.expectNoChangedPricesCost();
    });

    it('should remove user from guest list', function(){
      commonWorkflows.reSignIn(creatorRegistration2);
      sidebar.subscribersLink.click();
      subscribersHeader.guestListLink.click();
      guestListPage.updateGuestList([]);
      commonWorkflows.reSignIn(userRegistration);
    });

    it('should display guest list blog with updated price', function(){
      navigateToPage();
      expect(viewSubscriptionsPage.blogCount).toBe(1);
      expect(viewSubscriptionsPage.channelCount).toBe(1);
      expect(viewSubscriptionsPage.collectionCount).toBe(0);

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectZeroSubscriptionsCost();
      viewSubscriptionsPage.expectNonZeroChangedPricesCost();
    });

    it('should accept the price change', function(){
      postListInformationPage.getAcceptButton(0).click();
    });

    it('should display accepted price information', function(){
      navigateToPage();
      expect(viewSubscriptionsPage.blogCount).toBe(1);
      expect(viewSubscriptionsPage.channelCount).toBe(1);
      expect(viewSubscriptionsPage.collectionCount).toBe(0);

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectNonZeroSubscriptionsCost();
      viewSubscriptionsPage.expectNoChangedPricesCost();
    });

    it('should display multiple subscribed blogs', function(){
      navigateToCreatorLandingPage(creatorRegistration1);
      landingPage.subscribeButton.click();

      navigateFromCreatorLandingPage();
      navigateToPage();

      expect(viewSubscriptionsPage.blogCount).toBe(2);
      expect(viewSubscriptionsPage.channelCount).toBe(2);
      expect(viewSubscriptionsPage.collectionCount).toBe(2);

      viewSubscriptionsPage.expectZeroAccountBalance();
      viewSubscriptionsPage.expectNonZeroSubscriptionsCost();
      viewSubscriptionsPage.expectNoChangedPricesCost();
    });

    it('should display account balance', function(){
      header.paymentLink.click();
      paymentInformationPage.completeSuccessfully();
      navigateToPage();

      viewSubscriptionsPage.expectNonZeroAccountBalance();
    });
  });
})();