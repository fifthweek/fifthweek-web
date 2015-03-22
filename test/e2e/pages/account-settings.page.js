'use strict';

var AccountPage = function() {};

AccountPage.prototype = Object.create({}, {
  fileInput: { get: function() { return element(by.css('#file-upload-button-area input')); }},
  fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},
  profileImage: { get: function(){ return element(by.css('.available-image')); }},
  noProfileImage: { get: function(){ return element(by.css('.blank-area')); }},
  emailTextBox: { get: function(){ return element(by.model('model.accountSettings.email')); }},
  usernameTextBox: { get: function(){ return element(by.id('model-accountSettings-username')); }},
  passwordTextBox: { get: function(){ return element(by.id('model-password')); }},
  saveChangesButton: { get: function(){ return element(by.id('save-changes-button')); }},
  savedSuccessfullyMessage: { get: function(){ return element(by.css('.alert-success')); }},
  helpMessages: { get: function () { return element.all(by.css('#accountSettingsForm .help-block')); }},
  setFileInput: { value: function(filePath) {
    var absolutePath = __dirname + '/' + filePath;
    console.log(absolutePath);
    this.fileInput.sendKeys(absolutePath);
  }}
});

module.exports = AccountPage;
