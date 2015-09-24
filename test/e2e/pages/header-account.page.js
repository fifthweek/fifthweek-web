'use strict';

var HeaderPage = require('./header.page.js');

var HeaderAccountPage = function() {};

HeaderAccountPage.prototype = Object.create(HeaderPage.prototype, {
  accountSettingsLink: { get: function () { return element(by.id('header-navigation-account-settings')); }},
  paymentLink: { get: function () { return element(by.id('header-navigation-payment')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Account Settings',
        element: this.accountSettingsLink
      },
      {
        name: 'Payment',
        element: this.paymentLink
      }
    ]);
  }}
});

module.exports = HeaderAccountPage;
