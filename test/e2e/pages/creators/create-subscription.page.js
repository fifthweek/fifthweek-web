'use strict';

var RegisterPage = require('../register.page.js');

var CreateSubscriptionPage = function() {};

CreateSubscriptionPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creators/create-subscription'; }},
  nameTextBox: { get: function () { return element(by.model('newSubscriptionData.subscriptionName')); }},
  taglineTextBox: { get: function () { return element(by.model('newSubscriptionData.tagline')); }},
  basePriceTextBox: { get: function () { return element(by.model('newSubscriptionData.basePrice')); }},
  submitButton: { get: function () { return element(by.id('create-subscription-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#createSubscriptionForm .help-block')); }},
  nextPageUrl: { get: function () { return '/creators/compose/note'; }}, // Todo: replace with page object
  newName: { value: function() {
    return 'Captain Phil #' + Math.round(Math.random() * 1000);
  }},
  newTagline: { value: function() {
    return 'You gotta be kitten me #' + Math.round(Math.random() * 1000);
  }},
  newBasePrice: { value: function() {
    return (Math.random() * 10).toFixed(2);
  }},
  submitSuccessfully: { value: function() {
    var registerPage = new RegisterPage();
    registerPage.registerSuccessfully();
    var name = this.newName();
    var tagline = this.newTagline();
    var basePrice = this.newBasePrice();

    this.nameTextBox.sendKeys(name);
    this.taglineTextBox.sendKeys(tagline);
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
