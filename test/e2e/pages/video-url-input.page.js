'use strict';

var TestKit = require('../test-kit.js');
var testKit = new TestKit();

var VideoUrlInputPage = function() {};

VideoUrlInputPage.prototype = Object.create({},
{
  newUsername: { value: function() {
    return 'wd_' + Date.now().toString().split('').reverse().join('');
  }},
  // All happy paths in a suite typically share the same post-condition, which can be extracted into a afterEach.
  // This is why button clicks and expectations are not set here.
  includeHappyPaths: { value: function(applyValue) {
    var self = this;

    it('should allow secure YouTube video URLs', function(){
      applyValue('https://www.youtube.com/watch?v=OnqnCoPLdyw');
    });

    it('should allow insecure YouTube video URLs', function(){
      applyValue('http://www.youtube.com/watch?v=OnqnCoPLdyw');
    });

    it('should allow secure short YouTube video URLs', function(){
      applyValue('https://youtu.be/K3p0EFtJIn8');
    });

    it('should allow insecure short YouTube video URLs', function(){
      applyValue('http://youtu.be/K3p0EFtJIn8');
    });

    it('should allow secure Vimeo video URLs', function(){
      applyValue('https://vimeo.com/37328349');
    });

    it('should allow insecure Vimeo video URLs', function(){
      applyValue('http://vimeo.com/37328349');
    });
  }},
  includeSadPaths: { value: function(inputId, button, helpMessages, isOptional) {
    var self = this;
    var errorMessage = 'YouTube and Vimeo videos only. Must start with \'http://\' or \'https://\'.';

    if(!isOptional) {
      it('requires video URL', function () {
        testKit.clear(inputId);

        button.click();

        testKit.assertRequired(helpMessages, 'video');
      });
    }

    it('should not allow video URLs with over than 100 characters', function(){
      var maxLength = 100;
      var prefix = 'https://www.youtube.com/';
      var overSizedValue = prefix + new Array((maxLength - prefix.length) + 2).join('x'); // Produces maxLength+1 chars

      testKit.setValue(inputId, overSizedValue, true);

      testKit.assertMaxLength(helpMessages, inputId, overSizedValue, maxLength);
    });

    it('should not allow invalid URLs', function(){
      testKit.setValue(inputId, 'abc');

      button.click();

      testKit.assertSingleValidationMessage(helpMessages, errorMessage);
    });

    it('should not allow unsupported URLs', function(){
      testKit.setValue(inputId, 'http://en.wikipedia.org/wiki/Lorem_ipsum');

      button.click();

      testKit.assertSingleValidationMessage(helpMessages, errorMessage);
    });
  }}
});

module.exports = VideoUrlInputPage;
