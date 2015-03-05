'use strict';

var CustomizeLandingPagePage = function() {};

CustomizeLandingPagePage.prototype = Object.create({}, {
  basicsTab: { get: function() { return element(by.css('.nav-tabs li:nth-child(1)')); }},
  basicsTabLink: { get: function() { return element(by.css('.nav-tabs li:nth-child(1) a')); }},
  headerImageTab: { get: function() { return element(by.css('.nav-tabs li:nth-child(2)')); }},
  headerImageTabLink: { get: function() { return element(by.css('.nav-tabs li:nth-child(2) a')); }},
  fullDescriptionTab: { get: function() { return element(by.css('.nav-tabs li:nth-child(3)')); }},
  fullDescriptionTabLink: { get: function() { return element(by.css('.nav-tabs li:nth-child(3) a')); }},

  vanityUrl: { get: function() { return element(by.css('#vanity-url a')); }},
  subscriptionNameTextBox: { get: function () { return element(by.model('model.settings.subscriptionName')); }},
  taglineTextBox: { get: function () { return element(by.model('model.settings.tagline')); }},
  introductionTextBox: { get: function () { return element(by.model('model.settings.introduction')); }},

  headerImage: { get: function(){ return element(by.css('.available-image')); }},
  noHeaderImage: { get: function(){ return element(by.css('.blank-area')); }},
  fileInput: { get: function() { return element(by.css('#file-upload-button-area input')); }},
  fileUploadButton: { get: function() { return element(by.css('#file-upload-button-area .btn')); }},

  videoTextBox: { get: function () { return element(by.model('model.settings.video')); }},
  descriptionTextBox: { get: function () { return element(by.model('model.settings.description')); }},

  basicsSubmitButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(1) .save-changes-button')); }},
  headerImageSubmitButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(2) .save-changes-button')); }},
  fullDescriptionSubmitButton: { get: function () { return element(by.css('.tab-content .tab-pane:nth-child(3) .save-changes-button')); }},

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

  pageUrl: { get: function () { return '/creators/customize/landingpage'; }},

  setFileInput: { value: function(filePath) {
    var absolutePath = __dirname + '/' + filePath;
    console.log(absolutePath);
    this.fileInput.sendKeys(absolutePath);
  }}
});

module.exports = CustomizeLandingPagePage;
