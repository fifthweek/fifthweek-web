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
  daySelectId: { get: function() { return 'day-of-week'; }},
  hourSelectId: { get: function() { return 'hour-of-day'; }},
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
  defaultReleaseTime: { get: function() { return { daySelect:'Monday', hourSelect: '00:00' }; } },
  releaseTimeInputs: { get: function() { return [
    {
      name: 'daySelect',
      newValue: function() { return [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ][Math.round(Math.random() * 7)]; }
    },
    {
      name: 'hourSelect',
      newValue: function() { return [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ][Math.round(Math.random() * 24)]; }
    }
  ]; }},
  helpMessages: { get: function () { return element.all(by.css('#manageCollectionForm .help-block')); }},
  expandReleaseTimesButton: { get: function () { return element(by.css('#manageReleaseTimes .btn-expand')); }},
  collapseReleaseTimesButton: { get: function () { return element(by.css('#manageReleaseTimes .btn-collapse')); }},
  releaseTimeSummaries: { get: function () { return element.all(by.css('#manageCollectionForm .release-time')); }},
  releaseTimes: { get: function () { return element.all(by.css('#release-time-list .item')); }},
  getReleaseTime: { value: function(index) { return element(by.css('#release-time-list .item:nth-child(' + (index + 1) + ')')); }},
  newReleaseTimeButton: { get: function () { return element(by.css('#manageReleaseTimes .btn-add')); }},
  addReleaseTimeButton: { get: function () { return element(by.id('add-release-time-button')); }},
  saveReleaseTimeButton: { get: function () { return element(by.id('save-release-time-button')); }},
  deleteReleaseTimeButtonSelector: { get: function () { return by.id('delete-release-time-link'); }},
  deleteReleaseTimeButton: { get: function () { return element(this.deleteReleaseTimeButtonSelector); }},
  deleteReleaseTimeButtonCount: { get: function () { return element.all(this.deleteReleaseTimeButtonSelector).count(); }},
  confirmDeleteReleaseTimeButton: { get: function () { return element(by.id('delete-item-unverified-button')); }},
  cancelReleaseTimeButton: { get: function () { return element(by.id('cancel-release-time-button')); }},
  saveButton: { get: function () { return element(by.id('save-collection-button')); }},
  cancelButton: { get: function () { return element(by.id('cancel-button')); }},
  deleteButtonSelector: { get: function () { return by.id('delete-collection-link'); }},
  deleteButton: { get: function () { return element(this.deleteButtonSelector); }},
  deleteButtonCount: { get: function () { return element.all(this.deleteButtonSelector).count(); }}
});

module.exports = CollectionEditPage;
