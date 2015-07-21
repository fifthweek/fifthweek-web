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

  var navigateToCreatorLandingPage = function (creator) {
    commonWorkflows.getPage('/' + creator.username);
  };

  var navigateFromCreatorLandingPage = function () {
    testKit.scrollIntoView(landingPage.fifthweekLink);
    landingPage.fifthweekLink.click();
  };

  var navigateToPage = function(){
    sidebar.subscriptionsLink.click();
    header.paymentLink.click();
  };

  var testDeletion = function(){
    deleteConfirmationPage.describeDeletingWithoutVerification(
      'Payment Information',
      function () {
        navigateToPage();
        paymentInformationPage.deletePaymentInformationButton.click();
      },
      function () {
        expect(paymentInformationPage.deletePaymentInformationPanel.isDisplayed()).toBe(true);
      },
      function () {
        expect(paymentInformationPage.noPaymentInformationPanel.isDisplayed()).toBe(true);
      }
    );
  };

  describe('update payment information form', function() {

    var blog;
    var creatorRegistration1;
    var userRegistration;

    it('should register as a user', function() {
      userRegistration = commonWorkflows.register();
    });

    it('should register as a creator', function() {
      var context = commonWorkflows.createBlog();
      blog = context.blog;
      creatorRegistration1 = context.registration;
    });

    it('should contain zero account balance', function(){
      commonWorkflows.reSignIn(userRegistration);
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).toBe('$0.00');
    });

    it('should display no payment information warning', function(){
      navigateToPage();
      expect(paymentInformationPage.noPaymentInformationPanel.isDisplayed()).toBe(true);
    });

    it('should not submit form if invalid', function(){
      paymentInformationPage.updatePaymentInformationButton.click();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
    });

    it('should not add credit if not enough evidence for country', function(){
      paymentInformationPage.completeWithInsufficientEvidence();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).toBe('$0.00');
    });

    it('should not add credit if transaction not confirmed', function(){
      navigateToPage();
      paymentInformationPage.completeUpToTransactionConfirmation();
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).toBe('$0.00');
    });

    it('should add credit if transaction confirmed', function(){
      navigateToPage();
      paymentInformationPage.completeSuccessfully();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
      expect(paymentInformationPage.successNotification.isDisplayed()).toBe(true);
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).not.toBe('$0.00');
    });

    it('should display delete payment information panel', function(){
      navigateToPage();
      expect(paymentInformationPage.deletePaymentInformationPanel.isDisplayed()).toBe(true);
    });

    it('should update credit card details without prompting for a transaction once the user has credit', function(){
      navigateToPage();
      paymentInformationPage.completeUpToTransactionConfirmation();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
      expect(paymentInformationPage.successNotification.isDisplayed()).toBe(true);
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).not.toBe('$0.00');
    });

    testDeletion();
  });

  describe('timeline payment information form', function() {

    var blog;
    var creatorRegistration1;
    var userRegistration;

    it('should register as a user', function() {
      userRegistration = commonWorkflows.register();
    });

    it('should register as a creator', function() {
      var context = commonWorkflows.createBlog();
      blog = context.blog;
      creatorRegistration1 = context.registration;
    });

    it('should contain zero account balance', function(){
      commonWorkflows.reSignIn(userRegistration);
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).toBe('$0.00');
    });

    it('should not display payment information form on read now page when no subscriptions', function(){
      sidebar.subscriptionsLink.click();
      paymentInformationPage.expectPaymentInformationFormNotToBeDisplayed();
    });

    it('should display payment information on creator timeline', function(){
      navigateToCreatorLandingPage(creatorRegistration1);
      landingPage.subscribeButton.click();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
    });

    it('should display payment information form on read now page after subscribing', function(){
      navigateFromCreatorLandingPage();
      sidebar.subscriptionsLink.click();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
    });

    it('should add user to guest list', function(){
      commonWorkflows.reSignIn(creatorRegistration1);
      sidebar.subscribersLink.click();
      subscribersHeader.guestListLink.click();
      guestListPage.setNewGuestList([userRegistration.email]);
      commonWorkflows.reSignIn(userRegistration);
    });

    it('should not display payment information form on read now page when only guest list subscriptions', function(){
      sidebar.subscriptionsLink.click();
      paymentInformationPage.expectPaymentInformationFormNotToBeDisplayed();
    });

    it('should display payment information on creator timeline when only guest list subscriptions', function(){
      navigateToCreatorLandingPage(creatorRegistration1);
      paymentInformationPage.expectPaymentInformationFormNotToBeDisplayed();
    });

    it('should remove user from guest list', function(){
      commonWorkflows.reSignIn(creatorRegistration1);
      sidebar.subscribersLink.click();
      subscribersHeader.guestListLink.click();
      guestListPage.updateGuestList([]);
      commonWorkflows.reSignIn(userRegistration);
    });

    it('should not submit form if invalid', function(){
      sidebar.subscriptionsLink.click();
      paymentInformationPage.updatePaymentInformationButton.click();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
    });

    it('should not add credit if not enough evidence for country', function(){
      paymentInformationPage.completeWithInsufficientEvidence();
      paymentInformationPage.expectPaymentInformationFormToBeDisplayed();
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).toBe('$0.00');
    });

    it('should not add credit if transaction not confirmed', function(){
      sidebar.subscriptionsLink.click();
      paymentInformationPage.completeUpToTransactionConfirmation();
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).toBe('$0.00');
    });

    it('should add credit if transaction confirmed', function(){
      sidebar.subscriptionsLink.click();
      paymentInformationPage.completeSuccessfully();
      paymentInformationPage.expectPaymentInformationFormNotToBeDisplayed();
      sidebar.accountLink.click();
      expect(accountSettings.accountBalanceAmount.getText()).not.toBe('$0.00');
    });

    it('should not display payment information form on read now page when user has credit', function(){
      sidebar.subscriptionsLink.click();
      paymentInformationPage.expectPaymentInformationFormNotToBeDisplayed();
    });

    it('should display payment information on creator timeline when user has credit', function(){
      navigateToCreatorLandingPage(creatorRegistration1);
      paymentInformationPage.expectPaymentInformationFormNotToBeDisplayed();
    });
  });
})();
