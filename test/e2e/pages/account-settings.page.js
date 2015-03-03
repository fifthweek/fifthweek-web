'use strict';

var AccountPage = function() {};

AccountPage.prototype = Object.create({}, {
  fileInput: { get: function() { return element(by.css('.file-upload-button-area input')); }},
  profileImage: { get: function(){ return element(by.css('.available-image')); }},
  emailTextBox: { get: function(){ return element(by.model('model.accountSettings.email')); }},
  usernameTextBox: { get: function(){ return element(by.model('model.accountSettings.username')); }},
  passwordTextBox: { get: function(){ return element(by.model('model.password')); }},
  saveChangesButton: { get: function(){ return element(by.id('save-changes-button')); }},
  setFileInput: { value: function(filePath) {
    var absolutePath = path.resolve(__dirname, filePath);
    this.fileInput.sendKeys(absolutePath);
  }}
});

module.exports = AccountPage;
