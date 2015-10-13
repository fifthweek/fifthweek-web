(function(){
  'use strict';

  var TestKit = require('../../test-kit.js');
  var CommonWorkflows = require('../../common-workflows.js');
  var SidebarPage = require('../../pages/sidebar.page.js');
  var ViewSubscribersPage = require('../../pages/creators/view-subscribers.page.js');
  var CreatorLandingPagePage = require('../../pages/creators/creator-landing-page.page.js');
  var GuestListPage = require('../../pages/creators/guest-list.page.js');
  var PostListInformationPage = require('../../pages/post-list-information.page.js');
  var PaymentInformationPage = require('../../pages/payment-information.page.js');

  describe('view-subscribers form', function() {

    var testKit = new TestKit();
    var commonWorkflows = new CommonWorkflows();
    var sidebar = new SidebarPage();
    var page = new ViewSubscribersPage();
    var landingPage = new CreatorLandingPagePage();
    var guestListPage = new GuestListPage();
    var postListInformationPage = new PostListInformationPage();
    var paymentInformationPage = new PaymentInformationPage();

    var navigateToPage = function () {
      sidebar.subscribersLink.click();
    };

    var navigateToCreatorLandingPage = function (creator) {
      commonWorkflows.getPage('/' + creator.username);
    };

    var navigateFromCreatorLandingPage = function () {
      testKit.scrollIntoView(landingPage.fifthweekLink);
      landingPage.fifthweekLink.click();
      sidebar.subscriptionsLink.click();
    };

    var getPrice = function(channelCount0, channelCount1){
      var price0text = blog.basePrice.replace('.', '');
      var price1text = channel.price.replace('.', '');

      var price0 = parseInt(price0text);
      var price1 = parseInt(price1text);

      return ((channelCount0*price0 + channelCount1*price1)*0.8/100).toFixed(2);
    };

    var userRegistration1;
    var userRegistration2;
    var creatorRegistration;
    var blog;
    var channel;

    it('should register as a user', function() {
      userRegistration1 = commonWorkflows.registerAsCreator();
    });

    it('should register as a user', function() {
      userRegistration2 = commonWorkflows.registerAsCreator();
    });

    it('should create a blog with two channels', function() {
      var context = commonWorkflows.createBlog();
      creatorRegistration = context.registration;
      blog = context.blog;
      channel = commonWorkflows.createChannel({ hiddenCheckbox: false, nameTextBox: 'ZZZ' });
    });

    it('should not contain any subscribers', function(){
      navigateToPage();
      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$0.00');
      expect(page.subscriberCount).toBe(0);
    });

    it('should not display a subscriber when no payment information', function(){
      commonWorkflows.reSignIn(userRegistration1);
      navigateToCreatorLandingPage(creatorRegistration);
      landingPage.getChannelPrice(1).click(); // Unsubscribe from channel 2
      landingPage.subscribeButton.click();
      navigateFromCreatorLandingPage();

      commonWorkflows.reSignIn(creatorRegistration);
      navigateToPage();
      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$0.00');
      expect(page.subscriberCount).toBe(0);
    });

    it('should display a subscriber when subscribed and has credit', function(){
      commonWorkflows.reSignIn(userRegistration1);
      navigateToCreatorLandingPage(creatorRegistration);
      paymentInformationPage.completeSuccessfully();
      navigateFromCreatorLandingPage();

      commonWorkflows.reSignIn(creatorRegistration);
      navigateToPage();
      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$' + getPrice(1, 0));
      expect(page.totalUnacceptablePricesCount).toBe(0);
      expect(page.subscriberCount).toBe(1);

      expect(page.acceptedIndicatorCount).toBe(1);
      expect(page.notAcceptedIndicatorCount).toBe(0);
      expect(page.guestListIndicatorCount).toBe(0);
    });

    it('should display multiple channels', function(){
      commonWorkflows.reSignIn(userRegistration1);
      navigateToCreatorLandingPage(creatorRegistration);
      landingPage.manageSubscriptionButton.click();
      landingPage.getChannelPrice(1).click();
      landingPage.updateSubscriptionButton.click();
      navigateFromCreatorLandingPage();

      commonWorkflows.reSignIn(creatorRegistration);
      navigateToPage();
      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$' + getPrice(1, 1));
      expect(page.totalUnacceptablePricesCount).toBe(0);
      expect(page.subscriberCount).toBe(1);

      expect(page.acceptedIndicatorCount).toBe(2);
      expect(page.notAcceptedIndicatorCount).toBe(0);
      expect(page.guestListIndicatorCount).toBe(0);
    });

    it('should not display unsubscribed users on guest list', function(){
      sidebar.guestListLink.click();
      guestListPage.setNewGuestList([userRegistration2.email]);

      navigateToPage();

      expect(page.subscriberCount).toBe(1);
    });

    it('should display subscribed users on guest list', function(){
      commonWorkflows.reSignIn(userRegistration2);
      navigateToCreatorLandingPage(creatorRegistration);
      landingPage.getChannelPrice(1).click();
      landingPage.subscribeButton.click();
      navigateFromCreatorLandingPage();

      commonWorkflows.reSignIn(creatorRegistration);
      navigateToPage();
      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$' + getPrice(1, 1));
      expect(page.totalUnacceptablePricesCount).toBe(0);
      expect(page.subscriberCount).toBe(2);

      expect(page.acceptedIndicatorCount).toBe(2);
      expect(page.notAcceptedIndicatorCount).toBe(0);
      expect(page.guestListIndicatorCount).toBe(1);
    });

    it('should not display subscriber removed from guest list if subscriber has no payment information', function(){
      sidebar.guestListLink.click();
      guestListPage.updateGuestList([]);

      navigateToPage();

      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$' + getPrice(1, 1));
      expect(page.totalUnacceptablePricesCount).toBe(0);
      expect(page.subscriberCount).toBe(1);

      expect(page.acceptedIndicatorCount).toBe(2);
      expect(page.notAcceptedIndicatorCount).toBe(0);
      expect(page.guestListIndicatorCount).toBe(0);
    });

    it('should display subscribers who have not accepted price', function(){
      commonWorkflows.reSignIn(userRegistration2);
      navigateToCreatorLandingPage(creatorRegistration);
      paymentInformationPage.completeSuccessfully();
      navigateFromCreatorLandingPage();

      commonWorkflows.reSignIn(creatorRegistration);
      navigateToPage();

      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$' + getPrice(1, 1));
      expect(page.totalUnacceptablePrices.getText()).toBe('1');
      expect(page.subscriberCount).toBe(2);

      expect(page.acceptedIndicatorCount).toBe(2);
      expect(page.notAcceptedIndicatorCount).toBe(1);
      expect(page.guestListIndicatorCount).toBe(0);
    });

    it('should display multiple subscribers who have accepted the price', function(){
      commonWorkflows.reSignIn(userRegistration2);
      navigateToCreatorLandingPage(creatorRegistration);
      postListInformationPage.getAcceptButton(0).click();
      navigateFromCreatorLandingPage();

      commonWorkflows.reSignIn(creatorRegistration);

      navigateToPage();

      expect(page.totalRevenue.getText()).toBe('$0.00');
      expect(page.estimatedWeeklyRevenue.getText()).toBe('$' + getPrice(2, 1));
      expect(page.totalUnacceptablePricesCount).toBe(0);
      expect(page.subscriberCount).toBe(2);

      expect(page.acceptedIndicatorCount).toBe(3);
      expect(page.notAcceptedIndicatorCount).toBe(0);
      expect(page.guestListIndicatorCount).toBe(0);
    });
  });
})();
