'use strict';

var HeaderPage = require('./header.page.js');
var HeaderSubscribersPage = function() {};

HeaderSubscribersPage.prototype = Object.create(HeaderPage.prototype, {
  guestListLink: { get: function () { return element(by.id('header-navigation-guest-list')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Guest List',
        element: this.guestListLink
      }
    ]);
  }}
});

module.exports = HeaderSubscribersPage;
