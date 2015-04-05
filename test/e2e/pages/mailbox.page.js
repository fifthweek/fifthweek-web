'use strict';

var MailboxPage = function() {};

MailboxPage.prototype = Object.create({},
{
  mailboxEmpty: { get: function () { return element(by.id('mailbox-empty')); }},
  emailSubject: { get: function () { return element(by.id('email-subject')); }},
  emailBody: { get: function () { return element(by.id('email-body')); }},
  getMailboxUrl: { value: function(username) {
    return browser.executeAsyncScript(function(callback) {
      callback(window.configuredApiBaseUri);
    }).then(function (configuredApiBaseUri) {
      return configuredApiBaseUri + 'testMailboxes/' + username;
    });
  }}
});

module.exports = MailboxPage;
