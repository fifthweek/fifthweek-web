'use strict';

var composeNotePage = function() {};


composeNotePage.prototype = Object.create({}, {

  postNowButton: { get: function() { return element(by.css('.btn[fw-form-submit="postNow()"]')); }},
  postLaterButton: { get: function() { return element(by.css('.btn[fw-form-submit="postLater()"]')); }},

  postToBacklogButton: { get: function() { return element(by.css('.btn[fw-form-submit="postToBacklog()"]')); }},
  cancelButton: { get: function() { return element(by.css('.btn[ng-click="cancelPostLater()"]')); }},

  contentTextBox: { get: function() { return element(by.id('model-input-note')); }},
  channelSelect: { get: function() { return element(by.id('model-input-selected-channel')); }},
  datepicker: { get: function() { return element(by.id('model-input-date')); }},

  pageUrl: { get: function () { return '/creators/compose/note'; }},

  populateContent: { value: function(channelName){
    var date = new Date();
    this.contentTextBox.clear();
    this.contentTextBox.sendKeys('Note on ' + date.toISOString());

    if(channelName){
      element(by.cssContainingText('#model-input-selected-channel option', channelName)).click();
    }
  }},

  postNoteNow: { value: function(channelName) {
    this.populateContent(channelName);

    this.postNowButton.click();
  }},

  postNoteOnDate: { value: function(channelName) {
    this.populateContent(channelName);

    this.postLaterButton.click();

    var tomorrow = new Date(new Date().getTime() + 24*60*60*1000);
    this.datepicker.clear();
    this.datepicker.sendKeys(tomorrow.toISOString());

    this.postToBacklogButton.click();
  }}
});

module.exports = composeNotePage;
