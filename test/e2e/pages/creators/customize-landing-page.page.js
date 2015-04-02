'use strict';

var path = require('path');
var TestKit = require('../../test-kit.js');

var testKit = new TestKit();

var CustomizeLandingPagePage = function() {};

CustomizeLandingPagePage.prototype = Object.create({}, {
  newFullDescription: { value: function() {
    return 'Full Description #' + Math.round(Math.random() * 100000);
  }},

  basicsTab: { get: function() { return element(by.css('.nav-tabs li:nth-child(1)')); }},
  basicsTabLink: { get: function() { return element(by.css('.nav-tabs li:nth-child(1) a')); }},
  headerImageTab: { get: function() { return element(by.css('.nav-tabs li:nth-child(2)')); }},
  headerImageTabLink: { get: function() { return element(by.css('.nav-tabs li:nth-child(2) a')); }},
  fullDescriptionTab: { get: function() { return element(by.css('.nav-tabs li:nth-child(3)')); }},
  fullDescriptionTabLink: { get: function() { return element(by.css('.nav-tabs li:nth-child(3) a')); }},

  vanityUrl: { get: function() { return element(by.css('#vanity-url a')); }},
  subscriptionNameTextBoxId: { value: 'subscription-name' },
  taglineTextBoxId: { value: 'tagline' },
  introductionTextBoxId: { value: 'introduction' },

  headerImage: { get: function(){ return element(by.css('.available-image')); }},
  noHeaderImage: { get: function(){ return element(by.css('.blank-area')); }},
  fileInput: { get: function(){ return element(by.id('file-upload-button-input')); }},
  fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

  videoTextBoxId: { value: 'video' },
  descriptionTextBoxId: { value: 'description' },

  basicsSubmitButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(1) .save-changes-button')); }},
  headerImageSubmitButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(2) .save-changes-button')); }},
  fullDescriptionSubmitButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(3) .save-changes-button')); }},

  fullDescriptionCancelButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(3) .form-cancel-button')); }},

  basicsSuccessMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(1) .alert-success')); }},
  headerImageSuccessMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(2) .alert-success')); }},
  fullDescriptionSuccessMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(3) .alert-success')); }},

  basicsInvalidMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(1) .form-invalid-message')); }},
  headerImageInvalidMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(2) .form-invalid-message')); }},
  fullDescriptionInvalidMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(3) .form-invalid-message')); }},

  basicsErrorMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(1) .form-message')); }},
  headerImageErrorMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(2) .form-message')); }},
  fullDescriptionErrorMessage: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(3) .form-message')); }},

  helpMessages: { get: function () { return element.all(by.css('#customizeLandingPageForm .help-block')); }},

  pageUrl: { get: function () { return '/creators/subscription/landing-page'; }},

  setFileInput: { value: function(filePath) {
    this.fileInput.sendKeys(path.resolve(__dirname + '/' + filePath));
  }}
});

module.exports = CustomizeLandingPagePage;
