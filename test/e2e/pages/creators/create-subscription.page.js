'use strict';

var SubscriptionNameInputPage = require('../../pages/subscription-name-input.page.js');
var TaglineInputPage = require('../../pages/tagline-input.page.js');
var ChannelPriceInputPage = require('../../pages/channel-price-input.page.js');

var subscriptionNameInputPage = new SubscriptionNameInputPage();
var taglineInputPage = new TaglineInputPage();
var channelPriceInputPage = new ChannelPriceInputPage();

var CreateSubscriptionPage = function() {};

CreateSubscriptionPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/create-subscription'; }},
  nameTextBox: { get: function () { return element(by.model('newSubscriptionData.subscriptionName')); }},
  taglineTextBox: { get: function () { return element(by.model('newSubscriptionData.tagline')); }},
  basePriceTextBox: { get: function () { return element(by.id('newSubscriptionData-basePrice')); }},
  submitButton: { get: function () { return element(by.id('create-subscription-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#createSubscriptionForm .help-block')); }},
  nextPageUrl: { get: function () { return '/creators/compose/note'; }}, // Todo: replace with page object
  submitSuccessfully: { value: function() {
    var name = subscriptionNameInputPage.newName();
    var tagline = taglineInputPage.newTagline();
    var basePrice = channelPriceInputPage.newPrice();

    this.nameTextBox.sendKeys(name);
    this.taglineTextBox.sendKeys(tagline);
    this.basePriceTextBox.clear();
    this.basePriceTextBox.sendKeys(basePrice);
    this.submitButton.click();

    return {
      name: name,
      tagline: tagline,
      basePrice: basePrice
    };
  }}
});

module.exports = CreateSubscriptionPage;
