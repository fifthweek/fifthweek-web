'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var ChannelNameInputPage = function() {};

ChannelNameInputPage.prototype = Object.create({},
  {
    newName: { value: function() {
      return 'Channel ' + Math.round(Math.random() * 100000);
    }},
    // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
    // This is why button clicks and expectations are not set here.
    includeHappyPaths: { value: function(applyValue) {
      var self = this;

      it('should allow channel names with 1 characters or more', function(){
        applyValue('1');
      });

      it('should allow channel names with punctuation', function(){
        applyValue(testKit.punctuation33);
      });

      it('should allow channel names with numbers', function(){
        applyValue('1234567890');
      });

      it('should allow channel names with trailing and leading whitespace', function(){
        var normalizedValue = self.newName();
        applyValue(' ' + normalizedValue + ' ', normalizedValue);
      });
    }},
    includeSadPaths: { value: function(inputId, button, helpMessages, isOptional) {

      if(!isOptional) {
        it('requires channel name', function () {
          testKit.clear(inputId);

          button.click();

          testKit.assertRequired(helpMessages, 'name');
        });
      }

      it('should not allow channel names with over than 50 characters', function(){
        var maxLength = 50;
        var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

        testKit.setValue(inputId, overSizedValue, true);

        testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
      });
    }}
  });

module.exports = ChannelNameInputPage;
