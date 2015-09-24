'use strict';

var HeaderPage = require('./header.page.js');
var HeaderSubscribersPage = function() {};

HeaderSubscribersPage.prototype = Object.create(HeaderPage.prototype, {
  subscribersLink: { get: function () { return element(by.id('header-navigation-subscribers')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Subscribers',
        element: this.subscribersLink
      }
    ]);
  }}
});

module.exports = HeaderSubscribersPage;
