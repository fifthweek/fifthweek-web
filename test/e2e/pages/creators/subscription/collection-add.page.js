'use strict';

var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');
var ChannelSelectInputPage = require('../../../pages/channel-select-input.page.js');

var testKit = new TestKit();
var collectionNameInputPage = new CollectionNameInputPage();

var CollectionAddPage = function() {};

CollectionAddPage.prototype = Object.create({}, {
  nameTextBoxId: { value: 'model-collection-name' },
  channelSelectId: { get: function() { return 'model-selected-channel'; }},
  channelSelect: { get: function() { return element(by.id(this.channelSelectId)); }},
  inputs: { value: function(channelSelectTexts) { return [
    {
      name: 'nameTextBox',
      newValue: function() { return collectionNameInputPage.newName(); }
    },
    {
      name: 'channelSelect',
      newValue: function() { return _.sample(channelSelectTexts); }
    }
  ]; }},
  helpMessages: { get: function () { return element.all(by.css('#createCollectionForm .help-block')); }},
  createButton: { get: function () { return element(by.id('create-collection-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  submitSuccessfully: { value: function(channelNames) {
    var channelSelectInputPage = new ChannelSelectInputPage();
    var channelSelectTexts = channelSelectInputPage.mapToSelectTexts(channelNames);
    testKit.waitForElementToDisplay(this.channelSelect);
    var formValues = testKit.setFormValues(this, this.inputs(channelSelectTexts));
    this.createButton.click();
    return {
      name: formValues.nameTextBox,
      channelName: channelSelectInputPage.mapToChannelName(formValues.channelSelect)
    };
  }},
  submitCollectionSuccessfully: { value: function(channelName, newCollectionName) {
    var channelSelectInputPage = new ChannelSelectInputPage();
    var channelSelectText = channelSelectInputPage.mapToSelectText(channelName);
    testKit.waitForElementToDisplay(this.channelSelect);
    testKit.setFormValues(this, this.inputs(), { nameTextBox: newCollectionName, channelSelect: channelSelectText});
    this.createButton.click();
    return {
      name: newCollectionName,
      channelName: channelName
    };
  }}
});

module.exports = CollectionAddPage;
