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
  includeHappyPaths: { value: function(inputId, populateOtherInputsWithValidData) {
    var self = this;

    it('should allow numbers in username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, '1' + self.newUsername());
    });

    it('should allow underscores in username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, 'a_A' + self.newUsername());
    });

    it('should allow leading and trailing spaces in username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, ' ' + self.newUsername() + ' ');
    });

    it('should allow lowercase and uppercase characters in username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, 'aA' + self.newUsername());
    });
  }},
  includeSadPaths: { value: function(inputId, button, helpMessages, populateOtherInputsWithValidData) {
    var self = this;

    it('requires username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);

      button.click();

      testKit.assertRequired(helpMessages, 'username');
    });

    it('should not allow spaces in username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, 'a ' + self.newUsername());

      button.click();

      testKit.assertSingleValidationMessage(helpMessages,
        'Letters, numbers and underscores only.');
    });

    it('should not allow forbidden characters in username', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, 'a!' + self.newUsername());

      button.click();

      testKit.assertSingleValidationMessage(helpMessages,
        'Letters, numbers and underscores only.');
    });

    it('should not allow usernames with fewer than 2 characters', function(){
      populateOtherInputsWithValidData();
      testKit.clear(inputId);
      testKit.setValue(inputId, 'a');

      button.click();

      testKit.assertMinLength(helpMessages, 2);
    });

    it('should not allow usernames with over than 20 characters', function(){
      var maxLength = 20;
      var overSizedValue = self.newUsername() + new Array(maxLength).join('x');

      populateOtherInputsWithValidData();
      testKit.setValue(inputId, overSizedValue, true);

      testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
    });
  }}
});

module.exports = UsernameInputPage;
