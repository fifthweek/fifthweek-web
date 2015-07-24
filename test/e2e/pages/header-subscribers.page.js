'use strict';

var HeaderPage = require('./header.page.js');
var HeaderSubscribersPage = function() {};

HeaderSubscribersPage.prototype = Object.create(HeaderPage.prototype, {
  allLink: { get: function () { return element(by.id('header-navigation-all')); }},
  guestListLink: { get: function () { return element(by.id('header-navigation-guest-list')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'All',
        element: this.allLink
      },
      {
        name: 'Guest List',
        element: this.guestListLink
      }
    ]);
  }}
});

module.exports = HeaderSubscribersPage;
