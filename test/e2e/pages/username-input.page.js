'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var UsernameInputPage = function() {};

UsernameInputPage.prototype = Object.create({},
{
  newUsername: { value: function() {
    return 'wd_' + Date.now().toString().split('').reverse().join('');
  }},
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(input, populateOtherInputsWithValidData) {
    var self = this;

    it('should allow numbers in username', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('1' + self.newUsername());
    });

    it('should allow underscores in username', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('a_A' + self.newUsername());
    });

    it('should allow leading and trailing spaces in username', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys(' ' + self.newUsername() + ' ');
    });

    it('should allow lowercase and uppercase characters in username', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('aA' + self.newUsername());
    });
  }},
  includeSadPaths: { value: function(input, button, helpMessages, populateOtherInputsWithValidData) {
    var self = this;

    it('requires username', function(){
      input.clear();
      populateOtherInputsWithValidData();

      button.click();

      testKit.assertRequired(helpMessages, 'username');
    });

    it('should not allow spaces in username', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('a ' + self.newUsername());

      button.click();

      testKit.assertSingleValidationMessage(helpMessages,
        'Letters, numbers and underscores only.');
    });

    it('should not allow forbidden characters in username', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('a!' + self.newUsername());

      button.click();

      testKit.assertSingleValidationMessage(helpMessages,
        'Letters, numbers and underscores only.');
    });

    it('should not allow usernames with fewer than 2 characters', function(){
      input.clear();
      populateOtherInputsWithValidData();
      input.sendKeys('a');

      button.click();

      testKit.assertMinLength(helpMessages, 2);
    });

    it('should not allow usernames with over than 20 characters', function(){
      input.clear();
      var maxLength = 20;
      var overSizedValue = self.newUsername() + new Array(maxLength).join('x');

      populateOtherInputsWithValidData();
      input.sendKeys(overSizedValue);

      testKit.assertMaxLength(helpMessages, input, overSizedValue, maxLength);
    });
  }}
});

module.exports = UsernameInputPage;
