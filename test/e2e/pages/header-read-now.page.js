'use strict';

var HeaderPage = require('./header.page.js');
var HeaderReadNowPage = function() {};

HeaderReadNowPage.prototype = Object.create(HeaderPage.prototype, {
  latestPostsLink: { get: function () { return element(by.id('header-navigation-latest-posts')); }},
  includeBasicTests: { value: function(highlightedLink) {
    this.includeBasicTestsBase(highlightedLink, [
      {
        name: 'Latest Posts',
        element: this.latestPostsLink
      }
    ]);
  }}
});

module.exports = HeaderReadNowPage;
