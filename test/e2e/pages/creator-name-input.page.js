'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var CreatorNameInputPage = function() {};

var waitForElementToDisplay = function(inputId){
  testKit.waitForElementToDisplay(element(by.id(inputId)));
};

CreatorNameInputPage.prototype = Object.create({},
  {
    newName: { value: function() {
      return 'A Name' + Math.round((1 + Math.random()) * 1000000000000);
    }},
    // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
    // This is why button clicks and expectations are not set here.
    includeHappyPaths: { value: function(inputId, populateOtherInputsWithValidData) {
      var self = this;

      it('should allow numbers, spaces and mixed case in name', function(){
        waitForElementToDisplay(inputId);
        populateOtherInputsWithValidData();
        testKit.clear(inputId);
        testKit.setValue(inputId, '1 _aA' + self.newName());
      });

      it('should allow leading and trailing spaces in name', function(){
        waitForElementToDisplay(inputId);
        populateOtherInputsWithValidData();
        testKit.clear(inputId);
        testKit.setValue(inputId, ' ' + self.newName() + ' ');
      });
    }},
    includeSadPaths: { value: function(inputId, button, helpMessages, populateOtherInputsWithValidData) {
      var self = this;

      it('requires name', function(){
        waitForElementToDisplay(inputId);
        populateOtherInputsWithValidData();
        testKit.clear(inputId);

        button.click();

        testKit.assertRequired(helpMessages, 'name');
      });

      it('should not allow names with over than 25 characters', function(){
        waitForElementToDisplay(inputId);
        var maxLength = 25;
        var overSizedValue = self.newName() + new Array(maxLength).join('x');

        populateOtherInputsWithValidData();
        testKit.setValue(inputId, overSizedValue, true);

        testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
      });
    }}
  });

module.exports = CreatorNameInputPage;
