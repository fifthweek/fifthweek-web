'use strict';

var TestKit = require('../../test-kit.js');
var BlogNameInputPage = require('../blog-name-input.page.js');
var TaglineInputPage = require('../tagline-input.page.js');
var ChannelPriceInputPage = require('../channel-price-input.page.js');

var testKit = new TestKit();
var blogNameInputPage = new BlogNameInputPage();
var taglineInputPage = new TaglineInputPage();
var channelPriceInputPage = new ChannelPriceInputPage();

var CreateBlogPage = function() {};

CreateBlogPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creator/create-blog'; }},
  nameTextBoxId: { value: 'newBlogData-blogName' },
  taglineTextBoxId: { value: 'newBlogData-tagline' },
  basePriceTextBoxId: { value: 'newBlogData-basePrice' },
  inputs: { value: [
    {
      name: 'nameTextBox',
      newValue: function() { return blogNameInputPage.newName(); }
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
  submitButton: { get: function () { return element(by.id('create-blog-button')); }},
  helpMessages: { get: function () { return element.all(by.css('#createBlogForm .help-block')); }},
  nextPageUrl: { get: function () { return '/dashboard/news-feed'; }}, // Todo: replace with page object
  submitSuccessfully: { value: function() {
    var formValues = testKit.setFormValues(this, this.inputs);
    this.submitButton.click();
    browser.waitForAngular();

    return {
      name: formValues.nameTextBox,
      tagline: formValues.taglineTextBox,
      basePrice: formValues.basePriceTextBox
    };
  }}
});

module.exports = CreateBlogPage;
