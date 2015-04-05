'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var TaglineInputPage = function() {};

TaglineInputPage.prototype = Object.create({},
{
  newTagline: { value: function() {
    return 'You gotta be kitten me #' + Math.round(Math.random() * 1000);
  }},
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(applyValue) {
    var self = this;

    it('should allow taglines with 5 characters or more', function(){
      applyValue('12345');
    });

    it('should allow taglines with numbers', function(){
      applyValue('1234567890');
    });

    it('should allow taglines with trailing and leading whitespace', function(){
      applyValue(' ' + self.newTagline() + ' ');
    });
  }},
  includeSadPaths: { value: function(inputId, button, helpMessages, isOptional) {

    if(!isOptional) {
      it('requires tagline', function () {
        testKit.clear(inputId);

        button.click();

        testKit.assertRequired(helpMessages, 'tagline');
      });
    }

    it('should not allow taglines with fewer than 5 characters', function(){
      testKit.setValue(inputId, '1234');
      button.click();

      testKit.assertMinLength(helpMessages, 5);
    });

    it('should not allow taglines with over than 55 characters', function(){
      var maxLength = 55;
      var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

      testKit.setValue(inputId, overSizedValue, true);

      testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
    });
  }}
});

module.exports = TaglineInputPage;
