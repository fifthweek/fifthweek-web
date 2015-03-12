'use strict';

var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');

var testKit = new TestKit();
var collectionNameInputPage = new CollectionNameInputPage();

var CollectionAddPage = function() {};

CollectionAddPage.prototype = Object.create({}, {
  nameTextBox: { get: function () { return element(by.id('model-collection-name')); }},
  channelSelectId: { get: function() { return 'model-selected-channel'; }},
  inputs: { value: function(channelNames) { return [
    {
      name: 'nameTextBox',
      newValue: function() { return collectionNameInputPage.newName(); }
    },
    {
      name: 'channelSelect',
      newValue: function() { return _.sample(channelNames); }
    }
  ]; }},
  helpMessages: { get: function () { return element.all(by.css('#createCollectionForm .help-block')); }},
  createButton: { get: function () { return element(by.id('create-collection-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  submitSuccessfully: { value: function(channelNames) {
    var formValues = testKit.setFormValues(this, this.inputs(channelNames));
    this.createButton.click();
    return {
      name: formValues.nameTextBox,
      channelName: formValues.channelSelect
    };
  }}
});

module.exports = CollectionAddPage;
