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
  includeSadPaths: { value: function(input, button, helpMessages, populateOtherInputsWithValidData, isOptional) {

    if(!isOptional) {
      it('requires price', function () {
        populateOtherInputsWithValidData();
        input.clear();

        button.click();

        testKit.assertRequired(helpMessages, 'price');
      });
    }

    it('should not allow a price of 0', function(){
      populateOtherInputsWithValidData();
      input.clear();
      input.sendKeys('0');

      button.click();

      testKit.assertSingleValidationMessage(helpMessages, 'Must be at least one cent.');
    });

    it('should not allow non-monetary values', function(){
      populateOtherInputsWithValidData();

      input.clear();
      input.sendKeys('abc');
      expect(input.getAttribute('value')).toBe('');

      input.clear();
      input.sendKeys('123abc');
      expect(input.getAttribute('value')).toBe('123');

      input.clear();
      input.sendKeys('abc123abc');
      expect(input.getAttribute('value')).toBe('123');

      input.clear();
      input.sendKeys('1.2.3');
      expect(input.getAttribute('value')).toBe('1.23');
    });
  }}
});

module.exports = ChannelPriceInputPage;
