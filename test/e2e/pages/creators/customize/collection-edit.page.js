'use strict';

var _ = require('lodash');
var TestKit = require('../../../test-kit.js');
var CollectionNameInputPage = require('../../../pages/collection-name-input.page.js');

var testKit = new TestKit();
var collectionNameInputPage = new CollectionNameInputPage();

var CollectionEditPage = function() {};

CollectionEditPage.prototype = Object.create({}, {
  nameTextBox: { get: function () { return element(by.id('model-name')); }},
  channelSelectId: { get: function() { return 'model-selected-channel'; }},
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
  helpMessages: { get: function () { return element.all(by.css('#manageCollectionForm .help-block')); }},
  saveButton: { get: function () { return element(by.id('save-collection-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  deleteButtonSelector: { get: function () { return by.id('delete-collection-link'); }},
  deleteButton: { get: function () { return element(this.deleteButtonSelector); }},
  deleteButtonCount: { get: function () { return element.all(this.deleteButtonSelector).count(); }}
});

module.exports = CollectionEditPage;
