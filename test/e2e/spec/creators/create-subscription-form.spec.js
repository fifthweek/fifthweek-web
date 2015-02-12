var TestKit = require('../../test-kit.js');
var RegisterPage = require('../../pages/register.page.js');
var SignOutPage = require('../../pages/sign-out.page.js');
var CreateSubscriptionPage = require('../../pages/creators/create-subscription.page.js');

describe('create subscription form', function() {
  'use strict';

  var testKit = new TestKit();
  var signOutPage = new SignOutPage();
  var registerPage = new RegisterPage();
  var page = new CreateSubscriptionPage();

  beforeEach(function() {
    signOutPage.signOutAndGoHome();
    registerPage.registerSuccessfully();
  });

  describe('happy path', function () {

    afterEach(function() {
      page.submitButton.click();
      expect(browser.getCurrentUrl()).toContain(page.nextPageUrl);
    });

    it('should allow a new subscription to be created', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should not require base price to be entered', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());
    });

    it('should allow subscription names with 1 characters or more', function(){
      page.nameTextBox.sendKeys('1');
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow taglines with 5 characters or more', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys('12345');
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow base prices of 1 cent or more', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('0.01');
    });

    it('should allow subscription names with punctuation (1 of 2)', function(){
      page.nameTextBox.sendKeys(testKit.punctuation33.substring(0, 20));
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow subscription names with punctuation (2 of 2)', function(){
      page.nameTextBox.sendKeys(testKit.punctuation33.substring(20));
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow subscription names with numbers', function(){
      page.nameTextBox.sendKeys('1234567890');
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow taglines with numbers', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys('1234567890');
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow subscription names with trailing and leading whitespace', function(){
      page.nameTextBox.sendKeys(' ' + page.newName() + ' ');
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });

    it('should allow taglines with trailing and leading whitespace', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(' ' + page.newTagline() + ' ');
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
    });
  });

  describe('sad path', function () {

    it('requires subscription name', function(){
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
      page.submitButton.click();

      testKit.assertRequired(page.helpMessages, 'name');
    });

    it('requires tagline', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
      page.submitButton.click();

      testKit.assertRequired(page.helpMessages, 'tagline');
    });

    it('requires base price', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.submitButton.click();

      testKit.assertRequired(page.helpMessages, 'price');
    });

    it('should not allow taglines with fewer than 5 characters', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys('1234');
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());
      page.submitButton.click();

      testKit.assertMinLength(page.helpMessages, 5);
    });

    it('should not allow subscription names with over than 25 characters', function(){
      var maxLength = 25;
      var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

      page.nameTextBox.sendKeys(overSizedValue);
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());

      testKit.assertMaxLength(page.helpMessages, page.nameTextBox, overSizedValue, maxLength);
    });

    it('should not allow taglines with over than 55 characters', function(){
      var maxLength = 55;
      var overSizedValue = new Array(maxLength + 2).join('x'); // Produces maxLength+1 chars

      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(overSizedValue);
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys(page.newBasePrice());

      testKit.assertMaxLength(page.helpMessages, page.taglineTextBox, overSizedValue, maxLength);
    });

    it('should not allow a base price of 0', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('0');
      page.submitButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages, 'Must be at least one cent.');
    });

    it('should not allow a base price of 0', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());
      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('0');
      page.submitButton.click();

      testKit.assertSingleValidationMessage(page.helpMessages, 'Must be at least one cent.');
    });

    it('should not allow non-monetary values', function(){
      page.nameTextBox.sendKeys(page.newName());
      page.taglineTextBox.sendKeys(page.newTagline());

      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('abc');
      expect(page.basePriceTextBox.getAttribute('value')).toBe('');

      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('123abc');
      expect(page.basePriceTextBox.getAttribute('value')).toBe('123');

      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('abc123abc');
      expect(page.basePriceTextBox.getAttribute('value')).toBe('123');

      page.basePriceTextBox.clear();
      page.basePriceTextBox.sendKeys('1.2.3');
      expect(page.basePriceTextBox.getAttribute('value')).toBe('1.23');
    });
  });
});
