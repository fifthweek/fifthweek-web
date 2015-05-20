'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var CreatorNameInputPage = function() {};

CreatorNameInputPage.prototype = Object.create({},
  {
    newUsername: { value: function() {
      return 'A Name';
    }},
    // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
    // This is why button clicks and expectations are not set here.
    includeHappyPaths: { value: function(inputId, populateOtherInputsWithValidData) {
      var self = this;

      it('should allow numbers, spaces and mixed case in name', function(){
        populateOtherInputsWithValidData();
        testKit.clear(inputId);
        testKit.setValue(inputId, '1 _aA' + self.newUsername());
      });

      it('should allow leading and trailing spaces in name', function(){
        populateOtherInputsWithValidData();
        testKit.clear(inputId);
        testKit.setValue(inputId, ' ' + self.newUsername() + ' ');
      });
    }},
    includeSadPaths: { value: function(inputId, button, helpMessages, populateOtherInputsWithValidData) {
      var self = this;

      it('requires name', function(){
        populateOtherInputsWithValidData();
        testKit.clear(inputId);

        button.click();

        testKit.assertRequired(helpMessages, 'name');
      });

      it('should not allow names with over than 25 characters', function(){
        var maxLength = 25;
        var overSizedValue = self.newUsername() + new Array(maxLength).join('x');

        populateOtherInputsWithValidData();
        testKit.setValue(inputId, overSizedValue, true);

        testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
      });
    }}
  });

module.exports = CreatorNameInputPage;
