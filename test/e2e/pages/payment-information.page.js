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

    completeSuccessfully: { value: function() {
      testKit.waitForElementToDisplay(this.creditCardNumberTextBox);
      testKit.setValue(this.creditCardNumberTextBoxId, '4242424242424242');
      testKit.setValue(this.expiryTextBoxId, '12/29');
      testKit.setValue(this.cvcTextBoxId, '123');
      this.updatePaymentInformationButton.click();
      testKit.waitForElementToDisplay(this.selectFirstCountryButton);
      this.selectFirstCountryButton.click();
      testKit.waitForElementToDisplay(this.confirmTransactionButton);
      this.confirmTransactionButton.click();
    }}
  });

  module.exports = paymentInformationPage;
})();
