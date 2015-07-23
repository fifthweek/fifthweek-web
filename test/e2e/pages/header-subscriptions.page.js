'use strict';

var HeaderPage = require('./header.page.js');
var HeaderReadNowPage = function() {};

HeaderReadNowPage.prototype = Object.create(HeaderPage.prototype, {
  latestPostsLink: { get: function () { return element(by.id('header-navigation-latest-posts')); }},
  manageLink: { get: function () { return element(by.id('header-navigation-manage')); }},
  paymentLink: { get: function () { return element(by.id('header-navigation-payment')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Latest Posts',
        element: this.latestPostsLink
      },
      {
        name: 'Manage',
        element: this.manageLink
      },
      {
        name: 'Payment',
        element: this.paymentLink
      }
    ]);
  }}
});

module.exports = HeaderReadNowPage;
