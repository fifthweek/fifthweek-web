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

  pageUrl: { get: function () { return '/creators/customize/landingpage'; }}
});

module.exports = CustomizeLandingPagePage;
