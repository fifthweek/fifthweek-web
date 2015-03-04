'use strict';

var ChannelEditPage = function() {};

ChannelEditPage.prototype = Object.create({}, {
  nameTextBox: { get: function () { return element(by.id('model-channel-name')); }},
  descriptionTextBox: { get: function () { return element(by.id('model-channel-description')); }},
  priceTextBox: { get: function () { return element(by.id('model-channel-price')); }},
  hiddenCheckboxSelector: { get: function () { return by.id('model-channel-hidden'); }},
  hiddenCheckbox: { get: function () { return element(this.hiddenCheckboxSelector); }},
  hiddenCheckboxCount: { get: function () { return element.all(this.hiddenCheckboxSelector).count(); }},
  saveButton: { get: function () { return element(by.id('save-channel-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  deleteButtonSelector: { get: function () { return by.id('delete-channel-link'); }},
  deleteButton: { get: function () { return element(this.deleteButtonSelector); }},
  deleteButtonCount: { get: function () { return element.all(this.deleteButtonSelector).count(); }}
});

module.exports = ChannelEditPage;
