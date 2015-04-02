'use strict';

var HeaderPage = require('./header.page.js');
var HeaderCollectionsPage = function() {};

HeaderCollectionsPage.prototype = Object.create(HeaderPage.prototype, {
  collectionsLink: { get: function () { return element(by.id('navigation-collections')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Collections',
        element: this.collectionsLink
      }
    ]);
  }}
});

module.exports = HeaderCollectionsPage;
