'use strict';

var composeNotePage = function() {};


composeNotePage.prototype = Object.create({}, {

  postNowButton: { get: function() { return element(by.css('button[fw-form-submit="postNow()"]')); }},
  postLaterButton: { get: function() { return element(by.css('button[fw-form-submit="postLater()"]')); }},

  postToBacklogButton: { get: function() { return element(by.css('button[fw-form-submit="postToBacklog()"]')); }},
  cancelButton: { get: function() { return element(by.css('button[ng-click="cancelPostLater()"]')); }},

  contentTextBox: { get: function() { return element(by.id('model-input-note')); }},
  channelSelect: { get: function() { return element(by.id('model-input-selected-channel')); }},

  datepickerButton: { get: function() { return element(by.css('.fw-date-time-picker .input-group-btn button')); }},
  datepickerPreviousMonthButton: { get: function() { return element(by.css('.fw-date-time-picker thead button[ng-click="move(-1)"]')); }},
  datepickerNextMonthButton: { get: function() { return element(by.css('.fw-date-time-picker thead button[ng-click="move(1)"]')); }},
  datepicker15Button: { get: function() { return element(by.cssContainingText('.fw-date-time-picker td button', '15')); }},
  timeHoursTextBox: { get: function() { return element(by.model('hours')); }},
  timeMinutesTextBox: { get: function() { return element(by.model('minutes')); }},

  successMessage: { get: function(){ return element(by.css('.alert-success')); }},
  postAnotherButton: { get: function(){ return element(by.css('button[ng-click="postAnother()"]')); }},

  pageUrl: { get: function () { return '/creators/compose/note'; }},

  helpMessages: { get: function () { return element.all(by.css('.help-block')); }},

  populateContent: { value: function(channelName){
    var date = new Date();
    this.contentTextBox.clear();
    this.contentTextBox.sendKeys('Note on ' + date.toISOString());

    if(channelName){
      element(by.cssContainingText('#model-input-selected-channel option', channelName)).click();
    }
  }},

  postNow: { value: function(channelName) {
    this.populateContent(channelName);

    this.postNowButton.click();
  }},

  postOnDate: { value: function(channelName) {
    this.populateContent(channelName);

    this.postLaterButton.click();

    this.datepickerButton.click();
    this.datepickerNextMonthButton.click();
    this.datepicker15Button.click();

    this.timeHoursTextBox.clear();
    this.timeHoursTextBox.sendKeys('13');
    this.timeMinutesTextBox.clear();
    this.timeMinutesTextBox.sendKeys('37');

    this.postToBacklogButton.click();
  }}
});

module.exports = composeNotePage;
