(function(){
  'use strict';

  var signInWorkflowPage = function() {};

  signInWorkflowPage.prototype = Object.create({}, {

    messageTextBoxId: { get: function () { return 'model-input-message'; }},
    registerButton: { get: function(){ return element(by.id('register-button')); }},

    cancelButton: { get: function(){ return element(by.id('modal-cross-button')); }},

    dismissButton: { get: function(){ return element(by.id('dismiss-button')); }},

    helpMessages: { get: function () { return element.all(by.css('.modal-content .help-block')); }},
    registerFormMessage: { get: function () { return element(by.id('register-message')); }},

    expectNotDisplayed: { value: function(){
      expect(element.all(by.id('register-button')).count()).toBe(0);
      expect(element.all(by.id('dismiss-button')).count()).toBe(0);
    }},

    expectRegisterDisplayed: { value: function(){
      expect(this.registerButton.isDisplayed()).toBe(true);
    }},

    expectThankYouMessageDisplayed: { value: function(){
      expect(this.dismissButton.isDisplayed()).toBe(true);
    }}
  });

  module.exports = signInWorkflowPage;
})();
