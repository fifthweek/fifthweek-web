'use strict';

var path = require('path');

var BecomeCreatorPage = function() {};

BecomeCreatorPage.prototype = Object.create({}, {
  pageUrl: { get: function () { return '/user/publish'; }},
  becomeCreatorButton: { get: function(){ return element(by.id('become-creator-button')); }},
  saveChangesButton: { get: function(){ return element(by.id('save-changes-button')); }},
  submitSuccessfully: { value: function() {
    this.becomeCreatorButton.click();
    browser.waitForAngular();
  }}
});

module.exports = BecomeCreatorPage;
