'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var PasswordInputPage = function() {};

PasswordInputPage.prototype = Object.create({},
{
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(input, populateOtherInputsWithValidData) {
    it('should allow password with 6 characters or more', function(){
      populateOtherInputsWithValidData();
      input.clear();
      input.sendKeys('123456');
    });
  }},
  includeSadPaths: { value: function(input, button, helpMessages, populateOtherInputsWithValidData, isOptional) {

    if(!isOptional) {
      it('requires password', function () {
        populateOtherInputsWithValidData();
        input.clear();

        button.click();

        testKit.assertRequired(helpMessages, 'password');
      });
    }

    it('should not allow passwords with fewer than 6 characters', function(){
      populateOtherInputsWithValidData();
      input.clear();
      input.sendKeys('pass');

      button.click();

      testKit.assertMinLength(helpMessages, 6);
    });

    it('should not allow passwords with more than 100 characters', function(){
      var maxLength = 100;
      var overSizedValue = new Array(maxLength + 2).join('x');

      populateOtherInputsWithValidData();
      input.clear();
      input.sendKeys(overSizedValue);

      testKit.assertMaxLength(helpMessages, input, overSizedValue, maxLength);
    });
  }}
});

module.exports = PasswordInputPage;
