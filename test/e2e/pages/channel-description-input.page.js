'use strict';

var _ = require('lodash');
var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var ChannelDescriptionInputPage = function() {};

ChannelDescriptionInputPage.prototype = Object.create({},
  {
    newDescriptionLine: { value: function() {
      return 'Cool stuff #' + Math.round(Math.random() * 1000);
    }},
    newDescription: { value: function() {
      var lineCount = Math.round((Math.random() * 5) + 1);
      var lines = _.times(lineCount, function() {
        return this.newDescriptionLine();
      }, this);

      return _.reduce(lines, function(description, line) {
        return description + '\n' + line;
      });
    }},
    // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
    // This is why button clicks and expectations are not set here.
    includeHappyPaths: { value: function(applyValue) {
      var self = this;

      it('should allow channel descriptions with 1 characters or more', function(){
        applyValue('1');
      });

      it('should allow channel descriptions with punctuation', function(){
        applyValue(testKit.punctuation33);
      });

      it('should allow channel descriptions with numbers', function(){
        applyValue('1234567890');
      });

      it('should allow channel descriptions with new lines', function(){
        applyValue(self.newDescriptionLine() + '\n' + self.newDescriptionLine());
      });

      it('should allow channel descriptions with trailing and leading whitespace', function(){
        var normalizedValue = self.newDescription();
        applyValue(' ' + normalizedValue + ' ', normalizedValue);
      });
    }},
    includeSadPaths: { value: function(input, button, helpMessages, isOptional) {

      if(!isOptional) {
        it('requires channel description', function () {
          input.clear();

          button.click();

          testKit.assertRequired(helpMessages, 'description');
        });
      }

      it('should not allow channel descriptions with over than 250 characters', function(){
        input.clear();

        var maxLength = 250;
        var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

        input.sendKeys(overSizedValue);

        testKit.assertMaxLength(helpMessages, input, overSizedValue, maxLength);
      });
    }}
  });

module.exports = ChannelDescriptionInputPage;
