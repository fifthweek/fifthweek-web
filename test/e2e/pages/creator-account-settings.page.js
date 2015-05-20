'use strict';

var path = require('path');

var CreatorAccountSettingsPage = function() {};

CreatorAccountSettingsPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/creator-account'; }},
  creatorNameTextBoxId: { value: 'model-accountSettings-name' },
  creatorNameTextBox: { get: function(){ return element(by.id('model-accountSettings-name')); }},
  becomeCreatorButton: { get: function(){ return element(by.id('become-creator-button')); }},
  saveChangesButton: { get: function(){ return element(by.id('save-changes-button')); }},
  cancelButton: { get: function(){ return element(by.id('cancel-button')); }},
  savedSuccessfullyMessage: { get: function(){ return element(by.css('.alert-success')); }},
  helpMessages: { get: function () { return element.all(by.css('.help-block')); }}
});

module.exports = CreatorAccountSettingsPage;
