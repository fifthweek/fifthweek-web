(function(){
  'use strict';

  var TestKit = require('../../../test-kit.js');
  var DateTimePickerPage = require('../../../pages/date-time-picker.page.js');

  var testKit = new TestKit();
  var dateTimePickerPage = new DateTimePickerPage();

  var composeNotePage = function() {};

  composeNotePage.prototype = Object.create({}, {

    postNowButton: { get: function() { return element(by.css('button[fw-form-submit="postNow()"]')); }},
    postLaterButton: { get: function() { return element(by.css('button[fw-form-submit="postLater()"]')); }},

    postToBacklogButton: { get: function() { return element(by.css('button[fw-form-submit="postToBacklog()"]')); }},
    cancelButton: { get: function() { return element(by.css('button[ng-click="cancelPostLater()"]')); }},

    contentTextBoxId: { value: 'model-input-note' },
    channelSelect: { get: function() { return element(by.id('model-input-selected-channel')); }},

    successMessage: { get: function(){ return element(by.css('.alert-success')); }},
    postAnotherButton: { get: function(){ return element(by.css('button[ng-click="postAnother()"]')); }},

    pageUrl: { get: function () { return '/creators/post/note'; }},

    helpMessages: { get: function () { return element.all(by.css('.help-block')); }},

    populateContent: { value: function(channelName){
      var date = new Date();
      var noteText = 'Note on ' + date.toISOString();
      testKit.setValue(this.contentTextBoxId, noteText);

      if(channelName){
        element(by.cssContainingText('#model-input-selected-channel option', channelName)).click();
      }

      return {
        noteText: noteText,
        channelName: channelName
      }
    }},

    postNow: { value: function(channelName) {
      var result = this.populateContent(channelName);

      this.postNowButton.click();

      return result;
    }},

    postOnDate: { value: function(channelName) {
      var result = this.populateContent(channelName);

      this.postLaterButton.click();

      dateTimePickerPage.datepickerButton.click();
      dateTimePickerPage.datepickerNextMonthButton.click();
      dateTimePickerPage.datepickerNextMonthButton.click();
      dateTimePickerPage.datepickerNextMonthButton.click();
      dateTimePickerPage.datepickerNextMonthButton.click();
      dateTimePickerPage.datepicker15Button.click();

      dateTimePickerPage.timeHoursTextBox.clear();
      dateTimePickerPage.timeHoursTextBox.sendKeys('13');
      dateTimePickerPage.timeMinutesTextBox.clear();
      dateTimePickerPage.timeMinutesTextBox.sendKeys('37');

      result.dayOfMonth = '15';
      result.timeOfDay = '13:17';

      this.postToBacklogButton.click();

      return result;
    }}
  });

  module.exports = composeNotePage;
})();
