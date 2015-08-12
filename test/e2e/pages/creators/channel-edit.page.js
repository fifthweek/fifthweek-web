'use strict';

var TestKit = require('../../test-kit.js');
var ChannelNameInputPage = require('../channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../channel-description-input.page.js');
var ChannelPriceInputPage = require('../channel-price-input.page.js');

var testKit = new TestKit();
var channelNameInputPage = new ChannelNameInputPage();
var channelDescriptionInputPage = new ChannelDescriptionInputPage();
var channelPriceInputPage = new ChannelPriceInputPage();

var ChannelEditPage = function() {};

ChannelEditPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creator/channels/'; }},
  nameTextBoxId: { value: 'model-channel-name' },
  descriptionTextBoxId: { value: 'model-channel-description' },
  priceTextBoxId: { value: 'model-channel-price' },
  hiddenCheckboxSelector: { get: function () { return by.id('model-channel-hidden'); }},
  hiddenCheckbox: { get: function () { return element(this.hiddenCheckboxSelector); }},
  hiddenCheckboxCount: { get: function () { return element.all(this.hiddenCheckboxSelector).count(); }},
  inputs: { value: [
    {
      name: 'nameTextBox',
      newValue: function() { return channelNameInputPage.newName(); }
    },
    {
      name: 'descriptionTextBox',
      newValue: function() { return channelDescriptionInputPage.newDescription(); }
    },
    {
      name: 'priceTextBox',
      newValue: function() { return channelPriceInputPage.newPrice(); }
    },
    {
      name: 'hiddenCheckbox',
      newValue: function() { return  Math.random() > 0.5; }
    }
  ]},
  helpMessages: { get: function () { return element.all(by.css('#editChannelForm .help-block')); }},
  saveButton: { get: function () { return element(by.id('save-channel-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  deleteButtonSelector: { get: function () { return by.id('delete-channel-link'); }},
  deleteButton: { get: function () { return element(this.deleteButtonSelector); }},
  deleteButtonCount: { get: function () { return element.all(this.deleteButtonSelector).count(); }},
  setPrice: { value: function(price) {
    testKit.waitForElementToDisplay(element(by.id(this.priceTextBoxId)));
    testKit.setValue(this.priceTextBoxId, price);
  }}
});

module.exports = ChannelEditPage;
