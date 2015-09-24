'use strict';

var HeaderPage = require('./header.page.js');
var HeaderSubscriptionsPage = function() {};

HeaderSubscriptionsPage.prototype = Object.create(HeaderPage.prototype, {
  yourSubscriptionsLink: { get: function () { return element(by.id('header-navigation-your-subscriptions')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Your Subscriptions',
        element: this.yourSubscriptionsLink
      }
    ]);
  }}
});

module.exports = HeaderSubscriptionsPage;
