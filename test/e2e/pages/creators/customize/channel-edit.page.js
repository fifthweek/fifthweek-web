'use strict';

var ChannelNameInputPage = require('../../../pages/channel-name-input.page.js');
var ChannelDescriptionInputPage = require('../../../pages/channel-description-input.page.js');
var ChannelPriceInputPage = require('../../../pages/channel-price-input.page.js');

var channelNameInputPage = new ChannelNameInputPage();
var channelDescriptionInputPage = new ChannelDescriptionInputPage();
var channelPriceInputPage = new ChannelPriceInputPage();

var ChannelEditPage = function() {};

ChannelEditPage.prototype = Object.create({}, {
  nameTextBox: { get: function () { return element(by.id('model-channel-name')); }},
  descriptionTextBox: { get: function () { return element(by.id('model-channel-description')); }},
  priceTextBox: { get: function () { return element(by.id('model-channel-price')); }},
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
  saveButton: { get: function () { return element(by.id('save-channel-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  deleteButtonSelector: { get: function () { return by.id('delete-channel-link'); }},
  deleteButton: { get: function () { return element(this.deleteButtonSelector); }},
  deleteButtonCount: { get: function () { return element.all(this.deleteButtonSelector).count(); }}
});

module.exports = ChannelEditPage;
