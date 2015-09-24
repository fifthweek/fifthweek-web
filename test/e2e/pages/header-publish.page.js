'use strict';

var HeaderPage = require('./header.page.js');
var HeaderPublishPage = function() {};

HeaderPublishPage.prototype = Object.create(HeaderPage.prototype, {
  publishLink: { get: function () { return element(by.id('header-navigation-publish')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Publish',
        element: this.publishLink
      }
    ]);
  }}
});

module.exports = HeaderPublishPage;
