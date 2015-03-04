var TestKit = require('../../test-kit.js');
var RegisterPage = require('../../pages/register.page.js');
var SignOutPage = require('../../pages/sign-out.page.js');
var TaglineInputPage = require('../../pages/tagline-input.page.js');
var ChannelPriceInputPage = require('../../pages/channel-price-input.page.js');
var CreateSubscriptionPage = require('../../pages/creators/create-subscription.page.js');

describe('create subscription form', function() {
  'use strict';

  var testKit = new TestKit();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
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
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    it('should not require base price to be entered', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
    });

    it('should allow subscription names with 1 characters or more', function(){
      page.nameTextBox.sendKeys('1');
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    it('should allow subscription names with punctuation (1 of 2)', function(){
      page.nameTextBox.sendKeys(testKit.punctuation33.substring(0, 20));
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    it('should allow subscription names with punctuation (2 of 2)', function(){
      page.nameTextBox.sendKeys(testKit.punctuation33.substring(20));
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    it('should allow subscription names with numbers', function(){
      page.nameTextBox.sendKeys('1234567890');
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    it('should allow subscription names with trailing and leading whitespace', function(){
      page.nameTextBox.sendKeys(' ' + page.newName() + ' ');
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    taglineInputPage.includeHappyPaths(page.taglineTextBox, function() {
      page.nameTextBox.sendKeys(page.newName());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    channelPriceInputPage.includeHappyPaths(page.basePriceTextBox, function() {
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
    });
  });

  describe('sad path', function () {

    it('should run once before all', function() {
      signOutPage.signOutAndGoHome();
      registerPage.registerSuccessfully();
    });

    afterEach(function() {
      // Reset form state.
      browser.refresh();
    });

    it('requires subscription name', function(){
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
      page.submitButton.click();

      testKit.assertRequired(page.helpMessages, 'name');
    });


    it('should not allow subscription names with over than 25 characters', function(){
      var maxLength = 25;
      var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

      page.nameTextBox.sendKeys(overSizedValue);
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());

      testKit.assertMaxLength(page.helpMessages, page.nameTextBox, overSizedValue, maxLength);
    });

    taglineInputPage.includeSadPaths(page.taglineTextBox, page.submitButton, page.helpMessages, function() {
      page.nameTextBox.sendKeys(page.newName());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(channelPriceInputPage.newPrice());
    });

    channelPriceInputPage.includeSadPaths(page.basePriceTextBox, page.submitButton, page.helpMessages, function() {
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(taglineInputPage.newTagline());
    });
  });
});
