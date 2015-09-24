'use strict';

var TestKit = require('../../test-kit.js');
var ChannelNameInputPage = require('../channel-name-input.page.js');
var ChannelPriceInputPage = require('../channel-price-input.page.js');

var testKit = new TestKit();
var channelNameInputPage = new ChannelNameInputPage();
var channelPriceInputPage = new ChannelPriceInputPage();

var ChannelAddPage = function() {};

ChannelAddPage.prototype = Object.create({}, {
  nameTextBoxId: { value: 'model-channel-name' },
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
      name: 'priceTextBox',
      newValue: function() { return channelPriceInputPage.newPrice(); }
    },
    {
      name: 'hiddenCheckbox',
      newValue: function() { return  Math.random() > 0.5; }
    }
  ]},
  helpMessages: { get: function () { return element.all(by.css('#createChannelForm .help-block')); }},
  createButton: { get: function () { return element(by.id('create-channel-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  submitSuccessfully: { value: function(values) {
    var formValues = testKit.setFormValues(this, this.inputs, values);
    this.createButton.click();
    return {
      name: formValues.nameTextBox,
      price: formValues.priceTextBox,
      hidden: formValues.hiddenCheckbox
    };
  }}
});

module.exports = ChannelAddPage;
