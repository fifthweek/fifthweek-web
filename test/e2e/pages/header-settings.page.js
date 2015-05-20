'use strict';

var HeaderPage = require('./header.page.js');

var HeaderSettingsPage = function() {};

HeaderSettingsPage.prototype = Object.create(HeaderPage.prototype, {
  accountSettingsLink: { get: function () { return element(by.id('header-navigation-account-settings')); }},
  creatorAccountSettingsLink: { get: function () { return element(by.id('header-navigation-creator-settings')); }},
  signOutLink: { get: function () { return element(by.id('header-navigation-sign-out')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Account Settings',
        element: this.accountSettingsLink
      },
      {
        name: 'Creator Settings',
        element: this.creatorAccountSettingsLink
      },
      {
        name: 'Sign Out',
        element: this.signOutLink
      }
    ]);
  }}
});

module.exports = HeaderSettingsPage;
