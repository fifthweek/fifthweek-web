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
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('123456');
    });
  }},
  includeSadPaths: { value: function(input, button, helpMessages, populateOtherInputsWithValidData, isOptional) {

    if(!isOptional) {
      it('requires password', function () {
        input.clear();
        populateOtherInputsWithValidData();

        button.click();

        testKit.assertRequired(helpMessages, 'password');
      });
    }

    it('should not allow passwords with fewer than 6 characters', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('pass');

      button.click();

      testKit.assertMinLength(helpMessages, 6);
    });
  }}
});

module.exports = PasswordInputPage;
