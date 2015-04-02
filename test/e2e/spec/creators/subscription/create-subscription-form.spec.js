var TestKit = require('../../../test-kit.js');
var CommonWorkflows = require('../../../common-workflows.js');
var RegisterPage = require('../../../pages/register.page.js');
var SignOutPage = require('../../../pages/sign-out.page.js');
var SubscriptionNameInputPage = require('../../../pages/subscription-name-input.page.js');
var TaglineInputPage = require('../../../pages/tagline-input.page.js');
var ChannelPriceInputPage = require('../../../pages/channel-price-input.page.js');
var CreateSubscriptionPage = require('../../../pages/creators/create-subscription.page.js');

describe('create subscription form', function() {
  'use strict';

  var commonWorkflows = new CommonWorkflows();
  var testKit = new TestKit();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var subscriptionNameInputPage = new SubscriptionNameInputPage();
  var taglineInputPage = new TaglineInputPage();
  var channelPriceInputPage = new ChannelPriceInputPage();
  var page = new CreateSubscriptionPage();

  describe('happy path', function () {

    beforeEach(function() {
      // New registration required as successfully completing the form means user
      // will no longer be able to access it.
      signOutPage.signOutAndGoHome();
      registerPage.registerSuccessfully();
    });

    afterEach(function() {
      page.submitButton.click();
      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should allow a new subscription to be created', function(){
      testKit.setValue(page.nameTextBoxId, subscriptionNameInputPage.newName());
      testKit.setValue(page.taglineTextBoxId, taglineInputPage.newTagline());
      testKit.setValue(page.basePriceTextBoxId, channelPriceInputPage.newPrice());
    });

    it('should not require base price to be entered', function(){
      testKit.setValue(page.nameTextBoxId, subscriptionNameInputPage.newName());
      testKit.setValue(page.taglineTextBoxId, taglineInputPage.newTagline());
    });

    testKit.includeHappyPaths(page, subscriptionNameInputPage, 'nameTextBox', page.inputs);
    testKit.includeHappyPaths(page, taglineInputPage, 'taglineTextBox', page.inputs);
    testKit.includeHappyPaths(page, channelPriceInputPage, 'basePriceTextBox', page.inputs);
  });

  describe('sad path', function () {

    it('should run once before all', function() {
      signOutPage.signOutAndGoHome();
      registerPage.registerSuccessfully();
    });

    afterEach(function() {
      // Reset form state.
      commonWorkflows.fastRefresh();
    });

    testKit.includeSadPaths(page, page.submitButton, page.helpMessages, subscriptionNameInputPage, 'nameTextBox', page.inputs);
    testKit.includeSadPaths(page, page.submitButton, page.helpMessages, taglineInputPage, 'taglineTextBox', page.inputs);
    testKit.includeSadPaths(page, page.submitButton, page.helpMessages, channelPriceInputPage, 'basePriceTextBox', page.inputs);
  });
});
