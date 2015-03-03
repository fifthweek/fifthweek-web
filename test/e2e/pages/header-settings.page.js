'use strict';

var HeaderPage = require('./header.page.js');

var HeaderSettingsPage = function() {};

HeaderSettingsPage.prototype = Object.create(HeaderPage.prototype, {
  accountSettingsLink: { get: function () { return element(by.id('navigation-account-settings')); }},
  signOutLink: { get: function () { return element(by.id('navigation-sign-out')); }}
});

module.exports = HeaderSettingsPage;
