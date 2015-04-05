'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var DateTimePickerPage = function() {};

DateTimePickerPage.prototype = Object.create({},
  {
    restrictor: { value: '', writable: true },
    datepickerButton: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker .input-group-btn button')); }},
    datepickerPreviousMonthButton: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker button[ng-click="move(-1)"]')); }},
    datepickerNextMonthButton: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker button[ng-click="move(1)"]')); }},
    datepicker15Button: { get: function() { return element(by.cssContainingText(this.restrictor + '.fw-date-time-picker td button', '15')); }},
    todayButton: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker button[ng-click="select(\'today\')"]')); }},
    clearButton: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker button[ng-click="select(null)"]')); }},
    dateTextBox: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker input[ng-model="date"]')); }},
    timeHoursTextBox: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker input[ng-change="updateHours()"]')); }},
    timeMinutesTextBox: { get: function() { return element(by.css(this.restrictor + '.fw-date-time-picker input[ng-change="updateMinutes()"]')); }},

    // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
    // This is why button clicks and expectations are not set here.
    includeHappyPaths: { value: function(populateOtherInputsWithValidData) {
      var self = this;

      it('should allow midnight', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');
        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');
      });

      it('should allow single digits', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('4');
        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('4');
      });

      it('should allow one minute before midnight', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('23');
        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('59');
      });

      it('should allow dates in the future', function(){
        populateOtherInputsWithValidData();

        self.datepickerButton.click();
        self.datepickerNextMonthButton.click();
        self.datepicker15Button.click();
      });

      it('should allow dates in the past', function(){
        populateOtherInputsWithValidData();

        self.datepickerButton.click();
        self.datepickerPreviousMonthButton.click();
        self.datepicker15Button.click();
      });

      it('should allow the current date', function(){
        populateOtherInputsWithValidData();

        self.datepickerButton.click();
        self.todayButton.click();
      });
    }},

    includeSadPaths: { value: function(button, helpMessages, populateOtherInputsWithValidData) {
      var self = this;

      it('requires hour', function(){
        populateOtherInputsWithValidData();
        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');

        self.timeHoursTextBox.clear();

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow hours less than zero', function(){
        populateOtherInputsWithValidData();

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');

        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('-1');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow hours greater than 23', function(){
        populateOtherInputsWithValidData();

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');

        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('24');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow hours with symbols', function(){
        populateOtherInputsWithValidData();

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');

        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('.2');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow hours with letters', function(){
        populateOtherInputsWithValidData();

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');

        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('a');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('requires minute', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');

        self.timeMinutesTextBox.clear();

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow minutes less than zero', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('-1');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow minutes greater than 59', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('60');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow minutes with symbols', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('.2');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('does not allow minutes with letters', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('a');

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });

      it('requires a date', function(){
        populateOtherInputsWithValidData();
        self.timeHoursTextBox.clear();
        self.timeHoursTextBox.sendKeys('00');

        self.timeMinutesTextBox.clear();
        self.timeMinutesTextBox.sendKeys('00');

        self.datepickerButton.click();
        self.clearButton.click();

        button.click();

        testKit.assertSingleValidationMessage(helpMessages,
          'Please select a valid date and time.');
      });
    }}
  });

module.exports = DateTimePickerPage;
