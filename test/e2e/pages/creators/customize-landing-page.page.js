'use strict';

var path = require('path');
var TestKit = require('../../test-kit.js');

var testKit = new TestKit();

var CustomizeLandingPagePage = function() {};

CustomizeLandingPagePage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/profile/edit'; }},

  newFullDescription: { value: function() {
    return 'Full Description #' + Math.round(Math.random() * 100000);
  }},

  vanityUrl: { get: function() { return element(by.css('#vanity-url a')); }},
  nameTextBoxId: { value: 'model-settings-name' },
  introductionTextBoxId: { value: 'model-settings-introduction' },

  headerImage: { get: function(){ return element(by.css('.available-image')); }},
  noHeaderImage: { get: function(){ return element(by.css('.blank-area')); }},
  fileInput: { get: function(){ return element(by.id('file-upload-button-input')); }},
  fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

  videoTextBoxId: { value: 'video' },
  descriptionTextBoxSelector: { value: '#description .st-text-block' },

  submitButton: { get: function () { return element(by.css('.save-changes-button')); }},
  disabledSubmitButton: { get: function () { return element(by.css('.save-changes-button[disabled="disabled"]')); }},
  cancelButton: { get: function () { return element(by.css('.form-cancel-button')); }},
  successMessage: { get: function () { return element(by.css('.alert-success')); }},
  invalidMessage: { get: function () { return element(by.css('.form-invalid-message')); }},

  errorMessage: { get: function () { return element(by.css('.form-message')); }},

  helpMessages: { get: function () { return element.all(by.css('#customizeLandingPageForm .help-block')); }},

  setFileInput: { value: function(filePath) {
    this.fileInput.sendKeys(path.resolve(__dirname + '/' + filePath));
  }}
});

module.exports = CustomizeLandingPagePage;
