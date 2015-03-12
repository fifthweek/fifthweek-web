'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var CollectionNameInputPage = function() {};

CollectionNameInputPage.prototype = Object.create({},
  {
    newName: { value: function() {
      return 'Awesomeness #' + Math.round(Math.random() * 1000);
    }},
    // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
    // This is why button clicks and expectations are not set here.
    includeHappyPaths: { value: function(applyValue) {
      var self = this;

      it('should allow collection names with 1 characters or more', function(){
        applyValue('1');
      });

      it('should allow collection names with punctuation', function(){
        applyValue(testKit.punctuation33);
      });

      it('should allow collection names with numbers', function(){
        applyValue('1234567890');
      });

      it('should allow collection names with trailing and leading whitespace', function(){
        var normalizedValue = self.newName();
        applyValue(' ' + normalizedValue + ' ', normalizedValue);
      });
    }},
    includeSadPaths: { value: function(input, button, helpMessages, isOptional) {

      if(!isOptional) {
        it('requires collection name', function () {
          input.clear();

          button.click();

          testKit.assertRequired(helpMessages, 'name');
        });
      }

      it('should not allow collection names with over than 50 characters', function(){
        input.clear();

        var maxLength = 50;
        var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

        input.sendKeys(overSizedValue);

        testKit.assertMaxLength(helpMessages, input, overSizedValue, maxLength);
      });
    }}
  });

module.exports = CollectionNameInputPage;
