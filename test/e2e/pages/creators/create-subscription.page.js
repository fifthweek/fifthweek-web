'use strict';

var TestKit = require('../../test-kit.js');
var SubscriptionNameInputPage = require('../../pages/subscription-name-input.page.js');
var TaglineInputPage = require('../../pages/tagline-input.page.js');
var ChannelPriceInputPage = require('../../pages/channel-price-input.page.js');

var testKit = new TestKit();
var subscriptionNameInputPage = new SubscriptionNameInputPage();
var taglineInputPage = new TaglineInputPage();
var channelPriceInputPage = new ChannelPriceInputPage();

var CreateSubscriptionPage = function() {};

CreateSubscriptionPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/create-subscription'; }},
  nameTextBox: { get: function () { return element(by.model('newSubscriptionData.subscriptionName')); }},
  taglineTextBox: { get: function () { return element(by.model('newSubscriptionData.tagline')); }},
  basePriceTextBox: { get: function () { return element(by.id('newSubscriptionData-basePrice')); }},
  inputs: { value: [
    {
      name: 'nameTextBox',
      newValue: function() { return subscriptionNameInputPage.newName(); }
    },
    {
      name: 'taglineTextBox',
      newValue: function() { return taglineInputPage.newTagline(); }
    },
    {
      name: 'basePriceTextBox',
      newValue: function() { return channelPriceInputPage.newPrice(); }
    }
  ]},
  submitButton: { get: function () { return element(by.id('create-subscription-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#createSubscriptionForm .help-block')); }},
  nextPageUrl: { get: function () { return '/creators/compose/note'; }}, // Todo: replace with page object
  submitSuccessfully: { value: function() {
    var formValues = testKit.setFormValues(this, this.inputs);
    this.submitButton.click();
    browser.sleep(10000);
    return {
      name: formValues.nameTextBox,
      tagline: formValues.taglineTextBox,
      basePrice: formValues.basePriceTextBox
    };
  }}
});

module.exports = CreateSubscriptionPage;
