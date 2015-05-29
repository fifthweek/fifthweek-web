(function(){
  'use strict';

  var TestKit = require('../../test-kit.js');
  var testKit = new TestKit();

  var guestListPage = function() {};

  guestListPage.prototype = Object.create({}, {

    pageUrl: { get: function () { return '/creator/subscribers/guest-list'; }},

    editGuestListButton: { get: function(){ return element(by.id('edit-guest-list-button')); }},
    createGuestListButton: { get: function(){ return element(by.id('create-guest-list-button')); }},
    saveGuestListButton: { get: function(){ return element(by.id('save-guest-list-button')); }},
    cancelEditGuestListButton: { get: function(){ return element(by.id('cancel-edit-guest-list-button')); }},

    guestListCount: { get: function(){ return element(by.id('guest-list-count')); }},
    guestListRegisteredCount: { get: function(){ return element(by.id('guest-list-registered-count')); }},
    guestListSubscribedCount: { get: function(){ return element(by.id('guest-list-subscribed-count')); }},

    guestListRows: { get: function () { return element.all(by.css('.guest-list-row')); }},
    guestListRowEmail: { value: function (rowNumber) { return element(by.css('#guest-list-row-' + rowNumber + ' td:first-child p')); }},
    invalidEmails: { get: function () { return element.all(by.css('.invalid-email')); }},

    emailsTextBoxId: { get: function(){ return 'emails-text'; }},
    emailsTextBox: { get: function(){ return element(by.id(this.emailsTextBoxId)); }},

    setNewGuestList: { value: function(emails) {
      this.createGuestListButton.click();
      testKit.setValue(this.emailsTextBoxId, emails.join('\n'));
      this.saveGuestListButton.click();
    }},

    updateGuestList: { value: function(emails) {
      this.editGuestListButton.click();
      testKit.setValue(this.emailsTextBoxId, emails.join('\n'));
      this.saveGuestListButton.click();
    }}

  });

  module.exports = guestListPage;
})();
