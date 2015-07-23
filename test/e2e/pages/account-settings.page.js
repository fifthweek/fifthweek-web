'use strict';

var path = require('path');

var AccountPage = function() {};

AccountPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/account'; }},
  fileInput: { get: function() { return element(by.css('#file-upload-button-area input')); }},
  fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},
  profileImage: { get: function(){ return element(by.css('.available-image')); }},
  noProfileImage: { get: function(){ return element(by.css('.blank-area')); }},
  emailTextBoxId: { value: 'email' },
  usernameTextBoxId: { value: 'model-accountSettings-username' },
  passwordTextBoxId: { value: 'model-password' },
  saveChangesButton: { get: function(){ return element(by.id('save-changes-button')); }},
  cancelButton: { get: function(){ return element(by.id('cancel-button')); }},
  savedSuccessfullyMessage: { get: function(){ return element(by.css('.alert-success')); }},
  helpMessages: { get: function () { return element.all(by.css('#accountSettingsForm .help-block')); }},
  setFileInput: { value: function(filePath) {
    this.fileInput.sendKeys(path.resolve(__dirname + '/' + filePath));
  }}
});

module.exports = AccountPage;
