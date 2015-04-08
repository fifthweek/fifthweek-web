'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var BlogNameInputPage = function() {};

BlogNameInputPage.prototype = Object.create({},
{
  newName: { value: function() {
    return 'Captain Phil #' + Math.round(Math.random() * 1000);
  }},
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(applyValue) {
    var self = this;

    it('should allow blog names with 1 characters or more', function(){
      applyValue('1');
    });

    it('should allow blog names with punctuation (1 of 2)', function(){
      applyValue(testKit.punctuation33.substring(0, 20));
    });

    it('should allow blog names with punctuation (2 of 2)', function(){
      applyValue(testKit.punctuation33.substring(20));
    });

    it('should allow blog names with numbers', function(){
      applyValue('1234567890');
    });

    it('should allow blog names with trailing and leading whitespace', function(){
      applyValue(' ' + self.newName() + ' ');
    });
  }},
  includeSadPaths: { value: function(inputId, button, helpMessages, isOptional) {

    if(!isOptional) {
      it('requires blog name', function () {
        testKit.clear(inputId);

        button.click();

        testKit.assertRequired(helpMessages, 'name');
      });
    }

    it('should not allow blog names with over than 25 characters', function(){
      var maxLength = 25;
      var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

      testKit.setValue(inputId, overSizedValue, true);

      testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
    });
  }}
});

module.exports = BlogNameInputPage;
