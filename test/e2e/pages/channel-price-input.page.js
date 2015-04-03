'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var ChannelPriceInputPage = function() {};

ChannelPriceInputPage.prototype = Object.create({},
{
  newPrice: { value: function() {
    return (Math.random() * 10).toFixed(2);
  }},
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(applyValue) {
    it('should allow prices of 1 cent or more', function() {
      applyValue('0.01');
    });
  }},
  includeSadPaths: { value: function(inputId, button, helpMessages, isOptional) {

    if(!isOptional) {
      it('requires price', function () {
        testKit.clear(inputId);

        button.click();

        testKit.assertRequired(helpMessages, 'price');
      });
    }

    it('should not allow a price of 0', function(){
      testKit.setValue(inputId, '0');

      button.click();

      testKit.assertSingleValidationMessage(helpMessages, 'Must be at least one cent.');
    });

    it('should not allow non-monetary values', function(){

      // We actually want to use sendKeys here, since the logic is at the key-press level.
      var input = element(by.id(inputId));

      testKit.clear(inputId);
      input.sendKeys('abc');
      expect(input.getAttribute('value')).toBe('');

      testKit.clear(inputId);
      input.sendKeys('123abc');
      expect(input.getAttribute('value')).toContain('123');
      expect(input.getAttribute('value')).not.toContain('abc');

      testKit.clear(inputId);
      input.sendKeys('abc123abc');
      expect(input.getAttribute('value')).toContain('123');
      expect(input.getAttribute('value')).not.toContain('abc');

      testKit.clear(inputId);
      input.sendKeys('1.2.3');
      expect(input.getAttribute('value')).toContain('1.2');
      expect(input.getAttribute('value')).not.toContain('1.2.3');
    });
  }}
});

module.exports = ChannelPriceInputPage;
