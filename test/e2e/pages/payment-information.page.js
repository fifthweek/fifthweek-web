(function(){
  'use strict';

  var TestKit = require('../test-kit.js');
  var CommonWorkflows = require('../common-workflows.js');

  var testKit = new TestKit();
  var commonWorkflows = new CommonWorkflows();

  var paymentInformationPage = function() {};

  paymentInformationPage.prototype = Object.create({}, {

    creditCardNumberTextBoxId: { get: function () { return 'cc-number'; }},
    expiryTextBoxId: { get: function () { return 'cc-exp'; }},
    cvcTextBoxId: { get: function () { return 'cc-cvc'; }},
    creditCardNumberTextBox: { get: function(){ return element(by.id('cc-number')); }},
    expiryTextBox: { get: function(){ return element(by.id('cc-exp')); }},
    cvcTextBox: { get: function(){ return element(by.id('cc-cvc')); }},
    updatePaymentInformationButton: { get: function(){ return element(by.id('update-payment-information-button')); }},

    selectFirstCountryButton: { get: function(){ return element(by.id('select-country-0')); }},
    selectSecondCountryButton: { get: function(){ return element(by.id('select-country-1')); }},
    selectOtherCountryButton: { get: function(){ return element(by.id('select-country-other')); }},

    confirmTransactionButton: { get: function(){ return element(by.id('confirm-transaction-button')); }},
    tryAgainButton: { get: function(){ return element(by.id('try-again-button')); }},

    creditCardNumberTextBoxCount: { get: function(){ return element.all(by.id('cc-number')).count(); }},

    successNotification: { get: function(){ return element(by.id('payment-information-updated-notification')); }},

    completeSuccessfully: { value: function() {
      this.completeUpToTransactionConfirmation();
      testKit.waitForElementToDisplay(this.confirmTransactionButton);
      this.confirmTransactionButton.click();
    }},

    completeUpToTransactionConfirmation: { value: function() {
      this.completeCreditCardDetailsForm();
      testKit.waitForElementToDisplay(this.selectFirstCountryButton);
      this.selectFirstCountryButton.click();
    }},

    completeCreditCardDetailsForm: { value: function() {
      testKit.waitForElementToDisplay(this.creditCardNumberTextBox);
      testKit.setValue(this.creditCardNumberTextBoxId, '4242424242424242');
      testKit.setValue(this.expiryTextBoxId, '12/29');
      testKit.setValue(this.cvcTextBoxId, '123');
      this.updatePaymentInformationButton.click();
    }},

    completeWithInsufficientEvidence: { value: function() {
      this.completeCreditCardDetailsForm();
      testKit.waitForElementToDisplay(this.selectOtherCountryButton);
      this.selectOtherCountryButton.click();
      testKit.waitForElementToDisplay(this.tryAgainButton);
      this.tryAgainButton.click();
    }},

    expectPaymentInformationFormToBeDisplayed: { value: function() {
      testKit.waitForElementToDisplay(this.creditCardNumberTextBox);
      expect(this.creditCardNumberTextBox.isDisplayed()).toBe(true);
    }},

    expectPaymentInformationFormNotToBeDisplayed: { value: function() {
      expect(this.creditCardNumberTextBoxCount).toBe(0);
    }}
  });

  module.exports = paymentInformationPage;
})();
