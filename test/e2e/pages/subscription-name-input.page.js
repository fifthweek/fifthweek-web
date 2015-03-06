'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var SubscriptionNameInputPage = function() {};

SubscriptionNameInputPage.prototype = Object.create({},
{
  newName: { value: function() {
    return 'Captain Phil #' + Math.round(Math.random() * 1000);
  }},
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(applyValue) {
    var self = this;

    it('should allow subscription names with 1 characters or more', function(){
      applyValue('1');
    });

    it('should allow subscription names with punctuation (1 of 2)', function(){
      applyValue(testKit.punctuation33.substring(0, 20));
    });

    it('should allow subscription names with punctuation (2 of 2)', function(){
      applyValue(testKit.punctuation33.substring(20));
    });

    it('should allow subscription names with numbers', function(){
      applyValue('1234567890');
    });

    it('should allow subscription names with trailing and leading whitespace', function(){
      applyValue(' ' + self.newName() + ' ');
    });
  }},
  includeSadPaths: { value: function(input, button, helpMessages, isOptional) {

    if(!isOptional) {
      it('requires subscription name', function () {
        input.clear();

        button.click();

        testKit.assertRequired(helpMessages, 'name');
      });
    }

    it('should not allow subscription names with over than 25 characters', function(){
      input.clear();

      var maxLength = 25;
      var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

      input.sendKeys(overSizedValue);

      testKit.assertMaxLength(helpMessages, input, overSizedValue, maxLength);
    });
  }}
});

module.exports = SubscriptionNameInputPage;
